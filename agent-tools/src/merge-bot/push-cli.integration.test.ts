import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runMergeBotCli, type MergeBotCliInput } from './cli.js';
import { GIT_CREDENTIAL_RESOLUTION_CHAIN } from './git-credential-chain.js';
import type { GitCommandResult, GitExecutor } from './git-executor.js';
import type { GithubApiFetch } from './mint-installation-token.js';
import { pushHead, type TokenFileStore } from './push-git.js';

import { generateKeyPairSync } from 'node:crypto';

/**
 * The `merge-bot push` front door over injected seams (fetch, key, config,
 * git, token store): the exit map (0=pushed, 1=operational, 2=usage, 3=typed
 * refusal), the never-commit-to-main refusal as behaviour, and the credential
 * discipline — the token lives in a 0600 file inside a private directory for
 * exactly the push's duration, the child environment carries only that file's
 * PATH (`GH_PUSH_TOKEN_FILE`) for the static credential helper to read, and
 * the token itself appears in NEITHER argv nor the environment nor either
 * output stream on any path: the pre-push hook chain and every descendant it
 * spawns inherit that environment, so an env dump there must never print a
 * live write token. The pure argv contract lives in push-args.unit.test.ts.
 */

const { privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: { type: 'spki', format: 'pem' },
  privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
});

const TOKEN = 'sekrit-installation-token';
const GIT_PATH = '/usr/bin/git';
const BRANCH = 'jimcresswell/mcp-508-slice';
const REMOTE = 'https://github.com/acme/widgets.git';
const TRANSFER = `To ${REMOTE}\n   abc1234..def5678  HEAD -> ${BRANCH}\n`;

function capture(): { text: () => string; sink: Pick<NodeJS.WriteStream, 'write'> } {
  let buffer = '';
  return {
    text: () => buffer,
    sink: {
      write(chunk: string): boolean {
        buffer += chunk;
        return true;
      },
    },
  };
}

interface GitCall {
  readonly file: string;
  readonly args: readonly string[];
  readonly cwd: string;
  readonly env: Readonly<Record<string, string | undefined>>;
}

/** Value-returning git seam (ADR-088): a non-zero exit is a RESULT, never a throw. */
function gitFake(overrides: { revParse?: GitCommandResult; push?: GitCommandResult } = {}): {
  gitExecutor: GitExecutor;
  calls: GitCall[];
} {
  const calls: GitCall[] = [];
  const gitExecutor: GitExecutor = (file, args, options) => {
    calls.push({ file, args, cwd: options.cwd, env: options.env });
    if (args[0] === 'rev-parse') {
      return overrides.revParse ?? { status: 0, signal: null, stdout: `${BRANCH}\n`, stderr: '' };
    }
    return overrides.push ?? { status: 0, signal: null, stdout: '', stderr: TRANSFER };
  };
  return { gitExecutor, calls };
}

/** Serves the mint endpoints and records every call URL and body. */
function mintFetch(token = TOKEN): {
  fetchImpl: GithubApiFetch;
  urls: string[];
  bodies: { url: string; body: string }[];
} {
  const urls: string[] = [];
  const bodies: { url: string; body: string }[] = [];
  const fetchImpl: GithubApiFetch = (url, init) => {
    urls.push(url);
    if (init?.body !== undefined) {
      bodies.push({ url, body: String(init.body) });
    }
    if (url.endsWith('/installation')) {
      return Promise.resolve({ status: 200, json: () => Promise.resolve({ id: 55 }) });
    }
    return Promise.resolve({
      status: 201,
      json: () => Promise.resolve({ token, expires_at: '2026-08-06T10:00:00Z' }),
    });
  };
  return { fetchImpl, urls, bodies };
}

const BASE_ENV = { PATH: '/usr/bin', HOME: '/test-home' } as const;

const STORE_DIR = '/fake-secret-store/merge-bot-push-x1';

interface TokenWrite {
  readonly path: string;
  readonly content: string;
  readonly mode: number;
}

/** Records every prefix, write and removal; no filesystem is ever touched. */
function tokenStoreFake(overrides: Partial<TokenFileStore> = {}): {
  store: TokenFileStore;
  prefixes: string[];
  writes: TokenWrite[];
  removed: string[];
} {
  const prefixes: string[] = [];
  const writes: TokenWrite[] = [];
  const removed: string[] = [];
  return {
    store: {
      mkdtemp: (prefix) => {
        prefixes.push(prefix);
        return STORE_DIR;
      },
      writeFile: (path, content, mode) => {
        writes.push({ path, content, mode });
      },
      remove: (dir) => {
        removed.push(dir);
      },
      ...overrides,
    },
    prefixes,
    writes,
    removed,
  };
}

function runPush(input: {
  readonly args?: readonly string[];
  readonly git?: ReturnType<typeof gitFake>;
  readonly fetch?: ReturnType<typeof mintFetch>;
  readonly store?: ReturnType<typeof tokenStoreFake>;
  readonly overrides?: Partial<MergeBotCliInput>;
}): {
  exit: Promise<number>;
  out: () => string;
  errText: () => string;
  calls: GitCall[];
  urls: string[];
  bodies: { url: string; body: string }[];
  prefixes: string[];
  writes: TokenWrite[];
  removed: string[];
} {
  const out = capture();
  const errSink = capture();
  const { gitExecutor, calls } = input.git ?? gitFake();
  const { fetchImpl, urls, bodies } = input.fetch ?? mintFetch();
  const { store, prefixes, writes, removed } = input.store ?? tokenStoreFake();
  const exit = runMergeBotCli({
    args: ['push', ...(input.args ?? [])],
    env: { HOME: '/test-home' },
    stdout: out.sink,
    stderr: errSink.sink,
    fetchImpl,
    readFileImpl: () => Promise.resolve(privateKey),
    readConfigFileImpl: () =>
      JSON.stringify({ appSlug: 'jimbot-oakington-iii', appId: '4352989', repo: 'acme/widgets' }),
    repoRoot: '/repo',
    nowEpochSeconds: () => 1_800_000_000,
    gitExecutor,
    gitPath: GIT_PATH,
    baseEnv: BASE_ENV,
    tokenFiles: store,
    ...input.overrides,
  });
  return {
    exit,
    out: out.text,
    errText: errSink.text,
    calls,
    urls,
    bodies,
    prefixes,
    writes,
    removed,
  };
}

function pushCall(calls: readonly GitCall[]): GitCall | undefined {
  return calls.find((call) => call.args.includes('push'));
}

/**
 * A library-shaped fixture that THROWS: the boundary translations under test
 * exist precisely to catch this shape (ADR-088's translate-at-the-boundary
 * arm), so describing those states needs exactly one throwing fake — this
 * one, shared by every breach test below.
 */
function throwing(message: string): () => never {
  return () => {
    throw new Error(message);
  };
}

describe('runMergeBotCli push', () => {
  it('pushes the checked-out branch: exit 0, transfer output on stderr, token in neither stream', async () => {
    const run = runPush({});

    expect(await run.exit).toBe(0);
    expect(run.out()).toContain(BRANCH);
    expect(run.errText()).toContain('abc1234..def5678');
    expect(run.out()).not.toContain(TOKEN);
    expect(run.errText()).not.toContain(TOKEN);
    expect(run.calls[0]?.args).toEqual(['rev-parse', '--abbrev-ref', 'HEAD']);
    expect(run.calls[0]?.cwd).toBe('/repo');
  });
});

describe('merge-bot push credential discipline', () => {
  it('pins the exact push call: helpers cleared, the static file-reading helper, no bypass, no credential in argv', async () => {
    const run = runPush({});

    expect(await run.exit).toBe(0);
    const push = pushCall(run.calls);
    expect(push?.file).toBe(GIT_PATH);
    // The whole call, pinned: every config-sourced arm of git's credential
    // chain cleared, then the ONE static helper literal; the remote carries
    // no credentials; the refspec is HEAD:<branch>. Nothing else is on the
    // line — no force, no --no-verify.
    expect(push?.args).toEqual([
      '-c',
      'credential.helper=',
      '-c',
      'core.askPass=',
      '-c',
      'credential.helper=!f() { echo username=x-access-token; echo "password=$(cat "$GH_PUSH_TOKEN_FILE")"; }; f',
      'push',
      REMOTE,
      `HEAD:${BRANCH}`,
    ]);
    expect(push?.args.join(' ')).not.toContain(TOKEN);
    expect(push?.args).not.toContain('--no-verify');
  });

  it('keeps the token OUT of the child environment: a 0600 file, its path in env, removed after', async () => {
    const run = runPush({});

    expect(await run.exit).toBe(0);
    const push = pushCall(run.calls);
    // NO environment variable carries the token itself: git exports this
    // environment to the pre-push hook chain (pnpm, turbo, every test the
    // gates run), and an env dump there must never print a live write token.
    const carriers = Object.entries(push?.env ?? {})
      .filter(([, value]) => value === TOKEN)
      .map(([name]) => name);
    expect(carriers).toEqual([]);
    // What the environment carries is the PATH to the 0600 token file the
    // helper reads — a path is harmless in any env dump. The product joins it
    // with host separators; the expectation derives the same host form.
    expect(push?.env.GH_PUSH_TOKEN_FILE).toBe(join(STORE_DIR, 'token'));
    expect(run.writes).toEqual([{ path: join(STORE_DIR, 'token'), content: TOKEN, mode: 0o600 }]);
    // Prompting stays disabled: an unanswered helper must fail loudly, never
    // fall back to asking the signed-in human. The fail-closed property of an
    // empty or missing token file rests entirely on this variable.
    expect(push?.env.GIT_TERMINAL_PROMPT).toBe('0');
    // The directory is requested under the named prefix at the OS temp root —
    // never inside the worktree, where a stray `git add -A` could commit it.
    expect(run.prefixes).toEqual(['merge-bot-push-']);
    // The base environment travels wholesale — git needs it — with the path
    // spread on top, never replacing it.
    expect(push?.env.PATH).toBe('/usr/bin');
    // The private directory is gone by the time the action returns.
    expect(run.removed).toEqual([STORE_DIR]);
  });

  it('closes EVERY arm of git credential-resolution chain, walked from the documented table', async () => {
    // R9: the contract belongs to git, so the whole chain is enumerated in
    // push-git.ts and walked here rather than sampled. Each arm is asserted
    // against the artefact that actually reaches git — the child environment
    // and the argv — not against the list itself.
    const inherited = Object.fromEntries(
      GIT_CREDENTIAL_RESOLUTION_CHAIN.filter((arm) => arm.source === 'env').map((arm) => [
        arm.name,
        '/usr/local/bin/leaky-askpass',
      ]),
    );
    const run = runPush({ overrides: { baseEnv: { ...BASE_ENV, ...inherited } } });

    expect(await run.exit).toBe(0);
    const push = pushCall(run.calls);
    const args = push?.args ?? [];
    const env = push?.env ?? {};
    // Node drops undefined-valued entries at spawn, so undefined is a true
    // removal: no inherited askpass program reaches git.
    const leaked = GIT_CREDENTIAL_RESOLUTION_CHAIN.filter(
      (arm) => arm.source === 'env' && env[arm.name] !== undefined,
    ).map((arm) => arm.name);
    expect(leaked).toEqual([]);
    const uncleared = GIT_CREDENTIAL_RESOLUTION_CHAIN.filter(
      (arm) => arm.source === 'config' && !args.includes(`${arm.name}=`),
    ).map((arm) => arm.name);
    expect(uncleared).toEqual([]);
    // The terminal arm, closed by its own variable rather than by removal.
    expect(env.GIT_TERMINAL_PROMPT).toBe('0');
    // Clearing must never disarm the ONE helper this command installs: the
    // helper is set AFTER the clear that would otherwise wipe it.
    const helperIndex = args.findIndex((arg) => arg.includes('x-access-token'));
    expect(helperIndex).toBeGreaterThan(args.indexOf('credential.helper='));
  });

  it('the helper literal is byte-identical even when git reports a hostile branch name — nothing is interpolated', async () => {
    const hostile = 'lane-$(id)`x`';
    const run = runPush({
      git: gitFake({ revParse: { status: 0, signal: null, stdout: `${hostile}\n`, stderr: '' } }),
    });

    expect(await run.exit).toBe(0);
    const push = pushCall(run.calls);
    expect(push?.args).toContain(
      'credential.helper=!f() { echo username=x-access-token; echo "password=$(cat "$GH_PUSH_TOKEN_FILE")"; }; f',
    );
    // The hostile name lands ONLY as data inside the refspec argv element.
    expect(push?.args.at(-1)).toBe(`HEAD:${hostile}`);
  });

  it('a token-staging failure is an operational failure: exit 1, no push, the half-staged directory removed', async () => {
    // The write fails AFTER the directory exists — the richer state: the
    // failure is translated (exit 1, an operational message, never the
    // usage path) AND the half-staged directory does not outlive it.
    const store = tokenStoreFake({ writeFile: throwing('ENOSPC: no space left on device') });
    const run = runPush({ store });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('cannot stage the push credential file');
    expect(run.errText()).not.toContain(TOKEN);
    expect(run.removed).toEqual([STORE_DIR]);
    expect(pushCall(run.calls)).toBeUndefined();
  });

  it('a cleanup failure surfaces as a warning and never changes a landed push outcome', async () => {
    const store = tokenStoreFake();
    store.store = {
      ...store.store,
      remove: (dir) => {
        store.removed.push(dir);
        throwing('EBUSY: resource busy')();
      },
    };
    const run = runPush({ store });

    // The push LANDED; a failed removal must not misreport it — the same
    // completed-mutation-misreported class the merge side guards against.
    expect(await run.exit).toBe(0);
    expect(run.out()).toContain(BRANCH);
    expect(run.errText()).toContain('not removed');
    expect(run.errText()).not.toContain(TOKEN);
  });

  it('removes the token directory even when the git seam throws in breach of its value contract', async () => {
    const store = tokenStoreFake();
    const exec: GitExecutor = throwing('seam breach');

    // The seam is awaited, so a breach surfaces as a rejection; the token
    // directory must be gone by the time it does — the `finally` runs on the
    // settled call, never on a call still in flight.
    await expect(
      pushHead(
        { file: GIT_PATH, exec },
        {
          remote: REMOTE,
          branch: BRANCH,
          cwd: '/repo',
          token: TOKEN,
          baseEnv: BASE_ENV,
          tokenFiles: store.store,
        },
      ),
    ).rejects.toThrow('seam breach');
    expect(store.removed).toEqual([STORE_DIR]);
  });

  it('removes a stale GH_PUSH_TOKEN from the base environment — the hook chain must not inherit it', async () => {
    const run = runPush({
      overrides: { baseEnv: { ...BASE_ENV, GH_PUSH_TOKEN: 'stale-old-token' } },
    });

    expect(await run.exit).toBe(0);
    const push = pushCall(run.calls);
    // The value-level check is the proof: Node drops undefined-valued env
    // entries at spawn, so no representation of the stale token survives.
    const values = Object.values(push?.env ?? {});
    expect(values).not.toContain('stale-old-token');
  });

  it('removes the token file directory even when the push itself fails', async () => {
    const store = tokenStoreFake();
    const run = runPush({
      git: gitFake({
        push: {
          status: 1,
          signal: null,
          stdout: '',
          stderr: '! [rejected] HEAD -> lane (non-fast-forward)\n',
        },
      }),
      store,
    });

    expect(await run.exit).toBe(1);
    expect(run.writes).toEqual([{ path: join(STORE_DIR, 'token'), content: TOKEN, mode: 0o600 }]);
    expect(run.removed).toEqual([STORE_DIR]);
  });
});

describe('merge-bot push outcomes and refusals', () => {
  it('mints the pull-request-work scope — a push can touch .github/workflows', async () => {
    const run = runPush({});

    expect(await run.exit).toBe(0);
    const mint = run.bodies.find((call) => call.url.endsWith('/access_tokens'));
    expect(mint).toBeDefined();
    expect(JSON.parse(mint?.body ?? '{}').permissions).toEqual({
      pull_requests: 'write',
      contents: 'write',
      workflows: 'write',
    });
  });

  it('pushes an explicitly named branch without asking git which branch HEAD is on', async () => {
    const run = runPush({ args: ['--branch', 'other-lane'] });

    expect(await run.exit).toBe(0);
    expect(run.calls.map((call) => call.args[0])).toEqual(['-c']);
    expect(pushCall(run.calls)?.args.at(-1)).toBe('HEAD:other-lane');
  });

  it('emits EXACTLY the outcome object on stdout under --json, transfer output on stderr', async () => {
    const run = runPush({ args: ['--json'] });

    expect(await run.exit).toBe(0);
    expect(JSON.parse(run.out())).toEqual({ kind: 'pushed', branch: BRANCH, remote: REMOTE });
    expect(run.errText()).toContain('abc1234..def5678');
    expect(run.out()).not.toContain(TOKEN);
  });

  it('names the killing signal when git dies mid-run, never a bare number (F-112)', async () => {
    // The push-path F-112 instance surfaced as "git push exited -1" — a
    // signal death collapsed to a mystery number. The executor now reports
    // the signal distinctly and this command must pass it to the operator.
    const run = runPush({
      git: gitFake({ push: { status: 128, signal: 'SIGTERM', stdout: '', stderr: '' } }),
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('killed by SIGTERM');
  });

  it('refuses to push the default branch by name, before minting anything', async () => {
    for (const branch of ['main', 'master']) {
      const run = runPush({
        git: gitFake({ revParse: { status: 0, signal: null, stdout: `${branch}\n`, stderr: '' } }),
      });

      expect(await run.exit).toBe(3);
      expect(run.errText()).toContain(branch);
      expect(run.errText()).toContain('pull request');
      // A refusal mints no token, creates no directory, writes no token file,
      // and runs no push: the refusal is the whole behaviour, not a check the
      // push then ignores.
      expect(run.urls).toEqual([]);
      expect(run.prefixes).toEqual([]);
      expect(run.writes).toEqual([]);
      expect(pushCall(run.calls)).toBeUndefined();
    }
  });

  it('reports the default-branch refusal machine-readably under --json', async () => {
    const run = runPush({
      args: ['--json'],
      git: gitFake({ revParse: { status: 0, signal: null, stdout: 'main\n', stderr: '' } }),
    });

    expect(await run.exit).toBe(3);
    const outcome: unknown = JSON.parse(run.out());
    expect(outcome).toMatchObject({ kind: 'refused' });
    expect(JSON.stringify(outcome)).toContain('pull request');
  });

  it('refuses a detached HEAD by naming the state, never guessing a branch', async () => {
    const run = runPush({
      git: gitFake({ revParse: { status: 0, signal: null, stdout: 'HEAD\n', stderr: '' } }),
    });

    expect(await run.exit).toBe(3);
    expect(run.errText()).toContain('detached');
    expect(run.urls).toEqual([]);
    expect(run.writes).toEqual([]);
    expect(pushCall(run.calls)).toBeUndefined();
  });

  it('refuses an explicitly named default branch too — the guard is on the target', async () => {
    const run = runPush({ args: ['--branch', 'main'] });

    expect(await run.exit).toBe(3);
    expect(run.errText()).toContain('pull request');
    expect(pushCall(run.calls)).toBeUndefined();
  });

  it('surfaces a non-zero git push as an operational failure, with git own stderr', async () => {
    const run = runPush({
      git: gitFake({
        push: {
          status: 1,
          signal: null,
          stdout: '',
          stderr: '! [rejected] HEAD -> lane (non-fast-forward)\n',
        },
      }),
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('non-fast-forward');
    expect(run.out()).not.toContain(TOKEN);
    expect(run.errText()).not.toContain(TOKEN);
  });

  it('never lets an EMPTY token reach git — the run fails first', async () => {
    // An empty token file would make the helper emit an empty password and
    // git fall back to prompting: the signed-in human, under the bot's name.
    // The state pinned here is that no push runs; which of the two guards
    // fires (the mint's own schema, or the point-of-use backstop in
    // push-cli.ts) is an implementation detail.
    const run = runPush({ fetch: mintFetch('') });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toMatch(/token/u);
    expect(run.writes).toEqual([]);
    expect(pushCall(run.calls)).toBeUndefined();
  });

  it('surfaces an unreadable current branch as an operational failure', async () => {
    const run = runPush({
      git: gitFake({
        revParse: {
          status: 128,
          signal: null,
          stdout: '',
          stderr: 'fatal: not a git repository\n',
        },
      }),
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('not a git repository');
    expect(run.urls).toEqual([]);
  });

  it('fails as usage when the repo config authority is unreadable', async () => {
    const run = runPush({ overrides: { readConfigFileImpl: () => 'not-json' } });

    expect(await run.exit).toBe(2);
    expect(run.errText()).toContain('single authority');
    expect(run.calls).toEqual([]);
  });

  it('answers push --help with the usage on stdout, exit 0 — never the unknown-flag path', async () => {
    const run = runPush({ args: ['--help'] });

    expect(await run.exit).toBe(0);
    expect(run.out()).toContain('push [--branch');
    expect(run.calls).toEqual([]);
    expect(run.urls).toEqual([]);
  });

  it('documents the push action in the topic usage text', async () => {
    const out = capture();
    const errSink = capture();
    const exit = runMergeBotCli({
      args: ['--help'],
      env: {},
      stdout: out.sink,
      stderr: errSink.sink,
    });

    expect(await exit).toBe(0);
    expect(out.text()).toContain('push [--branch');
    // The absence of a bypass is part of the published contract, not a
    // private implementation choice.
    expect(out.text()).toContain('no force flag');
  });
});
