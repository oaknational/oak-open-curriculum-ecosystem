import type { TransportRequestOptions, TransportRequestParams } from '@elastic/elasticsearch';
import { esClient } from '../es-client';
import { optionalEnv } from '../env';
import {
  currentSearchIndexTarget,
  resolveZeroHitIndexName,
  ZERO_HIT_INDEX_BASE,
} from '../search-index-target';
import type { ZeroHitEvent } from './zero-hit-store';
import {
  buildIndexBody,
  buildLifecyclePolicyBody,
  buildLifecyclePolicyName,
  createZeroHitDocument,
  isIndexNotFoundError,
  isResourceAlreadyExistsError,
} from './zero-hit-persistence-index';
import {
  buildSearchBody,
  parseSearchResponse,
  type SearchResponse,
} from './zero-hit-persistence-search';
import type { SearchScope } from '../../types/oak';

const JSON_REQUEST_OPTIONS: TransportRequestOptions = {
  headers: { 'content-type': 'application/json' },
};

const ensuredTargets = new Map<string, Promise<void>>();
const ensuredPolicies = new Map<string, Promise<void>>();

/**
 * Internal utility used by unit tests to clear cached ensure promises.
 */
export function __resetZeroHitPersistenceCachesForTests(): void {
  ensuredTargets.clear();
  ensuredPolicies.clear();
}

/** Telemetry snapshot consumed by the dashboard. */
export interface ZeroHitTelemetry {
  summary: {
    total: number;
    byScope: Record<SearchScope, number>;
    latestIndexVersion: string | null;
  };
  recent: ZeroHitEvent[];
}

/** True when persistence is enabled through environment configuration. */
export function zeroHitPersistenceEnabled(): boolean {
  return optionalEnv()?.ZERO_HIT_PERSISTENCE_ENABLED ?? false;
}

/** Persist a zero-hit event to the Serverless Elasticsearch index. */
export async function persistZeroHitEvent(event: ZeroHitEvent): Promise<void> {
  const envVars = optionalEnv();
  if (!envVars?.ZERO_HIT_PERSISTENCE_ENABLED) {
    return;
  }

  const target = currentSearchIndexTarget();
  const indexName = resolveZeroHitIndexName(target);
  const retentionDays = envVars.ZERO_HIT_INDEX_RETENTION_DAYS;

  await ensureZeroHitIndex(indexName, retentionDays);
  const document = createZeroHitDocument(event);
  await esClient().transport.request(
    {
      method: 'POST',
      path: `/${indexName}/_doc`,
      body: JSON.stringify(document),
    },
    JSON_REQUEST_OPTIONS,
  );
}

/** Fetch persisted zero-hit telemetry, falling back to empty results when absent. */
export async function fetchZeroHitTelemetry({
  limit,
}: {
  limit: number;
}): Promise<ZeroHitTelemetry> {
  const target = currentSearchIndexTarget();
  const indexName = resolveZeroHitIndexName(target);
  const size = normaliseLimit(limit);

  try {
    const response = await esClient().transport.request<SearchResponse>(
      {
        method: 'POST',
        path: `/${indexName}/_search`,
        body: JSON.stringify(buildSearchBody(size)),
      },
      JSON_REQUEST_OPTIONS,
    );

    const parsed = parseSearchResponse(response, size);
    return parsed;
  } catch (error: unknown) {
    if (isIndexNotFoundError(error)) {
      return createEmptyTelemetry();
    }
    throw error;
  }
}

/** Ensure the zero-hit index exists for the requested target. */
async function ensureZeroHitIndex(indexName: string, retentionDays: number): Promise<void> {
  await ensureZeroHitLifecyclePolicy(ZERO_HIT_INDEX_BASE, retentionDays);
  let ensurePromise = ensuredTargets.get(indexName);
  if (!ensurePromise) {
    ensurePromise = createIndexIfNeeded(indexName, retentionDays).catch((error) => {
      ensuredTargets.delete(indexName);
      throw error;
    });
    ensuredTargets.set(indexName, ensurePromise);
  }
  await ensurePromise;
}

/** Ensure the ILM policy for zero-hit retention is present. */
async function ensureZeroHitLifecyclePolicy(
  indexBase: string,
  retentionDays: number,
): Promise<void> {
  const policyName = buildLifecyclePolicyName(indexBase, retentionDays);
  let ensurePromise = ensuredPolicies.get(policyName);
  if (!ensurePromise) {
    ensurePromise = createLifecyclePolicy(policyName, retentionDays).catch((error) => {
      ensuredPolicies.delete(policyName);
      throw error;
    });
    ensuredPolicies.set(policyName, ensurePromise);
  }
  await ensurePromise;
}

/** Create or update the ILM policy used by the zero-hit index. */
async function createLifecyclePolicy(policyName: string, retentionDays: number): Promise<void> {
  const request: TransportRequestParams = {
    method: 'PUT',
    path: `/_ilm/policy/${policyName}`,
    body: JSON.stringify(buildLifecyclePolicyBody(retentionDays)),
  };
  await esClient().transport.request(request, JSON_REQUEST_OPTIONS);
}

/** Attempt to create the zero-hit index, tolerating existing resources. */
async function createIndexIfNeeded(indexName: string, retentionDays: number): Promise<void> {
  const request: TransportRequestParams = {
    method: 'PUT',
    path: `/${indexName}`,
    body: JSON.stringify(buildIndexBody(ZERO_HIT_INDEX_BASE, retentionDays)),
  };

  try {
    await esClient().transport.request(request, JSON_REQUEST_OPTIONS);
  } catch (error: unknown) {
    if (isResourceAlreadyExistsError(error)) {
      return;
    }
    throw error;
  }
}

/** Clamp requested limits to a safe search window. */
function normaliseLimit(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 50;
  }
  return Math.min(Math.floor(value), 200);
}

/** Construct an empty telemetry payload when the index has not yet been created. */
function createEmptyTelemetry(): ZeroHitTelemetry {
  return {
    summary: {
      total: 0,
      byScope: {
        lessons: 0,
        units: 0,
        sequences: 0,
      },
      latestIndexVersion: null,
    },
    recent: [],
  };
}
