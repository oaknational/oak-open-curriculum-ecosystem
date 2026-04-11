/** Express middleware for HTTP request and error logging. */

import type { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import type { IncomingHttpHeaders } from 'node:http';
import {
  redactHeaderRecord,
  redactTelemetryObject,
  redactTelemetryValue,
} from '@oaknational/observability';
import type { Logger, JsonObject, JsonValue } from './types.js';
import { sanitiseForJson } from './json-sanitisation.js';
import { normalizeError } from './error-normalisation.js';

/** Type guard to check if a JsonValue is a JsonObject. */
function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Options for request logger middleware. */
export type HeaderRedactor = (headers: IncomingHttpHeaders) => Record<string, string>;

export interface RequestLoggerOptions {
  /** Log level to use (default: 'debug') */
  level?: 'trace' | 'debug' | 'info';
  /** Whether to include request body in logs (default: false) */
  includeBody?: boolean;
  /** Optional function to redact sensitive headers before logging */
  redactHeaders?: HeaderRedactor;
}

/** Options for error logger middleware. */
export interface ErrorLoggerOptions {
  /** Optional function to redact sensitive headers before logging */
  redactHeaders?: HeaderRedactor;
}

/** Minimal request shape required to extract structured HTTP metadata. */
interface RequestMetadataSource {
  readonly method: string;
  readonly url: string;
  readonly path?: string;
  readonly headers: IncomingHttpHeaders;
  readonly query?: Request['query'];
  readonly params?: Request['params'];
  readonly ip?: string;
}

/** Request shape required by the logger before Express response objects enter the picture. */
interface RequestLoggingSource extends RequestMetadataSource {
  readonly body?: unknown;
}

/** Minimal next-function shape used by the logger handlers. */
type LoggingNext = (error?: unknown) => void;

/**
 * Safely extracts JSON-safe metadata from an Express Request
 * Handles undefined values and ParsedQs types from query parameters
 * @param req - Express Request object
 * @param options - Optional configuration with optional `redactHeaders` function to redact sensitive headers
 * @returns JSON-safe metadata object
 *
 * @example
 * ```typescript
 * const metadata = extractRequestMetadata(req);
 * // Returns: { method: 'GET', url: '/api/test', query: {...}, ... }
 * ```
 */
export function extractRequestMetadata(
  req: RequestMetadataSource,
  options?: { redactHeaders?: HeaderRedactor },
): JsonObject {
  const headers = (options?.redactHeaders ?? redactHeaderRecord)(req.headers);

  const metadata = {
    method: req.method,
    url: req.url,
    path: req.path,
    headers,
    query: req.query,
    params: req.params,
    ip: req.ip,
  };

  const result = sanitiseForJson(metadata);

  // sanitiseForJson returns JsonValue, but we know the input is a plain object
  // so the result will be a JsonObject (not null/string/number/boolean/array)
  if (!isJsonObject(result)) {
    throw new Error('Unexpected sanitisation result: expected object');
  }

  const redactedMetadata = redactTelemetryObject(result);

  if (!isJsonObject(redactedMetadata)) {
    throw new Error('Unexpected redaction result: expected object');
  }

  return redactedMetadata;
}

/**
 * Logs an incoming request using transport-agnostic inputs.
 *
 * @param logger - Logger instance to use
 * @param request - Request data required for structured logging
 * @param next - Continuation callback
 * @param options - Request logging configuration
 */
export function logIncomingRequest(
  logger: Logger,
  request: RequestLoggingSource,
  next: LoggingNext,
  options: RequestLoggerOptions = {},
): void {
  try {
    const level = options.level ?? 'debug';
    let metadata = extractRequestMetadata(request, {
      redactHeaders: options.redactHeaders,
    });

    if (options.includeBody && request.body) {
      metadata = {
        ...metadata,
        body: redactTelemetryValue(sanitiseForJson(request.body)),
      };
    }

    logger[level]('Incoming HTTP request', metadata);
  } catch {
    // Preserve the request pipeline even when logging fails.
  }

  next();
}

/**
 * Logs an error with request context using transport-agnostic inputs.
 *
 * @param logger - Logger instance to use
 * @param error - Error to log
 * @param request - Request data required for structured logging
 * @param next - Continuation callback
 */
export function logRequestError(
  logger: Logger,
  error: Error,
  request: RequestMetadataSource,
  next: LoggingNext,
  options: ErrorLoggerOptions = {},
): void {
  try {
    const metadata = extractRequestMetadata(request, {
      redactHeaders: options.redactHeaders,
    });
    logger.error('HTTP request error', normalizeError(error), metadata);
  } catch {
    // Preserve the error pipeline even when logging fails.
  }

  next(error);
}

/**
 * Creates Express middleware that logs incoming HTTP requests
 * @param logger - Logger instance to use
 * @param options - Configuration options
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * import {
 *   UnifiedLogger,
 *   buildResourceAttributes,
 *   createRequestLogger,
 *   logLevelToSeverityNumber,
 *   parseLogLevel,
 *   type LogSink,
 * } from '@oaknational/logger';
 * import { createNodeStdoutSink } from '@oaknational/logger/node';
 *
 * const sinks: readonly LogSink[] = [createNodeStdoutSink()];
 *
 * const logger = new UnifiedLogger({
 *   minSeverity: logLevelToSeverityNumber(parseLogLevel('INFO', 'INFO')),
 *   resourceAttributes: buildResourceAttributes({}, 'oak-http', '1.0.0'),
 *   context: {},
 *   sinks,
 *   getActiveSpanContext: () => undefined,
 * });
 *
 * app.use(createRequestLogger(logger, { level: 'info' }));
 * ```
 */
export function createRequestLogger(
  logger: Logger,
  options: RequestLoggerOptions = {},
): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction): void => {
    logIncomingRequest(logger, req, next, options);
  };
}

/**
 * Creates Express error-handling middleware that logs errors with request context
 * Must be registered after routes to catch errors
 * @param logger - Logger instance to use
 * @param options - Optional configuration for header redaction
 * @returns Express error middleware function
 *
 * @example
 * ```typescript
 * import {
 *   UnifiedLogger,
 *   buildResourceAttributes,
 *   createErrorLogger,
 *   logLevelToSeverityNumber,
 *   parseLogLevel,
 *   type LogSink,
 * } from '@oaknational/logger';
 * import { createNodeStdoutSink } from '@oaknational/logger/node';
 *
 * const sinks: readonly LogSink[] = [createNodeStdoutSink()];
 *
 * const logger = new UnifiedLogger({
 *   minSeverity: logLevelToSeverityNumber(parseLogLevel('INFO', 'INFO')),
 *   resourceAttributes: buildResourceAttributes({}, 'oak-http', '1.0.0'),
 *   context: {},
 *   sinks,
 *   getActiveSpanContext: () => undefined,
 * });
 *
 * // Register after all routes
 * app.use(createErrorLogger(logger));
 * ```
 */
export function createErrorLogger(
  logger: Logger,
  options: ErrorLoggerOptions = {},
): ErrorRequestHandler {
  return (err: Error, req: Request, _res: Response, next: NextFunction): void => {
    logRequestError(logger, err, req, next, options);
  };
}
