/**
 * Integration tests for the Sentry runtime: mode routing (off / fixture /
 * live), the live log sink, and the Result-typed flush and init boundary.
 * The runtime composes the injected SDK seam (a simple fake) with the
 * runtime factories — multiple units working together, not a pure function —
 * which is why this is an integration test, not a unit test.
 */
import type { CaptureContext, NodeOptions } from '@sentry/node';
import { normalizeError, type LogEvent } from '@oaknational/logger';
import type { Result } from '@oaknational/result';
import { describe, expect, it, vi } from 'vitest';
import { createSentryConfig } from './config.js';
import { createSentryLogSink, flushSentry, initialiseSentry } from './runtime.js';
import type {
  ParsedSentryConfig,
  SentryConfigEnvironment,
  SentryNodeRuntime,
  SentryNodeSdk,
} from './types.js';

interface FakeCaptureExceptionCall {
  readonly error: Error;
  readonly context?: CaptureContext;
}

interface FakeCaptureMessageCall {
  readonly message: string;
  readonly context?: CaptureContext;
}

function createNoopLoggerSdk(): SentryNodeSdk['logger'] {
  const noop = (): void => {
    /* noop */
  };
  return { trace: noop, debug: noop, info: noop, warn: noop, error: noop, fatal: noop };
}
const noopLoggerSdk = createNoopLoggerSdk();

interface FakeSdk {
  readonly sdk: SentryNodeSdk;
  readonly init: ReturnType<typeof vi.fn<SentryNodeSdk['init']>>;
  readonly captureException: ReturnType<typeof vi.fn<SentryNodeSdk['captureException']>>;
  readonly captureMessage: ReturnType<typeof vi.fn<SentryNodeSdk['captureMessage']>>;
  readonly flush: ReturnType<typeof vi.fn<SentryNodeSdk['flush']>>;
  readonly close: ReturnType<typeof vi.fn<SentryNodeSdk['close']>>;
  readonly setUser: ReturnType<typeof vi.fn<SentryNodeSdk['setUser']>>;
  readonly setTag: ReturnType<typeof vi.fn<SentryNodeSdk['setTag']>>;
  readonly setContext: ReturnType<typeof vi.fn<SentryNodeSdk['setContext']>>;
  readonly initCalls: readonly NodeOptions[];
  readonly exceptionCalls: readonly FakeCaptureExceptionCall[];
  readonly messageCalls: readonly FakeCaptureMessageCall[];
  readonly loggerSdk: SentryNodeSdk['logger'];
}

function createFakeSdk(loggerOverride?: SentryNodeSdk['logger']): FakeSdk {
  const initCalls: NodeOptions[] = [];
  const exceptionCalls: FakeCaptureExceptionCall[] = [];
  const messageCalls: FakeCaptureMessageCall[] = [];
  const init = vi.fn<SentryNodeSdk['init']>((options) => {
    initCalls.push(options);
  });
  const captureException = vi.fn<SentryNodeSdk['captureException']>((error, context) => {
    exceptionCalls.push({ error, context });
  });
  const captureMessage = vi.fn<SentryNodeSdk['captureMessage']>((message, context) => {
    messageCalls.push({ message, context });
  });
  const flush = vi.fn<SentryNodeSdk['flush']>().mockResolvedValue(true);
  const close = vi.fn<SentryNodeSdk['close']>().mockResolvedValue(true);
  const setUser = vi.fn<SentryNodeSdk['setUser']>();
  const setTag = vi.fn<SentryNodeSdk['setTag']>();
  const setContext = vi.fn<SentryNodeSdk['setContext']>();
  const loggerSdk = loggerOverride ?? noopLoggerSdk;

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
      logger: loggerSdk,
    },
    init,
    captureException,
    captureMessage,
    flush,
    close,
    setUser,
    setTag,
    setContext,
    initCalls,
    exceptionCalls,
    messageCalls,
    loggerSdk,
  };
}

function createLogEvent(): LogEvent {
  return {
    level: 'ERROR',
    message: 'request failed',
    context: {
      requestId: 'req-123',
    },
    error: normalizeError(new Error('request failed')),
    otelRecord: {
      Timestamp: '2025-11-08T12:00:00.000Z',
      ObservedTimestamp: '2025-11-08T12:00:00.000Z',
      SeverityNumber: 17,
      SeverityText: 'ERROR',
      Body: 'request failed',
      Attributes: {
        requestId: 'req-123',
      },
      Resource: {
        'service.name': 'oak-http',
        'service.version': '1.0.0',
        'deployment.environment': 'test',
      },
      TraceId: '0123456789abcdef0123456789abcdef',
      SpanId: '0123456789abcdef',
    },
    line: '{"Body":"request failed"}\n',
  };
}

function expectOk<T, E>(result: Result<T, E>): T {
  expect(result.ok).toBe(true);

  if (!result.ok) {
    throw new Error('Expected Ok result');
  }

  return result.value;
}

function requireDefined<T>(value: T | null | undefined, message: string): T {
  if (value === undefined || value === null) {
    throw new Error(message);
  }

  return value;
}

function createConfig(input: SentryConfigEnvironment): ParsedSentryConfig {
  return expectOk(
    createSentryConfig({
      APP_VERSION: '1.0.0-test',
      APP_VERSION_SOURCE: 'APP_VERSION_OVERRIDE',
      VERCEL_GIT_COMMIT_SHA: 'c8b666485ecb08b5dc27e428737b4077c0531f57',
      ...input,
    }),
  );
}

function createOffConfig(): Extract<ParsedSentryConfig, { readonly mode: 'off' }> {
  const config = createConfig({ SENTRY_MODE: 'off' });

  if (config.mode !== 'off') {
    throw new Error('Expected off config');
  }

  return config;
}

function createFixtureConfig(
  overrides: Partial<SentryConfigEnvironment> = {},
): Extract<ParsedSentryConfig, { readonly mode: 'fixture' }> {
  const config = createConfig({
    SENTRY_MODE: 'fixture',
    SENTRY_ENVIRONMENT_OVERRIDE: 'preview',
    SENTRY_RELEASE_OVERRIDE: 'release-123',
    ...overrides,
  });

  if (config.mode !== 'fixture') {
    throw new Error('Expected fixture config');
  }

  return config;
}

function createLiveConfig(
  overrides: Partial<SentryConfigEnvironment> = {},
): Extract<ParsedSentryConfig, { readonly mode: 'sentry' }> {
  const config = createConfig({
    SENTRY_MODE: 'sentry',
    SENTRY_DSN: 'https://key@example.ingest.sentry.io/123',
    SENTRY_TRACES_SAMPLE_RATE: '0.5',
    SENTRY_RELEASE_OVERRIDE: 'release-123',
    ...overrides,
  });

  if (config.mode !== 'sentry') {
    throw new Error('Expected sentry config');
  }

  return config;
}

function initialiseRuntime(config: ParsedSentryConfig, sdk?: SentryNodeSdk): SentryNodeRuntime {
  return expectOk(
    initialiseSentry(config, {
      serviceName: 'oak-http',
      ...(sdk ? { sdk } : {}),
    }),
  );
}

describe('initialiseSentry', () => {
  it('keeps off mode as a no-op kill switch', async () => {
    const sdk = createFakeSdk();
    const runtime = initialiseRuntime(createOffConfig(), sdk.sdk);

    expect(sdk.init).not.toHaveBeenCalled();
    expect(createSentryLogSink(runtime)).toBeNull();

    runtime.captureHandledError(normalizeError(new Error('ignored')));

    expect(sdk.captureException).not.toHaveBeenCalled();
    await expect(flushSentry(runtime)).resolves.toEqual({
      ok: true,
      value: undefined,
    });
  });

  it('captures fixture logs and handled errors locally without initialising the live sdk', () => {
    const runtime = initialiseRuntime(createFixtureConfig());
    const sink = requireDefined(createSentryLogSink(runtime), 'Expected fixture sink');
    const secretError = Object.assign(new Error('Bearer super-secret'), {
      apiKey: 'secret-api-key',
    });

    sink.write(createLogEvent());
    runtime.captureHandledError(normalizeError(secretError), {
      authorization: 'Bearer super-secret',
    });

    expect(runtime.fixtureStore?.captures).toHaveLength(2);
    expect(runtime.fixtureStore?.captures[0]).toMatchObject({
      kind: 'log',
      environment: 'preview',
      release: 'release-123',
    });
    expect(runtime.fixtureStore?.captures[1]).toMatchObject({
      kind: 'exception',
      environment: 'preview',
      release: 'release-123',
      context: {
        authorization: '[REDACTED]',
      },
    });
    expect(JSON.stringify(runtime.fixtureStore?.captures)).not.toContain('super-secret');
    expect(JSON.stringify(runtime.fixtureStore?.captures)).not.toContain('secret-api-key');
  });

  it('live mode initialises the sdk exactly once', () => {
    const sdk = createFakeSdk();

    initialiseRuntime(createLiveConfig(), sdk.sdk);

    expect(sdk.init).toHaveBeenCalledTimes(1);
  });

  it('forwards live log sink events to Sentry logger API', () => {
    const errorFn = vi.fn<SentryNodeSdk['logger']['error']>();
    const sdk = createFakeSdk({ ...noopLoggerSdk, error: errorFn });
    const runtime = initialiseRuntime(
      createLiveConfig({ SENTRY_ENVIRONMENT_OVERRIDE: 'production' }),
      sdk.sdk,
    );
    const sink = requireDefined(createSentryLogSink(runtime), 'Expected live sink');

    sink.write(createLogEvent());

    expect(errorFn).toHaveBeenCalledOnce();
    expect(errorFn).toHaveBeenCalledWith(
      'request failed',
      expect.objectContaining({
        service: 'oak-http',
        environment: 'production',
        release: 'release-123',
        traceId: '0123456789abcdef0123456789abcdef',
        spanId: '0123456789abcdef',
        'log.line': '{"Body":"request failed"}',
        'otel.attributes.requestId': 'req-123',
        'otel.resource.service.name': 'oak-http',
        'otel.resource.service.version': '1.0.0',
        'otel.resource.deployment.environment': 'test',
      }),
    );
    expect(sdk.captureMessage).not.toHaveBeenCalled();
  });

  it('returns Result-based flush errors for timeouts and thrown failures', async () => {
    const timeoutSdk = createFakeSdk();
    const failureSdk = createFakeSdk();
    timeoutSdk.flush.mockResolvedValueOnce(false);
    failureSdk.flush.mockRejectedValueOnce(new Error('flush exploded'));
    const config = createLiveConfig();
    const timeoutRuntime = initialiseRuntime(config, timeoutSdk.sdk);
    const failureRuntime = initialiseRuntime(config, failureSdk.sdk);

    await expect(flushSentry(timeoutRuntime, 100)).resolves.toEqual({
      ok: false,
      error: {
        kind: 'sentry_flush_timeout',
        timeoutMs: 100,
      },
    });
    await expect(flushSentry(failureRuntime, 100)).resolves.toEqual({
      ok: false,
      error: {
        kind: 'sentry_flush_failed',
        message: 'flush exploded',
      },
    });
  });

  it('surfaces sdk init failures as Result errors', () => {
    const sdk = createFakeSdk();
    sdk.init.mockImplementationOnce(() => {
      throw new Error('sdk init failed');
    });

    expect(
      initialiseSentry(createLiveConfig(), {
        serviceName: 'oak-http',
        sdk: sdk.sdk,
      }),
    ).toEqual({
      ok: false,
      error: {
        kind: 'sentry_sdk_init_failed',
        message: 'sdk init failed',
      },
    });
  });
});
