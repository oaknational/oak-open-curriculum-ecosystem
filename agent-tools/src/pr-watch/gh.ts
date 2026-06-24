import { execFileSync } from 'node:child_process';
import type { ExecFileSyncOptionsWithStringEncoding } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

import { buildSnapshot, PR_VIEW_JSON_FIELDS, type PrSnapshot } from './index.js';

/**
 * The `gh` IO seam for `pr-watch`. All process invocation goes through here so
 * the pure core stays testable; tests inject {@link GhCommandExecutor}.
 *
 * Security: `gh` is invoked via `execFileSync` with an ARGS ARRAY (never a shell
 * string), and the binary is given an ABSOLUTE path resolved by
 * {@link resolveGhPath}, so command resolution never consults `PATH` (no S4036
 * binary-shadowing surface). The PR identifier is validated by
 * {@link parsePrTarget} before it ever reaches `gh`.
 */

export type GhCommandExecutor = (
  file: string,
  args: readonly string[],
  options: ExecFileSyncOptionsWithStringEncoding,
) => string;

export type PathExistsCheck = (candidate: string) => boolean;

/**
 * Known absolute install locations for the `gh` binary, most specific first.
 * `gh` is a third-party CLI with no single canonical system path (unlike
 * `git`), so the absolute path is resolved by probing these rather than pinning
 * `PATH`. Using an absolute path with `execFile` keeps resolution off `PATH`.
 */
const KNOWN_GH_PATHS = [
  '/opt/homebrew/bin/gh',
  '/usr/local/bin/gh',
  '/usr/bin/gh',
  '/bin/gh',
] as const;

/** Resolve an absolute path to the `gh` binary, honouring an explicit override. */
export function resolveGhPath(override?: string, exists: PathExistsCheck = existsSync): string {
  if (override !== undefined) {
    if (!path.isAbsolute(override)) {
      throw new Error('--gh requires an absolute path to a gh executable');
    }
    if (path.basename(override) !== 'gh') {
      throw new Error('--gh must point to an executable named gh');
    }
    if (!exists(override)) {
      throw new Error(`--gh path does not exist: ${override}`);
    }
    return override;
  }
  const found = KNOWN_GH_PATHS.find((candidate) => exists(candidate));
  if (found === undefined) {
    throw new Error(`gh CLI not found in ${KNOWN_GH_PATHS.join(', ')}; pass --gh <absolute-path>`);
  }
  return found;
}

/** A validated pull-request target. */
export interface PrTarget {
  readonly number: number;
  /** `owner/repo`, or `undefined` to let `gh` infer the current repository. */
  readonly repo?: string;
}

const PR_NUMBER_PATTERN = /^[1-9][0-9]*$/u;
// A GitHub owner/repo segment cannot start or end with a separator, so a bare
// `..` segment or a leading `-` (flag-shaped) is rejected at the boundary.
const SEGMENT = '[A-Za-z0-9](?:[A-Za-z0-9._-]*[A-Za-z0-9])?';
const REPO_PATTERN = new RegExp(`^${SEGMENT}/${SEGMENT}$`, 'u');
const PR_URL_PATTERN = new RegExp(
  `^https://github\\.com/(${SEGMENT}/${SEGMENT})/pull/([1-9][0-9]*)$`,
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
    return { number: Number(urlMatch[2]), repo: repoArg ?? urlMatch[1] };
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
  readonly ghPath?: string;
  readonly execFileSync?: GhCommandExecutor;
  readonly exists?: PathExistsCheck;
}

const EXEC_OPTIONS: ExecFileSyncOptionsWithStringEncoding = {
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
};

/** Fetch the two `gh` surfaces for a PR and build a {@link PrSnapshot}. */
export function readPrSnapshot(options: ReadPrSnapshotOptions): PrSnapshot {
  const run = options.execFileSync ?? execFileSync;
  const gh = resolveGhPath(options.ghPath, options.exists);
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

  const prViewRaw = parseGhJson(run(gh, prViewArgs, EXEC_OPTIONS), 'pr view');
  const reviewCommentsRaw = parseGhJson(run(gh, apiArgs, EXEC_OPTIONS), 'api pulls comments');
  return buildSnapshot(prViewRaw, reviewCommentsRaw);
}

// `gh` writes JSON to stdout; if it instead emits a non-JSON line (e.g. an auth
// prompt or warning) attribute the failure rather than surfacing a bare
// SyntaxError.
function parseGhJson(raw: string, surface: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error(`gh ${surface} returned non-JSON output (is gh installed and authenticated?)`);
  }
}
