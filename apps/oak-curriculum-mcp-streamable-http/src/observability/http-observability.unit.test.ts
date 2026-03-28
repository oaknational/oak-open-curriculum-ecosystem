import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest';
import type { CaptureContext, NodeOptions } from '@sentry/node';
import { wrapPromptHandler, wrapResourceHandler, wrapToolHandler } from '@oaknational/sentry-mcp';
import type { MergedMcpObservation } from '@oaknational/sentry-mcp';
import {
  createFixtureSentryStore,
  type FixtureSentryLogCapture,
  type SentryNodeSdk,
} from '@oaknational/sentry-node';
import { typeSafeKeys } from '@oaknational/type-helpers';
import type { AuthDisabledRuntimeConfig } from '../runtime-config.js';
import { createHttpObservabilityOrThrow } from './http-observability.js';

type RecorderWithObservations = { readonly observations: readonly MergedMcpObservation[] };
type TypedMock<F extends (...args: never[]) => unknown> = ReturnType<typeof vi.fn<F>>;

interface FakeSentrySdk {
  readonly sdk: SentryNodeSdk;
  readonly init: TypedMock<(options: NodeOptions) => void>;
  readonly captureException: TypedMock<(error: Error, context?: CaptureContext) => void>;
  readonly captureMessage: TypedMock<(message: string, context?: CaptureContext) => void>;
  readonly flush: TypedMock<(timeoutMs?: number) => Promise<boolean>>;
}

function createRuntimeConfig(
  mode: 'off' | 'fixture' | 'sentry',
  envOverrides?: Partial<AuthDisabledRuntimeConfig['env']>,
): AuthDisabledRuntimeConfig {
  return {
    dangerouslyDisableAuth: true,
    useStubTools: false,
    version: '1.2.3-test',
    vercelHostnames: [],
    env: {
      OAK_API_KEY: 'test-api-key',
      ELASTICSEARCH_URL: 'https://example-elasticsearch.test',
      ELASTICSEARCH_API_KEY: 'test-es-key',
      DANGEROUSLY_DISABLE_AUTH: 'true',
      LOG_LEVEL: 'info',
      NODE_ENV: 'test',
      SENTRY_MODE: mode,
      ...(mode === 'sentry'
        ? {
            SENTRY_DSN: 'https://public@example.ingest.sentry.io/123456',
            SENTRY_RELEASE: 'release-123',
            SENTRY_TRACES_SAMPLE_RATE: '1',
          }
        : {}),
      ...envOverrides,
    },
  };
}

function createFakeSentrySdk(): FakeSentrySdk {
  const init = vi.fn<(options: NodeOptions) => void>();
  const captureException = vi.fn<(error: Error, context?: CaptureContext) => void>();
  const captureMessage = vi.fn<(message: string, context?: CaptureContext) => void>();
  const flush = vi.fn<(timeoutMs?: number) => Promise<boolean>>().mockResolvedValue(true);

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
  };
}

function getInitOptions(fakeSentrySdk: FakeSentrySdk): NodeOptions {
  const initOptions = fakeSentrySdk.init.mock.calls[0]?.[0];

  if (!initOptions) {
    throw new Error('Expected Sentry SDK init options to be captured');
  }

  return initOptions;
}

function getFixtureLogCaptures(
  captures: readonly { readonly kind: string }[],
): readonly FixtureSentryLogCapture[] {
  return captures.filter((capture): capture is FixtureSentryLogCapture => capture.kind === 'log');
}

describe('createHttpObservability', () => {
  beforeEach(() => {
    vi.spyOn(process.stdout, 'write').mockReturnValue(true);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('treats off mode as a real kill switch with no live Sentry init or sink capture', () => {
    const sdk = createFakeSentrySdk();
    const observability = createHttpObservabilityOrThrow(createRuntimeConfig('off'), {
      sentrySdk: sdk.sdk,
    });
    const logger = observability.createLogger({ name: 'test-http' });

    logger.info('off-mode-log');

    expect(sdk.init).not.toHaveBeenCalled();
    expect(sdk.captureMessage).not.toHaveBeenCalled();
    expect(sdk.captureException).not.toHaveBeenCalled();
  });

  it('initialises live Sentry once, composes the logger sink, and delegates flush', async () => {
    const sdk = createFakeSentrySdk();
    const observability = createHttpObservabilityOrThrow(createRuntimeConfig('sentry'), {
      sentrySdk: sdk.sdk,
    });
    const logger = observability.createLogger({ name: 'test-http' });

    logger.info('live-mode-log');
    observability.captureHandledError(new Error('handled error'), {
      boundary: 'test_boundary',
      secret: 'should-be-redacted',
    });
    await observability.flush(1234);
    logger.warn('second-log');

    expect(sdk.init).toHaveBeenCalledTimes(1);
    const expectedTags: unknown = expect.objectContaining({
      service: 'oak-curriculum-mcp-streamable-http',
      environment: 'test',
      release: 'release-123',
    });
    expect(sdk.captureMessage).toHaveBeenCalledWith(
      'live-mode-log',
      expect.objectContaining({
        tags: expectedTags,
      }),
    );
    const expectedContext: unknown = expect.objectContaining({
      boundary: 'test_boundary',
    });
    const expectedExtra: unknown = expect.objectContaining({
      context: expectedContext,
    });
    expect(sdk.captureException).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        extra: expectedExtra,
      }),
    );
    expect(sdk.flush).toHaveBeenCalledWith(1234);
    expect(sdk.init).toHaveBeenCalledTimes(1);
  });

  it('strips generic /mcp request capture down to method and route metadata in fake sentry mode', () => {
    const sdk = createFakeSentrySdk();
    createHttpObservabilityOrThrow(createRuntimeConfig('sentry'), {
      sentrySdk: sdk.sdk,
    });

    const initOptions = getInitOptions(sdk);
    const beforeSend = initOptions.beforeSend;
    const beforeSendTransaction = initOptions.beforeSendTransaction;
    const beforeBreadcrumb = initOptions.beforeBreadcrumb;

    expect(beforeSend).toBeDefined();
    expect(beforeSendTransaction).toBeDefined();
    expect(beforeBreadcrumb).toBeDefined();

    const event = beforeSend?.(
      {
        request: {
          url: 'https://curriculum.example.com/mcp?code=secret',
          method: 'POST',
          data: {
            jsonrpc: '2.0',
            method: 'tools/call',
            params: { arguments: { query: 'sensitive payload' } },
          },
          headers: {
            authorization: 'Bearer secret-token',
          },
        },
        transaction: 'https://curriculum.example.com/mcp?code=secret',
      } as unknown as Parameters<NonNullable<NodeOptions['beforeSend']>>[0],
      {} as Parameters<NonNullable<NodeOptions['beforeSend']>>[1],
    );

    expect(event).toEqual(
      expect.objectContaining({
        request: {
          method: 'POST',
          url: '/mcp',
        },
        transaction: 'POST /mcp',
      }),
    );

    const transaction = beforeSendTransaction?.(
      {
        request: {
          url: 'https://curriculum.example.com/mcp?state=secret',
          method: 'POST',
          headers: {
            cookie: 'secret-cookie',
          },
          data: {
            jsonrpc: '2.0',
            id: '123',
          },
        },
        transaction: 'https://curriculum.example.com/mcp?state=secret',
      } as unknown as Parameters<NonNullable<NodeOptions['beforeSendTransaction']>>[0],
      {} as Parameters<NonNullable<NodeOptions['beforeSendTransaction']>>[1],
    );

    expect(transaction).toEqual(
      expect.objectContaining({
        request: {
          method: 'POST',
          url: '/mcp',
        },
        transaction: 'POST /mcp',
      }),
    );

    const breadcrumb = beforeBreadcrumb?.(
      {
        message: 'POST https://curriculum.example.com/mcp?session=secret',
        data: {
          method: 'POST',
          url: 'https://curriculum.example.com/mcp?session=secret',
          headers: {
            authorization: 'Bearer secret-token',
          },
          body: {
            jsonrpc: '2.0',
            method: 'tools/call',
          },
        },
      } as Parameters<NonNullable<NodeOptions['beforeBreadcrumb']>>[0],
      {} as Parameters<NonNullable<NodeOptions['beforeBreadcrumb']>>[1],
    );

    expect(breadcrumb).toEqual(
      expect.objectContaining({
        message: 'POST /mcp',
        data: {
          method: 'POST',
          route: '/mcp',
        },
      }),
    );
  });
});

describe('createHttpObservability trace-context propagation', () => {
  beforeEach(() => {
    vi.spyOn(process.stdout, 'write').mockReturnValue(true);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('records metadata-only MCP observations that share trace context with logs in fixture mode', async () => {
    const fixtureStore = createFixtureSentryStore();
    const observability = createHttpObservabilityOrThrow(createRuntimeConfig('fixture'), {
      fixtureStore,
    });
    const recorder = observability.mcpRecorder as unknown as RecorderWithObservations;
    const logger = observability.createLogger({ name: 'test-http' });
    const observationOptions = observability.createMcpObservationOptions();

    const wrappedTool = wrapToolHandler(
      'test-tool',
      async (params: { readonly topic: string }) => {
        logger.info('tool.handler.log', { topic: params.topic });
        return { ok: true };
      },
      observationOptions,
    );
    const wrappedResource = wrapResourceHandler(
      'test-resource',
      async () => {
        logger.info('resource.handler.log');
        return { contents: [] };
      },
      observationOptions,
    );
    const wrappedPrompt = wrapPromptHandler(
      'test-prompt',
      async () => {
        logger.info('prompt.handler.log');
        return { messages: [] };
      },
      observationOptions,
    );

    await observability.withSpan({
      name: 'oak.http.request.mcp',
      attributes: {
        'http.route': '/mcp',
      },
      run: async () => {
        await wrappedTool({ topic: 'fractions' });
        await wrappedResource();
        await wrappedPrompt();
      },
    });

    expect(recorder.observations).toHaveLength(3);
    expect(recorder.observations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'tool', name: 'test-tool', status: 'success' }),
        expect.objectContaining({ kind: 'resource', name: 'test-resource', status: 'success' }),
        expect.objectContaining({ kind: 'prompt', name: 'test-prompt', status: 'success' }),
      ]),
    );
    const requestTraceId = recorder.observations[0]?.traceId;
    expect(requestTraceId).toMatch(/^[0-9a-f]{32}$/);
    for (const observation of recorder.observations) {
      expect(observation.traceId).toBe(requestTraceId);
      expect(typeSafeKeys(observation).sort()).toStrictEqual([
        'durationMs',
        'environment',
        'kind',
        'name',
        'release',
        'service',
        'spanId',
        'status',
        'traceId',
      ]);
    }

    const logCaptures = getFixtureLogCaptures(fixtureStore.captures);

    expect(logCaptures).toHaveLength(3);
    expect(logCaptures.every((capture) => capture.traceId === requestTraceId)).toBe(true);
  });
});
