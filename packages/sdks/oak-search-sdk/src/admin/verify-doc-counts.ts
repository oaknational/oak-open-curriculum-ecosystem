/**
 * Verify document counts across all search indexes.
 *
 * Iterates ALL index kinds and accumulates per-index pass/fail
 * results. When multiple indexes fail their minimum doc count
 * threshold, all failures are reported in a single invocation
 * rather than early-exiting on the first failure.
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger';
import { ok, err, type Result } from '@oaknational/result';

import type {
  AdminError,
  DocCountExpectations,
  DocCountVerification,
  IndexDocCountStatus,
} from '../types/admin-types.js';
import { SEARCH_INDEX_KINDS, type IndexResolverFn } from '../internal/index-resolver.js';
import { isMissingIndexError } from './es-error-guards.js';

export type { DocCountExpectations, DocCountVerification, IndexDocCountStatus };

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

async function countIndexDocs(
  client: Client,
  resolveIndex: IndexResolverFn,
  expectations: DocCountExpectations,
): Promise<IndexDocCountStatus[]> {
  return Promise.all(
    SEARCH_INDEX_KINDS.map(async (kind) => {
      const indexName = resolveIndex(kind);
      let actual = 0;
      try {
        const response = await client.count({ index: indexName, ignore_unavailable: true });
        actual = response.count;
      } catch (error: unknown) {
        if (!isMissingIndexError(error)) {
          throw error;
        }
      }
      const expected = expectations[kind];
      return { kind, indexName, passed: actual >= expected, actual, expected };
    }),
  );
}

function createFailedVerificationResult(
  results: readonly IndexDocCountStatus[],
): Result<DocCountVerification, AdminError> {
  const failures = results.filter((status) => !status.passed);
  const failureSummary = failures.map(
    (status) => `${status.kind} (${status.actual}/${status.expected})`,
  );

  return err({
    type: 'validation_error',
    message:
      `${failures.length} of ${results.length} indexes failed doc count verification: ` +
      failureSummary.join(', '),
    details: results.map(formatStatusLine).join('\n'),
  });
}

/**
 * Verify document counts across all search indexes.
 *
 * Queries Elasticsearch `_count` for each concrete index and compares
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
  logger?: Logger,
): Promise<Result<DocCountVerification, AdminError>> {
  logger?.info('Verifying search index document counts', {
    indexKinds: SEARCH_INDEX_KINDS.length,
  });
  try {
    const results = await countIndexDocs(client, resolveIndex, expectations);
    const allPassed = results.every((status) => status.passed);

    if (allPassed) {
      return ok({ allPassed, results });
    }

    return createFailedVerificationResult(results);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    logger?.error('Search index document count verification failed', { message });
    return err({
      type: 'es_error',
      message,
      details: error instanceof Error && error.stack ? error.stack : undefined,
    });
  }
}
