import request from 'supertest';
import { describe, it, expect, vi } from 'vitest';
import { createApp } from '../src/application.js';
import type { ToolHandlerOverrides } from '../src/handlers.js';
import type { ToolExecutionResult } from '@oaknational/oak-curriculum-sdk/public/mcp-tools.js';
import { parseSseEnvelope, parseJsonRpcResult, parseToolSuccessPayload } from './helpers/sse.js';
import { createMockRuntimeConfig } from './helpers/test-config.js';

const ACCEPT = 'application/json, text/event-stream';

// Mock Clerk middleware to avoid network IO and requirement for valid keys
vi.mock('@clerk/express', () => ({
  clerkMiddleware: () => (_req: unknown, _res: unknown, next: () => void) => {
    next();
  },
  requireAuth: () => (_req: unknown, _res: unknown, next: () => void) => {
    next();
  },
  getAuth: () => ({
    isAuthenticated: false,
    toAuth: () => ({}),
  }),
}));

function assertSuccessfulEnvelope(body: string): void {
  const envelope = parseSseEnvelope(body);
  expect(envelope.error).toBeUndefined();
  const result = parseJsonRpcResult(envelope);
  expect(result.isError).not.toBe(true);
  const payload = parseToolSuccessPayload(result);
  expect(payload.status).toBe(200);
  if (!Array.isArray(payload.data)) {
    throw new Error('Tool payload must be an array');
  }
  expect(payload.data.length).toBeGreaterThan(0);
}

describe('Tool response envelope formatting', () => {
  it('wraps successful tool executions in SSE JSON', async () => {
    const overrides: ToolHandlerOverrides = {
      executeMcpTool: (name, args, client) => {
        void name;
        void args;
        void client;
        const data = [
          {
            slug: 'ks1',
            title: 'Key Stage 1',
            canonicalUrl: 'https://www.thenational.academy/teachers/key-stages/ks1',
          },
          {
            slug: 'ks2',
            title: 'Key Stage 2',
            canonicalUrl: 'https://www.thenational.academy/teachers/key-stages/ks2',
          },
        ];
        const result: ToolExecutionResult = { status: 200, data };
        return Promise.resolve(result);
      },
    };

    const app = createApp({
      toolHandlerOverrides: overrides,
      runtimeConfig: createMockRuntimeConfig({ dangerouslyDisableAuth: true }),
    });

    const res = await request(app)
      .post('/mcp')
      .set('Accept', ACCEPT)
      .set('Host', 'localhost')
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'tools/call',
        params: { name: 'get-key-stages', arguments: { params: {} } },
      });

    expect(res.status).toBe(200);
    assertSuccessfulEnvelope(res.text);
  });
});
