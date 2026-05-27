/**
 * Freshness gate for the EEF evidence corpus snapshot.
 *
 * Implements `t13-freshness-gate` per ADR-175: external evidence corpora
 * must have explicit freshness governance before they ship to user-facing
 * MCP surfaces. Relocated here from `oak-curriculum-sdk` (review-register
 * item M) so the loader can bind it without crossing the ADR-179 one-way
 * boundary (`graph-corpus-sdk` must not import the MCP-surfacing SDK).
 *
 * The check function compares the snapshot's `meta.last_updated` against a
 * caller-supplied `now` and rejects any snapshot whose age exceeds the
 * caller-supplied `thresholdDays`. The function is pure: `now` is injected
 * so tests describe boundary behaviour without reading the system clock,
 * and `thresholdDays` is explicit at every call site so the 180-day
 * threshold (`DEFAULT_THRESHOLD_DAYS`) is never silently re-defaulted by a
 * downstream caller.
 *
 * The live binding is `loadEefCorpus` in `./loader.ts`, which runs this
 * gate against the validated snapshot's `meta.last_updated` before
 * constructing the adapter. The gate-1b refresh script (a separate cycle)
 * consumes the same check function to validate any reviewed replacement
 * before regenerating `./eef-toolkit.ts`.
 *
 * @packageDocumentation
 */

import { ok, err, type Result } from '@oaknational/result';

/**
 * Default freshness threshold in days, per ADR-175.
 *
 * The 180-day window matches the ADR's stated default for external
 * evidence corpora. Source-specific ADRs may override this; callers
 * must pass the threshold explicitly so the override path is
 * audit-visible at every call site.
 */
export const DEFAULT_THRESHOLD_DAYS = 180;

/**
 * Discriminated error union for `checkFreshness`.
 *
 * - `invalid-date` fires when `lastUpdated` cannot be parsed as a
 *   `Date`. The original input string is preserved on the error so
 *   the caller can include it in a diagnostic.
 * - `future-dated` fires when `lastUpdated` parses to a time after
 *   `now` (negative age). A freshness control fails closed: a snapshot
 *   cannot be fresh by being dated in the future, and a future date is
 *   a data-integrity signal distinct from an unparseable one. The input
 *   and the (negative) `ageDays` are carried for diagnostics.
 * - `stale-data` fires when the parsed age exceeds the threshold.
 *   Both the computed `ageDays` and the `thresholdDays` are carried
 *   so the caller can report the magnitude of the breach.
 */
export type FreshnessError =
  | {
      readonly kind: 'invalid-date';
      readonly input: string;
    }
  | {
      readonly kind: 'future-dated';
      readonly input: string;
      readonly ageDays: number;
    }
  | {
      readonly kind: 'stale-data';
      readonly ageDays: number;
      readonly thresholdDays: number;
    };

/**
 * Success payload for `checkFreshness`.
 *
 * Carries the computed `ageDays` and the `thresholdDays` the check
 * ran against so callers can surface both in telemetry / responses.
 */
export interface FreshnessOk {
  readonly ageDays: number;
  readonly thresholdDays: number;
}

const MS_PER_DAY = 86_400_000;

/**
 * Check whether a snapshot timestamp is within a freshness threshold.
 *
 * Returns `ok` when the snapshot's age (in whole days, floor-rounded)
 * is between zero and `thresholdDays` inclusive. Returns `err` with
 * `stale-data` when the age exceeds the threshold, `future-dated` when
 * the snapshot is dated after `now`, or `invalid-date` when
 * `lastUpdated` is not a parseable date string.
 *
 * The threshold is inclusive: an age exactly equal to `thresholdDays`
 * is treated as fresh (the stale gate fires only when age is strictly
 * greater than the threshold). The control fails closed at both ends —
 * a future-dated snapshot is rejected, never treated as ultra-fresh.
 *
 * @param lastUpdated - ISO-8601 timestamp from the snapshot's `meta.last_updated` field.
 * @param now - The reference time. Inject for deterministic tests.
 * @param thresholdDays - The freshness threshold in whole days. Pass `DEFAULT_THRESHOLD_DAYS` (180) unless a source-specific ADR overrides.
 */
export function checkFreshness(
  lastUpdated: string,
  now: Date,
  thresholdDays: number,
): Result<FreshnessOk, FreshnessError> {
  const parsed = new Date(lastUpdated);
  if (Number.isNaN(parsed.getTime())) {
    return err({ kind: 'invalid-date', input: lastUpdated });
  }
  const ageDays = Math.floor((now.getTime() - parsed.getTime()) / MS_PER_DAY);
  if (ageDays < 0) {
    return err({ kind: 'future-dated', input: lastUpdated, ageDays });
  }
  if (ageDays > thresholdDays) {
    return err({ kind: 'stale-data', ageDays, thresholdDays });
  }
  return ok({ ageDays, thresholdDays });
}
