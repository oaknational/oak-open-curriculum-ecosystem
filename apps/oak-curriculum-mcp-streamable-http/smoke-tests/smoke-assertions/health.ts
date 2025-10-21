import assert from 'node:assert/strict';
import type { Logger } from '@oaknational/mcp-logger';

import {
  ensureRecord,
  ensureString,
  fetchJson,
  createAuthHeaders,
  type JsonResponse,
} from './common.js';
import { REQUIRED_ACCEPT, type SmokeContext } from './types.js';
import { createAssertionLogger } from './logging.js';

export async function assertHealthEndpoints(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'health');
  const getResponse = await fetchJson(new URL('/healthz', context.baseUrl), { method: 'GET' });
  logger.debug('GET /healthz response', {
    status: getResponse.res.status,
    body: getResponse.text,
  });
  if (getResponse.res.status !== 200) {
    if (context.mode === 'remote') {
      logger.warn('Remote GET /healthz returned non-200 status', {
        status: getResponse.res.status,
        body: getResponse.text,
      });
    } else {
      assert.equal(getResponse.res.status, 200, 'GET /healthz should return 200');
    }
  } else {
    const payload = ensureRecord(JSON.parse(getResponse.text), 'health payload');
    assert.equal(ensureString(payload.status, 'health status'), 'ok');
    assert.equal(ensureString(payload.mode, 'health mode'), 'streamable-http');
    assert.equal(ensureString(payload.auth, 'health auth descriptor'), 'required-for-post');
  }

  const headResponse = await fetchJson(new URL('/healthz', context.baseUrl), { method: 'HEAD' });
  logger.debug('HEAD /healthz response', {
    status: headResponse.res.status,
    body: headResponse.text,
  });
  if (headResponse.res.status !== 200) {
    if (context.mode === 'remote') {
      logger.warn('Remote HEAD /healthz returned non-200 status', {
        status: headResponse.res.status,
        body: headResponse.text,
      });
    } else {
      assert.equal(headResponse.res.status, 200, 'HEAD /healthz should return 200');
    }
  } else {
    assert.equal(headResponse.text, '', 'HEAD /healthz should not return a body');
  }
}

export async function assertAcceptHeaderEnforcement(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'accept');
  const headers = {
    ...createAuthHeaders(context),
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const mcpResponse = await fetchJson(new URL('/mcp', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: 'accept-1', method: 'tools/list' }),
  });
  const expectedAcceptStatus = context.mode === 'remote' ? 401 : 406;
  evaluateAcceptEnforcement(context, mcpResponse, expectedAcceptStatus, '/mcp', logger);

  const aliasResponse = await fetchJson(new URL('/openai_connector', context.baseUrl), {
    method: 'POST',
    headers,
    body: JSON.stringify({ jsonrpc: '2.0', id: 'accept-2', method: 'tools/list' }),
  });
  evaluateAcceptEnforcement(
    context,
    aliasResponse,
    expectedAcceptStatus,
    '/openai_connector',
    logger,
  );
}

function evaluateAcceptEnforcement(
  context: SmokeContext,
  response: JsonResponse,
  expectedStatus: number,
  path: '/mcp' | '/openai_connector',
  logger: Logger,
): void {
  logger.debug(`Accept enforcement response for ${path}`, {
    context,
    status: response.res.status,
    body: response.text,
  });
  assert.equal(
    response.res.status,
    expectedStatus,
    `POST ${path} without streaming Accept header should be ${String(expectedStatus)}`,
  );
  if (expectedStatus === 406) {
    assert.match(response.text, /Accept header must include text\/event-stream/);
    return;
  }

  const header = ensureString(
    response.res.headers.get('www-authenticate') ?? '',
    `${path} WWW-Authenticate header`,
  );
  assert.match(header.toLowerCase(), /^bearer\s+/, `${path} WWW-Authenticate must be Bearer`);
}

export async function assertAuthRequired(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'auth');
  if (context.mode === 'remote') {
    logger.info('Remote target may enforce authentication upstream; skipping unauthorised checks');
    return;
  }

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
  logger.debug('Unauthorised response for /mcp', {
    status: mcpResponse.res.status,
    body: mcpResponse.text,
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
  logger.debug('Unauthorised response for /openai_connector', {
    status: aliasResponse.res.status,
    body: aliasResponse.text,
  });
  assert.equal(aliasResponse.res.status, 401, 'POST /openai_connector without auth should be 401');
  const aliasAuthenticate = ensureString(
    aliasResponse.res.headers.get('www-authenticate') ?? '',
    'alias WWW-Authenticate header',
  );
  assert.match(aliasAuthenticate.toLowerCase(), /^bearer\s+/, 'WWW-Authenticate must be Bearer');
}
