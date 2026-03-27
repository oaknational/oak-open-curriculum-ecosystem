/**
 * Clerk-specific MCP OAuth authentication middleware.
 *
 * This module provides Clerk-integrated authentication middleware for MCP,
 * returning HTTP 401 + WWW-Authenticate for auth failures per MCP spec.
 *
 */

import type { RequestHandler, Request } from 'express';
import type { Logger } from '@oaknational/logger';
import { getAuth } from '@clerk/express';
import { mcpAuth } from './mcp-auth.js';
import { verifyClerkToken } from '@clerk/mcp-tools/server';

/**
 * Creates Express middleware that enforces Clerk OAuth authentication for MCP requests.
 *
 * This middleware:
 * 1. Uses `@clerk/express` to get authentication context
 * 2. Verifies the OAuth token using Clerk
 * 3. Stores verified AuthInfo on res.locals.authInfo
 * 4. Returns 401 with proper WWW-Authenticate header if invalid
 *
 * **Key Behavior**: Runs BEFORE the MCP SDK, enabling HTTP 401 responses
 * per MCP spec. The SDK always returns HTTP 200, so auth must be checked first.
 *
 * @param logger - Logger for authentication events
 * @returns Express middleware that enforces Clerk OAuth authentication
 *
 * @example
 * ```typescript
 * app.post('/mcp', createMcpAuthClerk(logger), mcpHandler);
 * ```
 */
export function createMcpAuthClerk(
  logger: Logger,
  allowedHosts: readonly string[],
): RequestHandler {
  // Create authentication middleware with Clerk token verification
  return mcpAuth(
    (token, request: Request) => {
      // Get Clerk auth context (must be called with oauth_token type)
      const authData = getAuth(request, { acceptsToken: 'oauth_token' });

      // If not authenticated, return undefined (middleware will return 401)
      if (!authData.isAuthenticated) {
        return Promise.resolve(undefined);
      }

      // Verify and format the token for MCP SDK
      return Promise.resolve(verifyClerkToken(authData, token));
    },
    logger,
    allowedHosts,
  );
}
