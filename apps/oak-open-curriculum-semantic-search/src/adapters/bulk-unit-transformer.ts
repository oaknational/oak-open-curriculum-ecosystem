/**
 * Bulk unit to ES document transformer.
 *
 * @remarks
 * Extracts unit data from bulk download files and transforms them into
 * Elasticsearch documents for the oak_units index via the shared
 * `buildUnitDocument()` builder.
 *
 * Follows DRY by reusing the shared document builder, ensuring a single source
 * of truth for unit document creation logic.
 *
 * Supports category supplementation via CategoryMap for enriching units with
 * category data that isn't available in bulk downloads.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 * @see buildUnitDocument - Shared document builder
 * @see category-supplementation.ts - Category map for enrichment
 * @module adapters/bulk-unit-transformer
 */

import type { Unit } from '@oaknational/oak-curriculum-sdk/public/bulk.js';
import type { SearchUnitsIndexDoc, SearchSubjectSlug } from '../types/oak';
import { isKeyStage } from './sdk-guards';
import {
  generateUnitUrl,
  normaliseYearsFromUnit,
  getKeyStageTitle,
} from './bulk-transform-helpers.js';
import { buildUnitDocument, type CreateUnitDocParams } from '../lib/indexing/unit-document-core';
import {
  getCategoriesForUnit,
  extractCategoryTitles,
  type CategoryMap,
} from './category-supplementation';

/** Parameters for transforming a bulk unit to ES document */
export interface BulkToESUnitParams {
  readonly unit: Unit;
  readonly subjectSlug: SearchSubjectSlug;
  readonly subjectTitle: string;
  readonly subjectProgrammesUrl: string;
  /**
   * Optional category map for enriching units with category data.
   * Built from API sequences/units endpoint.
   * @see buildCategoryMap
   */
  readonly categoryMap?: CategoryMap;
}

/** Extract thread information from bulk unit */
function extractThreadInfoFromBulk(unit: Unit) {
  if (unit.threads.length === 0) {
    return undefined;
  }
  return {
    slugs: unit.threads.map((t) => t.slug),
    titles: unit.threads.map((t) => t.title),
    orders: unit.threads.map((t) => t.order),
  };
}

/**
 * Resolves unit_topics from category map or returns undefined.
 */
function resolveUnitTopics(
  unitSlug: string,
  categoryMap: CategoryMap | undefined,
): readonly string[] | undefined {
  if (!categoryMap) {
    return undefined;
  }
  const categories = getCategoriesForUnit(categoryMap, unitSlug);
  return extractCategoryTitles(categories);
}

/**
 * Extracts unit document params from a bulk unit.
 *
 * This function transforms bulk-specific types into the input-agnostic
 * `CreateUnitDocParams` interface used by the shared builder.
 *
 * If a categoryMap is provided, unit_topics will be populated from it.
 * Otherwise, unit_topics will be undefined.
 *
 * @param params - Bulk unit params (optionally with categoryMap)
 * @returns Params for `buildUnitDocument()`
 */
export function extractUnitParamsFromBulk(params: BulkToESUnitParams): CreateUnitDocParams {
  const { unit, subjectSlug, subjectTitle, subjectProgrammesUrl, categoryMap } = params;

  const keyStage = isKeyStage(unit.keyStageSlug)
    ? unit.keyStageSlug
    : (() => {
        throw new Error(`Invalid key stage: ${unit.keyStageSlug}`);
      })();

  const phaseSlug = keyStage === 'ks1' || keyStage === 'ks2' ? 'primary' : 'secondary';
  const unitTopics = resolveUnitTopics(unit.unitSlug, categoryMap);

  return {
    unitSlug: unit.unitSlug,
    unitTitle: unit.unitTitle,
    subjectSlug,
    subjectTitle,
    keyStage,
    keyStageTitle: getKeyStageTitle(keyStage),
    years: normaliseYearsFromUnit(unit.year, unit.yearSlug),
    lessonIds: unit.unitLessons.map((l) => l.lessonSlug),
    unitUrl: generateUnitUrl(unit.unitSlug, subjectSlug, phaseSlug),
    subjectProgrammesUrl,
    threadInfo: extractThreadInfoFromBulk(unit),
    enrichment: {
      unit_topics: unitTopics,
      description: unit.description || undefined,
      why_this_why_now: unit.whyThisWhyNow || undefined,
      prior_knowledge_requirements:
        unit.priorKnowledgeRequirements.length > 0 ? unit.priorKnowledgeRequirements : undefined,
      national_curriculum_content:
        unit.nationalCurriculumContent.length > 0 ? unit.nationalCurriculumContent : undefined,
    },
    ks4: undefined, // KS4 is added via enrichment in HybridDataSource
  };
}

/**
 * Transform a bulk unit into an ES unit document.
 *
 * Uses the shared `buildUnitDocument()` builder to ensure DRY compliance
 * and a single source of truth for unit document creation logic.
 *
 * @param params - Bulk unit params
 * @returns SearchUnitsIndexDoc ready for ES indexing
 *
 * @see buildUnitDocument - Shared builder this delegates to
 */
export function transformBulkUnitToESDoc(params: BulkToESUnitParams): SearchUnitsIndexDoc {
  const docParams = extractUnitParamsFromBulk(params);
  return buildUnitDocument(docParams);
}
