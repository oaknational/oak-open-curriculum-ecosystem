/**
 * Admin-only factory for the index lifecycle service.
 *
 * Accepts a pre-created ES client (caller owns creation; caller or
 * `withEsClient` owns cleanup) and wires it into the SDK's lifecycle
 * dependencies. Used by both ingest commands (with real
 * `runVersionedIngest`) and alias commands (with a no-op stub).
 *
 * @remarks
 * Replaces the old `buildLifecycleServiceForIngest` (which buried the
 * ES client handle) and `buildLifecycleServiceBasic` (same anti-pattern).
 * See ADR-133 for the "factories must not bury resource handles" rule.
 *
 * @see ADR-130 Blue/green index lifecycle
 * @see ADR-133 CLI Resource Lifecycle Management
 */

import {
  buildLifecycleDeps,
  createIndexLifecycleService,
  type IndexLifecycleService,
  type IndexLifecycleDeps,
  type SearchIndexTarget,
} from '@oaknational/oak-search-sdk/admin';
import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/logger/node';

/**
 * Build a lifecycle service from pre-created resources.
 *
 * @param esClient - Pre-created Elasticsearch client (caller owns cleanup)
 * @param target - Index target ('primary' or 'sandbox')
 * @param runVersionedIngest - Ingestion function (real or no-op stub)
 * @param logger - Structured logger for lifecycle operations
 * @returns A wired {@link IndexLifecycleService}
 */
export function buildLifecycleService(
  esClient: Client,
  target: SearchIndexTarget,
  runVersionedIngest: IndexLifecycleDeps['runVersionedIngest'],
  logger: Logger,
): IndexLifecycleService {
  const deps = buildLifecycleDeps(esClient, target, runVersionedIngest, logger);
  return createIndexLifecycleService(deps);
}
