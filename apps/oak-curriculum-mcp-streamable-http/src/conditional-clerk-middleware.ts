/**
 * Conditional Clerk middleware that skips auth context setup for non-MCP routes.
 *
 * ## Why This Exists
 *
 * The standard `clerkMiddleware()` runs on every request to set up auth context.
 * Non-MCP routes (health checks, OAuth metadata), public resource reads
 * (documentation URIs) and the MCP endpoint's public browser leg do not need
 * Clerk auth context.
 *
 * ## What Skips Clerk
 *
 * - **Path-based**: `/.well-known/*`, `/oauth/*` (RFC 9728), and both health
 *   paths — `/healthz` and the routed `/mcp/healthz` the canonical host reaches
 *   (MCP-580)
 * - **Prefix-based**: HMAC-signed asset downloads, and the landing page's own
 *   static asset trees under both prefixes they are mounted at
 * - **Public resources**: `resources/read` for documentation URIs
 * - **The browser leg of the public page surface**: the same baked page is
 *   served at `/mcp` and at `/`, and it is fully public by owner ruling
 *   (MCP-518), so the surface fork must precede auth involvement rather than
 *   follow it
 *
 * ## Path Matching
 *
 * Every comparison here runs against a case-normalised copy of `req.path`,
 * because Express matches routes and mounts case-insensitively by default and
 * this app never turns that off. Comparing the raw path against lowercase
 * literals would let `/MCP` be served by the very same handler while matching
 * no skip at all. The path sets and the normalisation rule they are compared
 * under both live in `clerk-skip-surfaces.ts`.
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
import { selectsPublicBrowserLeg, type BrowserLegRequest } from './mcp-public-browser-leg.js';
import {
  CLERK_SKIP_PATHS,
  CLERK_SKIP_PREFIXES,
  isMcpSurface,
  isPublicPageSurface,
  normaliseSkipPath,
} from './clerk-skip-surfaces.js';

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
 *
 * @remarks
 * Plain data, extracted by the caller rather than an Express `Request`
 * narrowed by structural typing. The surface fork is decided by the
 * request's method and its negotiation headers, so carrying them as values
 * keeps every case describable from literals — and keeps the header names
 * spelled once, at the one place that reads them off the wire. The
 * negotiation fields are inherited from {@link BrowserLegRequest} rather
 * than restated, so this interface cannot fall behind the predicate.
 */
interface SkipCheckRequest extends BrowserLegRequest {
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

function shouldSkipClerkMiddleware(req: SkipCheckRequest): boolean {
  const path = normaliseSkipPath(req.path);

  // Skip for known public paths
  if (CLERK_SKIP_PATHS.has(path)) {
    return true;
  }

  // Skip for prefix-matched paths (parameterised routes)
  if (CLERK_SKIP_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return true;
  }

  // On the public page surface, fork on the surface before anything else.
  if (isPublicPageSurface(path) && selectsPublicBrowserLeg(req)) {
    return true;
  }

  // Then, on the MCP surface only, fork on the MCP method.
  if (isMcpSurface(path)) {
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
    const skipCheck: SkipCheckRequest = {
      path: req.path,
      body: req.body,
      method: req.method,
      accept: req.get('Accept'),
      secFetchDest: req.get('Sec-Fetch-Dest'),
    };
    if (shouldSkipClerkMiddleware(skipCheck)) {
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
