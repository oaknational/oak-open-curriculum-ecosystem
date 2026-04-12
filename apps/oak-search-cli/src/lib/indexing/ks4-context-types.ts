/**
 * KS4 context types and type guards for denormalising tier, exam board, and exam subject metadata.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import type { LogContextInput } from '@oaknational/logger';

/**
 * Known exam boards that can be parsed from sequence slugs.
 * Extracted from the slug pattern: `{subject}-secondary-{examBoard}`
 */
export const KNOWN_EXAM_BOARDS = [
  { slug: 'aqa', title: 'AQA' },
  { slug: 'edexcel', title: 'Edexcel' },
  { slug: 'ocr', title: 'OCR' },
  { slug: 'eduqas', title: 'Eduqas' },
  { slug: 'edexcelb', title: 'Edexcel B' },
] as const;

/** Exam board information extracted from a sequence slug. */
export interface ExamBoard {
  readonly slug: string;
  readonly title: string;
}

/** KS4 option information from the subjects API. */
export interface Ks4Option {
  readonly slug: string;
  readonly title: string;
}

/**
 * Context for a single unit, representing one occurrence in a sequence.
 * A unit can appear in multiple sequences with different contexts,
 * so these get merged into arrays in the final UnitContextMap.
 */
export interface UnitContext {
  readonly unitSlug: string;
  readonly tiers: readonly string[];
  readonly tierTitles: readonly string[];
  readonly examBoards: readonly string[];
  readonly examBoardTitles: readonly string[];
  readonly examSubjects: readonly string[];
  readonly examSubjectTitles: readonly string[];
  readonly ks4Options: readonly string[];
  readonly ks4OptionTitles: readonly string[];
}

/** Aggregated KS4 metadata for a unit, with all values merged from multiple sequences. */
export interface AggregatedUnitContext {
  readonly tiers: readonly string[];
  readonly tierTitles: readonly string[];
  readonly examBoards: readonly string[];
  readonly examBoardTitles: readonly string[];
  readonly examSubjects: readonly string[];
  readonly examSubjectTitles: readonly string[];
  readonly ks4Options: readonly string[];
  readonly ks4OptionTitles: readonly string[];
}

/** Map of unit slug to aggregated KS4 context. Used during document indexing. */
export type UnitContextMap = Map<string, AggregatedUnitContext>;

/** Subject sequence entry from the subjects API. */
export interface SubjectSequenceInfo {
  readonly sequenceSlug: string;
  readonly ks4Options?: { slug: string; title: string } | null;
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
export interface UnitEntry {
  readonly unitSlug?: string;
  readonly unitTitle: string;
  readonly unitOrder: number;
  readonly unitOptions?: readonly { unitSlug: string; unitTitle: string }[];
}

/** Context params for building unit contexts. */
export interface ContextParams {
  examBoard: ExamBoard | null;
  ks4Option: Ks4Option | null;
}

/** Logger interface for KS4 context building. */
export interface Ks4Logger {
  debug: (msg: string, data?: Ks4LogData) => void;
}

/** Log data for KS4 context operations. */
export interface Ks4LogData extends LogContextInput {
  sequenceSlug?: string;
  examBoard?: string | null;
  ks4Option?: string | null;
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
  examBoards: [],
  examBoardTitles: [],
  examSubjects: [],
  examSubjectTitles: [],
  ks4Options: [],
  ks4OptionTitles: [],
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
    examBoards: deduplicateArray([...existing.examBoards, ...context.examBoards]),
    examBoardTitles: deduplicateArray([...existing.examBoardTitles, ...context.examBoardTitles]),
    examSubjects: deduplicateArray([...existing.examSubjects, ...context.examSubjects]),
    examSubjectTitles: deduplicateArray([
      ...existing.examSubjectTitles,
      ...context.examSubjectTitles,
    ]),
    ks4Options: deduplicateArray([...existing.ks4Options, ...context.ks4Options]),
    ks4OptionTitles: deduplicateArray([...existing.ks4OptionTitles, ...context.ks4OptionTitles]),
  };
}

/** Creates initial aggregated context from a unit context. */
export function toAggregated(context: UnitContext): AggregatedUnitContext {
  return {
    tiers: [...context.tiers],
    tierTitles: [...context.tierTitles],
    examBoards: [...context.examBoards],
    examBoardTitles: [...context.examBoardTitles],
    examSubjects: [...context.examSubjects],
    examSubjectTitles: [...context.examSubjectTitles],
    ks4Options: [...context.ks4Options],
    ks4OptionTitles: [...context.ks4OptionTitles],
  };
}

/** Extracts Ks4Option from sequence info. */
export function extractKs4Option(seq: SubjectSequenceInfo): Ks4Option | null {
  return seq.ks4Options ? { slug: seq.ks4Options.slug, title: seq.ks4Options.title } : null;
}
