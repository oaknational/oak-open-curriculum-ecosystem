/**
 * MCP handler factory and tool registration.
 *
 * Implements the stateless per-request pattern: each HTTP request creates a
 * fresh `McpServer` + `StreamableHTTPServerTransport`, connects them, and
 * delegates to `transport.handleRequest()`. Auth flows natively via `req.auth`
 * (set by `mcpAuth` middleware) → `extra.authInfo` in tool callbacks.
 *
 * Tool registration iterates over the SDK's universal tool registry and
 * registers each tool with its canonical projection config.
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Logger } from '@oaknational/logger';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { RuntimeConfig } from './runtime-config.js';
import type { McpServerFactory } from './mcp-request-context.js';
import { createChildLogger } from './logging/index.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  listUniversalTools,
  createUniversalToolExecutor,
  createStubToolExecutionAdapter,
  generatedToolRegistry,
  toRegistrationConfig,
  type SearchRetrievalService,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';
import { registerAllResources, registerPrompts } from './register-resources.js';
import {
  createDefaultRequestExecutor,
  createStubRequestExecutor,
} from './tool-executor-factory.js';
import type { ToolHandlerDependencies, ToolHandlerOverrides } from './tool-handler-types.js';

export type { ToolHandlerDependencies, ToolHandlerOverrides } from './tool-handler-types.js';

export interface RegisterHandlersOptions {
  readonly overrides?: ToolHandlerOverrides;
  readonly runtimeConfig: RuntimeConfig;
  readonly logger: Logger;
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
          factoryConfig: config,
          stubExecutor,
          createExecutor: createUniversalToolExecutor,
        })
    : (config) =>
        createDefaultRequestExecutor({
          ...config,
          createClient: createOakPathBasedClient,
          executeToolCall,
          createExecutor: createUniversalToolExecutor,
        });

  const defaults: ToolHandlerDependencies = {
    createRequestExecutor,
    getResourceUrl: () => resourceUrl,
    searchRetrieval,
  };
  if (!overrides) {
    return defaults;
  }
  return {
    createRequestExecutor: overrides.createRequestExecutor ?? defaults.createRequestExecutor,
    getResourceUrl: overrides.getResourceUrl ?? defaults.getResourceUrl,
    searchRetrieval: overrides.searchRetrieval ?? defaults.searchRetrieval,
  };
}

/**
 * Registers all MCP tools with the server.
 *
 * Iterates over universal tools (generated + aggregated) and registers each
 * with proper configuration including Zod schemas with parameter descriptions.
 *
 * @param server - MCP server instance
 * @param options - Registration options including runtime config and logger
 */
export function registerHandlers(server: McpServer, options: RegisterHandlersOptions): void {
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

  for (const tool of listUniversalTools(generatedToolRegistry)) {
    const config = toRegistrationConfig(tool);
    server.registerTool(tool.name, config, async (params: unknown, extra) => {
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
    });
  }

  registerAllResources(server);
  registerPrompts(server);
}

/**
 * Type guard for object with method property.
 */
function hasMethodProperty(value: unknown): value is { method: unknown } {
  return typeof value === 'object' && value !== null && 'method' in value;
}

/**
 * Extracts MCP method from JSON-RPC request body for logging.
 * Returns undefined if body is not a valid JSON-RPC request.
 */
function extractMcpMethod(body: unknown): string | undefined {
  if (hasMethodProperty(body) && typeof body.method === 'string') {
    return body.method;
  }
  return undefined;
}

/**
 * Narrow request interface for `createMcpHandler`.
 *
 * Contains only the properties the handler accesses. Express `Request`
 * satisfies this structurally, so the handler can be used as middleware.
 * Test fakes satisfy it too — plain objects, no assertions.
 */
export interface McpHandlerRequest {
  /** HTTP headers. */
  readonly headers: Record<string, string | readonly string[] | undefined>;
  /** HTTP method (GET, POST, etc.). */
  readonly method?: string;
  /** URL path (e.g. '/mcp'). */
  readonly path: string;
  /** JSON-RPC request body (parsed by Express body-parser middleware). */
  body: unknown;
  /** Verified auth context, set by mcpAuth middleware. Mutable for cleanup. */
  auth?: AuthInfo;
}

/**
 * Narrow response interface for `createMcpHandler`.
 *
 * Contains only the properties the handler accesses. Express `Response`
 * satisfies this structurally.
 */
export interface McpHandlerResponse {
  /** HTTP status code. */
  readonly statusCode: number;
  /** Express locals — handler reads `correlationId` for logging. */
  locals: { correlationId?: string; [key: string]: unknown };
  /** Register event listeners (handler uses 'close' for cleanup). */
  on(event: string, listener: (...args: unknown[]) => void): unknown;
}

/**
 * Per-request MCP handler (stateless pattern).
 *
 * Auth flows natively via `req.auth` (set by `mcpAuth` middleware) →
 * the MCP SDK transport propagates it as `extra.authInfo` to tool callbacks.
 * Uses narrow request/response interfaces so test fakes satisfy the types
 * structurally without assertions (ADR-078).
 *
 * @see ADR-112, MCP SDK simpleStatelessStreamableHttp.ts
 */
export function createMcpHandler(
  mcpFactory: McpServerFactory,
  logger?: Logger,
): (req: McpHandlerRequest, res: McpHandlerResponse) => Promise<void> {
  return async (req: McpHandlerRequest, res: McpHandlerResponse) => {
    const correlationId: unknown = res.locals?.['correlationId'];
    const log =
      logger && typeof correlationId === 'string'
        ? createChildLogger(logger, correlationId)
        : undefined;
    const mcpMethod = extractMcpMethod(req.body);
    log?.debug('MCP request received', { method: req.method, path: req.path, mcpMethod });

    const { server, transport } = mcpFactory();
    await server.connect(transport);

    await transport.handleRequest(req, res, req.body);

    // Clean up per-request resources after the response completes.
    // Defence-in-depth: clear auth data from the request object.
    res.on('close', () => {
      req.auth = undefined;
      void Promise.allSettled([transport.close(), server.close()]).then((results) => {
        for (const result of results) {
          if (result.status === 'rejected') {
            const error: unknown = result.reason;
            log?.error('MCP per-request cleanup failed', { error });
          }
        }
      });
    });

    log?.debug('MCP request completed', { statusCode: res.statusCode, mcpMethod });
  };
}
