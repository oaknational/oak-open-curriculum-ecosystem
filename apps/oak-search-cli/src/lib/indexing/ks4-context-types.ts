/**
 * KS4 context types and type guards for denormalising tier and exam-subject
 * metadata extracted from sequence responses.
 *
 * Exam-board and ks4-option metadata is owned by the bulk-data pipeline. The
 * live-API sequence response does not carry per-sequence variant info as of
 * upstream API v0.7.0 (`ks4Options` was removed; `ks4ProgrammeFactors` is per
 * subject, not per sequence). The previous hand-authored `KNOWN_EXAM_BOARDS`
 * slug oracle has been removed because it contradicted the bulk schema's
 * authoritative 8-value `examBoardSlug` enum.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import type { LogContextInput } from '@oaknational/logger';

/**
 * Context for a single unit, representing one occurrence in a sequence.
 * A unit can appear in multiple sequences with different contexts,
 * so these get merged into arrays in the final UnitContextMap.
 */
export interface UnitContext {
  readonly unitSlug: string;
  readonly tiers: readonly string[];
  readonly tierTitles: readonly string[];
  readonly examSubjects: readonly string[];
  readonly examSubjectTitles: readonly string[];
}

/** Aggregated KS4 metadata for a unit, with all values merged from multiple sequences. */
export interface AggregatedUnitContext {
  readonly tiers: readonly string[];
  readonly tierTitles: readonly string[];
  readonly examSubjects: readonly string[];
  readonly examSubjectTitles: readonly string[];
}

/** Map of unit slug to aggregated KS4 context. Used during document indexing. */
export type UnitContextMap = Map<string, AggregatedUnitContext>;

/** Subject sequence entry from the subjects API. */
export interface SubjectSequenceInfo {
  readonly sequenceSlug: string;
}

/** Tier entry in the sequence response. */
export interface TierEntry {
  readonly tierSlug: string;
  readonly tierTitle: string;
  readonly units: readonly UnitEntry[];
}

/** Exam subject entry in the sequence response (sciences only). */
export interface ExamSubjectEntry {
  readonly examSubjectSlug?: string;
  readonly examSubjectTitle: string;
  readonly tiers?: readonly TierEntry[];
  readonly units?: readonly UnitEntry[];
}

/** Unit entry in the sequence response. */
interface UnitEntry {
  readonly unitSlug?: string;
  readonly unitTitle: string;
  readonly unitOrder: number;
  readonly unitOptions?: readonly { unitSlug: string; unitTitle: string }[];
}

/** Logger interface for KS4 context building. */
export interface Ks4Logger {
  debug: (msg: string, data?: Ks4LogData) => void;
}

/** Log data for KS4 context operations. */
interface Ks4LogData extends LogContextInput {
  sequenceSlug?: string;
  contextCount?: number;
  totalUnits?: number;
}

/** Type guard for checking if a year entry has tiers (KS4 Maths structure). */
export function hasDirectTiers(
  entry: unknown,
): entry is { tiers: readonly TierEntry[]; year: number | string } {
  if (typeof entry !== 'object' || entry === null) {
    return false;
  }
  if (!('tiers' in entry)) {
    return false;
  }
  const tiers: unknown = entry.tiers;
  return Array.isArray(tiers) && !('examSubjects' in entry);
}

/** Type guard for checking if a year entry has exam subjects (KS4 Sciences structure). */
export function hasExamSubjects(
  entry: unknown,
): entry is { examSubjects: readonly ExamSubjectEntry[]; year: number | string } {
  if (typeof entry !== 'object' || entry === null) {
    return false;
  }
  if (!('examSubjects' in entry)) {
    return false;
  }
  const examSubjects: unknown = entry.examSubjects;
  return Array.isArray(examSubjects);
}

/** Extracts unit slugs from a unit entry, handling unitOptions. */
export function extractUnitSlugs(unit: UnitEntry): readonly string[] {
  if (unit.unitOptions && unit.unitOptions.length > 0) {
    return unit.unitOptions.map((opt) => opt.unitSlug);
  }
  if (unit.unitSlug) {
    return [unit.unitSlug];
  }
  return [];
}

/** Empty context for units not in the KS4 context map. */
export const EMPTY_AGGREGATED_CONTEXT: AggregatedUnitContext = {
  tiers: [],
  tierTitles: [],
  examSubjects: [],
  examSubjectTitles: [],
};

/** Removes duplicates from an array while preserving order. */
function deduplicateArray(arr: readonly string[]): readonly string[] {
  return [...new Set(arr)];
}

/** Merges a single context into the aggregated result. */
export function mergeIntoAggregated(
  existing: AggregatedUnitContext,
  context: UnitContext,
): AggregatedUnitContext {
  return {
    tiers: deduplicateArray([...existing.tiers, ...context.tiers]),
    tierTitles: deduplicateArray([...existing.tierTitles, ...context.tierTitles]),
    examSubjects: deduplicateArray([...existing.examSubjects, ...context.examSubjects]),
    examSubjectTitles: deduplicateArray([
      ...existing.examSubjectTitles,
      ...context.examSubjectTitles,
    ]),
  };
}

/** Creates initial aggregated context from a unit context. */
export function toAggregated(context: UnitContext): AggregatedUnitContext {
  return {
    tiers: [...context.tiers],
    tierTitles: [...context.tierTitles],
    examSubjects: [...context.examSubjects],
    examSubjectTitles: [...context.examSubjectTitles],
  };
}
