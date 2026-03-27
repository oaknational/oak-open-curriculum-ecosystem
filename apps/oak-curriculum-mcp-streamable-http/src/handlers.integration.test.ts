/**
 * Integration tests for createMcpHandler and registerHandlers.
 *
 * Tests that the MCP handler correctly:
 * 1. Reads AuthInfo from res.locals.authInfo and sets req.auth for MCP SDK
 * 2. Extracts correlation ID for logging
 * 3. Passes body to transport.handleRequest
 * 4. Creates server+transport per request via factory
 * 5. Connects server to transport before handling
 * 6. Cleans up server+transport on response close
 *
 * Phase 2 (GREEN) tests also assert:
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
  toRegistrationConfig,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { createMcpHandler, registerHandlers } from './handlers.js';
import {
  createFakeResponse,
  createFakeMcpServerFactory,
  createFakeExpressRequest,
  createFakeSearchRetrieval,
  createFakeLogger,
  createFakeAuthInfo,
} from './test-helpers/fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';
import { handleToolWithAuthInterception } from './tool-handler-with-auth.js';

/**
 * Create a minimal mock Express request for testing.
 */
function createMockRequest(body: unknown): Request {
  return createFakeExpressRequest({ body: body as object });
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

    it('sets req.auth to undefined when res.locals.authInfo is absent', async () => {
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

      // Without auth middleware setting res.locals.authInfo, req.auth is undefined.
      expect(receivedRequest).toBeDefined();
      expect(receivedRequest).toHaveProperty('auth', undefined);
    });

    it('reads authInfo from res.locals.authInfo set by middleware', async () => {
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
      const fakeAuthInfo = createFakeAuthInfo();
      const mockRes = createFakeResponse({ locals: { authInfo: fakeAuthInfo } });

      await handler(mockReq, mockRes);

      // Handler reads AuthInfo from res.locals.authInfo (set by mcpAuth middleware)
      // and propagates it as req.auth for the MCP SDK transport.
      expect(receivedRequest).toBeDefined();
      expect(receivedRequest).toHaveProperty('auth', fakeAuthInfo);
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
   * Find the config (second argument) passed to registerTool for a given tool name.
   *
   * Accepts `ReadonlyArray<readonly unknown[]>` so that the generic spy's
   * `mock.calls` (typed as `never[][]`) is assignable without type assertions
   * — `never extends unknown` in TypeScript.
   */
  function findRegisteredConfig(calls: readonly (readonly unknown[])[], toolName: string): unknown {
    const call = calls.find((c) => c[0] === toolName);
    if (!call) {
      throw new Error(`registerTool was not called for tool ${toolName}`);
    }
    return call[1];
  }

  /**
   * Register tools on a real McpServer and observe registerTool calls.
   *
   * Uses vi.spyOn (observation) on an injected dependency — not vi.mock
   * (module replacement). The McpServer is passed as an argument to
   * registerHandlers(), making this DI-compliant per ADR-078.
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
      // The config must include _meta.ui.resourceUri so that
      // registerAppTool() can normalise UI metadata.
      const config = findRegisteredConfig(registerToolSpy.mock.calls, widgetName);
      expect(config, `config for ${widgetName}`).toHaveProperty('_meta.ui.resourceUri');
    }
  });

  it('registration config comes from SDK projection, not hand-assembled', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      const actualConfig = findRegisteredConfig(registerToolSpy.mock.calls, tool.name);
      const expectedConfig = toRegistrationConfig(tool);
      expect(actualConfig).toEqual(expectedConfig);
    }
  });
});

/**
 * Tests for explicit auth context propagation.
 *
 * HandleToolOptions accepts an `authInfo` parameter so auth context flows
 * from the ingress edge through to checkMcpClientAuth without ambient state.
 */
describe('explicit auth context propagation', () => {
  it('HandleToolOptions accepts authInfo parameter', async () => {
    const runtimeConfig = createMockRuntimeConfig();

    const result = await handleToolWithAuthInterception({
      tool: { name: 'get-key-stages' },
      params: {},
      deps: {
        createClient: vi.fn(),
        executeMcpTool: vi.fn(),
        createExecutor: vi.fn(() => vi.fn()),
        getResourceUrl: () => 'https://test.example.com/mcp',
        searchRetrieval: createFakeSearchRetrieval(),
      },
      logger: createFakeLogger(),
      apiKey: 'test-key',
      runtimeConfig,
      authInfo: undefined,
    });

    // When authInfo is undefined for a protected tool, expect an auth error
    expect(result.isError).toBe(true);
  });
});
