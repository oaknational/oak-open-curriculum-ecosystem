/**
 * E2E proof: the app serves zero MCP prompts (ratified plan
 * mcp-101-visible-surface-allowlist AC1; decisions register D11).
 *
 * The prompt primitive is unregistered entirely, so at the protocol level:
 * - the `initialize` result's capabilities object has NO `prompts` key
 *   (key-absence, not emptiness — `prompts: {}` would still advertise the
 *   capability under the spec's capability-negotiation rules), and
 * - `prompts/list` is answered with JSON-RPC -32601 Method not found
 *   (the SDK's fallback for a capability the server never registered).
 *
 * A client calling `prompts/list` without the negotiated capability is the
 * nonconformant party; -32601 is the correct server behaviour (MCP
 * 2025-11-25 lifecycle §Capability Negotiation).
 */

import { request } from '../src/test-helpers/loopback-request.js';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createStubbedHttpApp, STUB_ACCEPT_HEADER } from './helpers/create-stubbed-http-app.js';
import { parseSseEnvelope } from './helpers/sse.js';

const InitializeResultSchema = z.object({
  capabilities: z.record(z.string(), z.unknown()),
});

const JsonRpcErrorSchema = z.object({
  code: z.number(),
  message: z.string(),
});

describe('Zero prompts (E2E)', () => {
  it('does not advertise the prompts capability in the initialize result', async () => {
    const { app } = await createStubbedHttpApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({
        jsonrpc: '2.0',
        id: '1',
        method: 'initialize',
        params: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          clientInfo: { name: 'zero-prompts-e2e', version: '0.0.0' },
        },
      });
    expect(res.status).toBe(200);

    const envelope = parseSseEnvelope(res.text);
    const result = InitializeResultSchema.parse(envelope.result);
    expect(Object.keys(result.capabilities)).not.toContain('prompts');
    // The surface it DOES serve is still advertised.
    expect(Object.keys(result.capabilities)).toContain('tools');
    expect(Object.keys(result.capabilities)).toContain('resources');
  });

  it('answers prompts/list with JSON-RPC -32601 Method not found', async () => {
    const { app } = await createStubbedHttpApp();
    const res = await request(app)
      .post('/mcp')
      .set('Accept', STUB_ACCEPT_HEADER)
      .send({ jsonrpc: '2.0', id: '2', method: 'prompts/list' });

    const envelope = parseSseEnvelope(res.text);
    const error = JsonRpcErrorSchema.parse(envelope.error);
    expect(error.code).toBe(-32601);
  });
});
