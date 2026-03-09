/**
 * Verify document counts across all search indexes.
 *
 * Iterates ALL index kinds and accumulates per-index pass/fail
 * results. When multiple indexes fail their minimum doc count
 * threshold, all failures are reported in a single invocation
 * rather than early-exiting on the first failure.
 */

import type { Client } from '@elastic/elasticsearch';
import { ok, err, type Result } from '@oaknational/result';

import type { AdminError } from '../types/admin-types.js';
import {
  SEARCH_INDEX_KINDS,
  type SearchIndexKind,
  type IndexResolverFn,
} from '../internal/index-resolver.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Minimum expected document count per index kind.
 *
 * The caller provides a threshold for each search index kind.
 * `verifyDocCounts` compares each index's actual count against
 * its threshold.
 */
export type DocCountExpectations = Readonly<Record<SearchIndexKind, number>>;

/**
 * Per-index verification status.
 *
 * Reports whether a single index passed its minimum doc count
 * threshold, along with the actual and expected counts.
 */
export interface IndexDocCountStatus {
  /** The search index kind (e.g. `'lessons'`, `'units'`). */
  readonly kind: SearchIndexKind;
  /** The concrete Elasticsearch index name. */
  readonly indexName: string;
  /** Whether the actual count meets or exceeds the expected minimum. */
  readonly passed: boolean;
  /** The actual document count in Elasticsearch. */
  readonly actual: number;
  /** The minimum expected document count. */
  readonly expected: number;
}

/**
 * Comprehensive verification result for all index kinds.
 *
 * Contains per-index pass/fail status and a summary flag.
 */
export interface DocCountVerification {
  /** True when every index meets its minimum doc count threshold. */
  readonly allPassed: boolean;
  /** Per-index verification status for each index kind. */
  readonly results: readonly IndexDocCountStatus[];
}

// ---------------------------------------------------------------------------
// Implementation
// ---------------------------------------------------------------------------

/**
 * Format a single index status line for the verification report.
 *
 * @param status - The per-index verification status
 * @returns A formatted status line
 */
function formatStatusLine(status: IndexDocCountStatus): string {
  const icon = status.passed ? 'PASS' : 'FAIL';
  return `  ${icon} ${status.kind}: ${status.actual}/${status.expected} docs`;
}

/**
 * Build a lookup map from index name to doc count.
 *
 * Uses the typed `CatIndicesIndicesRecord` entries returned by the
 * ES client. Follows the same field-access pattern as `listIndexes`
 * in `create-admin-service.ts`.
 *
 * @param response - The cat.indices response array
 * @returns Map from index name to document count
 */
function buildDocCountLookup(
  response: readonly { index?: string; 'docs.count'?: string | null }[],
): Map<string, number> {
  const lookup = new Map<string, number>();
  for (const entry of response) {
    const indexName = entry.index;
    if (typeof indexName !== 'string') {
      continue;
    }
    const raw = entry['docs.count'];
    const count = typeof raw === 'string' ? parseInt(raw, 10) : 0;
    lookup.set(indexName, Number.isNaN(count) ? 0 : count);
  }
  return lookup;
}

/**
 * Build per-index verification results from doc count expectations.
 *
 * @param docCountsByName - Map from index name to actual doc count
 * @param resolveIndex - Resolves index kind to concrete index name
 * @param expectations - Minimum expected doc count per index kind
 * @returns Array of per-index verification statuses
 */
function buildVerificationResults(
  docCountsByName: Map<string, number>,
  resolveIndex: IndexResolverFn,
  expectations: DocCountExpectations,
): IndexDocCountStatus[] {
  return SEARCH_INDEX_KINDS.map((kind) => {
    const indexName = resolveIndex(kind);
    const actual = docCountsByName.get(indexName) ?? 0;
    const expected = expectations[kind];
    return { kind, indexName, passed: actual >= expected, actual, expected };
  });
}

/**
 * Verify document counts across all search indexes.
 *
 * Queries Elasticsearch for current document counts, then compares
 * each index kind against its expected minimum. ALL index kinds are
 * checked; failures are accumulated rather than causing early exit.
 *
 * @param client - Elasticsearch client
 * @param resolveIndex - Resolves index kind to concrete index name
 * @param expectations - Minimum expected doc count per index kind
 * @returns Ok with comprehensive verification when all pass, or
 *   Err with a validation_error listing all failures when any fail
 *
 * @example
 * ```typescript
 * const result = await verifyDocCounts(esClient, resolveIndex, {
 *   lessons: 12000,
 *   unit_rollup: 1500,
 *   units: 1500,
 *   sequences: 100,
 *   sequence_facets: 100,
 *   threads: 50,
 * });
 * if (!result.ok) {
 *   console.error(result.error.message);
 *   // "3 of 6 indexes failed doc count verification: ..."
 * }
 * ```
 */
export async function verifyDocCounts(
  client: Client,
  resolveIndex: IndexResolverFn,
  expectations: DocCountExpectations,
): Promise<Result<DocCountVerification, AdminError>> {
  try {
    const response = await client.cat.indices({ format: 'json' });
    const docCountsByName = Array.isArray(response)
      ? buildDocCountLookup(response)
      : new Map<string, number>();

    const results = buildVerificationResults(docCountsByName, resolveIndex, expectations);
    const allPassed = results.every((status) => status.passed);

    if (allPassed) {
      return ok({ allPassed, results });
    }

    const failures = results.filter((status) => !status.passed);
    const failureSummary = failures.map((s) => `${s.kind} (${s.actual}/${s.expected})`).join(', ');

    return err({
      type: 'validation_error',
      message: `${failures.length} of ${results.length} indexes failed doc count verification: ${failureSummary}`,
      details: results.map(formatStatusLine).join('\n'),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err({ type: 'es_error', message });
  }
}
