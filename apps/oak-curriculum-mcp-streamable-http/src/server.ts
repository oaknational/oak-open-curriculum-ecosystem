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
import { setupExpressErrorHandler } from '@sentry/node';
import type { RuntimeConfig } from './runtime-config.js';

import { WIDGET_HTML_CONTENT } from './generated/widget-html-content.js';
import { createApp } from './application.js';
import { createDeployEntryHandler } from './deploy-entry-handler.js';
import {
  createHttpObservability,
  describeHttpObservabilityError,
  type HttpObservability,
} from './observability/http-observability.js';
import { loadRuntimeConfig } from './runtime-config.js';

const processEnv = process.env;
const startDir = process.cwd();

type NodeRequestHandler = (
  request: IncomingMessage,
  response: ServerResponse,
) => Promise<unknown> | unknown;

/**
 * Load the runtime configuration or throw a boundary error.
 */
function loadRuntimeConfigOrThrow(): RuntimeConfig {
  const runtimeConfig = loadRuntimeConfig({
    processEnv,
    startDir,
  });

  if (!runtimeConfig.ok) {
    throw new Error(runtimeConfig.error.message);
  }

  return runtimeConfig.value;
}

/**
 * Create observability for the deployed app or throw a boundary error.
 */
function createObservabilityOrThrow(runtimeConfig: RuntimeConfig): HttpObservability {
  const observability = createHttpObservability(runtimeConfig);

  if (!observability.ok) {
    throw new Error(describeHttpObservabilityError(observability.error));
  }

  return observability.value;
}

/**
 * Create the deployed Express application.
 */
async function loadConfiguredApp(): Promise<NodeRequestHandler> {
  const runtimeConfig = loadRuntimeConfigOrThrow();
  const observability = createObservabilityOrThrow(runtimeConfig);

  return await createApp({
    runtimeConfig,
    observability,
    getWidgetHtml: () => WIDGET_HTML_CONTENT,
    setupSentryErrorHandler:
      runtimeConfig.env.SENTRY_MODE === 'sentry' ? setupExpressErrorHandler : undefined,
  });
}

const lazyDeployEntryHandler = createDeployEntryHandler<IncomingMessage, ServerResponse>({
  loadHandler: loadConfiguredApp,
});

export function deployEntryHandler(
  request: IncomingMessage,
  response: ServerResponse,
): Promise<unknown> | unknown {
  return lazyDeployEntryHandler(request, response);
}

export default deployEntryHandler;
