/**
 * Clerk-specific MCP OAuth authentication middleware.
 *
 * This module provides Clerk-integrated authentication middleware for MCP,
 * using the fixed mcpAuth implementation (without the /mcp suffix bug).
 *
 * @module auth/mcp-auth/mcp-auth-clerk
 */

import type { RequestHandler, Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { mcpAuth } from './mcp-auth.js';
import { verifyClerkToken } from './verify-clerk-token.js';

/**
 * Express middleware that enforces Clerk OAuth authentication for MCP requests.
 *
 * This middleware:
 * 1. Uses @clerk/express to get authentication context
 * 2. Verifies the OAuth token using Clerk
 * 3. Attaches AuthInfo to req.auth if valid
 * 4. Returns 401 with proper WWW-Authenticate header if invalid
 *
 * The key difference from @clerk/mcp-tools/express is that this uses the fixed
 * getPRMUrl function that doesn't append req.originalUrl to the metadata path.
 *
 * @example
 * ```typescript
 * app.post('/mcp', mcpAuthClerk, mcpHandler);
 * ```
 */
export const mcpAuthClerk: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  // Create authentication middleware with Clerk token verification
  const authMiddleware = mcpAuth((token, req: Request) => {
    // Get Clerk auth context (must be called with oauth_token type)
    const authData = getAuth(req, { acceptsToken: 'oauth_token' });

    // If not authenticated, return undefined (middleware will return 401)
    if (!authData.isAuthenticated) {
      return Promise.resolve(undefined);
    }

    // Verify and format the token for MCP SDK
    return Promise.resolve(verifyClerkToken(authData, token));
  });

  // Execute the auth middleware
  authMiddleware(req, res, next);
};
