import type { Logger, PhasedTimer } from '@oaknational/logger';
import listRoutes from 'express-list-routes';
import {
  logBootstrapComplete,
  logRegisteredRoutes,
  type ExpressWithAppId,
} from './bootstrap-helpers.js';
import { setupErrorHandlers } from './bootstrap-error-handlers.js';
import { registerDiagnosticRoutesIfEnabled } from '../test-error/register-diagnostic-routes.js';
import type { CreateAppOptions } from './create-app-options.js';

/**
 * Emits the end-of-bootstrap summary: completion timing and the registered
 * route inventory.
 *
 * Module-private: {@link finalizeApp} is the phase boundary callers use.
 */
function logBootstrapSummary(
  app: ExpressWithAppId,
  log: Logger,
  appId: number,
  bootstrapTimer: PhasedTimer,
): void {
  const routes = listRoutes(app);
  logBootstrapComplete(log, appId, bootstrapTimer, routes.length);
  logRegisteredRoutes(log, appId, routes);
}

/**
 * Runs everything that must register AFTER all routes: the optional
 * diagnostic routes, the error handlers (Sentry's documented ordering
 * requirement), and the bootstrap summary.
 *
 * Kept out of the composition root so that ordering requirement is stated
 * once, in one place, rather than implied by statement order among the
 * phase calls.
 */
export function finalizeApp(deps: {
  readonly app: ExpressWithAppId;
  readonly options: CreateAppOptions;
  readonly log: Logger;
  readonly appId: number;
  readonly bootstrapTimer: PhasedTimer;
}): void {
  const { app, options, log, appId, bootstrapTimer } = deps;
  const { observability } = options;

  registerDiagnosticRoutesIfEnabled({
    app,
    env: options.runtimeConfig.env,
    observability,
    log,
  });
  setupErrorHandlers(app, log, observability, options.setupSentryErrorHandler);
  logBootstrapSummary(app, log, appId, bootstrapTimer);
}
