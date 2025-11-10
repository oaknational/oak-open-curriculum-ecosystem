import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import type { SearchIndexKind, SearchIndexTarget } from '../search-index-target';

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

  const totalDocs = Object.values(counts).reduce((acc, value) => acc + value, 0);
  return { target, totalDocs, counts };
}

/**
 * Serialises a bulk operation array into NDJSON suitable for the Elasticsearch bulk API.
 */
export function createNdjson(operations: readonly unknown[]): string {
  return operations.map((entry) => JSON.stringify(entry)).join('\n') + '\n';
}

/**
 * Dispatches the prepared NDJSON payload against the provided Elasticsearch transport.
 */
export async function dispatchBulk(
  es: Pick<Client, 'transport'>,
  operations: readonly unknown[],
): Promise<void> {
  const ndjson = createNdjson(operations);
  await es.transport.request(
    {
      method: 'POST',
      path: '/_bulk',
      body: ndjson,
    },
    {
      headers: { 'content-type': 'application/x-ndjson' },
    },
  );
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

function isUnknownObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
