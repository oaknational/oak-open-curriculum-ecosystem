import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/application.js';
import { skipWidgetHtmlValidation } from '../src/test-helpers/widget-html-validation.js';
import { hasJsonRpcOrResultError, parseSseEnvelope } from './helpers/sse.js';
import { createMockObservability, createMockRuntimeConfig } from './helpers/test-config.js';

const ACCEPT = 'application/json, text/event-stream';

function makeInvalidEnumBody() {
  return {
    jsonrpc: '2.0',
    id: '1',
    method: 'tools/call',
    params: {
      name: 'get-key-stages-subject-lessons',
      arguments: { keyStage: 'invalid-stage', subject: 'english' },
    },
  } as const;
}

async function post(body: Record<string, unknown>) {
  // Disable auth – this suite exercises validation errors only.
  // Auth enforcement is covered by auth-enforcement.e2e.test.ts and smoke-dev-auth.
  const runtimeConfig = createMockRuntimeConfig({ dangerouslyDisableAuth: true });
  const app = await createApp({
    runtimeConfig,
    observability: createMockObservability(runtimeConfig),
    validateWidgetHtml: skipWidgetHtmlValidation,
  });
  return request(app).post('/mcp').set('Host', 'localhost').set('Accept', ACCEPT).send(body);
}

describe('HTTP /mcp enum validation failure', () => {
  it('returns error when enum value is invalid', async () => {
    const res = await post(makeInvalidEnumBody());
    expect(res.status).toBe(200);
    const envelope = parseSseEnvelope(typeof res.text === 'string' ? res.text : JSON.stringify({}));
    expect(hasJsonRpcOrResultError(envelope)).toBe(true);
  });
});
