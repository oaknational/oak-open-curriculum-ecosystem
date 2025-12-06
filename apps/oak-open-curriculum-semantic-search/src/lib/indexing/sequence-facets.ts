import type { KeyStage, SearchSubjectSlug } from '../../types/oak';
import type { SearchSequenceFacetsIndexDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import {
  expectUnitSummaryString,
  extractUnitLessons,
  readUnitSummaryValue,
} from './document-transform-helpers';
import {
  ensureSequenceRecord,
  findKeyStageEntry,
  isUnknownObject,
  normaliseSequenceYears,
  requireSequenceString,
  safeArray,
  safeString,
  type UnknownObject,
} from './sequence-facet-utils';

export interface SequenceFacetSource {
  sequenceSlug: string;
  unitSlugs: readonly string[];
}

interface CreateSequenceFacetDocumentsParams {
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  sequences: readonly unknown[];
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  unitSummaries: ReadonlyMap<string, unknown>;
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
  sequence: unknown;
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  unitSummaries: ReadonlyMap<string, unknown>;
}

function createSequenceFacetDocument({
  subject,
  keyStage,
  sequence,
  sequenceSources,
  unitSummaries,
}: CreateSequenceFacetDocumentParams): SearchSequenceFacetsIndexDoc | null {
  const sequenceRecord = ensureSequenceRecord(sequence, 'sequence entry');
  const sequenceSlug = requireSequenceString(sequenceRecord, 'sequenceSlug', 'sequence slug');
  const keyStageEntry = findKeyStageEntry(sequenceRecord, keyStage);
  if (!keyStageEntry) {
    return null;
  }

  const source = sequenceSources.get(sequenceSlug);
  if (!source) {
    return null;
  }

  const unitDetails = collectUnitDetails(source.unitSlugs, unitSummaries);
  if (!unitDetails) {
    return null;
  }

  return {
    subject_slug: subject,
    sequence_slug: sequenceSlug,
    key_stages: [keyStage],
    key_stage_title: keyStageEntry.keyStageTitle,
    phase_slug: requireSequenceString(
      sequenceRecord,
      'phaseSlug',
      `phase slug for ${sequenceSlug}`,
    ),
    phase_title: requireSequenceString(
      sequenceRecord,
      'phaseTitle',
      `phase title for ${sequenceSlug}`,
    ),
    years: normaliseSequenceYears(sequenceRecord),
    unit_slugs: unitDetails.slugs,
    unit_titles: unitDetails.titles,
    unit_count: unitDetails.slugs.length,
    lesson_count: unitDetails.lessonCount,
    has_ks4_options: Boolean(sequenceRecord.ks4Options),
    sequence_canonical_url: safeString(sequenceRecord.canonicalUrl),
  };
}

export function resolveSequenceSlug(sequence: unknown): string {
  const record = ensureSequenceRecord(sequence, 'sequence entry');
  return requireSequenceString(record, 'sequenceSlug', 'sequence slug');
}

function collectUnitDetails(
  unitSlugs: readonly string[],
  unitSummaries: ReadonlyMap<string, unknown>,
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
    const unitTitle = expectUnitSummaryString(summary, 'unitTitle', `unit title for ${slug}`);
    titles.push(unitTitle);
    const lessons = extractUnitLessons(readUnitSummaryValue(summary, 'unitLessons'));
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
    if (!isUnknownObject(current)) {
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

function getNestedArray(value: UnknownObject, key: string): readonly unknown[] {
  const candidate = value[key];
  return Array.isArray(candidate) ? candidate : [];
}

function getString(value: UnknownObject, key: string): string | undefined {
  return safeString(value[key]);
}
