import type { LogSink } from '@oaknational/logger';
import { getActiveSpanContextSnapshot } from '@oaknational/observability';
import { err, ok, type Result } from '@oaknational/result';
import { createFixtureSentryStore } from './fixture.js';
import { createFixtureLogSink, createLiveLogSink, createSentryTags } from './runtime-sinks.js';
import {
  createSentryInitOptions,
  defaultSentryNodeSdk,
  DEFAULT_SENTRY_FLUSH_TIMEOUT_MS,
  DEFAULT_TRACE_PROPAGATION_TARGETS,
} from './runtime-sdk.js';
import { redactLogContext, redactNormalizedError, toNativeError } from './runtime-error.js';
import { describeUnknownError } from './runtime-telemetry.js';
import type {
  FixtureSentryStore,
  InitialiseSentryError,
  InitialiseSentryOptions,
  ParsedSentryConfig,
  SentryFlushError,
  SentryNodeRuntime,
  SentryNodeSdk,
} from './types.js';

function createNoopRuntime(
  config: Extract<ParsedSentryConfig, { readonly mode: 'off' }>,
): SentryNodeRuntime {
  return {
    config,
    tracePropagationTargets: DEFAULT_TRACE_PROPAGATION_TARGETS,
    sink: null,
    captureHandledError(): void {
      // Kill switch mode never captures.
    },
    async flush(): Promise<Result<void, SentryFlushError>> {
      return ok(undefined);
    },
  };
}

function createFixtureRuntime(
  config: Extract<ParsedSentryConfig, { readonly mode: 'fixture' }>,
  store: FixtureSentryStore,
): SentryNodeRuntime {
  return {
    config,
    tracePropagationTargets: DEFAULT_TRACE_PROPAGATION_TARGETS,
    sink: createFixtureLogSink(config, store),
    fixtureStore: store,
    captureHandledError(error, context): void {
      const traceContext = getActiveSpanContextSnapshot();
      const redactedError = redactNormalizedError(error);

      store.push({
        kind: 'exception',
        error: redactedError,
        context: redactLogContext(context),
        traceId: traceContext?.traceId,
        spanId: traceContext?.spanId,
        environment: config.environment,
        release: config.release,
      });
    },
    async flush(): Promise<Result<void, SentryFlushError>> {
      return ok(undefined);
    },
  };
}

function createLiveRuntime(
  config: Extract<ParsedSentryConfig, { readonly mode: 'sentry' }>,
  sdk: SentryNodeSdk,
  serviceName: string,
): SentryNodeRuntime {
  return {
    config,
    tracePropagationTargets: DEFAULT_TRACE_PROPAGATION_TARGETS,
    sink: createLiveLogSink(config, sdk, serviceName),
    captureHandledError(error, context): void {
      const traceContext = getActiveSpanContextSnapshot();
      const redactedContext = redactLogContext(context);
      const redactedError = redactNormalizedError(error);

      sdk.captureException(toNativeError(redactedError), {
        tags: createSentryTags(config, serviceName, traceContext),
        extra: {
          ...(redactedContext ? { context: redactedContext } : {}),
          ...(redactedError.metadata ? { metadata: redactedError.metadata } : {}),
        },
      });
    },
    async flush(
      timeoutMs = DEFAULT_SENTRY_FLUSH_TIMEOUT_MS,
    ): Promise<Result<void, SentryFlushError>> {
      try {
        const flushed = await sdk.flush(timeoutMs);

        if (!flushed) {
          return err({
            kind: 'sentry_flush_timeout',
            timeoutMs,
          });
        }

        return ok(undefined);
      } catch (error) {
        return err({
          kind: 'sentry_flush_failed',
          message: describeUnknownError(error),
        });
      }
    },
  };
}

export function initialiseSentry(
  config: ParsedSentryConfig,
  options: InitialiseSentryOptions,
): Result<SentryNodeRuntime, InitialiseSentryError> {
  if (config.mode === 'off') {
    return ok(createNoopRuntime(config));
  }

  if (config.mode === 'fixture') {
    return ok(createFixtureRuntime(config, options.fixtureStore ?? createFixtureSentryStore()));
  }

  const sdk = options.sdk ?? defaultSentryNodeSdk;

  try {
    sdk.init(createSentryInitOptions(config, { serviceName: options.serviceName }));
    return ok(createLiveRuntime(config, sdk, options.serviceName));
  } catch (error) {
    return err({
      kind: 'sentry_sdk_init_failed',
      message: describeUnknownError(error),
    });
  }
}

export function createSentryLogSink(runtime: SentryNodeRuntime): LogSink | null {
  return runtime.sink;
}

export async function flushSentry(
  runtime: SentryNodeRuntime,
  timeoutMs = DEFAULT_SENTRY_FLUSH_TIMEOUT_MS,
): Promise<Result<void, SentryFlushError>> {
  return runtime.flush(timeoutMs);
}
