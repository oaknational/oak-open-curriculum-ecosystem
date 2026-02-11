/**
 * Search SDK — factory, dependency, and configuration types.
 *
 * The Search SDK is created via {@link createSearchSdk} which accepts
 * injected dependencies and configuration, returning the three service
 * interfaces: retrieval, admin, and observability.
 *
 * @example
 * ```typescript
 * import { createSearchSdk } from '@oaknational/oak-search-sdk';
 * import { Client } from '@elastic/elasticsearch';
 *
 * const sdk = createSearchSdk({
 *   deps: { esClient: new Client({ node: '...' }) },
 *   config: { indexTarget: 'primary' },
 * });
 *
 * const results = await sdk.retrieval.searchLessons({
 *   text: 'expanding brackets',
 *   subject: 'maths',
 *   keyStage: 'ks3',
 * });
 * ```
 */

import type { Client } from '@elastic/elasticsearch';
import type { Logger } from '@oaknational/mcp-logger';
import type { RetrievalService } from './retrieval.js';
import type { AdminService } from './admin.js';
import type { ObservabilityService } from './observability.js';

/**
 * Dependencies the consumer injects when creating the SDK.
 *
 * The SDK never reads `process.env` or creates singletons internally.
 * All external resources are provided here by the consuming application.
 */
export interface SearchSdkDeps {
  /**
   * Elasticsearch client instance.
   *
   * The SDK uses this client for all Elasticsearch operations: search,
   * indexing, admin, and observability. The consumer owns the client
   * lifecycle (creation, configuration, and disposal).
   */
  readonly esClient: Client;

  /**
   * Optional structured logger.
   *
   * When provided, the SDK emits structured log entries for search
   * operations, ingestion progress, and observability events. When
   * omitted, the SDK operates silently.
   */
  readonly logger?: Logger;
}

/**
 * SDK configuration. No environment variables — the consumer resolves these.
 *
 * All configuration values are explicit and validated at SDK creation time.
 */
export interface SearchSdkConfig {
  /**
   * Which Elasticsearch index alias set to target.
   *
   * `'primary'` targets the live indexes; `'sandbox'` targets the
   * sandbox aliases for development and testing.
   */
  readonly indexTarget: 'primary' | 'sandbox';

  /**
   * Index version string for cache invalidation.
   *
   * When omitted, the SDK reads the version from the `oak_meta`
   * Elasticsearch index. When provided, this value is used as a
   * fallback if the `oak_meta` index is unavailable.
   */
  readonly indexVersion?: string;

  /** Zero-hit observability configuration. */
  readonly zeroHit?: SearchSdkZeroHitConfig;
}

/**
 * Configuration for zero-hit observability features.
 *
 * Controls webhook notifications and Elasticsearch persistence
 * for queries that return no results.
 */
export interface SearchSdkZeroHitConfig {
  /** URL to POST zero-hit webhook payloads to. Omit to disable webhooks. */
  readonly webhookUrl?: string;

  /** Whether to persist zero-hit events to Elasticsearch. Defaults to `false`. */
  readonly persistenceEnabled?: boolean;

  /** Retention period (in days) for persisted zero-hit events. Defaults to 30. */
  readonly retentionDays?: number;
}

/**
 * The Search SDK instance returned by {@link createSearchSdk}.
 *
 * Provides three service interfaces:
 * - **retrieval** — read-only search and suggestion operations
 * - **admin** — Elasticsearch setup, ingestion, and index management
 * - **observability** — zero-hit tracking, persistence, and telemetry
 */
export interface SearchSdk {
  /** Read-only search and suggestion operations. */
  readonly retrieval: RetrievalService;

  /** Elasticsearch setup, ingestion, and index management. */
  readonly admin: AdminService;

  /** Zero-hit tracking, persistence, and telemetry. */
  readonly observability: ObservabilityService;
}

/**
 * Options for creating a Search SDK instance.
 */
export interface CreateSearchSdkOptions {
  /** Injected dependencies (ES client, optional logger). */
  readonly deps: SearchSdkDeps;

  /** SDK configuration (index target, version, zero-hit settings). */
  readonly config: SearchSdkConfig;
}

/**
 * Creates a Search SDK instance.
 *
 * The factory creates stateful service instances that hold the injected
 * dependencies as closures. Each call to `createSearchSdk` produces an
 * independent SDK instance with its own in-memory state (e.g. the
 * zero-hit event store).
 *
 * @param options - Dependencies and configuration
 * @returns The SDK with retrieval, admin, and observability services
 *
 * @example
 * ```typescript
 * const sdk = createSearchSdk({
 *   deps: { esClient: new Client({ node: esUrl, auth: { apiKey } }) },
 *   config: { indexTarget: 'primary' },
 * });
 * ```
 */
export type CreateSearchSdkFn = (options: CreateSearchSdkOptions) => SearchSdk;
