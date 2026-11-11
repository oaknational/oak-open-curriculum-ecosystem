import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { request } from '../src/test-helpers/loopback-request.js';
import { createApp } from '../src/application.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import {
  createUniversalToolExecutor,
  generatedToolRegistry,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { ok } from '@oaknational/result';
import {
  hasJsonRpcOrResultError,
  parseSseEnvelope,
  readJsonRpcOrResultErrorText,
} from './helpers/sse.js';
import { createMockObservability, createMockRuntimeConfig } from './helpers/test-config.js';
import { stubSearchRetrieval } from './helpers/stub-search-retrieval.js';
import { getScratchStaticRoot } from '../src/test-helpers/static-root-fixture.js';

const ACCEPT = 'application/json, text/event-stream';
const SHARED_ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';

interface CapturedCall {
  readonly tool: unknown;
  readonly args: unknown;
}

/**
 * MCP-487 — the SERVED boundary, not the schema alone: a host whose bridge
 * sends numeric tool arguments as JSON strings gets the same answer as a
 * spec-compliant client, and the bound still bites for both encodings. The
 * request executor is captured, so the proof reads what the handler received
 * (the normalised number) and that a refused call never reached it.
 */
function createCapturingOverrides(captured: CapturedCall[]): ToolHandlerOverrides {
  return {
    createRequestExecutor: (config) =>
      createUniversalToolExecutor({
        executeMcpTool: (name, args) => {
          captured.push({ tool: name, args });
          const result: ToolExecutionResult = ok({ status: 200 as const, data: [] });
          config.onToolExecution?.(name, result);
          return Promise.resolve(result);
        },
        searchRetrieval: stubSearchRetrieval,
        generatedTools: generatedToolRegistry,
        createAssetDownloadUrl: config.createAssetDownloadUrl,
      }),
  };
}

async function createCapturingApp(captured: CapturedCall[]) {
  const runtimeConfig = createMockRuntimeConfig({
    dangerouslyDisableAuth: true,
    env: { ALLOWED_HOSTS: SHARED_ALLOWED_HOSTS },
  });
  return await createApp({
    staticRoot: await getScratchStaticRoot(),
    toolHandlerOverrides: createCapturingOverrides(captured),
    runtimeConfig,
    observability: createMockObservability(runtimeConfig),
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
  });
}

async function callKeywords(app: Awaited<ReturnType<typeof createCapturingApp>>, limit: unknown) {
  const res = await request(app)
    .post('/mcp')
    .set('Accept', ACCEPT)
    .send({
      jsonrpc: '2.0',
      id: '1',
      method: 'tools/call',
      params: { name: 'get-keywords', arguments: { limit } },
    });
  expect(res.status).toBe(200);
  return parseSseEnvelope(res.text);
}

const CapturedArgs = z.looseObject({ limit: z.unknown() });

describe('string-encoded numbers at the served boundary (MCP-487)', () => {
  it('serves the bounded number schema for the get-keywords limit with its authored example', async () => {
    const app = await createCapturingApp([]);
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);
    const envelope = parseSseEnvelope(res.text);
    const ToolList = z.looseObject({
      tools: z.array(z.looseObject({ name: z.string(), inputSchema: z.unknown() })),
    });
    const keywords = ToolList.parse(envelope.result).tools.find((t) => t.name === 'get-keywords');
    expect(keywords).toBeDefined();
    const LimitSchema = z.looseObject({
      properties: z.looseObject({
        limit: z.looseObject({
          type: z.literal('number'),
          maximum: z.literal(300),
          examples: z.tuple([z.literal(20)]),
        }),
      }),
    });
    expect(LimitSchema.safeParse(keywords?.inputSchema).error?.message ?? 'conforms').toBe(
      'conforms',
    );
  });

  it('hands the handler the same number for a decimal-string limit and a number limit', async () => {
    const captured: CapturedCall[] = [];
    const app = await createCapturingApp(captured);
    const asString = await callKeywords(app, '25');
    const asNumber = await callKeywords(app, 25);
    expect(hasJsonRpcOrResultError(asString)).toBe(false);
    expect(hasJsonRpcOrResultError(asNumber)).toBe(false);
    expect(captured).toHaveLength(2);
    expect(CapturedArgs.parse(captured[0]?.args).limit).toBe(25);
    expect(CapturedArgs.parse(captured[1]?.args).limit).toBe(25);
  });

  it.each([['5000'], [5000]])(
    'refuses the out-of-bound limit %j before any handler runs',
    async (limit) => {
      const captured: CapturedCall[] = [];
      const app = await createCapturingApp(captured);
      const envelope = await callKeywords(app, limit);
      expect(hasJsonRpcOrResultError(envelope)).toBe(true);
      expect(readJsonRpcOrResultErrorText(envelope)).toContain('300');
      expect(captured).toHaveLength(0);
    },
  );

  it.each([['abc'], [''], ['0x10'], ['Infinity'], [true]])(
    'refuses the non-decimal argument %j before any handler runs',
    async (limit) => {
      const captured: CapturedCall[] = [];
      const app = await createCapturingApp(captured);
      const envelope = await callKeywords(app, limit);
      expect(hasJsonRpcOrResultError(envelope)).toBe(true);
      expect(readJsonRpcOrResultErrorText(envelope).toLowerCase()).toContain('number');
      expect(captured).toHaveLength(0);
    },
  );
});
