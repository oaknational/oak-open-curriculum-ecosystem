/**
 * WS3 RED specifications — failing tests that define the target system behaviour.
 *
 * These tests are intentionally RED (failing) and document the expected
 * GREEN phase for each. They form the TDD contract for the WS3 MCP App
 * rebuild: each test specifies system behaviour that does not yet exist.
 *
 * Every test proves something about the running system's protocol-level
 * behaviour, not about constant values or internal configuration.
 *
 * ## RED/GREEN Contract
 *
 * | Test | Expected RED reason | GREEN phase |
 * |------|-------------------|-------------|
 * | UI tools have _meta.ui.resourceUri | No tools configured for UI | Phase 3 |
 * | user-search-query has visibility ["app"] | Tool does not exist yet | Phase 3 |
 * | Widget resource uses fresh slug | Still uses oak-json-viewer | Phase 3 |
 *
 * @see ws3-widget-clean-break-rebuild.plan.md
 * @see ws3-phase-0-baseline-and-red-specs.plan.md
 */

import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { z } from 'zod';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';

/**
 * Zod schema for tools/list MCP response — strict boundary validation.
 */
const ToolsListResultSchema = z.object({
  tools: z.array(
    z
      .object({
        name: z.string(),
        _meta: z
          .object({
            ui: z
              .object({
                resourceUri: z.string().optional(),
                visibility: z.array(z.string()).optional(),
              })
              .loose()
              .optional(),
          })
          .loose()
          .optional(),
      })
      .loose(),
  ),
});

/**
 * Zod schema for resources/list MCP response — strict boundary validation.
 */
const ResourcesListResultSchema = z.object({
  resources: z.array(
    z.object({
      uri: z.string(),
      name: z.string().optional(),
      mimeType: z.string().optional(),
    }),
  ),
});

/**
 * Fetches tools/list from a stubbed app instance.
 */
async function getToolsList(app: Awaited<ReturnType<typeof createStubbedHttpApp>>['app']) {
  const res = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
  expect(res.status).toBe(200);
  const envelope = parseSseEnvelope(res.text);
  return ToolsListResultSchema.parse(envelope.result).tools;
}

/**
 * Fetches resources/list from a stubbed app instance.
 */
async function getResourcesList(app: Awaited<ReturnType<typeof createStubbedHttpApp>>['app']) {
  const res = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({ jsonrpc: '2.0', id: '1', method: 'resources/list' });
  expect(res.status).toBe(200);
  const envelope = parseSseEnvelope(res.text);
  return ResourcesListResultSchema.parse(envelope.result).resources;
}

describe('WS3 RED Specs: Widget Tool Registration Contract', () => {
  it('at least one tool in tools/list has _meta.ui.resourceUri', async () => {
    // RED reason: No tools configured for UI → no tools get _meta.ui in protocol response
    // GREEN phase: Phase 3 registers UI tools that advertise widget metadata
    const { app } = await createStubbedHttpApp();
    const tools = await getToolsList(app);

    const uiTools = tools.filter((t) => t._meta?.ui?.resourceUri !== undefined);
    expect(uiTools.length, 'at least one tool should advertise a widget UI').toBeGreaterThan(0);
  });
});

describe('WS3 RED Specs: App-Only Visibility Contract', () => {
  it('user-search-query tool has _meta.ui.visibility set to ["app"]', async () => {
    // RED reason: user-search-query tool does not exist yet
    // GREEN phase: Phase 3 adds user-search-query with visibility: ["app"]
    const { app } = await createStubbedHttpApp();
    const tools = await getToolsList(app);

    const userSearchQuery = tools.find((t) => t.name === 'user-search-query');
    expect(userSearchQuery, 'user-search-query tool must exist').toBeDefined();
    expect(userSearchQuery?._meta?.ui?.visibility).toEqual(['app']);
  });
});

describe('WS3 RED Specs: Fresh Resource Identity', () => {
  it('widget resource slug does not contain oak-json-viewer', async () => {
    // RED reason: Resource still uses oak-json-viewer slug
    // GREEN phase: Phase 3 renames to fresh slug
    const { app } = await createStubbedHttpApp();
    const resources = await getResourcesList(app);

    const widgetResources = resources.filter((r) => r.mimeType === 'text/html;profile=mcp-app');
    expect(widgetResources.length).toBeGreaterThan(0);

    for (const resource of widgetResources) {
      expect(resource.uri).not.toContain('oak-json-viewer');
    }
  });
});
