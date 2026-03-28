/**
 * Integration tests for mcpAuth middleware.
 *
 * Tests that mcpAuth sets verified AuthInfo on `req.auth` (not `res.locals`)
 * when token verification succeeds. Uses a custom TokenVerifier to avoid
 * Clerk dependencies.
 *
 * The token `test-token` is opaque (not JWT format), so
 * `validateResourceParameter` skips RFC 8707 audience validation and
 * returns `{ valid: true }`.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { mcpAuth } from './mcp-auth.js';
import {
  createFakeLogger,
  createFakeAuthInfo,
  createFakeAuthMiddlewareRequest,
  createFakeResponse,
} from '../../test-helpers/fakes.js';

const ALLOWED_HOSTS = ['localhost'] as const;

describe('mcpAuth middleware (Integration)', () => {
  const logger = createFakeLogger();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('auth storage on req.auth', () => {
    it('sets req.auth with verified authData after successful verification', async () => {
      const fakeAuthInfo = createFakeAuthInfo();
      const verifier = vi.fn<() => Promise<AuthInfo>>().mockResolvedValue(fakeAuthInfo);

      const middleware = mcpAuth(verifier, logger, ALLOWED_HOSTS);

      const req = createFakeAuthMiddlewareRequest({ token: 'test-token' });
      const res = createFakeResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req).toHaveProperty('auth', fakeAuthInfo);
    });

    it('does not set res.locals.authInfo', async () => {
      const fakeAuthInfo = createFakeAuthInfo();
      const verifier = vi.fn<() => Promise<AuthInfo>>().mockResolvedValue(fakeAuthInfo);

      const middleware = mcpAuth(verifier, logger, ALLOWED_HOSTS);

      const req = createFakeAuthMiddlewareRequest({ token: 'test-token' });
      const res = createFakeResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      // mcpAuth sets req.auth directly, not res.locals.authInfo
      expect(res.locals).not.toHaveProperty('authInfo');
    });

    it('does not set req.auth when verifier returns undefined (401)', async () => {
      const verifier = vi.fn<() => Promise<undefined>>().mockResolvedValue(undefined);

      const middleware = mcpAuth(verifier, logger, ALLOWED_HOSTS);

      // Opaque token format — skips RFC 8707 audience validation
      const req = createFakeAuthMiddlewareRequest({ token: 'test-token' });
      const res = createFakeResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(req).not.toHaveProperty('auth');
    });
  });
});
