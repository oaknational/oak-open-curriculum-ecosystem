/**
 * BulkDataAdapter - Transforms bulk download data into ES documents.
 *
 * @remarks
 * This adapter takes parsed bulk download files (from the SDK) and transforms
 * them into Elasticsearch document format. It serves as the primary data source
 * for bulk-first ingestion.
 *
 * @see `@oaknational/sdk-codegen/bulk` for source types
 * @see src/types/oak for ES document types
 */

import type { Lesson, Unit, BulkDownloadFile } from '@oaknational/sdk-codegen/bulk';
import { SUBJECT_TO_PARENT, isAllSubject } from '@oaknational/curriculum-sdk';
import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  AllSubjectSlug,
  ParentSubjectSlug,
} from '../types/oak';
import {
  deriveSubjectSlugFromSequence,
  generateSubjectProgrammesUrl,
  generateUnitUrlFromSequence,
  normaliseYearsFromUnit,
} from './bulk-transform-helpers.js';
import {
  transformBulkLessonToESDoc,
  type LessonUnitInfo,
  type BulkToESLessonParams,
} from './bulk-lesson-transformer.js';
import { transformBulkUnitToESDoc, type BulkToESUnitParams } from './bulk-unit-transformer.js';

// Re-export transform functions and types for external use
export { transformBulkLessonToESDoc, type BulkToESLessonParams, type LessonUnitInfo };
export { transformBulkUnitToESDoc, type BulkToESUnitParams };

// ============================================================================
// Types
// ============================================================================

/** Bulk operation for ES bulk API */
export interface BulkIndexAction {
  readonly index: {
    readonly _index: string;
    readonly _id: string;
  };
}

/** Interface for the bulk data adapter */
export interface BulkDataAdapter {
  readonly sequenceSlug: string;
  readonly subjectTitle: string;
  getUnits(): readonly Unit[];
  getLessons(): readonly Lesson[];
  getLessonsByUnit(unitSlug: string): readonly Lesson[];
  transformLessonsToES(): readonly SearchLessonsIndexDoc[];
  transformUnitsToES(): readonly SearchUnitsIndexDoc[];
  toBulkOperations(
    lessonsIndex: string,
    unitsIndex: string,
  ): readonly (BulkIndexAction | SearchLessonsIndexDoc | SearchUnitsIndexDoc)[];
}

// ============================================================================
// Adapter Factory
// ============================================================================

/** Build lesson lookup map by unit slug */
function buildLessonsByUnitMap(lessons: readonly Lesson[]): Map<string, Lesson[]> {
  const map = new Map<string, Lesson[]>();
  for (const lesson of lessons) {
    const existing = map.get(lesson.unitSlug) ?? [];
    existing.push(lesson);
    map.set(lesson.unitSlug, existing);
  }
  return map;
}

/**
 * Derive subject slug from sequence, returning a validated AllSubjectSlug.
 * @see ADR-101 - Subject hierarchy for search filtering
 */
function deriveSubjectSlug(sequenceSlug: string): AllSubjectSlug {
  const derivedSubjectSlug = deriveSubjectSlugFromSequence(sequenceSlug);

  if (!isAllSubject(derivedSubjectSlug)) {
    throw new Error(`Cannot derive valid subject from sequence: ${sequenceSlug}`);
  }
  return derivedSubjectSlug;
}

/** Create lesson transform function */
function createLessonTransformer(
  bulkFile: BulkDownloadFile,
  unitMap: Map<string, Unit>,
  sequenceSlug: string,
) {
  return (): readonly SearchLessonsIndexDoc[] =>
    bulkFile.lessons.map((lesson) => {
      const unit = unitMap.get(lesson.unitSlug);
      const years = unit ? normaliseYearsFromUnit(unit.year, unit.yearSlug) : [];
      const unitInfo: LessonUnitInfo = {
        unitSlug: lesson.unitSlug,
        unitTitle: lesson.unitTitle,
        canonicalUrl: generateUnitUrlFromSequence(lesson.unitSlug, sequenceSlug),
        threadSlugs: unit?.threads.map((thread) => thread.slug) ?? [],
        threadTitles: unit?.threads.map((thread) => thread.title) ?? [],
      };
      return transformBulkLessonToESDoc({ lesson, unitInfo, years });
    });
}

/** Create unit transform function */
function createUnitTransformer(
  bulkFile: BulkDownloadFile,
  subjectSlug: AllSubjectSlug,
  subjectParent: ParentSubjectSlug,
) {
  return (): readonly SearchUnitsIndexDoc[] => {
    const firstUnit = bulkFile.sequence[0];
    const keyStageSlug = firstUnit?.keyStageSlug ?? 'ks2';
    const subjectProgrammesUrl = generateSubjectProgrammesUrl(subjectSlug, keyStageSlug);

    return bulkFile.sequence.map((unit) =>
      transformBulkUnitToESDoc({
        unit,
        subjectSlug,
        subjectParent,
        subjectTitle: bulkFile.subjectTitle,
        subjectProgrammesUrl,
        sequenceSlug: bulkFile.sequenceSlug,
      }),
    );
  };
}

/**
 * Create a BulkDataAdapter from parsed bulk file data.
 */
export function createBulkDataAdapter(bulkFile: BulkDownloadFile): BulkDataAdapter {
  const lessonsByUnitMap = buildLessonsByUnitMap(bulkFile.lessons);
  const unitMap = new Map(bulkFile.sequence.map((u) => [u.unitSlug, u]));
  const subjectSlug = deriveSubjectSlug(bulkFile.sequenceSlug);
  const subjectParent = SUBJECT_TO_PARENT[subjectSlug];

  const transformLessonsToES = createLessonTransformer(bulkFile, unitMap, bulkFile.sequenceSlug);
  const transformUnitsToES = createUnitTransformer(bulkFile, subjectSlug, subjectParent);

  return {
    sequenceSlug: bulkFile.sequenceSlug,
    subjectTitle: bulkFile.subjectTitle,
    getUnits: () => bulkFile.sequence,
    getLessons: () => bulkFile.lessons,
    getLessonsByUnit: (unitSlug) => lessonsByUnitMap.get(unitSlug) ?? [],
    transformLessonsToES,
    transformUnitsToES,
    toBulkOperations(lessonsIndex, unitsIndex) {
      const ops: (BulkIndexAction | SearchLessonsIndexDoc | SearchUnitsIndexDoc)[] = [];
      for (const doc of transformLessonsToES()) {
        ops.push({ index: { _index: lessonsIndex, _id: doc.lesson_id } });
        ops.push(doc);
      }
      for (const doc of transformUnitsToES()) {
        ops.push({ index: { _index: unitsIndex, _id: doc.unit_id } });
        ops.push(doc);
      }
      return ops;
    },
  };
}
