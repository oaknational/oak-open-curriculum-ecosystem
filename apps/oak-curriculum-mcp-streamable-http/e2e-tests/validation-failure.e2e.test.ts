import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/application.js';
import { skipWidgetHtmlValidation } from '../src/test-helpers/widget-html-validation.js';
import { hasJsonRpcOrResultError, parseSseEnvelope } from './helpers/sse.js';
import { createMockObservability, createMockRuntimeConfig } from './helpers/test-config.js';

const ACCEPT = 'application/json, text/event-stream';

async function callWithBadArgs(): Promise<{ status: number; text: string }> {
  // Disable auth – validation tests isolate Zod enforcement.
  // Auth enforcement is covered by auth-enforcement.e2e.test.ts and smoke-dev-auth.
  const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });
  const app = await createApp({
    runtimeConfig,
    observability: createMockObservability(runtimeConfig),
    validateWidgetHtml: skipWidgetHtmlValidation,
  });
  const body = {
    jsonrpc: '2.0',
    id: '1',
    method: 'tools/call',
    params: { name: 'get-key-stages-subject-lessons', arguments: { keyStage: 123, subject: true } },
  } as const;
  const res = await request(app)
    .post('/mcp')
    .set('Host', 'localhost')
    .set('Accept', ACCEPT)
    .send(body);
  return { status: res.status, text: typeof res.text === 'string' ? res.text : JSON.stringify({}) };
}

describe('HTTP /mcp validation failure', () => {
  it('returns error when arguments fail Zod validation', async () => {
    const { status, text } = await callWithBadArgs();
    expect(status).toBe(200);
    const envelope = parseSseEnvelope(text);
    expect(hasJsonRpcOrResultError(envelope)).toBe(true);
  });
});
