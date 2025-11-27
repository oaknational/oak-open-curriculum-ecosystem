/**
 * Express middleware for HTTP request and error logging
 */

import type { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import type { IncomingHttpHeaders } from 'node:http';
import type { Logger, JsonObject, JsonValue } from './types.js';
import { sanitiseForJson } from './json-sanitisation.js';

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
 * Safely extracts JSON-safe metadata from an Express Request
 * Handles undefined values and ParsedQs types from query parameters
 * @param req - Express Request object
 * @param options - Optional configuration
 * @param options.redactHeaders - Optional function to redact sensitive headers
 * @returns JSON-safe metadata object
 *
 * @example
 * ```typescript
 * const metadata = extractRequestMetadata(req);
 * // Returns: { method: 'GET', url: '/api/test', query: {...}, ... }
 * ```
 */
export function extractRequestMetadata(
  req: Request,
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
 * Creates Express middleware that logs incoming HTTP requests
 * @param logger - Logger instance to use
 * @param options - Configuration options
 * @returns Express middleware function
 *
 * @example
 * ```typescript
 * import { createRequestLogger } from '@oaknational/mcp-logger';
 *
 * const logger = createAdaptiveLogger();
 * app.use(createRequestLogger(logger, { level: 'info' }));
 * ```
 */
export function createRequestLogger(
  logger: Logger,
  options: RequestLoggerOptions = {},
): RequestHandler {
  const level = options.level ?? 'debug';

  return (req: Request, _res: Response, next: NextFunction): void => {
    let metadata = extractRequestMetadata(req, {
      redactHeaders: options.redactHeaders,
    });

    if (options.includeBody && req.body) {
      // JsonObject has readonly index signature, so create new object
      metadata = {
        ...metadata,
        body: sanitiseForJson(req.body),
      };
    }

    logger[level]('Incoming HTTP request', metadata);
    next();
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
 * import { createErrorLogger } from '@oaknational/mcp-logger';
 *
 * const logger = createAdaptiveLogger();
 * // Register after all routes
 * app.use(createErrorLogger(logger));
 * ```
 */
export function createErrorLogger(logger: Logger): ErrorRequestHandler {
  return (err: Error, req: Request, _res: Response, next: NextFunction): void => {
    const metadata = extractRequestMetadata(req);
    logger.error('HTTP request error', err, metadata);
    next(err); // Must pass error to next middleware
  };
}
