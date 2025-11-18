/**
 * MCP OAuth authentication middleware.
 *
 * Generic authentication middleware for MCP that enforces OAuth token verification.
 * Uses the fixed getPRMUrl function (without the /mcp suffix bug from @clerk/mcp-tools).
 *
 * @module auth/mcp-auth/mcp-auth
 */

import type { RequestHandler, Request, Response, NextFunction } from 'express';
import type { TokenVerifier } from './types.js';
import { getPRMUrl } from './get-prm-url.js';

/**
 * Creates MCP authentication middleware with custom token verification.
 *
 * Returns middleware that:
 * 1. Returns 401 with WWW-Authenticate header if no authorization header
 * 2. Extracts and validates Bearer token format
 * 3. Calls custom verifyToken function for actual verification
 * 4. Returns 401 if token verification fails
 * 5. Attaches AuthInfo to req.auth and calls next() if verification succeeds
 *
 * @param verifyToken - Custom function to verify the OAuth token
 * @returns Express middleware that enforces authentication
 *
 * @example
 * ```typescript
 * const auth = mcpAuth(async (token, req) => {
 *   // Custom token verification logic
 *   return verifyMyToken(token);
 * });
 * app.post('/mcp', auth, mcpHandler);
 * ```
 */
export function mcpAuth(verifyToken: TokenVerifier): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const prmUrl = getPRMUrl(req);

    // No authorization header - return 401 with WWW-Authenticate pointing to metadata
    if (!req.headers.authorization) {
      res
        .status(401)
        .set({ 'WWW-Authenticate': `Bearer resource_metadata=${prmUrl}` })
        .send({ error: 'Unauthorized' });
      return;
    }

    const authHeader = req.headers.authorization;
    const parts = authHeader.split(' ');

    // Invalid Bearer format - return 401 with error details
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res
        .status(401)
        .set({
          'WWW-Authenticate': `Bearer resource_metadata="${prmUrl}", error="invalid_request", error_description="Invalid Authorization header format. Must be 'Bearer <token>'."`,
        })
        .send({
          error: 'Unauthorized',
          message: 'Invalid Authorization header format.',
        });
      return;
    }

    const token = parts[1];

    // Verify token using provided verification function
    const authData = await verifyToken(token, req);

    if (!authData) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Attach auth data to request (type-safe via declaration merging)
    req.auth = authData;

    next();
  };
}
