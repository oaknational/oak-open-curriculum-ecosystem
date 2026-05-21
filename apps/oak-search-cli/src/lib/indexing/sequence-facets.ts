/**
 * Sequence facet document builder and live-API source extraction.
 *
 * The sequence facet document (`oak_sequence_facets` index) is emitted by the
 * bulk-data ingestion pipeline (`bulk-sequence-transformer.ts`) which has
 * authoritative `ks4Options` data from the bulk schema. The live-API path no
 * longer emits this document type because the v0.7.0 API response no longer
 * carries the variant signal, and a hardcoded substitute would contradict the
 * bulk-known truth.
 *
 * The data-extraction helpers in this file (`extractSequenceFacetSource`,
 * `resolveSequenceSlug`, `SequenceFacetSource`) remain because the live-API
 * pipeline still uses them to populate the `oak_sequences` index and other
 * sequence-related derivations.
 */

import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { SearchSequenceFacetsIndexDoc } from '@oaknational/sdk-codegen/search';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter';
import { compareCurriculumYears } from './year-ordering';

/** Input-agnostic parameters for creating a sequence facet document (DRY). */
export interface CreateSequenceFacetDocParams {
  readonly sequenceSlug: string;
  readonly subjectSlug: SearchSubjectSlug;
  readonly phaseSlug: string;
  readonly phaseTitle: string;
  readonly keyStage: KeyStage;
  readonly keyStageTitle: string;
  readonly years: readonly string[];
  readonly unitSlugs: readonly string[];
  readonly unitTitles: readonly string[];
  readonly lessonCount: number;
  readonly hasKs4Options: boolean;
  readonly oakUrl?: string;
}

/** Creates a sequence facet document from input-agnostic parameters. */
export function createSequenceFacetDoc(
  params: CreateSequenceFacetDocParams,
): SearchSequenceFacetsIndexDoc {
  return {
    subject_slug: params.subjectSlug,
    sequence_slug: params.sequenceSlug,
    key_stages: [params.keyStage],
    key_stage_title: params.keyStageTitle,
    phase_slug: params.phaseSlug,
    phase_title: params.phaseTitle,
    years: [...params.years].sort(compareCurriculumYears),
    unit_slugs: [...params.unitSlugs],
    unit_titles: [...params.unitTitles],
    unit_count: params.unitSlugs.length,
    lesson_count: params.lessonCount,
    has_ks4_options: params.hasKs4Options,
    sequence_canonical_url: params.oakUrl,
  };
}

/** Shape for objects during API response traversal. */
interface TraversableObject {
  readonly units?: readonly unknown[];
  readonly tiers?: readonly unknown[];
  readonly unitSlug?: string;
}

/** Source data for building sequence documents from API responses. */
export interface SequenceFacetSource {
  sequenceSlug: string;
  unitSlugs: readonly string[];
}

export function resolveSequenceSlug(sequence: SubjectSequenceEntry): string {
  return sequence.sequenceSlug;
}

/** Extracts unit slugs from a SequenceUnitsResponse payload. */
export function extractSequenceFacetSource(
  sequenceSlug: string,
  payload: unknown,
): SequenceFacetSource {
  if (!Array.isArray(payload)) {
    return { sequenceSlug, unitSlugs: [] };
  }
  const unitSlugs = collectUnitSlugsFromPayload(payload);
  return { sequenceSlug, unitSlugs: Array.from(unitSlugs) };
}

/** Traverses the payload structure and collects all unitSlug values. */
function collectUnitSlugsFromPayload(items: unknown[]): Set<string> {
  const unitSlugs = new Set<string>();
  const queue: unknown[] = [...items];
  while (queue.length > 0) {
    const current = queue.shift();
    const parsed = parseTraversableObject(current);
    if (!parsed) {
      continue;
    }
    if (parsed.units) {
      queue.push(...parsed.units);
    }
    if (parsed.tiers) {
      queue.push(...parsed.tiers);
    }
    if (parsed.unitSlug && parsed.unitSlug.length > 0) {
      unitSlugs.add(parsed.unitSlug);
    }
  }
  return unitSlugs;
}

/** Type guard for traversable objects during API response traversal. */
function isTraversableObject(value: unknown): value is TraversableObject {
  return typeof value === 'object' && value !== null;
}

/** Safely extracts a traversable object from a value. */
function parseTraversableObject(value: unknown): TraversableObject | null {
  return isTraversableObject(value) ? value : null;
}
