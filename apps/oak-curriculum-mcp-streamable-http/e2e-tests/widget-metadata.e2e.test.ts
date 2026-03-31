/**
 * E2E tests for MCP Apps widget metadata in MCP tools (ADR-141).
 *
 * These tests verify the widget metadata mechanism: tools in
 * WIDGET_TOOL_NAMES get `_meta.ui.resourceUri`, others do not.
 * The tests derive from the canonical WIDGET_TOOL_NAMES set rather
 * than hardcoding tool names, so they remain correct when the
 * allowlist changes (including when it is temporarily empty).
 *
 * During the WS3 interim (Phase 1-2), WIDGET_TOOL_NAMES is empty,
 * so these tests pass vacuously. They become substantive in Phase 3
 * when the allowlist is re-populated with UI-bearing tools.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import request from 'supertest';
import { unwrap } from '@oaknational/result';
import { createApp } from '../src/application.js';
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { WIDGET_URI, WIDGET_TOOL_NAMES } from '@oaknational/sdk-codegen/widget-constants';

const ACCEPT = 'application/json, text/event-stream';

/**
 * Isolated test environment with auth bypassed.
 * No global `process.env` mutation — see ADR-078.
 */
const testEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_API_KEY: 'test',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
};

/**
 * Zod schemas for strict validation of MCP JSON-RPC responses at the
 * external boundary. Data is `unknown` from `JSON.parse`; these schemas
 * validate to the exact expected shape per ADR-141.
 */
const McpUiMetaSchema = z.object({
  resourceUri: z.string(),
});

const McpToolMetaSchema = z
  .object({
    ui: McpUiMetaSchema.optional(),
    securitySchemes: z.array(z.object({ type: z.string() }).loose()).optional(),
  })
  .loose();

const McpToolSchema = z
  .object({
    name: z.string(),
    description: z.string().optional(),
    _meta: McpToolMetaSchema.optional(),
  })
  .loose();

const ToolsListResultSchema = z.object({
  jsonrpc: z.string(),
  id: z.union([z.string(), z.number()]),
  result: z
    .object({
      tools: z.array(McpToolSchema),
    })
    .loose(),
});

/**
 * Extracts the first SSE `data:` line from a raw response.
 */
function extractSseDataLine(raw: string): string {
  const line = raw
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('data: '));
  if (!line) {
    throw new Error('No data line found in SSE payload');
  }
  return line.replace(/^data: /, '');
}

async function createTestApp() {
  const result = loadRuntimeConfig({
    processEnv: testEnv,
    startDir: process.cwd(),
  });
  const runtimeConfig = unwrap(result);
  return await createApp({ runtimeConfig });
}

async function callToolsList(app: Awaited<ReturnType<typeof createApp>>) {
  const res = await request(app)
    .post('/mcp')
    .set('Accept', ACCEPT)
    .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
  expect(res.status).toBe(200);
  const json: unknown = JSON.parse(extractSseDataLine(res.text));
  const parsed = ToolsListResultSchema.parse(json);
  return parsed.result.tools;
}

describe('MCP Apps Widget Metadata E2E (ADR-141)', () => {
  it('tools in WIDGET_TOOL_NAMES have _meta.ui.resourceUri, others do not', async () => {
    const app = await createTestApp();
    const tools = await callToolsList(app);

    for (const tool of tools) {
      if (WIDGET_TOOL_NAMES.has(tool.name)) {
        expect(tool._meta?.ui?.resourceUri, `${tool.name} should have widget URI`).toBe(WIDGET_URI);
      } else {
        expect(tool._meta?.ui, `${tool.name} should not have widget UI`).toBeUndefined();
      }
    }
  });

  it('all widget URIs in tools/list correspond to registered resources', async () => {
    const app = await createTestApp();
    const tools = await callToolsList(app);

    const widgetUris = tools
      .filter((t) => t._meta?.ui?.resourceUri !== undefined)
      .map((t) => t._meta?.ui?.resourceUri);

    if (widgetUris.length === 0) {
      // No widget tools configured — test passes trivially
      return;
    }

    const resourcesRes = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '2', method: 'resources/list' });

    const ResourcesListResultSchema = z.object({
      jsonrpc: z.string(),
      id: z.union([z.string(), z.number()]),
      result: z.object({ resources: z.array(z.object({ uri: z.string() }).loose()) }).loose(),
    });

    const resourcesJson: unknown = JSON.parse(extractSseDataLine(resourcesRes.text));
    const resourcesParsed = ResourcesListResultSchema.parse(resourcesJson);
    const registeredUris = resourcesParsed.result.resources.map((r) => r.uri);

    for (const uri of widgetUris) {
      expect(registeredUris, `widget URI ${uri} should be a registered resource`).toContain(uri);
    }
  });
});
