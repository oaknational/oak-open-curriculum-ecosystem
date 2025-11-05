import { describe, it, expect, vi } from 'vitest';

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { Logger } from '@oaknational/mcp-logger';
import {
  McpToolError,
  type ToolExecutionResult,
  type UniversalToolExecutorDependencies,
  type OakApiPathBasedClient,
} from '@oaknational/oak-curriculum-sdk';

import {
  registerHandlers,
  type ToolHandlerDependencies,
  type RegisterHandlersOptions,
} from './handlers.js';
import type { RuntimeConfig } from './runtime-config.js';
import type { Env } from './env.js';

function createMockLogger(): Logger {
  return {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    isLevelEnabled: vi.fn(() => false),
  };
}

function createMockRuntimeConfig(): RuntimeConfig {
  const env: Env = {
    OAK_API_KEY: 'test-key',
    BASE_URL: 'http://localhost:3333',
    MCP_CANONICAL_URI: 'http://localhost:3333/mcp',
    CLERK_PUBLISHABLE_KEY: 'pk_test_mock',
    CLERK_SECRET_KEY: 'sk_test_mock',
  };
  return {
    env,
    dangerouslyDisableAuth: false,
    useStubTools: false,
    vercelHostname: undefined,
  };
}

describe('registerHandlers validation logging', () => {
  const TOOL_NAME = 'get-key-stages';

  it('logs validation failures with payload context', async () => {
    const mockLogger = createMockLogger();
    const mockConfig = createMockRuntimeConfig();

    const toolHandlers = new Map<string, (params: unknown, extra?: unknown) => Promise<unknown>>();
    const server = {
      registerTool(name: string, _descriptor: unknown, handler: (...args: unknown[]) => unknown) {
        toolHandlers.set(name, handler as (params: unknown, extra?: unknown) => Promise<unknown>);
        return { dispose: vi.fn() };
      },
    };
    const validationDetails = {
      raw: { data: { items: [] } },
      issues: [{ path: ['0', 'slug'], message: 'Required' }],
    };
    const underlying = new TypeError('Output validation error', { cause: validationDetails });
    const error = new McpToolError('Execution failed: invalid payload', TOOL_NAME, {
      cause: underlying,
      code: 'OUTPUT_VALIDATION_ERROR',
    });
    const executionResult: ToolExecutionResult = { error };

    const overrides: Partial<ToolHandlerDependencies> = {
      createClient: vi.fn(() => ({}) as OakApiPathBasedClient),
      executeMcpTool: vi.fn(() => Promise.resolve(executionResult)),
      createExecutor: vi.fn(({ executeMcpTool }: UniversalToolExecutorDependencies) => async () => {
        await executeMcpTool(TOOL_NAME, {});
        return { content: [] };
      }),
    };

    const options: RegisterHandlersOptions = {
      overrides,
      runtimeConfig: mockConfig,
      logger: mockLogger,
    };

    registerHandlers(server as unknown as McpServer, options);

    const handler = toolHandlers.get(TOOL_NAME);
    expect(handler).toBeTruthy();
    await handler?.({}, {});

    expect(mockLogger.warn).toHaveBeenCalledWith(
      'MCP tool validation failed',
      expect.objectContaining({
        toolName: TOOL_NAME,
        rawPayload: JSON.stringify(validationDetails.raw),
        issues: JSON.stringify(validationDetails.issues),
      }),
    );
  });
});
