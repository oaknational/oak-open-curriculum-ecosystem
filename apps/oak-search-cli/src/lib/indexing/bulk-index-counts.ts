/**
 * Per-index document count tracking for bulk upload operations.
 *
 * Accumulates indexed vs failed counts from Elasticsearch bulk responses,
 * then freezes into a readonly result for consumers.
 */
import { typeSafeKeys } from '@oaknational/type-helpers';
import type { BulkResponse } from './sandbox-bulk-response';

/**
 * Per-index document counts distinguishing indexed vs failed operations.
 *
 * Keys are Elasticsearch index names (e.g. `'oak_lessons'`, `'oak_units'`).
 * Each entry tracks how many documents were successfully indexed and how
 * many permanently failed for that index.
 */
export type IndexOperationCounts = Readonly<
  Record<
    string,
    {
      readonly indexed: number;
      readonly failed: number;
    }
  >
>;

/** Mutable accumulator for per-index counts during upload. */
export type MutableIndexCounts = Record<string, { indexed: number; failed: number }>;

/** Accumulate per-index counts from a bulk response. */
export function accumulateIndexCounts(
  accumulator: MutableIndexCounts,
  response: BulkResponse,
): void {
  for (const item of response.items) {
    const actionResult = item.index ?? item.create;
    if (!actionResult) {
      continue;
    }
    const indexName = actionResult._index;
    if (!accumulator[indexName]) {
      accumulator[indexName] = { indexed: 0, failed: 0 };
    }
    const entry = accumulator[indexName];
    if (actionResult.status < 400) {
      entry.indexed += 1;
    } else {
      entry.failed += 1;
    }
  }
}

/** Freeze a mutable index counts accumulator into a readonly result. */
export function freezeIndexCounts(accumulator: MutableIndexCounts): IndexOperationCounts {
  const frozen: Record<string, { readonly indexed: number; readonly failed: number }> = {};
  for (const key of typeSafeKeys(accumulator)) {
    const value = accumulator[key];
    if (value) {
      frozen[key] = { indexed: value.indexed, failed: value.failed };
    }
  }
  return frozen;
}
