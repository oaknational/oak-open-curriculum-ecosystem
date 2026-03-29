import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

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
  createUniversalToolExecutor,
  generatedToolRegistry,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { err, ok } from '@oaknational/result';
import { stubSearchRetrieval } from './helpers/stub-search-retrieval.js';

const ACCEPT = 'application/json, text/event-stream';

interface CapturedCall {
  readonly tool: unknown;
  readonly args: unknown;
}

const ToolItemWithCanonicalUrlSchema = z.object({
  canonicalUrl: z.string(),
});

function createOverrides(captured: CapturedCall[]): CreateLiveHttpAppOptions {
  return {
    overrides: {
      createRequestExecutor: (config) => {
        const executor = createUniversalToolExecutor({
          executeMcpTool: (name, args) => {
            captured.push({ tool: name, args });
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
            const result: ToolExecutionResult = ok({ status: 200 as const, data });
            config.onToolExecution?.(name, result);
            return Promise.resolve(result);
          },
          searchRetrieval: stubSearchRetrieval,
          generatedTools: generatedToolRegistry,
          createAssetDownloadUrl: config.createAssetDownloadUrl,
        });
        return executor;
      },
    },
  };
}

function createErrorOverrides(message: string): CreateLiveHttpAppOptions {
  return {
    overrides: {
      createRequestExecutor: (config) => {
        const executor = createUniversalToolExecutor({
          executeMcpTool: (name) => {
            const result: ToolExecutionResult = err(
              new McpToolError(message, String(name), { code: 'SIMULATED_ERROR' }),
            );
            config.onToolExecution?.(name, result);
            return Promise.resolve(result);
          },
          searchRetrieval: stubSearchRetrieval,
          generatedTools: generatedToolRegistry,
          createAssetDownloadUrl: config.createAssetDownloadUrl,
        });
        return executor;
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
    const first = z.array(ToolItemWithCanonicalUrlSchema).parse(payload.data)[0];
    if (first === undefined) {
      throw new Error('Expected at least one payload item');
    }
    expect(first.canonicalUrl).toContain('thenational.academy');
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
