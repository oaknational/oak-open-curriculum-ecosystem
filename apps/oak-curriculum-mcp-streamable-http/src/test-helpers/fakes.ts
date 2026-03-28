/**
 * Shared test fakes for the MCP streamable HTTP app.
 *
 * Handler tests use narrow interfaces (`McpHandlerRequest`, `McpHandlerResponse`)
 * that plain objects satisfy structurally — no type assertions.
 *
 * Express middleware tests use `node-mocks-http` which creates properly typed
 * Express Request/Response objects — no type assertions. This follows the
 * "off-the-shelf libraries, not custom plumbing" principle.
 *
 * MCP server/transport fakes: {@link ./fakes-mcp-server.ts}
 * Clerk auth fakes: {@link ./fakes-clerk.ts}
 */

import { vi } from 'vitest';
import httpMocks from 'node-mocks-http';
import type { Request, Response } from 'express';
import type { Logger } from '@oaknational/logger';
import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { AuthInfo } from '@modelcontextprotocol/sdk/server/auth/types.js';
import type { McpHandlerRequest, McpHandlerResponse } from '../handlers.js';

/** Re-export MCP server/transport fakes. */
export {
  createFakeStreamableTransport,
  createFakeMcpServer,
  createFakeMcpServerFactory,
} from './fakes-mcp-server.js';

/** Re-export Clerk auth fakes. */
export { createFakeMachineAuthObject } from './fakes-clerk.js';

/**
 * Creates a properly typed fake SearchRetrievalService for tests.
 * Uses `vi.fn()` for assertion support.
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
 * Creates a narrow `McpHandlerResponse` for handler integration tests.
 * Plain object — satisfies the narrow interface structurally.
 */
export function createFakeResponse(
  overrides: Partial<{
    statusCode: number;
    locals: { correlationId?: string; [key: string]: unknown };
  }> = {},
): McpHandlerResponse {
  const statusCode = overrides.statusCode ?? 200;
  const locals = overrides.locals ?? {};
  return {
    statusCode,
    locals,
    on: vi.fn(),
  };
}

/**
 * Creates an AuthInfo fake for MCP SDK auth context tests.
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
 * Creates a narrow `McpHandlerRequest` for handler integration tests.
 * Plain object — satisfies the narrow interface structurally.
 */
export function createFakeExpressRequest(
  overrides: Partial<{
    headers: Record<string, string>;
    method: string;
    path: string;
    body: { method?: string; params?: { name?: string; uri?: string }; [key: string]: unknown };
  }> & { readonly auth?: AuthInfo } = {},
): McpHandlerRequest {
  return {
    headers: overrides.headers ?? {},
    method: overrides.method ?? 'POST',
    path: overrides.path ?? '/mcp',
    body: overrides.body ?? {},
    ...(overrides.auth !== undefined ? { auth: overrides.auth } : {}),
  };
}

/**
 * Creates a properly typed Express Request via `node-mocks-http`.
 *
 * Use for Express middleware tests (mcpAuth, mcpRouter, conditionalClerkMiddleware)
 * where the middleware signature requires the full Express `Request` type.
 * No type assertions — `node-mocks-http` returns real Express-typed objects.
 */
export function createMockExpressRequest(
  overrides: {
    token?: string;
    host?: string;
    protocol?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    path?: string;
    body?: { method?: string; params?: { name?: string; uri?: string }; [key: string]: unknown };
  } = {},
): Request {
  const headers: Record<string, string> = {};
  if (overrides.host !== undefined) {
    headers['host'] = overrides.host;
  }
  if (overrides.token !== undefined) {
    headers['authorization'] = `Bearer ${overrides.token}`;
  }
  return httpMocks.createRequest({
    method: overrides.method ?? 'POST',
    url: overrides.path ?? '/mcp',
    headers,
    body: overrides.body ?? {},
    protocol: overrides.protocol ?? 'http',
  });
}

/**
 * Creates a properly typed Express Response via `node-mocks-http`.
 *
 * Use for Express middleware tests. No type assertions.
 */
export function createMockExpressResponse(): Response {
  return httpMocks.createResponse();
}
