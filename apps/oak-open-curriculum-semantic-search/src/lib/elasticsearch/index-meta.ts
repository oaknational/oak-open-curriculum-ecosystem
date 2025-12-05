/**
 * Elasticsearch index metadata management.
 *
 * Provides functions to read and write index version metadata,
 * eliminating the need for manual SEARCH_INDEX_VERSION updates.
 */

import type { Client } from '@elastic/elasticsearch';

export const INDEX_META_INDEX = 'oak_meta';
export const INDEX_VERSION_DOC_ID = 'index_version';

export interface IndexMeta {
  readonly type: 'index_version';
  readonly version: string;
  readonly timestamp: string;
  readonly docCounts: {
    readonly lessons: number;
    readonly units: number;
    readonly unit_rollup: number;
    readonly sequences: number;
    readonly sequence_facets: number;
  };
  readonly ingestionDuration: number;
  readonly subjects: readonly string[];
  readonly keyStages: readonly string[];
}

/**
 * Generates a version string from current timestamp.
 * Format: v{YYYY-MM-DD}-{HHmmss}
 */
export function generateVersionFromTimestamp(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  const time = now.toISOString().slice(11, 19).replace(/:/g, '');
  return `v${date}-${time}`;
}

/**
 * Reads the current index metadata from Elasticsearch.
 * Returns null if no metadata exists.
 */
export async function readIndexMeta(client: Client): Promise<IndexMeta | null> {
  try {
    const response = await client.get<IndexMeta>({
      index: INDEX_META_INDEX,
      id: INDEX_VERSION_DOC_ID,
    });

    const source = response._source;
    if (!source) {
      return null;
    }

    return source;
  } catch (error: unknown) {
    // Document not found is expected for fresh indexes
    if (isNotFoundError(error)) {
      return null;
    }
    throw error;
  }
}

/**
 * Writes index metadata to Elasticsearch.
 * This should be called after successful ingestion.
 */
export async function writeIndexMeta(client: Client, meta: Omit<IndexMeta, 'type'>): Promise<void> {
  const doc: IndexMeta = {
    type: 'index_version',
    ...meta,
  };

  await client.index({
    index: INDEX_META_INDEX,
    id: INDEX_VERSION_DOC_ID,
    document: doc,
    refresh: true,
  });
}

/**
 * Gets the current index version, or a fallback if none exists.
 * This is the function apps should use to get the version for cache keys.
 */
export async function getIndexVersion(client: Client): Promise<string> {
  const meta = await readIndexMeta(client);
  if (meta) {
    return meta.version;
  }
  // Fallback to timestamp-based version if no metadata exists
  return generateVersionFromTimestamp();
}

/**
 * Type guard for Elasticsearch not-found errors.
 */
function isNotFoundError(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) {
    return false;
  }
  const err = error as { meta?: { statusCode?: number } };
  return err.meta?.statusCode === 404;
}
