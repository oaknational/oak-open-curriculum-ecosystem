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

function getPropertyExamples(tool: McpTool, propName: string): readonly unknown[] {
  const prop = tool.inputSchema?.properties?.[propName];
  return prop?.examples ?? [];
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

  it('tools/list includes examples for generated tools with OpenAPI examples', async () => {
    const app = createApp();
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
    const app = createApp();
    const { tools, status } = await callToolsList(app);
    expect(status).toBe(200);

    const searchTool = findToolByName(tools, 'search');
    expect(searchTool).toBeDefined();
    if (!searchTool) {
      throw new Error('Tool not found');
    }

    const qExamples = getPropertyExamples(searchTool, 'q');
    expect(qExamples.length).toBeGreaterThan(0);
  });

  it('tools/list includes examples for aggregated fetch tool', async () => {
    const app = createApp();
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
