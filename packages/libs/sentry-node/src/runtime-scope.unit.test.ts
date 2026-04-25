/**
 * Tests for setUser, setTag, setContext, close, and createSentryInitOptions.
 *
 * @remarks Split from runtime.unit.test.ts to stay within max-lines.
 * Uses the same FakeSdk pattern and config helpers.
 */

import { describe, expect, it, vi } from 'vitest';
import { initialiseSentry } from './runtime.js';
import { createSentryInitOptions, DEFAULT_TRACE_PROPAGATION_TARGETS } from './runtime-sdk.js';
import type { ParsedSentryConfig, SentryNodeRuntime, SentryNodeSdk } from './types.js';

function createNoopLoggerSdk(): SentryNodeSdk['logger'] {
  const noop = (): void => {
    /* noop */
  };
  return { trace: noop, debug: noop, info: noop, warn: noop, error: noop, fatal: noop };
}

const noopLoggerSdk = createNoopLoggerSdk();

function createFakeSdk(): {
  readonly sdk: SentryNodeSdk;
  readonly close: ReturnType<typeof vi.fn<SentryNodeSdk['close']>>;
  readonly setUser: ReturnType<typeof vi.fn<SentryNodeSdk['setUser']>>;
  readonly setTag: ReturnType<typeof vi.fn<SentryNodeSdk['setTag']>>;
  readonly setContext: ReturnType<typeof vi.fn<SentryNodeSdk['setContext']>>;
} {
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
      logger: noopLoggerSdk,
    },
    close,
    setUser,
    setTag,
    setContext,
  };
}

function expectOk<T>(result: { readonly ok: boolean; readonly value?: T }): T {
  expect(result.ok).toBe(true);
  const { value } = result;
  if (value === undefined) {
    throw new Error('Expected result to have a value');
  }
  return value;
}

function createOffConfig(): Extract<ParsedSentryConfig, { readonly mode: 'off' }> {
  return {
    mode: 'off',
    environment: 'test',
    environmentSource: 'SENTRY_ENVIRONMENT_OVERRIDE',
    enableLogs: false,
    sendDefaultPii: false,
    debug: false,
  };
}

function createFixtureConfig(): Extract<ParsedSentryConfig, { readonly mode: 'fixture' }> {
  return {
    mode: 'fixture',
    environment: 'test',
    environmentSource: 'SENTRY_ENVIRONMENT_OVERRIDE',
    release: 'test-1.0.0',
    releaseSource: 'application_version',
    enableLogs: true,
    sendDefaultPii: false,
    debug: false,
  };
}

function createLiveConfig(): Extract<ParsedSentryConfig, { readonly mode: 'sentry' }> {
  return {
    mode: 'sentry',
    dsn: 'https://key@example.ingest.sentry.io/123',
    environment: 'test',
    environmentSource: 'SENTRY_ENVIRONMENT_OVERRIDE',
    release: 'test-1.0.0',
    releaseSource: 'application_version',
    tracesSampleRate: 1.0,
    enableLogs: true,
    sendDefaultPii: false,
    debug: false,
  };
}

function initialiseWithSdk(config: ParsedSentryConfig, sdk: SentryNodeSdk): SentryNodeRuntime {
  return expectOk(initialiseSentry(config, { serviceName: 'oak-test', sdk }));
}

function initialiseWithFixture(config: ParsedSentryConfig): SentryNodeRuntime {
  return expectOk(initialiseSentry(config, { serviceName: 'oak-test' }));
}

describe('setUser / setTag / setContext', () => {
  it('off mode: noops without calling the SDK', () => {
    const { sdk } = createFakeSdk();
    const runtime = initialiseWithSdk(createOffConfig(), sdk);

    runtime.setUser({ id: 'user-1' });
    runtime.setTag('team', 'curriculum');
    runtime.setContext('request', { path: '/mcp' });

    expect(sdk.setUser).not.toHaveBeenCalled();
    expect(sdk.setTag).not.toHaveBeenCalled();
    expect(sdk.setContext).not.toHaveBeenCalled();
  });

  it('fixture mode: captures to the fixture store', () => {
    const runtime = initialiseWithFixture(createFixtureConfig());

    runtime.setUser({ id: 'user-1', username: 'jsmith' });
    runtime.setTag('team', 'curriculum');
    runtime.setContext('request', { path: '/mcp' });

    const captures = runtime.fixtureStore?.captures ?? [];
    expect(captures).toHaveLength(3);
    expect(captures[0]).toStrictEqual({
      kind: 'set_user',
      user: { id: 'user-1', username: 'jsmith' },
    });
    expect(captures[1]).toStrictEqual({ kind: 'set_tag', key: 'team', value: 'curriculum' });
    expect(captures[2]).toStrictEqual({
      kind: 'set_context',
      name: 'request',
      context: { path: '/mcp' },
    });
  });

  it('fixture mode: setUser(null) captures null user', () => {
    const runtime = initialiseWithFixture(createFixtureConfig());

    runtime.setUser(null);

    const captures = runtime.fixtureStore?.captures ?? [];
    expect(captures).toHaveLength(1);
    expect(captures[0]).toStrictEqual({ kind: 'set_user', user: null });
  });

  it('live mode: delegates to the SDK', () => {
    const { sdk, setUser, setTag, setContext } = createFakeSdk();
    const runtime = initialiseWithSdk(createLiveConfig(), sdk);

    runtime.setUser({ id: 'user-1' });
    runtime.setTag('team', 'curriculum');
    runtime.setContext('request', { path: '/mcp' });

    expect(setUser).toHaveBeenCalledWith({ id: 'user-1' });
    expect(setTag).toHaveBeenCalledWith('team', 'curriculum');
    expect(setContext).toHaveBeenCalledWith('request', { path: '/mcp' });
  });
});

describe('close', () => {
  it('off mode: resolves ok without calling the SDK', async () => {
    const { sdk } = createFakeSdk();
    const runtime = initialiseWithSdk(createOffConfig(), sdk);

    const result = await runtime.close();

    expect(result.ok).toBe(true);
    expect(sdk.close).not.toHaveBeenCalled();
  });

  it('fixture mode: resolves ok without calling the SDK', async () => {
    const runtime = initialiseWithFixture(createFixtureConfig());

    const result = await runtime.close();

    expect(result.ok).toBe(true);
  });

  it('live mode: delegates to the SDK and returns ok on success', async () => {
    const { sdk, close } = createFakeSdk();
    const runtime = initialiseWithSdk(createLiveConfig(), sdk);

    const result = await runtime.close();

    expect(close).toHaveBeenCalledTimes(1);
    expect(result.ok).toBe(true);
  });

  it('live mode: returns close_timeout when SDK returns false', async () => {
    const fake = createFakeSdk();
    fake.close.mockResolvedValue(false);
    const runtime = initialiseWithSdk(createLiveConfig(), fake.sdk);

    const result = await runtime.close(3000);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('sentry_close_timeout');
    }
  });

  it('live mode: returns close_failed when SDK rejects', async () => {
    const fake = createFakeSdk();
    fake.close.mockRejectedValue(new Error('close exploded'));
    const runtime = initialiseWithSdk(createLiveConfig(), fake.sdk);

    const result = await runtime.close();

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.kind).toBe('sentry_close_failed');
    }
  });
});

describe('createSentryInitOptions', () => {
  it('matches the live config contract', () => {
    const initOptions = createSentryInitOptions(createLiveConfig(), { serviceName: 'oak-http' });

    expect(initOptions).toEqual(
      expect.objectContaining({
        dsn: 'https://key@example.ingest.sentry.io/123',
        release: 'test-1.0.0',
        tracesSampleRate: 1.0,
        enableLogs: true,
        debug: false,
        tracePropagationTargets: DEFAULT_TRACE_PROPAGATION_TARGETS,
      }),
    );
  });
});
