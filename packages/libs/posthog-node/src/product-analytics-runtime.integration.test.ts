import type { ResolvedRelease } from '@oaknational/build-metadata';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import type { McpTransportObserver, ProductAnalyticsSink } from '@oaknational/observability';
import { ok } from '@oaknational/result';
import type { EventMessage, PostHogOptions } from 'posthog-node';
import { assert, describe, expect, it } from 'vitest';

import type { ActivePostHogActorProjector } from './actor-pseudonym-contract.js';
import {
  createPostHogClientOptions,
  createPostHogProductAnalyticsRuntimeWithDependencies,
  type PostHogProductAnalyticsRuntimeDependencies,
  type PostHogRuntimeClient,
} from './product-analytics-runtime.js';
import {
  POSTHOG_EU_INGESTION_HOST,
  type PostHogOperationalErrorKind,
  type PostHogProductAnalyticsConfig,
} from './product-analytics-runtime-contract.js';

const PROJECT_API_KEY = 'phc_project_key';
const SERVER_VERSION = '1.2.3';
const DISTINCT_ID = 'oakph:v1:2026-07:pseudonym';
const RELEASE: ResolvedRelease = {
  value: 'release-2026-07-26',
  source: 'SENTRY_RELEASE_OVERRIDE',
  environment: 'production',
};

interface ErrorSubscription {
  readonly event: 'error';
  readonly callback: () => void;
}

interface TestClient extends PostHogRuntimeClient {
  readonly kind: 'test-client';
}

interface ClientCreation {
  readonly projectApiKey: string;
  readonly options: PostHogOptions;
}

interface SinkCreation {
  readonly client: TestClient;
  readonly config: Parameters<
    PostHogProductAnalyticsRuntimeDependencies<TestClient>['createSink']
  >[1];
}

interface TransportObserverCreation {
  readonly client: TestClient;
  readonly config: Parameters<
    PostHogProductAnalyticsRuntimeDependencies<TestClient>['createTransportObserver']
  >[1];
}

function createActorProjector(): ActivePostHogActorProjector {
  return {
    project: () =>
      ok({
        environment: RELEASE.environment,
        keyId: '2026-07',
        distinctId: DISTINCT_ID,
      }),
  };
}

function createConfig(
  reportOperationalError: (kind: PostHogOperationalErrorKind) => void = () => undefined,
): PostHogProductAnalyticsConfig {
  return {
    projectApiKey: PROJECT_API_KEY,
    host: POSTHOG_EU_INGESTION_HOST,
    serverVersion: SERVER_VERSION,
    release: { ...RELEASE },
    activeActorProjector: createActorProjector(),
    toolNames: ['search', 'browse'],
    resourceNames: ['lesson-guide', 'quiz-results'],
    waitUntil: () => undefined,
    reportOperationalError,
  };
}

function createDeferredShutdown(): {
  readonly promise: Promise<void>;
  readonly resolve: () => void;
} {
  let resolvePromise: () => void = () => undefined;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });
  return { promise, resolve: resolvePromise };
}

function createRuntimeHarness(
  config: PostHogProductAnalyticsConfig,
  shutdown: () => Promise<void> = () => Promise.resolve(),
) {
  const clientCreations: ClientCreation[] = [];
  const sinkCreations: SinkCreation[] = [];
  const transportObserverCreations: TransportObserverCreation[] = [];
  const errorSubscriptions: ErrorSubscription[] = [];
  const shutdownCalls: undefined[] = [];
  const sink: ProductAnalyticsSink = {
    capture: () => undefined,
  };
  const transportObserver: McpTransportObserver<Transport> = {
    observe: (transport) => transport,
  };
  const client: TestClient = {
    kind: 'test-client',
    capture: () => undefined,
    captureInitialize: () => undefined,
    captureToolCall: () => undefined,
    captureToolsList: () => undefined,
    on: (event, callback) => {
      errorSubscriptions.push({ event, callback });
    },
    _shutdown: () => {
      shutdownCalls.push(undefined);
      return shutdown();
    },
  };
  const dependencies = {
    createClient: (projectApiKey, options) => {
      clientCreations.push({ projectApiKey, options });
      return client;
    },
    createSink: (createdClient, sinkConfig) => {
      sinkCreations.push({ client: createdClient, config: sinkConfig });
      return sink;
    },
    createTransportObserver: (createdClient, observerConfig) => {
      transportObserverCreations.push({ client: createdClient, config: observerConfig });
      return transportObserver;
    },
  } satisfies PostHogProductAnalyticsRuntimeDependencies<TestClient>;

  const runtime = createPostHogProductAnalyticsRuntimeWithDependencies(config, dependencies);
  return {
    client,
    clientCreations,
    errorSubscriptions,
    runtime,
    shutdownCalls,
    sink,
    sinkCreations,
    transportObserver,
    transportObserverCreations,
  };
}

function only<T>(items: readonly T[]): T {
  expect(items).toHaveLength(1);
  const item = items.at(0);
  assert(item);
  return item;
}

function expectClosedRuntimeSurface(subject: ReturnType<typeof createRuntimeHarness>): void {
  expect(subject.sinkCreations).toHaveLength(1);
  expect(subject.transportObserverCreations).toHaveLength(1);
  expect(subject.sinkCreations.at(0)?.client).toBe(subject.client);
  expect(subject.transportObserverCreations.at(0)?.client).toBe(subject.client);
  expect(subject.runtime.mode).toBe('posthog');
  expect(subject.runtime.sink).toBe(subject.sink);
  expect(subject.runtime.transportObserver).toBe(subject.transportObserver);
  expect(
    Object.keys(subject.runtime).sort((left, right) => left.localeCompare(right)),
  ).toStrictEqual(['close', 'mode', 'sink', 'transportObserver']);
  expect(Object.hasOwn(subject.runtime, 'client')).toBe(false);
  expect(Object.hasOwn(subject.runtime, 'config')).toBe(false);
}

function createMutableConfigFixture() {
  const originalWaitUntil = () => undefined;
  const replacementWaitUntil = () => undefined;
  const originalReporter = () => undefined;
  const replacementReporter = () => undefined;
  const originalProjector = createActorProjector();
  const replacementProjector = createActorProjector();
  const release: {
    value: string;
    source: ResolvedRelease['source'];
    environment: ResolvedRelease['environment'];
  } = { ...RELEASE };
  const toolNames = ['search'];
  const resourceNames = ['lesson-guide'];
  const config = {
    projectApiKey: PROJECT_API_KEY,
    host: POSTHOG_EU_INGESTION_HOST,
    serverVersion: SERVER_VERSION,
    release,
    activeActorProjector: originalProjector,
    toolNames,
    resourceNames,
    waitUntil: originalWaitUntil,
    reportOperationalError: originalReporter,
  } satisfies PostHogProductAnalyticsConfig;

  return {
    config,
    originalProjector,
    originalReporter,
    originalWaitUntil,
    mutate: () => {
      config.projectApiKey = 'mutated-project-key';
      config.serverVersion = 'mutated-version';
      release.value = 'mutated-release';
      release.environment = 'preview';
      toolNames.splice(0, toolNames.length, 'mutated-tool');
      resourceNames.splice(0, resourceNames.length, 'mutated-resource');
      config.activeActorProjector = replacementProjector;
      config.waitUntil = replacementWaitUntil;
      config.reportOperationalError = replacementReporter;
    },
  };
}

describe('createPostHogClientOptions', () => {
  it('returns the exact closed, EU, profileless delivery configuration', () => {
    const config = createConfig();
    const finalOakEventPolicy = (event: EventMessage | null): EventMessage | null => event;

    const result = createPostHogClientOptions(config, finalOakEventPolicy);

    expect(result).toStrictEqual({
      host: POSTHOG_EU_INGESTION_HOST,
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
    });
    expect(result).not.toHaveProperty('personalApiKey');
    expect(result).not.toHaveProperty('secretKey');
    expect(result).not.toHaveProperty('captureMode');
    expect(result).not.toHaveProperty('POSTHOG_CAPTURE_MODE');
    expect(result).not.toHaveProperty('featureFlagsPollingInterval');
    expect(result).not.toHaveProperty('featureFlagsRequestTimeoutMs');
    expect(result).not.toHaveProperty('featureFlagsRequestMaxRetries');
    expect(result).not.toHaveProperty('flagDefinitionCacheProvider');
    expect(result).not.toHaveProperty('logger');
    expect(result).not.toHaveProperty('surveys');
    expect(result).not.toHaveProperty('sessionRecording');
    expect(result).not.toHaveProperty('sessionReplay');
  });
});

describe('createPostHogProductAnalyticsRuntimeWithDependencies integration', () => {
  it('creates one closed runtime around the same client and fixed error observer', () => {
    const reportedKinds: PostHogOperationalErrorKind[] = [];
    const subject = createRuntimeHarness(
      createConfig((kind) => {
        reportedKinds.push(kind);
      }),
    );

    expect(subject.clientCreations).toHaveLength(1);
    const clientCreation = only(subject.clientCreations);
    expect(clientCreation.projectApiKey).toBe(PROJECT_API_KEY);
    expect(clientCreation.options.host).toBe(POSTHOG_EU_INGESTION_HOST);
    expect(typeof clientCreation.options.before_send).toBe('function');
    expectClosedRuntimeSurface(subject);
    expect(subject.errorSubscriptions).toHaveLength(1);
    const subscription = only(subject.errorSubscriptions);
    expect(subscription.event).toBe('error');

    subscription.callback();

    expect(reportedKinds).toStrictEqual(['posthog_client_delivery_failed']);
  });

  it('isolates a throwing operational reporter from client error notification', () => {
    const reportedKinds: PostHogOperationalErrorKind[] = [];
    const subject = createRuntimeHarness(
      createConfig((kind) => {
        reportedKinds.push(kind);
        assert.fail('reporter-sensitive-detail');
      }),
    );
    const subscription = only(subject.errorSubscriptions);

    expect(() => subscription.callback()).not.toThrow();
    expect(reportedKinds).toStrictEqual(['posthog_client_delivery_failed']);
    expect(JSON.stringify(reportedKinds)).not.toContain('reporter-sensitive-detail');
  });

  it('shares one successful shutdown promise across overlapping and repeated closes', async () => {
    const deferred = createDeferredShutdown();
    const subject = createRuntimeHarness(createConfig(), () => deferred.promise);

    const firstClose = subject.runtime.close();
    const overlappingClose = subject.runtime.close();

    expect(firstClose).toBe(overlappingClose);
    expect(subject.shutdownCalls).toHaveLength(1);

    deferred.resolve();
    await expect(firstClose).resolves.toStrictEqual({ ok: true, value: undefined });
    await expect(overlappingClose).resolves.toStrictEqual({ ok: true, value: undefined });

    const repeatedClose = subject.runtime.close();
    expect(repeatedClose).toBe(firstClose);
    expect(subject.shutdownCalls).toHaveLength(1);
    await expect(repeatedClose).resolves.toStrictEqual({ ok: true, value: undefined });
  });

  it('closes with one content-free Err when shutdown and the reporter both throw', async () => {
    const shutdownDetail = 'shutdown-sensitive-detail';
    const reportedKinds: PostHogOperationalErrorKind[] = [];
    const subject = createRuntimeHarness(
      createConfig((kind) => {
        reportedKinds.push(kind);
        assert.fail('reporter-sensitive-detail');
      }),
      () => Promise.reject(new Error(shutdownDetail)),
    );

    const close = subject.runtime.close();

    await expect(close).resolves.toStrictEqual({
      ok: false,
      error: { kind: 'product_analytics_close_failed' },
    });
    expect(subject.shutdownCalls).toHaveLength(1);
    expect(reportedKinds).toStrictEqual(['posthog_client_delivery_failed']);
    expect(JSON.stringify(await close)).not.toContain(shutdownDetail);
    expect(JSON.stringify(reportedKinds)).not.toContain(shutdownDetail);
  });

  it('snapshots every mutable config field before handing it to dependencies', () => {
    const fixture = createMutableConfigFixture();
    const subject = createRuntimeHarness(fixture.config);

    fixture.mutate();

    const clientCreation = only(subject.clientCreations);
    const sinkCreation = only(subject.sinkCreations);
    const transportObserverCreation = only(subject.transportObserverCreations);
    expect(clientCreation.projectApiKey).toBe(PROJECT_API_KEY);
    expect(clientCreation.options.waitUntil).toBe(fixture.originalWaitUntil);
    expect(sinkCreation.config).toStrictEqual({
      release: RELEASE,
      serverVersion: SERVER_VERSION,
      servedResourceNames: ['lesson-guide'],
      activeActorProjector: fixture.originalProjector,
      reportOperationalError: fixture.originalReporter,
    });
    expect(transportObserverCreation.config).toStrictEqual({
      release: RELEASE,
      serverVersion: SERVER_VERSION,
      servedToolNames: ['search'],
      servedResourceNames: ['lesson-guide'],
      activeActorProjector: fixture.originalProjector,
      reportOperationalError: fixture.originalReporter,
    });
  });
});
