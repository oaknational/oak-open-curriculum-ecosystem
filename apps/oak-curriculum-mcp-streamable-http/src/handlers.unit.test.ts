import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  McpToolError,
  type ToolExecutionResult,
  type UniversalToolExecutorDependencies,
  type OakApiPathBasedClient,
} from '@oaknational/oak-curriculum-sdk';

import { logger } from './logging.js';
import { registerHandlers, type ToolHandlerDependencies } from './handlers.js';

describe('registerHandlers validation logging', () => {
  const TOOL_NAME = 'get-key-stages';
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let previousEnv: {
    readonly OAK_API_KEY?: string;
    readonly BASE_URL?: string;
    readonly MCP_CANONICAL_URI?: string;
  };

  beforeEach(() => {
    previousEnv = {
      OAK_API_KEY: process.env.OAK_API_KEY,
      BASE_URL: process.env.BASE_URL,
      MCP_CANONICAL_URI: process.env.MCP_CANONICAL_URI,
    };
    process.env.OAK_API_KEY = 'test-key';
    process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
    process.env.CLERK_SECRET_KEY = 'sk_test_' + 'x'.repeat(40);
    process.env.BASE_URL = 'http://localhost:3333';
    process.env.MCP_CANONICAL_URI = 'http://localhost:3333/mcp';
    warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    if (previousEnv.OAK_API_KEY === undefined) {
      delete process.env.OAK_API_KEY;
    } else {
      process.env.OAK_API_KEY = previousEnv.OAK_API_KEY;
    }
    if (previousEnv.BASE_URL === undefined) {
      delete process.env.BASE_URL;
    } else {
      process.env.BASE_URL = previousEnv.BASE_URL;
    }
    if (previousEnv.MCP_CANONICAL_URI === undefined) {
      delete process.env.MCP_CANONICAL_URI;
    } else {
      process.env.MCP_CANONICAL_URI = previousEnv.MCP_CANONICAL_URI;
    }
    vi.restoreAllMocks();
  });

  it('logs validation failures with payload context', async () => {
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

    registerHandlers(server as unknown as McpServer, overrides);

    const handler = toolHandlers.get(TOOL_NAME);
    expect(handler).toBeTruthy();
    await handler?.({}, {});

    expect(warnSpy).toHaveBeenCalledWith(
      'MCP tool validation failed',
      expect.objectContaining({
        toolName: TOOL_NAME,
        rawPayload: JSON.stringify(validationDetails.raw),
        issues: JSON.stringify(validationDetails.issues),
      }),
    );
  });
});
