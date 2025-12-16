/**
 * Creates Elasticsearch documents for the oak_threads index.
 *
 * Threads represent curriculum progressions (e.g., 'Number', 'Algebra', 'Geometry')
 * that span multiple units and years. They provide conceptual navigation through
 * the curriculum.
 *
 * @see SearchThreadIndexDoc - The Zod-validated type this produces
 * @see THREADS_INDEX_FIELDS - Field definitions in SDK
 */

import type { SearchThreadIndexDoc } from '../../types/oak';

/**
 * Parameters for creating a thread document.
 *
 * Data comes from the /threads API endpoint.
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
 * Threads are curriculum progressions that span multiple units and years,
 * providing a conceptual path through related content.
 *
 * @example
 * ```typescript
 * const doc = createThreadDocument({
 *  threadSlug: 'number-multiplication-and-division',
 *  threadTitle: 'Number: Multiplication and division',
 *  subjectSlugs: ['maths'],
 *  unitCount: 15,
 * });
 * ```
 *
 * @param params - The thread data from /threads API
 * @returns A valid SearchThreadIndexDoc ready for Elasticsearch indexing
 */
export function createThreadDocument(params: CreateThreadDocumentParams): SearchThreadIndexDoc {
  const { threadSlug, threadTitle, subjectSlugs, unitCount } = params;

  const threadUrl = `https://www.thenational.academy/teachers/curriculum/threads/${threadSlug}`;

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
