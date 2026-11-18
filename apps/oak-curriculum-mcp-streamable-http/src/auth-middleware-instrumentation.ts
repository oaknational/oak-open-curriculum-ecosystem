/**
 * Instrumentation utilities for authentication middleware.
 *
 * Provides logging, timing, and error handling wrappers for auth middleware.
 */

import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { Logger } from '@oaknational/logger';
import type { JsonObject } from '@oaknational/observability';

const PENDING_LOG_DELAY_MS = 5000;
interface AuthInstrumentationLocals {
  readonly correlationId?: string;
}
type AuthInstrumentationResponse = Response<unknown, AuthInstrumentationLocals>;

/**
 * One instrumented middleware run: its scoped logger, the middleware's name,
 * when it started and the pending-operation timer armed for it. The
 * completion, early-close and throw paths all report against the same run.
 */
interface InstrumentedRun {
  readonly log: Logger;
  readonly name: string;
  readonly startedAt: number;
  readonly timer: NodeJS.Timeout;
}

/**
 * Creates a child logger with auth-specific context.
 */
function createAuthScopedLogger(
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
function startPendingTimer(log: Logger, name: string, startedAt: number): NodeJS.Timeout {
  return setTimeout(() => {
    log.debug(`${name} pending`, { durationMs: Date.now() - startedAt });
  }, PENDING_LOG_DELAY_MS);
}

/**
 * Wraps the next() callback to log when middleware completes or errors.
 */
function createWrappedNext(downstreamNext: NextFunction, run: InstrumentedRun): NextFunction {
  const { log, name, startedAt, timer } = run;
  return (maybeError?: unknown) => {
    clearTimeout(timer);
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
function logEarlyResponseClose(res: AuthInstrumentationResponse, run: InstrumentedRun): void {
  const { log, name, startedAt, timer } = run;
  res.once('close', () => {
    if (res.headersSent) {
      return;
    }
    clearTimeout(timer);
    log.debug(`${name} response closed before next`, {
      durationMs: Date.now() - startedAt,
      statusCode: res.statusCode,
    });
  });
}

/**
 * Executes middleware with error handling.
 */
function executeMiddleware(
  middleware: RequestHandler,
  req: Request,
  res: AuthInstrumentationResponse,
  next: NextFunction,
  run: InstrumentedRun,
): void {
  const { log, name, startedAt, timer } = run;
  try {
    middleware(req, res, next);
  } catch (error) {
    clearTimeout(timer);
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

    const run: InstrumentedRun = {
      log,
      name,
      startedAt,
      timer: startPendingTimer(log, name, startedAt),
    };
    const wrappedNext = createWrappedNext(next, run);

    logEarlyResponseClose(res, run);
    executeMiddleware(middleware, req, res, wrappedNext, run);
  };
}
