import {
  UnifiedLogger,
  parseLogLevel,
  compareLogLevels,
  enrichError,
  buildResourceAttributes,
  logLevelToSeverityNumber,
  type Logger,
  type LogContextInput,
  type LogLevel,
  type LogSink,
  type Timer,
} from '@oaknational/logger';
import { createNodeStdoutSink } from '@oaknational/logger/node';
import {
  getActiveSpanContextSnapshot,
  type ActiveSpanContextSnapshot,
} from '@oaknational/observability';
import { RELEASE_ENVIRONMENTS } from '@oaknational/build-metadata';
import type { Response, ErrorRequestHandler } from 'express';

import type { RuntimeConfig } from '../runtime-config.js';

/**
 * Most permissive level production will forward to any sink.
 *
 * @remarks `LOG_LEVEL` is one Vercel env var shared across development,
 * preview and production (no per-environment override), so a developer
 * turning on debug logging locally also turns it on in production unless
 * something clamps it there. The Sentry log sink (`createLiveLogSink` in
 * `@oaknational/sentry-node`) carries no threshold of its own — it
 * forwards whatever `UnifiedLogger.minSeverity` admits — so this is the
 * one chokepoint that keeps a standing owner ruling ("no debug logs in
 * production") true regardless of what the env var says (MCP-648: debug
 * logs were 76% of this project's Sentry log volume and the measured
 * reason its ingest quota blocked unrelated monitoring work).
 */
const PRODUCTION_LOG_LEVEL_FLOOR: LogLevel = 'INFO';

/** Resolves the effective minimum log level, clamped in production. */
function resolveMinimumLogLevel(config: RuntimeConfig): LogLevel {
  const requested = parseLogLevel(config.env.LOG_LEVEL?.toUpperCase(), 'INFO');
  const isProduction = config.env.VERCEL_ENV === RELEASE_ENVIRONMENTS.production;

  if (isProduction && compareLogLevels(requested, PRODUCTION_LOG_LEVEL_FLOOR) < 0) {
    return PRODUCTION_LOG_LEVEL_FLOOR;
  }

  return requested;
}

interface HttpLoggingLocals {
  readonly correlationId?: string;
  readonly timer?: Timer;
}

interface CorrelationIdCarrier {
  readonly locals?: HttpLoggingLocals;
}

type HttpLoggingResponse = Response<unknown, HttpLoggingLocals>;

export interface HttpLoggerOptions {
  readonly name?: string;
  readonly context?: LogContextInput;
  readonly additionalSinks?: readonly LogSink[];
  readonly getActiveSpanContext?: () => ActiveSpanContextSnapshot | undefined;
  readonly stdoutSink?: LogSink;
}

interface ErrorLoggerObservability {
  captureHandledError(error: unknown, context?: LogContextInput): void;
}

/**
 * Creates an HTTP logger instance for the streamable HTTP server.
 *
 * Builds logger with explicit dependency injection:
 * - Stdout sink only (no file logging for HTTP server)
 * - Resource attributes for service identification
 * - Configured severity level from environment
 *
 * @param config - Runtime configuration containing log level settings
 * @param options - Optional configuration for logger name
 * @returns Logger instance configured for HTTP server (stdout-only)
 *
 * @public
 */
function resolveLoggerOptions(options?: HttpLoggerOptions): {
  readonly name: string;
  readonly context: LogContextInput;
  readonly additionalSinks: readonly LogSink[];
  readonly getActiveSpanContext: () => ActiveSpanContextSnapshot | undefined;
  readonly stdoutSink: LogSink | undefined;
} {
  const {
    name = 'streamable-http',
    context = {},
    additionalSinks = [],
    getActiveSpanContext = getActiveSpanContextSnapshot,
    stdoutSink,
  } = options ?? {};
  return { name, context, additionalSinks, getActiveSpanContext, stdoutSink };
}

export function createHttpLogger(config: RuntimeConfig, options?: HttpLoggerOptions): Logger {
  const level = resolveMinimumLogLevel(config);
  const resolved = resolveLoggerOptions(options);
  // The logger's Environment contract is string-valued; the parsed
  // OBSERVABILITY_SINKS array is not a resource-attribute input.
  const resourceAttributes = buildResourceAttributes(
    { ...config.env, OBSERVABILITY_SINKS: undefined },
    resolved.name,
    config.version,
  );

  return new UnifiedLogger({
    minSeverity: logLevelToSeverityNumber(level),
    resourceAttributes,
    context: resolved.context,
    sinks: [resolved.stdoutSink ?? createNodeStdoutSink(), ...resolved.additionalSinks],
    getActiveSpanContext: resolved.getActiveSpanContext,
  });
}

/**
 * Creates a child logger with correlation ID in the context.
 *
 * @param parentLogger - Parent logger instance to inherit configuration from
 * @param correlationId - Correlation ID to include in log context
 * @returns Child logger with correlation ID in context
 *
 * @public
 */
export function createChildLogger(parentLogger: Logger, correlationId: string): Logger {
  // Use parent's child() method to inherit all configuration and sinks
  if (parentLogger.child) {
    return parentLogger.child({ correlationId });
  }

  // Fallback if parent doesn't support child() (shouldn't happen with UnifiedLogger)
  throw new Error('Parent logger does not support child() method');
}

/**
 * Extracts correlation ID from Express response locals.
 *
 * @param res - Express Response object
 * @returns Correlation ID if present, undefined otherwise
 *
 * @public
 */
export function extractCorrelationId(res: CorrelationIdCarrier): string | undefined {
  const correlationId = res.locals?.correlationId;
  return typeof correlationId === 'string' ? correlationId : undefined;
}

/** Builds the log context shared between observability capture and structured log. */
function buildErrorLogContext(
  correlationId: string | undefined,
  duration: { formatted: string; ms: number } | undefined,
  method: string,
  requestPath: string,
  statusCode: number,
): LogContextInput {
  return {
    correlationId,
    duration: duration?.formatted,
    durationMs: duration?.ms,
    method,
    path: requestPath,
    statusCode: statusCode || 500,
  };
}

/**
 * Creates an enriched error logging middleware for Express.
 *
 * Captures errors, enriches them with correlation IDs, timing information,
 * and request context, then logs them with full debugging information.
 *
 * @param logger - Logger instance for error logging
 * @returns Express error request handler middleware
 *
 * @public
 */
export function createEnrichedErrorLogger(
  logger: Logger,
  observability?: ErrorLoggerObservability,
): ErrorRequestHandler {
  return (err: Error, req, res: HttpLoggingResponse, next): void => {
    const correlationId = res.locals.correlationId;
    const timer = res.locals.timer;
    const duration = timer?.end();

    const enrichedError = enrichError(err, {
      correlationId,
      duration,
      requestMethod: req.method,
      requestPath: req.path,
    });

    const logContext = buildErrorLogContext(
      correlationId,
      duration,
      req.method,
      req.path,
      res.statusCode,
    );

    observability?.captureHandledError(err, logContext);

    logger.error('Request error', {
      ...logContext,
      message: enrichedError.message,
      stack: enrichedError.stack,
    });

    if (correlationId) {
      res.setHeader('X-Correlation-ID', correlationId);
    }

    next(err);
  };
}
