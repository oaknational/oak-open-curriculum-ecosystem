/**
 * Vercel deploy boundary for the MCP HTTP server.
 *
 * @remarks
 * `package.json` `main` points at the emitted `dist/server.js` bundle. The
 * default export therefore has one job: satisfy Vercel's import contract
 * cleanly. The full Express app is created lazily on first request so the
 * build-time export-contract gate can import this module without requiring
 * runtime environment variables.
 *
 * Local `dist/index.js` remains the explicit Node listener entry used by
 * `pnpm start` and the Sentry preload path.
 *
 * @packageDocumentation
 */

import type { IncomingMessage, ServerResponse } from 'node:http';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { setupExpressErrorHandler } from '@sentry/node';
import type { ProductAnalyticsRuntime } from '@oaknational/observability';

import { WIDGET_HTML_CONTENT } from './generated/widget-html-content.js';
import { BAKED_LANDING_PAGE_HTML } from './app/landing-page-baked.js';
import { createApp } from './application.js';
import {
  composeProductAnalyticsRuntime,
  composeProductAnalyticsRuntimeOnce,
  hostingWaitUntil,
  operationalErrorReporter,
  releaseInputFromRuntimeEnv,
} from './compose-product-analytics-runtime.js';
import { createBootFailureReportingLoader } from './boot-failure-report.js';
import { createDeployEntryHandler } from './deploy-entry-handler.js';
import {
  createHttpObservability,
  DEFAULT_HTTP_SERVICE_NAME,
  describeHttpObservabilityError,
  type HttpObservability,
} from './observability/http-observability.js';
import { liveResourceRegistrationNames } from './register-resources.js';
import { SERVED_SURFACE, liveToolNames } from './served-surface/served-surface.js';
import { loadRuntimeConfig, type LoadedRuntime, type RuntimeConfig } from './runtime-config.js';

const processEnv = process.env;
const startDir = process.cwd();

type NodeRequestHandler = (request: IncomingMessage, response: ServerResponse) => unknown;

/** The deploy boundary's throw site: Vercel's import contract needs a thrown Error. */
function boundaryError(message: string): never {
  throw new Error(message);
}

/**
 * The isolate's one boot-failure reporter (MCP-480), created at module
 * scope for the same reason as {@link analyticsMemo} below: the deploy
 * entry handler retries a failed load per request, and a misconfigured
 * deployment fails deterministically, so the report must be memoised
 * outside the retried loader or every inbound request would send one.
 */
const loadOrReportAndThrow = createBootFailureReportingLoader();

/**
 * Load the runtime configuration (handler-facing config plus the
 * product-analytics bootstrap) or fail the boundary.
 *
 * @remarks The refusal itself is unchanged — same message, same throw —
 * and the reporter cannot mask it or extend it beyond its own bounded
 * deadline.
 *
 * **Coverage, stated honestly.** This is the FIRST of two refusals that
 * happen before any Sentry client exists, and the one MCP-480 reports.
 * `createObservabilityOrThrow` below is the second: a bad
 * `SENTRY_TRACES_SAMPLE_RATE`, `SENTRY_SEND_DEFAULT_PII=true`, an
 * unresolvable release, or an invalid git SHA all pass the env schema and
 * refuse there, with no client yet built. Those are NOT reported, and the
 * blocker is not wiring: `describeConfigError` renders several of them by
 * echoing the offending value, so routing that boundary through the
 * reporter as it stands would carry raw environment values to Sentry —
 * the one thing this node is most careful never to do. De-valuing those
 * messages is the prerequisite, and its own piece of work.
 */
async function loadLoadedRuntimeOrThrow(): Promise<LoadedRuntime> {
  return await loadOrReportAndThrow({
    load: () => loadRuntimeConfig({ processEnv, startDir }),
    env: processEnv,
    serviceName: DEFAULT_HTTP_SERVICE_NAME,
  });
}

/**
 * The one process-owned product-analytics runtime (MCP-241), memoised
 * OUTSIDE the retried app loader: the deploy entry handler clears and
 * retries a failed load, and a retry must reuse — never reconstruct — the
 * client the first attempt composed (the adapter's one-client lifecycle).
 * This serverless entry DELIBERATELY never calls close(): delivery rides
 * `waitUntil`, and the isolate has no teardown moment — the local listener
 * entry (`index.ts`) is where MCP-243's process close owner runs. The
 * once-semantics are `composeProductAnalyticsRuntimeOnce`'s, proven by
 * its own integration tests.
 */
let analyticsMemo: ReturnType<typeof composeProductAnalyticsRuntimeOnce> | undefined;

/**
 * Compose the product-analytics runtime at most once per function isolate
 * (MCP-241) or fail the boundary. Off mode composes the exact inert
 * runtime.
 */
function composeAnalyticsOnce(
  loaded: LoadedRuntime,
  observability: HttpObservability,
): ProductAnalyticsRuntime<Transport> {
  analyticsMemo ??= composeProductAnalyticsRuntimeOnce(() =>
    composeProductAnalyticsRuntime({
      bootstrap: loaded.productAnalytics,
      serverVersion: loaded.runtimeConfig.version,
      releaseInput: releaseInputFromRuntimeEnv(
        loaded.runtimeConfig.env,
        loaded.runtimeConfig.version,
      ),
      toolNames: liveToolNames(SERVED_SURFACE),
      resourceNames: liveResourceRegistrationNames(SERVED_SURFACE),
      waitUntil: hostingWaitUntil,
      reportOperationalError: operationalErrorReporter(observability.createLogger()),
    }),
  );
  const analytics = analyticsMemo();

  if (!analytics.ok) {
    boundaryError(analytics.error.message);
  }

  return analytics.value;
}

/**
 * Create observability for the deployed app or fail the boundary.
 */
function createObservabilityOrThrow(runtimeConfig: RuntimeConfig): HttpObservability {
  const observability = createHttpObservability(runtimeConfig);

  if (!observability.ok) {
    boundaryError(describeHttpObservabilityError(observability.error));
  }

  return observability.value;
}

/**
 * Create the deployed Express application.
 */
async function loadConfiguredApp(): Promise<NodeRequestHandler> {
  const loaded = await loadLoadedRuntimeOrThrow();
  const runtimeConfig = loaded.runtimeConfig;
  const observability = createObservabilityOrThrow(runtimeConfig);
  const analytics = composeAnalyticsOnce(loaded, observability);

  return await createApp({
    runtimeConfig,
    observability,
    transportObserver: analytics.transportObserver,
    productAnalyticsSink: analytics.sink,
    getWidgetHtml: () => WIDGET_HTML_CONTENT,
    // The page ships INSIDE this bundle (esbuild text loader): the deploy
    // filesystem has no .generated/ artefact, so a runtime read is not an
    // option at this boundary — see src/app/landing-page-baked.ts.
    getLandingPageHtml: () => BAKED_LANDING_PAGE_HTML,
    setupSentryErrorHandler:
      runtimeConfig.env.SENTRY_MODE === 'sentry' ? setupExpressErrorHandler : undefined,
  });
}

const lazyDeployEntryHandler = createDeployEntryHandler<IncomingMessage, ServerResponse>({
  loadHandler: loadConfiguredApp,
});

export function deployEntryHandler(request: IncomingMessage, response: ServerResponse): unknown {
  return lazyDeployEntryHandler(request, response);
}

export default deployEntryHandler;
