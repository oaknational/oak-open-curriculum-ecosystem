/**
 * Mock helpers for Clerk middleware in tests
 * Allows testing auth behavior without external Clerk service
 */

import type { RequestHandler } from 'express';

/**
 * Options for configuring mock Clerk middleware behavior
 */
interface MockClerkMiddlewareOptions {
  /**
   * List of token values that should be considered valid
   * Default: ['valid-test-token-12345']
   */
  validTokens?: readonly string[];
  /**
   * Whether authentication should be enforced
   * Default: true
   */
  shouldAuthenticate?: boolean;
}

/**
 * Creates a mock clerkMiddleware that simulates Clerk's authentication
 * Use this in tests to control auth behavior deterministically
 *
 * @param options - Configuration options for the mock middleware
 * @returns Express middleware that simulates Clerk's auth behavior
 */
export function createMockClerkMiddleware(
  options: MockClerkMiddlewareOptions = {},
): RequestHandler {
  const validTokens = options.validTokens ?? ['valid-test-token-12345'];
  const shouldAuthenticate = options.shouldAuthenticate ?? true;

  return (req, _res, next) => {
    if (!shouldAuthenticate) {
      next();
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next();
      return;
    }

    const token = authHeader.replace(/^Bearer\s+/i, '');
    if (validTokens.includes(token)) {
      // Simulate authenticated state with AuthInfo structure that mcpAuthClerk expects
      const reqWithAuth = req;
      reqWithAuth.auth = {
        token,
        clientId: `client-${token}`,
        scopes: ['mcp:invoke', 'mcp:read'],
        extra: { userId: 'test-user-123', sessionId: 'test-session-456' },
      };
    }

    next();
  };
}

/**
 * Creates a mock mcpAuthClerk middleware that checks for authentication
 * Rejects if req.auth is not present (401)
 *
 * @returns Express middleware that enforces authentication
 */
export function createMockMcpAuthClerk(): RequestHandler {
  return (req, res, next) => {
    // Check if req.auth is present (AuthInfo from MCP SDK)
    const reqWithAuth = req;
    const auth = reqWithAuth.auth;

    // AuthInfo requires token, clientId, and scopes - if any are missing, reject
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- JC: Allowing runtime safety check
    if (!(auth?.token && auth.clientId && auth.scopes)) {
      res.setHeader(
        'WWW-Authenticate',
        'Bearer resource_metadata="/.well-known/oauth-protected-resource"',
      );
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    next();
  };
}
