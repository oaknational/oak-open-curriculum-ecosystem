/**
 * Integration tests for tool-level authentication.
 *
 * Tests the integration between tool execution and auth checking,
 * verifying that protected tools return MCP errors with _meta when
 * auth is missing or invalid.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Logger } from '@oaknational/mcp-logger';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import type { UniversalToolName } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { RuntimeConfig } from './runtime-config.js';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';
import type { ToolHandlerDependencies } from './handlers.js';
import { createFakeLogger } from './test-helpers/fakes.js';

/**
 * Test logger that captures log calls. Uses shared fake so no type assertion is needed.
 */
function createTestLogger(): Logger {
  return createFakeLogger();
}

/**
 * Mock tool handler dependencies for testing
 */
function createMockDependencies(
  overrides?: Partial<ToolHandlerDependencies>,
): ToolHandlerDependencies {
  return {
    createClient: vi.fn(() => ({}) as ReturnType<ToolHandlerDependencies['createClient']>),
    createExecutor: vi.fn((config: Parameters<ToolHandlerDependencies['createExecutor']>[0]) => {
      return async (toolName: UniversalToolName, params: unknown) => {
        // Call the executeMcpTool function passed in config
        await config.executeMcpTool(
          toolName as Parameters<typeof config.executeMcpTool>[0],
          params,
        );
        // Return a simple CallToolResult
        return {
          content: [{ type: 'text', text: 'Tool executed successfully' }],
        } as CallToolResult;
      };
    }),
    executeMcpTool: vi.fn(() =>
      Promise.resolve({
        status: 200 as const,
        data: { result: 'success' },
      }),
    ),
    getResourceUrl: vi.fn(() => 'http://localhost:3333/mcp'),
    ...overrides,
  };
}

/**
 * Creates a mock RuntimeConfig for testing
 */
function createMockRuntimeConfig(overrides?: Partial<RuntimeConfig>): RuntimeConfig {
  return {
    env: {} as RuntimeConfig['env'],
    dangerouslyDisableAuth: false,
    useStubTools: false,
    version: '1.0.0-test',
    vercelHostnames: [],
    ...overrides,
  };
}

describe('Tool Handler with Auth Integration', () => {
  let logger: Logger;
  let deps: ToolHandlerDependencies;

  beforeEach(() => {
    logger = createTestLogger();
    deps = createMockDependencies();
  });

  describe('Protected tools (OAuth required)', () => {
    it('should return MCP error with _meta when auth context missing', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      // For this test, we expect the handler to check auth BEFORE executing
      // Since auth context is missing (not implemented yet), expect error
      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      // Expected behavior (not yet implemented):
      // - Check if tool requires auth (search does)
      // - Check if auth context present (it's not)
      // - Return MCP error with _meta
      expect(result.isError).toBe(true);
      expect(result._meta).toBeDefined();
      const meta = result._meta as Record<string, unknown>;
      expect(meta['mcp/www_authenticate']).toBeDefined();
      expect(meta['mcp/www_authenticate']).toEqual(
        expect.arrayContaining([expect.stringContaining('Bearer')]),
      );
      expect((meta['mcp/www_authenticate'] as string[])[0]).toContain('error=');
    });

    // Note: Testing the success path with valid auth requires a real JWT token
    // that passes resource parameter validation (RFC 8707). This is better tested
    // in E2E tests where we have real Clerk tokens. Integration tests focus on
    // error paths which don't require complex JWT mocking.

    it('should return MCP error with _meta for invalid auth token', async () => {
      const tool = { name: 'get-key-stages' as UniversalToolName };
      const params = {};
      const config = createMockRuntimeConfig();

      // For this test, assume we have invalid auth context
      // (Not yet implemented - will need to pass auth context to handler)
      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      // Expected behavior (when auth validation is implemented):
      // - Check if tool requires auth (get-key-stages does)
      // - Verify auth context (invalid token)
      // - Return MCP error with _meta indicating invalid_token
      expect(result.isError).toBe(true);
      const meta = result._meta as Record<string, unknown>;
      expect(meta['mcp/www_authenticate']).toBeDefined();
      expect((meta['mcp/www_authenticate'] as string[])[0]).toContain('error=');
    });
  });

  describe('Public tools (noauth)', () => {
    it('should execute public tool without auth check', async () => {
      const tool = { name: 'get-changelog' as UniversalToolName };
      const params = {};
      const config = createMockRuntimeConfig();

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      // Expected behavior:
      // - Check if tool requires auth (get-changelog does not)
      // - Execute tool without auth check
      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
    });
  });

  describe('DANGEROUSLY_DISABLE_AUTH bypass', () => {
    it('should bypass auth and execute protected tool when flag is true', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };
      const config = createMockRuntimeConfig({ dangerouslyDisableAuth: true });

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      // Expected behavior:
      // - Auth bypass should prevent auth error
      // - Tool should execute successfully
      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
      expect(deps.executeMcpTool).toHaveBeenCalledWith(
        'search',
        { query: 'test' },
        expect.anything(),
      );

      // Should log the bypass
      expect(logger.info).toHaveBeenCalledWith('Auth disabled via DANGEROUSLY_DISABLE_AUTH', {
        toolName: 'search',
      });
    });

    it('should bypass auth for all protected tools when flag is true', async () => {
      const tool = { name: 'get-key-stages' as UniversalToolName };
      const params = {};
      const config = createMockRuntimeConfig({ dangerouslyDisableAuth: true });

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      // Should execute without auth error
      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
      expect(deps.executeMcpTool).toHaveBeenCalledWith('get-key-stages', {}, expect.anything());

      // Should log the bypass
      expect(logger.info).toHaveBeenCalledWith('Auth disabled via DANGEROUSLY_DISABLE_AUTH', {
        toolName: 'get-key-stages',
      });
    });

    it('should enforce auth when flag is false', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };
      const config = createMockRuntimeConfig({ dangerouslyDisableAuth: false });

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      // Should return auth error (no auth context available in test)
      expect(result.isError).toBe(true);
      expect(result._meta).toBeDefined();

      // Should NOT log bypass
      expect(logger.info).not.toHaveBeenCalledWith(
        'Auth disabled via DANGEROUSLY_DISABLE_AUTH',
        expect.anything(),
      );
    });
  });

  describe('Error logging', () => {
    it('should log auth required but missing with correlation ID', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      // Expected: logger.warn called with auth/context missing message
      expect(logger.warn).toHaveBeenCalled();
      const warnCalls = (logger.warn as ReturnType<typeof vi.fn>).mock.calls;
      const hasAuthOrContextWarning = warnCalls.some((call: unknown[]) => {
        const firstArg = call[0];
        return (
          typeof firstArg === 'string' &&
          (firstArg.includes('auth') || firstArg.includes('context') || firstArg.includes('token'))
        );
      });
      expect(hasAuthOrContextWarning).toBe(true);
    });

    // Note: Testing successful auth logging requires a real JWT token
    // that passes resource parameter validation. This is better tested in E2E tests.
  });

  describe('MCP error format', () => {
    it('should include resource_metadata in www_authenticate header', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      const meta = result._meta as Record<string, unknown>;
      expect((meta['mcp/www_authenticate'] as string[])[0]).toContain('resource_metadata=');
      // resource_metadata should contain the well-known URL, not the MCP endpoint
      expect((meta['mcp/www_authenticate'] as string[])[0]).toContain(
        '/.well-known/oauth-protected-resource',
      );
    });

    it('should include error description in www_authenticate header', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      const meta = result._meta as Record<string, unknown>;
      expect((meta['mcp/www_authenticate'] as string[])[0]).toContain('error_description=');
    });

    it('should include user-friendly error message in content', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };
      const config = createMockRuntimeConfig();

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
        config,
      );

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      if (result.content[0].type === 'text') {
        expect(result.content[0].text).toContain('Authentication');
      }
    });
  });
});
