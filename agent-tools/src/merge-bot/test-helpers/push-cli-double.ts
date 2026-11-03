import { err, ok } from '@oaknational/result';

import { runMergeBotCli, type MergeBotCliInput } from '../cli.js';
import type { GitCommandResult, GitExecutor } from '../git-executor.js';
import type { PushGitReads, TokenFileStore } from '../push-git.js';
import type { PushMint } from '../push-mint.js';

/**
 * The `merge-bot push` front door's doubles, shared by its integration tests
 * (`push-cli.integration.test.ts`, `push-cli-retry.integration.test.ts`): a
 * value-returning git seam, git's reads, a mint, a token store that touches
 * no filesystem, and `runPush`, the CLI over all of them with both output
 * streams captured, an instant retry wait and a constant clock.
 */

export const TOKEN = 'sekrit-installation-token';
export const GIT_PATH = '/usr/bin/git';
export const BRANCH = 'jimcresswell/mcp-508-slice';
export const REMOTE = 'https://github.com/acme/widgets.git';
/** The commit HEAD names in these fixtures, a full SHA-1 object name. */
export const COMMIT = 'def5678def5678def5678def5678def5678def56';
const TRANSFER = `To ${REMOTE}\n   abc1234..def5678  ${COMMIT} -> ${BRANCH}\n`;

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

/** The default branch `origin` names in these fixtures: neither main nor master. */
export const DEFAULT_BRANCH = 'trunk';

export function answered(stdout: string): GitCommandResult {
  return { status: 0, signal: null, stdout, stderr: '' };
}

/** A push git accepted, its transfer output on stderr. */
const PUSHED: GitCommandResult = { status: 0, signal: null, stdout: '', stderr: TRANSFER };

/** GitHub's refusal at the ref advertisement, as git printed it on 2026-09-28, renamed to the fixture's repository. */
export const REFUSED_PUSH: GitCommandResult = {
  status: 128,
  signal: null,
  stdout: '',
  stderr:
    'remote: Permission to acme/widgets.git denied to jimbot-oakington-iii[bot].\n' +
    `fatal: unable to access '${REMOTE}/': The requested URL returned error: 403\n`,
};

/**
 * The value-returning git seam (the Result pattern) for the one call the executor makes,
 * the push, every call recorded; a non-zero exit is a RESULT, never a throw.
 * Every push gets `push`'s answer as the file-backed executor gives it to a
 * call with an output sink, which the push always passes: the output replayed
 * to the sink, none in the result.
 */
export function gitFake(push: GitCommandResult = PUSHED): {
  gitExecutor: GitExecutor;
  calls: GitCall[];
} {
  const calls: GitCall[] = [];
  const gitExecutor: GitExecutor = (file, args, options) => {
    calls.push({ file, args, cwd: options.cwd, env: options.env });
    options.onOutput?.(`${push.stdout}${push.stderr}`);
    return { ...push, stdout: '', stderr: '' };
  };
  return { gitExecutor, calls };
}

/** git's answers about HEAD and origin, each a constant. */
export function gitReads(
  answers: {
    readonly currentBranch?: GitCommandResult;
    readonly headCommit?: GitCommandResult;
    readonly originHead?: GitCommandResult;
  } = {},
): PushGitReads {
  const currentBranch = answers.currentBranch ?? answered(`${BRANCH}\n`);
  const headCommit = answers.headCommit ?? answered(`${COMMIT}\n`);
  const originHead = answers.originHead ?? answered(`refs/remotes/origin/${DEFAULT_BRANCH}\n`);
  return {
    currentBranch: () => Promise.resolve(currentBranch),
    headCommit: () => Promise.resolve(headCommit),
    // Trusted, and spelled unlike REMOTE: the push goes to the configured
    // repository's URL, never to origin's.
    originUrls: () => Promise.resolve(answered('git@github.com:acme/widgets.git\n')),
    originHead: () => Promise.resolve(originHead),
  };
}

/** The instant these fixtures run at: an hour before the minted token expires. */
export const NOW = '2026-08-06T09:00:00.000Z';
/** The expiry the fixture mint states. */
export const EXPIRES_AT = '2026-08-06T10:00:00Z';

/** A mint that answers `token` expiring at `expiresAt`, both constants. */
export function mintAnswering(token: string = TOKEN, expiresAt: string = EXPIRES_AT): PushMint {
  return () => Promise.resolve(ok({ token, expiresAt, installationId: 55 }));
}

/** A mint that fails, a constant. */
export function mintFailing(): PushMint {
  return () => Promise.resolve(err(new Error('the mint is unavailable')));
}

export const BASE_ENV = { PATH: '/usr/bin', HOME: '/test-home' } as const;

export const STORE_DIR = '/fake-secret-store/merge-bot-push-x1';

interface TokenWrite {
  readonly path: string;
  readonly content: string;
  readonly mode: number;
}

/** Records every prefix, write and removal; no filesystem is ever touched. */
export function tokenStoreFake(overrides: Partial<TokenFileStore> = {}): {
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

/** One push run: its exit, both output streams, and what the git seam and the token store received. */
interface PushRun {
  readonly exit: Promise<number>;
  readonly out: () => string;
  readonly errText: () => string;
  readonly calls: GitCall[];
  readonly prefixes: string[];
  readonly writes: TokenWrite[];
  readonly removed: string[];
}

/** `merge-bot push` over the doubles, the given ones or defaults, with both output streams captured. */
export function runPush(input: {
  readonly args?: readonly string[];
  readonly git?: ReturnType<typeof gitFake>;
  readonly reads?: PushGitReads;
  readonly mint?: PushMint;
  readonly store?: ReturnType<typeof tokenStoreFake>;
  readonly overrides?: Partial<MergeBotCliInput>;
}): PushRun {
  const out = capture();
  const errSink = capture();
  const { gitExecutor, calls } = input.git ?? gitFake();
  const { store, prefixes, writes, removed } = input.store ?? tokenStoreFake();
  const exit = runMergeBotCli({
    args: ['push', ...(input.args ?? [])],
    env: { HOME: '/test-home' },
    stdout: out.sink,
    stderr: errSink.sink,
    mintImpl: input.mint ?? mintAnswering(),
    readConfigFileImpl: () =>
      JSON.stringify({ appSlug: 'jimbot-oakington-iii', appId: '4352989', repo: 'acme/widgets' }),
    repoRoot: '/repo',
    runGitImpl: () => 'worktree /repo\n',
    sleepImpl: () => Promise.resolve(),
    nowIsoImpl: () => NOW,
    gitExecutor,
    gitPath: GIT_PATH,
    gitReads: input.reads ?? gitReads(),
    branchArgSeams: { refFormatOracle: () => true },
    baseEnv: BASE_ENV,
    tokenFiles: store,
    ...input.overrides,
  });
  return { exit, out: out.text, errText: errSink.text, calls, prefixes, writes, removed };
}

/** The executor runs only the push; the reads go through the read port. */
export function pushCall(calls: readonly GitCall[]): GitCall | undefined {
  return calls[0];
}
