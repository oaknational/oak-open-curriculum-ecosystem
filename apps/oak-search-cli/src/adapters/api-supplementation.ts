/**
 * API supplementation for bulk data enrichment.
 *
 * @remarks
 * The bulk download data lacks certain fields that are available via the API:
 * - KS4 tier information (tiers, exam boards, exam subjects)
 * - Categories (unit topics)
 *
 * This module provides functions to fetch and merge these fields from the API.
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import type { OakClient } from './oak-adapter';
import {
  buildKs4ContextMap,
  getKs4ContextForUnit,
  type UnitContextMap,
  type SubjectSequenceInfo,
} from '../lib/indexing/ks4-context-builder';
import { extractKs4DocumentFields } from '../lib/indexing/document-transform-helpers';
import type { SearchLessonsIndexDoc, SearchUnitsIndexDoc, SearchSubjectSlug } from '../types/oak';
import type { Ks4DocumentFields } from '../lib/indexing/document-transform-helpers';
import { ingestLogger } from '../lib/logger';

/**
 * Result of KS4 supplementation for a document.
 */
interface Ks4SupplementationResult {
  /** KS4 fields to merge into the document */
  readonly ks4Fields: Ks4DocumentFields;
  /** Whether any KS4 data was found */
  readonly hasKs4Data: boolean;
}

/**
 * KS4 supplementation context built from API data.
 */
export interface Ks4SupplementationContext {
  /** Map of unit slugs to aggregated KS4 context */
  readonly unitContextMap: UnitContextMap;
  /** Subject slug this context was built for */
  readonly subjectSlug: string;
}

/**
 * Builds KS4 supplementation context by fetching sequence data from the API.
 *
 * @param client - Oak API client
 * @param subjectSlug - Subject to fetch KS4 data for
 * @returns KS4 context for supplementing bulk data
 *
 * @example
 * ```ts
 * const client = await createOakClient();
 * const ks4Context = await buildKs4SupplementationContext(client, 'maths');
 * const ks4Fields = getKs4FieldsForUnit(ks4Context, 'algebra-unit');
 * ```
 */
export async function buildKs4SupplementationContext(
  client: OakClient,
  subjectSlug: SearchSubjectSlug,
): Promise<Ks4SupplementationContext> {
  ingestLogger.debug('Building KS4 supplementation context', { subjectSlug });
  // Fetch sequences for the subject
  const sequencesResult = await client.getSubjectSequences(subjectSlug);

  if (!sequencesResult.ok) {
    // No sequences available - return empty context
    return {
      unitContextMap: new Map(),
      subjectSlug,
    };
  }

  const sequences = sequencesResult.value;

  // Convert to SubjectSequenceInfo format
  const sequenceInfos: SubjectSequenceInfo[] = sequences.map((seq) => ({
    sequenceSlug: seq.sequenceSlug,
    ks4Options: seq.ks4Options ?? null,
  }));

  // Build context map by fetching sequence units
  const fetchSequenceUnits = async (slug: string): Promise<unknown> => {
    const result = await client.getSequenceUnits(slug);
    return result.ok ? result.value : [];
  };

  const unitContextMap = await buildKs4ContextMap(fetchSequenceUnits, sequenceInfos);

  return {
    unitContextMap,
    subjectSlug,
  };
}

/**
 * Gets KS4 fields for a unit from the supplementation context.
 *
 * @param context - KS4 supplementation context
 * @param unitSlug - Unit slug to get KS4 data for
 * @returns KS4 fields to merge into document
 */
/** Check if any array field has values */
function hasValues(arr: string[] | undefined): boolean {
  return (arr?.length ?? 0) > 0;
}

export function getKs4FieldsForUnit(
  context: Ks4SupplementationContext,
  unitSlug: string,
): Ks4SupplementationResult {
  const aggregatedContext = getKs4ContextForUnit(context.unitContextMap, unitSlug);
  const ks4Fields = extractKs4DocumentFields(aggregatedContext);
  const hasKs4Data =
    hasValues(ks4Fields.tiers) ||
    hasValues(ks4Fields.exam_boards) ||
    hasValues(ks4Fields.exam_subjects);

  return { ks4Fields, hasKs4Data };
}

/**
 * Enriches a unit document with KS4 fields from API supplementation.
 *
 * @param doc - Unit document to enrich
 * @param context - KS4 supplementation context
 * @returns Enriched document (new object, original unchanged)
 */
export function enrichUnitDocWithKs4(
  doc: SearchUnitsIndexDoc,
  context: Ks4SupplementationContext,
): SearchUnitsIndexDoc {
  const { ks4Fields, hasKs4Data } = getKs4FieldsForUnit(context, doc.unit_slug);

  if (!hasKs4Data) {
    return doc;
  }

  return {
    ...doc,
    ...ks4Fields,
  };
}

/**
 * Enriches a lesson document with KS4 fields from API supplementation.
 *
 * @param doc - Lesson document to enrich
 * @param context - KS4 supplementation context
 * @returns Enriched document (new object, original unchanged)
 */
export function enrichLessonDocWithKs4(
  doc: SearchLessonsIndexDoc,
  context: Ks4SupplementationContext,
): SearchLessonsIndexDoc {
  // Use primary unit for KS4 context
  const primaryUnitSlug = doc.unit_ids[0];
  if (!primaryUnitSlug) {
    return doc;
  }

  const { ks4Fields, hasKs4Data } = getKs4FieldsForUnit(context, primaryUnitSlug);

  if (!hasKs4Data) {
    return doc;
  }

  return {
    ...doc,
    ...ks4Fields,
  };
}

/**
 * Determines if a document is KS4 and needs supplementation.
 *
 * @param keyStage - Key stage slug
 * @returns True if KS4
 */
export function isKs4(keyStage: string): boolean {
  return keyStage === 'ks4';
}

/**
 * Subject slugs that have KS4 tier differentiation.
 * Currently only Maths has tiers; Science has exam subjects.
 */
const SUBJECTS_WITH_KS4_TIERS = ['maths', 'science'] as const;

/** Type guard for subjects with KS4 tiers */
function isSubjectWithKs4Tiers(slug: string): slug is (typeof SUBJECTS_WITH_KS4_TIERS)[number] {
  for (const subject of SUBJECTS_WITH_KS4_TIERS) {
    if (subject === slug) {
      return true;
    }
  }
  return false;
}

/**
 * Checks if a subject has KS4 tier differentiation.
 *
 * @param subjectSlug - Subject slug
 * @returns True if subject has KS4 tiers
 */
export function subjectHasKs4Tiers(subjectSlug: string): boolean {
  return isSubjectWithKs4Tiers(subjectSlug);
}
