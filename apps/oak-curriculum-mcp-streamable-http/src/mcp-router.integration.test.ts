/**
 * Integration tests for MCP router middleware.
 *
 * Tests that the router correctly applies or skips auth middleware
 * based on MCP method and resource/tool security metadata.
 *
 * Uses `node-mocks-http` for Express Request/Response objects.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { createMcpRouter } from './mcp-router.js';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools';
import { createMockExpressRequest, createMockExpressResponse } from './test-helpers/fakes.js';

describe('createMcpRouter (Integration)', () => {
  let mockAuthMw: RequestHandler;
  let mockNext: NextFunction;
  let mockRes: Response;

  beforeEach(() => {
    mockAuthMw = vi.fn((req: Request, res: Response, next: NextFunction) => {
      void req;
      void res;
      next();
    });
    mockNext = vi.fn();
    mockRes = createMockExpressResponse();
  });

  function createMockRequest(body: {
    method?: string;
    params?: { name?: string; uri?: string };
    [key: string]: unknown;
  }): Request {
    return createMockExpressRequest({ body });
  }

  describe('discovery methods (auth required per MCP 2025-11-25)', () => {
    it('requires auth for tools/list', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({ method: 'tools/list' });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });

    it('requires auth for initialize', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({ method: 'initialize' });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });

    it('requires auth for resources/list', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({ method: 'resources/list' });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });
  });

  describe('public resource authentication bypass', () => {
    it('requires auth for widget resources/read (removed from public list in WS3)', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
        params: { uri: WIDGET_URI },
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });

    it('skips auth for getting-started documentation resources/read', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
        params: { uri: 'docs://oak/getting-started.md' },
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('skips auth for tools documentation resources/read', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
        params: { uri: 'docs://oak/tools.md' },
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('requires auth for unknown resource URIs', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
        params: { uri: 'unknown://some/resource' },
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });

    it('requires auth for resources/read without uri param', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
        params: {},
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });

    it('requires auth for resources/read with malformed params', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'resources/read',
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });
  });

  describe('protected tools (auth required)', () => {
    it('requires auth for tools/call with OAuth tool', () => {
      const router = createMcpRouter({ auth: mockAuthMw });
      const req = createMockRequest({
        method: 'tools/call',
        params: { name: 'get-key-stages' },
      });

      router(req, mockRes, mockNext);

      expect(mockAuthMw).toHaveBeenCalled();
    });
  });
});
