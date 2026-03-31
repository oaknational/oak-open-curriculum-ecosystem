/**
 * Initialisation of core MCP endpoints: search retrieval, asset download
 * proxy, tool handler registration, and per-request MCP server factory.
 *
 * Extracted from `application.ts` to stay within file-length limits.
 *
 * @module
 */
import type { Express, RequestHandler } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Logger } from '@oaknational/logger';

import { registerHandlers, type ToolHandlerOverrides } from '../handlers.js';
import { overrideToolsListHandler } from '../tools-list-override.js';
import {
  SERVER_INSTRUCTIONS,
  createStubSearchRetrieval,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { mountAssetDownloadProxy } from '../asset-download/asset-download-route.js';
import type { RuntimeConfig } from '../runtime-config.js';
import { createSearchRetrieval } from '../search-retrieval-factory.js';
import type { HttpObservability } from '../observability/http-observability.js';
import type { McpServerFactory } from '../mcp-request-context.js';
import { addHealthEndpoints } from './health-endpoints.js';

/** Options forwarded from {@link CreateAppOptions} for core endpoint init. */
export interface CoreEndpointOptions {
  readonly runtimeConfig: RuntimeConfig;
  readonly observability: HttpObservability;
  readonly toolHandlerOverrides?: ToolHandlerOverrides;
  readonly resourceUrl?: string;
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
  };

  log.debug('bootstrap.mcp.factory.created');

  // Factory creates a fresh McpServer + transport per request
  const mcpFactory: McpServerFactory = () => {
    const server = new McpServer(
      { name: 'oak-curriculum-http', version: '0.1.0' },
      { instructions: SERVER_INSTRUCTIONS },
    );
    registerHandlers(server, handlerOptions);
    overrideToolsListHandler(server);
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    return { server, transport };
  };

  addHealthEndpoints(app, log);

  return { mcpFactory, ready: Promise.resolve() };
}
