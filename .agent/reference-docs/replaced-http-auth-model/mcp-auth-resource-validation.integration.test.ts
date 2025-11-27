/**
 * Integration tests for RFC 8707 resource parameter validation in auth flow.
 *
 * These tests verify that the auth middleware properly validates JWT audience
 * claims against the expected resource URL.
 *
 * Part of Phase 2, Sub-Phase 2.4 Part 3c
 */

import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { mcpAuth } from './mcp-auth.js';
import type { AuthInfo } from './types.js';

describe('mcpAuth with resource parameter validation', () => {
  const SECRET = 'test-secret';
  const EXPECTED_RESOURCE = 'http://localhost:3333/mcp';

  /**
   * Helper to create mock Express req/res/next
   */
  function createMocks(options: { token?: string; baseUrl?: string } = {}) {
    const req = {
      headers: options.token ? { authorization: `Bearer ${options.token}` } : {},
      protocol: 'http',
      get: vi.fn((header: string) => {
        if (header === 'host') {
          return 'localhost:3333';
        }
        return undefined;
      }),
      originalUrl: '/mcp',
    } as unknown as Request;

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    } as unknown as Response;

    const next = vi.fn() as NextFunction;

    return { req, res, next };
  }

  /**
   * Helper to create a JWT token with specified claims
   */
  function createToken(claims: { aud?: string | string[]; [key: string]: unknown }) {
    return jwt.sign(claims, SECRET);
  }

  /**
   * Mock token verifier that returns AuthInfo for valid tokens
   */
  const mockVerifier = (token: string): Promise<AuthInfo | undefined> => {
    try {
      // Verify the token (will throw if invalid)
      jwt.verify(token, SECRET);

      // Return mock auth info
      return Promise.resolve({
        token,
        clientId: 'client-123',
        scopes: ['mcp:invoke', 'mcp:read'],
        extra: { userId: 'user-789' },
      });
    } catch {
      return Promise.resolve(undefined);
    }
  };

  describe('Token with correct audience', () => {
    it('accepts token with matching aud (string)', async () => {
      const token = createToken({ aud: EXPECTED_RESOURCE });
      const authMiddleware = mcpAuth(mockVerifier);
      const { req, res, next } = createMocks({ token });

      await authMiddleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('accepts token with multiple aud values, one matches', async () => {
      const token = createToken({
        aud: ['https://other.example.com', EXPECTED_RESOURCE, 'https://another.example.com'],
      });
      const authMiddleware = mcpAuth(mockVerifier);
      const { req, res, next } = createMocks({ token });

      await authMiddleware(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Token with wrong audience', () => {
    it('rejects token with wrong aud', async () => {
      const token = createToken({ aud: 'https://wrong.example.com' });
      const authMiddleware = mcpAuth(mockVerifier);
      const { req, res, next } = createMocks({ token });

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      const setCall = vi.mocked(res.set).mock.calls[0]?.[0] as unknown;
      expect(setCall).toBeDefined();
      expect(typeof setCall).toBe('object');
      expect(setCall).toHaveProperty('WWW-Authenticate');
      if (setCall && typeof setCall === 'object') {
        expect((setCall as Record<string, string>)['WWW-Authenticate']).toContain(
          'error="invalid_token"',
        );
      }
      expect(next).not.toHaveBeenCalled();
    });

    it('rejects token with missing aud', async () => {
      const token = createToken({ sub: 'user123' }); // No aud claim
      const authMiddleware = mcpAuth(mockVerifier);
      const { req, res, next } = createMocks({ token });

      await authMiddleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      const setCall = vi.mocked(res.set).mock.calls[0]?.[0] as unknown;
      expect(setCall).toBeDefined();
      expect(typeof setCall).toBe('object');
      expect(setCall).toHaveProperty('WWW-Authenticate');
      if (setCall && typeof setCall === 'object') {
        expect((setCall as Record<string, string>)['WWW-Authenticate']).toContain(
          'error="invalid_token"',
        );
      }
      expect(next).not.toHaveBeenCalled();
    });
  });
});
