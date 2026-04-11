/**
 * Integration tests for tool registration.
 *
 * These tests prove that:
 * 1. Every universal tool is registered with the server, and UI tools show
 *    the ext-apps registration normalisation effect.
 * 2. Registration configs use the tool's title, description, inputSchema,
 *    annotations, and _meta directly — no projection functions.
 * 3. UI-bearing tools have `_meta.ui.resourceUri` in their registration config.
 */

import { describe, it, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  listUniversalTools,
  generatedToolRegistry,
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
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
  });

  return { server, registerToolSpy };
}

describe('Tool Registration (Integration)', () => {
  it('every universal tool is registered with the server', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      const config = findRegisteredConfig(registerToolSpy.mock.calls, tool.name);
      expect(config).toBeDefined();
    }
  });

  it('non-UI tools are registered with title, description, inputSchema, and annotations', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      if (isAppToolEntry(tool)) {
        continue;
      }
      const config = findRegisteredConfig(registerToolSpy.mock.calls, tool.name);
      expect(config).toHaveProperty('title', tool.title);
      expect(config).toHaveProperty('description', tool.description);
      expect(config).toHaveProperty('inputSchema', tool.inputSchema);
      expect(config).toHaveProperty('annotations', tool.annotations);
    }
  });

  it('UI tools are registered with title, description, inputSchema, and _meta.ui.resourceUri', () => {
    const { registerToolSpy } = registerAndCapture();
    const tools = listUniversalTools(generatedToolRegistry);
    const appTools = tools.filter(isAppToolEntry);

    expect(appTools.length).toBeGreaterThan(0);

    for (const tool of appTools) {
      const config = findRegisteredConfig(registerToolSpy.mock.calls, tool.name);
      expect(config).toHaveProperty('title', tool.title);
      expect(config).toHaveProperty('description', tool.description);
      expect(config).toHaveProperty('inputSchema', tool.inputSchema);
      expect(config).toHaveProperty('_meta.ui.resourceUri', tool._meta.ui.resourceUri);
    }
  });

  it('UI tools include ext-apps resource-uri normalisation on the server-facing config', () => {
    const { registerToolSpy } = registerAndCapture();
    const appTools = listUniversalTools(generatedToolRegistry).filter(isAppToolEntry);

    expect(appTools.length).toBeGreaterThan(0);

    for (const tool of appTools) {
      const config = findRegisteredConfig(registerToolSpy.mock.calls, tool.name);
      expect(config).toHaveProperty('_meta.ui.resourceUri', tool._meta.ui.resourceUri);
      expect(config).toHaveProperty('_meta.ui/resourceUri', tool._meta.ui.resourceUri);
    }
  });

  it('get-curriculum-model keeps an empty input schema on app-tool registration', () => {
    const { registerToolSpy } = registerAndCapture();
    const modelTool = listUniversalTools(generatedToolRegistry)
      .filter(isAppToolEntry)
      .find((tool) => tool.name === 'get-curriculum-model');

    expect(modelTool).toBeDefined();

    const config = findRegisteredConfig(registerToolSpy.mock.calls, 'get-curriculum-model');
    expect(config).toHaveProperty('inputSchema', modelTool?.inputSchema);
    expect(config).toHaveProperty('inputSchema', {});
    expect(modelTool?.inputSchema).toEqual({});
  });
});
