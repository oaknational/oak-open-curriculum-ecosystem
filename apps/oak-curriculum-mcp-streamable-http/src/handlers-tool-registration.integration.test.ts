/**
 * Integration tests for tool registration via SDK canonical projection.
 *
 * These tests prove that:
 * 1. UI-bearing tools are registered via `registerAppTool()` which normalises
 *    `_meta` to include both modern and legacy keys for host compatibility.
 * 2. Non-UI tools are registered via `server.registerTool()` with the standard
 *    SDK canonical projection.
 * 3. Registration config comes from the SDK canonical projection, not from
 *    hand-assembled field extraction in the app layer.
 *
 * @see .agent/plans/sdk-and-mcp-enhancements/active/ws3-off-the-shelf-mcp-sdk-adoption.plan.md — Phase 3
 */

import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  listUniversalTools,
  generatedToolRegistry,
  toRegistrationConfig,
  toAppToolRegistrationConfig,
  isAppToolEntry,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { registerHandlers } from './handlers.js';
import {
  createFakeSearchRetrieval,
  createFakeLogger,
  createFakeHttpObservability,
} from './test-helpers/fakes.js';
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
    observability: createFakeHttpObservability(),
    searchRetrieval: createFakeSearchRetrieval(),
  });

  return { server, registerToolSpy };
}

describe('Tool Registration Uses SDK Canonical Projection (Integration)', () => {
  it('non-UI tools use toRegistrationConfig projection', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      if (isAppToolEntry(tool)) {
        continue;
      }
      const actualConfig = findRegisteredConfig(registerToolSpy.mock.calls, tool.name);
      const expectedConfig = toRegistrationConfig(tool);
      expect(actualConfig).toEqual(expectedConfig);
    }
  });

  it('UI tools use toAppToolRegistrationConfig projection (superset after normalisation)', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      if (!isAppToolEntry(tool)) {
        continue;
      }
      const actualConfig = findRegisteredConfig(registerToolSpy.mock.calls, tool.name);
      const expectedConfig = toAppToolRegistrationConfig(tool);
      // registerAppTool normalises _meta by adding the legacy "ui/resourceUri"
      // key, so the registered config is a superset of the projection output.
      // Verify all non-_meta fields match exactly.
      expect(actualConfig).toHaveProperty('title', expectedConfig.title);
      expect(actualConfig).toHaveProperty('description', expectedConfig.description);
      expect(actualConfig).toHaveProperty('inputSchema', expectedConfig.inputSchema);
      expect(actualConfig).toHaveProperty('annotations', expectedConfig.annotations);
      // _meta is a superset — the projection's _meta.ui is present, plus the legacy key.
      expect(actualConfig).toHaveProperty('_meta.ui', expectedConfig._meta.ui);
    }
  });
});

describe('registerAppTool normalises _meta for UI tools (Integration)', () => {
  it('UI tools have both modern _meta.ui.resourceUri and legacy _meta["ui/resourceUri"]', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);
    const uiTools = tools.filter(isAppToolEntry);
    expect(uiTools.length).toBeGreaterThan(0);

    for (const tool of uiTools) {
      const actualConfig = findRegisteredConfig(registerToolSpy.mock.calls, tool.name);
      expect(actualConfig).toHaveProperty('_meta.ui.resourceUri');
      expect(actualConfig).toHaveProperty(['_meta', 'ui/resourceUri']);
    }
  });

  it('non-UI tools do not have legacy _meta["ui/resourceUri"] key', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      if (isAppToolEntry(tool)) {
        continue;
      }
      const actualConfig = findRegisteredConfig(registerToolSpy.mock.calls, tool.name);
      expect(actualConfig).not.toHaveProperty(['_meta', 'ui/resourceUri']);
    }
  });
});
