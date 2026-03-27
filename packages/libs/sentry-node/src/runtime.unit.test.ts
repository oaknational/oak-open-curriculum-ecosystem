import type { CaptureContext, NodeOptions } from '@sentry/node';
import { normalizeError, type LogEvent } from '@oaknational/logger';
import type { Result } from '@oaknational/result';
import { describe, expect, it, vi } from 'vitest';
import { createSentryConfig } from './config.js';
import { createSentryInitOptions, DEFAULT_TRACE_PROPAGATION_TARGETS } from './runtime-sdk.js';
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

interface FakeSdk {
  readonly sdk: SentryNodeSdk;
  readonly init: ReturnType<typeof vi.fn<SentryNodeSdk['init']>>;
  readonly captureException: ReturnType<typeof vi.fn<SentryNodeSdk['captureException']>>;
  readonly captureMessage: ReturnType<typeof vi.fn<SentryNodeSdk['captureMessage']>>;
  readonly flush: ReturnType<typeof vi.fn<SentryNodeSdk['flush']>>;
  readonly initCalls: readonly NodeOptions[];
  readonly exceptionCalls: readonly FakeCaptureExceptionCall[];
  readonly messageCalls: readonly FakeCaptureMessageCall[];
}

function createFakeSdk(): FakeSdk {
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

  return {
    sdk: {
      init,
      captureException,
      captureMessage,
      flush,
    },
    init,
    captureException,
    captureMessage,
    flush,
    initCalls,
    exceptionCalls,
    messageCalls,
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

function isPromiseLike<T>(value: T | PromiseLike<unknown>): value is PromiseLike<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value;
}

function getOnlyCall<T>(calls: readonly T[], message: string): T {
  expect(calls).toHaveLength(1);
  return requireDefined(calls[0], message);
}

function requireImmediateBeforeSendResult(
  value: ReturnType<NonNullable<NodeOptions['beforeSend']>>,
): Parameters<NonNullable<NodeOptions['beforeSend']>>[0] {
  const result = requireDefined(value, 'Expected beforeSend to keep the event');

  if (isPromiseLike(result)) {
    throw new Error('Expected beforeSend to return synchronously');
  }

  return result;
}

function createConfig(input: SentryConfigEnvironment): ParsedSentryConfig {
  return expectOk(createSentryConfig(input));
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
    SENTRY_ENVIRONMENT: 'preview',
    SENTRY_RELEASE: 'release-123',
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
    SENTRY_RELEASE: 'release-123',
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

  it('initialises live mode with deny-by-default trace propagation', () => {
    const sdk = createFakeSdk();
    const runtime = initialiseRuntime(
      createLiveConfig({ SENTRY_ENVIRONMENT: 'production' }),
      sdk.sdk,
    );
    const initOptions = getOnlyCall(sdk.initCalls, 'Expected init options');

    expect(runtime.tracePropagationTargets).toEqual(DEFAULT_TRACE_PROPAGATION_TARGETS);
    expect(initOptions.tracePropagationTargets).toEqual(DEFAULT_TRACE_PROPAGATION_TARGETS);
    expect(initOptions.sendDefaultPii).toBe(false);
  });

  it('redacts live before-send hooks', () => {
    const initOptions = createSentryInitOptions(createLiveConfig(), {
      serviceName: 'oak-http',
    });
    const beforeSend = requireDefined(initOptions.beforeSend, 'Expected beforeSend hook');
    const beforeSendLog = requireDefined(initOptions.beforeSendLog, 'Expected beforeSendLog hook');
    const redactedEvent = requireImmediateBeforeSendResult(
      beforeSend(
        {
          type: undefined,
          extra: {
            token: 'secret-token',
          },
          exception: {
            values: [
              {
                type: 'Error',
                value: 'Bearer super-secret',
              },
            ],
          },
          request: {
            headers: {
              authorization: 'Bearer super-secret',
            },
            url: 'https://example.com/callback?code=abc123',
          },
        },
        {},
      ),
    );
    const redactedLog = requireDefined(
      beforeSendLog({
        level: 'error',
        message: 'Bearer super-secret',
        attributes: {
          apiKey: 'secret-api-key',
        },
      }),
      'Expected beforeSendLog to keep the log',
    );

    expect(redactedEvent.request).toEqual({
      headers: {
        authorization: '[REDACTED]',
      },
      url: 'https://example.com/callback?code=%5BREDACTED%5D',
    });
    expect(redactedEvent.extra).toEqual({
      token: '[REDACTED]',
    });
    expect(redactedEvent.exception?.values?.[0]?.value).toBe('Bearer [REDACTED]');
    expect(redactedLog.message).toBe('Bearer [REDACTED]');
    expect(redactedLog.attributes).toEqual({
      apiKey: '[REDACTED]',
    });
  });

  it('forwards live log sink events to captureMessage', () => {
    const sdk = createFakeSdk();
    const runtime = initialiseRuntime(
      createLiveConfig({ SENTRY_ENVIRONMENT: 'production' }),
      sdk.sdk,
    );
    const sink = requireDefined(createSentryLogSink(runtime), 'Expected live sink');

    sink.write(createLogEvent());

    expect(sdk.captureMessage).toHaveBeenCalledOnce();
    expect(getOnlyCall(sdk.messageCalls, 'Expected captureMessage call')).toEqual({
      message: 'request failed',
      context: {
        level: 'error',
        tags: {
          service: 'oak-http',
          environment: 'production',
          release: 'release-123',
          traceId: '0123456789abcdef0123456789abcdef',
          spanId: '0123456789abcdef',
        },
        extra: {
          attributes: {
            requestId: 'req-123',
          },
          resource: {
            'service.name': 'oak-http',
            'service.version': '1.0.0',
            'deployment.environment': 'test',
          },
          line: '{"Body":"request failed"}',
        },
      },
    });
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

describe('createSentryInitOptions', () => {
  it('matches the live config contract', () => {
    const initOptions = createSentryInitOptions(
      createLiveConfig({
        SENTRY_ENABLE_LOGS: 'false',
        SENTRY_DEBUG: 'true',
      }),
      {
        serviceName: 'oak-http',
      },
    );

    expect(initOptions).toEqual(
      expect.objectContaining({
        dsn: 'https://key@example.ingest.sentry.io/123',
        release: 'release-123',
        tracesSampleRate: 0.5,
        enableLogs: false,
        debug: true,
        tracePropagationTargets: DEFAULT_TRACE_PROPAGATION_TARGETS,
      }),
    );
  });
});
