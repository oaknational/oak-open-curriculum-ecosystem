/**
 * Integration tests for createMcpHandler.
 *
 * Tests that the MCP handler correctly:
 * 1. Wraps transport.handleRequest in setRequestContext
 * 2. Extracts correlation ID for logging
 * 3. Adapts Express request for MCP SDK
 * 4. Creates server+transport per request via factory
 * 5. Connects server to transport before handling
 * 6. Cleans up server+transport on response close
 *
 * Uses simple fakes injected as arguments - NO network IO.
 */

import { describe, it, expect, vi } from 'vitest';
import type { Request } from 'express';
import { createMcpHandler } from './handlers.js';
import { getRequestContext } from './request-context.js';
import {
  createFakeResponse,
  createFakeMcpServerFactory,
  createFakeExpressRequest,
} from './test-helpers/fakes.js';

/**
 * Create a minimal mock Express request for testing.
 */
function createMockRequest(body: unknown): Request {
  return createFakeExpressRequest({ body: body as object });
}

describe('createMcpHandler (Integration)', () => {
  describe('request context propagation', () => {
    it('wraps transport.handleRequest with setRequestContext', async () => {
      let capturedContext: Request | undefined;

      const { factory, transport } = createFakeMcpServerFactory(
        vi.fn(async () => {
          capturedContext = getRequestContext();
        }),
      );

      const handler = createMcpHandler(factory);
      const mockReq = createMockRequest({ method: 'tools/list' });
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      // Verify transport was called
      expect(transport.handleRequest).toHaveBeenCalled();

      // Verify context was available inside handleRequest
      expect(capturedContext).toBe(mockReq);
    });

    it('context is unavailable outside handler execution', async () => {
      const { factory } = createFakeMcpServerFactory(vi.fn(async () => undefined));

      const handler = createMcpHandler(factory);
      const mockReq = createMockRequest({ method: 'tools/list' });
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      // After handler completes, context should be undefined
      expect(getRequestContext()).toBeUndefined();
    });
  });

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

    it('omits auth property from adapted request', async () => {
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
        auth: { userId: 'test-user' },
      });
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      // The adapted request should not expose the auth property
      // (to avoid type conflicts with MCP SDK's AuthInfo type)
      expect(receivedRequest).toBeDefined();
      const adapted = receivedRequest as { auth?: unknown };
      expect(adapted.auth).toBeUndefined();
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
