import { performance } from 'node:perf_hooks';
import type { KeyStage, SearchSubjectSlug, SearchUnitSummary } from '../../types/oak';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter';
import {
  createSequenceFacetDocuments,
  extractSequenceFacetSource,
  resolveSequenceSlug,
  type SequenceFacetSource,
} from './sequence-facets';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import type { BulkOperations } from './bulk-operation-types';
import { createBulkAction } from './bulk-action-factory';

type SequenceUnitsFetcher = (sequenceSlug: string) => Promise<unknown>;

export interface SequenceFacetProcessingMetrics {
  readonly sequenceSlug: string;
  readonly fetchDurationMs: number;
  readonly extractionDurationMs: number;
  readonly unitCount: number;
  readonly included: boolean;
}

interface SequenceFacetInstrumentationDelegate {
  record(details: SequenceFacetProcessingMetrics): void;
}

interface BuildSequenceFacetSourcesOptions {
  readonly instrumentation?: SequenceFacetInstrumentationDelegate;
}

export async function buildSequenceFacetSources(
  fetchSequenceUnits: SequenceUnitsFetcher,
  sequences: readonly SubjectSequenceEntry[],
  options?: BuildSequenceFacetSourcesOptions,
): Promise<Map<string, SequenceFacetSource>> {
  const sources = new Map<string, SequenceFacetSource>();

  for (const sequence of sequences) {
    const fetchStart = performance.now();
    const sequenceSlug = resolveSequenceSlug(sequence);
    const payload = await fetchSequenceUnits(sequenceSlug);
    const fetchDurationMs = performance.now() - fetchStart;

    const extractionStart = performance.now();
    const source = extractSequenceFacetSource(sequenceSlug, payload);
    const extractionDurationMs = performance.now() - extractionStart;
    const unitCount = source.unitSlugs.length;
    const included = unitCount > 0;

    if (included) {
      sources.set(sequenceSlug, source);
    }

    options?.instrumentation?.record({
      sequenceSlug,
      fetchDurationMs,
      extractionDurationMs,
      unitCount,
      included,
    });
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
}: BuildSequenceFacetOpsArgs): BulkOperations {
  const docs = createSequenceFacetDocuments({
    subject,
    keyStage,
    sequences,
    sequenceSources,
    unitSummaries,
  });

  const result: BulkOperations = [];
  for (const doc of docs) {
    const docId = `${doc.subject_slug}-${doc.sequence_slug}-${doc.key_stages[0]}`;
    result.push(createBulkAction(resolvePrimarySearchIndexName('sequence_facets'), docId), doc);
  }
  return result;
}
