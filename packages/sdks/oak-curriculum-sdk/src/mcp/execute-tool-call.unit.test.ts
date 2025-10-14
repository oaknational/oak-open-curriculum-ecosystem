/**
 * Unit tests for executeToolCall using TOOL_GROUPINGS executors
 *
 * Tests the pure function logic of tool execution without IO or side effects.
 * Following TDD - this is the Red phase where tests fail initially.
 */

import { describe, it, expect, vi } from 'vitest';

import { executeToolCall } from './execute-tool-call';
import type { OakApiPathBasedClient } from '../client/oak-base-client';

vi.mock('../types/generated/api-schema/mcp-tools/definitions.js', () => {
  const toolZodSchema = {
    safeParse: vi.fn((value: unknown) => {
      if (value && typeof value === 'object') {
        return { success: true, data: value };
      }
      return { success: false, error: { message: 'Invalid request parameters' } };
    }),
  };

  const validateOutput = vi.fn((value: unknown) => ({ ok: true, data: value }));
  const invoke = vi.fn(async (client: unknown, args: unknown) => ({ client, args }));

  return {
    MCP_TOOLS: {
      'mock-tool': {
        toolZodSchema,
        validateOutput,
        describeToolArgs: () => 'Invalid request parameters',
        invoke,
      },
    },
    __mocks__: {
      toolZodSchema,
      validateOutput,
      invoke,
    },
  };
});

vi.mock('../types/generated/api-schema/mcp-tools/types.js', () => ({
  isToolName: (value: unknown): value is 'mock-tool' => value === 'mock-tool',
}));

describe('executeToolCall with literal descriptors', () => {
  it('returns error for unknown tool', async () => {
    const result = await executeToolCall('other-tool', {}, {} as OakApiPathBasedClient);

    expect(result).toHaveProperty('error');
    expect(result.error?.message).toContain('Unknown tool');
  });

  it('invokes tool when validation succeeds', async () => {
    const client = {} as OakApiPathBasedClient;
    const params = { args: true };
    const { toolZodSchema, validateOutput, invoke } = await import(
      '../types/generated/api-schema/mcp-tools/definitions.js'
    ).then(
      (module: {
        __mocks__: {
          toolZodSchema: typeof vi.fn;
          validateOutput: typeof vi.fn;
          invoke: typeof vi.fn;
        };
      }) => module.__mocks__,
    );

    (toolZodSchema.safeParse as ReturnType<typeof vi.fn>).mockReturnValueOnce({
      success: true,
      data: params,
    });
    validateOutput.mockReturnValueOnce({ ok: true, data: 'valid' });

    const result = await executeToolCall('mock-tool', params, client);

    expect(result).toEqual({ data: 'valid' });
    expect(invoke).toHaveBeenCalledWith(client, params);
    expect(validateOutput).toHaveBeenCalledWith({ client, args: params });
  });
});
