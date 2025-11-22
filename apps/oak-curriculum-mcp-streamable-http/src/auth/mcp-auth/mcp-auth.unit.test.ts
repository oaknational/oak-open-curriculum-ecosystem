/**
 * Unit tests for mcpAuth middleware.
 *
 * Tests prove the core authentication logic works correctly in isolation,
 * covering all 4 critical auth paths without requiring HTTP/Express integration.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import jwt from 'jsonwebtoken';
import { mcpAuth } from './mcp-auth.js';
import { getPRMUrl } from './get-prm-url.js';
import { getMcpResourceUrl } from './get-mcp-resource-url.js';

// Mock modules
vi.mock('./get-prm-url.js', () => ({
  getPRMUrl: vi.fn(),
}));

vi.mock('./get-mcp-resource-url.js', () => ({
  getMcpResourceUrl: vi.fn(),
}));

describe('mcpAuth', () => {
  // Setup mocks before each test
  beforeEach(() => {
    vi.mocked(getPRMUrl).mockReturnValue(
      'https://example.com/.well-known/oauth-protected-resource',
    );
    vi.mocked(getMcpResourceUrl).mockReturnValue('https://example.com/mcp');
  });

  // Type guard for headers object
  function isHeadersObject(value: unknown): value is Record<string, string> {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.values(value).every((v) => typeof v === 'string')
    );
  }

  // Helper to create minimal Express mock objects
  function createMocks() {
    const req = {
      headers: {},
    } as Partial<Request>;

    type MockRes = {
      statusCode: number;
      headers: Record<string, string>;
      body: unknown;
      status: ReturnType<typeof vi.fn>;
      set: ReturnType<typeof vi.fn>;
      send: ReturnType<typeof vi.fn>;
      json: ReturnType<typeof vi.fn>;
    };

    const res: MockRes = {
      statusCode: 0,
      headers: {},
      body: undefined,
      status: vi.fn(function (this: MockRes, code: number) {
        this.statusCode = code;
        return this;
      }),
      set: vi.fn(function (this: MockRes, headers: Record<string, string>) {
        Object.assign(this.headers, headers);
        return this;
      }),
      send: vi.fn(function (this: MockRes, body: unknown) {
        this.body = body;
        return this;
      }),
      json: vi.fn(function (this: MockRes, body: unknown) {
        this.body = body;
        return this;
      }),
    };

    const next = vi.fn();

    return { req: req as Request, res: res as unknown as Response, next };
  }

  describe('missing Authorization header', () => {
    it('returns 401 with WWW-Authenticate header containing resource_metadata URL', async () => {
      const { req, res, next } = createMocks();
      const verifyToken = vi.fn();

      const middleware = mcpAuth(verifyToken);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.set).toHaveBeenCalledWith({
        'WWW-Authenticate':
          'Bearer resource_metadata=https://example.com/.well-known/oauth-protected-resource',
      });
      expect(res.send).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
      expect(verifyToken).not.toHaveBeenCalled();
    });
  });

  describe('malformed Authorization header', () => {
    it('returns 401 with error details when Bearer scheme is missing', async () => {
      const { req, res, next } = createMocks();
      req.headers.authorization = 'NotBearer some-token';
      const verifyToken = vi.fn();

      const middleware = mcpAuth(verifyToken);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      // Verify WWW-Authenticate header contains error details
      expect(res.set).toHaveBeenCalled();
      const setCall = vi.mocked(res.set).mock.calls[0];
      expect(setCall).toBeDefined();
      const maybeHeaders = setCall[0];
      expect(isHeadersObject(maybeHeaders)).toBe(true);
      if (isHeadersObject(maybeHeaders)) {
        const wwwAuth = maybeHeaders['WWW-Authenticate'];
        expect(typeof wwwAuth).toBe('string');
        expect(wwwAuth).toContain('error="invalid_request"');
        expect(wwwAuth).toContain("Must be 'Bearer <token>'");
      }
      expect(res.send).toHaveBeenCalledWith({
        error: 'Unauthorized',
        message: 'Invalid Authorization header format.',
      });
      expect(next).not.toHaveBeenCalled();
      expect(verifyToken).not.toHaveBeenCalled();
    });

    it('returns 401 with error details when token part is missing', async () => {
      const { req, res, next } = createMocks();
      req.headers.authorization = 'Bearer';
      const verifyToken = vi.fn();

      const middleware = mcpAuth(verifyToken);
      await middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      // Verify WWW-Authenticate header contains error
      expect(res.set).toHaveBeenCalled();
      const setCall = vi.mocked(res.set).mock.calls[0];
      expect(setCall).toBeDefined();
      const maybeHeaders = setCall[0];
      expect(isHeadersObject(maybeHeaders)).toBe(true);
      if (isHeadersObject(maybeHeaders)) {
        const wwwAuth = maybeHeaders['WWW-Authenticate'];
        expect(typeof wwwAuth).toBe('string');
        expect(wwwAuth).toContain('error="invalid_request"');
      }
      expect(next).not.toHaveBeenCalled();
      expect(verifyToken).not.toHaveBeenCalled();
    });
  });

  describe('token verification', () => {
    it('returns 401 when token verifier returns undefined', async () => {
      const { req, res, next } = createMocks();
      req.headers.authorization = 'Bearer invalid-token';
      const verifyToken = vi.fn().mockResolvedValue(undefined);

      const middleware = mcpAuth(verifyToken);
      await middleware(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith('invalid-token', req);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'Unauthorized' });
      expect(next).not.toHaveBeenCalled();
    });

    it('attaches AuthInfo to req.auth and calls next() when token is valid', async () => {
      const { req, res, next } = createMocks();

      // Create a valid JWT with correct aud claim (matching getMcpResourceUrl mock)
      const validToken = jwt.sign({ aud: 'https://example.com/mcp' }, 'test-secret');
      req.headers.authorization = `Bearer ${validToken}`;

      const mockAuthInfo: AuthInfo = {
        token: validToken,
        clientId: 'client-456',
        scopes: ['mcp:invoke', 'mcp:read'],
        extra: { userId: 'user-789' },
      };

      const verifyToken = vi.fn().mockResolvedValue(mockAuthInfo);

      const middleware = mcpAuth(verifyToken);
      await middleware(req, res, next);

      expect(verifyToken).toHaveBeenCalledWith(validToken, req);
      expect(req.auth).toEqual(mockAuthInfo);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });

    it('passes both token and request to the verifier function', async () => {
      const { req, res, next } = createMocks();

      // Create a valid JWT with correct aud claim (but verifier will reject it)
      const testToken = jwt.sign({ aud: 'https://example.com/mcp' }, 'test-secret');
      req.headers.authorization = `Bearer ${testToken}`;

      const verifyToken = vi.fn().mockResolvedValue(undefined);

      const middleware = mcpAuth(verifyToken);
      await middleware(req, res, next);

      expect(verifyToken).toHaveBeenCalledTimes(1);
      expect(verifyToken).toHaveBeenCalledWith(testToken, req);
    });
  });
});
