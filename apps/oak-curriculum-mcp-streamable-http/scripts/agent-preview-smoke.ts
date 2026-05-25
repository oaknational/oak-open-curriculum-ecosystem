#!/usr/bin/env node
/**
 * Agent preview smoke — remote MCP checks aligned with how Cursor agents use
 * the server after a Vercel preview deploy.
 *
 * Layer 1 (always): health, OAuth PRM, unauthenticated /mcp 401 challenge.
 * Layer 2 (when MCP_PROBE_BEARER_TOKEN is set): initialize, tools/list,
 * tools/call get-curriculum-model (orientation tool).
 *
 * Usage:
 *   MCP_PROBE_BASE_URL=https://<preview-host> pnpm smoke:agent-preview
 *   MCP_PROBE_BASE_URL=https://<host> MCP_PROBE_BEARER_TOKEN=<token> pnpm smoke:agent-preview
 *
 * Get a Bearer token from Cursor after OAuth against the preview, or from
 * Clerk for a test user. Never commit tokens.
 */
import process from 'node:process';

import { parseSseEnvelope } from '../e2e-tests/helpers/sse.js';

const ACCEPT = 'application/json, text/event-stream';
const PROTOCOL_VERSION = '2025-03-26';
const CLIENT_NAME = 'agent-preview-smoke';
const ORIENTATION_TOOL = 'get-curriculum-model';

type LogLevel = 'INFO' | 'ERROR' | 'SUCCESS';

function emit(level: LogLevel, message: string, meta: Record<string, unknown> = {}): void {
  const entry = { timestamp: new Date().toISOString(), level, message, ...meta };
  const out = level === 'ERROR' ? process.stderr : process.stdout;
  out.write(`${JSON.stringify(entry)}\n`);
}

const log = {
  info: (message: string, meta?: Record<string, unknown>) => emit('INFO', message, meta),
  error: (message: string, meta?: Record<string, unknown>) => emit('ERROR', message, meta),
  success: (message: string, meta?: Record<string, unknown>) => emit('SUCCESS', message, meta),
};

function printUsageAndExit(): never {
  process.stdout.write(
    [
      'Usage: pnpm smoke:agent-preview [--base-url=<url>]',
      '',
      'Environment:',
      '  MCP_PROBE_BASE_URL      Deployment origin (no trailing slash)',
      '  MCP_PROBE_BEARER_TOKEN  Optional Clerk token for authenticated layer',
      '',
    ].join('\n'),
  );
  process.exit(0);
}

function requireFlagValue(argv: readonly string[], index: number, flag: string): string {
  const next = argv[index + 1];
  if (next === undefined) {
    throw new Error(`${flag} requires a value`);
  }
  return next;
}

function isToolsListResult(value: unknown): value is { tools: readonly { name: string }[] } {
  if (typeof value !== 'object' || value === null || !('tools' in value)) {
    return false;
  }
  const { tools } = value;
  if (!Array.isArray(tools)) {
    return false;
  }
  return tools.every(
    (entry) =>
      typeof entry === 'object' &&
      entry !== null &&
      'name' in entry &&
      typeof entry.name === 'string',
  );
}

function parseArgs(argv: readonly string[]): { baseUrl: string; bearerToken: string | null } {
  let baseUrl = process.env.MCP_PROBE_BASE_URL?.replace(/\/$/, '') ?? '';
  let bearerToken = process.env.MCP_PROBE_BEARER_TOKEN ?? null;

  let i = 0;
  while (i < argv.length) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') {
      printUsageAndExit();
    }
    if (arg.startsWith('--base-url=')) {
      baseUrl = arg.slice('--base-url='.length).replace(/\/$/, '');
      i += 1;
      continue;
    }
    if (arg === '--base-url') {
      baseUrl = requireFlagValue(argv, i, arg).replace(/\/$/, '');
      i += 2;
      continue;
    }
    if (arg.startsWith('--token=')) {
      bearerToken = arg.slice('--token='.length);
      i += 1;
      continue;
    }
    if (arg === '--token') {
      bearerToken = requireFlagValue(argv, i, arg);
      i += 2;
      continue;
    }
    throw new Error(`Unknown argument: ${arg}`);
  }

  if (baseUrl === '') {
    throw new Error('Missing base URL. Set MCP_PROBE_BASE_URL or pass --base-url=<url>');
  }

  return { baseUrl, bearerToken };
}

async function fetchText(
  url: string,
  init: RequestInit,
): Promise<{ status: number; headers: Headers; text: string }> {
  const response = await fetch(url, init);
  const text = await response.text();
  return { status: response.status, headers: response.headers, text };
}

function assertStatus(label: string, actual: number, expected: number): void {
  if (actual !== expected) {
    throw new Error(`${label}: expected HTTP ${String(expected)}, got ${String(actual)}`);
  }
  log.success(label, { status: actual });
}

async function postMcp(
  baseUrl: string,
  body: unknown,
  bearerToken: string | null,
): Promise<{ status: number; headers: Headers; text: string }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: ACCEPT,
  };
  if (bearerToken !== null) {
    headers.Authorization = `Bearer ${bearerToken}`;
  }
  return fetchText(`${baseUrl}/mcp`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

async function runUnauthenticatedLayer(baseUrl: string): Promise<void> {
  log.info('Layer 1 — unauthenticated baseline');

  const health = await fetchText(`${baseUrl}/healthz`, { method: 'GET' });
  assertStatus('GET /healthz', health.status, 200);

  const prm = await fetchText(`${baseUrl}/.well-known/oauth-protected-resource`, {
    method: 'GET',
  });
  assertStatus('GET /.well-known/oauth-protected-resource', prm.status, 200);
  const prmJson: unknown = JSON.parse(prm.text);
  if (typeof prmJson !== 'object' || prmJson === null) {
    throw new Error('OAuth PRM response is not a JSON object');
  }
  log.success('OAuth PRM JSON parsed');

  const unauthInit = await postMcp(
    baseUrl,
    {
      jsonrpc: '2.0',
      id: 'unauth-init',
      method: 'initialize',
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: CLIENT_NAME, version: '1.0.0' },
      },
    },
    null,
  );
  assertStatus('POST /mcp without token', unauthInit.status, 401);
  const wwwAuth = unauthInit.headers.get('www-authenticate') ?? '';
  if (!wwwAuth.includes('Bearer') || !wwwAuth.includes('resource_metadata=')) {
    throw new Error('WWW-Authenticate missing Bearer or resource_metadata');
  }
  log.success('WWW-Authenticate OAuth challenge');
}

async function runAuthenticatedLayer(baseUrl: string, bearerToken: string): Promise<void> {
  log.info('Layer 2 — authenticated agent path');

  const init = await postMcp(
    baseUrl,
    {
      jsonrpc: '2.0',
      id: 'auth-init',
      method: 'initialize',
      params: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: {},
        clientInfo: { name: CLIENT_NAME, version: '1.0.0' },
      },
    },
    bearerToken,
  );
  assertStatus('initialize', init.status, 200);
  const initEnvelope = parseSseEnvelope(init.text);
  if (initEnvelope.result === undefined) {
    throw new Error('initialize returned no result');
  }
  log.success('initialize SSE envelope');

  const list = await postMcp(
    baseUrl,
    { jsonrpc: '2.0', id: 'tools-list', method: 'tools/list' },
    bearerToken,
  );
  assertStatus('tools/list', list.status, 200);
  const listEnvelope = parseSseEnvelope(list.text);
  const listResult = listEnvelope.result;
  if (!isToolsListResult(listResult)) {
    throw new Error('tools/list missing tools array');
  }
  const { tools } = listResult;
  const names = new Set(tools.map((t) => t.name));
  if (!names.has(ORIENTATION_TOOL)) {
    throw new Error(`tools/list missing ${ORIENTATION_TOOL}`);
  }
  log.success('tools/list includes orientation tool', { toolCount: tools.length });

  const call = await postMcp(
    baseUrl,
    {
      jsonrpc: '2.0',
      id: 'orientation-call',
      method: 'tools/call',
      params: { name: ORIENTATION_TOOL, arguments: {} },
    },
    bearerToken,
  );
  assertStatus(`tools/call ${ORIENTATION_TOOL}`, call.status, 200);
  const callEnvelope = parseSseEnvelope(call.text);
  if (callEnvelope.result === undefined) {
    throw new Error(`${ORIENTATION_TOOL} returned no result`);
  }
  log.success(`tools/call ${ORIENTATION_TOOL}`);
}

async function main(): Promise<void> {
  const { baseUrl, bearerToken } = parseArgs(process.argv.slice(2));
  log.info('Agent preview smoke starting', {
    baseUrl,
    authenticatedLayer: bearerToken !== null,
  });

  await runUnauthenticatedLayer(baseUrl);

  if (bearerToken !== null) {
    await runAuthenticatedLayer(baseUrl, bearerToken);
  } else {
    log.info('Skipping Layer 2 — set MCP_PROBE_BEARER_TOKEN for full agent path');
  }

  log.success('Agent preview smoke completed');
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  log.error('Agent preview smoke failed', { error: message });
  process.exit(1);
});
