/**
 * MCP OAuth authentication middleware.
 *
 * Generic authentication middleware for MCP that enforces OAuth token verification.
 * Returns HTTP 401 + WWW-Authenticate header for auth failures, per MCP spec.
 *
 * ## Auth Model
 *
 * Per MCP spec: "Invalid or expired tokens MUST receive a HTTP 401 response"
 * Per OpenAI Apps: "If verification fails, respond with 401 Unauthorized"
 *
 * This middleware runs BEFORE the MCP SDK, allowing proper HTTP 401 responses.
 *
 */

import type { RequestHandler, Request, Response, NextFunction } from 'express';
import type { Logger } from '@oaknational/logger';
import type { TokenVerifier } from './types.js';
import { getPRMUrl } from './get-prm-url.js';
import { getMcpResourceUrl } from './get-mcp-resource-url.js';
import { validateResourceParameter } from '../../resource-parameter-validator.js';

/**
 * Send 401 response with WWW-Authenticate header for missing authorization.
 * This triggers OAuth discovery in MCP clients.
 */
function sendMissingAuthResponse(res: Response, prmUrl: string): void {
  res
    .status(401)
    .set({ 'WWW-Authenticate': `Bearer resource_metadata="${prmUrl}"` })
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
function sendVerificationFailedResponse(res: Response, prmUrl: string): void {
  res
    .status(401)
    .set({
      'WWW-Authenticate': `Bearer resource_metadata="${prmUrl}", error="invalid_token", error_description="Token verification failed"`,
    })
    .json({ error: 'Unauthorized' });
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
function checkResourceParameter(
  token: string,
  req: Request,
  logger: Logger,
  allowedHosts: readonly string[],
): { valid: boolean; reason?: string } {
  const expectedResource = getMcpResourceUrl(req, allowedHosts);
  return validateResourceParameter(token, expectedResource, logger);
}

/**
 * Log and forward error from auth middleware.
 */
function handleAuthError(
  error: unknown,
  req: Request,
  res: Response,
  logger: Logger,
  next: NextFunction,
): void {
  if (error instanceof Error) {
    const isHostValidationError =
      error.message.startsWith('Cannot generate OAuth metadata URL:') ||
      error.message.startsWith('Cannot generate MCP resource URL:');
    if (isHostValidationError) {
      logger.warn('Rejected request due to invalid or disallowed Host header', {
        error: error.message,
        path: req.path,
        method: req.method,
      });
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
  }
  logger.error('MCP auth middleware error', {
    error: error instanceof Error ? error.message : String(error),
    path: req.path,
    method: req.method,
  });
  next(error);
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
 * 7. Stores verified `AuthInfo` on `res.locals.authInfo` for the handler
 * 8. Calls next() if all checks pass
 *
 * **RFC 8707 Compliance**: This middleware validates that the JWT's `aud`
 * (audience) claim matches the expected resource URL to prevent token misuse
 * across different services.
 *
 * @param verifyToken - Custom function to verify the OAuth token
 * @param logger - Logger for authentication events
 * @returns Express middleware that enforces authentication
 *
 * @see https://www.rfc-editor.org/rfc/rfc8707.html
 *
 * @example
 * ```typescript
 * const auth = mcpAuth(async (token, req) => {
 *   // Custom token verification logic
 *   return verifyMyToken(token);
 * }, logger);
 * app.post('/mcp', auth, mcpHandler);
 * ```
 */
export function mcpAuth(
  verifyToken: TokenVerifier,
  logger: Logger,
  allowedHosts: readonly string[],
): RequestHandler {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const prmUrl = getPRMUrl(req, allowedHosts);

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
        sendVerificationFailedResponse(res, prmUrl);
        return;
      }

      // RFC 8707: Validate resource parameter (JWT audience claim)
      const validation = checkResourceParameter(token, req, logger, allowedHosts);
      if (!validation.valid) {
        sendInvalidResourceResponse(res, prmUrl, validation.reason ?? 'Unknown validation error');
        return;
      }

      // Store verified AuthInfo on res.locals for the MCP handler to read.
      // This eliminates double verification — the handler reads res.locals.authInfo
      // instead of re-calling getAuth + verifyClerkToken.
      res.locals.authInfo = authData;

      next();
    } catch (error) {
      // Error is logged by handleAuthError
      handleAuthError(error, req, res, logger, next);
    }
  };
}
