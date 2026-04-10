/**
 * Instrumentation utilities for authentication middleware.
 *
 * Provides logging, timing, and error handling wrappers for auth middleware.
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { Logger, JsonObject } from '@oaknational/logger';

const PENDING_LOG_DELAY_MS = 5000;
interface AuthInstrumentationLocals {
  readonly correlationId?: string;
}
type AuthInstrumentationResponse = Response<unknown, AuthInstrumentationLocals>;

/**
 * Creates a child logger with auth-specific context.
 */
export function createAuthScopedLogger(
  parentLog: Logger,
  name: string,
  req: Request,
  res: AuthInstrumentationResponse,
): Logger {
  const correlationId = res.locals.correlationId;
  const context: JsonObject = {
    scope: 'auth',
    middleware: name,
    method: req.method,
    path: req.path,
    ...(typeof correlationId === 'string' && correlationId.length > 0 ? { correlationId } : {}),
  };

  if (typeof parentLog.child !== 'function') {
    return parentLog;
  }

  return parentLog.child(context);
}

/**
 * Starts a timer that logs if middleware takes too long.
 */
export function startPendingTimer(log: Logger, name: string, startedAt: number): NodeJS.Timeout {
  return setTimeout(() => {
    log.debug(`${name} pending`, { durationMs: Date.now() - startedAt });
  }, PENDING_LOG_DELAY_MS);
}

/**
 * Clears a pending timer.
 */
export function clearPendingTimer(timer: NodeJS.Timeout | undefined): void {
  if (timer !== undefined) {
    clearTimeout(timer);
  }
}

/**
 * Wraps the next() callback to log when middleware completes or errors.
 */
export function createWrappedNext(
  downstreamNext: NextFunction,
  log: Logger,
  name: string,
  startedAt: number,
  timer: NodeJS.Timeout | undefined,
): NextFunction {
  return (maybeError?: unknown) => {
    clearPendingTimer(timer);
    const durationMs = Date.now() - startedAt;

    if (maybeError === undefined) {
      log.debug(`${name} next`, { durationMs });
      downstreamNext();
      return;
    }

    if (maybeError instanceof Error) {
      log.debug(`${name} next (error)`, {
        durationMs,
        errorMessage: maybeError.message,
        errorName: maybeError.name,
      });
      downstreamNext(maybeError);
      return;
    }

    log.debug(`${name} next (non-error)`, {
      durationMs,
      errorType: typeof maybeError,
    });
    downstreamNext(maybeError);
  };
}

/**
 * Logs if response closes before middleware calls next().
 */
export function logEarlyResponseClose(
  res: AuthInstrumentationResponse,
  log: Logger,
  name: string,
  startedAt: number,
  timer: NodeJS.Timeout | undefined,
): void {
  res.once('close', () => {
    if (res.headersSent) {
      return;
    }
    clearPendingTimer(timer);
    log.debug(`${name} response closed before next`, {
      durationMs: Date.now() - startedAt,
      statusCode: res.statusCode,
    });
  });
}

/**
 * Executes middleware with error handling.
 */
export function executeMiddleware(
  middleware: RequestHandler,
  req: Request,
  res: AuthInstrumentationResponse,
  next: NextFunction,
  log: Logger,
  name: string,
  startedAt: number,
  timer: NodeJS.Timeout | undefined,
): void {
  try {
    middleware(req, res, next);
  } catch (error) {
    clearPendingTimer(timer);
    const durationMs = Date.now() - startedAt;

    if (error instanceof Error) {
      log.debug(`${name} threw`, {
        durationMs,
        errorMessage: error.message,
        errorName: error.name,
      });
    } else {
      log.debug(`${name} threw (non-error)`, {
        durationMs,
        errorType: typeof error,
      });
    }

    throw error;
  }
}

/**
 * Wraps middleware with comprehensive logging and error handling.
 *
 * Adds:
 * - Start/completion logging
 * - Duration tracking
 * - Pending operation warnings (if \> 5s)
 * - Early response close detection
 * - Error logging with context
 *
 * @param name - Middleware name for logging
 * @param middleware - The middleware function to instrument
 * @param parentLog - Logger instance
 * @returns Instrumented middleware
 */
export function instrumentMiddleware(
  name: string,
  middleware: RequestHandler,
  parentLog: Logger,
): RequestHandler {
  return (req: Request, res: AuthInstrumentationResponse, next: NextFunction): void => {
    const log = createAuthScopedLogger(parentLog, name, req, res);
    const startedAt = Date.now();
    log.debug(`${name} start`);

    const pendingTimer = startPendingTimer(log, name, startedAt);
    const wrappedNext = createWrappedNext(next, log, name, startedAt, pendingTimer);

    logEarlyResponseClose(res, log, name, startedAt, pendingTimer);
    executeMiddleware(middleware, req, res, wrappedNext, log, name, startedAt, pendingTimer);
  };
}
