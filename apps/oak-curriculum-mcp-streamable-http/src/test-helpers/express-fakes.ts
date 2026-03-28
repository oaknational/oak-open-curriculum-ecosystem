import type { Request, Response } from 'express';
import { vi } from 'vitest';
import type { RequestWithAuthContext } from '../auth/tool-auth-context.js';

export function createFakeRequest(
  overrides: Partial<RequestWithAuthContext> = {},
): RequestWithAuthContext {
  return {
    headers: overrides.headers ?? {},
    auth: overrides.auth,
  };
}

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

export function createFakeExpressRequest(
  overrides: Partial<Pick<Request, 'headers' | 'method' | 'path' | 'body'>> & {
    auth?: Request['auth'] | { readonly userId: string };
  } = {},
): Request {
  const req = {
    headers: overrides.headers ?? {},
    method: overrides.method ?? 'POST',
    path: overrides.path ?? '/mcp',
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- Express Request body is broadly typed; test fake accepts minimal shape
    body: overrides.body ?? {},
    ...(overrides.auth === undefined ? {} : { auth: overrides.auth }),
  };

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Express Request has many required members; minimal fake for auth tests
  return req as unknown as Request;
}
