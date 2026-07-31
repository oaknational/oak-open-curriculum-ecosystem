import http from 'node:http';
import { setupExpressErrorHandler } from '@sentry/node';

import { WIDGET_HTML_CONTENT } from './generated/widget-html-content.js';
import { readBakedLandingPageHtml } from './app/landing-page-artefact.js';
import { createApp } from './application.js';
import { bootstrapApp } from './bootstrap-app.js';
import {
  composeProductAnalyticsRuntime,
  hostingWaitUntil,
  operationalErrorReporter,
  releaseInputFromRuntimeEnv,
} from './compose-product-analytics-runtime.js';
import {
  createHttpObservability,
  describeHttpObservabilityError,
} from './observability/http-observability.js';
import { liveResourceRegistrationNames } from './register-resources.js';
import { loadRuntimeConfig } from './runtime-config.js';
import { SERVED_SURFACE, liveToolNames } from './served-surface/served-surface.js';
import { startConfiguredHttpServer } from './server-runtime.js';

// Boot-read of the build's baked landing page: fail-fast at boot, never a
// blank page at request time (the bake step writes it during the build).
const LANDING_PAGE_HTML = readBakedLandingPageHtml();

const result = loadRuntimeConfig({
  processEnv: process.env,
  startDir: process.cwd(),
});

if (!result.ok) {
  process.stderr.write(result.error.message + '\n');
  process.exit(1);
}

const config = result.value.runtimeConfig;
const observabilityResult = createHttpObservability(config);

if (!observabilityResult.ok) {
  process.stderr.write(describeHttpObservabilityError(observabilityResult.error) + '\n');
  process.exit(1);
}

const observability = observabilityResult.value;

// Composed once at bootstrap (MCP-241): off mode is the exact inert runtime.
const analyticsResult = composeProductAnalyticsRuntime({
  bootstrap: result.value.productAnalytics,
  serverVersion: config.version,
  releaseInput: releaseInputFromRuntimeEnv(config.env, config.version),
  toolNames: liveToolNames(SERVED_SURFACE),
  resourceNames: liveResourceRegistrationNames(SERVED_SURFACE),
  waitUntil: hostingWaitUntil,
  reportOperationalError: operationalErrorReporter(observability.createLogger()),
});

if (!analyticsResult.ok) {
  process.stderr.write(analyticsResult.error.message + '\n');
  process.exit(1);
}

const analytics = analyticsResult.value;
await startConfiguredHttpServer({
  runtimeConfig: config,
  observability,
  closeProductAnalytics: () => analytics.close(),
  createApp: (opts) =>
    createApp({
      ...opts,
      getWidgetHtml: () => WIDGET_HTML_CONTENT,
      getLandingPageHtml: () => LANDING_PAGE_HTML,
      transportObserver: analytics.transportObserver,
      productAnalyticsSink: analytics.sink,
      setupSentryErrorHandler:
        config.env.SENTRY_MODE === 'sentry' ? setupExpressErrorHandler : undefined,
    }),
  bootstrapApp,
  createServer: (app) => {
    /**
     * Express 5's app.listen() wraps the callback with once() and registers it
     * for both 'listening' and 'error' events. This means EADDRINUSE fires the
     * callback without the error argument, the server never binds, and the
     * process exits silently. Using http.createServer directly lets us handle
     * startup errors explicitly.
     */
    return http.createServer(app);
  },
  onSignal: (signal, handler) => {
    process.once(signal, handler);
  },
  exit: (code) => process.exit(code),
});
