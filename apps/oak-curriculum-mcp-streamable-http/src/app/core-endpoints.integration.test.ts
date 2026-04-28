/**
 * Integration tests proving native Sentry MCP wrapping is inert without init.
 *
 * The per-request factory in `core-endpoints.ts` calls
 * `wrapMcpServerWithSentry(server)` unconditionally before
 * `registerHandlers(server, ...)`. This test proves that the wrapping
 * call does not break handler registration when `Sentry.init()` was
 * never called (`SENTRY_MODE=off`), which is the default mode.
 *
 * Wrapping order (wrap before register) is load-bearing for handler-level
 * error capture but is not directly testable in-process — the patching
 * effect is internal to `@sentry/node`. Order correctness is enforced
 * by code review and deployment verification.
 *
 * @see ADR-112 for the per-request MCP transport pattern.
 * @see core-endpoints.ts for the factory implementation.
 */

import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { wrapMcpServerWithSentry } from '@sentry/node';
import { registerHandlers } from '../handlers.js';
import {
  createFakeSearchRetrieval,
  createFakeLogger,
  createFakeHttpObservability,
} from '../test-helpers/fakes.js';
import { createMockRuntimeConfig } from '../test-helpers/auth-error-test-helpers.js';

describe('native Sentry MCP wrapping is inert without Sentry.init', () => {
  it('handlers register successfully through a Sentry-wrapped server', () => {
    const server = new McpServer({ name: 'test', version: '0.0.0' });
    const registerToolSpy = vi.spyOn(server, 'registerTool');

    // Same composition as core-endpoints.ts factory: wrap then register
    wrapMcpServerWithSentry(server);

    registerHandlers(server, {
      runtimeConfig: createMockRuntimeConfig(),
      logger: createFakeLogger(),
      observability: createFakeHttpObservability(),
      searchRetrieval: createFakeSearchRetrieval(),
      getWidgetHtml: () => '<!doctype html><html><body>test</body></html>',
    });

    // Handlers registered through the wrapped server without error
    expect(registerToolSpy.mock.calls.length).toBeGreaterThan(0);
  });
});
