/**
 * Comprehensive ground truth for search quality evaluation.
 *
 * **Phase-Aligned Architecture (2026-01-11)**:
 * Ground truths are organised by phase (primary/secondary) to align with
 * the curriculum structure. Each subject-phase has exactly 4 queries,
 * one for each category: precise-topic, natural-expression, imprecise-input, cross-topic.
 *
 * **Total**: 120 queries (30 subject-phases × 4 categories)
 *
 * ## Ground Truth Registry
 *
 * The registry (`GROUND_TRUTH_ENTRIES`) is THE single source of truth for all
 * ground truth entries. Use the registry accessors for validation and benchmarking:
 *
 * - `getAllGroundTruthEntries()` - Iterate all entries
 * - `getGroundTruthEntry(subject, phase)` - Get specific entry
 * - `getEntriesForSubject(subject)` - Get all entries for a subject
 * - `getEntriesForPhase(phase)` - Get all entries for a phase
 */

// Registry - THE single source of truth
export { getAllGroundTruthEntries } from './registry/index';

// Diagnostic queries
export { DIAGNOSTIC_QUERIES } from './diagnostic-queries';

// Subject re-exports consumed by evaluation experiments
export { MATHS_SECONDARY_ALL_QUERIES } from './maths';
