/**
 * @module thread-bulk-helpers
 * @description Builds bulk operations for the oak_threads index.
 *
 * Threads represent curriculum progressions (e.g., Number, Algebra) that span
 * multiple units and years. This module fetches thread data from the /threads
 * API and creates Elasticsearch bulk index operations.
 *
 * @see createThreadDocument - Document creation function
 */

import type { OakClient } from '../../adapters/oak-adapter-sdk';
import type { SearchThreadIndexDoc } from '../../types/oak';
import { createThreadDocument } from './thread-document-builder';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { sandboxLogger } from '../logger';

/**
 * Elasticsearch bulk index action metadata.
 */
interface BulkIndexAction {
  readonly index: {
    readonly _index: string;
    readonly _id: string;
  };
}

/**
 * A single bulk operation for thread indexing.
 * Bulk operations alternate between action metadata and document.
 */
export type ThreadBulkOperation = BulkIndexAction | SearchThreadIndexDoc;

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

/**
 * Fetches all threads and enriches them with unit counts.
 *
 * This requires multiple API calls:
 * 1. GET /threads to get all thread slugs and titles
 * 2. GET /threads/{slug}/units for each thread to get unit counts
 *
 * **Note**: Thread/units API does not return subject information. Subject slugs
 * must be provided via options. For the Maths KS4 POC, use `{ subjectSlugs: ['maths'] }`.
 *
 * @param client - The Oak API client
 * @param options - Options including subject slugs for thread association
 * @returns Array of enriched thread data
 *
 * @example
 * ```typescript
 * // Maths KS4 POC ingestion
 * const threads = await fetchAndEnrichThreads(client, { subjectSlugs: ['maths'] });
 * ```
 */
export async function fetchAndEnrichThreads(
  client: OakClient,
  options: FetchThreadsOptions,
): Promise<readonly EnrichedThread[]> {
  sandboxLogger.debug('Fetching all threads');
  const threads = await client.getAllThreads();
  sandboxLogger.debug('Found threads', { count: threads.length });

  const enrichedThreads: EnrichedThread[] = [];

  for (const thread of threads) {
    try {
      const units = await client.getThreadUnits(thread.slug);
      const unitCount = units.length;

      enrichedThreads.push({
        slug: thread.slug,
        title: thread.title,
        unitCount,
        subjectSlugs: options.subjectSlugs,
      });
    } catch (error) {
      sandboxLogger.warn('Failed to fetch units for thread', {
        threadSlug: thread.slug,
        error: error instanceof Error ? error.message : String(error),
      });
      // Continue with other threads
    }
  }

  sandboxLogger.debug('Enriched threads', { count: enrichedThreads.length });
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

    const action: BulkIndexAction = {
      index: {
        _index: resolvePrimarySearchIndexName('threads'),
        _id: thread.slug,
      },
    };

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
