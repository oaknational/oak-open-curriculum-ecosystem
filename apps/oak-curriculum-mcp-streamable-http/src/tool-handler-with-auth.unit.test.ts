/**
 * Unit Tests: handleToolWithAuthInterception
 *
 * Tests auth error interception and MCP-compliant _meta response generation
 * per ADR-054 by calling the function directly with trivial fakes.
 *
 * Replaces the integration tests that went through registerHandlers → McpServer,
 * which was the wrong test level for this behaviour.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';
import {
  createMockLogger,
  createMockRuntimeConfig,
  createAuthErrorResult,
  createClerkErrorResult,
  createNonAuthErrorResult,
  assertAuthErrorResponse,
  assertAuthErrorLogged,
} from './test-helpers/auth-error-test-helpers.js';
import type { ToolHandlerDependencies } from './tool-handler-types.js';
import type {
  UniversalToolName,
  ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

const TOOL_NAME = 'get-changelog' satisfies UniversalToolName;
const RESOURCE_URL = 'https://test.example.com/mcp';

function formatToolResult(execution: ToolExecutionResult): CallToolResult {
  if (execution.ok) {
    return { content: [{ type: 'text', text: JSON.stringify(execution.value) }] };
  }
  return {
    content: [{ type: 'text', text: execution.error.message }],
    isError: true,
  };
}

function createFakeDeps(
  executeMcpTool: () => Promise<ToolExecutionResult>,
): ToolHandlerDependencies {
  return {
    createRequestExecutor: vi.fn((config) => {
      return vi.fn(async (name: unknown) => {
        const execution = await executeMcpTool();
        config.onToolExecution?.(name, execution);
        return formatToolResult(execution);
      });
    }),
    getResourceUrl: () => RESOURCE_URL,
  };
}

describe('handleToolWithAuthInterception', () => {
  let mockLogger: ReturnType<typeof createMockLogger>;
  let runtimeConfig: ReturnType<typeof createMockRuntimeConfig>;

  beforeEach(() => {
    mockLogger = createMockLogger();
    runtimeConfig = createMockRuntimeConfig();
  });

  async function callHandler(
    deps: ToolHandlerDependencies,
  ): ReturnType<typeof handleToolWithAuthInterception> {
    return handleToolWithAuthInterception({
      tool: { name: TOOL_NAME },
      params: {},
      deps,
      logger: mockLogger,
      apiKey: 'test-key',
      runtimeConfig,
      checkAuthDeps: {
        toolRequiresAuth: () => true,
        validateResourceParameter: () => ({ valid: true }),
      },
      authInfo: {
        token: 'test-token',
        clientId: 'test-client',
        scopes: ['openid'],
      },
    });
  }

  describe('Upstream Auth Errors', () => {
    it('should emit _meta on Oak API 401 error', async () => {
      const deps = createFakeDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );
      const result = await callHandler(deps);

      assertAuthErrorResponse(result, /Bearer.*error="invalid_token"/);
      assertAuthErrorLogged(mockLogger, TOOL_NAME, 'invalid_token', 'Unauthorized');
    });

    it('should emit _meta on Oak API 403 error', async () => {
      const deps = createFakeDeps(() => Promise.resolve(createAuthErrorResult(403, 'Forbidden')));
      const result = await callHandler(deps);

      assertAuthErrorResponse(result, /Bearer.*error="insufficient_scope"/);
      assertAuthErrorLogged(mockLogger, TOOL_NAME, 'insufficient_scope');
    });

    it('should emit _meta on Clerk token verification failure', async () => {
      const deps = createFakeDeps(() =>
        Promise.resolve(createClerkErrorResult('Clerk: token verification failed')),
      );
      const result = await callHandler(deps);

      assertAuthErrorResponse(result, /^Bearer/);
    });

    it('should log token_expired for expired token errors', async () => {
      const deps = createFakeDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Token has expired')),
      );
      await callHandler(deps);

      assertAuthErrorLogged(mockLogger, TOOL_NAME, 'token_expired');
    });
  });

  describe('Error Response Structure', () => {
    it('should include RFC 6750 compliant response with content, isError, and _meta', async () => {
      const deps = createFakeDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Unauthorized')),
      );
      const result = await callHandler(deps);

      assertAuthErrorResponse(result, /^Bearer.*resource_metadata=.*error=.*error_description=/);

      const wwwAuth = result._meta?.['mcp/www_authenticate'];
      expect(Array.isArray(wwwAuth) && wwwAuth[0]).toContain(
        'https://test.example.com/.well-known/oauth-protected-resource',
      );
    });
  });

  describe('Observability', () => {
    it('should log with toolName, errorType, and description context', async () => {
      const deps = createFakeDeps(() =>
        Promise.resolve(createAuthErrorResult(401, 'Custom auth error')),
      );
      await callHandler(deps);

      assertAuthErrorLogged(mockLogger, TOOL_NAME, 'invalid_token', 'Custom auth error');
    });
  });

  describe('Non-Auth Errors', () => {
    it('should NOT emit _meta for validation errors', async () => {
      const deps = createFakeDeps(() =>
        Promise.resolve(createNonAuthErrorResult('Validation failed: missing required field')),
      );
      const result = await callHandler(deps);

      expect(result).not.toHaveProperty('_meta');
      expect(mockLogger.warn).not.toHaveBeenCalledWith(
        'Tool execution auth error',
        expect.any(Object),
      );
    });

    it('should NOT emit _meta for network errors', async () => {
      const deps = createFakeDeps(() => Promise.resolve(createNonAuthErrorResult('ECONNREFUSED')));
      const result = await callHandler(deps);

      expect(result).not.toHaveProperty('_meta');
      expect(mockLogger.warn).not.toHaveBeenCalledWith(
        'Tool execution auth error',
        expect.any(Object),
      );
    });
  });
});
