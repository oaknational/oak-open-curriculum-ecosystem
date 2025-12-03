/**
 * E2E tests for the get-knowledge-graph tool and curriculum://knowledge-graph resource.
 *
 * These tests prove that:
 * - The tool appears in tools/list
 * - The tool returns a valid concept graph in structuredContent
 * - The resource appears in resources/list
 * - The resource returns valid JSON
 *
 * @module get-knowledge-graph.e2e.test
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope, parseJsonRpcResult, getStructuredContentData } from './helpers/sse.js';
import { z } from 'zod';

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

const ResourcesReadResultSchema = z.object({
  contents: z.array(
    z.object({
      uri: z.string(),
      mimeType: z.string().optional(),
      text: z.string().optional(),
    }),
  ),
});

describe('get-knowledge-graph Tool E2E', () => {
  describe('tools/list - Tool discovery', () => {
    it('includes get-knowledge-graph in tool list', async () => {
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
      const kgTool = tools.find((t) => t.name === 'get-knowledge-graph');

      expect(kgTool).toBeDefined();
    });

    it('get-knowledge-graph description mentions concept relationships', async () => {
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

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      const tools = result.tools as readonly {
        readonly name: string;
        readonly description?: string;
      }[];
      const kgTool = tools.find((t) => t.name === 'get-knowledge-graph');

      expect(kgTool?.description).toContain('concept');
    });
  });

  describe('tools/call - Tool execution', () => {
    it('returns structuredContent with concept graph', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-knowledge-graph', arguments: {} },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);
      expect(result.isError).not.toBe(true);

      const graphData = getStructuredContentData(result) as {
        readonly version?: string;
        readonly concepts?: readonly unknown[];
        readonly edges?: readonly unknown[];
        readonly seeOntology?: string;
      };

      expect(graphData).toBeDefined();
      expect(graphData.version).toBeDefined();
      expect(graphData.concepts).toBeDefined();
      expect(graphData.edges).toBeDefined();
    });

    it('graph includes core hierarchy concepts', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-knowledge-graph', arguments: {} },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      const graphData = getStructuredContentData(result) as {
        readonly concepts: readonly { readonly id: string }[];
      };
      const ids = graphData.concepts.map((c) => c.id);

      expect(ids).toContain('subject');
      expect(ids).toContain('sequence');
      expect(ids).toContain('unit');
      expect(ids).toContain('lesson');
    });

    it('graph includes inferred edges', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-knowledge-graph', arguments: {} },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      const graphData = getStructuredContentData(result) as {
        readonly edges: readonly {
          readonly from: string;
          readonly to: string;
          readonly inferred?: true;
        }[];
      };
      const inferredEdges = graphData.edges.filter((e) => 'inferred' in e);

      expect(inferredEdges.length).toBeGreaterThan(0);
    });

    it('graph cross-references ontology', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-knowledge-graph', arguments: {} },
        });

      const envelope = parseSseEnvelope(response.text);
      const result = parseJsonRpcResult(envelope);

      const graphData = getStructuredContentData(result) as {
        readonly seeOntology: string;
      };

      expect(graphData.seeOntology).toContain('get-ontology');
    });

    it('seeOntology reference points to callable get-ontology tool', async () => {
      const { app } = createStubbedHttpApp();

      // First call get-knowledge-graph
      const kgResponse = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'tools/call',
          params: { name: 'get-knowledge-graph', arguments: {} },
        });

      const kgEnvelope = parseSseEnvelope(kgResponse.text);
      const kgResult = parseJsonRpcResult(kgEnvelope);
      const graphData = getStructuredContentData(kgResult) as { readonly seeOntology: string };

      // Verify seeOntology mentions get-ontology
      expect(graphData.seeOntology).toContain('get-ontology');

      // Now verify get-ontology is actually callable
      const ontologyResponse = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '2',
          method: 'tools/call',
          params: { name: 'get-ontology', arguments: {} },
        });

      const ontologyEnvelope = parseSseEnvelope(ontologyResponse.text);
      const ontologyResult = parseJsonRpcResult(ontologyEnvelope);
      expect(ontologyResult.isError).not.toBe(true);
    });
  });
});

describe('Knowledge Graph Resource E2E', () => {
  describe('resources/list - Client can discover knowledge graph', () => {
    it('returns curriculum://knowledge-graph resource', async () => {
      const { app } = createStubbedHttpApp();

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
      const kgResource = resources.find((r) => r.uri === 'curriculum://knowledge-graph');

      expect(kgResource).toBeDefined();
      expect(kgResource?.mimeType).toBe('application/json');
    });
  });

  describe('resources/read - Client can read knowledge graph', () => {
    it('curriculum://knowledge-graph returns valid JSON', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'curriculum://knowledge-graph' },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const content = parsed.data?.contents[0]?.text ?? '';
      expect(content).toBeDefined();

      // Proves: Returns valid JSON
      expect(() => {
        JSON.parse(content);
      }).not.toThrow();
    });

    it('curriculum://knowledge-graph includes concepts and edges', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'curriculum://knowledge-graph' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const content = parsed.data?.contents[0]?.text ?? '';
      const data = JSON.parse(content) as {
        concepts?: unknown[];
        edges?: unknown[];
      };

      // Proves: Contains graph structure
      expect(data.concepts).toBeDefined();
      expect(data.edges).toBeDefined();
      expect(Array.isArray(data.concepts)).toBe(true);
      expect(Array.isArray(data.edges)).toBe(true);
    });
  });
});
