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

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { unwrap } from '@oaknational/result';
import { createApp } from '../src/application.js';
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { WIDGET_URI } from '@oaknational/curriculum-sdk/public/mcp-tools';

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

interface ToolMeta {
  readonly 'openai/outputTemplate'?: string;
  readonly 'openai/toolInvocation/invoking'?: string;
  readonly 'openai/toolInvocation/invoked'?: string;
  readonly 'openai/widgetAccessible'?: boolean;
  readonly 'openai/visibility'?: 'public' | 'private';
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

async function createTestApp() {
  const result = loadRuntimeConfig({
    processEnv: testEnv,
    startDir: process.cwd(),
  });
  const runtimeConfig = unwrap(result);
  return await createApp({ runtimeConfig });
}

async function callToolsList(
  app: Awaited<ReturnType<typeof createApp>>,
): Promise<{ tools: McpToolWithMeta[]; status: number }> {
  const res = await request(app)
    .post('/mcp')
    .set('Accept', ACCEPT)
    .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
  const payload = parseFirstSseData(res.text);
  return { tools: getToolsFromResult(payload), status: res.status };
}

describe('ChatGPT Widget Metadata E2E', () => {
  /**
   * Aggregated tool names that should have widget metadata.
   */
  const aggregatedToolNames = ['search', 'fetch', 'get-curriculum-model'] as const;

  describe('openai/outputTemplate', () => {
    it.each(aggregatedToolNames)(
      '%s tool returns _meta with openai/outputTemplate in tools/list',
      async (toolName) => {
        const app = await createTestApp();
        const { tools, status } = await callToolsList(app);
        expect(status).toBe(200);

        const tool = findToolByName(tools, toolName);
        expect(tool).toBeDefined();
        expect(tool?._meta).toBeDefined();
        expect(tool?._meta?.['openai/outputTemplate']).toBe(WIDGET_URI);
      },
    );

    it('outputTemplate URI matches a registered resource', async () => {
      // Get the outputTemplate URI from tools/list
      const toolsApp = await createTestApp();
      const { tools } = await callToolsList(toolsApp);
      const searchTool = findToolByName(tools, 'search');
      const templateUri = searchTool?._meta?.['openai/outputTemplate'];
      expect(templateUri).toBeDefined();

      // Verify this URI exists in resources/list (same app, per-request transport)
      const resourcesRes = await request(toolsApp)
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
        const app = await createTestApp();
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
        const app = await createTestApp();
        const { tools, status } = await callToolsList(app);
        expect(status).toBe(200);

        const tool = findToolByName(tools, toolName);
        expect(tool?._meta?.['openai/toolInvocation/invoked']).toBeDefined();
        expect(typeof tool?._meta?.['openai/toolInvocation/invoked']).toBe('string');
        expect(tool?._meta?.['openai/toolInvocation/invoked']?.length).toBeGreaterThan(0);
      },
    );
  });

  describe('openai/widgetAccessible (enables widget tool calling)', () => {
    const allToolNames = [
      'search',
      'fetch',
      'get-curriculum-model',
      'get-subjects',
      'get-key-stages',
    ] as const;

    it.each(allToolNames)(
      '%s tool has widgetAccessible set to true in tools/list',
      async (toolName) => {
        const app = await createTestApp();
        const { tools, status } = await callToolsList(app);
        expect(status).toBe(200);

        const tool = findToolByName(tools, toolName);
        expect(tool?._meta?.['openai/widgetAccessible']).toBe(true);
      },
    );

    it('ALL tools have widgetAccessible (universal coverage)', async () => {
      const app = await createTestApp();
      const { tools, status } = await callToolsList(app);
      expect(status).toBe(200);

      for (const tool of tools) {
        expect(tool._meta?.['openai/widgetAccessible']).toBe(true);
      }
    });
  });

  describe('openai/visibility (tool visibility control)', () => {
    it('ALL tools have visibility set to public', async () => {
      const app = await createTestApp();
      const { tools, status } = await callToolsList(app);
      expect(status).toBe(200);

      for (const tool of tools) {
        expect(tool._meta?.['openai/visibility']).toBe('public');
      }
    });
  });

  describe('generated tools _meta in MCP response', () => {
    const generatedToolNames = ['get-subjects', 'get-key-stages', 'get-lessons-summary'] as const;

    it.each(generatedToolNames)(
      'generated tool %s has complete _meta in tools/list',
      async (toolName) => {
        const app = await createTestApp();
        const { tools, status } = await callToolsList(app);
        expect(status).toBe(200);

        const tool = findToolByName(tools, toolName);
        expect(tool).toBeDefined();
        expect(tool?._meta).toBeDefined();
        expect(tool?._meta?.['openai/outputTemplate']).toBe(WIDGET_URI);
        expect(tool?._meta?.['openai/widgetAccessible']).toBe(true);
        expect(tool?._meta?.['openai/visibility']).toBe('public');
      },
    );
  });
});
