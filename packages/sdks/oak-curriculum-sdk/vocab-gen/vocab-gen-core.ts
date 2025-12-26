/**
 * Core processing logic for the vocabulary mining pipeline.
 *
 * @remarks
 * This module contains the pure functions for processing bulk download data.
 * Separated from IO for testability.
 *
 * @module vocab-gen/vocab-gen-core
 */
import {
  extractKeywords,
  extractLearningPoints,
  extractMisconceptions,
  extractNCStatements,
  extractPriorKnowledge,
  extractTeacherTips,
  extractThreads,
  type ExtractedKeyword,
  type ExtractedLearningPoint,
  type ExtractedMisconception,
  type ExtractedNCStatement,
  type ExtractedPriorKnowledge,
  type ExtractedTeacherTip,
  type ExtractedThread,
} from './extractors/index.js';
import type { Lesson, Unit } from './lib/index.js';

/**
 * Input data for processing bulk download files.
 * This type allows testing without file IO.
 */
export interface BulkDataInput {
  readonly sequenceSlug: string;
  readonly lessons: readonly Lesson[];
  readonly units: readonly Unit[];
}

/**
 * Extraction statistics from processing bulk data.
 */
export interface ExtractionStats {
  readonly uniqueKeywords: number;
  readonly totalMisconceptions: number;
  readonly totalLearningPoints: number;
  readonly totalTeacherTips: number;
  readonly totalPriorKnowledge: number;
  readonly totalNCStatements: number;
  readonly uniqueThreads: number;
}

/**
 * All extracted vocabulary data from the mining pipeline.
 *
 * @remarks
 * Contains the full extracted data structures for consumption by generators.
 * Each array contains rich metadata suitable for graph generation.
 */
export interface ExtractedData {
  /** Unique keywords with definitions, frequency, and subject distribution */
  readonly keywords: readonly ExtractedKeyword[];
  /** Misconceptions with responses and lesson context */
  readonly misconceptions: readonly ExtractedMisconception[];
  /** Learning points from lessons */
  readonly learningPoints: readonly ExtractedLearningPoint[];
  /** Teacher tips with lesson context */
  readonly teacherTips: readonly ExtractedTeacherTip[];
  /** Prior knowledge requirements from units */
  readonly priorKnowledge: readonly ExtractedPriorKnowledge[];
  /** National Curriculum statements from units */
  readonly ncStatements: readonly ExtractedNCStatement[];
  /** Thread progressions with ordered units */
  readonly threads: readonly ExtractedThread[];
}

/**
 * Collects all lessons from bulk download data.
 */
function collectAllLessons(data: readonly BulkDataInput[]): readonly Lesson[] {
  const lessons: Lesson[] = [];
  for (const file of data) {
    lessons.push(...file.lessons);
  }
  return lessons;
}

/**
 * Collects all units with their sequence slugs from bulk download data.
 */
function collectAllUnits(
  data: readonly BulkDataInput[],
): readonly { unit: Unit; sequenceSlug: string }[] {
  const units: { unit: Unit; sequenceSlug: string }[] = [];
  for (const file of data) {
    for (const unit of file.units) {
      units.push({ unit, sequenceSlug: file.sequenceSlug });
    }
  }
  return units;
}

/**
 * Result of running all extractors.
 */
interface ExtractionResult {
  readonly stats: ExtractionStats;
  readonly data: ExtractedData;
}

/**
 * Runs all extractors on the provided data.
 *
 * @remarks
 * Returns both statistics (for reporting) and full extracted data (for generators).
 */
function runExtractors(
  lessons: readonly Lesson[],
  units: readonly { unit: Unit; sequenceSlug: string }[],
): ExtractionResult {
  const keywords = extractKeywords(lessons);
  const misconceptions = extractMisconceptions(lessons);
  const learningPoints = extractLearningPoints(lessons);
  const teacherTips = extractTeacherTips(lessons);
  const priorKnowledge = extractPriorKnowledge(units);
  const ncStatements = extractNCStatements(units);
  const threads = extractThreads(units);

  return {
    stats: {
      uniqueKeywords: keywords.length,
      totalMisconceptions: misconceptions.length,
      totalLearningPoints: learningPoints.length,
      totalTeacherTips: teacherTips.length,
      totalPriorKnowledge: priorKnowledge.length,
      totalNCStatements: ncStatements.length,
      uniqueThreads: threads.length,
    },
    data: {
      keywords,
      misconceptions,
      learningPoints,
      teacherTips,
      priorKnowledge,
      ncStatements,
      threads,
    },
  };
}

/**
 * Result of processing bulk download data.
 *
 * @remarks
 * Contains both statistics (for CLI output) and full extracted data (for generators).
 */
export interface ProcessingResult {
  readonly filesProcessed: number;
  readonly totalLessons: number;
  readonly totalUnits: number;
  readonly stats: ExtractionStats;
  /** Full extracted data for consumption by generators */
  readonly extractedData: ExtractedData;
}

/**
 * Processes bulk download data and returns extraction results.
 *
 * @remarks
 * This is the core pipeline logic, separated from IO for testability.
 * Returns both statistics (for CLI reporting) and full extracted data
 * (for consumption by generators).
 *
 * @param data - Array of bulk download data (one per file)
 * @returns Processing result with stats and extracted data
 */
export function processBulkData(data: readonly BulkDataInput[]): ProcessingResult {
  const allLessons = collectAllLessons(data);
  const allUnits = collectAllUnits(data);
  const extraction = runExtractors(allLessons, allUnits);

  return {
    filesProcessed: data.length,
    totalLessons: allLessons.length,
    totalUnits: allUnits.length,
    stats: extraction.stats,
    extractedData: extraction.data,
  };
}
