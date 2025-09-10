import { describe, it, expect } from 'vitest';
import { generateKeyPair, SignJWT, exportJWK } from 'jose';
import request from 'supertest';
import { createApp } from '../src/index.js';
import { MCP_TOOLS } from '@oaknational/oak-curriculum-sdk';

const DEV_TOKEN = process.env.REMOTE_MCP_DEV_TOKEN ?? 'test-dev-token';
const ACCEPT = 'application/json, text/event-stream';

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
  if (!line) throw new Error('No data line found in SSE payload');
  const json = line.replace(/^data: /, '');
  const parsed: unknown = JSON.parse(json);
  if (parsed && typeof parsed === 'object') {
    return parsed as JsonRpcEnvelope;
  }
  throw new Error('Invalid SSE JSON');
}

function toolNamesFromResult(value: unknown): string[] {
  const tools = (value as { result?: { tools?: unknown[] } }).result?.tools;
  if (!Array.isArray(tools)) return [];
  return tools
    .map((t) => (t && typeof t === 'object' ? (t as { name?: unknown }).name : undefined))
    .filter((n): n is string => typeof n === 'string');
}

describe('Oak Curriculum MCP Streamable HTTP - E2E', () => {
  it('returns 401 when missing Authorization', async () => {
    // ensure no leaked no-auth setting from other tests
    delete process.env.REMOTE_MCP_ALLOW_NO_AUTH;
    delete process.env.BASE_URL;
    delete process.env.MCP_CANONICAL_URI;
    // ensure host filtering doesn't mask auth behaviour
    process.env.ALLOWED_HOSTS = 'localhost,127.0.0.1,::1';
    delete process.env.ALLOWED_ORIGINS;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Host', 'localhost')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(401);
    // Assert RFC-compliant WWW-Authenticate with resource metadata hint per plan
    const header = res.headers['www-authenticate'] as string | undefined;
    expect(header).toBeDefined();
    // It should be a Bearer challenge with error and discovery hints
    expect(header?.toLowerCase()).toMatch(/^bearer\s+/);
    expect(header).toContain('error="invalid_request"');
    expect(header).toContain('authorization_uri="/.well-known/oauth-protected-resource"');
    expect(header).toContain('resource="http://localhost/mcp"');
  });

  it('returns 200 with dev bearer token and list_tools parity', async () => {
    process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);

    const payloadText = typeof res.text === 'string' ? res.text : JSON.stringify({});
    const payload = parseFirstSseData(payloadText);
    const names = toolNamesFromResult(payload);

    const sdkToolNames = Object.keys(MCP_TOOLS).sort();
    expect(names.sort()).toEqual(sdkToolNames);
  });

  it('returns JSON-RPC error when calling an unknown tool (error path)', async () => {
    process.env.REMOTE_MCP_DEV_TOKEN = DEV_TOKEN;
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'non-existent-tool', arguments: {} },
      });
    expect(res.status).toBe(200);
    const payloadText = typeof res.text === 'string' ? res.text : JSON.stringify({});
    const payload = parseFirstSseData(payloadText);
    // We expect a formatted error result wrapper from the handler
    const isError = (payload as { result?: { isError?: boolean } }).result?.isError === true;
    expect(isError).toBe(true);
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
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';
    process.env.ALLOWED_ORIGINS = 'https://allowed.example.com';
    const app = createApp();
    const res = await request(app)
      .post('/mcp')
      .set('Origin', 'https://not-allowed.example.com')
      .set('Authorization', `Bearer ${DEV_TOKEN}`)
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    // Express CORS denies request before our handler; status can be 500 or 401 depending on flow
    expect([401, 500]).toContain(res.status);
  });

  it('accepts JWT access token when local AS is enabled', async () => {
    process.env.ENABLE_LOCAL_AS = 'true';
    process.env.BASE_URL = 'http://localhost:3333';
    process.env.MCP_CANONICAL_URI = 'http://localhost:3333/mcp';
    process.env.OAK_API_KEY = process.env.OAK_API_KEY ?? 'test';

    // Generate ephemeral key pair and install public JWK for the RS
    const { publicKey, privateKey } = await generateKeyPair('RS256');
    const publicJwk = await exportJWK(publicKey);
    (publicJwk as { alg?: string; use?: string }).alg = 'RS256';
    (publicJwk as { alg?: string; use?: string }).use = 'sig';
    process.env.LOCAL_AS_JWK = JSON.stringify(publicJwk);

    // Start app after env is prepared
    const app = createApp();

    // Mint a valid access token
    const now = Math.floor(Date.now() / 1000);
    const issuerEnv = process.env.BASE_URL;
    const audienceEnv = process.env.MCP_CANONICAL_URI;
    if (!issuerEnv || !audienceEnv) {
      throw new Error('Missing BASE_URL or MCP_CANONICAL_URI for test');
    }
    const issuer = issuerEnv;
    const audience = audienceEnv;
    const token = await new SignJWT({
      sub: 'user-123',
      email: 'user@thenational.academy',
      org: 'thenational.academy',
      scope: 'mcp:invoke mcp:read',
    })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt(now)
      .setExpirationTime(now + 5 * 60)
      .sign(privateKey);

    const res = await request(app)
      .post('/mcp')
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);
  });
});
