/**
 * Shared test fakes that satisfy product types without type assertions.
 * Use these instead of casting to Logger, Request, etc.
 *
 * MCP server/transport fakes: {@link ./fakes-mcp-server.ts}
 * Clerk auth fakes: {@link ./fakes-clerk.ts}
 */

import { vi } from 'vitest';
import type { Request, Response } from 'express';
import type { Logger } from '@oaknational/logger';
import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';

/** Re-export MCP server/transport fakes for consumers importing from this module. */
export {
  createFakeStreamableTransport,
  createFakeMcpServer,
  createFakeMcpServerFactory,
} from './fakes-mcp-server.js';

/** Re-export Clerk auth fakes for consumers importing from this module. */
export { createFakeMachineAuthObject } from './fakes-clerk.js';

/**
 * Creates a properly typed fake SearchRetrievalService for tests.
 *
 * Uses `vi.fn()` for assertion support (e.g. `toHaveBeenCalledWith`).
 * For production stub mode, use `createStubSearchRetrieval` from the SDK instead.
 */
export function createFakeSearchRetrieval(): SearchRetrievalService {
  return {
    searchLessons: vi.fn<SearchRetrievalService['searchLessons']>(),
    searchUnits: vi.fn<SearchRetrievalService['searchUnits']>(),
    searchSequences: vi.fn<SearchRetrievalService['searchSequences']>(),
    searchThreads: vi.fn<SearchRetrievalService['searchThreads']>(),
    suggest: vi.fn<SearchRetrievalService['suggest']>(),
    fetchSequenceFacets: vi.fn<SearchRetrievalService['fetchSequenceFacets']>(),
  };
}

/**
 * Creates a full Logger fake (all required methods + child returning self).
 * Use in tests wherever a Logger is required.
 */
export function createFakeLogger(): Logger {
  const logger: Logger = {
    trace: vi.fn(),
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    fatal: vi.fn(),
    child: () => logger,
  };
  return logger;
}

/**
 * Minimal Express Response fake for handler tests.
 * Express Response has 80+ required members; we implement the subset used by
 * createMcpHandler and extractCorrelationId.
 */
export function createFakeResponse(
  overrides: Partial<Pick<Response, 'statusCode' | 'locals'>> = {},
): Response {
  const res = {
    statusCode: overrides.statusCode ?? 200,
    locals: overrides.locals ?? {},
    getHeader: vi.fn(),
    setHeader: vi.fn(),
    getHeaders: vi.fn(() => ({})),
    status: vi.fn(function (this: typeof res) {
      return this;
    }),
    send: vi.fn(function (this: typeof res) {
      return this;
    }),
    json: vi.fn(function (this: typeof res) {
      return this;
    }),
    end: vi.fn(function (this: typeof res) {
      return this;
    }),
    write: vi.fn(),
    writeHead: vi.fn(),
    set: vi.fn(function (this: typeof res) {
      return this;
    }),
    get: vi.fn(),
    on: vi.fn(function (this: typeof res) {
      return this;
    }),
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Express Response has 80+ required members; minimal fake for handler tests
  return res as unknown as Response;
}

/**
 * Creates an AuthInfo fake for MCP SDK auth context tests.
 * AuthInfo represents the typed auth context extracted at the ingress edge
 * and passed forward to tool handlers as an explicit parameter.
 *
 * Note: uses spread (not per-field `??`) because AuthInfo has 6 fields and
 * per-field merging exceeds the complexity lint limit. The spread-widening
 * risk (a caller passing `{ token: undefined }`) is negligible in test code
 * since all callers pass real override values.
 */
export function createFakeAuthInfo(overrides?: Partial<AuthInfo>): AuthInfo {
  const defaults: AuthInfo = {
    token: 'fake-bearer-token',
    clientId: 'client_123',
    scopes: ['mcp:invoke'],
    extra: { userId: 'user_123' },
  };
  if (!overrides) {
    return defaults;
  }
  return { ...defaults, ...overrides };
}

/**
 * Minimal Express Request fake for handler and auth integration tests.
 * Express Request has many required members.
 *
 * Supports optional `auth` field for tests where `mcpAuth` middleware
 * has set `req.auth` before the handler runs.
 */
export function createFakeExpressRequest(
  overrides: Partial<Pick<Request, 'headers' | 'method' | 'path' | 'body'>> & {
    readonly auth?: AuthInfo;
  } = {},
): Request {
  const headers = overrides.headers ?? {};
  const req = {
    headers,
    method: overrides.method ?? 'POST',
    path: overrides.path ?? '/mcp',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Express Request body is broadly typed; test fake accepts minimal shape
    body: overrides.body ?? {},
    ...(overrides.auth !== undefined ? { auth: overrides.auth } : {}),
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Express Request has many required members; minimal fake for auth tests
  return req as unknown as Request;
}

/**
 * Express Request fake for auth middleware integration tests.
 *
 * Extends `createFakeExpressRequest` with `protocol` and `get(header)`
 * — the additional members required by `getPRMUrl` and `getMcpResourceUrl`
 * which the `mcpAuth` middleware calls internally.
 */
export function createFakeAuthMiddlewareRequest(
  overrides: { token?: string; host?: string; protocol?: string } = {},
): Request {
  const host = overrides.host ?? 'localhost';
  const headers: Record<string, string> = { host };
  if (overrides.token !== undefined) {
    headers['authorization'] = `Bearer ${overrides.token}`;
  }
  const req = {
    headers,
    method: 'POST',
    path: '/mcp',
    protocol: overrides.protocol ?? 'http',
    get(header: string): string | undefined {
      return headers[header.toLowerCase()];
    },
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Express Request has many required members; minimal fake for auth middleware tests
  return req as unknown as Request;
}
