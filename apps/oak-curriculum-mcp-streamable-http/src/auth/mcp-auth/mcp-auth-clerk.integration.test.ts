/**
 * Integration tests for createMcpAuthClerk.
 *
 * Tests that the Clerk-specific middleware validates AuthInfo with Zod
 * `.strict()` before setting `req.auth`. Uses dependency injection
 * to avoid `vi.mock` on Clerk imports (ADR-078).
 *
 * The token `test-token` is opaque (not JWT format), so
 * `validateResourceParameter` skips RFC 8707 audience validation.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMcpAuthClerk } from './mcp-auth-clerk.js';
import {
  createFakeLogger,
  createFakeAuthInfo,
  createFakeMachineAuthObject,
  createFakeAuthMiddlewareRequest,
  createFakeResponse,
} from '../../test-helpers/fakes.js';

const ALLOWED_HOSTS = ['localhost'] as const;

describe('createMcpAuthClerk (Integration)', () => {
  const logger = createFakeLogger();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Zod .strict() validation of verifyClerkToken result', () => {
    it('rejects authData with unknown fields (returns 401)', async () => {
      const authenticatedAuth = createFakeMachineAuthObject({ isAuthenticated: true });

      // verifyClerkToken returns data with an unexpected extra field
      const malformedAuthData = {
        ...createFakeAuthInfo(),
        unexpectedField: 'should-be-rejected-by-strict',
      };

      const middleware = createMcpAuthClerk(logger, ALLOWED_HOSTS, {
        getAuth: vi.fn().mockReturnValue(authenticatedAuth),
        verifyClerkToken: vi.fn().mockReturnValue(malformedAuthData),
      });

      // Opaque token format — skips RFC 8707 audience validation
      const req = createFakeAuthMiddlewareRequest({ token: 'test-token' });
      const res = createFakeResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      // Zod .strict() rejects the unknown field — middleware returns 401
      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      // Logger captures the Zod validation failure
      expect(logger.error).toHaveBeenCalled();
    });

    it('accepts valid authData and calls next()', async () => {
      const authenticatedAuth = createFakeMachineAuthObject({ isAuthenticated: true });
      const validAuthInfo = createFakeAuthInfo();

      const middleware = createMcpAuthClerk(logger, ALLOWED_HOSTS, {
        getAuth: vi.fn().mockReturnValue(authenticatedAuth),
        verifyClerkToken: vi.fn().mockReturnValue(validAuthInfo),
      });

      const req = createFakeAuthMiddlewareRequest({ token: 'test-token' });
      const res = createFakeResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      // req.auth is set with Zod-validated AuthInfo
      expect(req).toHaveProperty('auth', validAuthInfo);
    });
  });
});
