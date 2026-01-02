/**
 * Bulk sequence transformer for Elasticsearch.
 * @remarks Extracts sequence data from bulk download files and transforms them
 * into Elasticsearch documents for the `oak_sequences` and `oak_sequence_facets` indexes.
 * Follows DRY by reusing shared helpers and document builders.
 * @see ADR-093 Bulk-First Ingestion Strategy
 * @module adapters/bulk-sequence-transformer
 */
import type { BulkDownloadFile, Unit, Lesson } from '@oaknational/oak-curriculum-sdk/public/bulk';
import type { BulkOperationEntry, BulkIndexAction } from '../lib/indexing/bulk-operation-types';
import type { CreateSequenceDocumentParams } from '../lib/indexing/sequence-document-builder';
import {
  createSequenceFacetDoc,
  type CreateSequenceFacetDocParams,
} from '../lib/indexing/sequence-facets';
import { createSequenceDocument } from '../lib/indexing/sequence-document-builder';
import {
  derivePhaseSlug,
  normaliseSubjectSlug,
  generateSequenceCanonicalUrl,
  deriveSubjectSlugFromSequence,
} from './bulk-transform-helpers';
import { isSubject } from './sdk-guards';
import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import { getCategoriesForUnit, type CategoryMap } from './category-supplementation';

/** Accumulated unit data grouped by key stage. */
interface KeyStageUnitAccumulator {
  readonly keyStage: KeyStage;
  readonly unitSlugs: string[];
  readonly unitTitles: string[];
  readonly years: Set<string>;
  lessonCount: number;
}

/**
 * Derives and validates subject slug from sequence slug.
 *
 * @param sequenceSlug - The sequence slug (e.g., 'maths-primary')
 * @returns Validated SearchSubjectSlug
 * @throws If the derived subject is not a valid subject slug
 */
function deriveAndValidateSubjectSlug(sequenceSlug: string): SearchSubjectSlug {
  const subjectPart = deriveSubjectSlugFromSequence(sequenceSlug);
  const normalised = normaliseSubjectSlug(subjectPart);
  if (!isSubject(normalised)) {
    throw new Error(`Cannot derive valid subject from sequence: ${sequenceSlug}`);
  }
  return normalised;
}

/** Capitalises the first letter of a string. */
function capitalise(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Gets year string from unit, handling "All years" case. */
function getYearString(unit: Unit): string {
  return unit.year === 'All years' ? unit.yearSlug : String(unit.year);
}

/** Finds key stage title from lessons (bulk Unit lacks keyStageTitle). */
function findKeyStageTitle(keyStage: KeyStage, lessons: readonly Lesson[]): string {
  const lesson = lessons.find((l) => l.keyStageSlug === keyStage);
  return lesson ? lesson.keyStageTitle : `Key Stage ${keyStage.slice(2)}`;
}

/** Validates a key stage slug is a valid KeyStage. */
function isValidKeyStage(slug: string): slug is KeyStage {
  return slug === 'ks1' || slug === 'ks2' || slug === 'ks3' || slug === 'ks4';
}

/**
 * Collects unique category titles from all units in a sequence.
 *
 * @param units - Units from bulk file
 * @param categoryMap - Optional category map for supplementation
 * @returns Sorted array of unique category titles
 */
function collectCategoryTitles(
  units: readonly Unit[],
  categoryMap: CategoryMap | undefined,
): readonly string[] {
  if (!categoryMap) {
    return [];
  }

  const titles = new Set<string>();
  for (const unit of units) {
    const categories = getCategoriesForUnit(categoryMap, unit.unitSlug);
    if (categories) {
      for (const cat of categories) {
        titles.add(cat.title);
      }
    }
  }
  return Array.from(titles).sort();
}

/**
 * Extracts sequence document params from a bulk file.
 *
 * @param bulkFile - The bulk download file
 * @param categoryMap - Optional category map for aggregating category titles
 * @returns Params for creating a sequence document via `createSequenceDocument()`
 */
export function extractSequenceParamsFromBulkFile(
  bulkFile: BulkDownloadFile,
  categoryMap?: CategoryMap,
): CreateSequenceDocumentParams {
  const subjectSlug = deriveAndValidateSubjectSlug(bulkFile.sequenceSlug);
  const phaseSlug = derivePhaseSlug(bulkFile.sequenceSlug);
  const phaseTitle = capitalise(phaseSlug);
  const keyStagesSet = new Set<string>();
  const yearsSet = new Set<string>();
  const unitSlugs: string[] = [];
  for (const unit of bulkFile.sequence) {
    keyStagesSet.add(unit.keyStageSlug);
    yearsSet.add(getYearString(unit));
    unitSlugs.push(unit.unitSlug);
  }
  const categoryTitles = collectCategoryTitles(bulkFile.sequence, categoryMap);
  return {
    sequenceSlug: bulkFile.sequenceSlug,
    subjectSlug,
    subjectTitle: bulkFile.subjectTitle,
    phaseSlug,
    phaseTitle,
    keyStages: Array.from(keyStagesSet).sort(),
    years: Array.from(yearsSet).sort(),
    unitSlugs,
    categoryTitles,
  };
}

/** Groups units by key stage and accumulates data. */
function groupUnitsByKeyStage(units: readonly Unit[]): Map<KeyStage, KeyStageUnitAccumulator> {
  const groups = new Map<KeyStage, KeyStageUnitAccumulator>();
  for (const unit of units) {
    if (!isValidKeyStage(unit.keyStageSlug)) {
      continue;
    }
    const keyStage = unit.keyStageSlug;
    const existing = groups.get(keyStage);
    if (existing) {
      existing.unitSlugs.push(unit.unitSlug);
      existing.unitTitles.push(unit.unitTitle);
      existing.years.add(getYearString(unit));
      existing.lessonCount += unit.unitLessons.length;
    } else {
      groups.set(keyStage, {
        keyStage,
        unitSlugs: [unit.unitSlug],
        unitTitles: [unit.unitTitle],
        years: new Set([getYearString(unit)]),
        lessonCount: unit.unitLessons.length,
      });
    }
  }
  return groups;
}

/**
 * Extracts sequence facet params from a bulk file.
 * @param bulkFile - The bulk download file
 * @returns Array of params, one per key stage, for `createSequenceFacetDoc()`
 */
export function extractSequenceFacetParamsFromBulkFile(
  bulkFile: BulkDownloadFile,
): readonly CreateSequenceFacetDocParams[] {
  const subjectSlug = deriveAndValidateSubjectSlug(bulkFile.sequenceSlug);
  const phaseSlug = derivePhaseSlug(bulkFile.sequenceSlug);
  const phaseTitle = capitalise(phaseSlug);
  const hasKs4Options = Boolean(bulkFile.ks4Options && bulkFile.ks4Options.length > 0);
  const canonicalUrl = generateSequenceCanonicalUrl(bulkFile.sequenceSlug);
  const groups = groupUnitsByKeyStage(bulkFile.sequence);
  const results: CreateSequenceFacetDocParams[] = [];
  for (const [keyStage, group] of groups) {
    const keyStageTitle = findKeyStageTitle(keyStage, bulkFile.lessons);
    results.push({
      sequenceSlug: bulkFile.sequenceSlug,
      subjectSlug,
      phaseSlug,
      phaseTitle,
      keyStage,
      keyStageTitle,
      years: Array.from(group.years).sort(),
      unitSlugs: group.unitSlugs,
      unitTitles: group.unitTitles,
      lessonCount: group.lessonCount,
      hasKs4Options,
      canonicalUrl,
    });
  }
  return results;
}

/** Builds bulk operations for a single bulk file. */
function buildOpsForFile(
  bulkFile: BulkDownloadFile,
  sequencesIndex: string,
  facetsIndex: string,
  categoryMap?: CategoryMap,
): BulkOperationEntry[] {
  const ops: BulkOperationEntry[] = [];
  const seqParams = extractSequenceParamsFromBulkFile(bulkFile, categoryMap);
  const seqDoc = createSequenceDocument(seqParams);
  const seqAction: BulkIndexAction = {
    index: { _index: sequencesIndex, _id: bulkFile.sequenceSlug },
  };
  ops.push(seqAction, seqDoc);
  const facetParamsList = extractSequenceFacetParamsFromBulkFile(bulkFile);
  for (const facetParams of facetParamsList) {
    const facetDoc = createSequenceFacetDoc(facetParams);
    const facetId = `${facetParams.subjectSlug}-${facetParams.sequenceSlug}-${facetParams.keyStage}`;
    const facetAction: BulkIndexAction = {
      index: { _index: facetsIndex, _id: facetId },
    };
    ops.push(facetAction, facetDoc);
  }
  return ops;
}

/**
 * Builds Elasticsearch bulk operations for sequences from all bulk files.
 *
 * @param bulkFiles - Array of bulk download files
 * @param sequencesIndex - Name of the sequences index
 * @param facetsIndex - Name of the sequence facets index
 * @param categoryMap - Optional category map for enriching sequences with category titles
 * @returns Array of bulk operations (alternating action and document)
 */
export function buildSequenceBulkOperations(
  bulkFiles: readonly BulkDownloadFile[],
  sequencesIndex: string,
  facetsIndex: string,
  categoryMap?: CategoryMap,
): BulkOperationEntry[] {
  const ops: BulkOperationEntry[] = [];
  for (const bulkFile of bulkFiles) {
    ops.push(...buildOpsForFile(bulkFile, sequencesIndex, facetsIndex, categoryMap));
  }
  return ops;
}
