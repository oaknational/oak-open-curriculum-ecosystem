import { type LogContextInput, type Logger, type LogSink } from '@oaknational/logger';
import { err, ok, type Result } from '@oaknational/result';
import {
  createSentryConfig,
  createSentryLogSink,
  initialiseSentry,
  type FixtureSentryStore,
  type InitialiseSentryError,
  type ParsedSentryConfig,
  type SentryNodeRuntime,
  type SentryNodeSdk,
} from '@oaknational/sentry-node';
import { trace, type Tracer } from '@opentelemetry/api';
import type {
  ActiveSpanContextSnapshot,
  ObservabilityCloseError,
  ObservabilityContextPayload,
  ObservabilityFlushError,
  ObservabilityUser,
  WithActiveSpanOptions,
} from '@oaknational/observability';
import type { HttpLoggerOptions } from '../logging/index.js';
import { createHttpLogger } from '../logging/index.js';
import type { RuntimeConfig } from '../runtime-config.js';
import type { HttpObservabilityError } from './http-observability-error.js';
import { describeHttpObservabilityError } from './http-observability-error.js';
import type { HttpSpanOptions, HttpSyncSpanOptions, SpanFunctions } from './span-helpers.js';
import { createSpanFunctions } from './span-helpers.js';
import { createHttpPostRedactionHooks } from './sanitise-mcp-events.js';
import { createSentryDelegates } from './sentry-observability-delegates.js';

export { describeHttpObservabilityError } from './http-observability-error.js';
export type { HttpSpanHandle, HttpSpanOptions, HttpSyncSpanOptions } from './span-helpers.js';

const DEFAULT_HTTP_SERVICE_NAME = 'oak-curriculum-mcp-streamable-http';

interface CreateHttpObservabilityOptions {
  readonly serviceName?: string;
  readonly sentrySdk?: SentryNodeSdk;
  readonly fixtureStore?: FixtureSentryStore;
  readonly stdoutSink?: LogSink;
}

export interface HttpObservability {
  readonly getActiveSpanContext: () => ActiveSpanContextSnapshot | undefined;
  withActiveSpan<T>(options: Omit<WithActiveSpanOptions<T>, 'tracer'>): Promise<T>;
  readonly service: string;
  readonly environment: string;
  readonly release: string;
  readonly tracer: Tracer | undefined;
  readonly fixtureStore?: FixtureSentryStore;
  createLogger(options?: HttpLoggerOptions): Logger;
  withSpan<T>(options: HttpSpanOptions<T>): Promise<T>;
  withSpanSync<T>(options: HttpSyncSpanOptions<T>): T;
  captureHandledError(error: unknown, context?: LogContextInput): void;
  /**
   * Set the user identity on the current isolation scope.
   *
   * @remarks Called per-request from the MCP handler when auth context
   * is available. Sentry v8+ forks an isolation scope per Express
   * request, so this writes to the request's scope only. Pass `null`
   * to clear user context.
   */
  setUser(user: ObservabilityUser | null): void;
  /**
   * Set a tag on the current isolation scope.
   *
   * @remarks Tags are string-only. Sentry serialises tag values as
   * strings; number/boolean would add no value and mislead callers
   * into expecting typed filtering.
   */
  setTag(key: string, value: string): void;
  /**
   * Set structured context on the current isolation scope.
   *
   * @remarks Pass `null` to clear a named context.
   */
  setContext(name: string, context: ObservabilityContextPayload | null): void;
  flush(timeoutMs?: number): Promise<Result<void, ObservabilityFlushError>>;
  /**
   * Close the observability transport — drains pending events AND disables the SDK.
   *
   * @remarks Preferred over {@link flush} for process shutdown. `close()`
   * drains the event queue and then disables the SDK, which is the correct
   * semantic when the process is about to exit. All three shutdown paths
   * (SIGTERM, server error, bootstrap failure) should use this method.
   */
  close(timeoutMs?: number): Promise<Result<void, ObservabilityCloseError>>;
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
  readonly stdoutSink?: LogSink;
}

function buildObservabilityObject(params: BuildObservabilityParams): HttpObservability {
  const spanFunctions = createSpanFunctions(params.tracer);
  const delegates = createSentryDelegates(params.sentryRuntime);

  const observability: HttpObservability = {
    service: params.serviceName,
    environment: params.environment,
    release: params.release,
    tracer: params.tracer,
    fixtureStore: params.sentryRuntime.fixtureStore,
    getActiveSpanContext: spanFunctions.getActiveSpanContext,
    async withActiveSpan<T>(options: Omit<WithActiveSpanOptions<T>, 'tracer'>): Promise<T> {
      return await spanFunctions.withSpan({
        name: options.name,
        attributes: options.attributes,
        run: async () => await options.run(),
      });
    },
    createLogger: createLoggerFactory(
      params.runtimeConfig,
      params.sentryRuntime,
      spanFunctions.getActiveSpanContext,
      params.stdoutSink,
    ),
    withSpan: spanFunctions.withSpan,
    withSpanSync: spanFunctions.withSpanSync,
    ...delegates,
  };

  return observability;
}

function resolveTracer(mode: string, serviceName: string, version: string): Tracer | undefined {
  return mode === 'sentry' ? trace.getTracer(serviceName, version) : undefined;
}

function createSentryConfigEnvironment(runtimeConfig: RuntimeConfig) {
  return {
    ...runtimeConfig.env,
    APP_VERSION: runtimeConfig.version,
    APP_VERSION_SOURCE: runtimeConfig.versionSource,
    ...(runtimeConfig.gitSha
      ? { GIT_SHA: runtimeConfig.gitSha, GIT_SHA_SOURCE: runtimeConfig.gitShaSource }
      : {}),
  };
}

function initialiseHttpSentryRuntime(
  runtimeConfig: RuntimeConfig,
  options: CreateHttpObservabilityOptions | undefined,
): Result<
  {
    readonly config: ParsedSentryConfig;
    readonly runtime: SentryNodeRuntime;
    readonly serviceName: string;
  },
  InitialiseSentryError | HttpObservabilityError
> {
  const sentryConfigResult = createSentryConfig(createSentryConfigEnvironment(runtimeConfig));

  if (!sentryConfigResult.ok) {
    return err(sentryConfigResult.error);
  }

  const serviceName = options?.serviceName ?? DEFAULT_HTTP_SERVICE_NAME;
  const sentryRuntimeResult = initialiseSentry(sentryConfigResult.value, {
    serviceName,
    sdk: options?.sentrySdk,
    fixtureStore: options?.fixtureStore,
    postRedactionHooks: createHttpPostRedactionHooks(),
  });

  if (!sentryRuntimeResult.ok) {
    return err(sentryRuntimeResult.error);
  }

  return ok({
    config: sentryConfigResult.value,
    runtime: sentryRuntimeResult.value,
    serviceName,
  });
}

export function createHttpObservability(
  runtimeConfig: RuntimeConfig,
  options?: CreateHttpObservabilityOptions,
): Result<HttpObservability, HttpObservabilityError> {
  const sentryInitialisationResult = initialiseHttpSentryRuntime(runtimeConfig, options);

  if (!sentryInitialisationResult.ok) {
    return sentryInitialisationResult;
  }

  const {
    config: sentryConfig,
    runtime: sentryRuntime,
    serviceName,
  } = sentryInitialisationResult.value;
  const tracer = resolveTracer(sentryConfig.mode, serviceName, runtimeConfig.version);

  return {
    ok: true,
    value: buildObservabilityObject({
      runtimeConfig,
      sentryRuntime,
      serviceName,
      environment: sentryConfig.environment,
      release: sentryConfig.release,
      tracer,
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
