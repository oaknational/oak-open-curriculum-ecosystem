/**
 * Builds bulk operations for the oak_threads index.
 *
 * Threads represent curriculum progressions (e.g., Number, Algebra) that span
 * multiple units and years. This module fetches thread data from the /threads
 * API and creates Elasticsearch bulk index operations.
 *
 * All SDK methods return Result<T, SdkFetchError> per ADR-088.
 *
 * @see createThreadDocument - Document creation function
 * @see ADR-088 Result Pattern for Explicit Error Handling
 */

import type { OakClient, ThreadEntry } from '../../adapters/oak-adapter';
import type { SearchThreadIndexDoc } from '../../types/oak';
import type { SdkFetchError } from '@oaknational/oak-curriculum-sdk';
import { createThreadDocument } from './thread-document-builder';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { ingestLogger } from '../logger';
import { formatSdkError, isRecoverableError } from '@oaknational/oak-curriculum-sdk';
import type { BulkIndexAction, BulkCreateAction } from './bulk-operation-types';
import { createBulkAction } from './bulk-action-factory';

/**
 * A single bulk operation for thread indexing.
 * Bulk operations alternate between action metadata and document.
 */
export type ThreadBulkOperation = BulkIndexAction | BulkCreateAction | SearchThreadIndexDoc;

/**
 * Thread data enriched with unit information.
 */
export interface EnrichedThread {
  readonly slug: string;
  readonly title: string;
  readonly unitCount: number;
  readonly subjectSlugs: readonly string[];
}

/**
 * Options for fetching and enriching threads.
 */
export interface FetchThreadsOptions {
  /**
   * Subject slugs to associate with threads.
   *
   * Threads in Oak's curriculum are cross-subject progressions. The thread/units
   * API does not return subject information directly. For subject-specific ingestion
   * (e.g., Maths KS4 POC), provide the target subject(s) here.
   *
   * @example ['maths'] for Maths KS4 POC
   * @example ['maths', 'science'] for multi-subject ingestion
   */
  readonly subjectSlugs: readonly string[];
}

/** Throws formatted error for non-recoverable SDK errors. */
function throwSdkError(error: SdkFetchError, context: string): never {
  const message = formatSdkError(error);
  ingestLogger.error(context, { error: message });
  if (error.kind === 'network_error') {
    throw error.cause;
  }
  throw new Error(message);
}

/** Enriches a single thread with unit count. Returns null if skipped. */
async function enrichThread(
  client: OakClient,
  thread: ThreadEntry,
  subjectSlugs: readonly string[],
): Promise<EnrichedThread | null> {
  const unitsResult = await client.getThreadUnits(thread.slug);
  if (!unitsResult.ok) {
    if (isRecoverableError(unitsResult.error)) {
      ingestLogger.warn('Skipping thread - units fetch failed', {
        threadSlug: thread.slug,
        error: formatSdkError(unitsResult.error),
      });
      return null;
    }
    throwSdkError(unitsResult.error, `Failed to fetch units for ${thread.slug}`);
  }
  return {
    slug: thread.slug,
    title: thread.title,
    unitCount: unitsResult.value.length,
    subjectSlugs,
  };
}

/** Fetches all threads and enriches them with unit counts. */
export async function fetchAndEnrichThreads(
  client: OakClient,
  options: FetchThreadsOptions,
): Promise<readonly EnrichedThread[]> {
  ingestLogger.debug('Fetching all threads');
  const threadsResult = await client.getAllThreads();
  if (!threadsResult.ok) {
    throwSdkError(threadsResult.error, 'Failed to fetch threads');
  }
  const threads = threadsResult.value;
  ingestLogger.debug('Found threads', { count: threads.length });

  const enrichedThreads: EnrichedThread[] = [];
  for (const thread of threads) {
    const enriched = await enrichThread(client, thread, options.subjectSlugs);
    if (enriched) {
      enrichedThreads.push(enriched);
    }
  }
  ingestLogger.debug('Enriched threads', { count: enrichedThreads.length });
  return enrichedThreads;
}

/**
 * Builds Elasticsearch bulk index operations for thread documents.
 *
 * @param threads - Array of thread entries from the /threads API
 * @returns Array of bulk operations (alternating metadata and document)
 */
export function buildThreadOps(threads: readonly EnrichedThread[]): ThreadBulkOperation[] {
  const ops: ThreadBulkOperation[] = [];

  for (const thread of threads) {
    const doc = createThreadDocument({
      threadSlug: thread.slug,
      threadTitle: thread.title,
      subjectSlugs: thread.subjectSlugs,
      unitCount: thread.unitCount,
    });

    const action = createBulkAction(resolvePrimarySearchIndexName('threads'), thread.slug);

    ops.push(action, doc);
  }

  return ops;
}

/**
 * Fetches threads from the API and builds bulk operations.
 *
 * This is a convenience function that combines fetching and building.
 *
 * @param client - The Oak API client
 * @param options - Options including subject slugs for thread association
 * @returns Array of bulk operations for thread documents
 *
 * @example
 * ```typescript
 * // Maths KS4 POC ingestion
 * const ops = await fetchAndBuildThreadOps(client, { subjectSlugs: ['maths'] });
 * ```
 */
export async function fetchAndBuildThreadOps(
  client: OakClient,
  options: FetchThreadsOptions,
): Promise<ThreadBulkOperation[]> {
  const threads = await fetchAndEnrichThreads(client, options);
  return buildThreadOps(threads);
}
