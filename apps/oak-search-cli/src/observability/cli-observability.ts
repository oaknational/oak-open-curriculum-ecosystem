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

import { normalizeError, type LogContextInput, type LogSink } from '@oaknational/logger';
import { err, ok, type Result } from '@oaknational/result';
import {
  createSentryConfig,
  createSentryLogSink,
  initialiseSentry,
  mapCloseError,
  mapFlushError,
  type FixtureSentryStore,
  type ParsedSentryConfig,
  type SentryNodeRuntime,
  type SentryNodeSdk,
} from '@oaknational/sentry-node';
import {
  sanitiseObject,
  withActiveSpan,
  type ObservabilityCloseError,
  type ObservabilityContextPayload,
  type ObservabilityFlushError,
  type SpanAttributes,
} from '@oaknational/observability';
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
  readonly release?: string;
  readonly sentrySink: LogSink | null;
  readonly fixtureStore?: FixtureSentryStore;
  withSpan<T>(options: CliSpanOptions<T>): Promise<T>;
  captureHandledError(error: unknown, context?: LogContextInput): void;
  /**
   * Set a tag on the current scope.
   *
   * @remarks Tags are string-only. Used for CLI command enrichment
   * (e.g. `cli.command`, `cli.index_target`).
   */
  setTag(key: string, value: string): void;
  /**
   * Set structured context on the current scope.
   *
   * @remarks Pass `null` to clear a named context.
   */
  setContext(name: string, context: ObservabilityContextPayload | null): void;
  flush(timeoutMs?: number): Promise<Result<void, ObservabilityFlushError>>;
  /**
   * Close the observability transport — drains pending events AND disables the SDK.
   *
   * @remarks Preferred over {@link flush} for CLI shutdown. `close()`
   * is the recommended shutdown for short-lived processes: it drains the
   * event queue and then disables the SDK.
   */
  close(timeoutMs?: number): Promise<Result<void, ObservabilityCloseError>>;
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
    ...(sentryConfig.mode === 'off' ? {} : { release: sentryConfig.release }),
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

    setTag(key, value): void {
      sentryRuntime.setTag(key, value);
    },
    setContext(name, ctx): void {
      sentryRuntime.setContext(name, ctx);
    },

    async flush(timeoutMs): Promise<Result<void, ObservabilityFlushError>> {
      const result = await sentryRuntime.flush(timeoutMs);
      if (!result.ok) {
        return err(mapFlushError(result.error));
      }
      return result;
    },

    async close(timeoutMs): Promise<Result<void, ObservabilityCloseError>> {
      const result = await sentryRuntime.close(timeoutMs);
      if (!result.ok) {
        return err(mapCloseError(result.error));
      }
      return result;
    },
  };
}

export function createCliObservability(
  runtimeConfig: SearchCliRuntimeConfig,
  options?: CreateCliObservabilityOptions,
): Result<CliObservability, CliObservabilityError> {
  const sentryConfigResult = createSentryConfig({
    ...runtimeConfig.env,
    APP_VERSION: runtimeConfig.version,
    APP_VERSION_SOURCE: runtimeConfig.versionSource,
    ...(runtimeConfig.gitSha
      ? { GIT_SHA: runtimeConfig.gitSha, GIT_SHA_SOURCE: runtimeConfig.gitShaSource }
      : {}),
  });

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
