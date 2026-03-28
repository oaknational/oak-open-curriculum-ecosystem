/**
 * Integration Tests: Tool Handler Auth Error Interception
 *
 * Tests that tool handlers intercept auth errors and emit MCP-compliant
 * _meta responses per ADR-054.
 *
 * Covers upstream auth errors (401/403/Clerk) and error response structure.
 * Observability and non-auth error tests are in the companion file
 * `handlers-auth-errors-observability.integration.test.ts`.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { registerHandlers } from './handlers.js';
import {
  createMockDeps,
  createMockServer,
  createMockLogger,
  createMockRuntimeConfig,
  createAuthErrorResult,
  createClerkErrorResult,
  getHandler,
  assertAuthErrorResponse,
  assertAuthErrorLogged,
} from './test-helpers/auth-error-test-helpers.js';
import { createFakeSearchRetrieval } from './test-helpers/fakes.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

describe('Tool Handler Auth Error Interception (Integration)', () => {
  let mockServer: ReturnType<typeof createMockServer>;
  let mockLogger: ReturnType<typeof createMockLogger>;
  let runtimeConfig: ReturnType<typeof createMockRuntimeConfig>;
  let capturedHandlers: Map<string, (params: unknown) => Promise<CallToolResult>>;

  beforeEach(() => {
    capturedHandlers = new Map();
    mockServer = createMockServer(capturedHandlers);
    mockLogger = createMockLogger();
    runtimeConfig = createMockRuntimeConfig();
  });

  function registerWithOverrides(overrides: ReturnType<typeof createMockDeps>): void {
    registerHandlers(mockServer, {
      runtimeConfig,
      logger: mockLogger,
      overrides,
      searchRetrieval: createFakeSearchRetrieval(),
    });
  }

  describe('Upstream Auth Errors', () => {
    it('should emit _meta on Oak API 401 error', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );
      registerWithOverrides(overrides);

      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      assertAuthErrorResponse(result, /Bearer.*error="invalid_token"/);
      assertAuthErrorLogged(mockLogger, 'get-changelog', 'invalid_token', 'Unauthorized');
    });

    it('should emit _meta on Oak API 403 error', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(403, 'Forbidden')),
      );
      registerWithOverrides(overrides);

      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      assertAuthErrorResponse(result, /Bearer.*error="insufficient_scope"/);
      assertAuthErrorLogged(mockLogger, 'get-changelog', 'insufficient_scope');
    });

    it('should emit _meta on Clerk token verification failure', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createClerkErrorResult('Clerk: token verification failed')),
      );
      registerWithOverrides(overrides);
      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      assertAuthErrorResponse(result, /^Bearer/);
    });

    it('should emit _meta with token_expired for expired token errors', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Token has expired')),
      );
      registerWithOverrides(overrides);

      const handler = getHandler(capturedHandlers, 'get-changelog');
      await handler({});

      assertAuthErrorLogged(mockLogger, 'get-changelog', 'token_expired');
    });
  });

  describe('Error Response Structure', () => {
    it('should include content array with user-friendly message and isError flag', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );

      registerWithOverrides(overrides);

      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      expect(result.isError).toBe(true);
      expect(result.content.length).toBeGreaterThan(0);
      expect(result.content[0]?.type).toBe('text');
      expect(
        result.content[0] && 'text' in result.content[0] ? result.content[0].text : '',
      ).toContain('Authentication Error');
    });

    it('should include RFC 6750 compliant WWW-Authenticate format in _meta', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );

      registerWithOverrides(overrides);

      const handler = getHandler(capturedHandlers, 'get-changelog');
      const result = await handler({});

      const meta = result._meta;
      expect(meta).toBeDefined();
      const wwwAuth = meta?.['mcp/www_authenticate'];
      expect(Array.isArray(wwwAuth)).toBe(true);
      if (Array.isArray(wwwAuth) && wwwAuth[0] !== undefined) {
        const header = String(wwwAuth[0]);
        expect(header).toMatch(/^Bearer /);
        expect(header).toContain('resource_metadata=');
        expect(header).toContain('error=');
        expect(header).toContain('error_description=');
        expect(header).toContain('https://test.example.com/.well-known/oauth-protected-resource');
      }
    });
  });
});
