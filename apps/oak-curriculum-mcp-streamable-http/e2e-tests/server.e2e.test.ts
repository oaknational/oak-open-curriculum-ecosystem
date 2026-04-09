import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import request from 'supertest';
import { unwrap } from '@oaknational/result';
import { createApp } from '../src/application.js';
import { createHttpObservabilityOrThrow } from '../src/observability/http-observability.js';
import { loadRuntimeConfig } from '../src/runtime-config.js';
import { skipWidgetHtmlValidation } from '../src/test-helpers/widget-html-validation.js';
import { toolNames } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { TEST_UPSTREAM_METADATA } from './helpers/upstream-metadata-fixture.js';
import { parseSseEnvelope } from './helpers/sse.js';
import { createNoOpClerkMiddleware } from './helpers/test-config.js';

const ACCEPT = 'application/json, text/event-stream';

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

const ToolListItemSchema = z.looseObject({ name: z.string() });

const ToolListResultSchema = z.object({
  tools: z.array(ToolListItemSchema),
});

const InitCapabilitiesResultSchema = z.object({
  capabilities: z.object({
    tools: z.object({ listChanged: z.boolean() }),
  }),
});

const InitInstructionsResultSchema = z.object({
  instructions: z.string(),
});

const IconSchema = z.object({
  src: z.string().startsWith('data:image/svg+xml;base64,'),
  mimeType: z.literal('image/svg+xml'),
  theme: z.enum(['light', 'dark']),
});

const InitServerInfoResultSchema = z.object({
  serverInfo: z.object({
    name: z.literal('oak-curriculum-http'),
    version: z.string(),
    title: z.string().min(1),
    description: z.string().min(1),
    websiteUrl: z.url(),
    icons: z.array(IconSchema).min(2),
  }),
});

const JsonRpcErrorSchema = z.object({
  message: z.string().optional(),
});

const ResultWithErrorSchema = z.object({
  isError: z.literal(true),
});

describe('Oak Curriculum MCP Streamable HTTP - E2E', () => {
  it('returns HTTP 401 with WWW-Authenticate when missing Authorization for protected tools', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authEnforcedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
    const app = await createApp({
      runtimeConfig,
      observability,
      validateWidgetHtml: skipWidgetHtmlValidation,
      upstreamMetadata: TEST_UPSTREAM_METADATA,
      clerkMiddlewareFactory: createNoOpClerkMiddleware(),
    });
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
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
    const app = await createApp({
      runtimeConfig,
      observability,
      validateWidgetHtml: skipWidgetHtmlValidation,
    });
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({ jsonrpc: '2.0', id: '1', method: 'tools/list' });
    expect(res.status).toBe(200);

    const envelope = parseSseEnvelope(res.text);
    const toolListResult = ToolListResultSchema.parse(envelope.result);
    const names = toolListResult.tools.map((t) => t.name);
    const containsMethodField = toolListResult.tools.some((t) => 'method' in t);
    expect(containsMethodField).toBe(false);
    const baseToolNames = [...toolNames];
    const aggregatedTools = [
      'browse-curriculum',
      'download-asset',
      'explore-topic',
      'fetch',
      'get-curriculum-model',
      'get-prerequisite-graph',
      'get-thread-progressions',
      'search',
      'user-search',
      'user-search-query',
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
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
    const app = await createApp({
      runtimeConfig,
      observability,
      validateWidgetHtml: skipWidgetHtmlValidation,
    });
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
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
    const app = await createApp({
      runtimeConfig,
      observability,
      validateWidgetHtml: skipWidgetHtmlValidation,
    });
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
    const envelope = parseSseEnvelope(res.text);
    const error = JsonRpcErrorSchema.parse(envelope.error);
    expect(error.message).toBeDefined();
    expect(error.message ?? '').toContain('clientInfo');
  });

  it('accepts initialize with clientInfo and advertises listChanged capability', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
    const app = await createApp({
      runtimeConfig,
      observability,
      validateWidgetHtml: skipWidgetHtmlValidation,
    });
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
    const envelope = parseSseEnvelope(res.text);
    const initResult = InitCapabilitiesResultSchema.parse(envelope.result);
    expect(initResult.capabilities.tools.listChanged).toBe(true);
  });

  it('initialize response includes server instructions for agent guidance', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
    const app = await createApp({
      runtimeConfig,
      observability,
      validateWidgetHtml: skipWidgetHtmlValidation,
    });
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
    const envelope = parseSseEnvelope(res.text);
    const initResult = InitInstructionsResultSchema.parse(envelope.result);

    expect(initResult.instructions.length).toBeGreaterThan(0);
    expect(initResult.instructions).toMatch(/orientation|domain model/i);
  });

  it('initialize response includes Oak branding in serverInfo', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
    const app = await createApp({
      runtimeConfig,
      observability,
      validateWidgetHtml: skipWidgetHtmlValidation,
    });
    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .send({
        jsonrpc: '2.0',
        id: 'init-branding',
        method: 'initialize',
        params: {
          protocolVersion: '2025-06-18',
          capabilities: {},
          clientInfo: { name: 'branding-test', version: '1.0.0' },
        },
      });
    expect(res.status).toBe(200);
    const envelope = parseSseEnvelope(res.text);
    const initResult = InitServerInfoResultSchema.parse(envelope.result);

    expect(initResult.serverInfo.title.length).toBeGreaterThan(0);
    expect(initResult.serverInfo.websiteUrl).toContain('thenational.academy');
    const themes = initResult.serverInfo.icons.map((i) => i.theme);
    expect(themes).toContain('light');
    expect(themes).toContain('dark');
  });

  it('returns error when calling an unknown tool (error path)', async () => {
    const configResult = loadRuntimeConfig({
      processEnv: authBypassedEnv,
      startDir: process.cwd(),
    });
    const runtimeConfig = unwrap(configResult);
    const observability = createHttpObservabilityOrThrow(runtimeConfig);
    const app = await createApp({
      runtimeConfig,
      observability,
      validateWidgetHtml: skipWidgetHtmlValidation,
    });
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
    const envelope = parseSseEnvelope(res.text);
    const hasJsonRpcError = envelope.error !== undefined;
    const hasResultError = ResultWithErrorSchema.safeParse(envelope.result).success;
    expect(hasJsonRpcError || hasResultError).toBe(true);
  });

  // Auth bypass tests moved to auth-bypass.e2e.test.ts (dedicated test file)
});
