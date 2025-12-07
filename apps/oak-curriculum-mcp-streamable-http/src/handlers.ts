import type express from 'express';
import type { IncomingMessage } from 'node:http';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Logger } from '@oaknational/mcp-logger';

import type { RuntimeConfig } from './runtime-config.js';
import { extractCorrelationId, createChildLogger } from './logging/index.js';
import { setRequestContext } from './request-context.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  zodRawShapeFromToolInputJsonSchema,
  listUniversalTools,
  createUniversalToolExecutor,
  createStubToolExecutionAdapter,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';
import { registerAllResources, registerPrompts } from './register-resources.js';

export interface ToolHandlerDependencies {
  readonly createClient: typeof createOakPathBasedClient;
  readonly executeMcpTool: typeof executeToolCall;
  readonly createExecutor: typeof createUniversalToolExecutor;
  readonly getResourceUrl: () => string;
}

export type ToolHandlerOverrides = Partial<ToolHandlerDependencies>;

export interface RegisterHandlersOptions {
  readonly overrides?: ToolHandlerOverrides;
  readonly runtimeConfig: RuntimeConfig;
  readonly logger: Logger;
  readonly resourceUrl?: string;
}

/**
 * Type alias for McpServer, exported for use in tests and tool handlers.
 * @public
 */
export type ToolRegistrationServer = McpServer;

/**
 * Build dependencies for tool handlers, merging defaults with overrides.
 *
 * @param resourceUrl - Base URL for resources
 * @param overrides - Optional dependency overrides
 * @returns Complete dependencies for tool handlers
 */
function buildToolHandlerDependencies(
  resourceUrl: string,
  overrides: ToolHandlerOverrides | undefined,
): ToolHandlerDependencies {
  const defaultDependencies: ToolHandlerDependencies = {
    createClient: createOakPathBasedClient,
    executeMcpTool: executeToolCall,
    createExecutor: createUniversalToolExecutor,
    getResourceUrl: () => resourceUrl,
  };

  return {
    ...defaultDependencies,
    ...(overrides ?? {}),
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
  const deps = buildToolHandlerDependencies(resourceUrl, options.overrides);
  const stubExecutor = options.runtimeConfig.useStubTools
    ? createStubToolExecutionAdapter()
    : undefined;

  for (const tool of listUniversalTools()) {
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

  registerAllResources(server);
  registerPrompts(server);
}

/**
 * Creates an MCP request handler with correlation ID support.
 *
 * @param transport - MCP server transport
 * @param logger - Base logger instance
 * @returns Express request handler for MCP protocol
 *
 * @public
 */
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

export function createMcpHandler(
  transport: StreamableHTTPServerTransport,
  logger?: Logger,
): (req: express.Request, res: express.Response) => Promise<void> {
  return async (req: express.Request, res: express.Response) => {
    // Extract correlation ID and create correlated logger if available
    const correlationId = extractCorrelationId(res);
    const mcpMethod = extractMcpMethod(req.body);

    if (logger && correlationId) {
      const correlatedLogger = createChildLogger(logger, correlationId);
      correlatedLogger.debug('MCP request received', {
        method: req.method,
        path: req.path,
        mcpMethod,
      });
    }

    // Adapt Express Request to IncomingMessage, omitting Clerk's auth property
    // to avoid type conflict with MCP SDK's AuthInfo type. We use AsyncLocalStorage
    // for our auth flow, so the auth property is not needed by the MCP SDK.
    const mcpRequest = createMcpRequest(req);

    // Wrap transport.handleRequest with setRequestContext to propagate Express request
    // to tool handlers via AsyncLocalStorage. This enables getRequestContext() to work
    // in checkMcpClientAuth for tool-level authentication.
    await setRequestContext(req, async () => {
      await transport.handleRequest(mcpRequest, res, req.body);
    });

    if (logger && correlationId) {
      const correlatedLogger = createChildLogger(logger, correlationId);
      correlatedLogger.debug('MCP request completed', {
        statusCode: res.statusCode,
        mcpMethod,
      });
    }
  };
}
