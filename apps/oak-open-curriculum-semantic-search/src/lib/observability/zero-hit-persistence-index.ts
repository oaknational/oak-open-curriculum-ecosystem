import type { ZeroHitEvent } from './zero-hit-store';

import type { ZeroHitDoc } from '@oaknational/oak-curriculum-sdk/public/search.js';
import { ZeroHitDocSchema } from '@oaknational/oak-curriculum-sdk/public/search.js';
import {
  OAK_ZERO_HIT_MAPPING,
  type EsIndexBody,
  type EsIlmPolicyBody,
} from '@oaknational/oak-curriculum-sdk/elasticsearch.js';

/** Generic record helper for dynamic Elasticsearch payloads. */
export type UnknownRecord = Record<string, unknown>; // eslint-disable-line @typescript-eslint/no-restricted-types -- REFACTOR

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
export function buildLifecyclePolicyBody(retentionDays: number): EsIlmPolicyBody {
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
 *
 * Uses the generated OAK_ZERO_HIT_MAPPING to ensure mapping stays in sync
 * with the ZeroHitDoc Zod schema.
 */
export function buildIndexBody(indexBase: string, retentionDays: number): EsIndexBody {
  return {
    settings: {
      index: {
        lifecycle: {
          name: buildLifecyclePolicyName(indexBase, retentionDays),
        },
      },
    },
    ...OAK_ZERO_HIT_MAPPING,
  };
}

/**
 * Serialise an in-memory zero-hit event into the Elasticsearch document format.
 *
 * The returned document is validated against ZeroHitDocSchema to ensure
 * it matches the ES mapping.
 */
export function createZeroHitDocument(event: ZeroHitEvent): ZeroHitDoc {
  const doc: ZeroHitDoc = {
    '@timestamp': new Date(event.timestamp).toISOString(),
    search_scope: event.scope,
    query: event.text,
    filters: event.filters,
    index_version: event.indexVersion,
  };

  // Add optional fields only if present
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

  // Validate before returning
  const result = ZeroHitDocSchema.safeParse(doc);
  if (!result.success) {
    throw new Error(`Invalid ZeroHitDoc: ${result.error.message}`);
  }

  return result.data;
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

/**
 * Type guard for objects with indexable properties.
 * Used to safely access properties on unknown values from ES errors.
 */
type IndexableObject = Record<string, unknown>;

/**
 * Type guard to check if a value is a non-null object.
 */
function isUnknownRecord(value: unknown): value is IndexableObject {
  return typeof value === 'object' && value !== null;
}
