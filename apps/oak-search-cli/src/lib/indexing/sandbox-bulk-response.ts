/**
 * Zod schemas and types for Elasticsearch bulk response validation.
 * Used at the external boundary to validate ES responses.
 *
 * Supports both 'index' and 'create' actions:
 * - index: Upserts (creates or updates)
 * - create: Only creates (returns version_conflict_engine_exception if exists)
 */

import type { Logger } from '@oaknational/mcp-logger';
import { z } from 'zod';

/**
 * Zod schema for Elasticsearch bulk response error details.
 * Validates at the external boundary (ES response).
 */
const BulkResponseErrorSchema = z.object({
  type: z.string(),
  reason: z.string(),
});

/** Common shape for action response. */
const ActionResultSchema = z.object({
  _index: z.string(),
  status: z.number(),
  error: BulkResponseErrorSchema.optional(),
});

/**
 * Zod schema for a single bulk response item.
 * Supports both 'index' and 'create' actions.
 */
const BulkResponseItemSchema = z.object({
  index: ActionResultSchema.optional(),
  create: ActionResultSchema.optional(),
});

/**
 * Zod schema for Elasticsearch bulk response.
 * Used to validate the response at the external boundary.
 */
export const BulkResponseSchema = z.object({
  errors: z.boolean(),
  items: z.array(BulkResponseItemSchema),
});

export type BulkResponse = z.infer<typeof BulkResponseSchema>;
export type BulkResponseItem = z.infer<typeof BulkResponseItemSchema>;

/** Error type for version conflicts (document already exists with 'create'). */
export const VERSION_CONFLICT_ERROR = 'version_conflict_engine_exception';

/** Check if an error is a version conflict (expected in incremental mode). */
export function isVersionConflictError(item: BulkResponseItem): boolean {
  const actionResult = item.index ?? item.create;
  return actionResult?.error?.type === VERSION_CONFLICT_ERROR;
}

/** Get the action result from a bulk response item. */
function getActionResult(item: BulkResponseItem): z.infer<typeof ActionResultSchema> | undefined {
  return item.index ?? item.create;
}

/** Count errors by type from failed bulk items. */
function countErrorsByType(items: readonly BulkResponseItem[]): Record<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const actionResult = getActionResult(item);
    const errorType = actionResult?.error?.type ?? 'unknown';
    counts.set(errorType, (counts.get(errorType) ?? 0) + 1);
  }
  return Object.fromEntries(counts);
}

/** Separate failed items into real errors and expected skips (version conflicts). */
function categorizeFailures(items: readonly BulkResponseItem[]): {
  realErrors: readonly BulkResponseItem[];
  skipped: readonly BulkResponseItem[];
} {
  const realErrors: BulkResponseItem[] = [];
  const skipped: BulkResponseItem[] = [];
  for (const item of items) {
    const actionResult = getActionResult(item);
    if (actionResult && actionResult.status >= 400) {
      if (isVersionConflictError(item)) {
        skipped.push(item);
      } else {
        realErrors.push(item);
      }
    }
  }
  return { realErrors, skipped };
}

/**
 * Extract and log bulk operation errors.
 *
 * In incremental mode, version conflicts are expected (document already exists).
 * These are logged as info, not errors. Real errors are still logged as errors.
 */
export function logBulkErrors(response: BulkResponse, logger: Logger): void {
  const failedItems = response.items.filter((item) => {
    const actionResult = getActionResult(item);
    return actionResult && actionResult.status >= 400;
  });

  const { realErrors, skipped } = categorizeFailures(failedItems);

  // Log skipped items (version conflicts) as expected behavior
  if (skipped.length > 0) {
    logger.info('Documents already exist (skipped in incremental mode)', {
      skippedCount: skipped.length,
    });
  }

  // Log real errors
  if (realErrors.length > 0) {
    const firstActionResult = getActionResult(realErrors[0]);
    const firstError = firstActionResult?.error;
    logger.error('Bulk indexing errors', undefined, {
      failureCount: realErrors.length,
      errorTypes: countErrorsByType(realErrors),
      firstError: firstError ? { type: firstError.type, reason: firstError.reason } : undefined,
    });
  }
}

/** Check if the bulk response has real errors (excluding version conflicts). */
export function hasRealErrors(response: BulkResponse): boolean {
  const { realErrors } = categorizeFailures(response.items);
  return realErrors.length > 0;
}
