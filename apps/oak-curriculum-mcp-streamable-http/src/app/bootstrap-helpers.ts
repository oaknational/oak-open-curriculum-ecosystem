import { json as expressJson } from 'express';
import type { Express, RequestHandler } from 'express';
import {
  createRequestLogger,
  logLevelToSeverityNumber,
  type Logger,
  type PhasedTimer,
} from '@oaknational/mcp-logger';

import { createCorrelationMiddleware } from '../correlation/middleware.js';
import { createEnrichedErrorLogger } from '../logging/index.js';

export type BootstrapPhaseName =
  | 'setupBaseMiddleware'
  | 'applySecurity'
  | 'initializeCoreEndpoints'
  | 'setupAuthRoutes';

export interface BootstrapPhaseContext {
  readonly appId: number;
  readonly phase: BootstrapPhaseName;
}

/**
 * Executes a bootstrap phase with instrumentation logging.
 *
 * @param log - Logger instance for recording phase events.
 * @param timer - Phased timer for tracking phase duration.
 * @param phase - Name of the bootstrap phase.
 * @param appId - Identifier of the Express app instance.
 * @param operation - Function that performs the phase operations.
 * @returns Result of the operation.
 */
export function runBootstrapPhase<T>(
  log: Logger,
  timer: PhasedTimer,
  phase: BootstrapPhaseName,
  appId: number,
  operation: () => T,
): T {
  const context: BootstrapPhaseContext = { appId, phase };
  log.debug('bootstrap.phase.start', context);
  const phaseHandle = timer.startPhase(phase);

  try {
    const result = operation();
    const durationResult = phaseHandle.end();
    log.info('bootstrap.phase.finish', {
      ...context,
      duration: durationResult.duration.formatted,
      durationMs: durationResult.duration.ms,
    });
    return result;
  } catch (error: unknown) {
    const durationResult = phaseHandle.end();
    const errorAsError =
      error instanceof Error
        ? error
        : new Error(`Bootstrap phase "${phase}" threw non-error value: ${String(error)}`);
    log.error('bootstrap.phase.error', errorAsError, {
      ...context,
      duration: durationResult.duration.formatted,
      durationMs: durationResult.duration.ms,
    });
    throw error;
  }
}

/**
 * Sets up base Express middleware (JSON parsing, correlation, logging, error handling).
 */
export function setupBaseMiddleware(app: Express, log: Logger): void {
  app.use(expressJson({ limit: '1mb' }));
  app.use(createCorrelationMiddleware(log));

  const debugEnabled = log.isLevelEnabled?.(logLevelToSeverityNumber('DEBUG')) ?? false;
  if (debugEnabled) {
    app.use(createRequestLogger(log, { level: 'debug' }));
  }
  app.use(createEnrichedErrorLogger(log));
}

/**
 * Creates middleware that ensures MCP connection is ready before processing requests.
 * Responds with 503 if connection is not ready within 5 seconds.
 */
export function createMcpReadinessMiddleware(ready: Promise<void>, log: Logger): RequestHandler {
  return async (_req, _res, next) => {
    try {
      await Promise.race([
        ready,
        new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('MCP connection timeout'));
          }, 5000);
        }),
      ]);
      next();
    } catch (error: unknown) {
      log.error('MCP connection failed', { error });
      _res.status(503).json({
        error: 'MCP server not ready',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
