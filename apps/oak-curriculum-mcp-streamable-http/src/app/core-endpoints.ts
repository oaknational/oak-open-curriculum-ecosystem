/**
 * Core MCP endpoint initialisation: search retrieval, asset download proxy,
 * handler registration, and per-request MCP server factory.
 *
 * Extracted from `application.ts` to keep the composition root under the
 * 250-line `max-lines` threshold. This function is called once during app
 * bootstrap.
 *
 * @see ADR-112 for the per-request MCP transport pattern.
 * @see ADR-158 for the asset rate limiter parameter.
 */
import type { Express, RequestHandler } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { wrapMcpServerWithSentry } from '@sentry/node';
import type { Logger } from '@oaknational/logger';
import {
  SERVER_INSTRUCTIONS,
  createStubSearchRetrieval,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import { mountAssetDownloadProxy } from '../asset-download/asset-download-route.js';
import { registerHandlers, type ToolHandlerOverrides } from '../handlers.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { createSearchRetrieval } from '../search-retrieval-factory.js';
import type { HttpObservability } from '../observability/http-observability.js';
import type { McpServerFactory } from '../mcp-request-context.js';
import { OAK_SERVER_BRANDING } from '../server-branding.js';
import { addHealthEndpoints } from './health-endpoints.js';

/**
 * Narrow options for {@link initializeCoreEndpoints}. Contains only the
 * fields the function actually needs, avoiding a circular type import
 * back to the composition root's `CreateAppOptions`.
 */
interface CoreEndpointOptions {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
  readonly resourceUrl?: string;
  readonly getWidgetHtml: () => string;
}

/** Initialises core MCP endpoints, returns a per-request factory. @see ADR-112 */
export function initializeCoreEndpoints(
  app: Express,
  options: CoreEndpointOptions,
  log: Logger,
  assetRateLimiter: RequestHandler,
): { mcpFactory: McpServerFactory; ready: Promise<void> } {
  const { runtimeConfig, observability } = options;
  const searchRetrieval = runtimeConfig.useStubTools
    ? createStubSearchRetrieval()
    : createSearchRetrieval(runtimeConfig.env, log);
  const resourceUrl = options.resourceUrl ?? 'http://localhost:3333/mcp';
  const assetBaseUrl = runtimeConfig.displayHostname
    ? `https://${runtimeConfig.displayHostname}`
    : new URL(resourceUrl).origin;
  const createAssetDownloadUrl = mountAssetDownloadProxy(
    app,
    assetBaseUrl,
    runtimeConfig.env.OAK_API_KEY,
    log,
    runtimeConfig.env.OAK_API_BASE_URL ?? 'https://open-api.thenational.academy/api/v0',
    observability,
    assetRateLimiter,
  );

  const handlerOptions = {
    overrides: options.toolHandlerOverrides,
    runtimeConfig,
    logger: log,
    observability,
    resourceUrl,
    searchRetrieval,
    createAssetDownloadUrl,
    getWidgetHtml: options.getWidgetHtml,
  };

  log.debug('bootstrap.mcp.factory.created');

  // Factory creates a fresh McpServer + transport per request
  const mcpFactory: McpServerFactory = () => {
    const server = new McpServer(
      { name: 'oak-curriculum-http', version: '0.1.0', ...OAK_SERVER_BRANDING },
      { instructions: SERVER_INSTRUCTIONS },
    );

    /**
     * Native Sentry MCP wrapping: patches `registerTool`, `registerResource`,
     * `registerPrompt`, and `connect` for handler error capture and transport
     * tracing. Unconditional — inert when `Sentry.init()` was never called
     * (`SENTRY_MODE=off`). `recordInputs` / `recordOutputs` default to the
     * client's `sendDefaultPii` option, which Oak pins to `false`.
     *
     * @see {@link https://docs.sentry.io/product/insights/ai/mcp/getting-started/}
     */
    wrapMcpServerWithSentry(server);

    registerHandlers(server, handlerOptions);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    return { server, transport };
  };

  addHealthEndpoints(app, log);

  return { mcpFactory, ready: Promise.resolve() };
}
