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
import { z } from 'zod';
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
import { walkCanonicalRegistration } from './test-helpers/registration-walk.js';
import { SERVED_SURFACE, type ServedSurfaceDefinition } from './served-surface/served-surface.js';

/**
 * Full-enumeration variant: every universal tool live (the user-search MCP
 * App pair and the gated EEF tool are dormant in the canonical definition).
 * These tests prove the registration MECHANISM wires every enumerated tool;
 * the canonical classification itself is proven in the served-surface suites.
 */
const ALL_UNIVERSAL_TOOLS_LIVE: ServedSurfaceDefinition = {
  universalTools: {
    ...SERVED_SURFACE.universalTools,
    'user-search': 'live',
    'user-search-query': 'live',
    'get-eef-evidence': 'live',
  },
  appLocalTools: {
    ...SERVED_SURFACE.appLocalTools,
    'oak-under-the-hood': 'live',
  },
  resources: SERVED_SURFACE.resources,
};

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
function registerAndCapture(
  options: {
    readonly servedSurface?: ServedSurfaceDefinition;
  } = {},
) {
  const server = new McpServer({ name: 'test-server', version: '0.0.0' });
  const registerToolSpy = vi.spyOn(server, 'registerTool');

  registerHandlers(server, {
    servedSurface: options.servedSurface ?? ALL_UNIVERSAL_TOOLS_LIVE,
    runtimeConfig: createMockRuntimeConfig(),
    logger: createFakeLogger(),
    observability: createFakeHttpObservability(),
    searchRetrieval: createFakeSearchRetrieval(),
    resourceUrl: 'https://probe.test/mcp',
    getWidgetHtml: () => '<!doctype html><html><body>test-widget</body></html>',
  });

  return { server, registerToolSpy };
}

describe('Tool Registration (Integration)', () => {
  it('every universal tool is registered with the server', () => {
    // Full-enumeration definition so this test proves the registration
    // mechanism wires every enumerated tool; the canonical live/dormant
    // classification is proven in the served-surface suites.
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

  it('every registered tool carries annotations with a display title and the four behaviour hints', () => {
    // The MCP-300 parity validator. Walking the registerTool calls (not a
    // source-side list) covers every registration path — generated,
    // aggregated, and app-local — so a future hand-authored tool cannot
    // register without the annotations the directory review reads.
    const registeredAnnotationsSchema = z.object({
      annotations: z.object({
        title: z.string().min(1),
        readOnlyHint: z.boolean(),
        destructiveHint: z.boolean(),
        idempotentHint: z.boolean(),
        openWorldHint: z.boolean(),
      }),
    });
    const { toolConfigs } = walkCanonicalRegistration(ALL_UNIVERSAL_TOOLS_LIVE);

    expect(toolConfigs.size).toBeGreaterThan(0);

    for (const [name, config] of toolConfigs) {
      const parsed = registeredAnnotationsSchema.safeParse(config);
      if (!parsed.success) {
        expect.fail(
          `tool ${name} registered without required annotations: ${parsed.error.message}`,
        );
      }
    }
  });

  it('no registered tool description instructs the model — no sequencing imperative, no presentation directive', () => {
    // Directory compliance (acknowledgement 5), enforced at the same walk as
    // the annotations validator so the generated, aggregated, and app-local
    // registration PATHS are all reached. Two banned CLASSES: the imperative
    // prerequisite — "PREREQUISITE: You MUST call X first" and the softer
    // "(use 'X' first)" sequencing alike — that duplicated the server's
    // `instructions` field, and the presentation directive — an
    // "IMPORTANT:"-marked or "always include ..." instruction telling the
    // model how to present output (the download-asset fonts tip was the
    // worked instance). Both are guarded by case-insensitive patterns;
    // routing cross-references ("Not for X — use Y", no sequencing
    // imperative) are documentation and stay. This walk also holds a second
    // invariant: every registered tool carries a non-empty description.
    const bannedDescriptionGuidance = [
      /prerequisite:/i,
      /you must call/i,
      /\b(?:use|call) '[^']+' first\b/i,
      /\bimportant:/i,
      /\balways include\b/i,
    ];
    const describedConfigSchema = z.object({ description: z.string().min(1) });
    const { toolConfigs } = walkCanonicalRegistration(ALL_UNIVERSAL_TOOLS_LIVE);

    expect(toolConfigs.size).toBeGreaterThan(0);

    for (const [name, config] of toolConfigs) {
      const parsed = describedConfigSchema.safeParse(config);
      if (!parsed.success) {
        expect.fail(`tool ${name} registered without a description: ${parsed.error.message}`);
      }
      for (const pattern of bannedDescriptionGuidance) {
        expect(parsed.data.description, `description on ${name}`).not.toMatch(pattern);
      }
    }
  });
});
