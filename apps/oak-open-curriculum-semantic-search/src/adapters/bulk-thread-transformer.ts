/**
 * Bulk thread transformer for Elasticsearch.
 *
 * @remarks
 * Extracts threads from bulk download unit data and transforms them
 * into Elasticsearch documents for the oak_threads index.
 *
 * Threads are embedded in `sequence[].threads[]` in bulk files.
 * This transformer:
 * 1. Extracts all threads from units across all bulk files
 * 2. Deduplicates by thread slug
 * 3. Aggregates unit counts and subject slugs
 * 4. Transforms to ES document format via the shared `createThreadDocument()` builder
 *
 * Follows DRY by reusing the shared document builder, ensuring a single source
 * of truth for thread document creation logic.
 *
 * @see ADR-093 Bulk-First Ingestion Strategy
 * @see createThreadDocument - Shared document builder
 * @module adapters/bulk-thread-transformer
 */
import type { BulkDownloadFile } from '@oaknational/oak-curriculum-sdk/public/bulk';
import type { SearchThreadIndexDoc } from '../types/oak';
import type { BulkIndexAction, BulkOperationEntry } from '../lib/indexing/bulk-operation-types';
import { createThreadDocument } from '../lib/indexing/thread-document-builder';
import { deriveSubjectSlugFromSequence } from './bulk-transform-helpers';

/**
 * Extracted thread data from bulk files.
 */
export interface BulkExtractedThread {
  /** Thread slug identifier */
  readonly slug: string;
  /** Thread title */
  readonly title: string;
  /** Number of units in this thread */
  readonly unitCount: number;
  /** Subject slugs this thread appears in */
  readonly subjectSlugs: readonly string[];
}

/**
 * Internal accumulator for thread extraction.
 */
interface ThreadAccumulator {
  title: string;
  unitSlugs: Set<string>;
  subjectSlugs: Set<string>;
}

// Note: deriveSubjectFromSequence is now imported from bulk-transform-helpers
// which re-exports from lib/indexing/slug-derivation for DRY compliance

/**
 * Processes a single unit's threads into the accumulator map.
 */
function processUnitThreads(
  unitSlug: string,
  threads: readonly { slug: string; title: string; order: number }[],
  subjectSlug: string,
  threadMap: Map<string, ThreadAccumulator>,
): void {
  for (const thread of threads) {
    const existing = threadMap.get(thread.slug);
    if (existing) {
      existing.unitSlugs.add(unitSlug);
      existing.subjectSlugs.add(subjectSlug);
    } else {
      threadMap.set(thread.slug, {
        title: thread.title,
        unitSlugs: new Set([unitSlug]),
        subjectSlugs: new Set([subjectSlug]),
      });
    }
  }
}

/**
 * Extracts threads from all bulk files.
 *
 * @param bulkFiles - Array of bulk download file data
 * @returns Deduplicated threads with aggregated metadata
 *
 * @example
 * ```typescript
 * const files = await readAllBulkFiles('./bulk-downloads');
 * const threads = extractThreadsFromBulkFiles(files.map(f => f.data));
 * console.log(`Found ${threads.length} unique threads`);
 * ```
 */
export function extractThreadsFromBulkFiles(
  bulkFiles: readonly BulkDownloadFile[],
): readonly BulkExtractedThread[] {
  const threadMap = new Map<string, ThreadAccumulator>();

  for (const file of bulkFiles) {
    const subjectSlug = deriveSubjectSlugFromSequence(file.sequenceSlug);

    for (const unit of file.sequence) {
      processUnitThreads(unit.unitSlug, unit.threads, subjectSlug, threadMap);
    }
  }

  const results: BulkExtractedThread[] = [];

  for (const [slug, data] of threadMap.entries()) {
    results.push({
      slug,
      title: data.title,
      unitCount: data.unitSlugs.size,
      subjectSlugs: Array.from(data.subjectSlugs).sort(),
    });
  }

  return results.sort((a, b) => a.slug.localeCompare(b.slug));
}

/**
 * Transforms an extracted thread to ES document format.
 *
 * Uses the shared `createThreadDocument()` builder to ensure DRY compliance
 * and a single source of truth for thread document creation logic.
 *
 * @param thread - Extracted thread data from bulk files
 * @returns SearchThreadIndexDoc ready for ES indexing
 *
 * @example
 * ```typescript
 * const thread: BulkExtractedThread = {
 *   slug: 'number-fractions',
 *   title: 'Number: Fractions',
 *   unitCount: 5,
 *   subjectSlugs: ['maths'],
 * };
 * const doc = transformThreadToESDoc(thread);
 * // doc is identical to createThreadDocument() output
 * ```
 *
 * @see createThreadDocument - Shared builder this delegates to
 */
export function transformThreadToESDoc(thread: BulkExtractedThread): SearchThreadIndexDoc {
  return createThreadDocument({
    threadSlug: thread.slug,
    threadTitle: thread.title,
    unitCount: thread.unitCount,
    subjectSlugs: thread.subjectSlugs,
  });
}

/**
 * Builds bulk operations for thread indexing.
 *
 * @param threads - Extracted threads to index
 * @param indexName - Target ES index name
 * @returns Array of bulk operations (alternating action and document)
 */
export function buildThreadBulkOperations(
  threads: readonly BulkExtractedThread[],
  indexName: string,
): BulkOperationEntry[] {
  const operations: BulkOperationEntry[] = [];

  for (const thread of threads) {
    const action: BulkIndexAction = {
      index: {
        _index: indexName,
        _id: thread.slug,
      },
    };

    const doc = transformThreadToESDoc(thread);

    operations.push(action, doc);
  }

  return operations;
}
