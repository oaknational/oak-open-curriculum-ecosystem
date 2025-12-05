import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import type { SearchIndexKind, SearchIndexTarget } from '../search-index-target';
import { sandboxLogger } from '../logger';

const KIND_BY_INDEX = new Map<string, SearchIndexKind>([
  ['oak_lessons', 'lessons'],
  ['oak_unit_rollup', 'unit_rollup'],
  ['oak_units', 'units'],
  ['oak_sequences', 'sequences'],
  ['oak_sequence_facets', 'sequence_facets'],
]);

const SANDBOX_KIND_BY_INDEX: Record<string, SearchIndexKind> = {
  oak_lessons_sandbox: 'lessons',
  oak_unit_rollup_sandbox: 'unit_rollup',
  oak_units_sandbox: 'units',
  oak_sequences_sandbox: 'sequences',
  oak_sequence_facets_sandbox: 'sequence_facets',
};

/**
 * Determines the search index kind for a bulk target, covering canonical and sandbox names.
 */
export function inferKindFromIndex(indexName: string): SearchIndexKind | null {
  if (KIND_BY_INDEX.has(indexName)) {
    return KIND_BY_INDEX.get(indexName) ?? null;
  }
  return SANDBOX_KIND_BY_INDEX[indexName] ?? null;
}

/**
 * Reduces a bulk operation list into per-index counts and total document volume.
 */
export function summariseOperations(
  operations: readonly unknown[],
  target: SearchIndexTarget,
): { target: SearchIndexTarget; totalDocs: number; counts: Record<SearchIndexKind, number> } {
  const counts: Record<SearchIndexKind, number> = {
    lessons: 0,
    unit_rollup: 0,
    units: 0,
    sequences: 0,
    sequence_facets: 0,
  };

  for (let i = 0; i < operations.length; i += 2) {
    const action = operations[i];
    if (!isIndexAction(action)) {
      continue;
    }
    const kind = inferKindFromIndex(action.index._index);
    if (kind) {
      counts[kind] += 1;
    }
  }

  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const totalDocs = Object.values(counts).reduce((acc, value) => acc + value, 0);
  return { target, totalDocs, counts };
}

/**
 * Serialises a bulk operation array into NDJSON suitable for the Elasticsearch bulk API.
 */
export function createNdjson(operations: readonly unknown[]): string {
  return operations.map((entry) => JSON.stringify(entry)).join('\n') + '\n';
}

/** Elasticsearch bulk response structure. */
interface BulkResponseItem {
  readonly index?: {
    readonly _index: string;
    readonly status: number;
    readonly error?: {
      readonly type: string;
      readonly reason: string;
    };
  };
}

interface BulkResponse {
  readonly errors: boolean;
  readonly items: readonly BulkResponseItem[];
}

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
function logBulkErrors(response: BulkResponse): void {
  const failedItems = response.items.filter((item) => item.index && item.index.status >= 400);
  const firstError = failedItems[0]?.index?.error;
  sandboxLogger.error('Bulk indexing errors', undefined, {
    failureCount: failedItems.length,
    errorTypes: countErrorsByType(failedItems),
    firstError: firstError ? { type: firstError.type, reason: firstError.reason } : undefined,
  });
}

/**
 * Dispatches the prepared NDJSON payload against the provided Elasticsearch transport.
 * Logs errors if any bulk operations fail.
 */
export async function dispatchBulk(
  es: Pick<Client, 'transport'>,
  operations: readonly unknown[],
): Promise<void> {
  const ndjson = createNdjson(operations);
  const response = (await es.transport.request(
    { method: 'POST', path: '/_bulk', body: ndjson },
    { headers: { 'content-type': 'application/x-ndjson' } },
  )) as BulkResponse;

  if (response.errors) {
    logBulkErrors(response);
  }
}

/**
 * Emits a structured summary of the bulk operation outcome to the provided logger.
 */
export function logSummary(
  logger: Logger,
  event: string,
  target: SearchIndexTarget,
  summary: { totalDocs: number; counts: Record<SearchIndexKind, number> },
  dryRun: boolean,
  metrics?: unknown,
): void {
  logger.info(event, {
    target,
    totalDocs: summary.totalDocs,
    counts: summary.counts,
    dryRun,
    metrics,
  });
}

/**
 * Emits a verbose preview of the first few lines in the NDJSON payload.
 */
export function logPreview(
  logger: Logger,
  target: SearchIndexTarget,
  operations: readonly unknown[],
): void {
  if (operations.length === 0) {
    return;
  }
  logger.debug('sandbox.ingest.preview', {
    target,
    preview: operations.slice(0, 4).map((entry) => JSON.stringify(entry)),
  });
}

interface IndexAction {
  readonly index: {
    readonly _index: string;
  };
}

function isIndexAction(value: unknown): value is IndexAction {
  if (!isUnknownObject(value)) {
    return false;
  }
  const action = value.index;
  if (!isUnknownObject(action)) {
    return false;
  }
  return typeof action._index === 'string';
}

// eslint-disable-next-line @typescript-eslint/no-restricted-types -- REFACTOR
function isUnknownObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
