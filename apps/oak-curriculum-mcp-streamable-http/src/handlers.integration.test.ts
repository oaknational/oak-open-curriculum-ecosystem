/**
 * Integration tests for createMcpHandler.
 *
 * Tests that the MCP handler correctly:
 * 1. Passes req.auth (set by mcpAuth middleware) through to transport
 * 2. Passes body to transport.handleRequest
 * 3. Creates server+transport per request via factory
 * 4. Connects server to transport before handling
 *
 * Tool registration projection tests are in `handlers-tool-registration.integration.test.ts`.
 *
 * Uses simple fakes injected as arguments — NO network IO.
 */

import { describe, it, expect, vi } from 'vitest';
import type { Request } from 'express';
import { createMcpHandler } from './handlers.js';
import {
  createFakeResponse,
  createFakeMcpServerFactory,
  createFakeExpressRequest,
  createFakeAuthInfo,
} from './test-helpers/fakes.js';

/**
 * Create a minimal mock Express request for testing.
 * Accepts `object` to match Express Request body type without assertion.
 */
function createMockRequest(body: object): Request {
  return createFakeExpressRequest({ body });
}

describe('createMcpHandler (Integration)', () => {
  describe('request adaptation', () => {
    it('passes body to transport.handleRequest', async () => {
      const testBody = { jsonrpc: '2.0', method: 'tools/list', id: '123' };
      let receivedBody: unknown;

      const { factory } = createFakeMcpServerFactory(
        vi.fn(async (_req: unknown, _res: unknown, body: unknown) => {
          receivedBody = body;
        }),
      );

      const handler = createMcpHandler(factory);
      const mockReq = createMockRequest(testBody);
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      expect(receivedBody).toEqual(testBody);
    });

    it('passes undefined auth when req.auth is not set by middleware', async () => {
      let receivedRequest: unknown;

      const { factory } = createFakeMcpServerFactory(
        vi.fn(async (req: unknown) => {
          receivedRequest = req;
        }),
      );

      const handler = createMcpHandler(factory);
      const mockReq = createFakeExpressRequest({
        body: { method: 'tools/list' },
        headers: {},
      });
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      // Without mcpAuth middleware setting req.auth, the property is absent.
      // The MCP SDK transport reads req.auth and gets undefined.
      expect(receivedRequest).toBeDefined();
      expect(receivedRequest).not.toHaveProperty('auth');
    });

    it('passes req.auth through to transport (set by middleware)', async () => {
      let receivedRequest: unknown;

      const { factory } = createFakeMcpServerFactory(
        vi.fn(async (req: unknown) => {
          receivedRequest = req;
        }),
      );

      const handler = createMcpHandler(factory);
      const fakeAuthInfo = createFakeAuthInfo();
      const mockReq = createFakeExpressRequest({
        body: { method: 'tools/list' },
        auth: fakeAuthInfo,
      });
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      // Handler passes req.auth through to transport — no bridging from res.locals.
      expect(receivedRequest).toBeDefined();
      expect(receivedRequest).toHaveProperty('auth', fakeAuthInfo);
    });

    it('does not leak auth between concurrent requests', async () => {
      const receivedAuthInfos: unknown[] = [];

      const { factory } = createFakeMcpServerFactory(
        vi.fn(async (req: { auth?: unknown }) => {
          receivedAuthInfos.push(req.auth);
        }),
      );

      const handler = createMcpHandler(factory);

      const authInfo1 = createFakeAuthInfo({ token: 'token-1', clientId: 'client-1' });
      const authInfo2 = createFakeAuthInfo({ token: 'token-2', clientId: 'client-2' });

      const req1 = createFakeExpressRequest({ body: { method: 'tools/list' }, auth: authInfo1 });
      const req2 = createFakeExpressRequest({ body: { method: 'tools/list' }, auth: authInfo2 });
      const res1 = createFakeResponse();
      const res2 = createFakeResponse();

      await Promise.all([handler(req1, res1), handler(req2, res2)]);

      expect(receivedAuthInfos).toHaveLength(2);
      expect(receivedAuthInfos).toContainEqual(authInfo1);
      expect(receivedAuthInfos).toContainEqual(authInfo2);
    });

    it('does not read res.locals.authInfo', async () => {
      let receivedRequest: unknown;

      const { factory } = createFakeMcpServerFactory(
        vi.fn(async (req: unknown) => {
          receivedRequest = req;
        }),
      );

      const handler = createMcpHandler(factory);
      const fakeAuthInfo = createFakeAuthInfo();
      const mockReq = createFakeExpressRequest({
        body: { method: 'tools/list' },
        headers: {},
      });
      // Set res.locals.authInfo but NOT req.auth — handler must ignore res.locals
      const mockRes = createFakeResponse({ locals: { authInfo: fakeAuthInfo } });

      await handler(mockReq, mockRes);

      // Handler does not read res.locals.authInfo — auth property is absent.
      expect(receivedRequest).toBeDefined();
      expect(receivedRequest).not.toHaveProperty('auth');
    });
  });

  describe('per-request lifecycle', () => {
    it('connects server to transport before handling request', async () => {
      const { factory, server } = createFakeMcpServerFactory(vi.fn(async () => undefined));

      const handler = createMcpHandler(factory);
      const mockReq = createMockRequest({ method: 'tools/list' });
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      expect(server.connect).toHaveBeenCalledOnce();
    });
  });
});
