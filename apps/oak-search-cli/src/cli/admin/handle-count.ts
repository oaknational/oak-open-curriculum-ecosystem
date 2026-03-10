/**
 * Handler for true parent document counts via the ES `_count` API.
 *
 * @remarks
 * The `_cat/indices` API reports inflated document counts for indexes
 * containing `semantic_text` fields because ELSER chunking creates
 * internal nested Lucene documents. The `_count` API returns the true
 * parent document count, which matches the number of documents indexed
 * by the ingestion pipeline.
 *
 * @see https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/semantic-text-reference
 */

import { ok, err, type Result } from '@oaknational/result';
import { SEARCH_INDEX_KINDS, resolveSearchIndexName } from '@oaknational/oak-search-sdk';
import type { SearchIndexKind, SearchIndexTarget, AdminError } from '@oaknational/oak-search-sdk';

/** A single index document count result. */
export interface IndexDocCount {
  /** The logical index kind (e.g. `'lessons'`, `'threads'`). */
  readonly kind: SearchIndexKind;
  /** The resolved Elasticsearch index name. */
  readonly index: string;
  /** True parent document count (excludes nested ELSER chunks). */
  readonly count: number;
}

/**
 * Minimal ES client interface for the count operation.
 *
 * Accepts any object with a `count` method matching the
 * `@elastic/elasticsearch` Client signature.
 */
export interface CountClient {
  readonly count: (params: { index: string }) => Promise<{ count: number }>;
}

/**
 * Fetch true parent document counts for all known search indexes.
 *
 * @param client - Elasticsearch client (or fake for testing)
 * @param target - Index target (`'primary'` or `'sandbox'`)
 * @returns Array of per-index counts, or an `AdminError` on failure
 *
 * @example
 * ```typescript
 * const result = await handleCount(esClient, 'primary');
 * if (result.ok) {
 *   for (const { kind, index, count } of result.value) {
 *     console.log(`${kind}: ${count} documents (${index})`);
 *   }
 * }
 * ```
 */
export async function handleCount(
  client: CountClient,
  target: SearchIndexTarget,
): Promise<Result<readonly IndexDocCount[], AdminError>> {
  try {
    const counts = await Promise.all(
      SEARCH_INDEX_KINDS.map(async (kind: SearchIndexKind) => {
        const index = resolveSearchIndexName(kind, target);
        const response = await client.count({ index });
        return { kind, index, count: response.count } satisfies IndexDocCount;
      }),
    );
    return ok(counts);
  } catch (error: unknown) {
    return err({
      type: 'es_error',
      message: `Failed to fetch document counts: ${error instanceof Error ? error.message : String(error)}`,
    });
  }
}
