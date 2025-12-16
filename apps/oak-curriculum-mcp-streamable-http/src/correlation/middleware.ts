/**
 * Express middleware for request correlation ID management.
 *
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { startTimer, type Logger, type Timer } from '@oaknational/mcp-logger';

import { generateCorrelationId } from './index.js';
import { redactHeadersSummary } from '../logging/header-redaction.js';

/**
 * HTTP header name for correlation ID.
 *
 * @public
 */
export const CORRELATION_ID_HEADER = 'X-Correlation-ID';

/**
 * Threshold in milliseconds for slow request warnings.
 * Requests exceeding this duration will be logged at WARN level.
 *
 * @internal
 */
const SLOW_REQUEST_THRESHOLD_MS = 2000;

/**
 * Augment Express Response.locals to include correlation ID and timer.
 */
declare module 'express-serve-static-core' {
  interface Locals {
    /**
     * Unique identifier for correlating logs and operations across a request lifecycle.
     */
    correlationId?: string;
    /**
     * Timer for measuring request duration.
     */
    timer?: Timer;
  }
}

/**
 * Creates Express middleware for correlation ID lifecycle management.
 *
 * This middleware:
 * - Generates a new correlation ID if not provided by the client
 * - Reuses the correlation ID from X-Correlation-ID header if present
 * - Stores the correlation ID in res.locals.correlationId for downstream use
 * - Adds X-Correlation-ID to response headers
 * - Logs request start with correlation ID at DEBUG level
 *
 * @param logger - Logger instance for logging request start with correlation ID
 * @returns Express request handler middleware
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createCorrelationMiddleware } from './correlation/middleware.js';
 * import { createHttpLogger } from './logging/index.js';
 *
 * const app = express();
 * const logger = createHttpLogger(config);
 * app.use(createCorrelationMiddleware(logger));
 * ```
 *
 * @public
 */
export function createCorrelationMiddleware(logger: Logger): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Start timing the request
    const timer = startTimer();

    // Get correlation ID from header or generate new one
    const incomingCorrelationId = req.headers[CORRELATION_ID_HEADER.toLowerCase()];
    const correlationId =
      typeof incomingCorrelationId === 'string' && incomingCorrelationId.length > 0
        ? incomingCorrelationId
        : generateCorrelationId();

    // Store in res.locals for downstream middleware and handlers
    res.locals.correlationId = correlationId;
    res.locals.timer = timer;

    // Add to response headers
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    // Log request start with correlation ID and headers
    logger.debug('Request started', {
      correlationId,
      method: req.method,
      path: req.path,
      requestHeaders: redactHeadersSummary(req.headers),
    });

    // Log request completion with timing when response finishes
    res.on('finish', () => {
      const duration = timer.end();
      const isSlowRequest = duration.ms > SLOW_REQUEST_THRESHOLD_MS;

      const logMethod = isSlowRequest ? 'warn' : 'debug';
      const logData = {
        correlationId,
        duration: duration.formatted,
        durationMs: duration.ms,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        responseHeaders: redactHeadersSummary(res.getHeaders()),
        ...(isSlowRequest && { slowRequest: true }),
      };

      logger[logMethod]('Request completed', logData);
    });

    next();
  };
}
