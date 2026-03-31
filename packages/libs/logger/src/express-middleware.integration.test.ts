import { REDACTED_VALUE } from '@oaknational/observability';
import { describe, it, expect } from 'vitest';
import {
  createErrorLogger,
  createRequestLogger,
  extractRequestMetadata,
  logIncomingRequest,
  logRequestError,
} from './express-middleware';
import { isNormalizedError } from './error-normalisation';
import type { Logger } from './types';

function invokeRequestMiddleware(
  middleware: ReturnType<typeof createRequestLogger>,
  request: Parameters<typeof logIncomingRequest>[1],
  next: Parameters<typeof logIncomingRequest>[2],
): void {
  Reflect.apply(middleware, undefined, [request, {}, next]);
}

function invokeErrorMiddleware(
  middleware: ReturnType<typeof createErrorLogger>,
  error: Error,
  request: Parameters<typeof logRequestError>[2],
  next: Parameters<typeof logRequestError>[3],
): void {
  Reflect.apply(middleware, undefined, [error, request, {}, next]);
}

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
    expect(metadata.ip).toBe(REDACTED_VALUE);
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

  it('should redact sensitive headers by default', () => {
    const metadata = extractRequestMetadata({
      method: 'GET',
      url: '/test?code=secret-code&safe=value',
      path: '/test',
      headers: {
        authorization: 'Bearer super-secret',
        cookie: 'session=secret',
        accept: 'application/json',
      },
      query: {
        token: 'secret-token',
        safe: 'value',
      },
      params: {},
      ip: '127.0.0.1',
    });

    expect(metadata.headers).toMatchObject({
      authorization: REDACTED_VALUE,
      cookie: REDACTED_VALUE,
      accept: 'application/json',
    });
    expect(metadata.url).toBe('/test?code=%5BREDACTED%5D&safe=value');
    expect(metadata.query).toMatchObject({
      token: REDACTED_VALUE,
      safe: 'value',
    });
    expect(metadata.ip).toBe(REDACTED_VALUE);
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
      ip: REDACTED_VALUE,
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
        body: { userId: '123', token: 'secret-token' },
      },
      () => undefined,
      { includeBody: true },
    );

    expect(loggedMessages[0].context).toMatchObject({
      body: { userId: '123', token: '[REDACTED]' },
    });
  });

  it('should forward wrapper options into request logging', () => {
    const loggedMessages: { level: string; context?: unknown }[] = [];
    let nextCalls = 0;
    const mockLogger: Logger = {
      trace: () => {
        // Mock implementation
      },
      debug: (_msg: string, ctx?: unknown) => loggedMessages.push({ level: 'debug', context: ctx }),
      info: (_msg: string, ctx?: unknown) => loggedMessages.push({ level: 'info', context: ctx }),
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

    const middleware = createRequestLogger(mockLogger, {
      level: 'info',
      includeBody: true,
    });

    invokeRequestMiddleware(
      middleware,
      {
        method: 'POST',
        url: '/test',
        path: '/test',
        headers: {
          authorization: 'Bearer super-secret',
        },
        query: {},
        params: {},
        body: { userId: '123' },
      },
      () => {
        nextCalls += 1;
      },
    );

    expect(loggedMessages).toHaveLength(1);
    expect(loggedMessages[0]).toMatchObject({
      level: 'info',
      context: {
        body: { userId: '123' },
        headers: {
          authorization: REDACTED_VALUE,
        },
      },
    });
    expect(nextCalls).toBe(1);
  });

  it('should continue the request pipeline if request logging throws', () => {
    let nextCalls = 0;
    const mockLogger: Logger = {
      trace: () => {
        // Mock implementation
      },
      debug: () => {
        throw new Error('sink failure');
      },
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

    expect(() =>
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
        () => {
          nextCalls += 1;
        },
      ),
    ).not.toThrow();

    expect(nextCalls).toBe(1);
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
        headers: {
          authorization: 'Bearer super-secret',
        },
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
      headers: {
        authorization: REDACTED_VALUE,
      },
      ip: REDACTED_VALUE,
    });
    expect(forwardedErrors).toEqual([error]);
  });

  it('should allow custom header redaction for error logs', () => {
    const loggedErrors: { context?: unknown }[] = [];
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
      error: (_msg: string, _err?: unknown, ctx?: unknown) => loggedErrors.push({ context: ctx }),
      fatal: () => {
        // Mock implementation
      },
    };

    logRequestError(
      mockLogger,
      new Error('Test error'),
      {
        method: 'GET',
        url: '/test',
        path: '/test',
        headers: {
          authorization: 'Bearer super-secret',
          accept: 'application/json',
        },
        query: {},
        params: {},
      },
      () => undefined,
      {
        redactHeaders: (headers) => ({
          authorization: `custom:${String(headers.authorization)}`,
          accept: String(headers.accept),
        }),
      },
    );

    expect(loggedErrors[0].context).toMatchObject({
      headers: {
        authorization: '[REDACTED]',
        accept: 'application/json',
      },
    });
  });

  it('should forward wrapper options into error logging', () => {
    const loggedErrors: { context?: unknown }[] = [];
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
      error: (_msg: string, _err?: unknown, ctx?: unknown) => loggedErrors.push({ context: ctx }),
      fatal: () => {
        // Mock implementation
      },
    };

    const middleware = createErrorLogger(mockLogger, {
      redactHeaders: (headers) => ({
        authorization: `custom:${String(headers.authorization)}`,
      }),
    });
    const error = new Error('Test error');

    invokeErrorMiddleware(
      middleware,
      error,
      {
        method: 'GET',
        url: '/test',
        path: '/test',
        headers: {
          authorization: 'Bearer super-secret',
        },
        query: {},
        params: {},
      },
      (forwardedError) => {
        forwardedErrors.push(forwardedError);
      },
    );

    expect(loggedErrors[0].context).toMatchObject({
      headers: {
        authorization: '[REDACTED]',
      },
    });
    expect(forwardedErrors).toEqual([error]);
  });

  it('should continue the error pipeline if error logging throws', () => {
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
      error: () => {
        throw new Error('sink failure');
      },
      fatal: () => {
        // Mock implementation
      },
    };
    const error = new Error('Test error');

    expect(() =>
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
        },
        (forwardedError) => {
          forwardedErrors.push(forwardedError);
        },
      ),
    ).not.toThrow();

    expect(forwardedErrors).toEqual([error]);
  });
});
