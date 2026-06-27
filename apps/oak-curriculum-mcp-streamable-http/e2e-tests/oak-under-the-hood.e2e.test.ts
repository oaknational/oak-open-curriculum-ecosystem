/**
 * E2E tests for the oak-under-the-hood orientation tool (pointer shape).
 *
 * These tests exercise the full MCP protocol path, proving that a connected
 * client can:
 * - Discover the oak-under-the-hood tool via tools/list (with its effort-scoped
 *   description and a closed empty inputSchema), alongside the curriculum
 *   tools — coexistence.
 * - Call it via tools/call and receive the ADR-058 dual-shape result carrying a
 *   POINTER (a `resource_link` to the canonical) — never a baked body, and never
 *   an `oakContextHint` (the curriculum firewall, held structurally).
 *
 * Behaviour-only: the tool serves no curated content, so nothing is grepped for
 * prose. The firewalls (effort-scoping, no curriculum hint) are held by
 * construction and PR review, asserted here only as structural absences.
 */

import request from 'supertest';
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
    }),
  ),
});

const ToolsCallResultSchema = z.object({
  content: z.array(
    z.object({
      type: z.string(),
      text: z.string().optional(),
      uri: z.string().optional(),
      name: z.string().optional(),
    }),
  ),
  structuredContent: z.record(z.string(), z.unknown()),
  isError: z.boolean().optional(),
});

describe('Oak: Under the Hood tool E2E', () => {
  describe('tools/list — client can discover the oak-under-the-hood tool', () => {
    it('advertises the oak-under-the-hood tool with an effort-scoped description and a closed empty inputSchema, alongside the curriculum tools', async () => {
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
      // Non-vacuous coexistence: the curriculum tools are still advertised in the same list.
      expect(result.tools.map((tool) => tool.name)).toContain('get-curriculum-model');
    });
  });

  describe('tools/call — client receives the pointer', () => {
    it('returns the ADR-058 dual shape carrying a resource_link to the canonical, not a baked body', async () => {
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
      // ADR-058 dual shape: a content array (summary slot is text) plus structuredContent.
      expect(result.content[0]?.type).toBe('text');
      expect(result.content.map((block) => block.type)).toContain('resource_link');
      // The pointer: a resource_link content block with an https uri and a name.
      const link = result.content.find((block) => block.type === 'resource_link');
      expect(link?.uri).toMatch(/^https:\/\//);
      expect((link?.name ?? '').length).toBeGreaterThan(0);
      // structuredContent carries the canonical URL and NO baked body / no curriculum hint.
      const structured = result.structuredContent;
      expect(structured.canonicalUrl).toMatch(/^https:\/\//);
      expect(structured).not.toHaveProperty('orientation');
      expect(structured).not.toHaveProperty('oakContextHint');
    });
  });
});
