/**
 * Unit tests for MCP handler context enrichment.
 *
 * Proves that `createMcpHandler` sets the correct Sentry tags and user
 * identity from the request body and auth context. The handler uses
 * narrow request/response interfaces — plain objects satisfy the types
 * structurally (ADR-078).
 */

import { describe, expect, it, vi } from 'vitest';
import { createFakeHttpObservability } from './test-helpers/observability-fakes.js';
import {
  createMcpHandler,
  type McpHandlerRequest,
  type McpHandlerResponse,
} from './mcp-handler.js';
import type { McpServerFactory } from './mcp-request-context.js';

function createFakeMcpFactory(): McpServerFactory {
  return () => ({
    server: {
      connect: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
    },
    transport: {
      handleRequest: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
    },
  });
}

function createFakeRequest(overrides?: Partial<McpHandlerRequest>): McpHandlerRequest {
  return {
    headers: {},
    method: 'POST',
    path: '/mcp',
    body: {},
    ...overrides,
  };
}

function createFakeResponse(): McpHandlerResponse {
  const listeners: Record<string, ((...args: unknown[]) => void)[]> = {};
  return {
    statusCode: 200,
    locals: { correlationId: 'test-correlation' },
    on(event: string, listener: (...args: unknown[]) => void) {
      listeners[event] = listeners[event] ?? [];
      listeners[event].push(listener);
    },
  };
}

describe('createMcpHandler enrichment', () => {
  it('sets mcp.method tag from JSON-RPC request body', async () => {
    const setTag = vi.fn();
    const observability = { ...createFakeHttpObservability(), setTag };

    const handler = createMcpHandler(createFakeMcpFactory(), observability);
    await handler(
      createFakeRequest({ body: { method: 'tools/call', jsonrpc: '2.0', id: 1 } }),
      createFakeResponse(),
    );

    expect(setTag).toHaveBeenCalledWith('mcp.method', 'tools/call');
  });

  it('does not set mcp.method tag when body has no method', async () => {
    const setTag = vi.fn();
    const observability = { ...createFakeHttpObservability(), setTag };

    const handler = createMcpHandler(createFakeMcpFactory(), observability);
    await handler(createFakeRequest({ body: {} }), createFakeResponse());

    expect(setTag).not.toHaveBeenCalled();
  });

  it('sets user identity from auth extra userId', async () => {
    const setUser = vi.fn();
    const observability = { ...createFakeHttpObservability(), setUser };

    const handler = createMcpHandler(createFakeMcpFactory(), observability);
    await handler(
      createFakeRequest({
        auth: {
          token: 'tok_test',
          clientId: 'client_test',
          scopes: ['read'],
          extra: { userId: 'user_abc123' },
        },
      }),
      createFakeResponse(),
    );

    expect(setUser).toHaveBeenCalledWith({ id: 'user_abc123' });
  });

  it('does not set user when auth is undefined', async () => {
    const setUser = vi.fn();
    const observability = { ...createFakeHttpObservability(), setUser };

    const handler = createMcpHandler(createFakeMcpFactory(), observability);
    await handler(createFakeRequest({ auth: undefined }), createFakeResponse());

    expect(setUser).not.toHaveBeenCalled();
  });

  it('does not set user when auth extra has no userId', async () => {
    const setUser = vi.fn();
    const observability = { ...createFakeHttpObservability(), setUser };

    const handler = createMcpHandler(createFakeMcpFactory(), observability);
    await handler(
      createFakeRequest({
        auth: {
          token: 'tok_test',
          clientId: 'client_test',
          scopes: [],
          extra: { someOtherField: 'value' },
        },
      }),
      createFakeResponse(),
    );

    expect(setUser).not.toHaveBeenCalled();
  });

  it('does not set user when auth extra userId is not a string', async () => {
    const setUser = vi.fn();
    const observability = { ...createFakeHttpObservability(), setUser };

    const handler = createMcpHandler(createFakeMcpFactory(), observability);
    await handler(
      createFakeRequest({
        auth: {
          token: 'tok_test',
          clientId: 'client_test',
          scopes: [],
          extra: { userId: 12345 },
        },
      }),
      createFakeResponse(),
    );

    expect(setUser).not.toHaveBeenCalled();
  });
});
