/**
 * Integration Tests: Tool Handler Auth Error Interception
 *
 * Tests that tool handlers intercept auth errors and emit MCP-compliant
 * _meta responses per ADR-054.
 *
 * Part of Phase 2, Sub-Phase 2.7, Task 2.7.5-2.7.6 (RED then GREEN)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { registerHandlers } from './handlers.js';
import {
  createMockDeps,
  createMockServer,
  createMockLogger,
  createMockRuntimeConfig,
  createAuthErrorResult,
  createClerkErrorResult,
  createNonAuthErrorResult,
  getHandler,
} from './test-helpers/auth-error-test-helpers.js';

/**
 * Helper: Assert authentication error response structure
 */
function assertAuthErrorResponse(
  result: unknown,
  expectedErrorPattern: RegExp,
): asserts result is {
  isError: true;
  content: { type: string; text: string }[];
  _meta: { 'mcp/www_authenticate': string[] };
} {
  expect(result).toHaveProperty('isError', true);
  expect(result).toHaveProperty('content');
  expect(result).toHaveProperty('_meta');

  const typedResult = result as {
    content: { type: string; text: string }[];
    _meta: { 'mcp/www_authenticate': string[] };
  };

  expect(Array.isArray(typedResult.content)).toBe(true);
  expect(typedResult.content.length).toBeGreaterThan(0);
  expect(typedResult.content[0]?.type).toBe('text');
  expect(typedResult.content[0]?.text).toContain('Authentication Error');

  expect(Array.isArray(typedResult._meta['mcp/www_authenticate'])).toBe(true);
  expect(typedResult._meta['mcp/www_authenticate'].length).toBeGreaterThan(0);
  expect(typedResult._meta['mcp/www_authenticate'][0]).toMatch(expectedErrorPattern);
}

/**
 * Helper: Assert logger was called with auth error context
 */
function assertAuthErrorLogged(
  logger: ReturnType<typeof createMockLogger>,
  expectedToolName: string,
  expectedErrorType: string,
  descriptionContains?: string,
): void {
  expect(logger.warn).toHaveBeenCalled();
  const warnCalls = vi.mocked(logger.warn).mock.calls;
  expect(warnCalls.length).toBeGreaterThan(0);
  const [message, context] = warnCalls[0];
  expect(message).toBe('Tool execution auth error');
  const logContext = context as { toolName: string; errorType: string; description: string };
  expect(logContext.toolName).toBe(expectedToolName);
  expect(logContext.errorType).toBe(expectedErrorType);
  if (descriptionContains) {
    expect(logContext.description).toContain(descriptionContains);
  }
}

describe('Tool Handler Auth Error Interception (Integration)', () => {
  let mockServer: ReturnType<typeof createMockServer>;
  let mockLogger: ReturnType<typeof createMockLogger>;
  let runtimeConfig: ReturnType<typeof createMockRuntimeConfig>;
  let capturedHandlers: Map<string, (params: unknown) => Promise<unknown>>;

  beforeEach(() => {
    capturedHandlers = new Map();
    mockServer = createMockServer(capturedHandlers);
    mockLogger = createMockLogger();
    runtimeConfig = createMockRuntimeConfig();
  });

  describe('Upstream Auth Errors', () => {
    it('should emit _meta on Oak API 401 error', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      // Use public tool (get-changelog) to bypass MCP client auth and test upstream API auth
      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      assertAuthErrorResponse(result, /Bearer.*error="invalid_token"/);
      assertAuthErrorLogged(mockLogger, 'get-changelog', 'invalid_token', 'Unauthorized');
    });

    it('should emit _meta on Oak API 403 error', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(403, 'Forbidden')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      // Use public tool (get-changelog) to bypass MCP client auth and test upstream API auth
      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      expect(result).toHaveProperty('isError', true);
      expect(result).toHaveProperty('_meta');

      const typedResult = result as { _meta: { 'mcp/www_authenticate': string[] } };
      expect(Array.isArray(typedResult._meta['mcp/www_authenticate'])).toBe(true);
      expect(typedResult._meta['mcp/www_authenticate'].length).toBeGreaterThan(0);
      expect(typedResult._meta['mcp/www_authenticate'][0]).toMatch(
        /Bearer.*error="insufficient_scope"/,
      );

      assertAuthErrorLogged(mockLogger, 'get-changelog', 'insufficient_scope');
    });

    it('should emit _meta on Clerk token verification failure', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createClerkErrorResult('Clerk: token verification failed')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      // Use public tool (get-changelog) to bypass MCP client auth and test upstream API auth
      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      expect(result).toHaveProperty('isError', true);
      expect(result).toHaveProperty('_meta');

      const typedResult = result as { _meta: { 'mcp/www_authenticate': string[] } };
      expect(Array.isArray(typedResult._meta['mcp/www_authenticate'])).toBe(true);
      expect(typedResult._meta['mcp/www_authenticate'].length).toBeGreaterThan(0);
      expect(typedResult._meta['mcp/www_authenticate'][0]).toMatch(/^Bearer/);
    });

    it('should emit _meta with token_expired for expired token errors', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Token has expired')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      const handler = getHandler(capturedHandlers, 'get-changelog');
      await handler({});

      assertAuthErrorLogged(mockLogger, 'get-changelog', 'token_expired');
    });
  });

  describe('Error Response Structure', () => {
    it('should include content array with user-friendly message', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      expect(result).toHaveProperty('content');
      const errorResult = result as { content: unknown };
      expect(Array.isArray(errorResult.content)).toBe(true);
      const content = errorResult.content as { type: string; text: string }[];
      expect(content[0]?.type).toBe('text');
      expect(content[0]?.text).toContain('Authentication Error');
    });

    it('should set isError to true', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      expect(result).toHaveProperty('isError', true);
    });

    it('should include RFC 6750 compliant WWW-Authenticate format in _meta', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      const metaResult = result as { _meta?: { 'mcp/www_authenticate'?: string[] } };
      const wwwAuth = metaResult._meta?.['mcp/www_authenticate']?.[0];
      expect(wwwAuth).toBeDefined();
      if (!wwwAuth) {
        throw new Error('WWW-Authenticate header missing');
      }
      expect(wwwAuth).toMatch(/^Bearer /);
      expect(wwwAuth).toContain('resource_metadata=');
      expect(wwwAuth).toContain('error=');
      expect(wwwAuth).toContain('error_description=');
      expect(wwwAuth).toContain('https://test.example.com/.well-known/oauth-protected-resource');
    });
  });

  describe('Observability', () => {
    it('should log with toolName', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      const handler = getHandler(capturedHandlers, 'get-changelog');
      await handler({});

      expect(mockLogger.warn).toHaveBeenCalled();
      const warnCalls = vi.mocked(mockLogger.warn).mock.calls;
      expect(warnCalls.length).toBeGreaterThan(0);
      const [message, context] = warnCalls[0];
      expect(message).toBe('Tool execution auth error');
      const logContext = context as { toolName: string; errorType: string };
      expect(logContext.toolName).toBe('get-changelog');
      expect(typeof logContext.errorType).toBe('string');
    });

    it('should log with errorType', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      const handler = getHandler(capturedHandlers, 'get-changelog');
      await handler({});

      assertAuthErrorLogged(mockLogger, 'get-changelog', 'invalid_token');
    });

    it('should log with description context', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Custom auth error')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      const handler = getHandler(capturedHandlers, 'get-changelog');
      await handler({});

      expect(mockLogger.warn).toHaveBeenCalled();
      const warnCalls = vi.mocked(mockLogger.warn).mock.calls;
      expect(warnCalls.length).toBeGreaterThan(0);
      const [message, context] = warnCalls[0];
      expect(message).toBe('Tool execution auth error');
      const logContext = context as { toolName: string; errorType: string; description: string };
      expect(logContext.toolName).toBe('get-changelog');
      expect(typeof logContext.errorType).toBe('string');
      expect(logContext.description).toContain('Custom auth error');
    });
  });

  describe('Non-Auth Errors', () => {
    it('should NOT emit _meta for validation errors', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createNonAuthErrorResult('Validation failed: missing required field')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      expect(result).not.toHaveProperty('_meta');
      expect(mockLogger.warn).not.toHaveBeenCalledWith(
        'Tool execution auth error',
        expect.any(Object),
      );
    });

    it('should NOT emit _meta for network errors (non-auth)', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createNonAuthErrorResult('ECONNREFUSED')),
      );

      registerHandlers(mockServer, { runtimeConfig, logger: mockLogger, overrides });

      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      expect(result).not.toHaveProperty('_meta');
      expect(mockLogger.warn).not.toHaveBeenCalledWith(
        'Tool execution auth error',
        expect.any(Object),
      );
    });
  });
});
