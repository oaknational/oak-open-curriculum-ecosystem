import type express from 'express';
import type { IncomingMessage } from 'node:http';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Logger } from '@oaknational/mcp-logger';

import type { RuntimeConfig } from './runtime-config.js';
import type { McpServerFactory } from './mcp-request-context.js';
import { extractCorrelationId, createChildLogger } from './logging/index.js';
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
  readonly resourceUrl?: string;
  /** Pre-created search retrieval service (shared across per-request servers). */
  readonly searchRetrieval: SearchRetrievalService;
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
    server.registerTool(tool.name, config, async (params: unknown) => {
      return handleToolWithAuthInterception(
        tool,
        params,
        deps,
        stubExecutor,
        options.logger,
        options.runtimeConfig.env.OAK_API_KEY,
        options.runtimeConfig,
      );
    });
  }

  registerAllResources(server, { widgetDomain: deriveWidgetDomain(options.runtimeConfig) });
  registerPrompts(server);
}

/**
 * Adapts Express Request for MCP SDK transport by omitting Clerk's auth property.
 *
 * ## Type System Conflict
 *
 * We're bridging two incompatible library type systems:
 * - Clerk middleware adds `auth: MachineAuthObject` to Express Request (globally)
 * - MCP SDK transport expects `IncomingMessage & { auth?: AuthInfo }`
 *
 * These `auth` property types are incompatible and neither library is under our control.
 *
 * ## Why This Approach
 *
 * 1. Express Request extends IncomingMessage (structurally compatible)
 * 2. We use AsyncLocalStorage for our auth flow, so MCP SDK doesn't need the auth property
 * 3. Omitting the auth property via Proxy avoids the type conflict
 * 4. At runtime, the Proxy delegates all IncomingMessage properties correctly
 *
 * ## Type Assertion Justification
 *
 * The final type assertion is necessary because:
 * - Proxy<T> is not assignable to T in TypeScript's type system
 * - We cannot construct a real IncomingMessage (it's a Node.js class)
 * - We cannot change Clerk or MCP SDK types
 * - Runtime behavior is safe: Proxy delegates to Express Request which IS an IncomingMessage
 *
 * This is a documented architectural bridge between incompatible library types,
 * not a shortcut to hide type errors in our code.
 *
 * @param req - Express request with Clerk auth
 * @returns Proxy behaving as IncomingMessage without Clerk auth property
 */
function createMcpRequest(req: express.Request): IncomingMessage {
  // Proxy delegates to Express Request (which extends IncomingMessage) but omits 'auth'
  const proxy = new Proxy(req, {
    get(target, prop) {
      if (prop === 'auth') {
        return undefined; // Omit Clerk's auth to avoid type conflict
      }
      // Type guard: ensure prop exists on target before access
      if (typeof prop === 'string' && prop in target) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/consistent-type-assertions -- Proxy get handler for architectural bridge (see function documentation)
        return target[prop as keyof express.Request];
      }
      return undefined;
    },
    has(target, prop) {
      if (prop === 'auth') {
        return false; // Report auth as not present
      }
      return prop in target;
    },
  });

  // Type assertion: Proxy<Request> → IncomingMessage
  // Safe at runtime because Express Request extends IncomingMessage
  // and we only omit the conflicting auth property
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Architectural bridge between Clerk and MCP SDK types (see function documentation)
  return proxy as unknown as IncomingMessage;
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

    await setRequestContext(req, async () => {
      await transport.handleRequest(mcpRequest, res, req.body);
    });

    // Clean up per-request resources after the response completes
    res.on('close', () => {
      Promise.resolve()
        .then(() => transport.close())
        .then(() => server.close())
        .catch((err: unknown) => {
          logger?.error('MCP per-request cleanup failed', { error: err });
        });
    });

    log?.debug('MCP request completed', { statusCode: res.statusCode, mcpMethod });
  };
}
