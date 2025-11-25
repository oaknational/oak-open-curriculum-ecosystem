import type express from 'express';
import type { IncomingMessage } from 'node:http';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Logger } from '@oaknational/mcp-logger';

import type { RuntimeConfig } from './runtime-config.js';
import { extractCorrelationId, createChildLogger } from './logging/index.js';
import {
  createOakPathBasedClient,
  executeToolCall,
  zodRawShapeFromToolInputJsonSchema,
  listUniversalTools,
  createUniversalToolExecutor,
  createStubToolExecutionAdapter,
} from '@oaknational/oak-curriculum-sdk';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';

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

export function registerHandlers(server: McpServer, options: RegisterHandlersOptions): void {
  const resourceUrl = options.resourceUrl ?? 'http://localhost:3333/mcp';

  const defaultDependencies: ToolHandlerDependencies = {
    createClient: createOakPathBasedClient,
    executeMcpTool: executeToolCall,
    createExecutor: createUniversalToolExecutor,
    getResourceUrl: () => resourceUrl,
  };

  const deps: ToolHandlerDependencies = {
    ...defaultDependencies,
    ...(options.overrides ?? {}),
  };
  const useStubTools = options.runtimeConfig.useStubTools;
  const stubExecutor = useStubTools ? createStubToolExecutionAdapter() : undefined;
  const tools = listUniversalTools();
  for (const tool of tools) {
    const input = zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
    // Note: securitySchemes is supported by MCP runtime per OpenAI Apps SDK documentation
    // but not yet in MCP TypeScript SDK types (as of v1.20.1).
    // We pass it through and it will be accepted at runtime via JavaScript's dynamic nature.
    // See: https://platform.openai.com/docs/guides/apps-authentication
    const config = {
      title: tool.name,
      description: tool.description ?? tool.name,
      inputSchema: input,
      securitySchemes: tool.securitySchemes,
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

export function createMcpHandler(
  transport: StreamableHTTPServerTransport,
  logger?: Logger,
): (req: express.Request, res: express.Response) => Promise<void> {
  return async (req: express.Request, res: express.Response) => {
    // Extract correlation ID and create correlated logger if available
    const correlationId = extractCorrelationId(res);
    if (logger && correlationId) {
      const correlatedLogger = createChildLogger(logger, correlationId);
      correlatedLogger.debug('MCP request received', {
        method: req.method,
        path: req.path,
      });
    }

    // Adapt Express Request to IncomingMessage, omitting Clerk's auth property
    // to avoid type conflict with MCP SDK's AuthInfo type. We use AsyncLocalStorage
    // for our auth flow, so the auth property is not needed by the MCP SDK.
    const mcpRequest = createMcpRequest(req);
    await transport.handleRequest(mcpRequest, res, req.body);

    if (logger && correlationId) {
      const correlatedLogger = createChildLogger(logger, correlationId);
      correlatedLogger.debug('MCP request completed', {
        statusCode: res.statusCode,
      });
    }
  };
}
