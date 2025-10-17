import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter-sdk';
import { extractUnitLessons } from './document-transforms';

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
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const slug = safeString(Reflect.get(value, 'keyStageSlug'));
  if (!slug) {
    return false;
  }
  const title = Reflect.get(value, 'keyStageTitle');
  return typeof title === 'string' || typeof title === 'undefined';
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
    const lessons = extractUnitLessons(summary.unitLessons);
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
  const queue: unknown[] = [...safeArray(payload)];

  while (queue.length > 0) {
    const current = queue.shift();
    if (typeof current !== 'object' || current === null) {
      continue;
    }

    const units = getNestedArray(current, 'units');
    if (units.length > 0) {
      queue.push(...units);
    }

    const tiers = getNestedArray(current, 'tiers');
    if (tiers.length > 0) {
      queue.push(...tiers);
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

function safeArray(value: unknown): readonly unknown[] {
  return Array.isArray(value) ? value : [];
}

function safeString(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function getNestedArray(value: object, key: string): readonly unknown[] {
  const candidate: unknown = Reflect.get(value, key);
  return Array.isArray(candidate) ? candidate : [];
}

function getString(value: object, key: string): string | undefined {
  const candidate: unknown = Reflect.get(value, key);
  return safeString(candidate);
}
