/**
 * Integration tests for createMcpAuthClerk.
 *
 * Tests that the Clerk-specific middleware validates AuthInfo with Zod
 * `.strict()` before setting `req.auth`. Uses dependency injection
 * to avoid `vi.mock` on Clerk imports (ADR-078).
 *
 * Uses `node-mocks-http` for Express Request/Response objects.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMcpAuthClerk } from './mcp-auth-clerk.js';
import {
  createFakeLogger,
  createFakeAuthInfo,
  createFakeMachineAuthObject,
  createMockExpressRequest,
  createMockExpressResponse,
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

      const malformedAuthData = {
        ...createFakeAuthInfo(),
        unexpectedField: 'should-be-rejected-by-strict',
      };

      const middleware = createMcpAuthClerk(logger, ALLOWED_HOSTS, {
        getAuth: vi.fn().mockReturnValue(authenticatedAuth),
        verifyClerkToken: vi.fn().mockReturnValue(malformedAuthData),
      });

      const req = createMockExpressRequest({ token: 'test-token', host: 'localhost' });
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(401);
      expect(logger.error).toHaveBeenCalled();
    });

    it('accepts valid authData and calls next()', async () => {
      const authenticatedAuth = createFakeMachineAuthObject({ isAuthenticated: true });
      const validAuthInfo = createFakeAuthInfo();

      const middleware = createMcpAuthClerk(logger, ALLOWED_HOSTS, {
        getAuth: vi.fn().mockReturnValue(authenticatedAuth),
        verifyClerkToken: vi.fn().mockReturnValue(validAuthInfo),
      });

      const req = createMockExpressRequest({ token: 'test-token', host: 'localhost' });
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req).toHaveProperty('auth', validAuthInfo);
    });
  });
});
