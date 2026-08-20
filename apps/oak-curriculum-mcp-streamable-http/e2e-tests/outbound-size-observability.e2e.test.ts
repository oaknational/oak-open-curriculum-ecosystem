/**
 * E2E: outbound token health metric — both halves observed through the
 * real protocol path.
 *
 * Drives JSON-RPC requests through the app (HTTP → MCP SDK → SSE) and
 * asserts the two structured size records the server emits per request:
 *
 * - "MCP response size" (transport half): wire body bytes counted at the
 *   write seam, attributed by mcp method and — for tools/call — tool name.
 *   This is also the canary for the write-path dependency: if an SDK or
 *   Hono upgrade stops streaming through res.write/res.end, bodyBytes
 *   stops being positive and this test fails.
 * - "MCP tool result size" (per-field half): serialised-JSON char split
 *   of the CallToolResult fields, attributed by tool name.
 *
 * Existence and sanity only — numeric edge semantics are pinned by the
 * unit tests (token-estimate, response-byte-counter,
 * tool-result-measurement); no payload-size budgets are asserted here
 * (thresholds are a later, baseline-informed decision).
 */

import { request } from '../src/test-helpers/loopback-request.js';
import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';
import type { Logger } from '@oaknational/logger';
import { createApp } from '../src/application.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import {
  createUniversalToolExecutor,
  generatedToolRegistry,
  type ToolExecutionResult,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { ok } from '@oaknational/result';
import { createFakeHttpObservability } from '../src/test-helpers/observability-fakes.js';
import { stubSearchRetrieval } from './helpers/stub-search-retrieval.js';
import { createMockRuntimeConfig } from './helpers/test-config.js';
import { getScratchStaticRoot } from '../src/test-helpers/static-root-fixture.js';

const ACCEPT = 'application/json, text/event-stream';

const RESPONSE_SIZE_RECORD = z.object({
  mcpMethod: z.string(),
  mcpToolName: z.string().optional(),
  bodyBytes: z.number().int().positive(),
  tokensEst: z.number().int().positive(),
});

const TOOL_RESULT_SIZE_RECORD = z.object({
  toolName: z.string(),
  contentChars: z.number().int().nonnegative(),
  structuredChars: z.number().int().nonnegative(),
  metaChars: z.number().int().nonnegative(),
  totalChars: z.number().int().positive(),
  tokensEst: z.number().int().positive(),
});

function createStubOverrides(): ToolHandlerOverrides {
  return {
    createRequestExecutor: (config) =>
      createUniversalToolExecutor({
        executeMcpTool: (name) => {
          const data = [{ slug: 'ks1', title: 'Key Stage 1' }];
          const result: ToolExecutionResult = ok({ status: 200 as const, data });
          config.onToolExecution?.(name, result);
          return Promise.resolve(result);
        },
        searchRetrieval: stubSearchRetrieval,
        generatedTools: generatedToolRegistry,
        createAssetDownloadUrl: config.createAssetDownloadUrl,
      }),
  };
}

/** Boots the app with a recording logger and returns both. */
async function createAppWithRecordingLogger() {
  const observability = createFakeHttpObservability();
  // The fake observability returns one shared logger instance, and
  // createApp falls back to observability.createLogger() — so this handle
  // records exactly what the running app logs.
  const logger = observability.createLogger();
  const app = await createApp({
    staticRoot: await getScratchStaticRoot(),
    toolHandlerOverrides: createStubOverrides(),
    runtimeConfig: createMockRuntimeConfig({ dangerouslyDisableAuth: true }),
    observability,
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
  });
  return { app, logger };
}

/**
 * All info-level records logged under the given message, schema-parsed.
 * The schema parse throws loudly on any malformed record — assertions,
 * not conditionals.
 */
function parsedInfoRecords<T>(logger: Logger, message: string, schema: z.ZodType<T>): T[] {
  return vi
    .mocked(logger.info)
    .mock.calls.filter((call) => call[0] === message)
    .map((call) => schema.parse(call[1]));
}

describe('Outbound size observability (E2E)', () => {
  it('emits both size records for a tools/call through the real wire path', async () => {
    const { app, logger } = await createAppWithRecordingLogger();

    const response = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-key-stages', arguments: {} },
      });
    expect(response.status).toBe(200);

    const responseSizes = parsedInfoRecords(logger, 'MCP response size', RESPONSE_SIZE_RECORD);
    expect(responseSizes).toHaveLength(1);
    expect(responseSizes[0]).toMatchObject({
      mcpMethod: 'tools/call',
      mcpToolName: 'get-key-stages',
    });
    for (const record of responseSizes) {
      expect(record.tokensEst).toBe(Math.ceil(record.bodyBytes / 4));
    }

    const toolResultSizes = parsedInfoRecords(
      logger,
      'MCP tool result size',
      TOOL_RESULT_SIZE_RECORD,
    );
    expect(toolResultSizes).toHaveLength(1);
    expect(toolResultSizes[0]).toMatchObject({ toolName: 'get-key-stages' });
    for (const record of toolResultSizes) {
      expect(record.contentChars).toBeGreaterThan(0);
      expect(record.totalChars).toBe(
        record.contentChars + record.structuredChars + record.metaChars,
      );
      expect(record.tokensEst).toBe(Math.ceil(record.totalChars / 4));
    }
  });

  it('measures a tools/list response at the transport seam (session-resident description cost)', async () => {
    const { app, logger } = await createAppWithRecordingLogger();

    const response = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(response.status).toBe(200);

    const responseSizes = parsedInfoRecords(logger, 'MCP response size', RESPONSE_SIZE_RECORD);
    expect(responseSizes).toHaveLength(1);
    expect(responseSizes[0]?.mcpMethod).toBe('tools/list');
    expect(responseSizes[0]?.mcpToolName).toBeUndefined();
    // tools/list carries every tool description the agent holds all
    // session — a materially large body by construction.
    expect(responseSizes[0]?.bodyBytes).toBeGreaterThan(1000);

    const toolResultSizes = parsedInfoRecords(
      logger,
      'MCP tool result size',
      TOOL_RESULT_SIZE_RECORD,
    );
    expect(toolResultSizes).toHaveLength(0);
  });
});
