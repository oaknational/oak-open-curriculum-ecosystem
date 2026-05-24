import express, { json as expressJson } from 'express';
import type { Express } from 'express';
import {
  createRequestLogger,
  logLevelToSeverityNumber,
  createPhasedTimer,
  normalizeError,
  type Logger,
  type LogContextInput,
  type PhasedTimer,
} from '@oaknational/logger';
import { sanitiseForJson } from '@oaknational/observability';

import { createCorrelationMiddleware } from '../correlation/middleware.js';
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

interface BootstrapPhaseContext extends LogContextInput {
  readonly appId: number;
  readonly phase: BootstrapPhaseName;
}

type BootstrapObservability = Pick<HttpObservability, 'withSpan' | 'withSpanSync'>;

interface ActiveBootstrapPhase {
  readonly context: BootstrapPhaseContext;
  readonly phaseHandle: ReturnType<PhasedTimer['startPhase']>;
}

/** Executes a synchronous bootstrap phase with instrumentation logging and optional span wrapping. */
export function runBootstrapPhase<T>(
  log: Logger,
  timer: PhasedTimer,
  phase: BootstrapPhaseName,
  appId: number,
  operation: () => T,
  observability?: BootstrapObservability,
): T {
  const activePhase = startBootstrapPhase(log, timer, phase, appId);

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
    finishBootstrapPhase(log, activePhase);
    return result;
  } catch (error: unknown) {
    logBootstrapPhaseError(log, activePhase, error);
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
  const activePhase = startBootstrapPhase(log, timer, phase, appId);

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
    finishBootstrapPhase(log, activePhase);
    return result;
  } catch (error: unknown) {
    logBootstrapPhaseError(log, activePhase, error);
    throw error;
  }
}

function startBootstrapPhase(
  log: Logger,
  timer: PhasedTimer,
  phase: BootstrapPhaseName,
  appId: number,
): ActiveBootstrapPhase {
  const context: BootstrapPhaseContext = { appId, phase };
  log.debug('bootstrap.phase.start', context);
  return { context, phaseHandle: timer.startPhase(phase) };
}

function finishBootstrapPhase(log: Logger, activePhase: ActiveBootstrapPhase): void {
  const durationResult = activePhase.phaseHandle.end();
  log.info('bootstrap.phase.finish', {
    ...activePhase.context,
    duration: durationResult.duration.formatted,
    durationMs: durationResult.duration.ms,
  });
}

function logBootstrapPhaseError(
  log: Logger,
  activePhase: ActiveBootstrapPhase,
  error: unknown,
): void {
  const durationResult = activePhase.phaseHandle.end();
  const errorAsError =
    error instanceof Error
      ? error
      : new Error(
          `Bootstrap phase "${activePhase.context.phase}" threw non-error value: ${String(error)}`,
        );
  log.error('bootstrap.phase.error', normalizeError(errorAsError), {
    ...activePhase.context,
    duration: durationResult.duration.formatted,
    durationMs: durationResult.duration.ms,
  });
}

/**
 * Sets up base Express middleware: JSON, correlation, and debug request logging.
 * Error handlers register later for Sentry compatibility. Not a route handler:
 * CodeQL #69 and #90 (lines 146 `app.use(createCorrelationMiddleware(...))`
 * and 151 `app.use(createRequestLogger(...))`) are misclassifications —
 * correlation and request-logger middleware are cross-cutting, not
 * auth-bearing. Rate limiting applies at auth-bearing routes
 * (see `auth-routes.ts`).
 */
export function setupBaseMiddleware(
  app: Express,
  log: Logger,
  observability?: Pick<HttpObservability, 'setTag'>,
): void {
  app.use(expressJson({ limit: '1mb' }));
  app.use(createCorrelationMiddleware(log, { observability }));

  const debugEnabled = log.isLevelEnabled?.(logLevelToSeverityNumber('DEBUG')) ?? false;
  if (debugEnabled) {
    app.use(
      createRequestLogger(log, {
        level: 'debug',
        redactHeaders,
      }),
    );
  }
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

// Module-encapsulated counter for diagnostic app IDs. Production constructs
// one app per process so the counter is always 1; tests construct many apps
// per worker and use the increment to disambiguate bootstrap-phase logs and
// OTel attributes. The counter is intentionally not exposed: callers receive
// the next id via `initializeAppInstance`, not by mutating module state.
let appInstanceCounter = 0;

/**
 * Initializes a new Express app instance with tracking and timing infrastructure.
 *
 * @param log - Logger instance
 * @returns Object containing the initialized app, timer, and app ID
 */
export function initializeAppInstance(log: Logger): {
  app: ExpressWithAppId;
  timer: PhasedTimer;
  appId: number;
} {
  appInstanceCounter += 1;
  const appId = appInstanceCounter;
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
