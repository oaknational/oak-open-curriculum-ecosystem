import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter-sdk';
import {
  createSequenceFacetDocuments,
  extractSequenceFacetSource,
  type SequenceFacetSource,
} from './sequence-facets';
import { resolvePrimarySearchIndexName } from '../search-index-target';

export type SequenceUnitsFetcher = (sequenceSlug: string) => Promise<unknown>;

export async function buildSequenceFacetSources(
  fetchSequenceUnits: SequenceUnitsFetcher,
  sequences: readonly SubjectSequenceEntry[],
): Promise<Map<string, SequenceFacetSource>> {
  const sources = new Map<string, SequenceFacetSource>();

  for (const sequence of sequences) {
    const payload = await fetchSequenceUnits(sequence.sequenceSlug);
    const source = extractSequenceFacetSource(sequence.sequenceSlug, payload);
    if (source.unitSlugs.length > 0) {
      sources.set(sequence.sequenceSlug, source);
    }
  }

  return sources;
}

interface BuildSequenceFacetOpsArgs {
  subject: SearchSubjectSlug;
  keyStage: KeyStage;
  sequences: readonly SubjectSequenceEntry[];
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  unitSummaries: ReadonlyMap<string, SearchUnitSummary>;
}

export function buildSequenceFacetOps({
  subject,
  keyStage,
  sequences,
  sequenceSources,
  unitSummaries,
}: BuildSequenceFacetOpsArgs): unknown[] {
  const docs = createSequenceFacetDocuments({
    subject,
    keyStage,
    sequences,
    sequenceSources,
    unitSummaries,
  });

  return docs.flatMap((doc) => [
    {
      index: {
        _index: resolvePrimarySearchIndexName('sequence_facets'),
        _id: `${doc.subject_slug}-${doc.sequence_slug}-${doc.key_stage}`,
      },
    },
    doc,
  ]);
}
