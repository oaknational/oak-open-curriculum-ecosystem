import type express from 'express';
import type { IncomingMessage } from 'node:http';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { normalizeError } from '@oaknational/logger';
import type { Logger } from '@oaknational/logger';
import { wrapToolHandler } from '@oaknational/sentry-mcp';
import { typeSafeGet, typeSafeHas } from '@oaknational/type-helpers';

import type { RuntimeConfig } from './runtime-config.js';
import type { McpServerFactory } from './mcp-request-context.js';
import { extractCorrelationId, createChildLogger } from './logging/index.js';
import type { HttpObservability } from './observability/http-observability.js';
import { setRequestContext } from './request-context.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  zodRawShapeFromToolInputJsonSchema,
  listUniversalTools,
  createUniversalToolExecutor,
  createStubToolExecutionAdapter,
  generatedToolRegistry,
  type SearchRetrievalService,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';
import { registerAllResources, registerPrompts } from './register-resources.js';

export interface ToolHandlerDependencies {
  readonly createClient: typeof createOakPathBasedClient;
  readonly executeMcpTool: typeof executeToolCall;
  readonly createExecutor: typeof createUniversalToolExecutor;
  readonly getResourceUrl: () => string;
  readonly searchRetrieval: SearchRetrievalService;
}

export type ToolHandlerOverrides = Partial<ToolHandlerDependencies>;

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

/**
 * Type alias for McpServer, exported for use in tests and tool handlers.
 * @public
 */
export type ToolRegistrationServer = McpServer;

function mergeOverrides(
  defaults: ToolHandlerDependencies,
  overrides: ToolHandlerOverrides,
): ToolHandlerDependencies {
  return {
    createClient: overrides.createClient ?? defaults.createClient,
    executeMcpTool: overrides.executeMcpTool ?? defaults.executeMcpTool,
    createExecutor: overrides.createExecutor ?? defaults.createExecutor,
    getResourceUrl: overrides.getResourceUrl ?? defaults.getResourceUrl,
    searchRetrieval: overrides.searchRetrieval ?? defaults.searchRetrieval,
  };
}

function buildToolHandlerDependencies(
  resourceUrl: string,
  overrides: ToolHandlerOverrides | undefined,
  searchRetrieval: SearchRetrievalService,
): ToolHandlerDependencies {
  const defaults: ToolHandlerDependencies = {
    createClient: createOakPathBasedClient,
    executeMcpTool: executeToolCall,
    createExecutor: createUniversalToolExecutor,
    getResourceUrl: () => resourceUrl,
    searchRetrieval,
  };
  return overrides ? mergeOverrides(defaults, overrides) : defaults;
}
function deriveWidgetDomain(config: RuntimeConfig): string | undefined {
  return config.displayHostname ? `https://${config.displayHostname}` : undefined;
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
  const deps = buildToolHandlerDependencies(
    resourceUrl,
    options.overrides,
    options.searchRetrieval,
  );
  const stubExecutor = options.runtimeConfig.useStubTools
    ? createStubToolExecutionAdapter()
    : undefined;
  const mcpObservation = options.observability.createMcpObservationOptions();

  for (const tool of listUniversalTools(generatedToolRegistry)) {
    // Use generated Zod schema directly when available (includes .describe() for MCP clients).
    // Falls back to JSON Schema conversion for aggregated tools (search, fetch).
    const input = tool.flatZodSchema ?? zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
    const config = {
      title: tool.annotations?.title ?? tool.name,
      description: tool.description ?? tool.name,
      inputSchema: input,
      securitySchemes: tool.securitySchemes,
      annotations: tool.annotations,
    };
    server.registerTool(
      tool.name,
      config,
      wrapToolHandler(
        tool.name,
        async (params: unknown) => {
          return handleToolWithAuthInterception({
            tool,
            params,
            deps,
            stubExecutor,
            logger: options.logger,
            apiKey: options.runtimeConfig.env.OAK_API_KEY,
            runtimeConfig: options.runtimeConfig,
            createAssetDownloadUrl: options.createAssetDownloadUrl,
          });
        },
        mcpObservation,
      ),
    );
  }

  registerAllResources(server, {
    widgetDomain: deriveWidgetDomain(options.runtimeConfig),
    observability: options.observability,
  });
  registerPrompts(server, options.observability);
}

/**
 * Adapts Express Request for MCP SDK transport by omitting Clerk's auth property.
 *
 * Clerk middleware adds a callable `auth(options?)` to Express Request globally,
 * while MCP SDK expects `IncomingMessage & { auth?: AuthInfo }`. These are
 * incompatible. We use AsyncLocalStorage for auth, so the MCP SDK does not need
 * the auth property. The Proxy omits it, delegating all IncomingMessage
 * properties correctly at runtime.
 */
function createMcpRequest(req: express.Request): IncomingMessage {
  const incomingRequest: IncomingMessage = req;
  return new Proxy(incomingRequest, {
    get(target, prop): unknown {
      if (prop === 'auth') {
        return undefined;
      }
      if (typeof prop === 'string' && typeSafeHas(target, prop)) {
        return typeSafeGet(target, prop);
      }
      return undefined;
    },
    has(target, prop) {
      if (prop === 'auth') {
        return false;
      }
      return prop in target;
    },
  });
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
 * Express handler using per-request MCP server + transport (stateless pattern).
 *
 * @see ADR-112, MCP SDK simpleStatelessStreamableHttp.ts
 */
export function createMcpHandler(
  mcpFactory: McpServerFactory,
  observability: HttpObservability,
  logger?: Logger,
): (req: express.Request, res: express.Response) => Promise<void> {
  return async (req: express.Request, res: express.Response) => {
    const correlationId = extractCorrelationId(res);
    const log = logger && correlationId ? createChildLogger(logger, correlationId) : undefined;
    const mcpMethod = extractMcpMethod(req.body);
    log?.debug('MCP request received', { method: req.method, path: req.path, mcpMethod });

    // Create fresh server + transport for this request (stateless mode)
    const { server, transport } = mcpFactory();
    await server.connect(transport);
    const mcpRequest = createMcpRequest(req);

    res.on('close', () => {
      Promise.resolve()
        .then(() => transport.close())
        .then(() => server.close())
        .catch((err: unknown) => {
          logger?.error('MCP per-request cleanup failed', normalizeError(err), {
            method: req.method,
            path: req.path,
          });
          observability.captureHandledError(err, {
            boundary: 'mcp_cleanup',
            method: req.method,
            path: req.path,
          });
        });
    });

    await observability.withSpan({
      name: 'oak.http.request.mcp',
      attributes: {
        'http.method': req.method,
        'http.route': req.path,
      },
      run: async () => {
        await setRequestContext(req, async () => {
          await transport.handleRequest(mcpRequest, res, req.body);
        });
      },
    });

    log?.debug('MCP request completed', { statusCode: res.statusCode, mcpMethod });
  };
}
