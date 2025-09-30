import type { ZeroHitEvent } from './zero-hit-store';

/** Generic record helper for dynamic Elasticsearch payloads. */
export type UnknownRecord = { [key: string]: unknown };

/**
 * Shape of the document persisted to the zero-hit Elasticsearch index.
 */
export interface ZeroHitDocument {
  '@timestamp': string;
  search_scope: string;
  query: string;
  filters: Record<string, string>;
  index_version: string;
  request_id?: string;
  session_id?: string;
  took_ms?: number;
  timed_out?: boolean;
}

/** Build the ILM policy name used for the zero-hit index retention. */
export function buildLifecyclePolicyName(indexBase: string, retentionDays: number): string {
  return `${indexBase}_retention_${retentionDays}d`;
}

/** Construct the ILM policy body enforcing time-bound retention. */
export function buildLifecyclePolicyBody(retentionDays: number): UnknownRecord {
  return {
    policy: {
      phases: {
        hot: { actions: {} },
        delete: {
          min_age: `${retentionDays}d`,
          actions: { delete: {} },
        },
      },
    },
  };
}

/**
 * Build the index creation payload for the zero-hit telemetry index.
 */
export function buildIndexBody(indexBase: string, retentionDays: number): UnknownRecord {
  return {
    settings: {
      index: {
        lifecycle: {
          name: buildLifecyclePolicyName(indexBase, retentionDays),
        },
      },
    },
    mappings: {
      dynamic: 'strict',
      properties: {
        '@timestamp': { type: 'date' },
        search_scope: { type: 'keyword' },
        query: {
          type: 'text',
          fields: { keyword: { type: 'keyword', ignore_above: 256 } },
        },
        filters: { type: 'flattened' },
        index_version: { type: 'keyword' },
        request_id: { type: 'keyword' },
        session_id: { type: 'keyword' },
        took_ms: { type: 'long' },
        timed_out: { type: 'boolean' },
      },
    },
  };
}

/**
 * Serialise an in-memory zero-hit event into the Elasticsearch document format.
 */
export function createZeroHitDocument(event: ZeroHitEvent): ZeroHitDocument {
  const doc: ZeroHitDocument = {
    '@timestamp': new Date(event.timestamp).toISOString(),
    search_scope: event.scope,
    query: event.text,
    filters: event.filters,
    index_version: event.indexVersion,
  };
  if (typeof event.tookMs === 'number') {
    doc.took_ms = event.tookMs;
  }
  if (typeof event.timedOut === 'boolean') {
    doc.timed_out = event.timedOut;
  }
  if (event.requestId) {
    doc.request_id = event.requestId;
  }
  if (event.sessionId) {
    doc.session_id = event.sessionId;
  }
  return doc;
}

/** Detect an Elasticsearch error signalling the index already exists. */
export function isResourceAlreadyExistsError(error: unknown): boolean {
  if (!isUnknownRecord(error)) {
    return false;
  }
  const meta = error['meta'];
  if (!isUnknownRecord(meta)) {
    return false;
  }
  const statusCode = meta['statusCode'];
  if (statusCode !== 400 && statusCode !== 409) {
    return false;
  }
  const body = meta['body'];
  if (!isUnknownRecord(body)) {
    return false;
  }
  const innerError = body['error'];
  if (!isUnknownRecord(innerError)) {
    return false;
  }
  return innerError['type'] === 'resource_already_exists_exception';
}

/** Detect an Elasticsearch error indicating the zero-hit index is missing. */
export function isIndexNotFoundError(error: unknown): boolean {
  if (!isUnknownRecord(error)) {
    return false;
  }
  const meta = error['meta'];
  if (!isUnknownRecord(meta)) {
    return false;
  }
  if (meta['statusCode'] !== 404) {
    return false;
  }
  const body = meta['body'];
  if (!isUnknownRecord(body)) {
    return false;
  }
  const innerError = body['error'];
  if (!isUnknownRecord(innerError)) {
    return false;
  }
  const type = innerError['type'];
  return type === 'index_not_found_exception' || type === 'resource_not_found_exception';
}

function isUnknownRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}
