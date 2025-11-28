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
 *
 * @module
 */

import type { RequestHandler } from 'express';
import { isDiscoveryMethod } from './mcp-method-classifier.js';
import { toolRequiresAuth } from './tool-auth-checker.js';
import {
  isUniversalToolName,
  type UniversalToolName,
} from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';

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
 * Type guard for object with params property.
 */
function hasParams(value: unknown): value is { params: unknown } {
  return typeof value === 'object' && value !== null && 'params' in value;
}

/**
 * Type guard for params object with name property.
 */
function hasName(value: unknown): value is { name: unknown } {
  return typeof value === 'object' && value !== null && 'name' in value;
}

/**
 * Extract method from request body or query with type safety.
 *
 * Handles both POST (method in body) and GET (method in query params).
 */
function getMethodFromRequest(req: { body?: unknown; query?: unknown }): string | undefined {
  // Try body first (POST requests)
  if (hasMethod(req.body) && typeof req.body.method === 'string') {
    return req.body.method;
  }
  // Fall back to query (GET requests)
  if (hasMethod(req.query) && typeof req.query.method === 'string') {
    return req.query.method;
  }
  return undefined;
}

/**
 * Extract tool name from request body params with type safety.
 *
 * Note: UniversalToolName is a generated union type from the OpenAPI schema.
 * We cannot create a runtime type guard for it, so we assert that any string
 * from req.body.params.name conforms to UniversalToolName. Invalid tool names
 * will be handled by toolRequiresAuth() which checks against known tools.
 */
function getToolNameFromBody(body: unknown): UniversalToolName | undefined {
  if (hasParams(body) && hasName(body.params) && typeof body.params.name === 'string') {
    const maybeToolName = body.params.name;
    if (isUniversalToolName(maybeToolName)) {
      return maybeToolName;
    }
  }
  return undefined;
}

/**
 * Creates method-aware MCP routing middleware.
 *
 * Routes MCP requests based on method classification and tool security:
 * - Discovery methods (initialize, tools/list): Skip auth
 * - Execution methods (tools/call): Check tool's securitySchemes
 *   - OAuth2 tools: Require auth (HTTP 401 if missing)
 *   - NoAuth tools: Skip auth
 * - Unknown methods: Require auth (safe default)
 *
 * **Key Behavior**: This middleware runs BEFORE the MCP SDK, allowing
 * HTTP 401 responses per MCP spec. The SDK always returns HTTP 200.
 *
 * **Architecture**: This middleware wraps existing auth middleware without
 * modifying it. It reads method/tool from req.body, delegates to pure
 * classification functions, and conditionally applies auth based on
 * generated security metadata.
 *
 * @param options - Router configuration with auth middleware
 * @returns Express middleware that conditionally applies auth
 *
 * @example
 * ```typescript
 * // Wire into Express app
 * const mcpRouter = createMcpRouter({ auth: createMcpAuthClerk(logger) });
 * app.post('/mcp', mcpRouter, createMcpHandler(coreTransport, log));
 * ```
 *
 * @see isDiscoveryMethod for MCP method classification
 * @see toolRequiresAuth for tool security metadata reading
 *
 * @public
 */
export function createMcpRouter(options: McpRouterOptions): RequestHandler {
  return (req, res, next) => {
    const method = getMethodFromRequest(req);
    const toolName = getToolNameFromBody(req.body);

    // Discovery methods: always skip auth
    // These must work without authentication per OpenAI ChatGPT requirements
    if (method && isDiscoveryMethod(method)) {
      next();
      return;
    }

    // Execution methods: check tool security metadata
    if (method === 'tools/call' && toolName) {
      if (toolRequiresAuth(toolName)) {
        // OAuth tool: delegate to auth middleware (may return HTTP 401)
        options.auth(req, res, next);
      } else {
        // Public tool: skip auth
        next();
      }
      return;
    }

    // Unknown/malformed: require auth (safe default)
    // If we can't determine the method or tool, fail safe by requiring auth
    options.auth(req, res, next);
  };
}
