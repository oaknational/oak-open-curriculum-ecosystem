/**
 * E2E tests for documentation resources.
 *
 * These tests prove that MCP clients can:
 * - Discover documentation via resources/list
 * - Read helpful content via resources/read
 *
 * The tests exercise the full MCP protocol path, proving the "start here"
 * experience works for real clients.
 */

import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';
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

/** Reads a resource and returns its text content */
async function readResource(uri: string): Promise<string> {
  const { app } = createStubbedHttpApp();
  const response = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', STUB_ACCEPT_HEADER)
    .send({ jsonrpc: '2.0', id: '1', method: 'resources/read', params: { uri } });
  const envelope = parseSseEnvelope(response.text);
  const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
  return parsed.data?.contents[0]?.text ?? '';
}

describe('Documentation Resources E2E', () => {
  describe('resources/list - Client can discover documentation', () => {
    it('returns getting-started documentation resource', async () => {
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
      const gettingStarted = resources.find((r) => r.uri === 'docs://oak/getting-started.md');

      expect(gettingStarted).toBeDefined();
      expect(gettingStarted?.mimeType).toBe('text/markdown');
    });

    it('returns tools reference documentation resource', async () => {
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

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesListResultSchema.safeParse(envelope.result);

      const resources = parsed.data?.resources ?? [];
      const toolsRef = resources.find((r) => r.uri === 'docs://oak/tools.md');

      expect(toolsRef).toBeDefined();
      expect(toolsRef?.mimeType).toBe('text/markdown');
    });

    it('returns workflows documentation resource', async () => {
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

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesListResultSchema.safeParse(envelope.result);

      const resources = parsed.data?.resources ?? [];
      const workflows = resources.find((r) => r.uri === 'docs://oak/workflows.md');

      expect(workflows).toBeDefined();
      expect(workflows?.mimeType).toBe('text/markdown');
    });
  });

  describe('resources/read - Client can read helpful content', () => {
    it('getting-started explains how to authenticate', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'docs://oak/getting-started.md' },
        });

      expect(response.status).toBe(200);

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const content = parsed.data?.contents[0]?.text ?? '';

      // Proves: Content helps users understand authentication
      expect(content).toContain('Authentication');
      expect(content).toContain('OAuth');
    });

    it('getting-started explains how to start using tools', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'docs://oak/getting-started.md' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const content = parsed.data?.contents[0]?.text ?? '';

      // Proves: Content guides users to start using the server
      expect(content).toContain('Quick Start');
      expect(content).toContain('search');
    });

    it('tools reference explains tool categories', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'docs://oak/tools.md' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const content = parsed.data?.contents[0]?.text ?? '';

      // Proves: Content helps users understand tool organization
      expect(content).toContain('Discovery');
      expect(content).toContain('Fetching');
    });

    it('tools reference explains when to use each category', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'docs://oak/tools.md' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const content = parsed.data?.contents[0]?.text ?? '';

      // Proves: Content helps users choose the right tools
      expect(content).toContain('When to use');
    });

    it('workflows provides step-by-step guidance', async () => {
      const content = await readResource('docs://oak/workflows.md');
      expect(content).toMatch(/1\./);
      expect(content).toMatch(/2\./);
    });

    it('workflows includes common use cases', async () => {
      const content = await readResource('docs://oak/workflows.md');
      expect(content).toContain('lesson');
    });

    it('workflows includes userInteractions workflow first', async () => {
      const content = await readResource('docs://oak/workflows.md');
      expect(content).toContain('get-help');
      expect(content).toContain('get-ontology');
    });

    it('workflows shows what each step returns', async () => {
      const content = await readResource('docs://oak/workflows.md');
      expect(content).toContain('Returns:');
    });

    it('tools reference includes agentSupport category', async () => {
      const content = await readResource('docs://oak/tools.md');
      expect(content).toContain('Agent Support');
    });
  });
});

describe('Ontology Resource E2E', () => {
  describe('resources/list - Client can discover ontology', () => {
    it('returns curriculum://ontology resource', async () => {
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
      const ontology = resources.find((r) => r.uri === 'curriculum://ontology');

      expect(ontology).toBeDefined();
      expect(ontology?.mimeType).toBe('application/json');
    });
  });

  describe('resources/read - Client can read ontology', () => {
    it('curriculum://ontology returns valid JSON', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'curriculum://ontology' },
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

    it('curriculum://ontology includes curriculum structure', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'curriculum://ontology' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const content = parsed.data?.contents[0]?.text ?? '';
      const data = JSON.parse(content) as {
        curriculumStructure?: { keyStages?: unknown };
      };

      // Proves: Contains curriculum domain model
      expect(data.curriculumStructure).toBeDefined();
      expect(data.curriculumStructure?.keyStages).toBeDefined();
    });

    it('curriculum://ontology includes workflows', async () => {
      const { app } = createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'curriculum://ontology' },
        });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesReadResultSchema.safeParse(envelope.result);
      const content = parsed.data?.contents[0]?.text ?? '';
      const data = JSON.parse(content) as { workflows?: unknown };

      // Proves: Contains tool workflow guidance
      expect(data.workflows).toBeDefined();
    });
  });
});
