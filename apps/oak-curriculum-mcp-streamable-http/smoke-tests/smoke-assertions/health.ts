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
import { createAssertionLogger, logAssertionSuccess } from './logging.js';

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
    logAssertionSuccess(logger, 'GET /healthz returned expected payload');
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
    logAssertionSuccess(logger, 'HEAD /healthz returned 200 with empty body');
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
  const expectedAcceptStatus = 406;
  evaluateAcceptEnforcement(context, mcpResponse, expectedAcceptStatus, logger);
  logAssertionSuccess(logger, 'POST /mcp without streaming Accept header rejected with 406', {
    status: mcpResponse.res.status,
  });
}

function evaluateAcceptEnforcement(
  context: SmokeContext,
  response: JsonResponse,
  expectedStatus: number,
  logger: Logger,
): void {
  logger.debug('Accept enforcement response for /mcp', {
    mode: context.mode,
    status: response.res.status,
    body: response.text,
  });
  assert.equal(
    response.res.status,
    expectedStatus,
    `POST /mcp without streaming Accept header should be ${String(expectedStatus)}`,
  );
  if (expectedStatus === 406) {
    assert.match(response.text, /Accept header must include text\/event-stream/);
    return;
  }

  const header = ensureString(
    response.res.headers.get('www-authenticate') ?? '',
    '/mcp WWW-Authenticate header',
  );
  assert.match(header.toLowerCase(), /^bearer\s+/, '/mcp WWW-Authenticate must be Bearer');
}

export async function assertAuthRequired(context: SmokeContext): Promise<void> {
  const logger = createAssertionLogger(context, 'auth');
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
  logAssertionSuccess(logger, 'POST /mcp without auth returns 401 Bearer challenge');
}
