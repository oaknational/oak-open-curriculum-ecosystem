/**
 * MCP App Pipeline E2E tests — Phase 5 of WS3 off-the-shelf SDK adoption.
 *
 * Proves the full pipeline from tool registration through protocol response:
 *
 * 1. `registerAppTool` normalisation produces both modern (`_meta.ui.resourceUri`)
 *    and legacy (`_meta["ui/resourceUri"]`) metadata keys for UI tools.
 * 2. `_meta.securitySchemes` flows through the MCP SDK to the `tools/list` response
 *    (tested on a generated tool where the code generator mirrors it into `_meta`).
 * 3. App-only visibility (`['app']`) is correctly set on `user-search-query`.
 * 4. OpenAPI-derived examples flow from codegen through Zod `.meta({ examples })`
 *    through `z.toJSONSchema()` to the `tools/list` JSON Schema output.
 * 5. Widget resource serves HTML with the MCP Apps MIME type via `resources/read`.
 *
 * Uses `createStubbedHttpApp()` for in-process testing with auth bypassed (ADR-078).
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/active/ws3-off-the-shelf-mcp-sdk-adoption.plan.md
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { z } from 'zod';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';
import { WIDGET_URI, WIDGET_TOOL_NAMES } from '@oaknational/sdk-codegen/widget-constants';
import { RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/server';

// ---------------------------------------------------------------------------
// Zod boundary schemas — validate `unknown` protocol responses at the E2E edge
// ---------------------------------------------------------------------------

/**
 * Validates `_meta` on a tool in `tools/list`.
 *
 * The legacy key `"ui/resourceUri"` is declared explicitly so that Zod's
 * `.loose()` preserves it on the parsed type without requiring a type assertion.
 */
const ToolMetaSchema = z
  .object({
    ui: z
      .object({
        resourceUri: z.string().optional(),
        visibility: z.array(z.string()).optional(),
      })
      .loose()
      .optional(),
    securitySchemes: z.array(z.object({ type: z.string() }).loose()).optional(),
    'ui/resourceUri': z.string().optional(),
  })
  .loose();

/**
 * A JSON Schema property descriptor as produced by `z.toJSONSchema()`.
 *
 * We know the structure: the MCP SDK converts our Zod schemas into JSON Schema
 * with `type`, `description`, `examples`, `enum`, etc. Modelling this preserves
 * our understanding rather than discarding it with `z.unknown()`.
 */
const JsonSchemaPropertySchema = z
  .object({
    type: z.string().optional(),
    description: z.string().optional(),
    examples: z.array(z.unknown()).optional(),
    enum: z.array(z.unknown()).optional(),
  })
  .loose();

/** A single tool entry from `tools/list`. */
const ToolEntrySchema = z
  .object({
    name: z.string(),
    inputSchema: z
      .object({
        properties: z.record(z.string(), JsonSchemaPropertySchema).optional(),
      })
      .loose()
      .optional(),
    _meta: ToolMetaSchema.optional(),
  })
  .loose();

/** The `result` envelope from a `tools/list` JSON-RPC response. */
const ToolsListResultSchema = z.object({
  tools: z.array(ToolEntrySchema),
});

/** The `result` envelope from a `resources/read` JSON-RPC response. */
const ResourcesReadResultSchema = z.object({
  contents: z.array(
    z.object({
      uri: z.string(),
      mimeType: z.string().optional(),
      text: z.string().optional(),
    }),
  ),
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Sends a `tools/list` JSON-RPC request and returns the validated tool array.
 *
 * Does NOT assert the HTTP status — callers should assert `res.status` if
 * the status itself is part of the behaviour being proved.
 */
async function fetchToolsList(
  app: Awaited<ReturnType<typeof createStubbedHttpApp>>['app'],
): Promise<z.infer<typeof ToolEntrySchema>[]> {
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

/** Finds a tool by name, throwing if not found (narrows type for TypeScript). */
function findToolOrFail(
  tools: readonly z.infer<typeof ToolEntrySchema>[],
  name: string,
): z.infer<typeof ToolEntrySchema> {
  const tool = tools.find((t) => t.name === name);
  if (tool === undefined) {
    throw new Error(`Expected tool "${name}" in tools/list`);
  }
  return tool;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('MCP App Pipeline E2E', () => {
  it('registerAppTool normalisation adds legacy _meta["ui/resourceUri"] equal to modern key', async () => {
    const { app } = await createStubbedHttpApp();
    const tools = await fetchToolsList(app);

    // Guard: WIDGET_TOOL_NAMES must be non-empty to avoid a vacuous pass.
    // The modern key (_meta.ui.resourceUri) is proved in widget-metadata.e2e.test.ts;
    // this test focuses on the legacy flat key added by registerAppTool normalisation.
    expect(WIDGET_TOOL_NAMES.size).toBeGreaterThan(0);

    const uiTools = tools.filter((t) => WIDGET_TOOL_NAMES.has(t.name));
    expect(uiTools.length).toBe(WIDGET_TOOL_NAMES.size);

    for (const tool of uiTools) {
      // Legacy flat key must be present and equal to the modern nested key
      expect(tool._meta?.['ui/resourceUri'], `${tool.name}: legacy _meta["ui/resourceUri"]`).toBe(
        tool._meta?.ui?.resourceUri,
      );
    }
  });

  it('_meta.securitySchemes survives to tools/list for generated tools', async () => {
    const { app } = await createStubbedHttpApp();
    const tools = await fetchToolsList(app);

    // Generated tool with _meta.securitySchemes mirrored by the code generator.
    // Hardcoded name: no codegen constant exists for individual tool names.
    // If the OpenAPI schema renames this operation, sdk-codegen will rename
    // the tool and this test will fail, prompting an update.
    const tool = findToolOrFail(tools, 'get-key-stages-subject-lessons');

    expect(tool._meta?.securitySchemes, 'securitySchemes should be present in _meta').toBeDefined();

    expect(tool._meta?.securitySchemes?.length).toBeGreaterThan(0);
    expect(tool._meta?.securitySchemes?.[0]?.type).toBe('oauth2');
  });

  it('user-search-query has visibility ["app"]', async () => {
    const { app } = await createStubbedHttpApp();
    const tools = await fetchToolsList(app);

    const tool = findToolOrFail(tools, 'user-search-query');

    expect(tool._meta?.ui?.visibility).toEqual(['app']);
  });

  it('get-key-stages-subject-lessons has keyStage.examples containing "ks1"', async () => {
    const { app } = await createStubbedHttpApp();
    const tools = await fetchToolsList(app);

    const tool = findToolOrFail(tools, 'get-key-stages-subject-lessons');
    const keyStageProperty = tool.inputSchema?.properties?.['keyStage'];

    expect(keyStageProperty, 'keyStage property should exist in inputSchema').toBeDefined();
    expect(keyStageProperty?.examples).toContain('ks1');
  });

  it('resources/read for widget URI returns HTML with text/html;profile=mcp-app', async () => {
    const { app } = await createStubbedHttpApp();

    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'resources/read',
        params: { uri: WIDGET_URI },
      });

    expect(res.status).toBe(200);

    const envelope = parseSseEnvelope(res.text);
    const parsed = ResourcesReadResultSchema.parse(envelope.result);

    expect(parsed.contents.length).toBeGreaterThan(0);

    const content = parsed.contents[0];
    expect(content?.uri).toBe(WIDGET_URI);
    expect(content?.mimeType).toBe(RESOURCE_MIME_TYPE);
    expect(content?.text).toContain('<!doctype html>');
  });
});
