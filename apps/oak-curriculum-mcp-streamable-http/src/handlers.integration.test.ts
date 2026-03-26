/**
 * Integration tests for createMcpHandler and registerHandlers.
 *
 * Tests that the MCP handler correctly:
 * 1. Wraps transport.handleRequest in setRequestContext
 * 2. Extracts correlation ID for logging
 * 3. Adapts Express request for MCP SDK
 * 4. Creates server+transport per request via factory
 * 5. Connects server to transport before handling
 * 6. Cleans up server+transport on response close
 *
 * Phase 2 (RED) tests also assert:
 * 7. Widget tools must be registered with _meta.ui for registerAppTool() compatibility
 * 8. Registration config must come from SDK canonical projection, not hand-assembly
 *
 * Uses simple fakes injected as arguments - NO network IO.
 */

import { describe, it, expect, vi } from 'vitest';
import type { Request } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  listUniversalTools,
  generatedToolRegistry,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { createMcpHandler, registerHandlers } from './handlers.js';
import { getRequestContext } from './request-context.js';
import {
  createFakeResponse,
  createFakeMcpServerFactory,
  createFakeExpressRequest,
  createFakeSearchRetrieval,
  createFakeLogger,
} from './test-helpers/fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';

// RED: This import does not exist yet — type-check fails here.
// Phase 3 (GREEN) will create this module and make the tests pass.
import { toRegistrationConfig } from '@oaknational/curriculum-sdk/public/mcp-tools.js';

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

/**
 * Phase 2 (RED) tests for tool registration via SDK projection.
 *
 * These tests prove that:
 * 1. Widget tools must be registered with `_meta.ui` metadata so `registerAppTool()`
 *    can handle UI metadata normalisation — raw `registerTool()` is insufficient.
 * 2. Registration config must come from the SDK canonical projection, not from
 *    hand-assembled field extraction in the app layer.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/current/mcp-runtime-boundary-simplification.plan.md — Phase 2
 */
describe('tool registration via SDK projection (Phase 2 RED)', () => {
  /**
   * Register tools on a real McpServer and observe registerTool calls.
   *
   * Uses vi.spyOn (observation) on an injected dependency — not vi.mock
   * (module replacement). The McpServer is passed as an argument to
   * registerHandlers(), making this DI-compliant per ADR-078.
   *
   * Phase 3 (GREEN) should consider replacing this with a protocol-level
   * test against tools/list response, once the SDK projections exist.
   */
  function registerAndCapture() {
    const server = new McpServer({ name: 'test-server', version: '0.0.0' });
    const registerToolSpy = vi.spyOn(server, 'registerTool');

    registerHandlers(server, {
      runtimeConfig: createMockRuntimeConfig(),
      logger: createFakeLogger(),
      searchRetrieval: createFakeSearchRetrieval(),
    });

    return { server, registerToolSpy };
  }

  it('widget tools are registered with _meta.ui.resourceUri in config', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);
    const widgetToolNames = tools
      .filter((t) => t._meta?.ui?.resourceUri !== undefined)
      .map((t) => t.name);

    expect(widgetToolNames.length).toBeGreaterThan(0);

    for (const widgetName of widgetToolNames) {
      const call = registerToolSpy.mock.calls.find(([name]) => name === widgetName);
      if (!call) {
        throw new Error(`registerTool was not called for widget tool ${widgetName}`);
      }

      // The config (second argument) must include _meta.ui.resourceUri
      // so that registerAppTool() can normalise UI metadata.
      // Currently FAILS: handlers.ts omits _meta from the config object.
      //
      // The config (second argument) must include _meta.ui.resourceUri
      // so that registerAppTool() can normalise UI metadata.
      // Currently FAILS: handlers.ts omits _meta from the config object.
      const config = call[1];
      expect(config, `config for ${widgetName}`).toHaveProperty('_meta.ui.resourceUri');
    }
  });

  it('registration config comes from SDK projection, not hand-assembled', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      const call = registerToolSpy.mock.calls.find(([name]) => name === tool.name);
      if (!call) {
        throw new Error(`registerTool was not called for tool ${tool.name}`);
      }

      // The config should match the SDK canonical projection exactly.
      // RED: toRegistrationConfig does not exist yet — type-check and lint fail.
      const expectedConfig = toRegistrationConfig(tool);
      const actualConfig = call[1];
      expect(actualConfig).toEqual(expectedConfig);
    }
  });
});
