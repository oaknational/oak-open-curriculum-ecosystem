/**
 * Characterisation of {@link instrumentMiddleware}: the wrapper's one output
 * is the debug trail it writes around a middleware run through the injected
 * logger (ADR-078), so that trail is what these cases describe.
 */
import { describe, expect, it, vi } from 'vitest';
import type { Logger } from '@oaknational/logger';
import type { NextFunction, RequestHandler } from 'express';
import { instrumentMiddleware } from './auth-middleware-instrumentation.js';
import { createMockExpressRequest, createMockExpressResponse } from './test-helpers/fakes.js';
import { createFakeLogger } from './test-helpers/logger-fakes.js';

/** The messages the fake logger's `debug` received, in order. */
function debugMessages(log: Logger): string[] {
  return vi.mocked(log.debug).mock.calls.map(([message]) => message);
}

/** Wraps `middleware` as `auth-mw` and prepares one request through it. */
function instrumentedRun(middleware: RequestHandler): {
  readonly log: Logger;
  readonly next: NextFunction;
  readonly run: () => void;
} {
  const log = createFakeLogger();
  const next: NextFunction = vi.fn();
  const instrumented = instrumentMiddleware('auth-mw', middleware, log);
  return {
    log,
    next,
    run: () => {
      instrumented(createMockExpressRequest(), createMockExpressResponse(), next);
    },
  };
}

describe('instrumentMiddleware', () => {
  it('passes the request on and records the run from start to completion', () => {
    const { log, next, run } = instrumentedRun((_req, _res, downstream) => {
      downstream();
    });

    run();

    expect(next).toHaveBeenCalledWith();
    expect(debugMessages(log)).toEqual(['auth-mw start', 'auth-mw next']);
  });

  it('forwards a downstream error and records it', () => {
    const failure = new Error('verification failed');
    const { log, next, run } = instrumentedRun((_req, _res, downstream) => {
      downstream(failure);
    });

    run();

    expect(next).toHaveBeenCalledWith(failure);
    expect(debugMessages(log)).toEqual(['auth-mw start', 'auth-mw next (error)']);
  });

  it('rethrows a synchronous throw after recording it', () => {
    const failure = new Error('middleware exploded');
    const { log, next, run } = instrumentedRun(() => {
      throw failure;
    });

    expect(run).toThrow(failure);
    expect(next).not.toHaveBeenCalled();
    expect(debugMessages(log)).toEqual(['auth-mw start', 'auth-mw threw']);
  });
});
