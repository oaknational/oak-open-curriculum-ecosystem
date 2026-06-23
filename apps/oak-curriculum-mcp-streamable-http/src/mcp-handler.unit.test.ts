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
import { createFakeLogger } from './test-helpers/logger-fakes.js';
import {
  createMcpHandler,
  type McpHandlerRequest,
  type McpHandlerResponse,
} from './mcp-handler.js';
import type { McpServerFactory } from './mcp-request-context.js';
import type { HttpObservability, HttpSpanOptions } from './observability/http-observability.js';
import type { ByteCountableResponse } from './observability/response-byte-counter.js';

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
    write(): boolean {
      return true;
    },
    end(): undefined {
      return undefined;
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

/** Narrow an unknown transport response to the byte-writable surface, structurally. */
function isWritableResponse(value: unknown): value is ByteCountableResponse {
  return typeof value === 'object' && value !== null;
}

/** Factory whose transport streams the given chunks through res.write/res.end. */
function createWritingMcpFactory(chunks: readonly string[]): McpServerFactory {
  return () => ({
    server: {
      connect: vi.fn().mockResolvedValue(undefined),
      close: vi.fn().mockResolvedValue(undefined),
    },
    transport: {
      handleRequest: async (_req: unknown, res: unknown): Promise<void> => {
        if (!isWritableResponse(res)) {
          throw new Error('fake transport expected an object response');
        }
        for (const chunk of chunks.slice(0, -1)) {
          res.write?.(chunk);
        }
        const last = chunks.at(-1);
        if (last === undefined) {
          res.end?.();
        } else {
          res.end?.(last);
        }
      },
      close: vi.fn().mockResolvedValue(undefined),
    },
  });
}

/** withSpan fake that records the initial attributes and the handle's setAttributes calls. */
function createRecordingWithSpan(): {
  withSpan: HttpObservability['withSpan'];
  initialAttributes: Record<string, unknown>[];
  handleAttributes: Record<string, unknown>[];
} {
  const initialAttributes: Record<string, unknown>[] = [];
  const handleAttributes: Record<string, unknown>[] = [];
  const withSpan = async <T>(options: HttpSpanOptions<T>): Promise<T> => {
    initialAttributes.push({ ...options.attributes });
    return await options.run({
      setAttribute(name, value): void {
        handleAttributes.push({ [name]: value });
      },
      setAttributes(attributes): void {
        handleAttributes.push({ ...attributes });
      },
    });
  };
  return { withSpan, initialAttributes, handleAttributes };
}

describe('createMcpHandler outbound size observability', () => {
  it('records body bytes and the token estimate on the request span after the transport writes', async () => {
    const recorder = createRecordingWithSpan();
    const observability = { ...createFakeHttpObservability(), withSpan: recorder.withSpan };
    const chunks = ['event: message\n', 'data: {"ok":true}\n'];
    const expectedBytes = chunks.reduce((sum, chunk) => sum + Buffer.byteLength(chunk), 0);

    const handler = createMcpHandler(createWritingMcpFactory(chunks), observability);
    await handler(
      createFakeRequest({ body: { method: 'tools/list', jsonrpc: '2.0', id: 1 } }),
      createFakeResponse(),
    );

    expect(recorder.handleAttributes).toContainEqual({
      'oak.mcp.response.body_bytes': expectedBytes,
      'oak.mcp.response.tokens_est': Math.ceil(expectedBytes / 4),
    });
  });

  it('records zero body bytes, without error, when the transport writes nothing', async () => {
    const recorder = createRecordingWithSpan();
    const observability = { ...createFakeHttpObservability(), withSpan: recorder.withSpan };

    const handler = createMcpHandler(createFakeMcpFactory(), observability);
    await handler(
      createFakeRequest({ body: { method: 'tools/list', jsonrpc: '2.0', id: 1 } }),
      createFakeResponse(),
    );

    expect(recorder.handleAttributes).toContainEqual({
      'oak.mcp.response.body_bytes': 0,
      'oak.mcp.response.tokens_est': 0,
    });
  });

  it('carries mcp.method and, for tools/call, mcp.tool_name as span attributes', async () => {
    const recorder = createRecordingWithSpan();
    const observability = { ...createFakeHttpObservability(), withSpan: recorder.withSpan };

    const handler = createMcpHandler(createFakeMcpFactory(), observability);
    await handler(
      createFakeRequest({
        body: { method: 'tools/call', params: { name: 'search' }, jsonrpc: '2.0', id: 1 },
      }),
      createFakeResponse(),
    );

    expect(recorder.initialAttributes).toEqual([
      expect.objectContaining({ 'mcp.method': 'tools/call', 'mcp.tool_name': 'search' }),
    ]);
  });

  it('omits mcp.tool_name for non-tools/call requests', async () => {
    const recorder = createRecordingWithSpan();
    const observability = { ...createFakeHttpObservability(), withSpan: recorder.withSpan };

    const handler = createMcpHandler(createFakeMcpFactory(), observability);
    await handler(
      createFakeRequest({ body: { method: 'tools/list', jsonrpc: '2.0', id: 1 } }),
      createFakeResponse(),
    );

    expect(recorder.initialAttributes[0]).not.toHaveProperty('mcp.tool_name');
  });

  it('emits an MCP response size log line with integer size fields', async () => {
    const logger = createFakeLogger();
    const chunks = ['data: {"result":{}}\n'];
    const expectedBytes = Buffer.byteLength(chunks[0] ?? '');

    const handler = createMcpHandler(
      createWritingMcpFactory(chunks),
      createFakeHttpObservability(),
      logger,
    );
    await handler(
      createFakeRequest({
        body: { method: 'tools/call', params: { name: 'search' }, jsonrpc: '2.0', id: 1 },
      }),
      createFakeResponse(),
    );

    expect(logger.info).toHaveBeenCalledWith('MCP response size', {
      mcpMethod: 'tools/call',
      mcpToolName: 'search',
      bodyBytes: expectedBytes,
      tokensEst: Math.ceil(expectedBytes / 4),
    });
  });
});
