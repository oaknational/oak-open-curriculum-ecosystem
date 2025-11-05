/**
 * Express middleware for HTTP request and error logging
 */

import type { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import type { Logger, JsonObject } from './types.js';
import { sanitiseForJson } from './json-sanitisation.js';

/**
 * Options for request logger middleware
 */
export interface RequestLoggerOptions {
  /** Log level to use (default: 'debug') */
  level?: 'trace' | 'debug' | 'info';
  /** Whether to include request body in logs (default: false) */
  includeBody?: boolean;
}

/**
 * Safely extracts JSON-safe metadata from an Express Request
 * Handles undefined values and ParsedQs types from query parameters
 * @param req - Express Request object
 * @returns JSON-safe metadata object
 *
 * @example
 * ```typescript
 * const metadata = extractRequestMetadata(req);
 * // Returns: { method: 'GET', url: '/api/test', query: {...}, ... }
 * ```
 */
export function extractRequestMetadata(req: Request): JsonObject {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  return sanitiseForJson({
    method: req.method,
    url: req.url,
    path: req.path,
    headers: req.headers,
    query: req.query,
    params: req.params,
    ip: req.ip,
  }) as JsonObject;
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
    const metadata = extractRequestMetadata(req);

    if (options.includeBody && req.body) {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      (metadata as { body?: unknown }).body = sanitiseForJson(req.body);
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
