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
  SentryPostRedactionHooks,
} from './types.js';

/** Sentry hook parameter types — derived from `NodeOptions` to avoid importing private types. */
type SentryErrorEvent = Parameters<NonNullable<NodeOptions['beforeSend']>>[0];
type SentryBreadcrumb = Parameters<NonNullable<NodeOptions['beforeBreadcrumb']>>[0];
type SentryTransactionEvent = Parameters<NonNullable<NodeOptions['beforeSendTransaction']>>[0];

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

function isPromiseLike<T>(value: T | PromiseLike<unknown>): value is PromiseLike<unknown> {
  return typeof value === 'object' && value !== null && 'then' in value;
}

function getOnlyCall<T>(calls: readonly T[], message: string): T {
  expect(calls).toHaveLength(1);
  return requireDefined(calls[0], message);
}

function getOnlyBeforeSendCall(calls: readonly SentryErrorEvent[]): SentryErrorEvent {
  return getOnlyCall(calls, 'Expected the app-specific beforeSend hook to run once');
}

function getOnlyBeforeSendTransactionCall(
  calls: readonly SentryTransactionEvent[],
): SentryTransactionEvent {
  return getOnlyCall(calls, 'Expected the app-specific beforeSendTransaction hook to run once');
}

function getOnlyBeforeBreadcrumbCall(calls: readonly SentryBreadcrumb[]): SentryBreadcrumb {
  return getOnlyCall(calls, 'Expected the app-specific beforeBreadcrumb hook to run once');
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

function requireImmediateBeforeSendTransactionResult(
  value: ReturnType<NonNullable<NodeOptions['beforeSendTransaction']>>,
): SentryTransactionEvent {
  const result = requireDefined(value, 'Expected beforeSendTransaction to keep the event');

  if (isPromiseLike(result)) {
    throw new Error('Expected beforeSendTransaction to return synchronously');
  }

  return result;
}

function requireImmediateBeforeBreadcrumbResult(
  value: ReturnType<NonNullable<NodeOptions['beforeBreadcrumb']>>,
): Parameters<NonNullable<NodeOptions['beforeBreadcrumb']>>[0] {
  const result = requireDefined(value, 'Expected beforeBreadcrumb to keep the breadcrumb');

  if (isPromiseLike(result)) {
    throw new Error('Expected beforeBreadcrumb to return synchronously');
  }

  return result;
}

function decodeForAssertion(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function expectRedactedTransactionDetails(redactedTransaction: SentryTransactionEvent): void {
  expect(redactedTransaction.request?.headers).toEqual({
    authorization: '[REDACTED]',
  });
  expect(redactedTransaction.request?.url).toContain('/mcp');
  expect(redactedTransaction.request?.url).not.toContain('abc123');
  expect(
    decodeForAssertion(
      requireDefined(redactedTransaction.request?.url, 'Expected redacted request URL'),
    ),
  ).toContain('[REDACTED]');
  expect(redactedTransaction.transaction).toContain('/mcp');
  expect(redactedTransaction.transaction).not.toContain('abc123');
  expect(
    decodeForAssertion(
      requireDefined(redactedTransaction.transaction, 'Expected redacted transaction name'),
    ),
  ).toContain('[REDACTED]');
}

function expectRedactedBreadcrumbDetails(
  redactedBreadcrumb: Parameters<NonNullable<NodeOptions['beforeBreadcrumb']>>[0],
): void {
  expect(redactedBreadcrumb.category).toBe('http');
  expect(redactedBreadcrumb.message).toContain('https://example.com/mcp');
  expect(redactedBreadcrumb.message).not.toContain('abc123');
  expect(decodeForAssertion(redactedBreadcrumb.message ?? '')).toContain('[REDACTED]');
  expect(redactedBreadcrumb.data).toEqual({
    authorization: '[REDACTED]',
    requestBody: {
      jsonrpc: '2.0',
      method: 'tools/call',
    },
  });
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

function createPostRedactionHookFixture(): {
  readonly postRedactionHooks: SentryPostRedactionHooks;
  readonly captures: {
    readonly beforeSendCalls: SentryErrorEvent[];
    readonly beforeSendTransactionCalls: SentryTransactionEvent[];
    readonly beforeBreadcrumbCalls: SentryBreadcrumb[];
  };
} {
  const beforeSendCalls: SentryErrorEvent[] = [];
  const beforeSendTransactionCalls: SentryTransactionEvent[] = [];
  const beforeBreadcrumbCalls: SentryBreadcrumb[] = [];

  return {
    postRedactionHooks: {
      beforeSend(event) {
        beforeSendCalls.push(event);
        return {
          ...event,
          request: {
            method: event.request?.method ?? 'POST',
            url: '/mcp',
          },
        };
      },
      beforeSendTransaction(event) {
        beforeSendTransactionCalls.push(event);
        return {
          ...event,
          transaction: '/mcp',
        };
      },
      beforeBreadcrumb(breadcrumb) {
        beforeBreadcrumbCalls.push(breadcrumb);
        return {
          ...breadcrumb,
          data: {
            method: typeof breadcrumb.data?.method === 'string' ? breadcrumb.data.method : 'POST',
            route: '/mcp',
          },
        };
      },
    },
    captures: { beforeSendCalls, beforeSendTransactionCalls, beforeBreadcrumbCalls },
  };
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
    const beforeSendTransaction = requireDefined(
      initOptions.beforeSendTransaction,
      'Expected beforeSendTransaction hook',
    );
    const beforeBreadcrumb = requireDefined(
      initOptions.beforeBreadcrumb,
      'Expected beforeBreadcrumb hook',
    );
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
    const redactedTransaction = requireImmediateBeforeSendTransactionResult(
      beforeSendTransaction(
        {
          type: 'transaction',
          request: {
            headers: {
              authorization: 'Bearer super-secret',
            },
            url: 'https://example.com/mcp?code=abc123',
          },
          transaction: 'POST /mcp?code=abc123',
        },
        {},
      ),
    );
    const redactedBreadcrumb = requireImmediateBeforeBreadcrumbResult(
      beforeBreadcrumb({
        category: 'http',
        message: 'POST https://example.com/mcp?code=abc123',
        data: {
          authorization: 'Bearer super-secret',
          requestBody: {
            jsonrpc: '2.0',
            method: 'tools/call',
          },
        },
      }),
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
    expectRedactedTransactionDetails(redactedTransaction);
    expectRedactedBreadcrumbDetails(redactedBreadcrumb);
  });

  it('runs app-specific post-redaction hooks after shared redaction', () => {
    const { postRedactionHooks, captures } = createPostRedactionHookFixture();
    const initOptions = createSentryInitOptions(createLiveConfig(), {
      serviceName: 'oak-http',
      postRedactionHooks,
    });
    const beforeSend = requireDefined(initOptions.beforeSend, 'Expected beforeSend hook');
    const beforeSendTransaction = requireDefined(
      initOptions.beforeSendTransaction,
      'Expected beforeSendTransaction hook',
    );
    const beforeBreadcrumb = requireDefined(
      initOptions.beforeBreadcrumb,
      'Expected beforeBreadcrumb hook',
    );

    const redactedEvent = requireImmediateBeforeSendResult(
      beforeSend(
        {
          type: undefined,
          request: {
            method: 'POST',
            url: 'https://example.com/mcp?code=abc123',
            headers: {
              authorization: 'Bearer super-secret',
            },
            data: {
              jsonrpc: '2.0',
              method: 'tools/call',
              params: {
                input: 'fractions',
              },
            },
          },
        },
        {},
      ),
    );
    const redactedTransaction = requireImmediateBeforeSendTransactionResult(
      beforeSendTransaction(
        {
          type: 'transaction',
          transaction: 'POST /mcp?code=abc123',
        },
        {},
      ),
    );
    const redactedBreadcrumb = requireImmediateBeforeBreadcrumbResult(
      beforeBreadcrumb({
        category: 'http',
        data: {
          method: 'POST',
          url: 'https://example.com/mcp?code=abc123',
          body: {
            jsonrpc: '2.0',
            method: 'tools/call',
          },
        },
      }),
    );

    const beforeSendCall = getOnlyBeforeSendCall(captures.beforeSendCalls);
    expect(beforeSendCall.request).toEqual({
      headers: {
        authorization: '[REDACTED]',
      },
      data: {
        jsonrpc: '2.0',
        method: 'tools/call',
        params: {
          input: 'fractions',
        },
      },
      method: 'POST',
      url: 'https://example.com/mcp?code=%5BREDACTED%5D',
    });
    expect(redactedEvent.request).toEqual({
      method: 'POST',
      url: '/mcp',
    });
    const beforeSendTransactionCall = getOnlyBeforeSendTransactionCall(
      captures.beforeSendTransactionCalls,
    );
    expect(beforeSendTransactionCall.transaction).toContain('/mcp');
    expect(beforeSendTransactionCall.transaction).not.toContain('abc123');
    expect(
      decodeForAssertion(
        requireDefined(
          beforeSendTransactionCall.transaction,
          'Expected the transaction hook to receive a name',
        ),
      ),
    ).toContain('[REDACTED]');
    expect(redactedTransaction.transaction).toBe('/mcp');
    const beforeBreadcrumbCall = getOnlyBeforeBreadcrumbCall(captures.beforeBreadcrumbCalls);
    expect(beforeBreadcrumbCall.data).toEqual({
      method: 'POST',
      url: 'https://example.com/mcp?code=%5BREDACTED%5D',
      body: {
        jsonrpc: '2.0',
        method: 'tools/call',
      },
    });
    expect(redactedBreadcrumb.data).toEqual({
      method: 'POST',
      route: '/mcp',
    });
  });

  it('forwards live log sink events to Sentry logger API', () => {
    const errorFn = vi.fn<SentryNodeSdk['logger']['error']>();
    const sdk = createFakeSdk({ ...noopLoggerSdk, error: errorFn });
    const runtime = initialiseRuntime(
      createLiveConfig({ SENTRY_ENVIRONMENT: 'production' }),
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
