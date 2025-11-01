/**
 * Integration tests for mock Clerk middleware
 * Validates that mock middleware behaves correctly when used in Express request flow
 */

import { describe, it, expect } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import { createMockClerkMiddleware, createMockMcpAuthClerk } from './mock-clerk-middleware.js';

describe('createMockClerkMiddleware', () => {
  it('attaches auth to request when valid token provided', () => {
    const middleware = createMockClerkMiddleware({
      validTokens: ['token-123'],
    });

    const req = {
      headers: { authorization: 'Bearer token-123' },
    } as Partial<Request> as Request;
    const res = {} as Response;
    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
    const reqWithAuth = req as { auth?: { userId?: string; sessionId?: string } };
    expect(reqWithAuth.auth).toBeDefined();
    expect(reqWithAuth.auth?.userId).toBe('test-user-123');
    expect(reqWithAuth.auth?.sessionId).toBe('test-session-456');
  });

  it('does not attach auth when invalid token provided', () => {
    const middleware = createMockClerkMiddleware({
      validTokens: ['token-123'],
    });

    const req = {
      headers: { authorization: 'Bearer token-invalid' },
    } as Partial<Request> as Request;
    const res = {} as Response;
    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
    const reqWithAuth = req as { auth?: { userId?: string } };
    expect(reqWithAuth.auth).toBeUndefined();
  });

  it('does not attach auth when no authorization header', () => {
    const middleware = createMockClerkMiddleware({
      validTokens: ['token-123'],
    });

    const req = {
      headers: {},
    } as Partial<Request> as Request;
    const res = {} as Response;
    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
    const reqWithAuth = req as { auth?: { userId?: string } };
    expect(reqWithAuth.auth).toBeUndefined();
  });

  it('allows multiple valid tokens', () => {
    const middleware = createMockClerkMiddleware({
      validTokens: ['token-1', 'token-2', 'token-3'],
    });

    for (const token of ['token-1', 'token-2', 'token-3']) {
      const req = {
        headers: { authorization: `Bearer ${token}` },
      } as Partial<Request> as Request;
      const res = {} as Response;
      let nextCalled = false;
      const next: NextFunction = () => {
        nextCalled = true;
      };

      middleware(req, res, next);

      expect(nextCalled).toBe(true);
      const reqWithAuth = req as { auth?: { userId?: string } };
      expect(reqWithAuth.auth).toBeDefined();
    }
  });

  it('handles case-insensitive Bearer prefix', () => {
    const middleware = createMockClerkMiddleware({
      validTokens: ['token-123'],
    });

    const req = {
      headers: { authorization: 'bearer token-123' },
    } as Partial<Request> as Request;
    const res = {} as Response;
    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
    const reqWithAuth = req as { auth?: { userId?: string } };
    expect(reqWithAuth.auth).toBeDefined();
  });

  it('skips authentication when shouldAuthenticate is false', () => {
    const middleware = createMockClerkMiddleware({
      shouldAuthenticate: false,
    });

    const req = {
      headers: {},
    } as Partial<Request> as Request;
    const res = {} as Response;
    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
    const reqWithAuth = req as { auth?: { userId?: string } };
    expect(reqWithAuth.auth).toBeUndefined();
  });
});

describe('createMockMcpAuthClerk', () => {
  it('allows request when auth is present', () => {
    const middleware = createMockMcpAuthClerk();

    const req = {
      auth: { userId: 'user-123' },
    } as Partial<Request> as { auth?: { userId?: string } } as Request;
    const res = {
      statusCode: 0,
      setHeader: () => undefined,
      json: () => undefined,
    } as unknown as Response;
    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    expect(nextCalled).toBe(true);
    expect(res.statusCode).not.toBe(401);
  });

  it('rejects request with 401 when auth is missing', () => {
    const middleware = createMockMcpAuthClerk();

    const req = {
      headers: {},
    } as Partial<Request> as Request;
    let statusCode = 0;
    let setHeaderCalled = false;
    let jsonCalled = false;
    const res = {
      get statusCode() {
        return statusCode;
      },
      set statusCode(val: number) {
        statusCode = val;
      },
      setHeader: (() => {
        setHeaderCalled = true;
        return res;
      }) as Response['setHeader'],
      status: ((code: number) => {
        statusCode = code;
        return {
          json: () => {
            jsonCalled = true;
            return res;
          },
        };
      }) as Response['status'],
      json: (() => {
        jsonCalled = true;
      }) as Response['json'],
    } as unknown as Response;
    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    expect(nextCalled).toBe(false);
    expect(statusCode).toBe(401);
    expect(setHeaderCalled).toBe(true);
    expect(jsonCalled).toBe(true);
  });

  it('rejects request with 401 when auth.userId is missing', () => {
    const middleware = createMockMcpAuthClerk();

    const req = {
      auth: {},
    } as Partial<Request> as { auth?: { userId?: string } } as Request;
    let statusCode = 0;
    const res = {
      get statusCode() {
        return statusCode;
      },
      set statusCode(val: number) {
        statusCode = val;
      },
      setHeader: () => res,
      status: ((code: number) => {
        statusCode = code;
        return res;
      }) as Response['status'],
      json: () => res,
    } as unknown as Response;
    let nextCalled = false;
    const next: NextFunction = () => {
      nextCalled = true;
    };

    middleware(req, res, next);

    expect(nextCalled).toBe(false);
    expect(statusCode).toBe(401);
  });

  it('sets WWW-Authenticate header in 401 response', () => {
    const middleware = createMockMcpAuthClerk();

    const req = {
      headers: {},
    } as Partial<Request> as Request;
    let headerName = '';
    let headerValue = '';
    let _statusCode = 0;
    const res = {
      get statusCode() {
        return _statusCode;
      },
      set statusCode(val: number) {
        _statusCode = val;
      },
      setHeader: ((name: string, value: string) => {
        headerName = name;
        headerValue = value;
        return res;
      }) as Response['setHeader'],
      status: ((code: number) => {
        _statusCode = code;
        return res;
      }) as Response['status'],
      json: () => res,
    } as unknown as Response;
    const next: NextFunction = () => {
      // Should not be called
    };

    middleware(req, res, next);

    expect(headerName).toBe('WWW-Authenticate');
    expect(headerValue).toContain('Bearer');
    expect(headerValue).toContain('/.well-known/oauth-protected-resource');
  });
});

describe('Mock Clerk middleware composition', () => {
  it('works correctly when both middlewares are chained', () => {
    const clerkMiddleware = createMockClerkMiddleware({
      validTokens: ['token-123'],
    });
    const mcpAuthMiddleware = createMockMcpAuthClerk();

    const req = {
      headers: { authorization: 'Bearer token-123' },
    } as Partial<Request> as Request;
    const res = {
      statusCode: 0,
      setHeader: () => undefined,
      json: () => undefined,
    } as unknown as Response;
    let clerkNextCalled = false;
    let mcpAuthNextCalled = false;

    clerkMiddleware(req, res, () => {
      clerkNextCalled = true;
      mcpAuthMiddleware(req, res, () => {
        mcpAuthNextCalled = true;
      });
    });

    expect(clerkNextCalled).toBe(true);
    expect(mcpAuthNextCalled).toBe(true);
    expect(res.statusCode).not.toBe(401);
  });

  it('rejects when clerkMiddleware does not attach auth and mcpAuthClerk runs', () => {
    const clerkMiddleware = createMockClerkMiddleware({
      validTokens: ['token-123'],
    });
    const mcpAuthMiddleware = createMockMcpAuthClerk();

    const req = {
      headers: { authorization: 'Bearer invalid-token' },
    } as Partial<Request> as Request;
    let statusCode = 0;
    const res = {
      get statusCode() {
        return statusCode;
      },
      set statusCode(val: number) {
        statusCode = val;
      },
      setHeader: () => res,
      status: ((code: number) => {
        statusCode = code;
        return res;
      }) as Response['status'],
      json: () => res,
    } as unknown as Response;
    let clerkNextCalled = false;

    clerkMiddleware(req, res, () => {
      clerkNextCalled = true;
      mcpAuthMiddleware(req, res, () => {
        // Should not be called
      });
    });

    expect(clerkNextCalled).toBe(true);
    expect(statusCode).toBe(401);
  });
});
