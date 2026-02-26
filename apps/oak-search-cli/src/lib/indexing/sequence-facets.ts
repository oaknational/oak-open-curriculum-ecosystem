import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { SearchSequenceFacetsIndexDoc } from '@oaknational/sdk-codegen/search';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter';

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
  readonly canonicalUrl?: string;
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
    years: [...params.years].sort(),
    unit_slugs: [...params.unitSlugs],
    unit_titles: [...params.unitTitles],
    unit_count: params.unitSlugs.length,
    lesson_count: params.lessonCount,
    has_ks4_options: params.hasKs4Options,
    sequence_canonical_url: params.canonicalUrl,
  };
}

/** Shape for objects during API response traversal. */
interface TraversableObject {
  readonly units?: readonly unknown[];
  readonly tiers?: readonly unknown[];
  readonly unitSlug?: string;
}

/** Source data for building sequence facets from API responses. */
export interface SequenceFacetSource {
  sequenceSlug: string;
  unitSlugs: readonly string[];
}

/** Parameters for creating sequence facet documents from API data. */
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

/** Creates a sequence facet document from API-specific types. */
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
  return createSequenceFacetDoc({
    sequenceSlug: sequence.sequenceSlug,
    subjectSlug: subject,
    phaseSlug: sequence.phaseSlug,
    phaseTitle: sequence.phaseTitle,
    keyStage,
    keyStageTitle: keyStageEntry.keyStageTitle,
    years: sequence.years.map(String),
    unitSlugs: unitDetails.slugs,
    unitTitles: unitDetails.titles,
    lessonCount: unitDetails.lessonCount,
    hasKs4Options: sequence.ks4Options !== null,
    canonicalUrl: sequence.canonicalUrl,
  });
}

export function resolveSequenceSlug(sequence: SubjectSequenceEntry): string {
  return sequence.sequenceSlug;
}

function collectUnitDetails(
  unitSlugs: readonly string[],
  unitSummaries: ReadonlyMap<string, SearchUnitSummary>,
): { slugs: string[]; titles: string[]; lessonCount: number } | null {
  const uniqueSlugs = Array.from(new Set(unitSlugs));
  const collectedSlugs: string[] = [],
    titles: string[] = [];
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
  return collectedSlugs.length === 0 ? null : { slugs: collectedSlugs, titles, lessonCount };
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
