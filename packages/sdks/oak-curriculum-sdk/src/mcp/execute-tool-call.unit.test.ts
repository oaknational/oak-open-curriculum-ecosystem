import { describe, expect, it, vi } from 'vitest';

import { McpParameterError, McpToolError, executeToolCall } from './execute-tool-call';
import type { OakApiPathBasedClient } from '../client/index.js';

interface RateLimitArgs {
  readonly params: Record<string, never>;
}

function createRateLimitClient(impl: (args: RateLimitArgs) => unknown): {
  readonly client: OakApiPathBasedClient;
  readonly handler: ReturnType<typeof vi.fn>;
} {
  const handler = vi.fn(impl);
  const client = {
    '/rate-limit': {
      GET: handler,
    },
  } as unknown as OakApiPathBasedClient;
  return { client, handler };
}

describe('executeToolCall', () => {
  it('returns an error when the tool name is unknown', async () => {
    const result = await executeToolCall('not-a-tool', {}, {} as OakApiPathBasedClient);

    expect(result.error).toBeInstanceOf(McpToolError);
    expect(result.error).toMatchObject({
      toolName: 'not-a-tool',
      code: 'UNKNOWN_TOOL',
    });
  });

  it('requires zero-parameter tools to supply params', async () => {
    const { client, handler } = createRateLimitClient(() => ({
      limit: 10,
      remaining: 9,
      reset: Date.now(),
    }));

    const result = await executeToolCall('get-rate-limit', undefined, client);

    expect(handler).not.toHaveBeenCalled();
    expect(result.error).toBeInstanceOf(McpParameterError);
    expect(result.error?.message).toContain('Invalid request parameters');
  });

  it('invokes generated executors for zero-parameter tools', async () => {
    const expected = { limit: 10, remaining: 9, reset: Date.now() };
    const { client, handler } = createRateLimitClient((args) => {
      expect(args).toEqual({ params: {} });
      return expected;
    });

    const result = await executeToolCall('get-rate-limit', { params: {} }, client);

    expect(handler).toHaveBeenCalledOnce();
    expect(result).toEqual({ data: expected });
  });

  it('maps output validation failures to McpToolError with a helpful message', async () => {
    const { client } = createRateLimitClient(() => ({}));

    const result = await executeToolCall('get-rate-limit', { params: {} }, client);

    expect(result.error).toBeInstanceOf(McpToolError);
    expect(result.error?.code).toBe('OUTPUT_VALIDATION_ERROR');
    expect(result.error?.message).toContain('Invalid response payload');
  });

  it('propagates execution errors with context', async () => {
    const { client } = createRateLimitClient(() => {
      throw new Error('boom');
    });

    const result = await executeToolCall('get-rate-limit', { params: {} }, client);

    expect(result.error).toBeInstanceOf(McpToolError);
    expect(result.error?.message).toBe('Execution failed: boom');
    expect(result.error?.toolName).toBe('get-rate-limit');
    expect(result.error?.code).toBe('EXECUTION_ERROR');
  });
});
