/**
 * E2E tests for the get-curriculum-model aggregated tool.
 *
 * These tests prove that MCP clients can:
 * - Discover the tool via tools/list
 * - Call the tool to get combined orientation (domain model + tool guidance)
 * - Call the tool with tool_name for tool-specific help
 * - Discover the curriculum://model resource
 *
 * The tests exercise the full MCP protocol path from HTTP request to response.
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope, parseJsonRpcResult, getStructuredContentData } from './helpers/sse.js';
import { z } from 'zod';

const ToolsListResultSchema = z.object({
  tools: z.array(
    z.object({
      name: z.string(),
      description: z.string().optional(),
      inputSchema: z.record(z.string(), z.unknown()).optional(),
    }),
  ),
});

const DomainModelResponseSchema = z
  .object({
    domainModel: z
      .object({
        curriculumStructure: z
          .object({
            keyStages: z.array(z.object({ slug: z.string() }).loose()),
          })
          .loose(),
      })
      .loose(),
  })
  .loose();

const ResourcesListResultSchema = z.object({
  resources: z.array(
    z.object({
      uri: z.string(),
      name: z.string().optional(),
      description: z.string().optional(),
      mimeType: z.string().optional(),
    }),
  ),
});

describe('get-curriculum-model E2E', () => {
  describe('tools/list', () => {
    it('includes get-curriculum-model tool', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/list',
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const parsed = ToolsListResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const tools = parsed.data?.tools ?? [];
      const modelTool = tools.find((t) => t.name === 'get-curriculum-model');
      expect(modelTool).toBeDefined();
    });

    it('get-curriculum-model description explains its purpose', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/list',
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ToolsListResultSchema.safeParse(envelope.result);

      const tools = parsed.data?.tools ?? [];
      const modelTool = tools.find((t) => t.name === 'get-curriculum-model');

      expect(modelTool?.description).toContain('curriculum');
    });
  });

  describe('tools/call get-curriculum-model', () => {
    it('returns combined orientation when called without parameters', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-curriculum-model',
            arguments: {},
          },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);
      expect(result.isError).not.toBe(true);

      const data = getStructuredContentData(result);
      expect(data).toHaveProperty('domainModel');
      expect(data).toHaveProperty('toolGuidance');
    });

    it('returns tool-specific help when tool_name is provided', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-curriculum-model',
            arguments: { tool_name: 'search' },
          },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);
      expect(result.isError).not.toBe(true);

      const data = getStructuredContentData(result);
      expect(data).toHaveProperty('toolSpecificHelp');
    });

    it('domain model contains curriculum structure with key stages', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: {
            name: 'get-curriculum-model',
            arguments: {},
          },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);
      const rawData = getStructuredContentData(result);
      const parsed = DomainModelResponseSchema.safeParse(rawData);
      expect(parsed.success).toBe(true);

      const data = parsed.data;
      expect(data).toBeDefined();
      const keyStagesSlugs =
        data?.domainModel.curriculumStructure.keyStages.map((ks) => ks.slug) ?? [];
      expect(keyStagesSlugs).toContain('ks1');
      expect(keyStagesSlugs).toContain('ks4');
    });
  });

  describe('resources/list', () => {
    it('includes curriculum://model resource', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/list',
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesListResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const resources = parsed.data?.resources ?? [];
      const modelResource = resources.find((r) => r.uri === 'curriculum://model');
      expect(modelResource).toBeDefined();
    });
  });
});
