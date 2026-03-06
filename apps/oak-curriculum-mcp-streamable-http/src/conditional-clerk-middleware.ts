/**
 * Conditional Clerk middleware that skips auth context setup for non-MCP routes.
 *
 * ## Why This Exists
 *
 * The standard `clerkMiddleware()` runs on every request to set up auth context.
 * Non-MCP routes (health checks, OAuth metadata) and public resource reads
 * (widget HTML, documentation) do not need Clerk auth context.
 *
 * ## What Skips Clerk
 *
 * - **Path-based**: `/.well-known/*`, `/healthz` (RFC 9728, health checks)
 * - **Public resources**: `resources/read` for widget HTML and documentation URIs
 *
 * ## What Does NOT Skip Clerk
 *
 * Per MCP 2025-11-25: "Authorization MUST be included in every HTTP request
 * from client to server." All MCP methods including discovery (initialize,
 * tools/list) go through Clerk. If latency becomes a concern, cache JWKS --
 * do not skip auth.
 *
 * @see https://modelcontextprotocol.io/specification/2025-11-25/basic/authorization
 */

import type { RequestHandler, Request, Response, NextFunction } from 'express';
import type { Logger } from '@oaknational/logger';
import { getResourceUriFromBody } from './auth/mcp-body-parser.js';
import { isPublicResourceUri } from './auth/public-resources.js';

/**
 * Paths that should always skip clerkMiddleware.
 * OAuth metadata endpoints must be publicly accessible per RFC 9728.
 */
const CLERK_SKIP_PATHS: ReadonlySet<string> = new Set([
  '/.well-known/oauth-protected-resource',
  '/.well-known/oauth-protected-resource/mcp',
  '/.well-known/oauth-authorization-server',
  '/.well-known/openid-configuration',
  '/healthz',
  '/oauth/authorize',
  '/oauth/token',
  '/oauth/register',
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
 * Checks if an MCP method should skip Clerk authentication.
 *
 * Only public resource reads skip Clerk. All other MCP methods
 * require auth per MCP 2025-11-25.
 *
 * @param mcpMethod - The MCP method from request body
 * @param body - Request body for extracting resource URI
 * @returns true if the method should skip auth
 */
function shouldMcpMethodSkipClerk(mcpMethod: string, body: unknown): boolean {
  if (mcpMethod === 'resources/read') {
    const uri = getResourceUriFromBody(body);
    if (uri && isPublicResourceUri(uri)) {
      return true;
    }
  }
  return false;
}

/**
 * Path prefixes that should skip clerkMiddleware.
 * Asset download routes are self-authenticating via HMAC signature (ADR-126).
 */
const CLERK_SKIP_PREFIXES: readonly string[] = ['/assets/download/'];

function shouldSkipClerkMiddleware(req: SkipCheckRequest): boolean {
  // Skip for known public paths
  if (CLERK_SKIP_PATHS.has(req.path)) {
    return true;
  }

  // Skip for prefix-matched paths (parameterised routes)
  if (CLERK_SKIP_PREFIXES.some((prefix) => req.path.startsWith(prefix))) {
    return true;
  }

  // For /mcp endpoints, check the MCP method
  // Check exact /mcp path or /mcp/ subpaths, not paths that happen to start with /mcp
  if (req.path === '/mcp' || req.path.startsWith('/mcp/')) {
    const mcpMethod = getMcpMethodFromBody(req.body);
    if (mcpMethod && shouldMcpMethodSkipClerk(mcpMethod, req.body)) {
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
