/**
 * Integration tests for tool registration via SDK canonical projection.
 *
 * These tests prove that:
 * 1. Widget tools must be registered with `_meta.ui` metadata so `registerAppTool()`
 *    can handle UI metadata normalisation — raw `registerTool()` is insufficient.
 * 2. Registration config must come from the SDK canonical projection, not from
 *    hand-assembled field extraction in the app layer.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/current/mcp-runtime-boundary-simplification.plan.md — Phase 2
 */

import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  listUniversalTools,
  generatedToolRegistry,
  toRegistrationConfig,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { registerHandlers } from './handlers.js';
import { createFakeSearchRetrieval, createFakeLogger } from './test-helpers/fakes.js';
import { createMockRuntimeConfig } from './test-helpers/auth-error-test-helpers.js';

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

describe('tool registration uses SDK canonical projection', () => {
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
