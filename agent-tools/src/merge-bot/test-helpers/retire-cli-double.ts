import { err, ok, type Result } from '@oaknational/result';

import type { BranchArgSeams } from '../branch-arg.js';
import { runMergeBotCli } from '../cli.js';
import type { GithubApiFetch } from '../mint-installation-token.js';
import type { PushMint } from '../push-mint.js';
import type { CasOutcome, RetireReadings, TipState } from '../retire-decision.js';
import type { RetireGitPort } from '../retire-git-port.js';
import { mintAnswering, mintFailing } from './push-cli-double.js';

/**
 * The doubles behind the `merge-bot retire` front-door tests. git is the
 * command's own port, answered by a constant world: what origin is set to,
 * what the readings are, who uses the branch, and what each ref's
 * compare-and-swap leaves, looked up by its full name. No argv, and no call
 * is recorded. GitHub gives one constant GraphQL answer for the run. The
 * mint is a fake that fails unless a case gives it one that answers, so a
 * run that must mint nothing proves it by its outcome, never by a count.
 * Paths that need git or GitHub to change between calls run against real
 * git in the smokes.
 */

export const TOKEN = 'sekrit-retire-token';
export const BRANCH = 'feat/x';
export const MAIN_SHA = '1'.repeat(40);
/** Each name's tip is its own sha, so a report that swaps two names shows it. */
export const LOCAL_TIP = 'a'.repeat(40);
export const TRACKING_TIP = 'b'.repeat(40);
export const REMOTE_TIP = 'c'.repeat(40);
export const OTHER = 'd'.repeat(40);

export const LOCAL_REF = `refs/heads/${BRANCH}`;
export const TRACKING_REF = `refs/remotes/origin/${BRANCH}`;

const merged = (sha: string): TipState => ({ sha, onBase: true });

/** A branch merged into main, present locally and cached, absent on the remote. */
export function mergedLocally(branch: string): RetireReadings {
  return {
    branch,
    base: { name: 'main', sha: MAIN_SHA },
    local: merged(LOCAL_TIP),
    tracking: merged(TRACKING_TIP),
    remote: undefined,
    inUseBy: [],
    caseCollisions: [],
    symbolic: [],
  };
}

/** The same branch also present, and merged, on the remote. */
function mergedEverywhere(branch: string): RetireReadings {
  return { ...mergedLocally(branch), remote: merged(REMOTE_TIP) };
}

/** What git holds and answers, for one run. */
export interface GitWorld {
  readonly originUrls: Result<readonly string[], Error>;
  /** The readings of the branch. */
  readonly readings: Result<RetireReadings, Error>;
  /** The worktrees using the branch when the check is read again before the local deletes. */
  readonly inUseBy: Result<readonly string[], Error>;
  /** What a compare-and-swap of each full ref name leaves. */
  readonly swaps: ReadonlyMap<string, Result<CasOutcome, Error>>;
  readonly removeConfig: Result<undefined, Error>;
}

const DELETED: Result<CasOutcome, Error> = ok({ kind: 'deleted' });

/** The identity's repository as origin, the branch merged locally, every delete taking. */
export const LOCAL_WORLD: GitWorld = {
  originUrls: ok(['https://github.com/acme/widgets.git']),
  readings: ok(mergedLocally(BRANCH)),
  inUseBy: ok([]),
  swaps: new Map([
    [LOCAL_REF, DELETED],
    [TRACKING_REF, DELETED],
  ]),
  removeConfig: ok(undefined),
};

/** As {@link LOCAL_WORLD}, with the branch also on the remote. */
export const REMOTE_WORLD: GitWorld = {
  ...LOCAL_WORLD,
  readings: ok(mergedEverywhere(BRANCH)),
};

/** A git that fails every question: a run that reads nothing never notices it. */
export const UNREADABLE: GitWorld = {
  originUrls: err(new Error('git was read')),
  readings: err(new Error('git was read')),
  inUseBy: err(new Error('git was read')),
  swaps: new Map(),
  removeConfig: err(new Error('git was written')),
};

/** The port over a constant world. A ref the world holds no swap for answers a failure naming it. */
function portOver(world: GitWorld): RetireGitPort {
  return {
    originUrls: () => Promise.resolve(world.originUrls),
    readings: () => Promise.resolve(world.readings),
    inUseBy: () => Promise.resolve(world.inUseBy),
    deleteRef: (target) =>
      Promise.resolve(
        world.swaps.get(target.ref) ?? err(new Error(`the world holds no swap for ${target.ref}`)),
      ),
    removeBranchConfig: () => Promise.resolve(world.removeConfig),
  };
}

/** GitHub's answer to the remote-ref read: main at MAIN_SHA as the default, and the branch at `sha`. */
export function refRead(sha: string | undefined, defaultName = 'main'): unknown {
  return {
    data: {
      repository: {
        id: 'R_1',
        defaultBranchRef: { name: defaultName, target: { oid: MAIN_SHA } },
        ref: sha === undefined ? null : { target: { oid: sha } },
      },
    },
  };
}

export const GRAPHQL_ERROR: unknown = {
  errors: [{ message: 'Something went wrong while executing your query' }],
};

/** GitHub answering every call, all of them GraphQL once the mint is injected, with `graphql` at 200. */
function githubAnswering(graphql: unknown): GithubApiFetch {
  return () => Promise.resolve({ status: 200, json: () => Promise.resolve(graphql) });
}

/** A mint that answers `TOKEN`: what a run that must delete on the remote is given. */
export const MINT_ANSWERING: PushMint = mintAnswering(TOKEN);

/** A mint that fails, for the one case that reads what the command does then. */
export const MINT_FAILING: PushMint = mintFailing();

/** The mint every other run has: reaching it fails the run, so a refusal that reached it would not read as one. */
const MINT_UNREACHED: PushMint = () => Promise.resolve(err(new Error('the mint was reached')));

export interface RetireRun {
  readonly exit: number;
  readonly out: string;
  readonly err: string;
}

/** What a front-door run may vary besides argv and git's world. */
export interface RetireRunOptions {
  /** GitHub's one answer to every GraphQL call. */
  readonly graphql?: unknown;
  /** The token mint; {@link MINT_UNREACHED} unless the run must delete on the remote. */
  readonly mint?: PushMint;
  readonly readConfigFileImpl?: (path: string) => string;
  /** The `--branch` check's seams; defaults to an oracle that accepts every name. */
  readonly branchArgSeams?: BranchArgSeams;
}

const IDENTITY_CONFIG = JSON.stringify({
  appSlug: 'jimbot-oakington-iii',
  appId: '4352989',
  repo: 'acme/widgets',
});

/** Run `merge-bot retire` over the doubles. */
export async function runRetire(
  args: readonly string[],
  world: GitWorld,
  options: RetireRunOptions = {},
): Promise<RetireRun> {
  const out: string[] = [];
  const errText: string[] = [];
  const exit = await runMergeBotCli({
    args: ['retire', ...args],
    env: { HOME: '/test-home' },
    stdout: { write: (chunk: string) => out.push(chunk) > 0 },
    stderr: { write: (chunk: string) => errText.push(chunk) > 0 },
    fetchImpl: githubAnswering(options.graphql ?? {}),
    mintImpl: options.mint ?? MINT_UNREACHED,
    readConfigFileImpl: options.readConfigFileImpl ?? (() => IDENTITY_CONFIG),
    repoRoot: '/srv/repo',
    runGitImpl: () => 'worktree /srv/repo\n',
    retireGitPort: portOver(world),
    branchArgSeams: options.branchArgSeams ?? { refFormatOracle: () => true },
  });
  return { exit, out: out.join(''), err: errText.join('') };
}
