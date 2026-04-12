/**
 * CLI observability module — Sentry integration for the Search CLI.
 *
 * Adapts the shared `@oaknational/sentry-node` foundation for the
 * CLI lifecycle: short-lived process, module-level logger, no MCP
 * wrapping, no live OTel tracer.
 *
 * Three modes via `SENTRY_MODE`:
 * - `off` (default): no Sentry init, null sink, noop error capture
 * - `fixture`: in-memory fixture store for testing
 * - `sentry`: live Sentry SDK with error capture and structured logs
 */

import {
  normalizeError,
  sanitiseObject,
  type LogContextInput,
  type LogSink,
} from '@oaknational/logger';
import { err, ok, type Result } from '@oaknational/result';
import {
  createSentryConfig,
  createSentryLogSink,
  flushSentry,
  initialiseSentry,
  type FixtureSentryStore,
  type ParsedSentryConfig,
  type SentryFlushError,
  type SentryNodeRuntime,
  type SentryNodeSdk,
} from '@oaknational/sentry-node';
import { withActiveSpan, type SpanAttributes } from '@oaknational/observability';
import type { SearchCliRuntimeConfig } from '../runtime-config.js';
import type { CliObservabilityError } from './cli-observability-error.js';

export { describeCliObservabilityError } from './cli-observability-error.js';

const DEFAULT_CLI_SERVICE_NAME = 'oak-search-cli';

interface CliSpanOptions<T> {
  readonly name: string;
  readonly attributes?: SpanAttributes;
  readonly run: () => Promise<T> | T;
}

export interface CliObservability {
  readonly service: string;
  readonly environment: string;
  readonly release: string;
  readonly sentrySink: LogSink | null;
  readonly fixtureStore?: FixtureSentryStore;
  withSpan<T>(options: CliSpanOptions<T>): Promise<T>;
  captureHandledError(error: unknown, context?: LogContextInput): void;
  flush(timeoutMs?: number): Promise<Result<void, SentryFlushError>>;
}

interface CreateCliObservabilityOptions {
  readonly serviceName?: string;
  readonly sentrySdk?: SentryNodeSdk;
  readonly fixtureStore?: FixtureSentryStore;
}

interface BuildCliObservabilityParams {
  readonly serviceName: string;
  readonly sentryConfig: ParsedSentryConfig;
  readonly sentryRuntime: SentryNodeRuntime;
}

function buildCliObservability(params: BuildCliObservabilityParams): CliObservability {
  const { serviceName, sentryConfig, sentryRuntime } = params;

  return {
    service: serviceName,
    environment: sentryConfig.environment,
    release: sentryConfig.release,
    sentrySink: createSentryLogSink(sentryRuntime),
    fixtureStore: sentryRuntime.fixtureStore,

    async withSpan<T>(spanOptions: CliSpanOptions<T>): Promise<T> {
      return await withActiveSpan({
        tracer: undefined,
        name: spanOptions.name,
        attributes: spanOptions.attributes,
        run: spanOptions.run,
      });
    },

    captureHandledError(error, captureContext): void {
      sentryRuntime.captureHandledError(
        normalizeError(error),
        sanitiseObject(captureContext) ?? undefined,
      );
    },

    async flush(timeoutMs): Promise<Result<void, SentryFlushError>> {
      return await flushSentry(sentryRuntime, timeoutMs);
    },
  };
}

export function createCliObservability(
  runtimeConfig: SearchCliRuntimeConfig,
  options?: CreateCliObservabilityOptions,
): Result<CliObservability, CliObservabilityError> {
  const sentryConfigResult = createSentryConfig(runtimeConfig.env);

  if (!sentryConfigResult.ok) {
    return err(sentryConfigResult.error);
  }

  const sentryConfig = sentryConfigResult.value;
  const serviceName = options?.serviceName ?? DEFAULT_CLI_SERVICE_NAME;

  const sentryRuntimeResult = initialiseSentry(sentryConfig, {
    serviceName,
    sdk: options?.sentrySdk,
    fixtureStore: options?.fixtureStore,
  });

  if (!sentryRuntimeResult.ok) {
    return err(sentryRuntimeResult.error);
  }

  return ok(
    buildCliObservability({
      serviceName,
      sentryConfig,
      sentryRuntime: sentryRuntimeResult.value,
    }),
  );
}
