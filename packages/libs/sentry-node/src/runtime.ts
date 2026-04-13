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
  SentryCloseError,
  SentryContextPayload,
  SentryFlushError,
  SentryNodeRuntime,
  SentryNodeSdk,
  SentryUser,
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
    async close(): Promise<Result<void, SentryCloseError>> {
      return ok(undefined);
    },
    setUser(): void {
      // Kill switch mode never sets scope.
    },
    setTag(): void {
      // Kill switch mode never sets scope.
    },
    setContext(): void {
      // Kill switch mode never sets scope.
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
    async close(): Promise<Result<void, SentryCloseError>> {
      return ok(undefined);
    },
    setUser(user: SentryUser | null): void {
      store.push({ kind: 'set_user', user });
    },
    setTag(key: string, value: string): void {
      store.push({ kind: 'set_tag', key, value });
    },
    setContext(name: string, context: SentryContextPayload | null): void {
      store.push({ kind: 'set_context', name, context });
    },
  };
}

async function flushSdk(
  sdk: SentryNodeSdk,
  timeoutMs: number,
): Promise<Result<void, SentryFlushError>> {
  try {
    const flushed = await sdk.flush(timeoutMs);
    return flushed ? ok(undefined) : err({ kind: 'sentry_flush_timeout', timeoutMs });
  } catch (error) {
    return err({ kind: 'sentry_flush_failed', message: describeUnknownError(error) });
  }
}

async function closeSdk(
  sdk: SentryNodeSdk,
  timeoutMs: number,
): Promise<Result<void, SentryCloseError>> {
  try {
    const closed = await sdk.close(timeoutMs);
    return closed ? ok(undefined) : err({ kind: 'sentry_close_timeout', timeoutMs });
  } catch (error) {
    return err({ kind: 'sentry_close_failed', message: describeUnknownError(error) });
  }
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
      return await flushSdk(sdk, timeoutMs);
    },
    async close(
      timeoutMs = DEFAULT_SENTRY_FLUSH_TIMEOUT_MS,
    ): Promise<Result<void, SentryCloseError>> {
      return await closeSdk(sdk, timeoutMs);
    },
    setUser(user: SentryUser | null): void {
      sdk.setUser(user);
    },
    setTag(key: string, value: string): void {
      sdk.setTag(key, value);
    },
    setContext(name: string, context: SentryContextPayload | null): void {
      sdk.setContext(name, context);
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
    sdk.init(
      createSentryInitOptions(config, {
        serviceName: options.serviceName,
        postRedactionHooks: options.postRedactionHooks,
      }),
    );
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
