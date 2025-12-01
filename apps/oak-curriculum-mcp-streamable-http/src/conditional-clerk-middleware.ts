/**
 * Conditional Clerk middleware that skips auth context setup for MCP discovery methods.
 *
 * ## Why This Exists
 *
 * The standard `clerkMiddleware()` runs on every request to set up auth context (~170ms overhead).
 * Discovery methods (initialize, tools/list, resources/list, prompts/list) don't need auth,
 * but the overhead adds up when ChatGPT makes ~28 requests on refresh.
 *
 * This middleware only runs clerkMiddleware for requests that might need auth,
 * reducing latency for discovery methods from ~175ms to ~5ms.
 *
 * ## MCP Discovery Methods
 *
 * Per MCP spec and OpenAI Apps docs, these methods must work without authentication:
 * - `initialize` - Server capability negotiation
 * - `tools/list` - Tool catalog discovery
 * - `resources/list` - Resource discovery
 * - `prompts/list` - Prompt discovery
 *
 * ## Security
 *
 * This is safe because:
 * 1. Discovery methods return public metadata, not protected data
 * 2. Tool execution (tools/call) still requires auth via createMcpAuthClerk
 * 3. The MCP router applies full auth checks for non-discovery methods
 *
 * @see https://modelcontextprotocol.io/specification/2025-06-18/basic/authorization
 */

import type { RequestHandler, Request, Response, NextFunction } from 'express';
import type { Logger } from '@oaknational/mcp-logger';
import { isDiscoveryMethod } from './mcp-method-classifier.js';

/**
 * MCP methods that can skip clerkMiddleware entirely.
 * These are discovery/metadata methods that don't access protected resources.
 */
const CLERK_SKIP_METHODS: ReadonlySet<string> = new Set([
  'initialize',
  'tools/list',
  'resources/list',
  'prompts/list',
  'resources/templates/list',
  'notifications/initialized', // Client notification, no auth needed
]);

/**
 * Paths that should always skip clerkMiddleware.
 * OAuth metadata endpoints must be publicly accessible per RFC 9728.
 */
const CLERK_SKIP_PATHS: ReadonlySet<string> = new Set([
  '/.well-known/oauth-protected-resource',
  '/.well-known/openid-configuration',
  '/health',
  '/ready',
]);

/**
 * Type guard for object with method property.
 */
function hasMethodProperty(value: unknown): value is { method: unknown } {
  return typeof value === 'object' && value !== null && 'method' in value;
}

/**
 * Extracts MCP method from request body.
 */
function getMcpMethodFromBody(body: unknown): string | undefined {
  if (hasMethodProperty(body) && typeof body.method === 'string') {
    return body.method;
  }
  return undefined;
}

/**
 * Minimal request interface for skip logic.
 * Only contains the properties actually used by shouldSkipClerkMiddleware.
 */
interface SkipCheckRequest {
  path: string;
  body: unknown;
}

/**
 * Determines if a request should skip clerkMiddleware.
 *
 * @param req - Request with path and body properties
 * @returns true if the request doesn't need auth context
 */
function shouldSkipClerkMiddleware(req: SkipCheckRequest): boolean {
  // Skip for known public paths
  if (CLERK_SKIP_PATHS.has(req.path)) {
    return true;
  }

  // For /mcp endpoints, check the MCP method
  // Check exact /mcp path or /mcp/ subpaths, not paths that happen to start with /mcp
  if (req.path === '/mcp' || req.path.startsWith('/mcp/')) {
    const mcpMethod = getMcpMethodFromBody(req.body);
    if (mcpMethod && CLERK_SKIP_METHODS.has(mcpMethod)) {
      return true;
    }
    // Also check using the discovery method classifier
    if (mcpMethod && isDiscoveryMethod(mcpMethod)) {
      return true;
    }
  }

  return false;
}

/**
 * Creates a conditional clerkMiddleware that skips auth setup for discovery methods.
 *
 * @param clerkMw - The actual clerkMiddleware to conditionally apply
 * @param logger - Logger for debug output
 * @returns Express middleware that conditionally applies clerkMiddleware
 */
export function createConditionalClerkMiddleware(
  clerkMw: RequestHandler,
  logger: Logger,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (shouldSkipClerkMiddleware(req)) {
      const mcpMethod = getMcpMethodFromBody(req.body);
      logger.debug('clerkMiddleware skipped for discovery/public method', {
        path: req.path,
        mcpMethod,
      });
      next();
      return;
    }

    // Run clerkMiddleware for requests that might need auth
    clerkMw(req, res, next);
  };
}

/**
 * Type guard to check if shouldSkipClerkMiddleware is available.
 * Exported for testing.
 */
export { shouldSkipClerkMiddleware as testShouldSkipClerkMiddleware };
