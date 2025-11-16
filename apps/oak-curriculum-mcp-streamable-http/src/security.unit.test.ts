import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { createWebSecurityMiddleware } from './security.js';

/**
 * Unit tests for createWebSecurityMiddleware function.
 *
 * Tests the combined web security middleware that chains DNS rebinding
 * protection and CORS in a single middleware handler.
 */
describe('createWebSecurityMiddleware', () => {
  describe('DNS rebinding protection', () => {
    it('should block requests with invalid Host header', () => {
      const middleware = createWebSecurityMiddleware('stateless', ['localhost'], undefined);

      const req = {
        headers: { host: 'evil.com' },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: host not allowed' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow requests with valid Host header', () => {
      const middleware = createWebSecurityMiddleware('stateless', ['localhost'], undefined);

      const req = {
        headers: { host: 'localhost:3333' },
      } as Request;
      const res = {
        setHeader: vi.fn(),
        getHeader: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      // Should NOT be blocked by DNS rebinding protection
      expect(next).toHaveBeenCalled();
    });

    it('should block requests with missing Host header', () => {
      const middleware = createWebSecurityMiddleware('stateless', ['localhost'], undefined);

      const req = {
        headers: {},
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: missing Host header' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow requests with IPv6 Host header', () => {
      const middleware = createWebSecurityMiddleware('stateless', ['::1'], undefined);

      const req = {
        headers: { host: '[::1]:3333' },
      } as Request;
      const res = {
        setHeader: vi.fn(),
        getHeader: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      // Should NOT be blocked by DNS rebinding protection
      expect(next).toHaveBeenCalled();
    });

    it('should block requests with invalid IPv6 Host header', () => {
      const middleware = createWebSecurityMiddleware('stateless', ['localhost'], undefined);

      const req = {
        headers: { host: '[::1]:3333' },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: host not allowed' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should block requests with malformed IPv6 Host header', () => {
      const middleware = createWebSecurityMiddleware('stateless', ['::1'], undefined);

      const req = {
        headers: { host: '[::1:3333' }, // Missing closing bracket
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: invalid Host header format' });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('CORS behavior', () => {
    it('should add CORS headers when Origin is present and no allow-list', () => {
      const middleware = createWebSecurityMiddleware('stateless', ['localhost'], undefined);

      const req = {
        method: 'GET',
        headers: {
          host: 'localhost',
          origin: 'http://example.com',
        },
      } as Request;
      const res = {
        setHeader: vi.fn(),
        getHeader: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      // CORS middleware should set headers
      expect(res.setHeader).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });

    it('should allow requests without Origin header', () => {
      const middleware = createWebSecurityMiddleware('stateless', ['localhost'], undefined);

      const req = {
        method: 'GET',
        headers: {
          host: 'localhost',
        },
      } as Request;
      const res = {
        setHeader: vi.fn(),
        getHeader: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      // Should not block requests without Origin (server-to-server)
      expect(next).toHaveBeenCalled();
    });
  });

  describe('middleware chaining order', () => {
    it('should apply DNS protection before CORS', () => {
      const middleware = createWebSecurityMiddleware('stateless', ['localhost'], undefined);

      const req = {
        headers: {
          host: 'evil.com',
          origin: 'http://example.com',
        },
      } as Request;
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn().mockReturnThis(),
        setHeader: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      // Should be blocked by DNS protection BEFORE CORS runs
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden: host not allowed' });
      // CORS headers should NOT be set because middleware chain stopped
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('session mode support', () => {
    it('should work in session mode', () => {
      const middleware = createWebSecurityMiddleware('session', ['localhost'], undefined);

      const req = {
        method: 'GET',
        headers: {
          host: 'localhost',
        },
      } as Request;
      const res = {
        setHeader: vi.fn(),
        getHeader: vi.fn(),
      } as unknown as Response;
      const next = vi.fn() as NextFunction;

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
