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

describe('MCP Prompts E2E', () => {
  describe('prompts/list - Client can discover workflow prompts', () => {
    it('returns find-lessons prompt', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/list',
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsListResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const prompts = parsed.data?.prompts ?? [];
      const findLessons = prompts.find((p) => p.name === 'find-lessons');

      expect(findLessons).toBeDefined();
    });

    it('returns lesson-planning prompt', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/list',
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsListResultSchema.safeParse(envelope.result);

      const prompts = parsed.data?.prompts ?? [];
      const lessonPlanning = prompts.find((p) => p.name === 'lesson-planning');

      expect(lessonPlanning).toBeDefined();
    });

    it('returns progression-map prompt', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/list',
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsListResultSchema.safeParse(envelope.result);

      const prompts = parsed.data?.prompts ?? [];
      const progressionMap = prompts.find((p) => p.name === 'progression-map');

      expect(progressionMap).toBeDefined();
    });

    it('prompts include helpful descriptions', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/list',
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsListResultSchema.safeParse(envelope.result);

      const prompts = parsed.data?.prompts ?? [];

      // Proves: Descriptions help users choose the right prompt
      for (const prompt of prompts) {
        expect(prompt.description).toBeDefined();
        expect(prompt.description?.length).toBeGreaterThan(10);
      }
    });
  });

  describe('prompts/get - Client gets workflow guidance', () => {
    it('find-lessons prompt includes topic in messages', async () => {
      const { app } = createStubbedHttpApp();

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
      const { app } = createStubbedHttpApp();

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

    it('lesson-planning prompt includes year context', async () => {
      const { app } = createStubbedHttpApp();

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
            arguments: { topic: 'decimals', year: 'Year 5' },
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

    it('progression-map prompt guides concept tracking', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'prompts/get',
          params: {
            name: 'progression-map',
            arguments: { concept: 'number', subject: 'maths' },
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = PromptsGetResultSchema.safeParse(envelope.result);

      const messages = parsed.data?.messages ?? [];
      const allText = messages.map((m) => m.content.text ?? '').join(' ');

      // Proves: Prompt addresses progression tracking use case
      expect(allText).toContain('number');
      expect(allText).toContain('maths');
    });
  });
});
