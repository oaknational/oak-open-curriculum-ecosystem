/**
 * Live-API sequence-facet-source extraction.
 *
 * Sequence facet *documents* are emitted only by the bulk-data ingestion
 * pipeline (`bulk-sequence-transformer.ts`); this module no longer builds
 * facet operations from the live-API path because the v0.7.0 API response
 * does not carry per-sequence variant info and the previously hardcoded
 * `hasKs4Options: false` contradicted the bulk-known truth.
 *
 * The remaining responsibility here is extracting `SequenceFacetSource`
 * records (per-sequence unit slugs) from the live-API `getSequenceUnits`
 * payload, which the live-API pipeline still uses to populate the
 * `oak_sequences` index and to drive unit context aggregation.
 */

import { performance } from 'node:perf_hooks';
import type { SubjectSequenceEntry } from '../../adapters/oak-adapter';
import {
  extractSequenceFacetSource,
  resolveSequenceSlug,
  type SequenceFacetSource,
} from './sequence-facets';
import { ingestLogger } from '../logger';

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
  ingestLogger.debug('Building sequence facet sources', {
    sequenceCount: sequences.length,
  });
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
