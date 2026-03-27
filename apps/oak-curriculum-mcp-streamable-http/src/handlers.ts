import type express from 'express';
import type { IncomingMessage } from 'node:http';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Logger } from '@oaknational/logger';
import { z } from 'zod';

import type { RuntimeConfig } from './runtime-config.js';
import type { McpServerFactory } from './mcp-request-context.js';
import { extractCorrelationId, createChildLogger } from './logging/index.js';
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
  /** Factory for generating signed asset download URLs (HTTP-only). */
  readonly createAssetDownloadUrl?: (lesson: string, type: string) => string;
}

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

/**
 * Zod schema for the MCP SDK's AuthInfo type.
 *
 * Validates auth data read from `res.locals.authInfo` at the Express/MCP
 * boundary. Replaces a bare type assertion with runtime validation so that
 * malformed auth data is caught immediately rather than propagated silently.
 *
 * Uses `.loose()` to avoid stripping fields that future SDK versions might
 * add. The `resource` field validates `URL` instances per the SDK interface.
 * Verified: `@clerk/mcp-tools@0.3.1` `verifyClerkToken` never sets
 * `resource` (returns only token, clientId, scopes, extra). The field is
 * included for completeness and forward compatibility.
 */
const authInfoSchema = z
  .object({
    token: z.string(),
    clientId: z.string(),
    scopes: z.array(z.string()),
    expiresAt: z.number().optional(),
    resource: z.instanceof(URL).optional(),
    extra: z.record(z.string(), z.unknown()).optional(),
  })
  .loose();

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
    const config = toRegistrationConfig(tool);
    server.registerTool(tool.name, config, async (params: unknown, extra) => {
      return handleToolWithAuthInterception({
        tool,
        params,
        deps,
        stubExecutor,
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
 * Express handler using per-request MCP server + transport (stateless pattern).
 *
 * Reads verified `AuthInfo` from `res.locals.authInfo` (set by `mcpAuth`
 * middleware) and sets it on `req.auth` so the MCP SDK's
 * `StreamableHTTPServerTransport.handleRequest()` propagates it as
 * `extra.authInfo` to tool callbacks. No Clerk imports — auth verification
 * happens once in the middleware, and the handler is pure composition.
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

    // Read verified AuthInfo from res.locals (set by mcpAuth middleware).
    // When auth is disabled (DANGEROUSLY_DISABLE_AUTH), middleware is skipped
    // and res.locals.authInfo is undefined — tools requiring auth will reject.
    // Zod validates the boundary: malformed auth data throws immediately rather
    // than propagating silently through the MCP SDK.
    const authInfo =
      res.locals.authInfo == null ? undefined : authInfoSchema.parse(res.locals.authInfo);

    // Bridge Express → MCP SDK: the SDK's handleRequest expects
    // IncomingMessage & { auth?: AuthInfo }. Express.Request extends
    // IncomingMessage; Object.assign sets auth without type assertions.
    // NOTE: This mutates req in place (Object.assign returns the same object).
    // This is intentional and safe in the per-request stateless architecture
    // — no downstream handler reads this mutation.
    const baseReq: IncomingMessage = req;
    const mcpRequest = Object.assign(baseReq, { auth: authInfo });

    await transport.handleRequest(mcpRequest, res, req.body);

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
