import { describe, expect, it, vi } from 'vitest';

import { McpParameterError, McpToolError, executeToolCall } from './execute-tool-call';
import { createFakeOakApiPathBasedClient } from '../test-helpers/fakes.js';
import type { OakApiPathBasedClient } from '../client/index.js';

interface RateLimitArgs {
  readonly params: Record<string, never>;
}

interface MockResponse {
  readonly data?: unknown;
  readonly error?: unknown;
  readonly response: { readonly status: number };
}

type RateLimitCall = (args: RateLimitArgs) => MockResponse;

function createRateLimitClient(impl: RateLimitCall): {
  readonly client: OakApiPathBasedClient;
  readonly handler: ReturnType<typeof vi.fn>;
} {
  const handler = vi.fn(impl);
  const client = createFakeOakApiPathBasedClient({
    '/rate-limit': { GET: handler },
  });
  return { client, handler };
}

describe('executeToolCall', () => {
  it('returns an error when the tool name is unknown', async () => {
    const result = await executeToolCall('not-a-tool', {}, createFakeOakApiPathBasedClient({}));

    expect(result.error).toBeInstanceOf(McpToolError);
    expect(result.error).toMatchObject({
      toolName: 'not-a-tool',
      code: 'UNKNOWN_TOOL',
    });
  });

  it('requires zero-parameter tools to supply params', async () => {
    const { client, handler } = createRateLimitClient(() => ({
      data: {
        limit: 10,
        remaining: 9,
        reset: Date.now(),
      },
      response: { status: 200 },
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
      return { data: expected, response: { status: 200 } };
    });

    const result = await executeToolCall('get-rate-limit', { params: {} }, client);

    expect(handler).toHaveBeenCalledOnce();
    expect(result).toEqual({ status: 200, data: expected });
  });

  it('maps output validation failures to McpToolError with a helpful message', async () => {
    const { client } = createRateLimitClient(() => ({ data: {}, response: { status: 200 } }));

    const result = await executeToolCall('get-rate-limit', { params: {} }, client);

    expect(result.error).toBeInstanceOf(McpToolError);
    expect(result.error?.code).toBe('OUTPUT_VALIDATION_ERROR');
    expect(result.error?.message).toContain('Response does not match any documented schema');
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

  it('classifies undocumented 4xx as UPSTREAM_API_ERROR and preserves upstream message', async () => {
    const upstreamBody = {
      message: 'Invalid lesson slug format: "123"',
      code: 'BAD_REQUEST',
    };
    const { client } = createRateLimitClient(() => ({
      error: upstreamBody,
      response: { status: 400 },
    }));

    const result = await executeToolCall('get-rate-limit', { params: {} }, client);

    expect(result.error).toBeInstanceOf(McpToolError);
    expect(result.error?.code).toBe('UPSTREAM_API_ERROR');
    expect(result.error?.message).toContain('Invalid lesson slug format');
  });

  it('classifies undocumented 5xx as UPSTREAM_SERVER_ERROR', async () => {
    const { client } = createRateLimitClient(() => ({
      error: { message: 'Internal server error' },
      response: { status: 502 },
    }));

    const result = await executeToolCall('get-rate-limit', { params: {} }, client);

    expect(result.error).toBeInstanceOf(McpToolError);
    expect(result.error?.code).toBe('UPSTREAM_SERVER_ERROR');
    expect(result.error?.message).toContain('Internal server error');
  });

  it('handles undocumented status with no extractable message', async () => {
    const { client } = createRateLimitClient(() => ({
      error: undefined,
      response: { status: 418 },
    }));

    const result = await executeToolCall('get-rate-limit', { params: {} }, client);

    expect(result.error).toBeInstanceOf(McpToolError);
    expect(result.error?.code).toBe('UPSTREAM_API_ERROR');
    expect(result.error?.message).toContain('418');
  });

  it('classifies content-blocked 400 as CONTENT_NOT_AVAILABLE', async () => {
    const contentBlockedBody = {
      message: 'Lesson not available: "volcanoes-and-their-features"',
      data: {
        cause:
          'Error: Lesson (volcanoes-and-their-features) not available, and subject (geography) and unit (mountains-and-volcanoes-what-where-and-why) are blocked for assets',
      },
      code: 'BAD_REQUEST',
    };
    const { client } = createRateLimitClient(() => ({
      error: contentBlockedBody,
      response: { status: 400 },
    }));

    const result = await executeToolCall('get-rate-limit', { params: {} }, client);

    expect(result.error).toBeInstanceOf(McpToolError);
    expect(result.error?.code).toBe('CONTENT_NOT_AVAILABLE');
  });
});
