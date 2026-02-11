/**
 * Shared document builder for the oak_threads Elasticsearch index.
 *
 * Threads represent curriculum progressions (e.g., 'Number', 'Algebra', 'Geometry')
 * that span multiple units and years. They provide conceptual navigation through
 * the curriculum.
 *
 * This module is the **single source of truth** for thread document creation,
 * used by both API and bulk ingestion paths (DRY compliance).
 *
 * Uses shared canonical URL generator for DRY compliance.
 *
 * @see SearchThreadIndexDoc - The Zod-validated type this produces
 * @see THREADS_INDEX_FIELDS - Field definitions in SDK
 * @see transformThreadToESDoc - Bulk path adapter that delegates here
 * @see generateThreadCanonicalUrl - URL generation (single source of truth)
 */

import type { SearchThreadIndexDoc } from '../../types/oak';
import { generateThreadCanonicalUrl } from './canonical-url-generator';

/**
 * Input-agnostic parameters for creating a thread document.
 *
 * This interface is designed to be source-agnostic, allowing both API
 * and bulk data paths to provide the necessary data for document creation.
 *
 * @example API path usage:
 * ```typescript
 * // From /threads API response
 * const params: CreateThreadDocumentParams = {
 *   threadSlug: apiResponse.slug,
 *   threadTitle: apiResponse.title,
 *   subjectSlugs: apiResponse.subjects.map(s => s.slug),
 *   unitCount: apiResponse.unitCount,
 * };
 * ```
 *
 * @example Bulk path usage:
 * ```typescript
 * // From BulkExtractedThread (see bulk-thread-transformer.ts)
 * const params: CreateThreadDocumentParams = {
 *   threadSlug: extracted.slug,
 *   threadTitle: extracted.title,
 *   subjectSlugs: extracted.subjectSlugs,
 *   unitCount: extracted.unitCount,
 * };
 * ```
 */
export interface CreateThreadDocumentParams {
  /** The thread slug identifier (e.g., 'number-multiplication-and-division') */
  readonly threadSlug: string;
  /** The thread title (e.g., 'Number: Multiplication and division') */
  readonly threadTitle: string;
  /** Subject slugs this thread spans (e.g., ['maths']) */
  readonly subjectSlugs: readonly string[];
  /** Number of units in this thread */
  readonly unitCount: number;
}

/**
 * Creates an Elasticsearch document for the oak_threads index.
 *
 * This is the **shared builder** for thread documents, providing a single source
 * of truth for document creation logic. Both API and bulk ingestion paths
 * delegate to this function.
 *
 * Threads are curriculum progressions that span multiple units and years,
 * providing a conceptual path through related content.
 *
 * @example Direct usage:
 * ```typescript
 * const doc = createThreadDocument({
 *   threadSlug: 'number-multiplication-and-division',
 *   threadTitle: 'Number: Multiplication and division',
 *   subjectSlugs: ['maths'],
 *   unitCount: 15,
 * });
 * ```
 *
 * @example Bulk path (via transformThreadToESDoc):
 * ```typescript
 * import { transformThreadToESDoc } from '../adapters/bulk-thread-transformer';
 * const doc = transformThreadToESDoc(extractedThread); // Calls createThreadDocument internally
 * ```
 *
 * @param params - Thread data from any source (API or bulk)
 * @returns A valid SearchThreadIndexDoc ready for Elasticsearch indexing
 */
export function createThreadDocument(params: CreateThreadDocumentParams): SearchThreadIndexDoc {
  const { threadSlug, threadTitle, subjectSlugs, unitCount } = params;

  const threadUrl = generateThreadCanonicalUrl(threadSlug);

  return {
    thread_slug: threadSlug,
    thread_title: threadTitle,
    subject_slugs: [...subjectSlugs],
    unit_count: unitCount,
    thread_url: threadUrl,
    title_suggest: {
      input: [threadTitle],
      contexts: {
        subject: [...subjectSlugs],
      },
    },
  };
}
