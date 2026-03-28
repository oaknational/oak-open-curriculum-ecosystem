/**
 * Integration Tests: Auth Error Observability and Non-Auth Error Passthrough
 *
 * Companion to `handlers-auth-errors.integration.test.ts`. Tests that:
 * - Auth errors are logged with toolName, errorType, and description context
 * - Non-auth errors (validation, network) do NOT emit _meta or auth logging
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { registerHandlers } from './handlers.js';
import {
  createMockDeps,
  createMockServer,
  createMockLogger,
  createMockRuntimeConfig,
  createAuthErrorResult,
  createNonAuthErrorResult,
  getHandler,
  assertAuthErrorLogged,
} from './test-helpers/auth-error-test-helpers.js';
import { createFakeSearchRetrieval } from './test-helpers/fakes.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

describe('Auth Error Observability and Non-Auth Passthrough (Integration)', () => {
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

  describe('Observability', () => {
    it('should log with toolName, errorType, and description context', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Custom auth error')),
      );

      registerWithOverrides(overrides);

      const handler = getHandler(capturedHandlers, 'get-changelog');
      await handler({});

      assertAuthErrorLogged(mockLogger, 'get-changelog', 'invalid_token', 'Custom auth error');
    });
  });

  describe('Non-Auth Errors', () => {
    it('should NOT emit _meta for validation errors', async () => {
      const overrides = createMockDeps(() =>
        Promise.resolve(createNonAuthErrorResult('Validation failed: missing required field')),
      );

      registerWithOverrides(overrides);

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

      registerWithOverrides(overrides);

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
