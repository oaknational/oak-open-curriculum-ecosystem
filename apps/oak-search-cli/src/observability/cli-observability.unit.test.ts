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
  readonly close: ReturnType<typeof vi.fn<SentryNodeSdk['close']>>;
  readonly setUser: ReturnType<typeof vi.fn<SentryNodeSdk['setUser']>>;
  readonly setTag: ReturnType<typeof vi.fn<SentryNodeSdk['setTag']>>;
  readonly setContext: ReturnType<typeof vi.fn<SentryNodeSdk['setContext']>>;
}

function createFakeSentrySdk(): FakeSentrySdk {
  const init = vi.fn<SentryNodeSdk['init']>();
  const captureException = vi.fn<SentryNodeSdk['captureException']>();
  const captureMessage = vi.fn<SentryNodeSdk['captureMessage']>();
  const flush = vi.fn<SentryNodeSdk['flush']>().mockResolvedValue(true);
  const close = vi.fn<SentryNodeSdk['close']>().mockResolvedValue(true);
  const setUser = vi.fn<SentryNodeSdk['setUser']>();
  const setTag = vi.fn<SentryNodeSdk['setTag']>();
  const setContext = vi.fn<SentryNodeSdk['setContext']>();

  return {
    sdk: {
      init,
      captureException,
      captureMessage,
      flush,
      close,
      setUser,
      setTag,
      setContext,
      logger: noopLogger,
    },
    init,
    captureException,
    captureMessage,
    flush,
    close,
    setUser,
    setTag,
    setContext,
  };
}

function createTestEnv(
  mode: 'off' | 'fixture' | 'sentry',
  overrides?: Record<string, string>,
): SearchCliRuntimeConfig['env'] {
  const raw: Record<string, string | undefined> = {
    ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
    ELASTICSEARCH_API_KEY: 'elastic-key-12345',
    OAK_API_KEY: 'oak-key-12345',
    SEARCH_API_KEY: 'search-key-12345',
    SEARCH_INDEX_VERSION: 'v2026-01-01',
    SENTRY_MODE: mode,
    SENTRY_RELEASE_OVERRIDE: 'release-123',
    ...(mode === 'sentry'
      ? {
          SENTRY_DSN: 'https://public@example.ingest.sentry.io/123456',
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
    versionSource: 'APP_VERSION_OVERRIDE',
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

    expect(sdk.captureException).toHaveBeenCalledOnce();
    // Verify the error was normalised and context was passed through.
    // Detailed CaptureContext structure is the adapter's concern (tested in sentry-node).
    const lastCall = sdk.captureException.mock.lastCall;
    expect(lastCall?.[0]).toBeInstanceOf(Error);
    expect(lastCall?.[1]).toBeDefined();
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

  it('close resolves ok in off mode', async () => {
    const result = createCliObservability(createRuntimeConfig('off'));

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const closeResult = await result.value.close();
    expect(closeResult.ok).toBe(true);
  });

  it('sentry mode: close delegates to SDK', async () => {
    const sdk = createFakeSentrySdk();
    const result = createCliObservability(createRuntimeConfig('sentry'), {
      sentrySdk: sdk.sdk,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    const closeResult = await result.value.close();
    expect(closeResult.ok).toBe(true);
    expect(sdk.sdk.close).toHaveBeenCalled();
  });

  it('fixture mode: setTag captures to fixture store', () => {
    const fixtureStore = createFixtureSentryStore();
    const result = createCliObservability(createRuntimeConfig('fixture'), {
      fixtureStore,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    result.value.setTag('cli.command', 'search.lessons');

    expect(fixtureStore.captures).toHaveLength(1);
    expect(fixtureStore.captures[0]).toStrictEqual({
      kind: 'set_tag',
      key: 'cli.command',
      value: 'search.lessons',
    });
  });

  it('fixture mode: setContext captures to fixture store', () => {
    const fixtureStore = createFixtureSentryStore();
    const result = createCliObservability(createRuntimeConfig('fixture'), {
      fixtureStore,
    });

    expect(result.ok).toBe(true);
    if (!result.ok) {
      return;
    }

    result.value.setContext('cli_request', { index: 'primary', version: 'v2026-01-01' });

    expect(fixtureStore.captures).toHaveLength(1);
    expect(fixtureStore.captures[0]).toStrictEqual({
      kind: 'set_context',
      name: 'cli_request',
      context: { index: 'primary', version: 'v2026-01-01' },
    });
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
