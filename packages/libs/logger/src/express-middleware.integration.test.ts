import { describe, it, expect, vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';
import {
  createRequestLogger,
  createErrorLogger,
  extractRequestMetadata,
} from './express-middleware';
import type { Logger } from './types';

describe('extractRequestMetadata', () => {
  it('should extract and sanitise basic request metadata', () => {
    const mockReq = {
      method: 'GET',
      url: '/api/test',
      path: '/api/test',
      headers: { 'content-type': 'application/json' },
      query: { foo: 'bar' },
      params: { id: '123' },
      ip: '127.0.0.1',
    } as unknown as Request;

    const metadata = extractRequestMetadata(mockReq);

    expect(metadata.method).toBe('GET');
    expect(metadata.url).toBe('/api/test');
    expect(metadata.query).toEqual({ foo: 'bar' });
    expect(metadata.params).toEqual({ id: '123' });
  });

  it('should handle undefined and ParsedQs types safely', () => {
    const mockReq = {
      method: 'GET',
      url: '/test',
      path: '/test',
      query: { foo: undefined, nested: { bar: 'baz' } },
      params: {},
      headers: {},
      ip: '127.0.0.1',
    } as unknown as Request;

    const metadata = extractRequestMetadata(mockReq);
    // undefined should be converted to null or stripped
    expect(metadata.query).not.toHaveProperty('foo', undefined);
    expect((metadata.query as { nested?: unknown }).nested).toEqual({ bar: 'baz' });
  });

  it('should handle missing optional fields', () => {
    const mockReq = {
      method: 'POST',
      url: '/test',
      path: '/test',
      headers: {},
      query: {},
      params: {},
    } as unknown as Request;

    const metadata = extractRequestMetadata(mockReq);
    expect(metadata.method).toBe('POST');
    expect(metadata.url).toBe('/test');
  });
});

describe('createRequestLogger', () => {
  it('should log incoming requests with sanitised metadata', () => {
    const loggedMessages: { message: string; context?: unknown }[] = [];
    const mockLogger: Logger = {
      trace: () => {
        // Mock implementation
      },
      debug: (msg: string, ctx?: unknown) => loggedMessages.push({ message: msg, context: ctx }),
      info: (msg: string, ctx?: unknown) => loggedMessages.push({ message: msg, context: ctx }),
      warn: () => {
        // Mock implementation
      },
      error: () => {
        // Mock implementation
      },
      fatal: () => {
        // Mock implementation
      },
    };

    const middleware = createRequestLogger(mockLogger);
    const mockReq = {
      method: 'GET',
      url: '/test',
      path: '/test',
      headers: {},
      query: {},
      params: {},
      ip: '127.0.0.1',
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn() as NextFunction;

    middleware(mockReq, mockRes, mockNext);

    expect(loggedMessages).toHaveLength(1);
    expect(loggedMessages[0].message).toBe('Incoming HTTP request');
    expect(loggedMessages[0].context).toMatchObject({
      method: 'GET',
      url: '/test',
    });
    expect(mockNext).toHaveBeenCalledOnce();
  });

  it('should use specified log level', () => {
    const loggedMessages: { level: string; message: string }[] = [];
    const mockLogger: Logger = {
      trace: (msg: string) => loggedMessages.push({ level: 'trace', message: msg }),
      debug: (msg: string) => loggedMessages.push({ level: 'debug', message: msg }),
      info: (msg: string) => loggedMessages.push({ level: 'info', message: msg }),
      warn: () => {
        // Mock implementation
      },
      error: () => {
        // Mock implementation
      },
      fatal: () => {
        // Mock implementation
      },
    };

    const middleware = createRequestLogger(mockLogger, { level: 'info' });
    const mockReq = {
      method: 'GET',
      url: '/test',
      path: '/test',
      headers: {},
      query: {},
      params: {},
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn() as NextFunction;

    middleware(mockReq, mockRes, mockNext);

    expect(loggedMessages).toHaveLength(1);
    expect(loggedMessages[0].level).toBe('info');
  });

  it('should include request body when includeBody is true', () => {
    const loggedMessages: { context?: unknown }[] = [];
    const mockLogger: Logger = {
      trace: () => {
        // Mock implementation
      },
      debug: (_msg: string, ctx?: unknown) => loggedMessages.push({ context: ctx }),
      info: () => {
        // Mock implementation
      },
      warn: () => {
        // Mock implementation
      },
      error: () => {
        // Mock implementation
      },
      fatal: () => {
        // Mock implementation
      },
    };

    const middleware = createRequestLogger(mockLogger, { includeBody: true });
    const mockReq = {
      method: 'POST',
      url: '/test',
      path: '/test',
      headers: {},
      query: {},
      params: {},
      body: { userId: '123' },
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn() as NextFunction;

    middleware(mockReq, mockRes, mockNext);

    expect(loggedMessages[0].context).toMatchObject({
      body: { userId: '123' },
    });
  });
});

describe('createErrorLogger', () => {
  it('should log errors with sanitised request context', () => {
    const loggedErrors: { message: string; error?: unknown; context?: unknown }[] = [];
    const mockLogger: Logger = {
      trace: () => {
        // Mock implementation
      },
      debug: () => {
        // Mock implementation
      },
      info: () => {
        // Mock implementation
      },
      warn: () => {
        // Mock implementation
      },
      error: (msg: string, err?: unknown, ctx?: unknown) =>
        loggedErrors.push({ message: msg, error: err, context: ctx }),
      fatal: () => {
        // Mock implementation
      },
    };

    const middleware = createErrorLogger(mockLogger);
    const error = new Error('Test error');
    const mockReq = {
      method: 'POST',
      url: '/test',
      path: '/test',
      headers: {},
      query: {},
      params: {},
      ip: '127.0.0.1',
    } as unknown as Request;
    const mockRes = {} as Response;
    const mockNext = vi.fn() as NextFunction;

    middleware(error, mockReq, mockRes, mockNext);

    expect(loggedErrors).toHaveLength(1);
    expect(loggedErrors[0].error).toBe(error);
    expect(loggedErrors[0].message).toBe('HTTP request error');
    expect(loggedErrors[0].context).toMatchObject({
      method: 'POST',
      url: '/test',
    });
    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
