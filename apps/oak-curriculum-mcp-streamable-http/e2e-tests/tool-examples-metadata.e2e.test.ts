import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { unwrap } from '@oaknational/result';
import { createApp } from '../src/application.js';
import { createHttpObservabilityOrThrow } from '../src/observability/http-observability.js';
import { loadRuntimeConfig } from '../src/runtime-config.js';
/**
 * E2E tests for parameter examples metadata in MCP tools.
 *
 * These tests verify that `tools/list` returns JSON Schema `examples` arrays
 * for tool input parameters that have examples defined in the OpenAPI schema.
 *
 * Examples help AI agents understand expected input formats through concrete values.
 *
 * ## Implementation: B3 Hybrid Approach
 *
 * The MCP SDK's registerTool() accepts Zod schemas, but Zod doesn't support `examples`.
 * When the SDK responds to tools/list, it converts Zod back to JSON Schema, losing examples.
 *
 * We solve this by overriding the tools/list handler (via server.server.setRequestHandler)
 * to return our pre-generated JSON Schema directly. This preserves examples while still
 * using Zod for input validation on tools/call.
 *
 * @see application.ts for the override implementation
 * @see .agent/plans/sdk-and-mcp-enhancements/b3-tools-list-override-test-plan.md
 */

const ACCEPT = 'application/json, text/event-stream';

/**
 * Isolated test environment with auth bypassed.
 * No global `process.env` mutation — see ADR-078.
 */
const testEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_API_KEY: process.env.OAK_API_KEY ?? 'test',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
};

interface JsonRpcEnvelope {
  jsonrpc?: string;
  id?: string | number;
  result?: unknown;
  error?: unknown;
}

interface ToolInputSchema {
  readonly type?: string;
  readonly properties?: Record<
    string,
    {
      readonly type?: string;
      readonly description?: string;
      readonly examples?: readonly unknown[];
      readonly enum?: readonly unknown[];
    }
  >;
  readonly required?: readonly string[];
}

interface McpTool {
  readonly name: string;
  readonly description?: string;
  readonly inputSchema?: ToolInputSchema;
}

function isJsonRpcEnvelope(value: unknown): value is JsonRpcEnvelope {
  return typeof value === 'object' && value !== null;
}

function hasToolsResult(value: unknown): value is { readonly tools: unknown[] } {
  return (
    typeof value === 'object' && value !== null && 'tools' in value && Array.isArray(value.tools)
  );
}

function parseFirstSseData(raw: string): JsonRpcEnvelope {
  const line = raw
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('data: '));
  if (!line) {
    throw new Error('No data line found in SSE payload');
  }
  const json = line.replace(/^data: /, '');
  const parsed: unknown = JSON.parse(json);
  if (isJsonRpcEnvelope(parsed)) {
    return parsed;
  }
  throw new Error('Invalid SSE JSON');
}

function getToolsFromResult(payload: JsonRpcEnvelope): McpTool[] {
  if (!hasToolsResult(payload.result)) {
    return [];
  }
  return payload.result.tools.filter(
    (t): t is McpTool => t !== null && typeof t === 'object' && 'name' in t,
  );
}

function findToolByName(tools: McpTool[], name: string): McpTool | undefined {
  return tools.find((t) => t.name === name);
}

function getPropertyExamples(tool: McpTool, propName: string): readonly unknown[] {
  const prop = tool.inputSchema?.properties?.[propName];
  return prop?.examples ?? [];
}

async function createTestApp() {
  const result = loadRuntimeConfig({
    processEnv: testEnv,
    startDir: process.cwd(),
  });
  const runtimeConfig = unwrap(result);
  const observability = createHttpObservabilityOrThrow(runtimeConfig);
  return await createApp({
    runtimeConfig,
    observability,
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
  });
}

async function callToolsList(
  app: Awaited<ReturnType<typeof createApp>>,
): Promise<{ tools: McpTool[]; status: number }> {
  const res = await request(app)
    .post('/mcp')
    .set('Accept', ACCEPT)
    .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
  const payload = parseFirstSseData(res.text);
  return { tools: getToolsFromResult(payload), status: res.status };
}

describe('Tool Examples Metadata E2E', () => {
  it('verifies tools/list returns valid tool definitions', async () => {
    const app = await createTestApp();
    const { tools, status } = await callToolsList(app);
    expect(status).toBe(200);

    // Verify key tools exist with descriptions
    const sequencesTool = findToolByName(tools, 'get-sequences-units');
    expect(sequencesTool).toBeDefined();
    expect(sequencesTool?.inputSchema?.properties?.sequence).toBeDefined();

    const searchTool = findToolByName(tools, 'search');
    expect(searchTool).toBeDefined();
    expect(searchTool?.description).toContain('Search');

    const fetchTool = findToolByName(tools, 'fetch');
    expect(fetchTool).toBeDefined();
    expect(fetchTool?.description).toContain('Fetch');
  });

  it('tools/list includes examples for generated tools with OpenAPI examples', async () => {
    const app = await createTestApp();
    const { tools, status } = await callToolsList(app);
    expect(status).toBe(200);

    // get-sequences-units has examples in OpenAPI schema (sequence: "english-primary")
    const sequencesTool = findToolByName(tools, 'get-sequences-units');
    expect(sequencesTool).toBeDefined();
    if (!sequencesTool) {
      throw new Error('Tool not found');
    }

    const examples = getPropertyExamples(sequencesTool, 'sequence');
    expect(examples.length).toBeGreaterThan(0);
    expect(examples).toContain('english-primary');
  });

  it('tools/list includes examples for aggregated search tool', async () => {
    const app = await createTestApp();
    const { tools, status } = await callToolsList(app);
    expect(status).toBe(200);

    const searchTool = findToolByName(tools, 'search');
    expect(searchTool).toBeDefined();
    if (!searchTool) {
      throw new Error('Tool not found');
    }

    const queryExamples = getPropertyExamples(searchTool, 'query');
    expect(queryExamples.length).toBeGreaterThan(0);
  });

  it('tools/list includes examples for aggregated fetch tool', async () => {
    const app = await createTestApp();
    const { tools, status } = await callToolsList(app);
    expect(status).toBe(200);

    const fetchTool = findToolByName(tools, 'fetch');
    expect(fetchTool).toBeDefined();
    if (!fetchTool) {
      throw new Error('Tool not found');
    }

    const idExamples = getPropertyExamples(fetchTool, 'id');
    expect(idExamples.length).toBeGreaterThan(0);
    // Examples should follow the "type:slug" format
    expect(idExamples.some((ex) => typeof ex === 'string' && ex.includes(':'))).toBe(true);
  });
});
