import { execFileSync } from 'node:child_process';
import type { ExecFileSyncOptionsWithStringEncoding } from 'node:child_process';

import { buildSnapshot, PR_VIEW_JSON_FIELDS, type PrSnapshot } from './index.js';

/**
 * The `gh` IO seam for `pr-watch`. All process invocation goes through here so
 * the pure core stays testable; tests inject {@link GhCommandExecutor}.
 *
 * Security: `gh` is invoked by name via `execFileSync` with an ARGS ARRAY (never
 * a shell string), and the PR identifier is validated by {@link parsePrTarget}
 * before it ever reaches `gh`.
 */

export type GhCommandExecutor = (
  file: string,
  args: readonly string[],
  options: ExecFileSyncOptionsWithStringEncoding,
) => string;

/** A validated pull-request target. */
export interface PrTarget {
  readonly number: number;
  /** `owner/repo`, or `undefined` to let `gh` infer the current repository. */
  readonly repo?: string;
}

const PR_NUMBER_PATTERN = /^[1-9]\d*$/u;
// A GitHub owner/repo segment cannot start or end with a separator, so a bare
// `..` segment or a leading `-` (flag-shaped) is rejected at the boundary.
const SEGMENT = '[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?';
const REPO_PATTERN = new RegExp(`^${SEGMENT}/${SEGMENT}$`, 'u');
const PR_URL_PATTERN = new RegExp(
  String.raw`^https://github\.com/(${SEGMENT}/${SEGMENT})/pull/([1-9]\d*)$`,
  'u',
);

/**
 * Validate and normalise the PR identifier (a number or a strict
 * `github.com/<owner>/<repo>/pull/<n>` URL) and optional `--repo`. Rejects
 * anything else so no caller-controlled value reaches `gh` unvalidated — the
 * same arg-injection discipline as the S8707 path-validation lane.
 */
export function parsePrTarget(prArg: string, repoArg?: string): PrTarget {
  if (repoArg !== undefined && !REPO_PATTERN.test(repoArg)) {
    throw new Error(`Invalid --repo: '${repoArg}' (expected <owner>/<repo>)`);
  }
  const urlMatch = PR_URL_PATTERN.exec(prArg);
  if (urlMatch) {
    const urlRepo = urlMatch[1];
    // Both a URL (which names an owner/repo) and an explicit --repo were given:
    // a mismatch is a caller error, not silently resolved (would watch the wrong PR).
    if (repoArg !== undefined && repoArg !== urlRepo) {
      throw new Error(
        `--repo '${repoArg}' conflicts with the repo in the URL ('${urlRepo}'); pass only one`,
      );
    }
    return { number: Number(urlMatch[2]), repo: urlRepo };
  }
  if (!PR_NUMBER_PATTERN.test(prArg)) {
    throw new Error(
      `Invalid PR identifier: '${prArg}' (expected a PR number or a github.com/<owner>/<repo>/pull/<n> URL)`,
    );
  }
  return { number: Number(prArg), repo: repoArg };
}

export interface ReadPrSnapshotOptions {
  readonly target: PrTarget;
  readonly execFileSync?: GhCommandExecutor;
}

// gh JSON for a busy PR (many checks/comments, `gh api --paginate`) can exceed
// execFileSync's ~1 MiB default maxBuffer and hard-fail; allow generous room.
const MAX_GH_OUTPUT_BYTES = 64 * 1024 * 1024;

export const GH_EXEC_OPTIONS: ExecFileSyncOptionsWithStringEncoding = {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
  maxBuffer: MAX_GH_OUTPUT_BYTES,
};

// The `$endCursor` variable plus `after: $endCursor` are what let `gh api graphql
// --paginate` follow the cursor itself; `--slurp` wraps the pages into one JSON array.
const REVIEW_THREADS_QUERY = `query($owner: String!, $name: String!, $number: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) {
    pullRequest(number: $number) {
      reviewThreads(first: 100, after: $endCursor) {
        totalCount
        pageInfo { hasNextPage endCursor }
        nodes { isResolved }
      }
    }
  }
}`;

// `-F` values support the same `{owner}` / `{repo}` placeholder substitution from the
// current repository as REST paths, and become GraphQL variables (verified live,
// gh 2.95.0, 2026-07-03).
export function reviewThreadsArgs(prNumber: string, repo: string | undefined): string[] {
  const [owner, name] = repo === undefined ? ['{owner}', '{repo}'] : repo.split('/');
  return [
    'api',
    'graphql',
    '--paginate',
    '--slurp',
    '-f',
    `query=${REVIEW_THREADS_QUERY}`,
    '-F',
    `owner=${owner}`,
    '-F',
    `name=${name}`,
    '-F',
    `number=${prNumber}`,
  ];
}

/** Fetch the three `gh` surfaces for a PR and build a {@link PrSnapshot}. */
export function readPrSnapshot(options: ReadPrSnapshotOptions): PrSnapshot {
  const run = options.execFileSync ?? execFileSync;
  const { number, repo } = options.target;
  const prNumber = String(number);

  const prViewArgs = ['pr', 'view', prNumber, '--json', PR_VIEW_JSON_FIELDS.join(',')];
  if (repo !== undefined) {
    prViewArgs.push('--repo', repo);
  }

  // `gh api` substitutes the literal `{owner}/{repo}` placeholder from the
  // current repository when no explicit repo is given (verified behaviour).
  const apiOwnerRepo = repo ?? '{owner}/{repo}';
  const apiArgs = ['api', `repos/${apiOwnerRepo}/pulls/${prNumber}/comments`, '--paginate'];

  const prViewRaw = parseGhJson(run('gh', prViewArgs, GH_EXEC_OPTIONS), 'pr view');
  const reviewCommentsRaw = parseGhJson(run('gh', apiArgs, GH_EXEC_OPTIONS), 'api pulls comments');
  const reviewThreadPagesRaw = parseGhJson(
    run('gh', reviewThreadsArgs(prNumber, repo), GH_EXEC_OPTIONS),
    'api graphql reviewThreads',
  );
  return buildSnapshot(prViewRaw, reviewCommentsRaw, reviewThreadPagesRaw);
}

// `gh` writes JSON to stdout; if it instead emits a non-JSON line (e.g. an auth
// prompt or warning) attribute the failure rather than surfacing a bare
// SyntaxError.
export function parseGhJson(raw: string, surface: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`gh ${surface} returned non-JSON output (is gh installed and authenticated?)`);
  }
}
