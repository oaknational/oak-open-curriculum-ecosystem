/**
 * Integration tests for createMcpHandler.
 *
 * Tests that the MCP handler correctly:
 * 1. Wraps transport.handleRequest in setRequestContext
 * 2. Extracts correlation ID for logging
 * 3. Adapts Express request for MCP SDK
 *
 * Uses simple fakes injected as arguments - NO network IO.
 */

import { describe, it, expect, vi } from 'vitest';
import type { Request } from 'express';
import { createMcpHandler } from './handlers.js';
import { getRequestContext } from './request-context.js';
import {
  createFakeResponse,
  createFakeStreamableTransport,
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

      const mockTransport = createFakeStreamableTransport(
        vi.fn(async () => {
          capturedContext = getRequestContext();
        }),
      );

      const handler = createMcpHandler(mockTransport);
      const mockReq = createMockRequest({ method: 'tools/list' });
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      // Verify transport was called
      expect(mockTransport.handleRequest).toHaveBeenCalled();

      // Verify context was available inside handleRequest
      expect(capturedContext).toBe(mockReq);
    });

    it('context is unavailable outside handler execution', async () => {
      const mockTransport = createFakeStreamableTransport(
        vi.fn(async (something: unknown) => {
          console.log(`something in a test: ${something}`);
        }),
      );

      const handler = createMcpHandler(mockTransport);
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

      const mockTransport = createFakeStreamableTransport(
        vi.fn(async (_req: unknown, _res: unknown, body: unknown) => {
          receivedBody = body;
        }),
      );

      const handler = createMcpHandler(mockTransport);
      const mockReq = createMockRequest(testBody);
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      expect(receivedBody).toEqual(testBody);
    });

    it('omits auth property from adapted request', async () => {
      let receivedRequest: unknown;

      const mockTransport = createFakeStreamableTransport(
        vi.fn(async (req: unknown) => {
          receivedRequest = req;
        }),
      );

      const handler = createMcpHandler(mockTransport);
      const mockReq = createFakeExpressRequest({
        body: { method: 'tools/list' },
        headers: {},
      });
      Object.assign(mockReq, { auth: { userId: 'test-user' } });
      const mockRes = createFakeResponse();

      await handler(mockReq, mockRes);

      // The adapted request should not expose the auth property
      // (to avoid type conflicts with MCP SDK's AuthInfo type)
      expect(receivedRequest).toBeDefined();
      const adapted = receivedRequest as { auth?: unknown };
      expect(adapted.auth).toBeUndefined();
    });
  });
});
