/**
 * E2E tests for MCP prompts.
 *
 * These tests prove that MCP clients can:
 * - Discover workflow prompts via prompts/list
 * - Get prompt messages via prompts/get with arguments
 *
 * The tests exercise the full MCP protocol path, proving prompts
 * guide users through successful workflows.
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';
import { z } from 'zod';

const PromptsListResultSchema = z.object({
  prompts: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      arguments: z
        .array(
          z.object({
            name: z.string(),
            description: z.string().optional(),
            required: z.boolean().optional(),
          }),
        )
        .optional(),
    }),
  ),
});

const PromptsGetResultSchema = z.object({
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.object({
        type: z.string(),
        text: z.string().optional(),
      }),
    }),
  ),
});

async function listPrompts() {
  const { app } = await createStubbedHttpApp();
  const response = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({ jsonrpc: '2.0', id: '1', method: 'prompts/list' });

  const envelope = parseSseEnvelope(response.text);
  const parsed = PromptsListResultSchema.safeParse(envelope.result);
  return { response, parsed, prompts: parsed.data?.prompts ?? [] };
}

describe('MCP Prompts E2E', () => {
  describe('prompts/list - Client can discover workflow prompts', () => {
    it.each([
      'find-lessons',
      'lesson-planning',
      'explore-curriculum',
      'learning-progression',
      'curriculum-mapping',
      'adapt-lesson',
      'continue-progression',
    ])('returns %s prompt', async (promptName) => {
      const { response, parsed, prompts } = await listPrompts();

      expect(response.status).toBe(200);
      expect(parsed.success).toBe(true);
      expect(prompts.find((p) => p.name === promptName)).toBeDefined();
    });

    it('prompts include helpful descriptions', async () => {
      const { prompts } = await listPrompts();

      for (const prompt of prompts) {
        expect(prompt.description).toBeDefined();
        expect(prompt.description?.length).toBeGreaterThan(10);
      }
    });
  });

  describe('prompts/get - Client gets workflow guidance', () => {
    it('find-lessons prompt includes topic in messages', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'find-lessons',
            arguments: { topic: 'photosynthesis' },
          },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsGetResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const messages = parsed.data?.messages ?? [];
      const allText = messages.map((m) => m.content.text ?? '').join(' ');

      // Proves: Prompt personalizes guidance with user's topic
      expect(allText).toContain('photosynthesis');
    });

    it('find-lessons prompt guides to use search tool', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'find-lessons',
            arguments: { topic: 'fractions' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsGetResultSchema.safeParse(envelope.result);

      const messages = parsed.data?.messages ?? [];
      const allText = messages.map((m) => m.content.text ?? '').join(' ');

      // Proves: Prompt guides users to use the right tools
      expect(allText).toContain('search');
    });

    it('lesson-planning prompt includes yearGroup context', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'lesson-planning',
            arguments: { topic: 'decimals', yearGroup: 'Year 5' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsGetResultSchema.safeParse(envelope.result);

      const messages = parsed.data?.messages ?? [];
      const allText = messages.map((m) => m.content.text ?? '').join(' ');

      // Proves: Prompt uses provided context
      expect(allText).toContain('Year 5');
      expect(allText).toContain('decimals');
    });

    it('lesson-planning prompt carries Oak attribution under the Open Government Licence', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'lesson-planning',
            arguments: { topic: 'decimals', yearGroup: 'Year 5' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsGetResultSchema.safeParse(envelope.result);

      const messages = parsed.data?.messages ?? [];
      const allText = messages.map((m) => m.content.text ?? '').join(' ');

      // Proves: the served prompt carries its source skill's attribution
      // (Oak data under OGL v3.0) through the wire surface.
      expect(allText).toContain('Oak National Academy');
      expect(allText).toContain('Open Government Licence');
    });

    it('explore-curriculum prompt includes topic and references explore-topic', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'explore-curriculum',
            arguments: { topic: 'volcanos' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsGetResultSchema.safeParse(envelope.result);

      const messages = parsed.data?.messages ?? [];
      const allText = messages.map((m) => m.content.text ?? '').join(' ');

      expect(allText).toContain('volcanos');
      expect(allText).toContain('explore-topic');
    });

    it('curriculum-mapping prompt grounds the map in threads and prerequisites', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'curriculum-mapping',
            arguments: { subject: 'maths', keyStage: 'ks2' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsGetResultSchema.safeParse(envelope.result);

      const messages = parsed.data?.messages ?? [];
      const allText = messages.map((m) => m.content.text ?? '').join(' ');

      expect(allText).toContain('maths');
      expect(allText).toContain('ks2');
      // Proves: the served prompt grounds ordering in Oak's thread backbone.
      expect(allText).toContain('get-thread-progressions');
    });

    it('continue-progression prompt resolves position to next step via Oak sequence tools', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'continue-progression',
            arguments: {
              subject: 'maths',
              yearGroup: 'Year 4',
              justCovered: 'equivalent fractions',
            },
          },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsGetResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const messages = parsed.data?.messages ?? [];
      const allText = messages.map((m) => m.content.text ?? '').join(' ');

      // Proves: the served prompt anchors on the stated position and derives
      // the next step from Oak's sequence, readiness, and misconception tools.
      expect(allText).toContain('equivalent fractions');
      expect(allText).toContain('get-thread-progressions');
      expect(allText).toContain('get-prior-knowledge-graph');
      expect(allText).toContain('get-misconception-graph');
      // Proves: planning substance stays single-sourced — the prompt chains
      // into lesson-planning rather than restating it.
      expect(allText).toContain('lesson-planning');
    });

    it('learning-progression prompt includes concept and subject', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'learning-progression',
            arguments: { concept: 'algebra', subject: 'maths' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsGetResultSchema.safeParse(envelope.result);

      const messages = parsed.data?.messages ?? [];
      const allText = messages.map((m) => m.content.text ?? '').join(' ');

      expect(allText).toContain('algebra');
      expect(allText).toContain('maths');
    });
  });
});
