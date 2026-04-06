/**
 * E2E tests for MCP Apps widget metadata in MCP tools (ADR-141).
 *
 * These tests verify the widget metadata mechanism: tools in
 * WIDGET_TOOL_NAMES get `_meta.ui.resourceUri`, others do not.
 * The tests derive from the canonical WIDGET_TOOL_NAMES set rather
 * than hardcoding tool names, so they remain correct when the
 * allowlist changes.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import request from 'supertest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';
import { WIDGET_URI, WIDGET_TOOL_NAMES } from '@oaknational/sdk-codegen/widget-constants';

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
  tools: z.array(McpToolSchema),
});

async function fetchToolsList(
  app: Awaited<ReturnType<typeof createStubbedHttpApp>>['app'],
): Promise<z.infer<typeof McpToolSchema>[]> {
  const res = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

  if (res.status !== 200) {
    throw new Error(`tools/list returned status ${String(res.status)}, expected 200`);
  }
  const envelope = parseSseEnvelope(res.text);
  return ToolsListResultSchema.parse(envelope.result).tools;
}

describe('MCP Apps Widget Metadata E2E (ADR-141)', () => {
  it('tools in WIDGET_TOOL_NAMES have _meta.ui.resourceUri, others do not', async () => {
    const { app } = await createStubbedHttpApp();
    const tools = await fetchToolsList(app);

    // Guard: WIDGET_TOOL_NAMES must be non-empty to avoid a vacuous pass.
    expect(WIDGET_TOOL_NAMES.size).toBeGreaterThan(0);

    for (const tool of tools) {
      if (WIDGET_TOOL_NAMES.has(tool.name)) {
        expect(tool._meta?.ui?.resourceUri, `${tool.name} should have widget URI`).toBe(WIDGET_URI);
      } else {
        expect(tool._meta?.ui, `${tool.name} should not have widget UI`).toBeUndefined();
      }
    }
  });

  it('all widget URIs in tools/list correspond to registered resources', async () => {
    const { app } = await createStubbedHttpApp();
    const tools = await fetchToolsList(app);

    // Guard: at least one widget tool must exist.
    const widgetUris = tools
      .filter((t) => t._meta?.ui?.resourceUri !== undefined)
      .map((t) => t._meta?.ui?.resourceUri);

    expect(widgetUris.length, 'at least one widget tool must be registered').toBeGreaterThan(0);

    const resourcesRes = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({ jsonrpc: '2.0', id: '2', method: 'resources/list' });

    const ResourcesListResultSchema = z.object({
      resources: z.array(z.object({ uri: z.string() }).loose()),
    });

    const envelope = parseSseEnvelope(resourcesRes.text);
    const resourcesParsed = ResourcesListResultSchema.parse(envelope.result);
    const registeredUris = resourcesParsed.resources.map((r) => r.uri);

    for (const uri of widgetUris) {
      expect(registeredUris, `widget URI ${uri} should be a registered resource`).toContain(uri);
    }
  });
});
