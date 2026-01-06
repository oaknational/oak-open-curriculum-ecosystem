/**
 * Ground Truth Registry — THE single source of truth for search quality evaluation.
 *
 * This module provides a unified registry of all ground truth entries. All validation,
 * benchmarking, and smoke test tools iterate over this registry.
 *
 * ## Design Principles
 *
 * 1. **Only entries that exist**: No nulls, no placeholders. If a subject/phase
 *    combination has ground truths, it's in the registry. Otherwise, it isn't.
 *
 * 2. **Baseline MRR for smoke tests**: Each entry stores its baseline MRR for
 *    automated regression detection.
 *
 * 3. **Single source of truth**: All tools that need ground truths import from here.
 *    No hardcoded mappings elsewhere.
 *
 * ## Adding New Ground Truths
 *
 * 1. Create the ground truth files in the subject's directory
 * 2. Add an entry to `GROUND_TRUTH_ENTRIES` in `./entries.ts` with `baselineMrr: 0.0`
 * 3. Run `pnpm benchmark --subject X --phase Y` to measure
 * 4. Update `baselineMrr` with the measured value
 *
 * @example
 * ```typescript
 * import { getAllGroundTruthEntries, getGroundTruthEntry } from './registry';
 *
 * // Iterate all entries (validation, benchmarking)
 * for (const entry of getAllGroundTruthEntries()) {
 *   await validateEntry(entry);
 * }
 *
 * // Get specific entry
 * const mathsSecondary = getGroundTruthEntry('maths', 'secondary');
 * ```
 *
 * @see ADR-098 Ground Truth Registry as Single Source of Truth
 * @packageDocumentation
 */

import type { Subject } from '@oaknational/oak-curriculum-sdk';

import { GROUND_TRUTH_ENTRIES } from './entries';
import type { GroundTruthEntry, Phase } from './types';

// Re-export types
export type { GroundTruthEntry, Phase } from './types';

// Re-export entries
export { GROUND_TRUTH_ENTRIES } from './entries';

/**
 * Get all ground truth entries.
 *
 * Use this to iterate over all entries for validation or benchmarking.
 *
 * @returns All entries in the registry
 *
 * @example
 * ```typescript
 * for (const entry of getAllGroundTruthEntries()) {
 *   console.log(`${entry.subject}/${entry.phase}: ${entry.queries.length} queries`);
 * }
 * ```
 */
export function getAllGroundTruthEntries(): readonly GroundTruthEntry[] {
  return GROUND_TRUTH_ENTRIES;
}

/**
 * Get a specific ground truth entry by subject and phase.
 *
 * @param subject - Subject slug
 * @param phase - Phase (primary or secondary)
 * @returns The entry if found, undefined otherwise
 *
 * @example
 * ```typescript
 * const mathsSecondary = getGroundTruthEntry('maths', 'secondary');
 * if (mathsSecondary) {
 *   console.log(`Baseline MRR: ${mathsSecondary.baselineMrr}`);
 * }
 * ```
 */
export function getGroundTruthEntry(subject: Subject, phase: Phase): GroundTruthEntry | undefined {
  return GROUND_TRUTH_ENTRIES.find((entry) => entry.subject === subject && entry.phase === phase);
}

/**
 * Get all ground truth entries for a specific subject.
 *
 * @param subject - Subject slug
 * @returns All entries for the subject (may be empty if no ground truths exist)
 *
 * @example
 * ```typescript
 * const englishEntries = getEntriesForSubject('english');
 * // Returns entries for english/primary and english/secondary
 * ```
 */
export function getEntriesForSubject(subject: Subject): readonly GroundTruthEntry[] {
  return GROUND_TRUTH_ENTRIES.filter((entry) => entry.subject === subject);
}

/**
 * Get all ground truth entries for a specific phase.
 *
 * @param phase - Phase (primary or secondary)
 * @returns All entries for the phase across all subjects
 *
 * @example
 * ```typescript
 * const primaryEntries = getEntriesForPhase('primary');
 * console.log(`${primaryEntries.length} subjects have primary ground truths`);
 * ```
 */
export function getEntriesForPhase(phase: Phase): readonly GroundTruthEntry[] {
  return GROUND_TRUTH_ENTRIES.filter((entry) => entry.phase === phase);
}
