import {
  createAdaptiveLogger,
  parseLogLevel,
  enrichError,
  type Logger,
  type ErrorContext,
} from '@oaknational/mcp-logger';
import type { Request, Response, ErrorRequestHandler } from 'express';

import type { RuntimeConfig } from '../runtime-config.js';

export interface HttpLoggerOptions {
  readonly name?: string;
}

/**
 * Creates an HTTP logger instance for the streamable HTTP server.
 *
 * @param config - Runtime configuration containing log level settings
 * @param options - Optional configuration for logger name
 * @returns Logger instance configured for HTTP server (stdout-only)
 *
 * @public
 */
export function createHttpLogger(config: RuntimeConfig, options?: HttpLoggerOptions): Logger {
  const levelInput = config.env.LOG_LEVEL?.toUpperCase();
  const level = parseLogLevel(levelInput, 'INFO');
  const loggerName = options?.name ?? 'streamable-http';

  return createAdaptiveLogger({ level, name: loggerName, context: {} }, undefined, {
    stdout: true,
  });
}

/**
 * Creates a child logger with correlation ID in the context.
 *
 * The child logger includes the correlation ID in all log entries,
 * enabling request tracing across the system.
 *
 * @param parentLogger - Parent logger instance to inherit configuration from
 * @param correlationId - Correlation ID to include in log context
 * @returns Logger instance with correlation ID in context
 *
 * @example
 * ```typescript
 * const logger = createHttpLogger(config);
 * const correlatedLogger = createChildLogger(logger, 'req_123456789_abc123');
 * correlatedLogger.info('Processing request'); // Logs include correlationId
 * ```
 *
 * @public
 */
export function createChildLogger(parentLogger: Logger, correlationId: string): Logger {
  // Explicitly mark parentLogger as intentionally unused (for now)
  // In future, we could inherit configuration from parentLogger
  void parentLogger;

  // Use INFO as default level (could be extracted from parent in future)
  const level = 'INFO';

  return createAdaptiveLogger(
    {
      level,
      name: 'streamable-http:correlated',
      context: { correlationId },
    },
    undefined,
    {
      stdout: true,
    },
  );
}

/**
 * Extracts correlation ID from Express response locals.
 *
 * @param res - Express Response object
 * @returns Correlation ID if present, undefined otherwise
 *
 * @example
 * ```typescript
 * const correlationId = extractCorrelationId(res);
 * if (correlationId) {
 *   const correlatedLogger = createChildLogger(logger, correlationId);
 *   // Use correlated logger
 * }
 * ```
 *
 * @public
 */
export function extractCorrelationId(res: Response): string | undefined {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return res.locals?.correlationId;
}

/**
 * Creates an enriched error logging middleware for Express.
 *
 * This middleware captures errors, enriches them with correlation IDs,
 * timing information, and request context, then logs them with full
 * debugging information.
 *
 * Features:
 * - Extracts correlation ID from res.locals.correlationId
 * - Extracts timing information from res.locals.timer
 * - Includes request method and path in error context
 * - Adds X-Correlation-ID to error response headers
 * - Logs enriched errors with full context
 * - Sends 500 response with error message
 *
 * @param logger - Logger instance for error logging
 * @returns Express error request handler middleware
 *
 * @example
 * ```typescript
 * import express from 'express';
 * import { createEnrichedErrorLogger } from './logging/index.js';
 * import { createHttpLogger } from './logging/index.js';
 *
 * const app = express();
 * const logger = createHttpLogger(config);
 * app.use(createEnrichedErrorLogger(logger));
 * ```
 *
 * @public
 */
export function createEnrichedErrorLogger(logger: Logger): ErrorRequestHandler {
  return (err: Error, req: Request, res: Response, next): void => {
    // Extract correlation ID from res.locals
    const correlationId = res.locals.correlationId;

    // Extract timer and calculate duration
    const timer = res.locals.timer;
    const duration = timer?.end();

    // Build error context
    const errorContext: ErrorContext = {
      correlationId,
      duration,
      requestMethod: req.method,
      requestPath: req.path,
    };

    // Enrich the error with context
    const enrichedError = enrichError(err, errorContext);

    // Log the enriched error
    logger.error('Request error', {
      message: enrichedError.message,
      stack: enrichedError.stack,
      correlationId,
      duration: duration?.formatted,
      durationMs: duration?.ms,
      method: req.method,
      path: req.path,
      statusCode: res.statusCode || 500,
    });

    // Ensure correlation ID is in response headers
    if (correlationId) {
      res.setHeader('X-Correlation-ID', correlationId);
    }

    // Pass error to next middleware (must follow Express error handling pattern)
    next(err);
  };
}

export type { Logger } from '@oaknational/mcp-logger';
