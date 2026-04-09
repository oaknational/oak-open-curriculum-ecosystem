/**
 * MCP tool registration.
 *
 * Iterates over the SDK's universal tool registry and registers each tool
 * with its observability wrapping and auth interception.
 *
 * The per-request HTTP handler factory lives in `mcp-handler.ts`.
 */

import type { McpServer, ToolCallback } from '@modelcontextprotocol/sdk/server/mcp';
import { registerAppTool } from '@modelcontextprotocol/ext-apps/server';
import type { Logger } from '@oaknational/logger';
import { wrapToolHandler } from '@oaknational/sentry-mcp';
import type { RuntimeConfig } from './runtime-config.js';
import type { HttpObservability } from './observability/http-observability.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  listUniversalTools,
  createUniversalToolExecutor,
  createStubToolExecutionAdapter,
  generatedToolRegistry,
  isAppToolEntry,
  type SearchRetrievalService,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';
import {
  readBuiltWidgetHtml,
  registerAllResources,
  registerPrompts,
} from './register-resources.js';
import {
  createDefaultRequestExecutor,
  createStubRequestExecutor,
} from './tool-executor-factory.js';
import type { ToolHandlerDependencies, ToolHandlerOverrides } from './tool-handler-types.js';

export type { ToolHandlerDependencies, ToolHandlerOverrides } from './tool-handler-types.js';
export { createMcpHandler } from './mcp-handler.js';
export type { McpHandlerRequest, McpHandlerResponse } from './mcp-handler.js';

export interface RegisterHandlersOptions {
  readonly overrides?: ToolHandlerOverrides;
  readonly runtimeConfig: RuntimeConfig;
  readonly logger: Logger;
  readonly observability: HttpObservability;
  readonly resourceUrl?: string;
  /** Pre-created search retrieval service (shared across per-request servers). */
  readonly searchRetrieval: SearchRetrievalService;
  /** Factory for generating signed asset download URLs (HTTP-only). */
  readonly createAssetDownloadUrl?: (lesson: string, type: string) => string;
}

function buildToolHandlerDependencies(
  resourceUrl: string,
  overrides: ToolHandlerOverrides | undefined,
  searchRetrieval: SearchRetrievalService,
  stubExecutor: ReturnType<typeof createStubToolExecutionAdapter> | undefined,
): ToolHandlerDependencies {
  const createRequestExecutor: ToolHandlerDependencies['createRequestExecutor'] = stubExecutor
    ? (config) =>
        createStubRequestExecutor({
          factoryConfig: { ...config, searchRetrieval },
          stubExecutor,
          createExecutor: createUniversalToolExecutor,
        })
    : (config) =>
        createDefaultRequestExecutor({
          ...config,
          searchRetrieval,
          createClient: createOakPathBasedClient,
          executeToolCall,
          createExecutor: createUniversalToolExecutor,
        });

  const defaults: ToolHandlerDependencies = {
    createRequestExecutor,
    getResourceUrl: () => resourceUrl,
  };
  if (!overrides) {
    return defaults;
  }
  return {
    createRequestExecutor: overrides.createRequestExecutor ?? defaults.createRequestExecutor,
    getResourceUrl: overrides.getResourceUrl ?? defaults.getResourceUrl,
  };
}

/**
 * Registers all MCP tools, resources, and prompts with the server.
 *
 * @param server - MCP server instance
 * @param options - Registration options including runtime config and logger
 */
export function registerHandlers(
  server: Pick<McpServer, 'registerTool' | 'registerResource' | 'registerPrompt'>,
  options: RegisterHandlersOptions,
): void {
  const resourceUrl = options.resourceUrl ?? 'http://localhost:3333/mcp';
  const stubExecutor = options.runtimeConfig.useStubTools
    ? createStubToolExecutionAdapter()
    : undefined;
  const deps = buildToolHandlerDependencies(
    resourceUrl,
    options.overrides,
    options.searchRetrieval,
    stubExecutor,
  );

  registerTools(server, deps, options);

  registerAllResources(server, {
    observability: options.observability,
    getWidgetHtml: readBuiltWidgetHtml,
  });
  registerPrompts(server, options.observability);
}

/** Iterates over universal tools and registers each with the server. */
function registerTools(
  server: Pick<McpServer, 'registerTool'>,
  deps: ToolHandlerDependencies,
  options: RegisterHandlersOptions,
): void {
  const mcpObservation = options.observability.createMcpObservationOptions();

  for (const tool of listUniversalTools(generatedToolRegistry)) {
    const wrappedHandler = wrapToolHandler(
      tool.name,
      async (params: unknown, extra: Parameters<ToolCallback>[0]) => {
        return handleToolWithAuthInterception({
          tool,
          params,
          deps,
          logger: options.logger,
          apiKey: options.runtimeConfig.env.OAK_API_KEY,
          runtimeConfig: options.runtimeConfig,
          createAssetDownloadUrl: options.createAssetDownloadUrl,
          authInfo: extra.authInfo,
        });
      },
      mcpObservation,
    );

    const config = {
      title: tool.title,
      description: tool.description,
      inputSchema: tool.inputSchema,
      annotations: tool.annotations,
    };

    if (isAppToolEntry(tool)) {
      registerAppTool(server, tool.name, { ...config, _meta: { ...tool._meta } }, wrappedHandler);
    } else {
      server.registerTool(tool.name, { ...config, _meta: tool._meta }, wrappedHandler);
    }
  }
}
