import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/index.js';
import { toolNames } from '@oaknational/oak-curriculum-sdk';

/* eslint max-lines-per-function: ["error", 300] */

const ACCEPT = 'application/json, text/event-stream';

/**
 * Configure environment for auth bypass in E2E tests
 * This allows tests to run without needing Clerk OAuth tokens
 */
function enableAuthBypass(): void {
  process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true';
  process.env.NODE_ENV = 'development';
  process.env.CLERK_PUBLISHABLE_KEY = 'pk_test_bmF0aXZlLWhpcHBvLTE1LmNsZXJrLmFjY291bnRzLmRldiQ';
  process.env.CLERK_SECRET_KEY = 'sk_test_dummy_for_testing';
  delete process.env.VERCEL;
}

interface JsonRpcEnvelope {
  jsonrpc?: string;
  id?: string | number;
  result?: unknown;
  error?: unknown;
}

function parseFirstSseData(raw: string): JsonRpcEnvelope {
  const line = raw
    .split('\n')
    .map((l) => l.trim())
    .find((l) => l.startsWith('data: '));
  if (!line) {
    throw new Error('No data line found in SSE payload');
  }
  const json = line.replace(/^data: /, '');
  const parsed: unknown = JSON.parse(json);
  if (parsed && typeof parsed === 'object') {
    return parsed as JsonRpcEnvelope;
  }
  throw new Error('Invalid SSE JSON');
}

function toolNamesFromResult(value: unknown): string[] {
  const tools = (value as { result?: { tools?: unknown[] } }).result?.tools;
  if (!Array.isArray(tools)) {
    return [];
  }
  return tools
    .map((t) => (t && typeof t === 'object' ? (t as { name?: unknown }).name : undefined))
    .filter((n): n is string => typeof n === 'string');
}

describe('Oak Curriculum MCP Streamable HTTP - E2E', () => {
  beforeEach(() => {
    // Default: enable auth bypass for all E2E tests
    // Individual tests can override if needed
    enableAuthBypass();
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
    delete process.env.ALLOWED_ORIGINS;
  });

  it('returns 401 when missing Authorization (auth enforcement test)', async () => {
    // Override: disable bypass to test auth enforcement
    delete process.env.REMOTE_MCP_ALLOW_NO_AUTH;
    process.env.NODE_ENV = 'test'; // NOT development

    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(401);
    // Assert WWW-Authenticate header is present (Clerk format)
    const header = res.headers['www-authenticate'] as string | undefined;
    expect(header).toBeDefined();
    // Clerk provides Bearer challenge with resource_metadata
    expect(header?.toLowerCase()).toMatch(/^bearer\s+/);
    expect(header).toContain('resource_metadata');
  });

  it('returns 200 with auth bypassed and list_tools parity', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);

    const payloadText = typeof res.text === 'string' ? res.text : JSON.stringify({});
    const payload = parseFirstSseData(payloadText);
    const names = toolNamesFromResult(payload);
    const toolObjects = (payload.result as { tools?: unknown[] } | undefined)?.tools ?? [];
    const containsMethodField = toolObjects.some(
      (tool) => tool && typeof tool === 'object' && 'method' in (tool as Record<string, unknown>),
    );
    expect(containsMethodField).toBe(false);
    const baseToolNames = [...toolNames];
    const composedTools = ['fetch', 'search'];
    const expectedToolNames = [...baseToolNames, ...composedTools];
    expect(names.sort()).toEqual(expectedToolNames.sort());
  });

  it('rejects missing Accept header with 406', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(406);
    expect(res.body).toEqual({
      error: 'Accept header must include text/event-stream',
    });
  });

  it('rejects initialize without clientInfo', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: 'init-1',
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
        },
      });
    expect(res.status).toBe(200);
    const payload = parseFirstSseData(res.text);
    const error = payload.error as { message?: string } | undefined;
    expect(error).toBeDefined();
    expect(error?.message ?? '').toContain('clientInfo');
  });

  it('accepts initialize with clientInfo and advertises listChanged capability', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: 'init-2',
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'hardening-probe', version: '0.0.0-test' },
        },
      });
    expect(res.status).toBe(200);
    const payload = parseFirstSseData(res.text);
    const result = payload.result as
      | { capabilities?: { tools?: { listChanged?: boolean } } }
      | undefined;
    expect(result?.capabilities?.tools?.listChanged).toBe(true);
  });

  it('returns JSON-RPC error when calling an unknown tool (error path)', async () => {
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'non-existent-tool', arguments: {} },
      });
    expect(res.status).toBe(200);
    const payloadText = typeof res.text === 'string' ? res.text : JSON.stringify({});
    const payload = parseFirstSseData(payloadText) as { error?: unknown };
    // With McpServer unknown tool returns a JSON-RPC error envelope
    expect(typeof payload.error !== 'undefined').toBe(true);
  });

  it('allows no-auth in local dev when REMOTE_MCP_ALLOW_NO_AUTH=true', async () => {
    process.env.REMOTE_MCP_ALLOW_NO_AUTH = 'true';
    process.env.NODE_ENV = 'development';
    delete process.env.VERCEL;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);
  });

  it('accepts CI token only when CI=true', async () => {
    process.env.CI = 'true';
    process.env.REMOTE_MCP_CI_TOKEN = 'ci-token';
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', 'Bearer ci-token')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);
  });

  it('blocks unknown Host by DNS-rebinding protection', async () => {
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'malicious.example.com')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect([403, 401]).toContain(res.status);
  });

  it('blocks disallowed origin by CORS', async () => {
    process.env.ALLOWED_ORIGINS = 'https://allowed.example.com';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Origin', 'https://not-allowed.example.com')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    // Express CORS denies request before our handler; status can be 500 or 401 depending on flow
    expect([401, 500]).toContain(res.status);
  });

  // TODO: Add E2E test with real Clerk token
  // Requires: OAuth Device Flow to get actual token
  // See: https://clerk.com/docs/guides/development/mcp/connect-mcp-client
  // For now, E2E tests use REMOTE_MCP_ALLOW_NO_AUTH=true bypass (local dev only)
  // Old test that generated JWT with jose has been removed (Clerk generates tokens now)
});
