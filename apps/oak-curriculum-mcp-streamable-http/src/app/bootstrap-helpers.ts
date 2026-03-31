import express, { json as expressJson } from 'express';
import type { Express, RequestHandler } from 'express';
import {
  createRequestLogger,
  logLevelToSeverityNumber,
  createPhasedTimer,
  normalizeError,
  sanitiseForJson,
  type Logger,
  type LogContextInput,
  type PhasedTimer,
} from '@oaknational/logger';

import { createCorrelationMiddleware } from '../correlation/middleware.js';
import { createEnrichedErrorLogger } from '../logging/index.js';
import { redactHeaders } from '../logging/header-redaction.js';
import type { HttpObservability } from '../observability/http-observability.js';

export type BootstrapPhaseName =
  | 'setupBaseMiddleware'
  | 'createCorsMiddleware'
  | 'createDnsRebindingMiddleware'
  | 'createSecurityHeaders'
  | 'fetchUpstreamMetadata'
  | 'registerPublicOAuthMetadata'
  | 'registerOAuthProxy'
  | 'addNoCacheToErrors'
  | 'setupGlobalAuthContext'
  | 'initializeCoreEndpoints'
  | 'setupAuthRoutes';

export interface BootstrapPhaseContext extends LogContextInput {
  readonly appId: number;
  readonly phase: BootstrapPhaseName;
}

type BootstrapObservability = Pick<HttpObservability, 'withSpan' | 'withSpanSync'>;

/** Executes a synchronous bootstrap phase with instrumentation logging and optional span wrapping. */
export function runBootstrapPhase<T>(
  log: Logger,
  timer: PhasedTimer,
  phase: BootstrapPhaseName,
  appId: number,
  operation: () => T,
  observability?: BootstrapObservability,
): T {
  const context: BootstrapPhaseContext = { appId, phase };
  log.debug('bootstrap.phase.start', context);
  const phaseHandle = timer.startPhase(phase);

  try {
    const result = observability
      ? observability.withSpanSync({
          name: `oak.http.bootstrap.${phase}`,
          attributes: {
            'oak.bootstrap.phase': phase,
            'oak.bootstrap.app_id': appId,
          },
          run: () => operation(),
        })
      : operation();
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
    log.error('bootstrap.phase.error', normalizeError(errorAsError), {
      ...context,
      duration: durationResult.duration.formatted,
      durationMs: durationResult.duration.ms,
    });
    throw error;
  }
}

/**
 * Executes an async bootstrap phase with instrumentation logging.
 * Unlike {@link runBootstrapPhase}, this awaits the operation so phase
 * timing reflects the full async duration (e.g. a network fetch).
 */
export async function runAsyncBootstrapPhase<T>(
  log: Logger,
  timer: PhasedTimer,
  phase: BootstrapPhaseName,
  appId: number,
  operation: () => Promise<T>,
  observability?: BootstrapObservability,
): Promise<T> {
  const context: BootstrapPhaseContext = { appId, phase };
  log.debug('bootstrap.phase.start', context);
  const phaseHandle = timer.startPhase(phase);

  try {
    const result = observability
      ? await observability.withSpan({
          name: `oak.http.bootstrap.${phase}`,
          attributes: {
            'oak.bootstrap.phase': phase,
            'oak.bootstrap.app_id': appId,
          },
          run: async () => await operation(),
        })
      : await operation();
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
    log.error('bootstrap.phase.error', normalizeError(errorAsError), {
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
export function setupBaseMiddleware(
  app: Express,
  log: Logger,
  observability?: Pick<HttpObservability, 'captureHandledError'>,
): void {
  app.use(expressJson({ limit: '1mb' }));
  app.use(createCorrelationMiddleware(log));

  const debugEnabled = log.isLevelEnabled?.(logLevelToSeverityNumber('DEBUG')) ?? false;
  if (debugEnabled) {
    app.use(
      createRequestLogger(log, {
        level: 'debug',
        redactHeaders,
      }),
    );
  }
  app.use(createEnrichedErrorLogger(log, observability));
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
      log.error('MCP connection failed', normalizeError(error));
      _res.status(503).json({
        error: 'MCP server not ready',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}

/**
 * Logs bootstrap completion with timing and route count information.
 *
 * @param log - Logger instance
 * @param appId - Application instance identifier
 * @param timer - Phased timer tracking bootstrap phases
 * @param routeCount - Number of registered routes
 */
export function logBootstrapComplete(
  log: Logger,
  appId: number,
  timer: PhasedTimer,
  routeCount: number,
): void {
  const totalDuration = timer.end();
  log.info('bootstrap.complete', {
    appId,
    duration: totalDuration.formatted,
    durationMs: totalDuration.ms,
    routeCount,
  });
}

/**
 * Logs registered routes for diagnostic purposes.
 *
 * @param log - Logger instance
 * @param appId - Application instance identifier
 * @param routes - Array of route objects from express-list-routes
 */
export function logRegisteredRoutes(log: Logger, appId: number, routes: unknown[]): void {
  log.debug('bootstrap.routes.registered', {
    appId,
    routes: sanitiseForJson(routes),
  });
}

/**
 * Type for Express app with app ID tracking.
 */
export type ExpressWithAppId = Express & { __appId?: number };

/**
 * Initializes a new Express app instance with tracking and timing infrastructure.
 *
 * @param appCounter - Current app instance counter (will be incremented)
 * @param log - Logger instance
 * @returns Object containing the initialized app, timer, and app ID
 */
export function initializeAppInstance(
  appCounter: number,
  log: Logger,
): { app: ExpressWithAppId; timer: PhasedTimer; appId: number } {
  const appId = appCounter + 1;
  log.debug(`Creating app #${String(appId)}`);
  const app: ExpressWithAppId = express();
  app.__appId = appId;

  // Trust exactly one reverse proxy (Vercel CDN) so req.ip reflects the
  // real client IP from X-Forwarded-For rather than the CDN's address.
  // This MUST be set before any rate-limiting middleware.
  app.set('trust proxy', 1);

  const timer = createPhasedTimer();
  return { app, timer, appId };
}
