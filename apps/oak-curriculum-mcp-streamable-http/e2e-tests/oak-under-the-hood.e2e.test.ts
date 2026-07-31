/**
 * E2E tests for the oak-under-the-hood orientation tool (baked-content shape).
 *
 * These tests exercise the full MCP protocol path, proving that a connected
 * client can:
 * - Discover the oak-under-the-hood tool via tools/list (with its effort-scoped
 *   description and a closed empty inputSchema), alongside the curriculum
 *   tools — coexistence.
 * - Call it via tools/call and receive the ADR-058 dual-shape result carrying
 *   the orientation body on BOTH channels — with no external fetch instruction
 *   (directory policy §2.F, MCP-353). The curriculum firewall is held
 *   structurally: the tool builds its result locally, with no dependency on
 *   the curriculum SDK's response helpers (ADR-041).
 *
 * Behaviour-only: content CORRECTNESS is proved by the generator parity gate
 * (`validate-under-the-hood-content`); nothing here pins prose. The firewalls
 * (effort-scoping, curriculum separation) are held by construction and PR
 * review, asserted here only as structural presences/absences.
 */

import { request } from '../src/test-helpers/loopback-request.js';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';
import { OAK_UNDER_THE_HOOD_TOOL_NAME } from '../src/oak-under-the-hood/oak-under-the-hood-tool.js';

const ToolsListResultSchema = z.object({
  tools: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      inputSchema: z.record(z.string(), z.unknown()).optional(),
      annotations: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
});

const ToolsCallResultSchema = z.object({
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string().optional(),
    }),
  ),
  structuredContent: z.record(z.string(), z.unknown()),
  isError: z.boolean().optional(),
});

describe('Oak: Under the Hood tool E2E', () => {
  describe('tools/list — client can discover the oak-under-the-hood tool', () => {
    it('advertises the oak-under-the-hood tool with an effort-scoped description, a closed empty inputSchema, and openWorldHint false, alongside the curriculum tools', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = ToolsListResultSchema.parse(envelope.result);
      const orientationTool = result.tools.find(
        (tool) => tool.name === OAK_UNDER_THE_HOOD_TOOL_NAME,
      );

      expect(orientationTool).toBeDefined();
      // Description is non-vacuous and effort-scoped (the separation lever): it routes curriculum
      // queries away rather than describing curriculum. Never pinned to a constant.
      expect(orientationTool?.description).toContain('curriculum tools');
      // Closed empty inputSchema (zero-arg): a valid JSON Schema object accepting only {}.
      expect(orientationTool?.inputSchema?.type).toBe('object');
      expect(orientationTool?.inputSchema?.additionalProperties).toBe(false);
      // Served entirely from the deployed artefact: no open-world fetch on the wire form.
      expect(orientationTool?.annotations?.openWorldHint).toBe(false);
      // Non-vacuous coexistence: the curriculum tools are still advertised in the same list.
      expect(result.tools.map((tool) => tool.name)).toContain('get-curriculum-model');
    });
  });

  describe('tools/call — client receives the baked orientation', () => {
    it('returns the ADR-058 dual shape carrying the orientation body on both channels, with no fetch instruction', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: OAK_UNDER_THE_HOOD_TOOL_NAME, arguments: {} },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = ToolsCallResultSchema.parse(envelope.result);

      expect(result.isError).not.toBe(true);
      // ADR-058 dual shape: summary + markdown body in content, the same body in
      // structuredContent — clients that deliver only one channel still get it.
      expect(result.content).toHaveLength(2);
      expect(result.content.every((block) => block.type === 'text')).toBe(true);
      const body = result.content[1]?.text ?? '';
      expect(body.length).toBeGreaterThan(0);
      const structured = result.structuredContent;
      expect(structured.orientation).toBe(body);
      // The pointer shape is gone: no resource_link, no canonical fetch target,
      // no instruction to pull external behavioural content (§2.F, MCP-353).
      expect(result.content.map((block) => block.type)).not.toContain('resource_link');
      expect(structured).not.toHaveProperty('canonicalUrl');
      expect(structured).not.toHaveProperty('trigger');
      expect(JSON.stringify(result)).not.toContain('raw.githubusercontent.com');
      // Informational citations only (the curriculum firewall is structural).
      expect(typeof structured.repositoryUrl).toBe('string');
    });
  });
});
