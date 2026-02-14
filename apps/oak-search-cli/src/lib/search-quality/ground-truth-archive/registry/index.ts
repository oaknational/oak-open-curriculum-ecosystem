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
 * 2. **Baselines stored separately**: Baseline metrics are in `evaluation/baselines/baselines.json`,
 *    not in the ground truth entries. This separates test data from results.
 *
 * 3. **Single source of truth**: All tools that need ground truths import from here.
 *    No hardcoded mappings elsewhere.
 *
 * ## Adding New Ground Truths
 *
 * See `GROUND-TRUTH-PROCESS.md` for the full step-by-step process:
 *
 * 1. Download bulk data for your subject/phase
 * 2. Create ground truth files with validated slugs
 * 3. Add entry to `GROUND_TRUTH_ENTRIES` in `./entries.ts`
 * 4. Run `pnpm ground-truth:validate` to verify slugs
 * 5. Run `pnpm benchmark --subject X --phase Y` to measure
 * 6. Update `evaluation/baselines/baselines.json` with measured values
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
 * if (mathsSecondary) {
 *   console.log(`${mathsSecondary.queries.length} queries`);
 * }
 * ```
 *
 * @see ADR-098 Ground Truth Registry as Single Source of Truth
 * @see GROUND-TRUTH-PROCESS.md for creating new ground truths
 */

import type { Subject } from '@oaknational/curriculum-sdk';

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
 *   console.log(`${mathsSecondary.queries.length} queries`);
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
