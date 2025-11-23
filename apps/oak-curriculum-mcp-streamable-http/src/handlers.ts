import type express from 'express';
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

/**
 * Minimal interface for registering MCP tools.
 * Enables dependency injection and testability.
 * McpServer from MCP SDK satisfies this interface.
 */
export type ToolRegistrationServer = Pick<McpServer, 'registerTool'>;

export interface ToolHandlerDependencies {
  readonly createClient: typeof createOakPathBasedClient;
  readonly executeMcpTool: typeof executeToolCall;
  readonly createExecutor: typeof createUniversalToolExecutor;
  readonly getResourceUrl: () => string;
}

interface DefaultDependencies {
  readonly createClient: typeof createOakPathBasedClient;
  readonly executeMcpTool: typeof executeToolCall;
  readonly createExecutor: typeof createUniversalToolExecutor;
}

const defaultDependencies: DefaultDependencies = {
  createClient: createOakPathBasedClient,
  executeMcpTool: executeToolCall,
  createExecutor: createUniversalToolExecutor,
};

export type ToolHandlerOverrides = Partial<ToolHandlerDependencies>;

export interface RegisterHandlersOptions {
  readonly overrides?: ToolHandlerOverrides;
  readonly runtimeConfig: RuntimeConfig;
  readonly logger: Logger;
  readonly resourceUrl?: string;
}

export function registerHandlers(
  server: ToolRegistrationServer,
  options: RegisterHandlersOptions,
): void {
  const deps: ToolHandlerDependencies = {
    ...defaultDependencies,
    getResourceUrl: () => options.resourceUrl ?? 'https://curriculum-mcp.thenational.academy/mcp',
    ...(options.overrides ?? {}),
  };
  const stubExecutor = options.runtimeConfig.useStubTools
    ? createStubToolExecutionAdapter()
    : undefined;
  const tools = listUniversalTools();
  for (const tool of tools) {
    const input = zodRawShapeFromToolInputJsonSchema(tool.inputSchema);
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

    await transport.handleRequest(req, res, req.body);

    if (logger && correlationId) {
      const correlatedLogger = createChildLogger(logger, correlationId);
      correlatedLogger.debug('MCP request completed', {
        statusCode: res.statusCode,
      });
    }
  };
}
