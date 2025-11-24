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
import type { UniversalToolName } from '@oaknational/oak-curriculum-sdk';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';
import type { ToolHandlerDependencies } from './handlers.js';

/**
 * Test logger that captures log calls
 */
function createTestLogger(): Logger {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  } as unknown as Logger;
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

      // For this test, we expect the handler to check auth BEFORE executing
      // Since auth context is missing (not implemented yet), expect error
      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
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

      // For this test, assume we have invalid auth context
      // (Not yet implemented - will need to pass auth context to handler)
      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
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

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
      );

      // Expected behavior:
      // - Check if tool requires auth (get-changelog does not)
      // - Execute tool without auth check
      expect(result.isError).toBeUndefined();
      expect(result.content).toBeDefined();
    });
  });

  describe('Error logging', () => {
    it('should log auth required but missing with correlation ID', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };

      await handleToolWithAuthInterception(tool, params, deps, undefined, logger, 'test-api-key');

      // Expected: logger.warn called with auth required message
      expect(logger.warn).toHaveBeenCalled();
      const warnCalls = (logger.warn as ReturnType<typeof vi.fn>).mock.calls;
      const hasAuthWarning = warnCalls.some((call: unknown[]) => {
        const firstArg = call[0];
        return typeof firstArg === 'string' && firstArg.includes('auth');
      });
      expect(hasAuthWarning).toBe(true);
    });

    // Note: Testing successful auth logging requires a real JWT token
    // that passes resource parameter validation. This is better tested in E2E tests.
  });

  describe('MCP error format', () => {
    it('should include resource_metadata in www_authenticate header', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
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

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
      );

      const meta = result._meta as Record<string, unknown>;
      expect((meta['mcp/www_authenticate'] as string[])[0]).toContain('error_description=');
    });

    it('should include user-friendly error message in content', async () => {
      const tool = { name: 'search' as UniversalToolName };
      const params = { query: 'test' };

      const result = await handleToolWithAuthInterception(
        tool,
        params,
        deps,
        undefined,
        logger,
        'test-api-key',
      );

      expect(result.content).toBeDefined();
      expect(result.content[0].type).toBe('text');
      if (result.content[0].type === 'text') {
        expect(result.content[0].text).toContain('Authentication');
      }
    });
  });
});
