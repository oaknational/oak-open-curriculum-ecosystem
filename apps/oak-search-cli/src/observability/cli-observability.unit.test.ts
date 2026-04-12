import { describe, expect, it, vi } from 'vitest';
import { createFixtureSentryStore, type SentryNodeSdk } from '@oaknational/sentry-node';
import type { SearchCliRuntimeConfig } from '../runtime-config.js';
import { parseEnv } from '../lib/env.js';
import { createCliObservability } from './cli-observability.js';

const noopLogger: SentryNodeSdk['logger'] = {
  trace(): void {
    /* noop */
  },
  debug(): void {
    /* noop */
  },
  info(): void {
    /* noop */
  },
  warn(): void {
    /* noop */
  },
  error(): void {
    /* noop */
  },
  fatal(): void {
    /* noop */
  },
};

interface FakeSentrySdk {
  readonly sdk: SentryNodeSdk;
  readonly init: ReturnType<typeof vi.fn<SentryNodeSdk['init']>>;
  readonly captureException: ReturnType<typeof vi.fn<SentryNodeSdk['captureException']>>;
  readonly captureMessage: ReturnType<typeof vi.fn<SentryNodeSdk['captureMessage']>>;
  readonly flush: ReturnType<typeof vi.fn<SentryNodeSdk['flush']>>;
}

function createFakeSentrySdk(): FakeSentrySdk {
  const init = vi.fn<SentryNodeSdk['init']>();
  const captureException = vi.fn<SentryNodeSdk['captureException']>();
  const captureMessage = vi.fn<SentryNodeSdk['captureMessage']>();
  const flush = vi.fn<SentryNodeSdk['flush']>().mockResolvedValue(true);

  return {
    sdk: {
      init,
      captureException,
      captureMessage,
      flush,
      logger: noopLogger,
    },
    init,
    captureException,
    captureMessage,
    flush,
  };
}

function createTestEnv(
  mode: 'off' | 'fixture' | 'sentry',
  overrides?: Record<string, string>,
): SearchCliRuntimeConfig['env'] {
  const raw: Record<string, string | undefined> = {
    ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
    ELASTICSEARCH_API_KEY: 'test-es-key-12345',
    OAK_API_KEY: 'test-api-key-12345',
    SEARCH_API_KEY: 'search-key-12345',
    SEARCH_INDEX_VERSION: 'v2026-01-01',
    SENTRY_MODE: mode,
    ...(mode === 'sentry'
      ? {
          SENTRY_DSN: 'https://public@example.ingest.sentry.io/123456',
          SENTRY_RELEASE: 'release-123',
          SENTRY_TRACES_SAMPLE_RATE: '1',
        }
      : {}),
    ...overrides,
  };
  const result = parseEnv(raw);
  if (!result.ok) {
    throw new Error(`Test fixture env parse failed: ${result.error.message}`);
  }
  return result.value;
}

function createRuntimeConfig(
  mode: 'off' | 'fixture' | 'sentry',
  envOverrides?: Record<string, string>,
): SearchCliRuntimeConfig {
  return {
    env: createTestEnv(mode, envOverrides),
    logLevel: 'info',
    version: '1.0.0-test',
  };
}

describe('createCliObservability', () => {
  it('off mode: no SDK init, null sink, noop captureHandledError', () => {
    const sdk = createFakeSentrySdk();
    const result = createCliObservability(createRuntimeConfig('off'), {
      sentrySdk: sdk.sdk,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.sentrySink).toBeNull();
    expect(sdk.init).not.toHaveBeenCalled();
  });

  it('fixture mode: non-null sink, captures to fixture store', () => {
    const fixtureStore = createFixtureSentryStore();
    const result = createCliObservability(createRuntimeConfig('fixture'), {
      fixtureStore,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    result.value.captureHandledError(new Error('test'));

    expect(fixtureStore.captures).toHaveLength(1);
    expect(fixtureStore.captures[0]?.kind).toBe('exception');
  });

  it('fixture mode: exposes sentrySink for logger integration', () => {
    const fixtureStore = createFixtureSentryStore();
    const result = createCliObservability(createRuntimeConfig('fixture'), {
      fixtureStore,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.sentrySink).not.toBeNull();
  });

  it('sentry mode: SDK init called once, flush delegates to SDK', async () => {
    const sdk = createFakeSentrySdk();
    const result = createCliObservability(createRuntimeConfig('sentry'), {
      sentrySdk: sdk.sdk,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(sdk.init).toHaveBeenCalledTimes(1);

    const flushResult = await result.value.flush();
    expect(flushResult.ok).toBe(true);
    expect(sdk.flush).toHaveBeenCalled();
  });

  it('sentry mode: captureHandledError delegates to SDK captureException', () => {
    const sdk = createFakeSentrySdk();
    const result = createCliObservability(createRuntimeConfig('sentry'), {
      sentrySdk: sdk.sdk,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    result.value.captureHandledError(new Error('test error'), {
      boundary: 'test_boundary',
    });

    expect(sdk.captureException).toHaveBeenCalledTimes(1);
    const captureArgs = sdk.captureException.mock.calls[0];
    expect(captureArgs?.[0]).toBeInstanceOf(Error);
    const captureContext = captureArgs?.[1] as Record<string, unknown> | undefined;
    const extra = captureContext?.extra as Record<string, unknown> | undefined;
    const context = extra?.context as Record<string, unknown> | undefined;
    expect(context?.boundary).toBe('test_boundary');
  });

  it('returns Err when SDK init throws', () => {
    const sdk = createFakeSentrySdk();
    sdk.init.mockImplementation(() => {
      throw new Error('init boom');
    });

    const result = createCliObservability(createRuntimeConfig('sentry'), {
      sentrySdk: sdk.sdk,
    });

    expect(result.ok).toBe(false);
    if (result.ok) {
      return;
    }

    expect(result.error.kind).toBe('sentry_sdk_init_failed');
  });

  it('withSpan runs callback and returns its value', async () => {
    const result = createCliObservability(createRuntimeConfig('off'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const value = await result.value.withSpan({
      name: 'test',
      run: () => 42,
    });
    expect(value).toBe(42);
  });

  it('flush resolves ok in off mode', async () => {
    const result = createCliObservability(createRuntimeConfig('off'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const flushResult = await result.value.flush();
    expect(flushResult.ok).toBe(true);
  });

  it('exposes service, environment, and release metadata', () => {
    const result = createCliObservability(createRuntimeConfig('off'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    expect(result.value.service).toBe('oak-search-cli');
    expect(typeof result.value.environment).toBe('string');
    expect(typeof result.value.release).toBe('string');
  });
});
