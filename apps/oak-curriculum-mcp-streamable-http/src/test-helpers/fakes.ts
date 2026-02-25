/**
 * Shared test fakes that satisfy product types without type assertions.
 * Use these instead of casting to Logger, Request, etc.
 */

import { vi } from 'vitest';
import type { Request, Response } from 'express';
import type { Logger } from '@oaknational/logger';
import type { SearchRetrievalService } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import type { RequestWithAuthContext } from '../auth/tool-auth-context.js';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { MachineAuthObject } from '@clerk/backend';
import type { McpServerFactory, McpRequestContext } from '../mcp-request-context.js';

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
 * Creates a minimal request-like object for auth context extraction tests.
 * Satisfies RequestWithAuthContext so no type assertion is needed.
 */
export function createFakeRequest(
  overrides: Partial<RequestWithAuthContext> = {},
): RequestWithAuthContext {
  return {
    headers: overrides.headers ?? {},
    auth: overrides.auth,
  };
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
 * Minimal StreamableHTTPServerTransport fake for handler tests.
 * Only handleRequest is used by createMcpHandler.
 */
export function createFakeStreamableTransport(
  handleRequestImpl?: StreamableHTTPServerTransport['handleRequest'],
): StreamableHTTPServerTransport {
  const transport = {
    handleRequest: handleRequestImpl ?? vi.fn(),
    close: vi.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- MCP SDK transport type; minimal fake for handler tests
  return transport as unknown as StreamableHTTPServerTransport;
}

/**
 * Minimal McpServer fake for handler integration tests.
 * Only connect() and close() are used by createMcpHandler.
 */
export function createFakeMcpServer(): McpServer {
  const server = {
    connect: vi.fn(() => Promise.resolve()),
    close: vi.fn(),
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- MCP SDK server type; minimal fake for handler tests
  return server as unknown as McpServer;
}

/**
 * Creates a factory that returns a pre-configured fake server + transport.
 *
 * Returns the factory and the underlying fakes so tests can inspect
 * what was called on them (e.g. transport.handleRequest args).
 */
export function createFakeMcpServerFactory(
  handleRequestImpl?: StreamableHTTPServerTransport['handleRequest'],
): { factory: McpServerFactory; server: McpServer; transport: StreamableHTTPServerTransport } {
  const server = createFakeMcpServer();
  const transport = createFakeStreamableTransport(handleRequestImpl);
  const context: McpRequestContext = { server, transport };
  const factory: McpServerFactory = () => context;
  return { factory, server, transport };
}

/**
 * Creates a MachineAuthObject fake for Clerk token verification tests.
 * For "missing field" tests we return authenticated shape with nulls; Clerk type requires string.
 */
export function createFakeMachineAuthObject(
  overrides: Partial<{
    isAuthenticated: boolean;
    userId: string | null;
    clientId: string | null;
    scopes: readonly string[] | null;
  }> = {},
): MachineAuthObject<'oauth_token'> {
  const isAuthenticated = overrides.isAuthenticated ?? true;
  const userId = overrides.userId;
  const clientId = overrides.clientId;
  const scopes = overrides.scopes;
  if (isAuthenticated) {
    const resolvedUserId = userId !== undefined ? userId : 'user';
    const resolvedClientId = clientId !== undefined ? clientId : 'client';
    const resolvedScopes = scopes !== undefined ? scopes : [];
    const out = {
      tokenType: 'oauth_token' as const,
      id: 'auth_123',
      subject: resolvedUserId,
      scopes: resolvedScopes === null ? null : Array.from(resolvedScopes),
      userId: resolvedUserId,
      clientId: resolvedClientId,
      getToken: (): Promise<string> => Promise.resolve('token'),
      has: () => true,
      debug: () => ({ userId, clientId, scopes }),
      isAuthenticated: true as const,
    };
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Authenticated shape with nulls for "missing field" tests; Clerk type does not allow null
    return out as MachineAuthObject<'oauth_token'>;
  }
  return {
    tokenType: 'oauth_token',
    id: null,
    subject: null,
    scopes: null,
    userId: null,
    clientId: null,
    getToken: (): Promise<null> => Promise.resolve(null),
    has: () => false,
    debug: () => ({}),
    isAuthenticated: false,
  };
}

/**
 * Minimal Express Request fake for getRequestContext / checkMcpClientAuth tests.
 * Express Request has many required members.
 */
export function createFakeExpressRequest(
  overrides: Partial<Pick<Request, 'headers' | 'method' | 'path' | 'body'>> = {},
): Request {
  const req = {
    headers: overrides.headers ?? {},
    method: overrides.method ?? 'POST',
    path: overrides.path ?? '/mcp',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Express Request body is broadly typed; test fake accepts minimal shape
    body: overrides.body ?? {},
  };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Express Request has many required members; minimal fake for auth tests
  return req as unknown as Request;
}
