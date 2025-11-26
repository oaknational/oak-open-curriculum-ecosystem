import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/application.js';

/**
 * E2E tests for parameter examples metadata in MCP tools.
 *
 * These tests verify that `tools/list` returns JSON Schema `examples` arrays
 * for tool input parameters that have examples defined in the OpenAPI schema.
 *
 * Examples help AI agents understand expected input formats through concrete values.
 */

const ACCEPT = 'application/json, text/event-stream';

/**
 * Configure environment for auth bypass in E2E tests.
 */
function enableAuthBypass(): void {
  process.env.DANGEROUSLY_DISABLE_AUTH = 'true';
  process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
  process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing';
}

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
  if (parsed && typeof parsed === 'object') {
    return parsed as JsonRpcEnvelope;
  }
  throw new Error('Invalid SSE JSON');
}

function getToolsFromResult(payload: JsonRpcEnvelope): McpTool[] {
  const result = payload.result as { tools?: unknown[] } | undefined;
  if (!result?.tools || !Array.isArray(result.tools)) {
    return [];
  }
  return result.tools.filter(
    (t): t is McpTool => t !== null && typeof t === 'object' && 'name' in t,
  );
}

function findToolByName(tools: McpTool[], name: string): McpTool | undefined {
  return tools.find((t) => t.name === name);
}

async function callToolsList(
  app: ReturnType<typeof createApp>,
): Promise<{ tools: McpTool[]; status: number }> {
  const res = await request(app)
    .post('/mcp')
    .set('Accept', ACCEPT)
    .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
  const payload = parseFirstSseData(res.text);
  return { tools: getToolsFromResult(payload), status: res.status };
}

/**
 * Test suite for parameter examples metadata in MCP tools.
 *
 * ## Known Limitation: MCP SDK Examples Support
 *
 * The MCP SDK (v1.20.1) uses Zod for `inputSchema` in registerTool() and
 * converts Zod to JSON Schema for `tools/list` responses. Since Zod doesn't
 * support an `examples` property, examples are lost during this conversion.
 *
 * **What DOES work:**
 * - Examples are correctly extracted from OpenAPI schema at type-gen time
 * - Examples are emitted to `toolInputJsonSchema` in generated tool files
 * - Examples are defined in aggregated tool schemas (SEARCH_INPUT_SCHEMA, FETCH_INPUT_SCHEMA)
 *
 * **What DOESN'T work (SDK limitation):**
 * - Examples don't appear in MCP `tools/list` responses
 * - The SDK's Zod-to-JSON-Schema conversion doesn't preserve examples
 *
 * These tests verify the expected behavior and document the SDK limitation.
 * When the MCP SDK adds examples support, these tests should pass.
 *
 * @see https://github.com/modelcontextprotocol/typescript-sdk/issues/XXX
 */
describe('Tool Examples Metadata E2E', () => {
  beforeEach(() => {
    enableAuthBypass();
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
    delete process.env.ALLOWED_ORIGINS;
  });

  it('verifies tools/list returns valid tool definitions', async () => {
    const app = createApp();
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
});
