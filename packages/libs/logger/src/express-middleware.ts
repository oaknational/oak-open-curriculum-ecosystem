/**
 * Express middleware for HTTP request and error logging
 */

import type { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import type { IncomingHttpHeaders } from 'node:http';
import type { Logger, JsonObject, JsonValue } from './types.js';
import { sanitiseForJson } from './json-sanitisation.js';
import { normalizeError } from './error-normalisation.js';

/**
 * Type guard to check if a JsonValue is a JsonObject
 */
function isJsonObject(value: JsonValue): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Options for request logger middleware
 */
export interface RequestLoggerOptions {
  /** Log level to use (default: 'debug') */
  level?: 'trace' | 'debug' | 'info';
  /** Whether to include request body in logs (default: false) */
  includeBody?: boolean;
  /** Optional function to redact sensitive headers before logging */
  redactHeaders?: (headers: IncomingHttpHeaders) => Record<string, string>;
}

/**
 * Minimal request shape required to extract structured HTTP metadata.
 */
export interface RequestMetadataSource {
  readonly method: string;
  readonly url: string;
  readonly path?: string;
  readonly headers: IncomingHttpHeaders;
  readonly query?: Request['query'];
  readonly params?: Request['params'];
  readonly ip?: string;
}

/**
 * Request shape required by the logger before Express response objects enter
 * the picture.
 */
export interface RequestLoggingSource extends RequestMetadataSource {
  readonly body?: unknown;
}

/**
 * Minimal next-function shape used by the logger handlers.
 */
export type LoggingNext = (error?: unknown) => void;

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
  options?: { redactHeaders?: (headers: IncomingHttpHeaders) => Record<string, string> },
): JsonObject {
  const headers = options?.redactHeaders ? options.redactHeaders(req.headers) : req.headers;

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

  return result;
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
  const level = options.level ?? 'debug';
  let metadata = extractRequestMetadata(request, {
    redactHeaders: options.redactHeaders,
  });

  if (options.includeBody && request.body) {
    metadata = {
      ...metadata,
      body: sanitiseForJson(request.body),
    };
  }

  logger[level]('Incoming HTTP request', metadata);
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
): void {
  const metadata = extractRequestMetadata(request);
  logger.error('HTTP request error', normalizeError(error), metadata);
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
 * import { createRequestLogger } from '@oaknational/logger';
 *
 * const logger = createAdaptiveLogger();
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
 * @returns Express error middleware function
 *
 * @example
 * ```typescript
 * import { createErrorLogger } from '@oaknational/logger';
 *
 * const logger = createAdaptiveLogger();
 * // Register after all routes
 * app.use(createErrorLogger(logger));
 * ```
 */
export function createErrorLogger(logger: Logger): ErrorRequestHandler {
  return (err: Error, req: Request, _res: Response, next: NextFunction): void => {
    logRequestError(logger, err, req, next);
  };
}
