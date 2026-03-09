import { z } from 'zod';
import type { ZeroHitEvent } from './zero-hit-store';

import type { ZeroHitDoc } from '@oaknational/sdk-codegen/search';
import { ZeroHitDocSchema } from '@oaknational/sdk-codegen/search';
import {
  OAK_ZERO_HIT_MAPPING,
  type EsIndexBody,
  type EsIlmPolicyBody,
} from '@oaknational/curriculum-sdk/elasticsearch.js';

/**
 * Zod schema for ES error structure.
 * Used to validate ES error responses at external boundaries.
 */
const EsErrorSchema = z.object({
  meta: z.object({
    statusCode: z.number(),
    body: z.object({
      error: z.object({
        type: z.string(),
      }),
    }),
  }),
});

type EsError = z.infer<typeof EsErrorSchema>;

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
    query: event.query,
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

/**
 * Type guard to check if a value is an ES error with expected structure.
 * Uses Zod validation to reduce complexity.
 */
function isEsError(value: unknown): value is EsError {
  return EsErrorSchema.safeParse(value).success;
}

/** Detect an Elasticsearch error signalling the index already exists. */
export function isResourceAlreadyExistsError(error: unknown): boolean {
  if (!isEsError(error)) {
    return false;
  }
  const { statusCode } = error.meta;
  if (statusCode !== 400 && statusCode !== 409) {
    return false;
  }
  return error.meta.body.error.type === 'resource_already_exists_exception';
}

/** Detect an Elasticsearch error indicating the zero-hit index is missing. */
export function isIndexNotFoundError(error: unknown): boolean {
  if (!isEsError(error)) {
    return false;
  }
  if (error.meta.statusCode !== 404) {
    return false;
  }
  const type = error.meta.body.error.type;
  return type === 'index_not_found_exception' || type === 'resource_not_found_exception';
}
