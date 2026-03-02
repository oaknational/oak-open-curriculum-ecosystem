/**
 * Minimal typed fakes for logger tests.
 *
 * Express Request/Response have many required members; tests only need
 * the subset consumed by our middleware. Each factory centralises one
 * unavoidable `as` cast so test files stay assertion-free.
 */

import { vi } from 'vitest';
import type { Request, Response, NextFunction } from 'express';

/** Minimal Request shape used by extractRequestMetadata and request/error logger middleware */
export interface MinimalRequestShape {
  method: string;
  url?: string;
  path?: string;
  headers?: Request['headers'];
  query?: Request['query'];
  params?: Request['params'];
  ip?: string;
  body?: unknown;
}

const DEFAULT_FAKE_REQUEST: MinimalRequestShape = {
  method: 'GET',
  url: '/',
  path: '/',
  headers: {},
  query: {},
  params: {},
};

/**
 * Creates a minimal fake Express Request for middleware tests.
 * Express Request has many required members; we only need the subset read by our middleware.
 */
export function createFakeRequest(partial?: Partial<MinimalRequestShape>): Request {
  const minimal = { ...DEFAULT_FAKE_REQUEST, ...partial };
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Minimal fake for Express Request; full type has many members our middleware does not use.
  return minimal as Request;
}

/**
 * Creates a minimal fake Express Response for middleware tests.
 * The logger middleware only passes Response through; it never reads or writes to it.
 */
export function createFakeResponse(): Response {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- Express Response has 80+ required members; logger middleware does not interact with it
  return {} as Response;
}

/**
 * Creates a typed NextFunction spy.
 * `vi.fn()` satisfies `(err?: unknown) => void` but TypeScript cannot
 * narrow Mock to NextFunction without a cast. Centralised here.
 */
export function createFakeNextFunction(): NextFunction {
  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions -- vi.fn() is structurally NextFunction but Mock type is wider
  return vi.fn() as NextFunction;
}
