import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { SearchSequenceFacetsIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter';

/**
 * Shape for objects during API response traversal.
 * The SequenceUnitsResponse is a complex union; we only need to safely
 * extract 'units', 'tiers', and 'unitSlug' fields from nested objects.
 */
interface TraversableObject {
  readonly units?: readonly unknown[];
  readonly tiers?: readonly unknown[];
  readonly unitSlug?: string;
}

export interface SequenceFacetSource {
  sequenceSlug: string;
  unitSlugs: readonly string[];
}

interface CreateSequenceFacetDocumentsParams {
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  sequences: readonly SubjectSequenceEntry[];
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  unitSummaries: ReadonlyMap<string, SearchUnitSummary>;
}

export function createSequenceFacetDocuments({
  subject,
  keyStage,
  sequences,
  sequenceSources,
  unitSummaries,
}: CreateSequenceFacetDocumentsParams): SearchSequenceFacetsIndexDoc[] {
  return sequences
    .map((sequence) =>
      createSequenceFacetDocument({ subject, keyStage, sequence, sequenceSources, unitSummaries }),
    )
    .filter((doc): doc is SearchSequenceFacetsIndexDoc => doc !== null);
}

interface CreateSequenceFacetDocumentParams {
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  sequence: SubjectSequenceEntry;
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  unitSummaries: ReadonlyMap<string, SearchUnitSummary>;
}

function createSequenceFacetDocument({
  subject,
  keyStage,
  sequence,
  sequenceSources,
  unitSummaries,
}: CreateSequenceFacetDocumentParams): SearchSequenceFacetsIndexDoc | null {
  const keyStageEntry = sequence.keyStages.find((ks) => ks.keyStageSlug === keyStage);
  if (!keyStageEntry) {
    return null;
  }

  const source = sequenceSources.get(sequence.sequenceSlug);
  if (!source) {
    return null;
  }

  const unitDetails = collectUnitDetails(source.unitSlugs, unitSummaries);
  if (!unitDetails) {
    return null;
  }

  return {
    subject_slug: subject,
    sequence_slug: sequence.sequenceSlug,
    key_stages: [keyStage],
    key_stage_title: keyStageEntry.keyStageTitle,
    phase_slug: sequence.phaseSlug,
    phase_title: sequence.phaseTitle,
    years: sequence.years.map(String).sort(),
    unit_slugs: unitDetails.slugs,
    unit_titles: unitDetails.titles,
    unit_count: unitDetails.slugs.length,
    lesson_count: unitDetails.lessonCount,
    has_ks4_options: sequence.ks4Options !== null,
    sequence_canonical_url: sequence.canonicalUrl,
  };
}

export function resolveSequenceSlug(sequence: SubjectSequenceEntry): string {
  return sequence.sequenceSlug;
}

function collectUnitDetails(
  unitSlugs: readonly string[],
  unitSummaries: ReadonlyMap<string, SearchUnitSummary>,
): { slugs: string[]; titles: string[]; lessonCount: number } | null {
  const uniqueSlugs = Array.from(new Set(unitSlugs));
  const collectedSlugs: string[] = [];
  const titles: string[] = [];
  let lessonCount = 0;

  for (const slug of uniqueSlugs) {
    const summary = unitSummaries.get(slug);
    if (!summary) {
      continue;
    }
    collectedSlugs.push(slug);
    titles.push(summary.unitTitle);
    lessonCount += summary.unitLessons.length;
  }

  if (collectedSlugs.length === 0) {
    return null;
  }

  return { slugs: collectedSlugs, titles, lessonCount };
}

/**
 * Extracts unit slugs from a SequenceUnitsResponse payload.
 *
 * The payload is a complex union type from the API (SequenceUnitsResponseSchema)
 * with nested units in various structures (year groups, tiers, exam subjects).
 * This function traverses the structure to collect all unitSlug values.
 *
 * @param sequenceSlug - The sequence slug for the result
 * @param payload - The raw API response (SequenceUnitsResponse)
 * @returns SequenceFacetSource with collected unit slugs
 */
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

/**
 * Traverses the payload structure and collects all unitSlug values.
 */
function collectUnitSlugsFromPayload(items: unknown[]): Set<string> {
  const unitSlugs = new Set<string>();
  const queue: unknown[] = [...items];

  while (queue.length > 0) {
    const current = queue.shift();
    const parsed = parseTraversableObject(current);
    if (!parsed) {
      continue;
    }

    enqueueNestedItems(queue, parsed);
    addUnitSlugIfPresent(unitSlugs, parsed);
  }

  return unitSlugs;
}

/**
 * Enqueues nested 'units' and 'tiers' arrays for traversal.
 */
function enqueueNestedItems(queue: unknown[], parsed: TraversableObject): void {
  if (parsed.units) {
    queue.push(...parsed.units);
  }
  if (parsed.tiers) {
    queue.push(...parsed.tiers);
  }
}

/**
 * Adds unitSlug to the set if present and non-empty.
 */
function addUnitSlugIfPresent(unitSlugs: Set<string>, parsed: TraversableObject): void {
  if (parsed.unitSlug && parsed.unitSlug.length > 0) {
    unitSlugs.add(parsed.unitSlug);
  }
}

/**
 * Type guard for traversable objects during API response traversal.
 *
 * @remarks This is internal traversal of already-validated API data (SequenceUnitsResponse),
 * not an external boundary, so a type guard checking for object shape is appropriate.
 */
function isTraversableObject(value: unknown): value is TraversableObject {
  return typeof value === 'object' && value !== null;
}

/**
 * Safely extracts a traversable object from a value.
 * Returns null if the value is not an object.
 */
function parseTraversableObject(value: unknown): TraversableObject | null {
  return isTraversableObject(value) ? value : null;
}
