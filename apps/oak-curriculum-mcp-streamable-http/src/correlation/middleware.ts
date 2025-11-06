/**
 * Express middleware for request correlation ID management.
 *
 * @module correlation/middleware
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { Logger } from '@oaknational/mcp-logger';

import { generateCorrelationId } from './index.js';

/**
 * HTTP header name for correlation ID.
 *
 * @public
 */
export const CORRELATION_ID_HEADER = 'X-Correlation-ID';

/**
 * Augment Express Response.locals to include correlation ID.
 */
declare module 'express-serve-static-core' {
  interface Locals {
    /**
     * Unique identifier for correlating logs and operations across a request lifecycle.
     */
    correlationId?: string;
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
    // Get correlation ID from header or generate new one
    const incomingCorrelationId = req.headers[CORRELATION_ID_HEADER.toLowerCase()];
    const correlationId =
      typeof incomingCorrelationId === 'string' && incomingCorrelationId.length > 0
        ? incomingCorrelationId
        : generateCorrelationId();

    // Store in res.locals for downstream middleware and handlers
    res.locals.correlationId = correlationId;

    // Add to response headers
    res.setHeader(CORRELATION_ID_HEADER, correlationId);

    // Log request start with correlation ID
    logger.debug('Request started', {
      correlationId,
      method: req.method,
      path: req.path,
    });

    next();
  };
}
