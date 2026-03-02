/* eslint-disable max-lines -- Cohesive helper module for batch generation */
/**
 * Helper functions for batch index generation.
 *
 * Provides subject context building, pair building, and filtering helpers
 * used by the batch generator.
 */

import { isKeyStage, isSubject, formatSdkError } from '@oaknational/curriculum-sdk';
import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter';
import type { BulkOperations } from './indexing/bulk-operation-types';
import type { DataIntegrityReport } from './indexing/data-integrity-report';
import { ingestLogger } from './logger';
import {
  fetchPairData,
  buildPairDocuments,
  emitSequenceFacetEvents,
  resolveSequenceSlugFromEntry,
  type PairBuildContext,
} from './index-oak-helpers';
import type { SequenceFacetSource } from './indexing/sequence-facets';
import {
  buildSequenceFacetSources,
  type SequenceFacetProcessingMetrics,
} from './indexing/sequence-facet-index';
import { fetchAndBuildThreadOps } from './indexing/thread-bulk-helpers';
import { buildKs4ContextMap, type UnitContextMap } from './indexing/ks4-context-builder';

// ============================================================================
// Types
// ============================================================================

/**
 * Subject context needed to build batches (sequences, sources, unit context).
 */
export interface SubjectContext {
  readonly subjectSequences: readonly SubjectSequenceEntry[];
  readonly sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  readonly unitContextMap: UnitContextMap;
}

// ============================================================================
// Subject Context Helpers
// ============================================================================

/**
 * Builds the context needed for a subject (sequences, sources, KS4 context).
 * This is computed once per subject and reused across key stages.
 */
export async function buildSubjectContext(
  client: OakClient,
  subject: SearchSubjectSlug,
  onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void,
): Promise<SubjectContext> {
  ingestLogger.debug('Fetching sequences', { subject });
  const sequencesResult = await client.getSubjectSequences(subject);

  // Handle sequence fetch errors - propagate as they are critical
  if (!sequencesResult.ok) {
    const error = sequencesResult.error;
    const message = formatSdkError(error);
    ingestLogger.error('Failed to fetch subject sequences', { subject, error: message });
    if (error.kind === 'network_error') {
      throw error.cause;
    }
    throw new Error(message);
  }

  const subjectSequences = sequencesResult.value;
  ingestLogger.debug('Found sequences', { subject, count: subjectSequences.length });

  const { sequenceSources, events } = await buildSequenceSourcesWithEvents(
    client,
    subjectSequences,
    onSequenceFacetProcessed,
  );
  emitSequenceFacetEvents(events, subject, onSequenceFacetProcessed);

  const unitContextMap = await buildSubjectKs4ContextMap(client, subject, subjectSequences);

  return { subjectSequences, sequenceSources, unitContextMap };
}

/**
 * Build KS4 context map for a subject from its sequences.
 */
async function buildSubjectKs4ContextMap(
  client: OakClient,
  subject: SearchSubjectSlug,
  subjectSequences: readonly SubjectSequenceEntry[],
): Promise<UnitContextMap> {
  ingestLogger.debug('Building KS4 context map', { subject });

  // Create a wrapper that unwraps Results for the sequence units fetcher
  const fetchSequenceUnits = async (slug: string): Promise<unknown> => {
    const result = await client.getSequenceUnits(slug);
    if (!result.ok) {
      const error = result.error;
      const message = formatSdkError(error);
      ingestLogger.error('Failed to fetch sequence units', { slug, error: message });
      if (error.kind === 'network_error') {
        throw error.cause;
      }
      throw new Error(message);
    }
    return result.value;
  };

  const unitContextMap = await buildKs4ContextMap(
    fetchSequenceUnits,
    subjectSequences.map((seq) => ({
      sequenceSlug: resolveSequenceSlugFromEntry(seq),
      ks4Options: seq.ks4Options ?? null,
    })),
    ingestLogger,
  );
  ingestLogger.debug('KS4 context map built', {
    subject,
    unitsWithKs4Context: unitContextMap.size,
  });
  return unitContextMap;
}

/**
 * Build sequence facet sources with event collection.
 */
async function buildSequenceSourcesWithEvents(
  client: OakClient,
  subjectSequences: readonly SubjectSequenceEntry[],
  onSequenceFacetProcessed?: (
    details: SequenceFacetProcessingMetrics & { subject: SearchSubjectSlug },
  ) => void,
): Promise<{
  sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  events: readonly SequenceFacetProcessingMetrics[];
}> {
  const events: SequenceFacetProcessingMetrics[] = [];
  ingestLogger.debug('Building sequence facet sources');

  // Create a wrapper that unwraps Results for the sequence units fetcher
  const fetchSequenceUnits = async (slug: string): Promise<unknown> => {
    const result = await client.getSequenceUnits(slug);
    if (!result.ok) {
      const error = result.error;
      const message = formatSdkError(error);
      ingestLogger.error('Failed to fetch sequence units', { slug, error: message });
      if (error.kind === 'network_error') {
        throw error.cause;
      }
      throw new Error(message);
    }
    return result.value;
  };

  const sequenceSources = await buildSequenceFacetSources(
    fetchSequenceUnits,
    subjectSequences,
    onSequenceFacetProcessed
      ? {
          instrumentation: {
            record(details) {
              events.push(details);
            },
          },
        }
      : undefined,
  );

  ingestLogger.debug('Sequence facet sources built');
  return { sequenceSources, events };
}

// ============================================================================
// Pair Building
// ============================================================================

/**
 * Result of building operations for a subject/keystage pair.
 */
export interface BuildOpsForPairResult {
  readonly operations: BulkOperations;
  readonly skipped: boolean;
  readonly skipReason?: string;
}

/**
 * Build operations for a single subject/keystage pair.
 *
 * Uses pattern-aware fetching to handle different curriculum structures.
 * Some combinations have no data and will be skipped.
 */
export async function buildOpsForPair(
  client: OakClient,
  keyStage: KeyStage,
  subject: SearchSubjectSlug,
  subjectContext: SubjectContext,
  dataIntegrityReport: DataIntegrityReport,
): Promise<BuildOpsForPairResult> {
  const { subjectSequences, sequenceSources, unitContextMap } = subjectContext;
  const { units, skipped, skipReason } = await fetchPairData(client, keyStage, subject);

  if (skipped) {
    return { operations: [], skipped: true, skipReason };
  }

  const context: PairBuildContext = {
    client,
    ks: keyStage,
    subject,
    subjectSequences,
    sequenceSources,
    unitContextMap,
    dataIntegrityReport,
  };

  const operations = await buildPairDocuments(context, units);
  return { operations, skipped: false };
}

// ============================================================================
// Thread Building
// ============================================================================

/**
 * Fetches and builds thread operations for the given subjects.
 */
export async function buildThreadOps(
  client: OakClient,
  subjects: readonly SearchSubjectSlug[],
): Promise<BulkOperations> {
  ingestLogger.debug('Building thread operations');
  const threadOps = await fetchAndBuildThreadOps(client, { subjectSlugs: subjects });
  ingestLogger.debug('Built thread operations', { count: threadOps.length / 2 });
  return threadOps;
}

// ============================================================================
// Filtering Helpers
// ============================================================================

/**
 * Filter key stages to valid values using SDK type guard.
 */
export function filterKeyStages(list: readonly KeyStage[]): KeyStage[] {
  return list.filter((ks): ks is KeyStage => isKeyStage(ks));
}

/**
 * Filter subjects to valid values using SDK type guard.
 */
export function filterSubjects(list: readonly SearchSubjectSlug[]): SearchSubjectSlug[] {
  return list.filter((s): s is SearchSubjectSlug => isSubject(s));
}
