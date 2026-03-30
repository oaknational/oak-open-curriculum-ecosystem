/**
 * Integration tests for mcpAuth middleware.
 *
 * Tests that mcpAuth sets verified AuthInfo on `req.auth` when token
 * verification succeeds, and returns 401 when verification fails.
 * Uses a custom TokenVerifier to avoid Clerk dependencies.
 *
 * Uses `node-mocks-http` for Express Request/Response objects — properly
 * typed without assertions.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import { mcpAuth } from './mcp-auth.js';
import {
  createFakeLogger,
  createFakeAuthInfo,
  createMockExpressRequest,
  createMockExpressResponse,
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

      const req = createMockExpressRequest({ token: 'test-token', host: 'localhost' });
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(req).toHaveProperty('auth', fakeAuthInfo);
    });

    it('does not set req.auth when verifier returns undefined (401)', async () => {
      const verifier = vi.fn<() => Promise<undefined>>().mockResolvedValue(undefined);

      const middleware = mcpAuth(verifier, logger, ALLOWED_HOSTS);

      const req = createMockExpressRequest({ token: 'test-token', host: 'localhost' });
      const res = createMockExpressResponse();
      const next = vi.fn();

      await middleware(req, res, next);

      expect(next).not.toHaveBeenCalled();
      expect(res.statusCode).toBe(401);
      expect(req).not.toHaveProperty('auth');
    });
  });
});
