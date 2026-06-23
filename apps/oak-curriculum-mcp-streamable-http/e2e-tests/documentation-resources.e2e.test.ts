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

/** JSON-RPC error shape for removed-URI assertions (code is load-bearing). */
const JsonRpcErrorWithCodeSchema = z.object({
  code: z.number(),
  message: z.string().optional(),
});

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

describe('Documentation Resources E2E', () => {
  describe('resources/list - Client can discover documentation', () => {
    it('returns getting-started documentation resource', async () => {
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
      const gettingStarted = resources.find((r) => r.uri === 'docs://oak/getting-started.md');

      expect(gettingStarted).toBeDefined();
      expect(gettingStarted?.mimeType).toBe('text/markdown');
    });

    it('no longer advertises the tools or workflows doc resources (single-sourced via curriculum://model)', async () => {
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

      const uris = (parsed.data?.resources ?? []).map((r) => r.uri);
      // The list is genuinely populated (getting-started present) and the
      // duplicated doc resources are gone — not a vacuous pass on a parse failure.
      expect(uris).toContain('docs://oak/getting-started.md');
      expect(uris).not.toContain('docs://oak/tools.md');
      expect(uris).not.toContain('docs://oak/workflows.md');
    });
  });

  describe('resources/read - Client can read helpful content', () => {
    it('getting-started explains how to authenticate', async () => {
      const { app } = await createStubbedHttpApp();

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
      const { app } = await createStubbedHttpApp();

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
  });
});

describe('Supplementary Data Resources E2E', () => {
  describe('resources/list includes supplementary data resources', () => {
    it('does not list curriculum://prior-knowledge-graph (removed — served by the anchored tool)', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({ jsonrpc: '2.0', id: '1', method: 'resources/list' });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesListResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const uris = (parsed.data?.resources ?? []).map((r) => r.uri);
      expect(uris).not.toContain('curriculum://prior-knowledge-graph');
    });

    it('does not list curriculum://thread-progressions (removed — served by the anchored tool)', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({ jsonrpc: '2.0', id: '1', method: 'resources/list' });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesListResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const uris = (parsed.data?.resources ?? []).map((r) => r.uri);
      expect(uris).not.toContain('curriculum://thread-progressions');
    });

    it('does not list curriculum://misconception-graph (removed — served by the anchored tool)', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({ jsonrpc: '2.0', id: '1', method: 'resources/list' });

      const envelope = parseSseEnvelope(response.text);
      const parsed = ResourcesListResultSchema.safeParse(envelope.result);
      expect(parsed.success).toBe(true);

      const uris = (parsed.data?.resources ?? []).map((r) => r.uri);
      expect(uris).not.toContain('curriculum://misconception-graph');
    });
  });

  describe('resources/read returns valid data', () => {
    it('reading the removed prior-knowledge-graph URI is a -32602 JSON-RPC error', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'curriculum://prior-knowledge-graph' },
        });

      const envelope = parseSseEnvelope(response.text);
      // SDK 1.29.0 rejects an unknown resource URI as InvalidParams (-32602);
      // the spec's -32002 resource-not-found is an unimplemented SHOULD.
      const error = JsonRpcErrorWithCodeSchema.parse(envelope.error);
      expect(error.code).toBe(-32602);
    });

    it('reading the removed misconception-graph URI is a -32602 JSON-RPC error', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'curriculum://misconception-graph' },
        });

      const envelope = parseSseEnvelope(response.text);
      // SDK 1.29.0 rejects an unknown resource URI as InvalidParams (-32602);
      // the spec's -32002 resource-not-found is an unimplemented SHOULD.
      const error = JsonRpcErrorWithCodeSchema.parse(envelope.error);
      expect(error.code).toBe(-32602);
    });

    it('reading the removed thread-progressions URI is a -32602 JSON-RPC error', async () => {
      const { app } = await createStubbedHttpApp();

      const response = await request(app)
        .post('/mcp')
        .set('Host', 'localhost')
        .set('Accept', STUB_ACCEPT_HEADER)
        .send({
          jsonrpc: '2.0',
          id: '1',
          method: 'resources/read',
          params: { uri: 'curriculum://thread-progressions' },
        });

      const envelope = parseSseEnvelope(response.text);
      // SDK 1.29.0 rejects an unknown resource URI as InvalidParams (-32602);
      // the spec's -32002 resource-not-found is an unimplemented SHOULD.
      const error = JsonRpcErrorWithCodeSchema.parse(envelope.error);
      expect(error.code).toBe(-32602);
    });
  });
});
