/**
 * Integration tests for method-aware MCP router middleware.
 *
 * These tests verify that the router correctly delegates to auth middleware
 * based on MCP method classification and tool security metadata.
 *
 * Part of Phase 2, Sub-Phase 2.4
 */

import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { createMcpRouter } from './mcp-router.js';

describe('createMcpRouter', () => {
  /**
   * Helper to create mock Express req/res/next
   */
  function createMocks(body: unknown = {}) {
    const req = {
      body,
      headers: {},
      get: vi.fn(),
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
   * Simple mock auth middleware that checks for Authorization header
   */
  function createMockAuth(): RequestHandler {
    return ((req: Request, res: Response, next: NextFunction) => {
      if (!req.headers.authorization) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      next();
    }) as RequestHandler;
  }

  describe('Discovery methods (no auth required)', () => {
    it('allows tools/list without Bearer token', () => {
      const mockAuth = vi.fn(createMockAuth());
      const router = createMcpRouter({ auth: mockAuth });
      const { req, res, next } = createMocks({ method: 'tools/list' });

      router(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(mockAuth).not.toHaveBeenCalled();
    });

    it('allows tools/list with Bearer token (does not break)', () => {
      const mockAuth = vi.fn(createMockAuth());
      const router = createMcpRouter({ auth: mockAuth });
      const { req, res, next } = createMocks({ method: 'tools/list' });
      req.headers.authorization = 'Bearer test-token';

      router(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(mockAuth).not.toHaveBeenCalled();
    });

    it('allows initialize without Bearer token', () => {
      const mockAuth = vi.fn(createMockAuth());
      const router = createMcpRouter({ auth: mockAuth });
      const { req, res, next } = createMocks({ method: 'initialize' });

      router(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(mockAuth).not.toHaveBeenCalled();
    });
  });

  describe('Execution methods (per-tool auth)', () => {
    it('requires auth for OAuth tool without token (get-key-stages)', () => {
      const mockAuth = vi.fn(createMockAuth());
      const router = createMcpRouter({ auth: mockAuth });
      const { req, res, next } = createMocks({
        method: 'tools/call',
        params: { name: 'get-key-stages' },
      });

      router(req, res, next);

      expect(mockAuth).toHaveBeenCalledOnce();
      expect(mockAuth).toHaveBeenCalledWith(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    });

    it('allows OAuth tool with valid Bearer token', () => {
      const mockAuth = vi.fn(createMockAuth());
      const router = createMcpRouter({ auth: mockAuth });
      const { req, res, next } = createMocks({
        method: 'tools/call',
        params: { name: 'get-key-stages' },
      });
      req.headers.authorization = 'Bearer valid-token';

      router(req, res, next);

      expect(mockAuth).toHaveBeenCalledOnce();
      expect(mockAuth).toHaveBeenCalledWith(req, res, next);
      expect(next).toHaveBeenCalledOnce();
    });

    it('allows public tool without Bearer token (get-changelog)', () => {
      const mockAuth = vi.fn(createMockAuth());
      const router = createMcpRouter({ auth: mockAuth });
      const { req, res, next } = createMocks({
        method: 'tools/call',
        params: { name: 'get-changelog' },
      });

      router(req, res, next);

      expect(next).toHaveBeenCalledOnce();
      expect(mockAuth).not.toHaveBeenCalled();
    });
  });

  describe('Safe defaults', () => {
    it('requires auth for unknown method', () => {
      const mockAuth = vi.fn(createMockAuth());
      const router = createMcpRouter({ auth: mockAuth });
      const { req, res, next } = createMocks({ method: 'unknown/method' });

      router(req, res, next);

      expect(mockAuth).toHaveBeenCalledOnce();
      expect(mockAuth).toHaveBeenCalledWith(req, res, next);
    });

    it('requires auth for malformed request body', () => {
      const mockAuth = vi.fn(createMockAuth());
      const router = createMcpRouter({ auth: mockAuth });
      const { req, res, next } = createMocks({});

      router(req, res, next);

      expect(mockAuth).toHaveBeenCalledOnce();
      expect(mockAuth).toHaveBeenCalledWith(req, res, next);
    });
  });
});
