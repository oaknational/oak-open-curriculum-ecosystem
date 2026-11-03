import { describe, expect, it } from 'vitest';

import { GIT_CREDENTIAL_RESOLUTION_CHAIN } from './git-credential-chain.js';
import type { GitExecutor } from './git-executor.js';
import { pushCommit } from './push-git.js';
import {
  answered,
  BASE_ENV,
  BRANCH,
  COMMIT,
  DEFAULT_BRANCH,
  GIT_PATH,
  gitFake,
  gitReads,
  mintAnswering,
  mintFailing,
  pushCall,
  REMOTE,
  runPush,
  STORE_DIR,
  TOKEN,
  tokenStoreFake,
} from './test-helpers/push-cli-double.js';

/**
 * The `merge-bot push` front door over injected seams (mint, config, git,
 * token store): the exit map (0=pushed, 1=operational, 2=usage, 3=typed
 * refusal), the never-commit-to-main refusal as behaviour, and the credential
 * discipline — the token lives in a 0600 file inside a private directory for
 * exactly the push's duration, the child environment carries only that file's
 * PATH (`GH_PUSH_TOKEN_FILE`) for the static credential helper to read, and
 * the token itself appears in NEITHER argv nor the environment nor either
 * output stream on any path: the pre-push hook chain and every descendant it
 * spawns inherit that environment, so an env dump there must never print a
 * live write token. The pure argv contract lives in push-args.unit.test.ts.
 */

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
  it('pushes the checked-out branch: exit 0, exactly the outcome object on stdout under --json, transfer output on stderr, token in neither stream', async () => {
    const run = runPush({ args: ['--json'] });

    expect(await run.exit).toBe(0);
    expect(JSON.parse(run.out())).toEqual({ kind: 'pushed', branch: BRANCH, remote: REMOTE });
    expect(run.errText()).toContain('abc1234..def5678');
    expect(run.out()).not.toContain(TOKEN);
    expect(run.errText()).not.toContain(TOKEN);
    expect(pushCall(run.calls)?.cwd).toBe('/repo');
  });
});

describe('merge-bot push credential discipline', () => {
  it('hands git the token through neither argv nor env: a file, its path in env, removed after', async () => {
    const run = runPush({});

    expect(await run.exit).toBe(0);
    const push = pushCall(run.calls);
    const env = push?.env ?? {};
    expect(push?.file).toBe(GIT_PATH);
    expect(push?.args.join(' ')).not.toContain(TOKEN);
    // NO environment variable carries the token itself: git exports this
    // environment to the pre-push hook chain (pnpm, turbo, every test the
    // gates run), and an env dump there must never print a live write token.
    expect(Object.values(env)).not.toContain(TOKEN);
    // What the environment carries is the PATH to the token file the helper
    // reads — a path is harmless in any env dump — and the file holds the
    // minted token.
    expect(run.writes).toEqual([expect.objectContaining({ content: TOKEN })]);
    expect(Object.values(env)).toContain(run.writes.map((write) => write.path).join());
    // The base environment travels wholesale — git needs it — with the path
    // spread on top, never replacing it.
    expect(env.PATH).toBe(BASE_ENV.PATH);
    // The private directory is gone by the time the action returns.
    expect(run.removed).toEqual([STORE_DIR]);
  });

  it('lets no inherited arm of git credential-resolution chain reach the push environment', async () => {
    // Every env-sourced arm the base environment carries is given a leaky
    // askpass program, and the child environment that reaches git must carry
    // none of them. What git does with its config-sourced arms is git's.
    const inherited = Object.fromEntries(
      GIT_CREDENTIAL_RESOLUTION_CHAIN.filter((arm) => arm.source === 'env').map((arm) => [
        arm.name,
        '/usr/local/bin/leaky-askpass',
      ]),
    );
    const run = runPush({ overrides: { baseEnv: { ...BASE_ENV, ...inherited } } });

    expect(await run.exit).toBe(0);
    // Node drops undefined-valued entries at spawn, so undefined is a true
    // removal: no inherited askpass program reaches git.
    expect(Object.values(pushCall(run.calls)?.env ?? {})).not.toContain(
      '/usr/local/bin/leaky-askpass',
    );
  });

  it.each([
    { name: 'an ordinary name', branch: 'feat/example' },
    { name: 'a hostile name', branch: 'lane-$(id)`x`' },
    { name: 'a name git could read as the default branch', branch: `heads/${DEFAULT_BRANCH}` },
  ])(
    'pushes the commit HEAD named to refs/heads/<name> for $name, the name nowhere else',
    async ({ branch }) => {
      const run = runPush({ reads: gitReads({ currentBranch: answered(`${branch}\n`) }) });

      expect(await run.exit).toBe(0);
      // The name lands only as data inside the destination: never inside the
      // credential helper, never as an argument of its own. The source is the
      // commit the HEAD read answered, settled once, never HEAD itself.
      const carrying = (pushCall(run.calls)?.args ?? []).filter((arg) => arg.includes(branch));
      expect(carrying).toEqual([`${COMMIT}^{commit}:refs/heads/${branch}`]);
    },
  );

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
      pushCommit(
        { file: GIT_PATH, exec },
        {
          remote: REMOTE,
          branch: BRANCH,
          commit: COMMIT,
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
        status: 1,
        signal: null,
        stdout: '',
        stderr: '! [rejected] HEAD -> lane (non-fast-forward)\n',
      }),
      store,
    });

    expect(await run.exit).toBe(1);
    expect(run.removed).toEqual([STORE_DIR]);
  });
});

describe('merge-bot push outcomes and refusals', () => {
  it('--branch names the branch HEAD is on, pushed and reported under --json', async () => {
    const run = runPush({ args: ['--branch', BRANCH, '--json'] });

    expect(await run.exit).toBe(0);
    expect(JSON.parse(run.out())).toEqual({ kind: 'pushed', branch: BRANCH, remote: REMOTE });
  });

  it('fails without pushing when the default branch cannot be read, naming the cure', async () => {
    const run = runPush({
      reads: gitReads({ originHead: { status: 1, signal: null, stdout: '', stderr: '' } }),
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('git remote set-head origin --auto');
    expect(pushCall(run.calls)).toBeUndefined();
  });

  it.each([
    { name: 'git cannot read it', read: { status: 128, signal: null, stdout: '', stderr: '' } },
    { name: 'the answer is not an object name', read: answered('HEAD\n') },
  ])(
    'fails without pushing when the commit HEAD names cannot be settled ($name), naming the cure',
    async ({ read }) => {
      const run = runPush({ reads: gitReads({ headCommit: read }) });

      expect(await run.exit).toBe(1);
      expect(run.errText()).toContain('check out a branch with a commit');
      expect(pushCall(run.calls)).toBeUndefined();
    },
  );

  it('names the killing signal when git dies mid-run, never a bare number (F-112)', async () => {
    // The push-path F-112 instance surfaced as "git push exited -1" — a
    // signal death collapsed to a mystery number. The executor now reports
    // the signal distinctly and this command must pass it to the operator.
    const run = runPush({
      git: gitFake({ status: 128, signal: 'SIGTERM', stdout: '', stderr: '' }),
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('killed by SIGTERM');
  });

  it('refuses main by name whatever the mint would answer: exit 3, no directory, no file, no push', async () => {
    const run = runPush({
      reads: gitReads({ currentBranch: answered('main\n') }),
      mint: mintFailing(),
    });

    expect(await run.exit).toBe(3);
    expect(run.errText()).toContain('main');
    // A refusal creates no directory, writes no token file, and runs no
    // push: the refusal is the whole behaviour, not a check the push then
    // ignores.
    expect(run.prefixes).toEqual([]);
    expect(run.writes).toEqual([]);
    expect(pushCall(run.calls)).toBeUndefined();
  });

  it('reports a refusal machine-readably under --json, naming the refused branch', async () => {
    const run = runPush({ args: ['--json', '--branch', 'main'] });

    expect(await run.exit).toBe(3);
    const outcome: unknown = JSON.parse(run.out());
    expect(outcome).toMatchObject({ kind: 'refused' });
    // The reason names the refused branch, quoted inside the JSON string.
    expect(run.out()).toContain(String.raw`\"main\"`);
  });

  it('surfaces a non-zero git push as an operational failure, with git own stderr', async () => {
    const run = runPush({
      git: gitFake({
        status: 1,
        signal: null,
        stdout: '',
        stderr: '! [rejected] HEAD -> lane (non-fast-forward)\n',
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
    const run = runPush({ mint: mintAnswering('') });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toMatch(/token/u);
    expect(run.writes).toEqual([]);
    expect(pushCall(run.calls)).toBeUndefined();
  });

  it('fails as usage when the repo config authority is unreadable', async () => {
    const run = runPush({ overrides: { readConfigFileImpl: () => 'not-json' } });

    expect(await run.exit).toBe(2);
    expect(run.errText()).toContain('single authority');
  });

  it('fails as an operation, never as usage, when no trusted git can check the --branch value', async () => {
    const run = runPush({
      args: ['--branch', 'other-lane'],
      overrides: { branchArgSeams: { pathExists: () => false } },
    });

    expect(await run.exit).toBe(1);
    expect(run.errText()).toContain('No trusted git binary found');
    expect(run.calls).toEqual([]);
  });

  it('answers push --help with the usage on stdout, exit 0 — never the unknown-flag path', async () => {
    const run = runPush({ args: ['--help'] });

    expect(await run.exit).toBe(0);
    expect(run.out()).toContain('push [--branch');
  });
});
