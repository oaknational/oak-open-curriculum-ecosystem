/**
 * E2E tests for the get-ontology aggregated tool.
 *
 * These tests verify that the get-ontology tool:
 * - Appears in the tools/list response with correct metadata
 * - Returns curriculum ontology when called via tools/call
 *
 * The tests exercise the full MCP protocol path from HTTP request to response.
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope, parseJsonRpcResult, getStructuredContentData } from './helpers/sse.js';
import { z } from 'zod';

/**
 * Schema for validating the ontology response structure.
 * Tests behaviour (the data has the expected shape) not implementation details.
 */
const OntologyResponseSchema = z.object({
  version: z.string(),
  curriculumStructure: z.object({
    keyStages: z.array(
      z.object({
        slug: z.string(),
        name: z.string(),
      }),
    ),
    subjects: z.array(
      z.object({
        slug: z.string(),
        name: z.string(),
      }),
    ),
  }),
  workflows: z.object({
    findLessons: z.object({
      title: z.string(),
      description: z.string(),
      steps: z.array(z.unknown()),
    }),
  }),
});

/**
 * Schema for tool list entry, testing that metadata is present.
 */
const ToolListEntrySchema = z.object({
  name: z.literal('get-ontology'),
  description: z.string(),
  inputSchema: z.object({
    type: z.literal('object'),
    properties: z.object({}),
  }),
  annotations: z.object({
    readOnlyHint: z.literal(true),
    idempotentHint: z.literal(true),
    title: z.string(),
  }),
});

describe('get-ontology E2E', () => {
  describe('tools/list', () => {
    it('includes get-ontology tool with correct metadata', async () => {
      const { app } = createStubbedHttpApp();

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
      const result = parseJsonRpcResult(envelope);
      expect(result.tools).toBeDefined();

      const tools = result.tools as readonly { readonly name: string }[];
      const ontologyTool = tools.find((t) => t.name === 'get-ontology');
      expect(ontologyTool).toBeDefined();

      // Validate the tool has expected metadata shape
      const parsed = ToolListEntrySchema.safeParse(ontologyTool);
      expect(parsed.success).toBe(true);
    });
  });

  describe('tools/call', () => {
    it('returns curriculum ontology with expected structure', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-ontology', arguments: {} },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);
      expect(result.isError).not.toBe(true);

      // Full data is in structuredContent per OpenAI Apps SDK
      const ontologyData = getStructuredContentData(result);

      // Validate response has the curriculum domain model structure
      const parsed = OntologyResponseSchema.safeParse(ontologyData);
      expect(parsed.success).toBe(true);
    });

    it('returns ontology with key stages covering all UK education phases', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-ontology', arguments: {} },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      // Full data is in structuredContent per OpenAI Apps SDK
      const ontologyData = getStructuredContentData(result) as {
        readonly curriculumStructure: {
          readonly keyStages: readonly { readonly slug: string }[];
        };
      };

      const keyStagesSlugs = ontologyData.curriculumStructure.keyStages.map((ks) => ks.slug);
      expect(keyStagesSlugs).toContain('ks1');
      expect(keyStagesSlugs).toContain('ks2');
      expect(keyStagesSlugs).toContain('ks3');
      expect(keyStagesSlugs).toContain('ks4');
    });

    it('returns ontology with tool usage guidance for AI agents', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-ontology', arguments: {} },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      // Full data is in structuredContent per OpenAI Apps SDK
      const ontologyData = getStructuredContentData(result) as {
        readonly workflows: {
          readonly findLessons: { readonly description: string };
          readonly browseSubject: { readonly description: string };
        };
      };

      // Verify workflows help AI agents understand how to combine tools
      expect(ontologyData.workflows.findLessons.description).toContain('Search for lessons');
      expect(ontologyData.workflows.browseSubject.description).toContain('Explore');
    });
  });
});
