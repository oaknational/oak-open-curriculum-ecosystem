import { err, ok, type Result } from '@oaknational/result';

import { pairRounds, type ReviewerEvent, type ReviewRound } from './fold-clock-rounds.js';
import { earliest, latest, minutesBetween } from './fold-clock-time.js';

/**
 * The fold's clock, computed from the API's instants and never read by the
 * seat (the retrospective of 2026-10-10: a seat's reading of the push gate
 * was wrong by three times; the owner's bound on a fold is wall time and
 * nothing in the estate measured it). Pure: the reading arrives validated
 * from `fold-clock-reading.ts`; this module reduces, subtracts and formats
 * through `fold-clock-format.ts`.
 *
 * Instants: the ready-mark (the last `ready_for_review`, else the pull
 * request's opening), checks green (the latest passing completion among the
 * base branch's REQUIRED contexts on the tip — the merge door's own
 * definition for the records class, never every check-run, since a vendor's
 * review runs as a check-run of its own; a context is judged by its LATEST
 * run, as GitHub judges it, a run with no instant yet holding the context
 * open, and a commit status counts as a run of its context because a
 * required context may be a status that publishes no check-run), each
 * vendor review round (`fold-clock-rounds.ts`), the merge, and the
 * successor's first check-run start when a successor tip is named.
 * Every interval is minutes from the ready-mark to one decimal, so a ledger
 * row carries the fold's shape in one line.
 */

export interface CheckRunReading {
  readonly name: string;
  readonly conclusion: string | undefined;
  readonly startedAt: string | undefined;
  readonly completedAt: string | undefined;
}

export interface FoldClockReading {
  readonly prNumber: number;
  readonly headSha: string;
  readonly createdAt: string;
  /** Every `ready_for_review` instant, in timeline order. */
  readonly readyMarks: readonly string[];
  readonly mergedAt: string | undefined;
  /** Bot review requests, in timeline order. */
  readonly requests: readonly ReviewerEvent[];
  /** Submitted reviews, in timeline order. */
  readonly reviews: readonly ReviewerEvent[];
  /** The status contexts the base branch's rules require. */
  readonly requiredChecks: readonly string[];
  /** The tip's check-runs and commit statuses, as runs of their contexts. */
  readonly headCheckRuns: readonly CheckRunReading[];
  readonly successor:
    { readonly sha: string; readonly checkRuns: readonly CheckRunReading[] } | undefined;
}

export interface FoldClock {
  readonly prNumber: number;
  readonly headSha: string;
  readonly readyAt: string;
  readonly requiredChecks: readonly string[];
  readonly checksGreenAt: string | undefined;
  /** Required contexts whose latest run is not a passing completion. */
  readonly checksMissing: readonly string[];
  readonly readyToGreenMinutes: number | undefined;
  readonly rounds: readonly ReviewRound[];
  readonly mergedAt: string | undefined;
  readonly readyToMergeMinutes: number | undefined;
  readonly successorSha: string | undefined;
  readonly successorLandedAt: string | undefined;
  readonly readyToSuccessorMinutes: number | undefined;
}

/** GitHub's required-check gate passes these conclusions; the merge door reads the same set. */
const PASSING_CONCLUSIONS: ReadonlySet<string> = new Set(['success', 'neutral', 'skipped']);

/**
 * A run's position in execution order: its start, else its completion;
 * none for a run with neither (queued, not yet started) or with an instant
 * that does not parse.
 */
function anchor(run: CheckRunReading): number | undefined {
  const instant = run.startedAt ?? run.completedAt;
  if (instant === undefined) {
    return undefined;
  }
  const at = Date.parse(instant);
  return Number.isNaN(at) ? undefined : at;
}

/**
 * The latest run of one context (GitHub evaluates a context through its
 * latest run), or none while a run carries no anchor: an unanchored run
 * cannot be ordered against the others, so the context stays open whatever
 * order the API lists the runs in — unknown is never latest-known, as
 * `pr-watch/check-rollup.ts` reads an undated run.
 */
function latestRun(runs: readonly CheckRunReading[]): CheckRunReading | undefined {
  let best: { readonly run: CheckRunReading; readonly at: number } | undefined;
  for (const run of runs) {
    const at = anchor(run);
    if (at === undefined) {
      return undefined;
    }
    if (best === undefined || at > best.at) {
      best = { run, at };
    }
  }
  return best?.run;
}

/** The passing completion of each required context's LATEST run; a context whose latest run is not passing, or whose runs cannot be ordered, is missing. */
function requiredGreen(
  required: readonly string[],
  runs: readonly CheckRunReading[],
): { readonly greenAt: string | undefined; readonly missing: readonly string[] } {
  const completions = required.map((name) => {
    const survivor = latestRun(runs.filter((run) => run.name === name));
    const passing = survivor !== undefined && PASSING_CONCLUSIONS.has(survivor.conclusion ?? '');
    return { name, at: passing ? survivor.completedAt : undefined };
  });
  const missing = completions.filter((entry) => entry.at === undefined).map((entry) => entry.name);
  const greenAt =
    missing.length > 0 || required.length === 0
      ? undefined
      : latest(completions.flatMap((entry) => (entry.at === undefined ? [] : [entry.at])));
  return { greenAt, missing };
}

function delta(readyAt: string, instant: string | undefined): number | undefined {
  return instant === undefined ? undefined : minutesBetween(readyAt, instant);
}

/** Compute the clock; fails only when an instant the reading carries does not parse. */
export function computeFoldClock(reading: FoldClockReading): Result<FoldClock, Error> {
  const readyAt = latest(reading.readyMarks) ?? reading.createdAt;
  if (Number.isNaN(Date.parse(readyAt))) {
    return err(new Error(`fold-clock: the ready instant '${readyAt}' is not a date`));
  }
  const checks = requiredGreen(reading.requiredChecks, reading.headCheckRuns);
  const successorLandedAt =
    reading.successor === undefined
      ? undefined
      : earliest(
          reading.successor.checkRuns.flatMap((run) =>
            run.startedAt === undefined ? [] : [run.startedAt],
          ),
        );
  return ok({
    prNumber: reading.prNumber,
    headSha: reading.headSha,
    readyAt,
    requiredChecks: reading.requiredChecks,
    checksGreenAt: checks.greenAt,
    checksMissing: checks.missing,
    readyToGreenMinutes: delta(readyAt, checks.greenAt),
    rounds: pairRounds(reading.requests, reading.reviews),
    mergedAt: reading.mergedAt,
    readyToMergeMinutes: delta(readyAt, reading.mergedAt),
    successorSha: reading.successor?.sha,
    successorLandedAt,
    readyToSuccessorMinutes: delta(readyAt, successorLandedAt),
  });
}
