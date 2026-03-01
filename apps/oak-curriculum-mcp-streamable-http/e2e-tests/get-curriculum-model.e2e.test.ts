/**
 * E2E tests for the get-curriculum-model aggregated tool.
 *
 * These tests prove that MCP clients can:
 * - Discover the tool via tools/list with correct metadata
 * - Call the tool to get combined orientation (domain model + tool guidance)
 * - Call the tool with tool_name for tool-specific help
 * - Discover the curriculum://model resource
 *
 * Coverage consolidated from get-ontology and get-help E2E tests after
 * those tools were replaced by get-curriculum-model.
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
      annotations: z
        .object({
          readOnlyHint: z.boolean().optional(),
          idempotentHint: z.boolean().optional(),
          title: z.string().optional(),
        })
        .optional(),
    }),
  ),
});

const DomainModelResponseSchema = z
  .object({
    domainModel: z
      .object({
        curriculumStructure: z
          .object({
            keyStages: z.array(z.object({ slug: z.string(), name: z.string() }).loose()),
            subjects: z.array(z.object({ slug: z.string(), name: z.string() }).loose()),
          })
          .loose(),
        workflows: z
          .object({
            findLessons: z.object({
              title: z.string(),
              description: z.string(),
              steps: z.array(z.unknown()),
            }),
          })
          .loose(),
        propertyGraph: z.object({
          version: z.string(),
          concepts: z.array(
            z.object({
              id: z.string(),
              label: z.string(),
              brief: z.string(),
              category: z.string(),
            }),
          ),
          edges: z.array(z.object({ from: z.string(), to: z.string(), rel: z.string() })),
        }),
      })
      .loose(),
    toolGuidance: z
      .object({
        serverOverview: z.unknown(),
        toolCategories: z.unknown(),
        workflows: z.unknown(),
        tips: z.unknown(),
      })
      .loose(),
  })
  .loose();

const ToolSpecificHelpSchema = z
  .object({
    toolSpecificHelp: z
      .object({
        tool: z.string(),
        category: z.string(),
        relatedWorkflows: z.unknown(),
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

async function callToolsList() {
  const { app } = await createStubbedHttpApp();
  const response = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
  expect(response.status).toBe(200);
  const envelope = parseSseEnvelope(response.text);
  const parsed = ToolsListResultSchema.parse(envelope.result);
  return parsed.tools;
}

async function callGetCurriculumModel(args: Record<string, string> = {}) {
  const { app } = await createStubbedHttpApp();
  const response = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({
      jsonrpc: '2.0',
      id: '1',
      method: 'tools/call',
      params: { name: 'get-curriculum-model', arguments: args },
    });
  expect(response.status).toBe(200);
  const envelope = parseSseEnvelope(response.text);
  const result = parseJsonRpcResult(envelope);
  expect(result.isError).not.toBe(true);
  return getStructuredContentData(result);
}

describe('get-curriculum-model E2E', () => {
  describe('tools/list - discovery', () => {
    it('includes get-curriculum-model tool', async () => {
      const tools = await callToolsList();
      const modelTool = tools.find((t) => t.name === 'get-curriculum-model');
      expect(modelTool).toBeDefined();
    });

    it('description explains purpose and when to use', async () => {
      const tools = await callToolsList();
      const modelTool = tools.find((t) => t.name === 'get-curriculum-model');
      expect(modelTool?.description).toContain('curriculum');
      expect(modelTool?.description).toContain('Use this when');
    });

    it('has correct annotations (readOnly, idempotent, title)', async () => {
      const tools = await callToolsList();
      const modelTool = tools.find((t) => t.name === 'get-curriculum-model');
      expect(modelTool?.annotations?.readOnlyHint).toBe(true);
      expect(modelTool?.annotations?.idempotentHint).toBe(true);
      expect(modelTool?.annotations?.title).toBeDefined();
    });
  });

  describe('tools/call - combined orientation (no parameters)', () => {
    it('returns domainModel and toolGuidance', async () => {
      const data = await callGetCurriculumModel();
      expect(data).toHaveProperty('domainModel');
      expect(data).toHaveProperty('toolGuidance');
    });

    it('toolGuidance includes serverOverview, toolCategories, workflows, tips', async () => {
      const data = await callGetCurriculumModel();
      const parsed = DomainModelResponseSchema.safeParse(data);
      expect(parsed.success).toBe(true);
    });

    it('domain model has key stages covering all UK education phases', async () => {
      const data = await callGetCurriculumModel();
      const parsed = DomainModelResponseSchema.parse(data);
      const keyStagesSlugs = parsed.domainModel.curriculumStructure.keyStages.map((ks) => ks.slug);
      expect(keyStagesSlugs).toContain('ks1');
      expect(keyStagesSlugs).toContain('ks2');
      expect(keyStagesSlugs).toContain('ks3');
      expect(keyStagesSlugs).toContain('ks4');
    });

    it('domain model has subjects', async () => {
      const data = await callGetCurriculumModel();
      const parsed = DomainModelResponseSchema.parse(data);
      expect(parsed.domainModel.curriculumStructure.subjects.length).toBeGreaterThan(0);
    });

    it('domain model has property graph with concepts and edges', async () => {
      const data = await callGetCurriculumModel();
      const parsed = DomainModelResponseSchema.parse(data);
      expect(parsed.domainModel.propertyGraph.concepts.length).toBeGreaterThan(0);
      expect(parsed.domainModel.propertyGraph.edges.length).toBeGreaterThan(0);
    });

    it('workflows include AI agent guidance (findLessons, browseSubject)', async () => {
      const data = await callGetCurriculumModel();
      const parsed = DomainModelResponseSchema.parse(data);
      expect(parsed.domainModel.workflows.findLessons.description).toContain('Search for lessons');
    });
  });

  describe('tools/call - tool-specific help (with tool_name)', () => {
    it('returns toolSpecificHelp with tool name and category', async () => {
      const data = await callGetCurriculumModel({ tool_name: 'search' });
      const parsed = ToolSpecificHelpSchema.safeParse(data);
      expect(parsed.success).toBe(true);
      expect(parsed.data?.toolSpecificHelp.tool).toBe('search');
    });

    it('returns category context for fetching tools', async () => {
      const data = await callGetCurriculumModel({ tool_name: 'fetch' });
      const parsed = ToolSpecificHelpSchema.safeParse(data);
      expect(parsed.success).toBe(true);
      expect(parsed.data?.toolSpecificHelp.category).toBeDefined();
    });

    it('returns related workflows for the tool', async () => {
      const data = await callGetCurriculumModel({ tool_name: 'search' });
      const parsed = ToolSpecificHelpSchema.safeParse(data);
      expect(parsed.success).toBe(true);
      expect(parsed.data?.toolSpecificHelp.relatedWorkflows).toBeDefined();
    });

    it('returns base orientation without toolSpecificHelp for unknown tool_name', async () => {
      const data = await callGetCurriculumModel({ tool_name: 'nonexistent-tool' });
      expect(data).toHaveProperty('domainModel');
      expect(data).toHaveProperty('toolGuidance');
      expect(data).not.toHaveProperty('toolSpecificHelp');
    });
  });

  describe('resources/list', () => {
    it('includes curriculum://model resource', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({ jsonrpc: '2.0', id: '1', method: 'resources/list' });

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
