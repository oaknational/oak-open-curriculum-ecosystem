/**
 * Zod schemas and types for Elasticsearch bulk response validation.
 * Used at the external boundary to validate ES responses.
 *
 * Supports both 'index' and 'create' actions when parsing ES responses.
 */

import type { Logger } from '@oaknational/logger';
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
type BulkResponseItem = z.infer<typeof BulkResponseItemSchema>;

/** Get the action result from a bulk response item. */
function getActionResult(item: BulkResponseItem): z.infer<typeof ActionResultSchema> | undefined {
  return item.index ?? item.create;
}

/**
 * Count errors by type from failed bulk items.
 * @returns Map of error type string → count. Keys are ES bulk error types (runtime-defined).
 */
function countErrorsByType(items: readonly BulkResponseItem[]): Record<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const actionResult = getActionResult(item);
    const errorType = actionResult?.error?.type ?? 'unknown';
    counts.set(errorType, (counts.get(errorType) ?? 0) + 1);
  }
  return Object.fromEntries(counts);
}

/** Collect failed action items from a bulk response. */
function collectFailedItems(items: readonly BulkResponseItem[]): readonly BulkResponseItem[] {
  const failedItems: BulkResponseItem[] = [];
  for (const item of items) {
    const actionResult = getActionResult(item);
    if (actionResult && actionResult.status >= 400) {
      failedItems.push(item);
    }
  }
  return failedItems;
}

/**
 * Extract and log bulk operation errors.
 *
 * All failed bulk actions are treated as errors.
 */
export function logBulkErrors(response: BulkResponse, logger: Logger): void {
  const failedItems = collectFailedItems(response.items);
  if (failedItems.length > 0) {
    const firstActionResult = getActionResult(failedItems[0]);
    const firstError = firstActionResult?.error;
    logger.error('Bulk indexing errors', {
      failureCount: failedItems.length,
      errorTypes: countErrorsByType(failedItems),
      firstError: firstError ? { type: firstError.type, reason: firstError.reason } : undefined,
    });
  }
}

/** Check if the bulk response has any failed items. */
export function hasRealErrors(response: BulkResponse): boolean {
  return collectFailedItems(response.items).length > 0;
}
