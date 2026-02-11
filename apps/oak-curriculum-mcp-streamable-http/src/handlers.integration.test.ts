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
import type { Request, Response } from 'express';
import type { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createMcpHandler } from './handlers.js';
import { getRequestContext } from './request-context.js';

/**
 * Create a minimal mock Express request for testing.
 */
function createMockRequest(body: unknown): Request {
  return {
    body,
    method: 'POST',
    path: '/mcp',
  } as Request;
}

/**
 * Create a minimal mock Express response for testing.
 */
function createMockResponse(): Response {
  return {
    statusCode: 200,
    locals: {},
    getHeader: vi.fn(),
    setHeader: vi.fn(),
  } as unknown as Response;
}

describe('createMcpHandler (Integration)', () => {
  describe('request context propagation', () => {
    it('wraps transport.handleRequest with setRequestContext', async () => {
      let capturedContext: Request | undefined;

      // Mock transport that captures the context when handleRequest is called
      const mockTransport = {
        handleRequest: vi.fn(async () => {
          capturedContext = getRequestContext();
        }),
      } as unknown as StreamableHTTPServerTransport;

      const handler = createMcpHandler(mockTransport);
      const mockReq = createMockRequest({ method: 'tools/list' });
      const mockRes = createMockResponse();

      await handler(mockReq, mockRes);

      // Verify transport was called
      expect(mockTransport.handleRequest).toHaveBeenCalled();

      // Verify context was available inside handleRequest
      expect(capturedContext).toBe(mockReq);
    });

    it('context is unavailable outside handler execution', async () => {
      const mockTransport = {
        handleRequest: vi.fn(async (something: unknown) => {
          console.log(`something in a test: ${something}`);
        }),
      } as unknown as StreamableHTTPServerTransport;

      const handler = createMcpHandler(mockTransport);
      const mockReq = createMockRequest({ method: 'tools/list' });
      const mockRes = createMockResponse();

      await handler(mockReq, mockRes);

      // After handler completes, context should be undefined
      expect(getRequestContext()).toBeUndefined();
    });
  });

  describe('request adaptation', () => {
    it('passes body to transport.handleRequest', async () => {
      const testBody = { jsonrpc: '2.0', method: 'tools/list', id: '123' };
      let receivedBody: unknown;

      const mockTransport = {
        handleRequest: vi.fn(async (_req: unknown, _res: unknown, body: unknown) => {
          receivedBody = body;
        }),
      } as unknown as StreamableHTTPServerTransport;

      const handler = createMcpHandler(mockTransport);
      const mockReq = createMockRequest(testBody);
      const mockRes = createMockResponse();

      await handler(mockReq, mockRes);

      expect(receivedBody).toEqual(testBody);
    });

    it('omits auth property from adapted request', async () => {
      let receivedRequest: unknown;

      const mockTransport = {
        handleRequest: vi.fn(async (req: unknown) => {
          receivedRequest = req;
        }),
      } as unknown as StreamableHTTPServerTransport;

      const handler = createMcpHandler(mockTransport);
      // Create request with auth property (as Clerk middleware would add)
      const mockReq = {
        ...createMockRequest({ method: 'tools/list' }),
        auth: { userId: 'test-user' },
      } as Request;
      const mockRes = createMockResponse();

      await handler(mockReq, mockRes);

      // The adapted request should not expose the auth property
      // (to avoid type conflicts with MCP SDK's AuthInfo type)
      expect(receivedRequest).toBeDefined();
      const adapted = receivedRequest as { auth?: unknown };
      expect(adapted.auth).toBeUndefined();
    });
  });
});
