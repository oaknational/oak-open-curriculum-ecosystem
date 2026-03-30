/**
 * Per-request MCP HTTP handler factory.
 *
 * Creates a handler that implements the stateless per-request pattern: each
 * HTTP request creates a fresh `McpServer` + `StreamableHTTPServerTransport`,
 * connects them, and delegates to `transport.handleRequest()`.
 *
 * Auth flows natively via `req.auth` (set by `mcpAuth` middleware) →
 * the MCP SDK transport propagates it as `extra.authInfo` to tool callbacks.
 *
 * @see ADR-112, MCP SDK simpleStatelessStreamableHttp.ts
 */

import { normalizeError } from '@oaknational/logger';
import type { Logger } from '@oaknational/logger';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { McpServerFactory } from './mcp-request-context.js';
import { createChildLogger } from './logging/index.js';
import type { HttpObservability } from './observability/http-observability.js';

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
 * Per-request MCP handler (stateless pattern).
 *
 * Uses narrow request/response interfaces so test fakes satisfy the types
 * structurally without assertions (ADR-078).
 */
export function createMcpHandler(
  mcpFactory: McpServerFactory,
  observability: HttpObservability,
  logger?: Logger,
): (req: McpHandlerRequest, res: McpHandlerResponse) => Promise<void> {
  return async (req: McpHandlerRequest, res: McpHandlerResponse) => {
    const correlationId: unknown = res.locals['correlationId'];
    const log =
      logger && typeof correlationId === 'string'
        ? createChildLogger(logger, correlationId)
        : undefined;
    const mcpMethod = extractMcpMethod(req.body);
    log?.debug('MCP request received', { method: req.method, path: req.path, mcpMethod });

    const { server, transport } = mcpFactory();
    await server.connect(transport);

    // Clean up per-request resources after the response completes.
    // Defence-in-depth: clear auth data from the request object.
    res.on('close', () => {
      req.auth = undefined;
      void Promise.allSettled([transport.close(), server.close()]).then((results) => {
        for (const result of results) {
          if (result.status === 'rejected') {
            const error: unknown = result.reason;
            log?.error('MCP per-request cleanup failed', normalizeError(error), {
              method: req.method,
              path: req.path,
            });
            observability.captureHandledError(error, {
              boundary: 'mcp_cleanup',
              method: req.method,
              path: req.path,
            });
          }
        }
      });
    });

    await observability.withSpan({
      name: 'oak.http.request.mcp',
      attributes: {
        ...(req.method !== undefined ? { 'http.method': req.method } : {}),
        'http.route': req.path,
      },
      run: async () => {
        await transport.handleRequest(req, res, req.body);
      },
    });

    log?.debug('MCP request completed', { statusCode: res.statusCode, mcpMethod });
  };
}
