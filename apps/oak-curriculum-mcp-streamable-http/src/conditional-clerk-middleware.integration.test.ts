import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { createConditionalClerkMiddleware } from './conditional-clerk-middleware.js';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools';
import {
  createFakeLogger,
  createFakeExpressRequest,
  createFakeResponse,
} from './test-helpers/fakes.js';
import type { Logger } from '@oaknational/mcp-logger';

/**
 * Integration tests for conditional Clerk middleware.
 *
 * Tests that the middleware correctly delegates to or skips clerkMiddleware
 * based on request properties. Uses simple mocks injected as arguments.
 *
 * Per MCP 2025-11-25: All MCP methods require auth. Path-based and public
 * resource skips remain for non-MCP routes (health, OAuth metadata, widget).
 */
describe('createConditionalClerkMiddleware (Integration)', () => {
  let mockClerkMw: RequestHandler;
  let mockLogger: Logger;
  let mockNext: NextFunction;
  let mockRes: Response;

  beforeEach(() => {
    // Mock clerkMiddleware that simulates auth context setup by calling next()
    mockClerkMw = vi.fn().mockImplementation((req: Request, res: Response, next: NextFunction) => {
      // Use parameters to avoid unused variable errors - these would be used by real clerkMiddleware
      void req;
      void res;
      next();
    });

    mockLogger = createFakeLogger();

    mockNext = vi.fn();
    mockRes = createFakeResponse();
  });

  describe('when clerkMiddleware is applied', () => {
    it('calls clerkMiddleware for non-MCP paths', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/api/other', undefined);

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).toHaveBeenCalledWith(req, mockRes, mockNext);
      expect(mockLogger.debug).not.toHaveBeenCalled();
    });

    it('calls clerkMiddleware for tools/call on /mcp', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', {
        method: 'tools/call',
        params: { name: 'get-key-stages' },
      });

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).toHaveBeenCalledWith(req, mockRes, mockNext);
    });

    it('calls clerkMiddleware for resources/read on /mcp', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', {
        method: 'resources/read',
        params: { uri: 'curriculum://ontology' },
      });

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).toHaveBeenCalledWith(req, mockRes, mockNext);
    });

    it('calls clerkMiddleware for /mcp with no body', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', undefined);

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).toHaveBeenCalledWith(req, mockRes, mockNext);
    });
  });

  describe('discovery methods require clerkMiddleware (MCP 2025-11-25)', () => {
    it('runs clerkMiddleware for initialize on /mcp', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', { method: 'initialize' });

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).toHaveBeenCalledWith(req, mockRes, mockNext);
    });

    it('runs clerkMiddleware for tools/list on /mcp', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', { method: 'tools/list' });

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).toHaveBeenCalledWith(req, mockRes, mockNext);
    });
  });

  describe('path-based skips (non-MCP routes)', () => {
    it('skips clerkMiddleware for /.well-known/oauth-protected-resource', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/.well-known/oauth-protected-resource', undefined);

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
      expect(mockLogger.debug).toHaveBeenCalledWith(
        'clerkMiddleware skipped for discovery/public method',
        expect.objectContaining({ path: '/.well-known/oauth-protected-resource' }),
      );
    });

    it('skips clerkMiddleware for /healthz', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/healthz', undefined);

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('middleware chain behavior', () => {
    it('passes through when clerkMiddleware calls next()', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', {
        method: 'tools/call',
        params: { name: 'get-key-stages' },
      });

      conditionalMw(req, mockRes, mockNext);

      // clerkMiddleware was called and called next()
      expect(mockClerkMw).toHaveBeenCalled();
      // The mockClerkMw calls next(), so next is called
      expect(mockNext).toHaveBeenCalled();
    });

    it('does not call next() when clerkMiddleware does not call next()', () => {
      // Simulate clerkMiddleware that responds without calling next (e.g. auth failure)
      const blockingClerkMw: RequestHandler = vi.fn();
      const conditionalMw = createConditionalClerkMiddleware(blockingClerkMw, mockLogger);
      const req = createMockRequest('/mcp', {
        method: 'tools/call',
        params: { name: 'get-key-stages' },
      });

      conditionalMw(req, mockRes, mockNext);

      expect(blockingClerkMw).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('public resource authentication bypass', () => {
    it('skips clerkMiddleware for widget resources/read', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', {
        method: 'resources/read',
        params: { uri: WIDGET_URI },
      });

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('skips clerkMiddleware for documentation resources/read', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', {
        method: 'resources/read',
        params: { uri: 'docs://oak/getting-started.md' },
      });

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });

    it('runs clerkMiddleware for unknown resource URIs', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', {
        method: 'resources/read',
        params: { uri: 'unknown://some/resource' },
      });

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).toHaveBeenCalled();
    });

    it('runs clerkMiddleware for resources/read without uri param', () => {
      const conditionalMw = createConditionalClerkMiddleware(mockClerkMw, mockLogger);
      const req = createMockRequest('/mcp', {
        method: 'resources/read',
        params: {},
      });

      conditionalMw(req, mockRes, mockNext);

      expect(mockClerkMw).toHaveBeenCalled();
    });
  });
});

/**
 * Creates a mock Express Request for testing.
 */
function createMockRequest(path: string, body: unknown): Request {
  return createFakeExpressRequest({ path, body, method: 'POST' });
}
