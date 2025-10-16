import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter-sdk';

export interface SequenceFacetSource {
  sequenceSlug: string;
  unitSlugs: readonly string[];
}

export interface SequenceFacetDocument {
  subject_slug: SearchSubjectSlug;
  sequence_slug: string;
  key_stage: KeyStage;
  key_stage_title?: string;
  phase_slug: string;
  phase_title: string;
  years: string[];
  unit_slugs: string[];
  unit_titles: string[];
  unit_count: number;
  lesson_count: number;
  has_ks4_options: boolean;
  sequence_canonical_url?: string;
}

interface CreateSequenceFacetDocumentsParams {
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  sequences: readonly SubjectSequenceEntry[];
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  unitSummaries: ReadonlyMap<string, SearchUnitSummary>;
}

interface SequenceKeyStageEntryRecord {
  readonly keyStageSlug: string;
  readonly keyStageTitle?: string;
}

function isSequenceKeyStageEntryRecord(value: unknown): value is SequenceKeyStageEntryRecord {
  return isUnknownObject(value) && typeof value.keyStageSlug === 'string';
}

export function createSequenceFacetDocuments({
  subject,
  keyStage,
  sequences,
  sequenceSources,
  unitSummaries,
}: CreateSequenceFacetDocumentsParams): SequenceFacetDocument[] {
  return sequences
    .map((sequence) =>
      createSequenceFacetDocument({ subject, keyStage, sequence, sequenceSources, unitSummaries }),
    )
    .filter((doc): doc is SequenceFacetDocument => doc !== null);
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
}: CreateSequenceFacetDocumentParams): SequenceFacetDocument | null {
  const keyStageEntry = findKeyStageEntry(sequence, keyStage);
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
    key_stage: keyStage,
    key_stage_title: keyStageEntry.keyStageTitle,
    phase_slug: sequence.phaseSlug,
    phase_title: sequence.phaseTitle,
    years: normaliseSequenceYears(sequence),
    unit_slugs: unitDetails.slugs,
    unit_titles: unitDetails.titles,
    unit_count: unitDetails.slugs.length,
    lesson_count: unitDetails.lessonCount,
    has_ks4_options: Boolean(sequence.ks4Options),
    sequence_canonical_url: sequence.canonicalUrl,
  };
}

function findKeyStageEntry(sequence: SubjectSequenceEntry, keyStage: KeyStage) {
  const entries = Array.isArray(sequence.keyStages) ? sequence.keyStages : [];
  for (const candidate of entries) {
    if (isSequenceKeyStageEntryRecord(candidate) && candidate.keyStageSlug === keyStage) {
      return candidate;
    }
  }
  return undefined;
}

function normaliseSequenceYears(sequence: SubjectSequenceEntry): string[] {
  if (!Array.isArray(sequence.years)) {
    return [];
  }
  const unique = new Set<string>();
  for (const year of sequence.years) {
    unique.add(String(year));
  }
  return Array.from(unique).sort();
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
    const lessons = Array.isArray(summary.unitLessons) ? summary.unitLessons : [];
    lessonCount += lessons.length;
  }

  if (collectedSlugs.length === 0) {
    return null;
  }

  return { slugs: collectedSlugs, titles, lessonCount };
}

export function extractSequenceFacetSource(
  sequenceSlug: string,
  payload: unknown,
): SequenceFacetSource {
  const unitSlugs = new Set<string>();
  const queue: unknown[] = [];
  if (isUnknownArray(payload)) {
    payload.forEach((entry: unknown) => {
      queue.push(entry);
    });
  }

  while (queue.length > 0) {
    const current = queue.shift();
    if (!isUnknownObject(current)) {
      continue;
    }

    const maybeUnits = current.units;
    if (Array.isArray(maybeUnits)) {
      queue.push(...maybeUnits);
    }

    const maybeTiers = current.tiers;
    if (Array.isArray(maybeTiers)) {
      queue.push(...maybeTiers);
    }

    const slug = getString(current, 'unitSlug');
    if (slug) {
      unitSlugs.add(slug);
    }
  }

  return {
    sequenceSlug,
    unitSlugs: Array.from(unitSlugs),
  };
}

interface UnknownObject {
  [key: string]: unknown;
}

function isUnknownArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

function isUnknownObject(value: unknown): value is UnknownObject {
  return typeof value === 'object' && value !== null;
}

function getString(record: UnknownObject, key: string): string | undefined {
  const value = record[key];
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}
