import type {
  McpTransportObserver,
  ProductAnalyticsCloseError,
  ProductAnalyticsRuntime,
  ProductAnalyticsSink,
} from '@oaknational/observability';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { err, ok, type Result } from '@oaknational/result';
import { PostHogMCP, setLogger } from '@posthog/mcp';
import type { EventMessage, PostHogOptions } from 'posthog-node';

import { createPostHogEventPolicies, type PostHogEventPolicyConfig } from './event-policy.js';
import { reportSafely } from './event-policy-helpers.js';
import {
  createPostHogMcpTransportObserver,
  type PostHogMcpCaptureClient,
} from './mcp-transport-observer.js';
import { createPostHogMcpSdkLogger, type PostHogMcpSdkLogger } from './posthog-mcp-sdk-logger.js';
import {
  createPostHogProductAnalyticsSink,
  type PostHogProductAnalyticsSinkConfig,
} from './product-analytics-sink.js';
import type {
  PostHogOperationalErrorKind,
  PostHogProductAnalyticsConfig,
} from './product-analytics-runtime-contract.js';

type PosthogProductAnalyticsRuntime = Extract<
  ProductAnalyticsRuntime<Transport>,
  { readonly mode: 'posthog' }
>;

export interface PostHogRuntimeClient extends PostHogMcpCaptureClient {
  capture(event: EventMessage): void;
  on(event: 'error', callback: () => void): unknown;
  _shutdown(): Promise<void>;
}

export interface PostHogProductAnalyticsRuntimeDependencies<TClient extends PostHogRuntimeClient> {
  /** Installs the package-level SDK logger before the sole process-owned client is created. */
  readonly configureMcpSdkLogger: (logger: PostHogMcpSdkLogger) => void;
  readonly createClient: (projectApiKey: string, options: PostHogOptions) => TClient;
  readonly createSink: (
    client: TClient,
    config: PostHogProductAnalyticsSinkConfig,
  ) => ProductAnalyticsSink;
  readonly createTransportObserver: (
    client: TClient,
    config: PostHogEventPolicyConfig,
  ) => McpTransportObserver<Transport>;
}

function snapshotConfig(config: PostHogProductAnalyticsConfig): PostHogProductAnalyticsConfig {
  return {
    projectApiKey: config.projectApiKey,
    host: config.host,
    serverVersion: config.serverVersion,
    release: { ...config.release },
    activeActorProjector: config.activeActorProjector,
    toolNames: [...config.toolNames],
    resourceNames: [...config.resourceNames],
    waitUntil: config.waitUntil,
    reportOperationalError: config.reportOperationalError,
  };
}

function createPolicyConfig(config: PostHogProductAnalyticsConfig): PostHogEventPolicyConfig {
  return {
    release: config.release,
    serverVersion: config.serverVersion,
    servedToolNames: config.toolNames,
    servedResourceNames: config.resourceNames,
    activeActorProjector: config.activeActorProjector,
    reportOperationalError: config.reportOperationalError,
  };
}

function createSinkConfig(
  config: PostHogProductAnalyticsConfig,
): PostHogProductAnalyticsSinkConfig {
  return {
    release: config.release,
    serverVersion: config.serverVersion,
    servedResourceNames: config.resourceNames,
    activeActorProjector: config.activeActorProjector,
    reportOperationalError: config.reportOperationalError,
  };
}

export function createPostHogClientOptions(
  config: PostHogProductAnalyticsConfig,
  finalOakEventPolicy: NonNullable<PostHogOptions['before_send']>,
): PostHogOptions {
  return {
    host: config.host,
    defaultOptIn: true,
    disableGeoip: true,
    enableExceptionAutocapture: false,
    preloadFeatureFlags: false,
    sendFeatureFlagEvent: false,
    disableSurveys: true,
    disableRemoteFeatureFlags: true,
    enableLocalEvaluation: false,
    flushAt: 20,
    flushInterval: 5000,
    maxBatchSize: 100,
    maxQueueSize: 10_000,
    requestTimeout: 10_000,
    fetchRetryCount: 3,
    fetchRetryDelay: 3000,
    waitUntil: config.waitUntil,
    waitUntilDebounceMs: 50,
    waitUntilMaxWaitMs: 500,
    isServer: true,
    before_send: finalOakEventPolicy,
  };
}

async function closeClient(
  client: PostHogRuntimeClient,
  reportOperationalError: (kind: PostHogOperationalErrorKind) => void,
): Promise<Result<void, ProductAnalyticsCloseError>> {
  try {
    await client._shutdown();
    return ok(undefined);
  } catch {
    reportSafely(reportOperationalError, 'posthog_client_delivery_failed');
    return err({ kind: 'product_analytics_close_failed' });
  }
}

function createCloseOnce(
  client: PostHogRuntimeClient,
  reportOperationalError: (kind: PostHogOperationalErrorKind) => void,
): () => Promise<Result<void, ProductAnalyticsCloseError>> {
  let closePromise: Promise<Result<void, ProductAnalyticsCloseError>> | undefined;
  return () => {
    closePromise ??= closeClient(client, reportOperationalError);
    return closePromise;
  };
}

function attachClientErrorObserver(
  client: PostHogRuntimeClient,
  reportOperationalError: (kind: PostHogOperationalErrorKind) => void,
): void {
  client.on('error', () => {
    reportSafely(reportOperationalError, 'posthog_client_delivery_failed');
  });
}

export function createPostHogProductAnalyticsRuntimeWithDependencies<
  TClient extends PostHogRuntimeClient,
>(
  config: PostHogProductAnalyticsConfig,
  dependencies: PostHogProductAnalyticsRuntimeDependencies<TClient>,
): PosthogProductAnalyticsRuntime {
  const snapshottedConfig = snapshotConfig(config);
  const policyConfig = createPolicyConfig(snapshottedConfig);
  const policies = createPostHogEventPolicies(policyConfig);
  const options = createPostHogClientOptions(snapshottedConfig, policies.finalOakEventPolicy);
  dependencies.configureMcpSdkLogger(
    createPostHogMcpSdkLogger(snapshottedConfig.reportOperationalError),
  );
  const client = dependencies.createClient(snapshottedConfig.projectApiKey, options);

  attachClientErrorObserver(client, snapshottedConfig.reportOperationalError);
  const sink = dependencies.createSink(client, createSinkConfig(snapshottedConfig));
  const transportObserver = dependencies.createTransportObserver(client, policyConfig);

  return {
    mode: 'posthog',
    sink,
    transportObserver,
    close: createCloseOnce(client, snapshottedConfig.reportOperationalError),
  };
}

function createProductionRuntime(
  config: PostHogProductAnalyticsConfig,
  fetch?: NonNullable<PostHogOptions['fetch']>,
): PosthogProductAnalyticsRuntime {
  return createPostHogProductAnalyticsRuntimeWithDependencies<PostHogMCP>(config, {
    configureMcpSdkLogger: setLogger,
    createClient: (projectApiKey, options) =>
      new PostHogMCP(projectApiKey, fetch === undefined ? options : { ...options, fetch }),
    createSink: (client, sinkConfig) => createPostHogProductAnalyticsSink(client, sinkConfig),
    createTransportObserver: (client, policyConfig) =>
      createPostHogMcpTransportObserver(client, policyConfig),
  });
}

/**
 * Creates one process-owned PostHog product-analytics runtime.
 *
 * @remarks
 * The runtime snapshots the validated configuration, constructs one shared
 * client, and exposes only the closed sink and MCP transport-observer
 * capabilities.
 * Verified actor principals reach the client only after synchronous projection
 * to the configured PostHog-scoped identity.
 *
 * The application composition root owns this lifecycle. It should reuse the
 * runtime across request-scoped MCP transports and call `close()` only during
 * process teardown. Repeated or overlapping closes share one promise.
 * Shutdown failure resolves to
 * `Err({ kind: 'product_analytics_close_failed' })` and emits only the fixed
 * content-free operational signal; it does not reject with vendor details.
 * Bounded post-response flush work is delegated through `config.waitUntil`.
 *
 * @param config - Already-validated PostHog, release, canonical registry,
 * identity-projection, reporting, and serverless-lifecycle inputs.
 * @returns A closed PostHog-mode runtime whose sink and transport observer are
 * safe to share and whose `close` method is the sole client-shutdown boundary.
 *
 * @example
 * ```ts
 * const analytics = createPostHogProductAnalyticsRuntime(config);
 *
 * await server.connect(analytics.transportObserver.observe(serverTransport));
 * processCloseOwner.add(() => analytics.close());
 * ```
 */
export function createPostHogProductAnalyticsRuntime(
  config: PostHogProductAnalyticsConfig,
): PosthogProductAnalyticsRuntime {
  return createProductionRuntime(config);
}

export function createPostHogProductAnalyticsRuntimeWithFetch(
  config: PostHogProductAnalyticsConfig,
  fetch: NonNullable<PostHogOptions['fetch']>,
): PosthogProductAnalyticsRuntime {
  return createProductionRuntime(config, fetch);
}
