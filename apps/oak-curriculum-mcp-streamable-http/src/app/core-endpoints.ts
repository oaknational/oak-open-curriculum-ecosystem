/**
 * Core MCP endpoint initialisation: search retrieval, asset download proxy,
 * handler registration, and per-request MCP server factory.
 *
 * Extracted from `application.ts` to keep the composition root under the
 * 250-line `max-lines` threshold. This function is called once during app
 * bootstrap.
 *
 * @see ADR-112 for the per-request MCP transport pattern.
 */
import type { Express } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { wrapMcpServerWithSentry } from '@sentry/node';
import type { McpTransportObserver, ProductAnalyticsSink } from '@oaknational/observability';
import type { Logger } from '@oaknational/logger';
import {
  SERVER_INSTRUCTIONS,
  createStubSearchRetrieval,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

import { mountAssetDownloadProxy } from '../asset-download/asset-download-route.js';
import { registerHandlers, type ToolHandlerOverrides } from '../handlers.js';
import type { ServedSurfaceDefinition } from '../served-surface/served-surface.js';
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
  /**
   * Absolute URL of the served MCP endpoint, derived at the composition
   * root via `resolveServedMcpUrl`. Required so no layer re-defaults it
   * (a scattered localhost default once reached production error
   * payloads — MCP-351).
   */
  readonly resourceUrl: string;
  readonly getWidgetHtml: () => string;
  /**
   * Served-surface definition override — test seam only. Production
   * composition omits it, so registration uses the canonical
   * module-level `SERVED_SURFACE` definition.
   */
  readonly servedSurface?: ServedSurfaceDefinition;
  /**
   * Product-analytics transport observer (MCP-241). The factory passes
   * each fresh per-request transport through `observe` and hands the
   * returned transport to `server.connect`, retaining the concrete
   * transport for `handleRequest`. Omitted → off mode: `connectTransport`
   * is the exact concrete transport reference.
   */
  readonly transportObserver?: McpTransportObserver<Transport>;
  /**
   * Closed product-analytics capture capability (MCP-241), threaded into
   * request handling; MCP-242's resource-read observation is its first
   * consumer.
   */
  readonly productAnalyticsSink?: ProductAnalyticsSink;
}

/**
 * Off mode (no observer) keeps the exact concrete transport as the connect
 * target; a supplied observer's return value becomes the connect target
 * while `handleRequest` stays on the concrete transport (MCP-241).
 */
function deriveConnectTransport(
  transport: StreamableHTTPServerTransport,
  observer?: McpTransportObserver<Transport>,
): Transport {
  return observer ? observer.observe(transport) : transport;
}

/** Initialises core MCP endpoints, returns a per-request factory. @see ADR-112 */
export function initializeCoreEndpoints(
  app: Express,
  options: CoreEndpointOptions,
  log: Logger,
): { mcpFactory: McpServerFactory } {
  const { runtimeConfig, observability, transportObserver, productAnalyticsSink } = options;
  const searchRetrieval = runtimeConfig.useStubTools
    ? createStubSearchRetrieval()
    : createSearchRetrieval(runtimeConfig.env, log);
  const { resourceUrl } = options;
  // Signed asset download URLs are a served surface, so they name the same
  // origin as every other self-description (MCP-351) — the resource URL the
  // composition root derived, never a second precedence of their own.
  const assetBaseUrl = new URL(resourceUrl).origin;
  const createAssetDownloadUrl = mountAssetDownloadProxy(
    app,
    assetBaseUrl,
    runtimeConfig.env.OAK_API_KEY,
    log,
    runtimeConfig.env.OAK_API_BASE_URL ?? 'https://open-api.thenational.academy/api/v0',
    observability,
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
    ...(options.servedSurface ? { servedSurface: options.servedSurface } : {}),
    ...(productAnalyticsSink ? { productAnalyticsSink } : {}),
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
    const connectTransport = deriveConnectTransport(transport, transportObserver);
    return { server, transport, connectTransport };
  };

  addHealthEndpoints(app, log);

  return { mcpFactory };
}
