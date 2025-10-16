/**
 * Unit tests for executeToolCall using TOOL_GROUPINGS executors
 *
 * Tests the pure function logic of tool execution without IO or side effects.
 * Following TDD - this is the Red phase where tests fail initially.
 */

import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

import { executeToolCall } from './execute-tool-call';
import type { OakApiPathBasedClient } from '../client/index.js';
import type { ToolDescriptor, ToolName } from '../types/generated/api-schema/mcp-tools/index.js';

const MOCK_TOOL_NAME = 'mock-tool' as ToolName;

const toolZodSchema = z.object({
  args: z.boolean(),
});

const validateOutput = vi.fn<
  (
    value: unknown,
  ) =>
    | { readonly ok: true; readonly data: unknown }
    | { readonly ok: false; readonly message: string }
>((value) => ({ ok: true as const, data: value }));
const invoke = vi.fn(async (client: OakApiPathBasedClient, args: MockArgs) => ({ client, args }));

interface MockArgs {
  args: boolean;
}
type MockDescriptor = ToolDescriptor<OakApiPathBasedClient, MockArgs>;

const descriptor: MockDescriptor = {
  name: MOCK_TOOL_NAME,
  description: 'Mock tool for executeToolCall unit tests',
  operationId: 'mock-operation',
  path: '/mock',
  method: 'GET',
  toolZodSchema,
  toolInputJsonSchema: { type: 'object', properties: { args: { type: 'boolean' } } },
  toolOutputJsonSchema: {},
  zodOutputSchema: z.any(),
  describeToolArgs: () => 'Invalid request parameters',
  inputSchema: { type: 'object', properties: { args: { type: 'boolean' } } },
  validateOutput,
  invoke,
};

vi.mock('../types/generated/api-schema/mcp-tools/index.js', () => ({
  toolNames: [MOCK_TOOL_NAME] as const,
  getToolFromToolName: (name: ToolName) => {
    if (name !== MOCK_TOOL_NAME) {
      throw new Error(`Unknown tool requested in test: ${String(name)}`);
    }
    return descriptor;
  },
  isToolName: (value: unknown): value is ToolName => value === MOCK_TOOL_NAME,
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

    validateOutput.mockReturnValueOnce({ ok: true as const, data: 'valid' });

    const result = await executeToolCall('mock-tool', params, client);

    expect(result).toEqual({ data: 'valid' });
    expect(invoke).toHaveBeenCalledWith(client, params);
    expect(validateOutput).toHaveBeenCalledWith({ client, args: params });
  });
});
