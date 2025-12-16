/**
 * Zod schemas and types for Elasticsearch bulk response validation.
 * Used at the external boundary to validate ES responses.
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

/**
 * Zod schema for a single bulk response item.
 * The `index` property is optional because not all operations are index operations.
 */
const BulkResponseItemSchema = z.object({
  index: z
    .object({
      _index: z.string(),
      status: z.number(),
      error: BulkResponseErrorSchema.optional(),
    })
    .optional(),
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

/** Count errors by type from failed bulk items. */
function countErrorsByType(items: readonly BulkResponseItem[]): Record<string, number> {
  const counts = new Map<string, number>();
  for (const item of items) {
    const errorType = item.index?.error?.type ?? 'unknown';
    counts.set(errorType, (counts.get(errorType) ?? 0) + 1);
  }
  return Object.fromEntries(counts);
}

/** Extract and log bulk operation errors. */
export function logBulkErrors(response: BulkResponse, logger: Logger): void {
  const failedItems = response.items.filter((item) => item.index && item.index.status >= 400);
  const firstError = failedItems[0]?.index?.error;
  logger.error('Bulk indexing errors', undefined, {
    failureCount: failedItems.length,
    errorTypes: countErrorsByType(failedItems),
    firstError: firstError ? { type: firstError.type, reason: firstError.reason } : undefined,
  });
}
