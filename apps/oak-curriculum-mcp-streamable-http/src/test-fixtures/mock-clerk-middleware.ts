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
      // Simulate authenticated state (Clerk attaches auth to req)
      // Clerk extends Express Request with auth property, but TypeScript doesn't know about it
      // We need to use type assertion to assign to req.auth
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Clerk extends Express Request with auth property
      const reqWithAuth = req as { auth?: { userId: string; sessionId: string } };
      reqWithAuth.auth = {
        userId: 'test-user-123',
        sessionId: 'test-session-456',
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
    // Clerk extends Express Request with auth property, but TypeScript doesn't know about it
    // We need to use type assertion to access req.auth
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Clerk extends Express Request with auth property
    const reqWithAuth = req as { auth?: { userId?: string } };
    const auth = reqWithAuth.auth;

    if (!auth?.userId) {
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
