/**
 * Method-aware MCP routing middleware.
 *
 * Routes MCP requests based on method classification and tool security metadata,
 * conditionally applying authentication middleware.
 *
 * ## Auth Model
 *
 * Per MCP spec and OpenAI Apps docs, there are two auth layers:
 * 1. **HTTP 401** - For unauthenticated requests (no/invalid token)
 * 2. **Tool _meta** - For scope issues after authentication
 *
 * This router applies HTTP auth middleware BEFORE the request reaches the SDK,
 * allowing HTTP 401 responses for protected tools without valid tokens.
 */

import type { RequestHandler } from 'express';
import { getResourceUriFromBody } from './auth/mcp-body-parser.js';
import { isPublicResourceUri } from './auth/public-resources.js';

/**
 * Configuration options for MCP router.
 */
export interface McpRouterOptions {
  /**
   * Authentication middleware to apply when auth is required.
   * Typically `createMcpAuthClerk(logger)` or similar OAuth middleware factory.
   * This middleware MUST return HTTP 401 + WWW-Authenticate for auth failures.
   */
  readonly auth: RequestHandler;
}

/**
 * Type guard for object with method property.
 */
function hasMethod(value: unknown): value is { method: unknown } {
  return typeof value === 'object' && value !== null && 'method' in value;
}

/**
 * Extract method from request body or query with type safety.
 *
 * Handles both POST (method in body) and GET (method in query params).
 */
function getMethodFromRequest(req: { body?: unknown; query?: unknown }): string | undefined {
  if (hasMethod(req.body) && typeof req.body.method === 'string') {
    return req.body.method;
  }
  if (hasMethod(req.query) && typeof req.query.method === 'string') {
    return req.query.method;
  }
  return undefined;
}

/**
 * Determines if a request should skip auth entirely.
 *
 * Only public resource reads (widget HTML, documentation) skip auth.
 * All MCP methods including discovery require auth per MCP 2025-11-25.
 *
 * @param method - MCP method from request
 * @param body - Request body for extracting resource URI
 * @returns true if auth should be skipped
 */
function shouldSkipAuth(method: string | undefined, body: unknown): boolean {
  if (method === 'resources/read') {
    const uri = getResourceUriFromBody(body);
    if (uri && isPublicResourceUri(uri)) {
      return true;
    }
  }
  return false;
}

/**
 * Creates method-aware MCP routing middleware.
 *
 * Per MCP 2025-11-25: "Authorization MUST be included in every HTTP request
 * from client to server." All MCP methods go through auth. The only exception
 * is public resource reads (widget HTML, documentation) which contain no
 * user-specific data.
 *
 * **Key Behaviour**: This middleware runs BEFORE the MCP SDK, allowing
 * HTTP 401 responses per MCP spec. The SDK always returns HTTP 200.
 *
 * @param options - Router configuration with auth middleware
 * @returns Express middleware that conditionally applies auth
 *
 * @example
 * ```typescript
 * const mcpRouter = createMcpRouter({ auth: createMcpAuthClerk(logger) });
 * app.post('/mcp', mcpRouter, createMcpHandler(coreTransport, log));
 * ```
 *
 * @public
 */
export function createMcpRouter(options: McpRouterOptions): RequestHandler {
  return (req, res, next) => {
    const method = getMethodFromRequest(req);

    if (shouldSkipAuth(method, req.body)) {
      next();
      return;
    }

    options.auth(req, res, next);
  };
}
