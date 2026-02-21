import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { unwrap } from '@oaknational/result';
import { createApp } from '../src/application.js';
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { toolNames } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { TEST_UPSTREAM_METADATA } from './helpers/upstream-metadata-fixture.js';

/* eslint max-lines-per-function: ["error", 300] */

const ACCEPT = 'application/json, text/event-stream';

// E2E tests MUST be network-free and must not depend on Clerk key validity.
// Manual OAuth validation is covered by `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http trace:oauth`.
vi.mock('@clerk/mcp-tools/server', () => ({
  generateClerkProtectedResourceMetadata: ({
    resourceUrl,
    properties,
  }: {
    resourceUrl: string;
    properties?: { scopes_supported?: string[] };
  }) => ({
    resource: resourceUrl,
    authorization_servers: ['https://example.clerk.accounts.dev'],
    scopes_supported: properties?.scopes_supported ?? [],
  }),
}));

vi.mock('@clerk/express', () => ({
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => {
    next();
  },
  getAuth: () => ({
    isAuthenticated: false,
    toAuth: () => ({}),
  }),
}));

/**
 * Isolated test environment with auth bypassed.
 * No global `process.env` mutation — see ADR-078.
 */
const authBypassedEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  DANGEROUSLY_DISABLE_AUTH: 'true',
  OAK_API_KEY: process.env.OAK_API_KEY ?? 'test',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
};

/**
 * Isolated test environment with auth enforced.
 * No `DANGEROUSLY_DISABLE_AUTH` — Clerk middleware is active.
 */
const authEnforcedEnv: NodeJS.ProcessEnv = {
  NODE_ENV: 'test',
  CLERK_PUBLISHABLE_KEY: 'pk_test_123',
  CLERK_SECRET_KEY: 'sk_test_123',
  OAK_API_KEY: process.env.OAK_API_KEY ?? 'test',
  ALLOWED_HOSTS: 'localhost,127.0.0.1,::1',
  ELASTICSEARCH_URL: 'http://fake-es:9200',
  ELASTICSEARCH_API_KEY: 'fake-api-key-for-e2e',
};

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
  it('returns HTTP 401 with WWW-Authenticate when missing Authorization for protected tools', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authEnforcedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const app = await createApp({ runtimeConfig, upstreamMetadata: TEST_UPSTREAM_METADATA });
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-key-stages', arguments: {} },
      });

    expect(res.status).toBe(401);

    // WWW-Authenticate header per RFC 6750
    const wwwAuth = res.headers['www-authenticate'];
    expect(wwwAuth).toBeDefined();
    expect(wwwAuth).toContain('Bearer');
    expect(wwwAuth).toContain('resource_metadata');
  });

  it('returns 200 with auth bypassed and list_tools parity', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const app = await createApp({ runtimeConfig });
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
    const aggregatedTools = [
      'browse-curriculum',
      'explore-topic',
      'fetch',
      'get-help',
      'get-ontology',
      'get-prerequisite-graph',
      'get-thread-progressions',
      'search',
      'search-sdk',
    ];
    const expectedToolNames = [...baseToolNames, ...aggregatedTools];
    expect(names.sort()).toEqual(expectedToolNames.sort());
  });

  it('rejects missing Accept header with 406', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const app = await createApp({ runtimeConfig });
    const res = await request(app)
      .post('/mcp')
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(406);
    expect(res.body).toEqual({
      error: 'Accept header must include text/event-stream',
    });
  });

  it('rejects initialize without clientInfo', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const app = await createApp({ runtimeConfig });
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
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const app = await createApp({ runtimeConfig });
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
    const initResult = payload.result as
      | { capabilities?: { tools?: { listChanged?: boolean } } }
      | undefined;
    expect(initResult?.capabilities?.tools?.listChanged).toBe(true);
  });

  it('initialize response includes server instructions for agent guidance', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const app = await createApp({ runtimeConfig });
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: 'init-instructions',
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'instructions-test', version: '1.0.0' },
        },
      });
    expect(res.status).toBe(200);
    const payload = parseFirstSseData(res.text);
    const initResult = payload.result as { instructions?: string } | undefined;

    // Verify instructions field exists and contains agent guidance
    expect(initResult?.instructions).toBeDefined();
    expect(initResult?.instructions).toContain('get-ontology');
    expect(initResult?.instructions).toContain('get-help');
  });

  it('returns error when calling an unknown tool (error path)', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const app = await createApp({ runtimeConfig });
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
    const payload = parseFirstSseData(payloadText) as {
      error?: { message?: string };
      result?: { isError?: boolean; content?: { text?: string }[] };
    };
    // MCP SDK returns either a JSON-RPC error or a result with isError: true
    const hasJsonRpcError = typeof payload.error !== 'undefined';
    const hasResultError = payload.result?.isError === true;
    expect(hasJsonRpcError || hasResultError).toBe(true);
  });

  // Auth bypass tests moved to auth-bypass.e2e.test.ts (dedicated test file)
});
