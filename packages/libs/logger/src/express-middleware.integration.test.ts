import { describe, it, expect } from 'vitest';
import { extractRequestMetadata, logIncomingRequest, logRequestError } from './express-middleware';
import { isNormalizedError } from './error-normalisation';
import type { Logger } from './types';

describe('extractRequestMetadata', () => {
  it('should extract and sanitise basic request metadata', () => {
    const metadata = extractRequestMetadata({
      method: 'GET',
      url: '/api/test/123?foo=bar',
      path: '/api/test/123',
      headers: { 'content-type': 'application/json' },
      query: { foo: 'bar' },
      params: { id: '123' },
      ip: '127.0.0.1',
    });

    expect(metadata.method).toBe('GET');
    expect(metadata.url).toBe('/api/test/123?foo=bar');
    expect(metadata.path).toBe('/api/test/123');
    expect(metadata.query).toEqual({ foo: 'bar' });
    expect(metadata.params).toEqual({ id: '123' });
  });

  it('should handle nested ParsedQs types safely', () => {
    const metadata = extractRequestMetadata({
      method: 'GET',
      url: '/test',
      path: '/test',
      headers: {},
      query: { nested: { bar: 'baz' } },
      params: {},
    });

    expect(metadata.query).toMatchObject({ nested: { bar: 'baz' } });
  });

  it('should handle missing optional fields', () => {
    const metadata = extractRequestMetadata({
      method: 'POST',
      url: '/test',
      path: '/test',
      headers: {},
      query: {},
      params: {},
    });

    expect(metadata.method).toBe('POST');
    expect(metadata.url).toBe('/test');
  });
});

describe('createRequestLogger', () => {
  it('should log incoming requests with sanitised metadata', () => {
    const loggedMessages: { message: string; context?: unknown }[] = [];
    let nextCalls = 0;
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

    logIncomingRequest(
      mockLogger,
      {
        method: 'GET',
        url: '/test?mode=check',
        path: '/test',
        headers: { 'x-test': 'true' },
        query: { mode: 'check' },
        params: {},
        ip: '127.0.0.1',
      },
      () => {
        nextCalls += 1;
      },
    );

    expect(loggedMessages).toHaveLength(1);
    expect(loggedMessages[0].message).toBe('Incoming HTTP request');
    expect(loggedMessages[0].context).toMatchObject({
      method: 'GET',
      url: '/test?mode=check',
      path: '/test',
      query: { mode: 'check' },
    });
    expect(nextCalls).toBe(1);
  });

  it('should use the default debug level', () => {
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

    logIncomingRequest(
      mockLogger,
      {
        method: 'GET',
        url: '/test',
        path: '/test',
        headers: {},
        query: {},
        params: {},
      },
      () => undefined,
    );

    expect(loggedMessages).toHaveLength(1);
    expect(loggedMessages[0]).toEqual({
      level: 'debug',
      message: 'Incoming HTTP request',
    });
  });

  it('should use the configured log level', () => {
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

    logIncomingRequest(
      mockLogger,
      {
        method: 'GET',
        url: '/test',
        path: '/test',
        headers: {},
        query: {},
        params: {},
      },
      () => undefined,
      { level: 'info' },
    );

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

    logIncomingRequest(
      mockLogger,
      {
        method: 'POST',
        url: '/test',
        path: '/test',
        headers: {},
        query: {},
        params: {},
        body: { userId: '123' },
      },
      () => undefined,
      { includeBody: true },
    );

    expect(loggedMessages[0].context).toMatchObject({
      body: { userId: '123' },
    });
  });
});

describe('createErrorLogger', () => {
  it('should log errors with sanitised request context', () => {
    const loggedErrors: { message: string; error?: unknown; context?: unknown }[] = [];
    const forwardedErrors: unknown[] = [];
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

    const error = new Error('Test error');
    logRequestError(
      mockLogger,
      error,
      {
        method: 'GET',
        url: '/test',
        path: '/test',
        headers: {},
        query: {},
        params: {},
        ip: '127.0.0.1',
      },
      (forwardedError) => {
        forwardedErrors.push(forwardedError);
      },
    );

    expect(loggedErrors).toHaveLength(1);
    expect(isNormalizedError(loggedErrors[0].error)).toBe(true);
    expect(loggedErrors[0].message).toBe('HTTP request error');
    expect(loggedErrors[0].context).toMatchObject({
      method: 'GET',
      url: '/test',
    });
    expect(forwardedErrors).toEqual([error]);
  });
});
