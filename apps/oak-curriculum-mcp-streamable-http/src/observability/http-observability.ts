import {
  normalizeError,
  sanitiseObject,
  type LogContextInput,
  type Logger,
  type LogSink,
} from '@oaknational/logger';
import { err, type Result } from '@oaknational/result';
import {
  createInMemoryMcpObservationRecorder,
  type McpObservationOptions,
  type McpObservationRecorder,
  type McpObservationRuntime,
} from '@oaknational/sentry-mcp';
import {
  createSentryConfig,
  createSentryLogSink,
  flushSentry,
  initialiseSentry,
  type FixtureSentryStore,
  type SentryFlushError,
  type SentryNodeRuntime,
  type SentryNodeSdk,
} from '@oaknational/sentry-node';
import { trace, type Tracer } from '@opentelemetry/api';
import type { WithActiveSpanOptions } from '@oaknational/observability';
import type { HttpLoggerOptions } from '../logging/index.js';
import { createHttpLogger } from '../logging/index.js';
import type { RuntimeConfig } from '../runtime-config.js';
import type { HttpObservabilityError } from './http-observability-error.js';
import { describeHttpObservabilityError } from './http-observability-error.js';
import type { HttpSpanOptions, HttpSyncSpanOptions, SpanFunctions } from './span-helpers.js';
import { createSpanFunctions } from './span-helpers.js';
import { createHttpPostRedactionHooks } from './sanitise-mcp-events.js';

export type { HttpObservabilityError } from './http-observability-error.js';
export { describeHttpObservabilityError } from './http-observability-error.js';
export type { HttpSpanHandle, HttpSpanOptions, HttpSyncSpanOptions } from './span-helpers.js';

const DEFAULT_HTTP_SERVICE_NAME = 'oak-curriculum-mcp-streamable-http';

export interface CreateHttpObservabilityOptions {
  readonly serviceName?: string;
  readonly sentrySdk?: SentryNodeSdk;
  readonly fixtureStore?: FixtureSentryStore;
  readonly stdoutSink?: LogSink;
}

export interface HttpObservability extends McpObservationRuntime {
  readonly service: string;
  readonly environment: string;
  readonly release: string;
  readonly tracer: Tracer | undefined;
  readonly mcpRecorder: McpObservationRecorder;
  readonly fixtureStore?: FixtureSentryStore;
  createLogger(options?: HttpLoggerOptions): Logger;
  createMcpObservationOptions(): Pick<
    McpObservationOptions,
    'environment' | 'recorder' | 'release' | 'runtime' | 'service' | 'tracer'
  >;
  withSpan<T>(options: HttpSpanOptions<T>): Promise<T>;
  withSpanSync<T>(options: HttpSyncSpanOptions<T>): T;
  captureHandledError(error: unknown, context?: LogContextInput): void;
  flush(timeoutMs?: number): Promise<Result<void, SentryFlushError>>;
}

const noopMcpObservationRecorder: McpObservationRecorder = {
  record(): void {
    // Intentionally empty: off and live sentry mode do not keep an in-memory MCP transcript.
  },
};

function createMcpRecorder(mode: SentryNodeRuntime['config']['mode']): McpObservationRecorder {
  return mode === 'fixture' ? createInMemoryMcpObservationRecorder() : noopMcpObservationRecorder;
}

function createLoggerFactory(
  runtimeConfig: RuntimeConfig,
  sentryRuntime: SentryNodeRuntime,
  getActiveSpanContext: SpanFunctions['getActiveSpanContext'],
  stdoutSink?: LogSink,
): HttpObservability['createLogger'] {
  const sentrySink = createSentryLogSink(sentryRuntime);

  return (loggerOptions) =>
    createHttpLogger(runtimeConfig, {
      ...loggerOptions,
      additionalSinks: sentrySink
        ? [sentrySink, ...(loggerOptions?.additionalSinks ?? [])]
        : loggerOptions?.additionalSinks,
      getActiveSpanContext,
      stdoutSink,
    });
}

interface BuildObservabilityParams {
  readonly runtimeConfig: RuntimeConfig;
  readonly sentryRuntime: SentryNodeRuntime;
  readonly serviceName: string;
  readonly environment: string;
  readonly release: string;
  readonly tracer: Tracer | undefined;
  readonly mcpRecorder: McpObservationRecorder;
  readonly stdoutSink?: LogSink;
}

function buildObservabilityObject(p: BuildObservabilityParams): HttpObservability {
  const spanFunctions = createSpanFunctions(p.tracer);

  const observability: HttpObservability = {
    service: p.serviceName,
    environment: p.environment,
    release: p.release,
    tracer: p.tracer,
    mcpRecorder: p.mcpRecorder,
    fixtureStore: p.sentryRuntime.fixtureStore,
    getActiveSpanContext: spanFunctions.getActiveSpanContext,
    async withActiveSpan<T>(options: WithActiveSpanOptions<T>): Promise<T> {
      return await spanFunctions.withSpan({
        name: options.name,
        attributes: options.attributes,
        run: async () => await options.run(),
      });
    },
    createLogger: createLoggerFactory(
      p.runtimeConfig,
      p.sentryRuntime,
      spanFunctions.getActiveSpanContext,
      p.stdoutSink,
    ),
    createMcpObservationOptions() {
      return {
        service: p.serviceName,
        environment: p.environment,
        release: p.release,
        recorder: p.mcpRecorder,
        runtime: observability,
        tracer: p.tracer,
      };
    },
    withSpan: spanFunctions.withSpan,
    withSpanSync: spanFunctions.withSpanSync,
    captureHandledError(error, captureContext): void {
      p.sentryRuntime.captureHandledError(
        normalizeError(error),
        sanitiseObject(captureContext) ?? undefined,
      );
    },
    async flush(timeoutMs): Promise<Result<void, SentryFlushError>> {
      return await flushSentry(p.sentryRuntime, timeoutMs);
    },
  };

  return observability;
}

function resolveTracer(mode: string, serviceName: string, version: string): Tracer | undefined {
  return mode === 'sentry' ? trace.getTracer(serviceName, version) : undefined;
}

export function createHttpObservability(
  runtimeConfig: RuntimeConfig,
  options?: CreateHttpObservabilityOptions,
): Result<HttpObservability, HttpObservabilityError> {
  const sentryConfigResult = createSentryConfig(runtimeConfig.env);

  if (!sentryConfigResult.ok) {
    return err(sentryConfigResult.error);
  }

  const sentryConfig = sentryConfigResult.value;
  const serviceName = options?.serviceName ?? DEFAULT_HTTP_SERVICE_NAME;
  const sentryRuntimeResult = initialiseSentry(sentryConfig, {
    serviceName,
    sdk: options?.sentrySdk,
    fixtureStore: options?.fixtureStore,
    postRedactionHooks: createHttpPostRedactionHooks(),
  });

  if (!sentryRuntimeResult.ok) {
    return err(sentryRuntimeResult.error);
  }

  const tracer = resolveTracer(sentryConfig.mode, serviceName, runtimeConfig.version);

  return {
    ok: true,
    value: buildObservabilityObject({
      runtimeConfig,
      sentryRuntime: sentryRuntimeResult.value,
      serviceName,
      environment: sentryConfig.environment,
      release: sentryConfig.release,
      tracer,
      mcpRecorder: createMcpRecorder(sentryRuntimeResult.value.config.mode),
      stdoutSink: options?.stdoutSink,
    }),
  };
}

export function createHttpObservabilityOrThrow(
  runtimeConfig: RuntimeConfig,
  options?: CreateHttpObservabilityOptions,
): HttpObservability {
  const result = createHttpObservability(runtimeConfig, options);

  if (!result.ok) {
    throw new Error(describeHttpObservabilityError(result.error));
  }

  return result.value;
}
