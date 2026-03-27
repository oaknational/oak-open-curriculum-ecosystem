import type express from 'express';
import type { IncomingMessage } from 'node:http';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { Logger } from '@oaknational/logger';

import type { RuntimeConfig } from './runtime-config.js';
import type { McpServerFactory } from './mcp-request-context.js';
import { extractCorrelationId, createChildLogger } from './logging/index.js';
import { getAuth } from '@clerk/express';
import { verifyClerkToken } from '@clerk/mcp-tools/server';
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
 * Extracts verified AuthInfo at the ingress edge.
 *
 * Calls Clerk's `getAuth` + `verifyClerkToken` to produce the MCP SDK's
 * `AuthInfo` object. Returns `undefined` if the request has no Bearer token
 * or if verification fails.
 *
 * ## Security Design Note
 *
 * This function returns `undefined` in two semantically different cases:
 *
 * 1. **No Bearer token** — expected for unauthenticated requests
 * 2. **Token present but Clerk verification threw** — internal inconsistency,
 *    because the `mcpAuth` HTTP middleware has already verified the token
 *    and returned 401 on failure before this code runs
 *
 * Case 2 is logged at `warn` level to surface inconsistencies. The security
 * boundary holds regardless: `checkMcpClientAuth` rejects `authInfo: undefined`
 * for any tool that requires auth, so no protected tool executes without a
 * verified token. The client receives a tool-level auth error rather than
 * HTTP 401, which may prevent MCP clients from triggering their OAuth
 * re-authentication flow — this is an acceptable degraded posture since the
 * upstream middleware already handled the canonical 401 path.
 *
 * This is the single point where Clerk interaction happens in the MCP tool
 * path — downstream code receives the typed `AuthInfo` without needing
 * Clerk imports.
 */
function extractAuthInfoAtIngress(req: express.Request, logger?: Logger): AuthInfo | undefined {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return undefined;
  }
  const token = authHeader.substring('Bearer '.length);

  try {
    const clerkAuth = getAuth(req, { acceptsToken: 'oauth_token' });
    return verifyClerkToken(clerkAuth, token);
  } catch (error) {
    // Token IS present but verification threw — this should not happen because
    // mcpAuth middleware already verified the token at the HTTP layer. Log at
    // warn to surface the inconsistency.
    logger?.warn('Auth extraction at ingress failed (token present but verification threw)', {
      error: error instanceof Error ? error.message : String(error),
    });
    return undefined;
  }
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
 * Extracts `AuthInfo` at the ingress edge and sets it on `req.auth` so the
 * MCP SDK's `StreamableHTTPServerTransport.handleRequest()` reads it and
 * propagates it as `extra.authInfo` to tool callbacks. This replaces the
 * previous `Proxy` + `AsyncLocalStorage` bridge with one explicit auth flow.
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

    // Extract AuthInfo at the ingress edge and set it on the request so the
    // MCP SDK's StreamableHTTPServerTransport reads it via req.auth and
    // propagates it as extra.authInfo to tool callbacks.
    const authInfo = extractAuthInfoAtIngress(req, log);
    // Bridge Clerk → MCP SDK: overwrite Clerk's callable req.auth with the
    // MCP SDK's AuthInfo object so transport.handleRequest reads it correctly.
    // After this point, no code should call getAuth(req) — the tool path uses
    // the explicit AuthInfo parameter via extra.authInfo.
    //
    // Type assertion justification: Express Request extends IncomingMessage
    // (structurally compatible). Clerk's global augmentation of `auth` is a
    // callable, but we replace it at runtime with AuthInfo before passing to
    // the SDK. This is the documented ingress boundary between two incompatible
    // library type systems (Clerk and MCP SDK).
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Bridging Clerk (callable auth) → MCP SDK (AuthInfo object) at the ingress boundary
    const mcpRequest = req as unknown as IncomingMessage & { auth?: AuthInfo };
    mcpRequest.auth = authInfo;

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
