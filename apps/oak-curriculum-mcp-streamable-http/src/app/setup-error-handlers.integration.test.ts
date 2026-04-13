/**
 * Integration tests for {@link setupErrorHandlers}.
 *
 * @remarks Tests the composition of Sentry and enriched error handler
 * registration — not the individual handlers (those are tested elsewhere).
 * All tests are in-memory: no HTTP, no IO, no child processes.
 */

import { describe, it, expect, vi } from 'vitest';
import express from 'express';
import type { Logger, LogContextInput } from '@oaknational/logger';
import type { HttpObservability } from '../observability/http-observability.js';
import {
  setupErrorHandlers,
  type SentryExpressErrorHandlerSetup,
} from './bootstrap-error-handlers.js';

/** Creates a recording logger fake with spied methods. */
function createFakeLogger(): Logger {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    child: vi.fn(),
  } as unknown as Logger;
}

/** Creates a recording observability fake matching the Pick used by setupErrorHandlers. */
function createFakeObservability(): Pick<HttpObservability, 'captureHandledError'> {
  return {
    captureHandledError: vi.fn<(error: unknown, context?: LogContextInput) => void>(),
  };
}

describe('setupErrorHandlers', () => {
  it('registers enriched error logger when no Sentry handler is provided', () => {
    const app = express();
    const useSpy = vi.spyOn(app, 'use');
    const log = createFakeLogger();
    const observability = createFakeObservability();

    setupErrorHandlers(app, log, observability);

    expect(useSpy).toHaveBeenCalledTimes(1);
  });

  it('calls Sentry error handler setup before registering enriched error logger', () => {
    const app = express();
    const callOrder: string[] = [];
    const originalUse = app.use.bind(app);
    vi.spyOn(app, 'use').mockImplementation((...args: Parameters<typeof app.use>) => {
      callOrder.push('app.use');
      return originalUse(...args);
    });

    const fakeSentrySetup: SentryExpressErrorHandlerSetup = () => {
      callOrder.push('sentry-setup');
    };

    const log = createFakeLogger();
    const observability = createFakeObservability();

    setupErrorHandlers(app, log, observability, fakeSentrySetup);

    expect(callOrder).toStrictEqual(['sentry-setup', 'app.use']);
  });

  it('registers enriched error logger even when Sentry setup throws', () => {
    const app = express();
    const useSpy = vi.spyOn(app, 'use');
    const log = createFakeLogger();
    const observability = createFakeObservability();

    const throwingSentrySetup: SentryExpressErrorHandlerSetup = () => {
      throw new Error('Sentry registration boom');
    };

    setupErrorHandlers(app, log, observability, throwingSentrySetup);

    expect(useSpy).toHaveBeenCalledTimes(1);
  });

  it('logs warning but not info when Sentry setup throws', () => {
    const app = express();
    const log = createFakeLogger();
    const observability = createFakeObservability();

    const throwingSentrySetup: SentryExpressErrorHandlerSetup = () => {
      throw new Error('Sentry registration boom');
    };

    setupErrorHandlers(app, log, observability, throwingSentrySetup);

    expect(log.warn).toHaveBeenCalledTimes(1);
    expect(log.warn).toHaveBeenCalledWith(
      'sentry.express.error-handler.registration-failed',
      expect.objectContaining({ errorMessage: 'Sentry registration boom' }),
    );
    expect(log.info).not.toHaveBeenCalled();
  });

  it('logs info but not warning when Sentry handler registers successfully', () => {
    const app = express();
    const log = createFakeLogger();
    const observability = createFakeObservability();

    const noopSentrySetup: SentryExpressErrorHandlerSetup = () => {
      /* noop */
    };

    setupErrorHandlers(app, log, observability, noopSentrySetup);

    expect(log.info).toHaveBeenCalledTimes(1);
    expect(log.info).toHaveBeenCalledWith('sentry.express.error-handler.registered');
    expect(log.warn).not.toHaveBeenCalled();
  });

  it('registers enriched error logger when called without optional parameters', () => {
    const app = express();
    const useSpy = vi.spyOn(app, 'use');
    const log = createFakeLogger();

    expect(() => {
      setupErrorHandlers(app, log);
    }).not.toThrow();
    expect(useSpy).toHaveBeenCalledTimes(1);
  });
});
