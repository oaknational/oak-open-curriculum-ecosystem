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
import { createThreadDocument } from './thread-document-builder';
import { resolvePrimarySearchIndexName } from '../search-index-target';
import { sandboxLogger } from '../logger';

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
 * Fetches all threads and enriches them with unit counts.
 *
 * This requires multiple API calls:
 * 1. GET /threads to get all thread slugs and titles
 * 2. GET /threads/{slug}/units for each thread to get unit counts
 *
 * The unit responses also contain subject information that we aggregate.
 *
 * @param client - The Oak API client
 * @returns Array of enriched thread data
 */
export async function fetchAndEnrichThreads(client: OakClient): Promise<readonly EnrichedThread[]> {
  sandboxLogger.debug('Fetching all threads');
  const threads = await client.getAllThreads();
  sandboxLogger.debug('Found threads', { count: threads.length });

  const enrichedThreads: EnrichedThread[] = [];

  for (const thread of threads) {
    try {
      const units = await client.getThreadUnits(thread.slug);
      const unitCount = units.length;

      // For now, we don't have subject information in the thread units response
      // We'll derive subjects from the units that appear in each thread later
      // For now, assume maths as the primary subject for most threads
      const subjectSlugs: string[] = ['maths'];

      enrichedThreads.push({
        slug: thread.slug,
        title: thread.title,
        unitCount,
        subjectSlugs,
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
export function buildThreadOps(threads: readonly EnrichedThread[]): unknown[] {
  const ops: unknown[] = [];

  for (const thread of threads) {
    const doc = createThreadDocument({
      threadSlug: thread.slug,
      threadTitle: thread.title,
      subjectSlugs: thread.subjectSlugs,
      unitCount: thread.unitCount,
    });

    ops.push(
      {
        index: {
          _index: resolvePrimarySearchIndexName('threads'),
          _id: thread.slug,
        },
      },
      doc,
    );
  }

  return ops;
}

/**
 * Fetches threads from the API and builds bulk operations.
 *
 * This is a convenience function that combines fetching and building.
 *
 * @param client - The Oak API client
 * @returns Array of bulk operations for thread documents
 */
export async function fetchAndBuildThreadOps(client: OakClient): Promise<unknown[]> {
  const threads = await fetchAndEnrichThreads(client);
  return buildThreadOps(threads);
}
