/**
 * The census/ratchet-contract half of the identity-naming validator: the
 * committed census IS the contract, and this module computes live counts and
 * compares them to it.
 *
 * @remarks
 * Part of the PDS identity-replacement enforcement (plan
 * `public-digital-service-identity`, owner-ratified 2026-08-03). Until the
 * rename completes, the committed census
 * (`.agent/reports/design/pds-identity-rename/census.json`) is the RATCHET
 * CONTRACT: live per-file, per-kind, per-case-variant counts must exactly
 * equal the census. Above the census = a new occurrence (forbidden); below =
 * a stale census — the census update is the ratchet-down ceremony, so a
 * removal that forgets the census fails too. When the census is empty or
 * absent the validator is STRICT: zero occurrences, zero exclusions.
 *
 * The contract is deliberately COUNT-based, never line-based: these are live
 * files under active peer editing, and unrelated edits drift line numbers
 * constantly. Per-case-variant counts additionally catch re-casing churn
 * (an occurrence changing case without changing total mass). The token
 * vocabulary and scanning primitives live in the sibling module
 * `validate-identity-naming-tokens.ts`.
 *
 * @packageDocumentation
 */

import { type ScanFile } from '../../core/tracked-file-scan.js';

import {
  countVariants,
  hasAnyCount,
  type VariantCounts,
} from './validate-identity-naming-tokens.js';

/**
 * The census's own repo-relative path. Its `file` column necessarily contains
 * the forbidden token (sixteen tracked paths carry it), so in RATCHET mode
 * the content scan excludes exactly this one path; in STRICT mode there is no
 * exclusion — the census is emptied and deleted in the same final landing, so
 * the end state is absolute.
 */
export const CENSUS_PATH = '.agent/reports/design/pds-identity-rename/census.json';

/** One census entry: the ratchet contract row for one (file, kind) cell. */
export interface CensusEntry {
  readonly file: string;
  readonly kind: 'content' | 'path';
  readonly countByVariant: VariantCounts;
}

/** A ratchet comparison finding: one divergent (file, kind) cell. */
export interface RatchetFinding {
  readonly file: string;
  readonly kind: 'content' | 'path';
  readonly reason: 'new-occurrence' | 'stale-census';
  readonly live: VariantCounts;
  readonly census: VariantCounts;
}

/** The all-zero counts used when one side of a comparison has no row. */
const ZERO_COUNTS: VariantCounts = { name: 0, initialismUpper: 0, initialismLower: 0 };

/** Structural equality over the three variant counts. */
export function countsEqual(a: VariantCounts, b: VariantCounts): boolean {
  return (
    a.name === b.name &&
    a.initialismUpper === b.initialismUpper &&
    a.initialismLower === b.initialismLower
  );
}

/**
 * Compute the live per-file counts for content (scanned text files) and paths
 * (every tracked path, unconditionally — a binary file whose NAME carries the
 * token must still fail, so the path leg never honours the binary skip set).
 *
 * @param allTrackedPaths - every tracked path, including binaries.
 * @param scannableFiles - the text files whose content is scanned.
 * @param excludeContentPath - a path excluded from the CONTENT scan only
 * (ratchet mode passes the census's own path; strict mode passes undefined).
 */
export function computeLiveCounts(
  allTrackedPaths: readonly string[],
  scannableFiles: readonly ScanFile[],
  excludeContentPath: string | undefined,
): CensusEntry[] {
  const entries: CensusEntry[] = [];
  for (const trackedPath of allTrackedPaths) {
    const pathCounts = countVariants(trackedPath);
    if (hasAnyCount(pathCounts)) {
      entries.push({ file: trackedPath, kind: 'path', countByVariant: pathCounts });
    }
  }
  for (const file of scannableFiles) {
    if (excludeContentPath !== undefined && file.path === excludeContentPath) {
      continue;
    }
    const contentCounts = countVariants(file.content);
    if (hasAnyCount(contentCounts)) {
      entries.push({ file: file.path, kind: 'content', countByVariant: contentCounts });
    }
  }
  return entries;
}

/**
 * Compare live counts against the census: exact equality both directions.
 *
 * @returns one finding per divergent (file, kind) — `new-occurrence` when live
 * exceeds the census (including files the census has no row for), and
 * `stale-census` when the census exceeds live (the census update is the
 * ratchet-down ceremony, so a removal that forgets the census fails too).
 */
export function compareToCensus(
  live: readonly CensusEntry[],
  census: readonly CensusEntry[],
): RatchetFinding[] {
  const liveByKey = new Map(live.map((entry) => [entryKey(entry), entry]));
  const censusByKey = new Map(census.map((entry) => [entryKey(entry), entry]));
  const findings = collectLiveDivergences(liveByKey, censusByKey);
  for (const [key, censusEntry] of censusByKey) {
    if (!liveByKey.has(key) && hasAnyCount(censusEntry.countByVariant)) {
      findings.push({
        file: censusEntry.file,
        kind: censusEntry.kind,
        reason: 'stale-census',
        live: ZERO_COUNTS,
        census: censusEntry.countByVariant,
      });
    }
  }
  return findings;
}

/** The map key for one (kind, file) census cell. */
function entryKey(entry: CensusEntry): string {
  return `${entry.kind} ${entry.file}`;
}

/**
 * The duplicated (kind, file) keys in a row set.
 *
 * @remarks
 * {@link compareToCensus} keys both sides by cell, so two rows claiming the
 * same cell would make the contract's verdict depend on which one happened to
 * win the map insertion — one row would be adjudicated and the other silently
 * discarded. A census carrying a duplicate is malformed, not merely untidy.
 *
 * @param entries - The rows to check.
 * @returns Each duplicated key once, in first-duplicate order; empty when the
 * rows are unique.
 */
export function findDuplicateKeys(entries: readonly CensusEntry[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const entry of entries) {
    const key = entryKey(entry);
    if (seen.has(key)) {
      duplicates.add(key);
      continue;
    }
    seen.add(key);
  }
  return [...duplicates];
}

/**
 * The live-side pass: every live cell whose counts diverge from the census.
 * A cell exceeding the census anywhere is a `new-occurrence`; a cell below it
 * (with no variant above) is a `stale-census` awaiting its ratchet-down update.
 */
function collectLiveDivergences(
  liveByKey: ReadonlyMap<string, CensusEntry>,
  censusByKey: ReadonlyMap<string, CensusEntry>,
): RatchetFinding[] {
  const findings: RatchetFinding[] = [];
  for (const [key, liveEntry] of liveByKey) {
    const censusCounts = censusByKey.get(key)?.countByVariant ?? ZERO_COUNTS;
    if (!countsEqual(liveEntry.countByVariant, censusCounts)) {
      findings.push({
        file: liveEntry.file,
        kind: liveEntry.kind,
        reason: exceedsAnywhere(liveEntry.countByVariant, censusCounts)
          ? 'new-occurrence'
          : 'stale-census',
        live: liveEntry.countByVariant,
        census: censusCounts,
      });
    }
  }
  return findings;
}

/** True when `live` exceeds `census` on ANY variant (a new occurrence exists). */
function exceedsAnywhere(live: VariantCounts, census: VariantCounts): boolean {
  return (
    live.name > census.name ||
    live.initialismUpper > census.initialismUpper ||
    live.initialismLower > census.initialismLower
  );
}
