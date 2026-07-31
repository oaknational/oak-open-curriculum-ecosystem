/**
 * Integration tests for core-endpoints composition: native Sentry MCP
 * wrapping inertness and per-request transport observation (MCP-241).
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
import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { wrapMcpServerWithSentry } from '@sentry/node';
import type { McpTransportObserver } from '@oaknational/observability';
import { initializeCoreEndpoints } from './core-endpoints.js';
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
      resourceUrl: 'https://probe.test/mcp',
      getWidgetHtml: () => '<!doctype html><html><body>test</body></html>',
    });

    // Handlers registered through the wrapped server without error
    expect(registerToolSpy.mock.calls.length).toBeGreaterThan(0);
  });
});

describe('per-request transport observation (MCP-241)', () => {
  function initialize(transportObserver?: McpTransportObserver<Transport>) {
    const app = express();
    return initializeCoreEndpoints(
      app,
      {
        runtimeConfig: createMockRuntimeConfig(),
        observability: createFakeHttpObservability(),
        resourceUrl: 'https://probe.test/mcp',
        getWidgetHtml: () => '<!doctype html><html><body>test</body></html>',
        ...(transportObserver ? { transportObserver } : {}),
      },
      createFakeLogger(),
    );
  }

  it('off mode: connectTransport is the exact concrete transport reference', () => {
    const { mcpFactory } = initialize();

    const context = mcpFactory();

    expect(context.connectTransport).toBe(context.transport);
  });

  it('hands each fresh transport to the observer and connects through its return value', () => {
    const observed: Transport[] = [];
    const decoy = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    const { mcpFactory } = initialize({
      observe: (transport) => {
        observed.push(transport);
        return decoy;
      },
    });

    const context = mcpFactory();

    expect(context.connectTransport).toBe(decoy);
    expect(context.transport).not.toBe(decoy);
    expect(observed).toHaveLength(1);
    expect(observed[0]).toBe(context.transport);
  });

  it('observes a distinct fresh transport per factory call', () => {
    const observed: Transport[] = [];
    const { mcpFactory } = initialize({
      observe: (transport) => {
        observed.push(transport);
        return transport;
      },
    });

    const first = mcpFactory();
    const second = mcpFactory();

    expect(first.transport).not.toBe(second.transport);
    expect(observed).toHaveLength(2);
    expect(observed[0]).toBe(first.transport);
    expect(observed[1]).toBe(second.transport);
  });
});
