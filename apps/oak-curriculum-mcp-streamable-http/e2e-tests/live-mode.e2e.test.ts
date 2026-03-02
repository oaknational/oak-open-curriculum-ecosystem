import request from 'supertest';
import { describe, it, expect } from 'vitest';

import {
  createLiveHttpApp,
  type CreateLiveHttpAppOptions,
} from './helpers/create-live-http-app.js';
import {
  parseSseEnvelope,
  parseJsonRpcResult,
  parseToolSuccessPayload,
  getContentArray,
  readFirstTextContent,
} from './helpers/sse.js';
import {
  McpToolError,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';

const ACCEPT = 'application/json, text/event-stream';

interface CapturedCall {
  readonly tool: unknown;
  readonly args: unknown;
}

function createOverrides(captured: CapturedCall[]): CreateLiveHttpAppOptions {
  return {
    overrides: {
      executeMcpTool: (name, args, client) => {
        captured.push({ tool: name, args });
        void client;
        const data = [
          {
            slug: 'ks1',
            title: 'Key Stage 1',
            canonicalUrl: 'https://www.thenational.academy/teachers/key-stages/ks1',
          },
          {
            slug: 'ks2',
            title: 'Key Stage 2',
            canonicalUrl: 'https://www.thenational.academy/teachers/key-stages/ks2',
          },
        ];
        const result: ToolExecutionResult = { status: 200, data };
        return Promise.resolve(result);
      },
    },
  };
}

function createErrorOverrides(message: string): CreateLiveHttpAppOptions {
  return {
    overrides: {
      executeMcpTool: (name, args, client) => {
        void args;
        void client;
        return Promise.resolve({
          error: new McpToolError(message, String(name), { code: 'SIMULATED_ERROR' }),
        });
      },
    },
  };
}

describe('Streamable HTTP server (live mode with overrides)', () => {
  it('formats successful tool responses identically to stub mode', async () => {
    const captured: CapturedCall[] = [];
    const { app } = await createLiveHttpApp(createOverrides(captured));
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: 'live-success',
        method: 'tools/call',
        params: { name: 'get-key-stages', arguments: {} },
      });

    expect(res.status).toBe(200);
    expect(captured).toEqual([{ tool: 'get-key-stages', args: {} }]);

    const envelope = parseSseEnvelope(res.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).not.toBe(true);
    const payload = parseToolSuccessPayload(result);
    expect(payload.status).toBe(200);
    if (!Array.isArray(payload.data)) {
      throw new Error('Expected array response from tool');
    }
    const first = payload.data[0] as { readonly canonicalUrl?: string } | undefined;
    expect(first?.canonicalUrl).toContain('thenational.academy');
  });

  it('propagates tool execution errors with the same SSE envelope structure', async () => {
    const { app } = await createLiveHttpApp(createErrorOverrides('Simulated execution failure'));
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: 'live-error',
        method: 'tools/call',
        params: { name: 'get-key-stages', arguments: { params: {} } },
      });

    expect(res.status).toBe(200);
    const envelope = parseSseEnvelope(res.text);
    const result = parseJsonRpcResult(envelope);
    expect(result.isError).toBe(true);
    const text = readFirstTextContent(getContentArray(result));
    expect(text).toContain('Simulated execution failure');
  });
});
