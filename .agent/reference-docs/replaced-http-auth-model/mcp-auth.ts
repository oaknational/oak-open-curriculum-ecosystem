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
import { getMcpResourceUrl } from './get-mcp-resource-url.js';
import { validateResourceParameter } from '../../resource-parameter-validator.js';

/**
 * Send 401 response with WWW-Authenticate header for missing authorization.
 */
function sendMissingAuthResponse(res: Response, prmUrl: string): void {
  res
    .status(401)
    .set({ 'WWW-Authenticate': `Bearer resource_metadata=${prmUrl}` })
    .send({ error: 'Unauthorized' });
}

/**
 * Send 401 response for invalid Bearer token format.
 */
function sendInvalidFormatResponse(res: Response, prmUrl: string): void {
  res
    .status(401)
    .set({
      'WWW-Authenticate': `Bearer resource_metadata="${prmUrl}", error="invalid_request", error_description="Invalid Authorization header format. Must be 'Bearer <token>'."`,
    })
    .send({
      error: 'Unauthorized',
      message: 'Invalid Authorization header format.',
    });
}

/**
 * Send 401 response for failed token verification.
 */
function sendVerificationFailedResponse(res: Response): void {
  res.status(401).json({ error: 'Unauthorized' });
}

/**
 * Send 401 response for invalid resource parameter (audience mismatch).
 */
function sendInvalidResourceResponse(res: Response, prmUrl: string, reason: string): void {
  res
    .status(401)
    .set({
      'WWW-Authenticate': `Bearer resource_metadata="${prmUrl}", error="invalid_token", error_description="${reason}"`,
    })
    .send({
      error: 'Unauthorized',
      message: reason,
    });
}

/**
 * Extract Bearer token from authorization header.
 * Returns token string or undefined if format is invalid.
 */
function extractBearerToken(authHeader: string): string | undefined {
  const parts = authHeader.split(' ');
  if (parts.length === 2 && parts[0] === 'Bearer') {
    return parts[1];
  }
  return undefined;
}

/**
 * Validate resource parameter (RFC 8707).
 * Returns validation result with reason if invalid.
 */
function checkResourceParameter(token: string, req: Request): { valid: boolean; reason?: string } {
  const expectedResource = getMcpResourceUrl(req);
  return validateResourceParameter(token, expectedResource);
}

/**
 * Creates MCP authentication middleware with custom token verification.
 *
 * Returns middleware that:
 * 1. Returns 401 with WWW-Authenticate header if no authorization header
 * 2. Extracts and validates Bearer token format
 * 3. Calls custom verifyToken function for actual verification
 * 4. Returns 401 if token verification fails
 * 5. Validates JWT audience claim matches resource URL (RFC 8707)
 * 6. Returns 401 if audience validation fails
 * 7. Attaches AuthInfo to req.auth and calls next() if all checks pass
 *
 * **RFC 8707 Compliance**: This middleware validates that the JWT's `aud`
 * (audience) claim matches the expected resource URL to prevent token misuse
 * across different services.
 *
 * @param verifyToken - Custom function to verify the OAuth token
 * @returns Express middleware that enforces authentication
 *
 * @see https://www.rfc-editor.org/rfc/rfc8707.html
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
      sendMissingAuthResponse(res, prmUrl);
      return;
    }

    // Extract Bearer token
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      sendInvalidFormatResponse(res, prmUrl);
      return;
    }

    // Verify token using provided verification function
    const authData = await verifyToken(token, req);
    if (!authData) {
      sendVerificationFailedResponse(res);
      return;
    }

    // RFC 8707: Validate resource parameter (JWT audience claim)
    const validation = checkResourceParameter(token, req);
    if (!validation.valid) {
      const reason = validation.reason ?? 'Unknown validation error';
      sendInvalidResourceResponse(res, prmUrl, reason);
      return;
    }

    // Attach auth data to request (type-safe via declaration merging)
    req.auth = authData;
    next();
  };
}
