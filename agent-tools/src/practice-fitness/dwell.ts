/**
 * Dwell-time over a decision-debt buffer: how long undecided items have sat.
 * A report-only prioritisation signal layered on the decision-debt count zone —
 * it ranks how urgently to drain, and never gates. `now` is injected, never read
 * from a clock here, so the computation is deterministic and unit-testable.
 *
 * Built on the register schema in `./item-count.ts`.
 */

import { isLiveItem, type ParsedItem } from './item-count.js';

/**
 * Parse the leading `YYYY-MM-DD` from a bracket date value (`captured` /
 * `updated`), tolerant of ranges (`2026-05-05-06`) and trailing text. Returns the
 * ISO date string, or `null` when no date is present.
 */
export function parseLeadingIsoDate(value: string | undefined): string | null {
  const match = value?.match(/\d{4}-\d{2}-\d{2}/);
  return match ? match[0] : null;
}

/** Whole days from an ISO date to `now` (injected), clamped at 0; null if unparseable. */
function ageInDays(createdAtIso: string | null, now: Date): number | null {
  if (createdAtIso == null) {
    return null;
  }
  const created = new Date(`${createdAtIso}T00:00:00Z`);
  if (Number.isNaN(created.getTime())) {
    return null;
  }
  return Math.max(0, Math.floor((now.getTime() - created.getTime()) / 86_400_000));
}

/**
 * The greatest age in days — since `captured` (createdAt) — across the live
 * (undecided) items: the buffer's oldest undecided item. Returns `null` when no
 * live item carries a parseable date.
 */
export function oldestLiveItemAgeDays(items: readonly ParsedItem[], now: Date): number | null {
  let oldest: number | null = null;
  for (const item of items) {
    if (!isLiveItem(item)) {
      continue;
    }
    const age = ageInDays(parseLeadingIsoDate(item.fields.captured), now);
    if (age != null && (oldest == null || age > oldest)) {
      oldest = age;
    }
  }
  return oldest;
}
