import assert from 'node:assert/strict';

import {
  ensureBoolean,
  ensureRecord,
  ensureString,
  fetchJson,
  parseFirstSsePayload,
} from './common.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';

export async function assertHealthEndpoints(context: SmokeContext): Promise<void> {
  const getResponse = await fetchJson(new URL('/healthz', context.baseUrl), { method: 'GET' });
  assert.equal(getResponse.res.status, 200, 'GET /healthz should return 200');
  const payload = ensureRecord(JSON.parse(getResponse.text), 'health payload');
  assert.equal(ensureString(payload.status, 'health status'), 'ok');
  assert.equal(ensureString(payload.mode, 'health mode'), 'streamable-http');
  assert.equal(ensureString(payload.auth, 'health auth descriptor'), 'required-for-post');

  const headResponse = await fetchJson(new URL('/healthz', context.baseUrl), { method: 'HEAD' });
  assert.equal(headResponse.res.status, 200, 'HEAD /healthz should return 200');
  assert.equal(headResponse.text, '', 'HEAD /healthz should not return a body');
}

export async function assertAcceptHeaderEnforcement(context: SmokeContext): Promise<void> {
  const headers = {
    Authorization: `Bearer ${context.devToken}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const mcpResponse = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: 'accept-1', method: 'tools/list' }),
  });
  assert.equal(
    mcpResponse.res.status,
    406,
    'POST /mcp without streaming Accept header should be 406',
  );
  assert.match(mcpResponse.text, /Accept header must include text\/event-stream/);

  const aliasResponse = await fetchJson(new URL('/openai_connector', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: 'accept-2', method: 'tools/list' }),
  });
  assert.equal(
    aliasResponse.res.status,
    406,
    'POST /openai_connector without streaming Accept header should be 406',
  );
  assert.match(aliasResponse.text, /Accept header must include text\/event-stream/);
}

export async function assertAuthRequired(context: SmokeContext): Promise<void> {
  const headers = {
    'Content-Type': 'application/json',
    Accept: REQUIRED_ACCEPT,
  };
  const body = JSON.stringify({ jsonrpc: '2.0', id: 'auth-check', method: 'tools/list' });

  const mcpResponse = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body,
  });
  assert.equal(mcpResponse.res.status, 401, 'POST /mcp without auth should be 401');
  const mcpAuthenticate = ensureString(
    mcpResponse.res.headers.get('www-authenticate') ?? '',
    'mcp WWW-Authenticate header',
  );
  assert.match(mcpAuthenticate.toLowerCase(), /^bearer\s+/, 'WWW-Authenticate must be Bearer');

  const aliasResponse = await fetchJson(new URL('/openai_connector', context.baseUrl), {
    method: 'POST',
    headers,
    body,
  });
  assert.equal(aliasResponse.res.status, 401, 'POST /openai_connector without auth should be 401');
  const aliasAuthenticate = ensureString(
    aliasResponse.res.headers.get('www-authenticate') ?? '',
    'alias WWW-Authenticate header',
  );
  assert.match(aliasAuthenticate.toLowerCase(), /^bearer\s+/, 'WWW-Authenticate must be Bearer');
}

export async function assertInitialiseHandshake(context: SmokeContext): Promise<void> {
  const headers = {
    Authorization: `Bearer ${context.devToken}`,
    'Content-Type': 'application/json',
    Accept: REQUIRED_ACCEPT,
  };

  await assertInitialiseWithoutClientInfo(context, headers);
  await assertInitialiseWithClientInfo(context, headers);
}

async function assertInitialiseWithoutClientInfo(
  context: SmokeContext,
  headers: Record<string, string>,
): Promise<void> {
  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'init-no-client',
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
      },
    }),
  });
  assert.equal(response.res.status, 200, 'Initialise without clientInfo should return 200');
  const envelope = parseFirstSsePayload(response.text);
  const initialiseError = ensureRecord(envelope.error, 'initialise error');
  const initialiseMessage = ensureString(initialiseError.message, 'initialise error message');
  assert.notEqual(initialiseMessage.length, 0, 'Initialise error message should be present');
  assert.match(
    initialiseMessage.toLowerCase(),
    /clientinfo/,
    'Initialise error should mention clientInfo',
  );
}

async function assertInitialiseWithClientInfo(
  context: SmokeContext,
  headers: Record<string, string>,
): Promise<void> {
  const response = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 'init-with-client',
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {},
        clientInfo: { name: 'smoke-dev', version: '0.0.0-local' },
      },
    }),
  });
  assert.equal(response.res.status, 200, 'Initialise with clientInfo should return 200');
  const envelope = parseFirstSsePayload(response.text);
  const result = ensureRecord(envelope.result, 'initialise result');
  const capabilities = ensureRecord(result.capabilities, 'initialise capabilities');
  const tools = ensureRecord(capabilities.tools, 'initialise tool capabilities');
  assert.equal(
    ensureBoolean(tools.listChanged, 'initialise tools.listChanged'),
    true,
    'Initialise should advertise listChanged capability',
  );
}
