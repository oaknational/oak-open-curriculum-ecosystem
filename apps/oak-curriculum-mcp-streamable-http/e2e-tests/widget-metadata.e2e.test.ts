/**
 * E2E tests for ChatGPT widget metadata in MCP tools.
 *
 * These tests verify that when an MCP client calls `tools/list`, aggregated tools
 * include the `_meta` fields required for ChatGPT widget integration:
 *
 * - `openai/outputTemplate`: URI of the widget resource to render tool output
 * - `openai/toolInvocation/invoking`: Status text shown while tool executes
 * - `openai/toolInvocation/invoked`: Status text shown after tool completes
 *
 * This proves the end-to-end behaviour: MCP clients receive widget metadata
 * that enables Oak-branded output rendering in ChatGPT.
 *
 * @see aggregated-tool-widget.ts for widget HTML
 * @see widget-resource.e2e.test.ts for widget resource availability
 */

import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/application.js';
import { AGGREGATED_TOOL_WIDGET_URI } from '../src/aggregated-tool-widget.js';

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

interface ToolMeta {
  readonly 'openai/outputTemplate'?: string;
  readonly 'openai/toolInvocation/invoking'?: string;
  readonly 'openai/toolInvocation/invoked'?: string;
}

interface McpToolWithMeta {
  readonly name: string;
  readonly description?: string;
  readonly _meta?: ToolMeta;
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

function getToolsFromResult(payload: JsonRpcEnvelope): McpToolWithMeta[] {
  const result = payload.result as { tools?: unknown[] } | undefined;
  if (!result?.tools || !Array.isArray(result.tools)) {
    return [];
  }
  return result.tools.filter(
    (t): t is McpToolWithMeta => t !== null && typeof t === 'object' && 'name' in t,
  );
}

function findToolByName(tools: McpToolWithMeta[], name: string): McpToolWithMeta | undefined {
  return tools.find((t) => t.name === name);
}

async function callToolsList(
  app: ReturnType<typeof createApp>,
): Promise<{ tools: McpToolWithMeta[]; status: number }> {
  const res = await request(app)
    .post('/mcp')
    .set('Accept', ACCEPT)
    .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
  const payload = parseFirstSseData(res.text);
  return { tools: getToolsFromResult(payload), status: res.status };
}

describe('ChatGPT Widget Metadata E2E', () => {
  beforeEach(() => {
    enableAuthBypass();
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
    delete process.env.ALLOWED_ORIGINS;
  });

  /**
   * Aggregated tool names that should have widget metadata.
   */
  const aggregatedToolNames = ['search', 'fetch', 'get-ontology'] as const;

  describe('openai/outputTemplate', () => {
    it.each(aggregatedToolNames)(
      '%s tool returns _meta with openai/outputTemplate in tools/list',
      async (toolName) => {
        const app = createApp();
        const { tools, status } = await callToolsList(app);
        expect(status).toBe(200);

        const tool = findToolByName(tools, toolName);
        expect(tool).toBeDefined();
        expect(tool?._meta).toBeDefined();
        expect(tool?._meta?.['openai/outputTemplate']).toBe(AGGREGATED_TOOL_WIDGET_URI);
      },
    );

    it('outputTemplate URI matches a registered resource', async () => {
      const app = createApp();

      // Get the outputTemplate URI from tools/list
      const { tools } = await callToolsList(app);
      const searchTool = findToolByName(tools, 'search');
      const templateUri = searchTool?._meta?.['openai/outputTemplate'];
      expect(templateUri).toBeDefined();

      // Verify this URI exists in resources/list
      const resourcesRes = await request(app)
        .post('/mcp')
        .set('Accept', ACCEPT)
        .send({ jsonrpc: '2.0', id: '2', method: 'resources/list' });

      const resourcesPayload = parseFirstSseData(resourcesRes.text);
      const result = resourcesPayload.result as { resources?: { uri: string }[] } | undefined;
      const resources = result?.resources ?? [];
      const matchingResource = resources.find((r) => r.uri === templateUri);

      expect(matchingResource).toBeDefined();
    });
  });

  describe('openai/toolInvocation status text', () => {
    it.each(aggregatedToolNames)(
      '%s tool returns invoking status text in tools/list',
      async (toolName) => {
        const app = createApp();
        const { tools, status } = await callToolsList(app);
        expect(status).toBe(200);

        const tool = findToolByName(tools, toolName);
        expect(tool?._meta?.['openai/toolInvocation/invoking']).toBeDefined();
        expect(typeof tool?._meta?.['openai/toolInvocation/invoking']).toBe('string');
        expect(tool?._meta?.['openai/toolInvocation/invoking']?.length).toBeGreaterThan(0);
      },
    );

    it.each(aggregatedToolNames)(
      '%s tool returns invoked status text in tools/list',
      async (toolName) => {
        const app = createApp();
        const { tools, status } = await callToolsList(app);
        expect(status).toBe(200);

        const tool = findToolByName(tools, toolName);
        expect(tool?._meta?.['openai/toolInvocation/invoked']).toBeDefined();
        expect(typeof tool?._meta?.['openai/toolInvocation/invoked']).toBe('string');
        expect(tool?._meta?.['openai/toolInvocation/invoked']?.length).toBeGreaterThan(0);
      },
    );
  });
});
