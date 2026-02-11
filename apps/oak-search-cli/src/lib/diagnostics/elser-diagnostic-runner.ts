/**
 * ELSER diagnostic runner for characterising bulk ingestion failures.
 *
 */

import { z } from 'zod';
import type { Client } from '@elastic/elasticsearch';
import type { BulkOperations, BulkOperationEntry } from '../indexing/bulk-operation-types';
import { createNdjson } from '../indexing/bulk-chunk-utils';
import type {
  DocumentFailure,
  DocumentSuccess,
  ChunkStats,
  ChunkProcessingResult,
} from './elser-diagnostic-types';

/**
 * Zod schema for action result in bulk response.
 */
const ActionResultSchema = z.object({
  _index: z.string(),
  _id: z.string().optional(),
  status: z.number(),
  error: z
    .object({
      type: z.string(),
      reason: z.string(),
    })
    .optional(),
});

/**
 * Zod schema for bulk response items.
 */
const BulkResponseItemSchema = z.object({
  index: ActionResultSchema.optional(),
  create: ActionResultSchema.optional(),
});

/**
 * Zod schema for detailed bulk response.
 */
export const DetailedBulkResponseSchema = z.object({
  errors: z.boolean(),
  took: z.number().optional(),
  items: z.array(BulkResponseItemSchema),
});

/**
 * Extract document ID from bulk operation action line.
 */
export function extractDocumentId(actionLine: BulkOperationEntry): string | undefined {
  if ('index' in actionLine && actionLine.index && '_id' in actionLine.index) {
    return actionLine.index._id;
  }
  if ('create' in actionLine && actionLine.create && '_id' in actionLine.create) {
    return actionLine.create._id;
  }
  return undefined;
}

/** Get action result from bulk response item. */
function getActionResult(item: z.infer<typeof BulkResponseItemSchema>) {
  return item.index ?? item.create;
}

/** Create failure record from action result. */
function createFailure(
  actionResult: z.infer<typeof ActionResultSchema>,
  documentId: string | undefined,
  chunkIndex: number,
  itemIndex: number,
  timestamp: string,
): DocumentFailure {
  return {
    documentId,
    index: actionResult._index,
    status: actionResult.status,
    errorType: actionResult.error?.type ?? 'unknown',
    errorReason: actionResult.error?.reason ?? 'unknown',
    chunkIndex,
    positionInChunk: itemIndex,
    timestamp,
  };
}

/** Create success record from action result. */
function createSuccess(
  actionResult: z.infer<typeof ActionResultSchema>,
  documentId: string | undefined,
  chunkIndex: number,
  itemIndex: number,
  timestamp: string,
): DocumentSuccess {
  return {
    documentId,
    index: actionResult._index,
    chunkIndex,
    positionInChunk: itemIndex,
    timestamp,
  };
}

/**
 * Classify a bulk response item as success or failure.
 */
function classifyResponseItem(
  item: z.infer<typeof BulkResponseItemSchema>,
  chunk: BulkOperations,
  itemIndex: number,
  chunkIndex: number,
  timestamp: string,
): { failure?: DocumentFailure; success?: DocumentSuccess } {
  const actionResult = getActionResult(item);
  if (!actionResult) {
    return {};
  }

  const actionLineIndex = itemIndex * 2;
  const actionLine = chunk[actionLineIndex];
  const documentId = actionLine ? extractDocumentId(actionLine) : undefined;

  if (actionResult.status >= 400) {
    return { failure: createFailure(actionResult, documentId, chunkIndex, itemIndex, timestamp) };
  }

  return { success: createSuccess(actionResult, documentId, chunkIndex, itemIndex, timestamp) };
}

/**
 * Process response items and classify them.
 */
function processResponseItems(
  items: readonly z.infer<typeof BulkResponseItemSchema>[],
  chunk: BulkOperations,
  chunkIndex: number,
  timestamp: string,
): { failures: DocumentFailure[]; successes: DocumentSuccess[] } {
  const failures: DocumentFailure[] = [];
  const successes: DocumentSuccess[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item) {
      continue;
    }

    const result = classifyResponseItem(item, chunk, i, chunkIndex, timestamp);
    if (result.failure) {
      failures.push(result.failure);
    }
    if (result.success) {
      successes.push(result.success);
    }
  }

  return { failures, successes };
}

/**
 * Process a single chunk and capture detailed results.
 */
export async function processChunk(
  esClient: Client,
  chunk: BulkOperations,
  chunkIndex: number,
): Promise<ChunkProcessingResult> {
  const startTime = new Date();
  const ndjson = createNdjson(chunk);
  const documentCount = Math.floor(chunk.length / 2);

  const rawResponse = await esClient.transport.request(
    { method: 'POST', path: '/_bulk', body: ndjson },
    { headers: { 'content-type': 'application/x-ndjson' } },
  );

  const endTime = new Date();
  const parseResult = DetailedBulkResponseSchema.safeParse(rawResponse);

  if (!parseResult.success) {
    throw new Error(`Invalid bulk response: ${parseResult.error.message}`);
  }

  const { failures, successes } = processResponseItems(
    parseResult.data.items,
    chunk,
    chunkIndex,
    endTime.toISOString(),
  );

  const stats: ChunkStats = {
    chunkIndex,
    documentCount,
    successCount: successes.length,
    failureCount: failures.length,
    durationMs: endTime.getTime() - startTime.getTime(),
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };

  return { stats, failures, successes };
}

/**
 * Compute error distribution from failures.
 */
export function computeErrorDistribution(
  failures: readonly DocumentFailure[],
): Record<string, number> {
  const distribution: Record<string, number> = {};
  for (const failure of failures) {
    const key = failure.errorType;
    distribution[key] = (distribution[key] ?? 0) + 1;
  }
  return distribution;
}
