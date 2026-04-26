/**
 * Express middleware for request correlation ID management.
 *
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { startTimer, type Logger, type Timer } from '@oaknational/logger';

import { generateCorrelationId } from './index.js';
import { redactHeadersSummary } from '../logging/header-redaction.js';
import type { HttpObservability } from '../observability/http-observability.js';

/**
 * HTTP header name for correlation ID.
 *
 * @public
 */
export const CORRELATION_ID_HEADER = 'X-Correlation-ID';

/**
 * Default threshold in milliseconds for slow request warnings.
 * Requests exceeding this duration will be logged at WARN level.
 *
 * @internal
 */
const DEFAULT_SLOW_REQUEST_THRESHOLD_MS = 2000;

/**
 * Options for correlation middleware behaviour.
 *
 * @public
 */
export interface CorrelationMiddlewareOptions {
  /**
   * Threshold in milliseconds above which requests are logged at WARN level.
   * Defaults to 2000ms.
   */
  readonly slowRequestThresholdMs?: number;
  /**
   * Optional observability surface used to tag the per-request Sentry
   * scope with the correlation ID. When provided, every Sentry event
   * captured during this request gets a `correlation_id` tag, enabling
   * agents and humans to filter the issues stream by the same ID that
   * appears in application logs and the `X-Correlation-ID` response
   * header.
   *
   * @remarks `setTag` writes to the request-isolated scope created by
   * `@sentry/node`'s `httpIntegration`; the tag does not leak to other
   * requests. Production callers inject the live `HttpObservability`;
   * tests omit this or inject a recording fake.
   *
   * @see ADR-078 for the dependency injection rationale
   */
  readonly observability?: Pick<HttpObservability, 'setTag'>;
}

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
 * @param options - Optional configuration for middleware behaviour
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
export function createCorrelationMiddleware(
  logger: Logger,
  options?: CorrelationMiddlewareOptions,
): RequestHandler {
  const slowRequestThresholdMs =
    options?.slowRequestThresholdMs ?? DEFAULT_SLOW_REQUEST_THRESHOLD_MS;
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

    // Tag the per-request Sentry scope so any captured events surface
    // the correlation ID for cross-system filtering. The scope is
    // request-isolated by @sentry/node's httpIntegration so this tag
    // does not leak across requests.
    options?.observability?.setTag('correlation_id', correlationId);

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
      const isSlowRequest = duration.ms > slowRequestThresholdMs;

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
