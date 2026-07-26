import type {
  McpServerInstrumenter,
  ProductAnalyticsCloseError,
  ProductAnalyticsRuntime,
  ProductAnalyticsSink,
} from '@oaknational/observability';
import { err, ok, type Result } from '@oaknational/result';
import { PostHog, type EventMessage, type PostHogOptions } from 'posthog-node';

import { createPostHogEventPolicies, type PostHogEventPolicyConfig } from './event-policy.js';
import { reportSafely } from './event-policy-helpers.js';
import { createPostHogMcpServerInstrumenter } from './mcp-server-instrumenter.js';
import {
  createPostHogProductAnalyticsSink,
  type PostHogProductAnalyticsSinkConfig,
} from './product-analytics-sink.js';
import type {
  PostHogOperationalErrorKind,
  PostHogProductAnalyticsConfig,
} from './product-analytics-runtime-contract.js';

type PosthogProductAnalyticsRuntime<TServer> = Extract<
  ProductAnalyticsRuntime<TServer>,
  { readonly mode: 'posthog' }
>;

export interface PostHogRuntimeClient {
  capture(event: EventMessage): void;
  on(event: 'error', callback: () => void): unknown;
  _shutdown(): Promise<void>;
}

export interface PostHogProductAnalyticsRuntimeDependencies<
  TServer,
  TClient extends PostHogRuntimeClient,
> {
  readonly createClient: (projectApiKey: string, options: PostHogOptions) => TClient;
  readonly createSink: (
    client: TClient,
    config: PostHogProductAnalyticsSinkConfig,
  ) => ProductAnalyticsSink;
  readonly createInstrumenter: (
    client: TClient,
    config: PostHogEventPolicyConfig,
  ) => McpServerInstrumenter<TServer>;
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
  TServer,
  TClient extends PostHogRuntimeClient,
>(
  config: PostHogProductAnalyticsConfig,
  dependencies: PostHogProductAnalyticsRuntimeDependencies<TServer, TClient>,
): PosthogProductAnalyticsRuntime<TServer> {
  const snapshottedConfig = snapshotConfig(config);
  const policyConfig = createPolicyConfig(snapshottedConfig);
  const policies = createPostHogEventPolicies(policyConfig);
  const options = createPostHogClientOptions(snapshottedConfig, policies.finalOakEventPolicy);
  const client = dependencies.createClient(snapshottedConfig.projectApiKey, options);

  attachClientErrorObserver(client, snapshottedConfig.reportOperationalError);
  const sink = dependencies.createSink(client, createSinkConfig(snapshottedConfig));
  const instrumenter = dependencies.createInstrumenter(client, policyConfig);

  return {
    mode: 'posthog',
    sink,
    instrumenter,
    close: createCloseOnce(client, snapshottedConfig.reportOperationalError),
  };
}

function createProductionRuntime<TServer extends WeakKey>(
  config: PostHogProductAnalyticsConfig,
  fetch?: NonNullable<PostHogOptions['fetch']>,
): PosthogProductAnalyticsRuntime<TServer> {
  return createPostHogProductAnalyticsRuntimeWithDependencies<TServer, PostHog>(config, {
    createClient: (projectApiKey, options) =>
      new PostHog(projectApiKey, fetch === undefined ? options : { ...options, fetch }),
    createSink: (client, sinkConfig) => createPostHogProductAnalyticsSink(client, sinkConfig),
    createInstrumenter: (client, policyConfig) =>
      createPostHogMcpServerInstrumenter<TServer>(client, policyConfig),
  });
}

/**
 * Creates one process-owned PostHog product-analytics runtime.
 *
 * @remarks
 * The runtime snapshots the validated configuration, constructs one shared
 * client, and exposes only the closed sink and MCP instrumenter capabilities.
 * Verified actor principals reach the client only after synchronous projection
 * to the configured PostHog-scoped identity.
 *
 * The application composition root owns this lifecycle. It should reuse the
 * runtime across request-scoped MCP servers and call `close()` only during
 * process teardown. Repeated or overlapping closes share one promise.
 * Shutdown failure resolves to
 * `Err({ kind: 'product_analytics_close_failed' })` and emits only the fixed
 * content-free operational signal; it does not reject with vendor details.
 * Bounded post-response flush work is delegated through `config.waitUntil`.
 *
 * @typeParam TServer - Object identity accepted by the returned MCP server
 * instrumenter. Each distinct server object is instrumented at most once.
 * @param config - Already-validated PostHog, release, canonical registry,
 * identity-projection, reporting, and serverless-lifecycle inputs.
 * @returns A closed PostHog-mode runtime whose sink and instrumenter are safe
 * to share and whose `close` method is the sole client-shutdown boundary.
 *
 * @example
 * ```ts
 * const analytics = createPostHogProductAnalyticsRuntime<McpServer>(config);
 *
 * analytics.instrumenter.instrument(requestScopedServer);
 * processCloseOwner.add(() => analytics.close());
 * ```
 */
export function createPostHogProductAnalyticsRuntime<TServer extends WeakKey>(
  config: PostHogProductAnalyticsConfig,
): PosthogProductAnalyticsRuntime<TServer> {
  return createProductionRuntime<TServer>(config);
}

export function createPostHogProductAnalyticsRuntimeWithFetch<TServer extends WeakKey>(
  config: PostHogProductAnalyticsConfig,
  fetch: NonNullable<PostHogOptions['fetch']>,
): PosthogProductAnalyticsRuntime<TServer> {
  return createProductionRuntime<TServer>(config, fetch);
}
