/**
 * Error handler middleware registration — Sentry + enriched error logger.
 *
 * @remarks Extracted from bootstrap-helpers.ts to stay within max-lines.
 * Follows the same pattern as bootstrap-security.ts, oauth-and-caching-setup.ts.
 */

import type { Express } from 'express';
import { normalizeError, type Logger } from '@oaknational/logger';

import { createEnrichedErrorLogger } from '../logging/index.js';
import type { HttpObservability } from '../observability/http-observability.js';

/**
 * Sentry Express error handler registration function.
 *
 * @remarks Matches the signature of `setupExpressErrorHandler` from
 * `@sentry/node`. Extracted as a type for DI — production passes the
 * real Sentry function; tests inject a no-op or recording fake.
 */
export type SentryExpressErrorHandlerSetup = (app: Express) => void;

/**
 * Registers error handling middleware after all routes.
 *
 * @remarks **Ordering is load-bearing** (per Sentry official docs):
 * 1. `setupSentryErrorHandler(app)` — Sentry-native request context
 *    enrichment (registered first so it captures before our logger)
 * 2. `createEnrichedErrorLogger` — structured logging + correlation
 *
 * The Sentry handler is wrapped in try-catch: if it throws during
 * registration, the app must still start with our error logger intact.
 *
 * @param app - Express application instance
 * @param log - Logger for error logging middleware
 * @param observability - Optional observability for error capture
 * @param setupSentryErrorHandler - Sentry error handler registration
 *   function (injected via `CreateAppOptions`)
 */
export function setupErrorHandlers(
  app: Express,
  log: Logger,
  observability?: Pick<HttpObservability, 'captureHandledError'>,
  setupSentryErrorHandler?: SentryExpressErrorHandlerSetup,
): void {
  if (setupSentryErrorHandler) {
    try {
      setupSentryErrorHandler(app);
      log.info('sentry.express.error-handler.registered');
    } catch (error: unknown) {
      const normalized = normalizeError(error);
      log.warn('sentry.express.error-handler.registration-failed', {
        errorName: normalized.name,
        errorMessage: normalized.message,
      });
    }
  }
  // Ordering is load-bearing: Sentry captures first, then enriched logger runs
  app.use(createEnrichedErrorLogger(log, observability));
}
