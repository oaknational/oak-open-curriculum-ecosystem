import { err, ok, type Result } from '@oaknational/result';

import {
  GH_EXEC_OPTIONS,
  parseGhJson,
  resolveGhPath,
  type GhCommandExecutor,
  type PathExistsCheck,
  type PrTarget,
} from '../pr-watch/gh.js';
import type { CheckRunReading, FoldClockReading } from './fold-clock.js';
import { isBranchName } from '../pr-watch/required-checks.js';
import {
  assembleReading,
  parseCheckRuns,
  parseCommitStatus,
  parsePull,
  parseRequiredChecksPages,
  parseTimeline,
  type PullReading,
} from './fold-clock-reading.js';

/**
 * The fold clock's `gh` seam: four read-only REST surfaces, each an argv the
 * tests pin (the vendor call shapes, verified live on pull request 326,
 * 2026-10-10), run through the injected executor so the caller decides the
 * credential — the CLI hands in the keyring-pinned read executor the merge
 * bot's reads use, never an ambient token. `gh` substitutes `{owner}/{repo}`
 * from the current repository when the target names none.
 */

export interface FoldClockSource {
  readonly target: PrTarget;
  /** The successor branch's pushed tip, validated hex by the caller. */
  readonly successorSha?: string;
  readonly ghPath?: string;
  readonly exists?: PathExistsCheck;
  readonly execFileSync: GhCommandExecutor;
}

const PER_PAGE = 100;
const COMMIT_SHA_PATTERN = /^[0-9a-f]{7,40}$/u;

/** A commit sha safe to place in a REST path: seven to forty lowercase hex characters. */
export function isCommitSha(value: string): boolean {
  return COMMIT_SHA_PATTERN.test(value);
}

interface Gh {
  readonly run: GhCommandExecutor;
  readonly path: string;
}

/** One surface: run, parse the JSON, validate to its shape; every failure names the surface. */
function readSurface<T>(
  gh: Gh,
  args: readonly string[],
  surface: string,
  parse: (value: unknown) => Result<T, Error>,
): Result<T, Error> {
  try {
    return parse(parseGhJson(gh.run(gh.path, args, GH_EXEC_OPTIONS), surface));
  } catch (cause) {
    return err(
      new Error(
        `fold-clock: gh ${surface} failed: ${cause instanceof Error ? cause.message : String(cause)}`,
        { cause },
      ),
    );
  }
}

function resolveGh(source: FoldClockSource): Result<Gh, Error> {
  try {
    return ok({ run: source.execFileSync, path: resolveGhPath(source.ghPath, source.exists) });
  } catch (cause) {
    return err(cause instanceof Error ? cause : new Error(String(cause), { cause }));
  }
}

function checkRunsArgs(repo: string, sha: string): readonly string[] {
  return [
    'api',
    '--paginate',
    '--slurp',
    `repos/${repo}/commits/${sha}/check-runs?per_page=${PER_PAGE}&filter=all`,
  ];
}

/** The tip's check-runs and its commit statuses, as runs of their contexts. */
function readHeadChecks(
  gh: Gh,
  repo: string,
  sha: string,
): Result<readonly CheckRunReading[], Error> {
  const runs = readSurface(gh, checkRunsArgs(repo, sha), 'head check-runs', parseCheckRuns);
  if (!runs.ok) {
    return runs;
  }
  const statuses = readSurface(
    gh,
    ['api', '--paginate', '--slurp', `repos/${repo}/commits/${sha}/status?per_page=${PER_PAGE}`],
    'head commit status',
    parseCommitStatus,
  );
  return statuses.ok ? ok([...runs.value, ...statuses.value]) : statuses;
}

function readSuccessor(
  gh: Gh,
  repo: string,
  successorSha: string | undefined,
): Result<
  { readonly sha: string; readonly checkRuns: readonly CheckRunReading[] } | undefined,
  Error
> {
  if (successorSha === undefined) {
    return ok(undefined);
  }
  if (!isCommitSha(successorSha)) {
    return err(new Error(`fold-clock: the successor '${successorSha}' is not a commit sha`));
  }
  const runs = readSurface(
    gh,
    checkRunsArgs(repo, successorSha),
    'successor check-runs',
    parseCheckRuns,
  );
  return runs.ok ? ok({ sha: successorSha, checkRuns: runs.value }) : runs;
}

interface PullContext {
  readonly gh: Gh;
  readonly repo: string;
  readonly pr: string;
  readonly prNumber: number;
  readonly pull: PullReading;
  readonly successorSha: string | undefined;
}

/** The surfaces that follow the pull request read: timeline, rules, the tip's runs, the successor's. */
function readRemaining(context: PullContext): Result<FoldClockReading, Error> {
  const { gh, repo, pr, pull } = context;
  const timeline = readSurface(
    gh,
    ['api', '--paginate', '--slurp', `repos/${repo}/issues/${pr}/timeline?per_page=${PER_PAGE}`],
    'issue timeline',
    parseTimeline,
  );
  if (!timeline.ok) {
    return timeline;
  }
  const required = readSurface(
    gh,
    [
      'api',
      '--paginate',
      '--slurp',
      `repos/${repo}/rules/branches/${encodeURIComponent(pull.baseRef)}?per_page=${PER_PAGE}`,
    ],
    'branch rules',
    parseRequiredChecksPages,
  );
  if (!required.ok) {
    return required;
  }
  const head = readHeadChecks(gh, repo, pull.headSha);
  if (!head.ok) {
    return head;
  }
  const successor = readSuccessor(gh, repo, context.successorSha);
  if (!successor.ok) {
    return successor;
  }
  return ok(
    assembleReading({
      prNumber: context.prNumber,
      pull,
      timeline: timeline.value,
      requiredChecks: required.value,
      headCheckRuns: head.value,
      successor: successor.value,
    }),
  );
}

/** Read the four surfaces (five with a successor) and assemble the clock's reading. */
export function readFoldClockReading(source: FoldClockSource): Result<FoldClockReading, Error> {
  const gh = resolveGh(source);
  if (!gh.ok) {
    return gh;
  }
  const repo = source.target.repo ?? '{owner}/{repo}';
  const pr = String(source.target.number);
  const pull = readSurface(
    gh.value,
    ['api', `repos/${repo}/pulls/${pr}`],
    'pull request',
    parsePull,
  );
  if (!pull.ok) {
    return pull;
  }
  if (!isBranchName(pull.value.baseRef)) {
    return err(new Error(`fold-clock: the base ref '${pull.value.baseRef}' is not a branch name`));
  }
  return readRemaining({
    gh: gh.value,
    repo,
    pr,
    prNumber: source.target.number,
    pull: pull.value,
    successorSha: source.successorSha,
  });
}
