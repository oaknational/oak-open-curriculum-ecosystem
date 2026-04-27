import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  isAppToolEntry,
  listUniversalTools,
  generatedToolRegistry,
} from './universal-tools/index.js';
import { AGGREGATED_TOOL_DEFS } from './universal-tools/definitions.js';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';
import type { ToolName } from '@oaknational/sdk-codegen/mcp-tools';
import type { GeneratedToolRegistry, ToolRegistryDescriptor } from './universal-tools/types.js';

function createRegistryWithDescriptor(
  toolName: ToolName,
  descriptor: ToolRegistryDescriptor,
): GeneratedToolRegistry {
  return {
    toolNames: [toolName],
    getToolFromToolName: () => descriptor,
    isToolName: (value): value is ToolName => value === toolName,
  };
}

/**
 * Integration tests verifying universal tools have proper MCP annotations
 * and MCP Apps standard _meta fields (ADR-141).
 *
 * These tests verify that both generated and aggregated tools expose
 * the correct annotations and _meta.ui metadata for MCP clients.
 */
describe('listUniversalTools annotations', () => {
  it('returns tools with annotations property', () => {
    const tools = listUniversalTools(generatedToolRegistry);

    expect(tools.length).toBeGreaterThan(0);

    for (const tool of tools) {
      expect(tool.annotations).toBeDefined();
    }
  });

  it('all tools have readOnlyHint set to true', () => {
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      expect(tool.annotations?.readOnlyHint).toBe(true);
    }
  });

  it('all tools have destructiveHint set to false', () => {
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      expect(tool.annotations?.destructiveHint).toBe(false);
    }
  });

  it('all tools have idempotentHint set to true', () => {
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      expect(tool.annotations?.idempotentHint).toBe(true);
    }
  });

  it('all tools have openWorldHint set to false', () => {
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      expect(tool.annotations?.openWorldHint).toBe(false);
    }
  });

  it('all tools have a human-readable title', () => {
    const tools = listUniversalTools(generatedToolRegistry);

    for (const tool of tools) {
      expect(tool.title).toBeDefined();
      // Title should be human-readable (contains spaces or is single word)
      // and not kebab-case
      expect(tool.title).not.toContain('-');
    }
  });

  it('search tool has correct annotations', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const searchTool = tools.find((t) => t.name === 'search');

    expect(searchTool).toBeDefined();
    const annotations = searchTool?.annotations;
    expect(annotations?.readOnlyHint).toBe(true);
    expect(annotations?.destructiveHint).toBe(false);
    expect(annotations?.idempotentHint).toBe(true);
    expect(annotations?.openWorldHint).toBe(false);
  });

  it('fetch tool has correct annotations', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    // Architectural note: tools.find((t) => t.name === ...) duplicates a
    // lookup the generated registry already exposes for descriptors via
    // getToolFromToolName. An analogous accessor for listed-tool entries
    // belongs at sdk-codegen time, emitted ONCE. Follow-up beyond this PR.
    const fetchTool = tools.find((t) => t.name === 'fetch');

    expect(fetchTool).toBeDefined();
    const annotations = fetchTool?.annotations;
    expect(annotations?.readOnlyHint).toBe(true);
    expect(annotations?.destructiveHint).toBe(false);
    expect(annotations?.idempotentHint).toBe(true);
    expect(annotations?.openWorldHint).toBe(false);
  });

  it('get-curriculum-model tool has correct annotations', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const modelTool = tools.find((t) => t.name === 'get-curriculum-model');

    expect(modelTool).toBeDefined();
    const annotations = modelTool?.annotations;
    expect(annotations?.readOnlyHint).toBe(true);
    expect(annotations?.destructiveHint).toBe(false);
    expect(annotations?.idempotentHint).toBe(true);
    expect(annotations?.openWorldHint).toBe(false);
  });
});

/**
 * MCP Apps wiring (ADR-141): which tools are recognised as opening the embedded
 * app (`registerAppTool`) vs plain tools, and how app-only helpers are marked.
 * Asserts behaviour (host-facing metadata), not the codegen allowlist set.
 */
describe('listUniversalTools MCP Apps metadata behaviour', () => {
  it('orientation and user search expose a widget resource URI for embedded UI', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const modelTool = tools.find((t) => t.name === 'get-curriculum-model');
    const userSearch = tools.find((t) => t.name === 'user-search');

    expect(modelTool, 'get-curriculum-model').toBeDefined();
    expect(userSearch, 'user-search').toBeDefined();
    if (!modelTool || !userSearch) {
      return;
    }

    expect(isAppToolEntry(modelTool)).toBe(true);
    expect(isAppToolEntry(userSearch)).toBe(true);
    if (isAppToolEntry(modelTool) && isAppToolEntry(userSearch)) {
      const uri = /^ui:\/\/widget\/.+\.html$/;
      expect(modelTool._meta.ui.resourceUri).toMatch(uri);
      expect(userSearch._meta.ui.resourceUri).toMatch(uri);
    }
  });

  it('agent search is not an embedded-app tool (no widget resource on list entries)', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const search = tools.find((t) => t.name === 'search');
    expect(search).toBeDefined();
    if (search) {
      expect(isAppToolEntry(search)).toBe(false);
      expect(search._meta?.ui?.resourceUri).toBeUndefined();
    }
  });

  it('user-search-query is app-scoped and does not open the widget (helper for the app)', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const query = tools.find((t) => t.name === 'user-search-query');
    expect(query).toBeDefined();
    if (query) {
      expect(isAppToolEntry(query)).toBe(false);
      expect(query._meta?.ui?.resourceUri).toBeUndefined();
      expect(query._meta?.ui?.visibility).toEqual(['app']);
    }
  });
});

/**
 * OpenAPI-derived tools: invocable with declared auth; no embedded MCP App
 * for typical REST-shaped operations.
 */
describe('generated tools _meta integration', () => {
  const aggregatedNameSet = new Set<string>(typeSafeKeys(AGGREGATED_TOOL_DEFS));

  it('generated tools (non-aggregated) have _meta defined', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const generatedTools = tools.filter((t) => !aggregatedNameSet.has(t.name));

    expect(generatedTools.length).toBeGreaterThan(0);

    for (const tool of generatedTools) {
      expect(tool._meta).toBeDefined();
    }
  });

  it('a representative API-derived tool lists auth in _meta but no widget URI', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const name = 'get-key-stages-subject-lessons' as const;
    const tool = tools.find((t) => t.name === name);
    expect(
      tool,
      'expected a generated tool with a stable name; update if OpenAPI renames the operation',
    ).toBeDefined();
    if (!tool) {
      return;
    }
    expect(isAppToolEntry(tool)).toBe(false);
    expect(tool._meta?.ui?.resourceUri).toBeUndefined();
    expect(tool._meta?.securitySchemes?.length).toBeGreaterThan(0);
  });

  it('fails fast when a generated tool is missing a title or description', () => {
    const toolName = generatedToolRegistry.toolNames[0];
    const descriptor = generatedToolRegistry.getToolFromToolName(toolName);

    expect(descriptor.annotations).toBeDefined();

    const annotations = descriptor.annotations;
    if (!annotations) {
      throw new Error('Expected generated tool descriptor to include annotations');
    }

    // Construct malformed descriptors positively. `title` and `description`
    // are optional in `ToolRegistryDescriptor` (the validator catches their
    // absence at runtime); setting them to `undefined` via spread expresses
    // the missing-metadata fixture without a runtime omit-helper.
    const missingTitleRegistry = createRegistryWithDescriptor(toolName, {
      ...descriptor,
      annotations: { ...annotations, title: undefined },
    });
    const missingDescriptionRegistry = createRegistryWithDescriptor(toolName, {
      ...descriptor,
      description: undefined,
    });

    expect(() => listUniversalTools(missingTitleRegistry)).toThrow(
      `Generated tool "${toolName}" missing required metadata`,
    );
    expect(() => listUniversalTools(missingDescriptionRegistry)).toThrow(
      `Generated tool "${toolName}" missing required metadata`,
    );
  });

  it('accepts a top-level descriptor title when annotations.title is absent', () => {
    const toolName = generatedToolRegistry.toolNames[0];
    const descriptor = generatedToolRegistry.getToolFromToolName(toolName);
    const annotations = descriptor.annotations;

    expect(annotations).toBeDefined();
    if (!annotations) {
      throw new Error('Expected generated tool descriptor to include annotations');
    }

    const topLevelTitle = 'Spec-aligned top-level title';
    const registry = createRegistryWithDescriptor(toolName, {
      ...descriptor,
      title: topLevelTitle,
      annotations: { ...annotations, title: undefined },
    });

    const tool = listUniversalTools(registry).find((entry) => entry.name === toolName);
    expect(tool?.title).toBe(topLevelTitle);
  });

  it('fails fast when a generated tool flat input schema stops being object-shaped', () => {
    const toolName = generatedToolRegistry.toolNames[0];
    const descriptor = generatedToolRegistry.getToolFromToolName(toolName);
    const invalidDescriptor = { ...descriptor };
    Object.defineProperty(invalidDescriptor, 'toolMcpFlatInputSchema', {
      configurable: true,
      value: z.string(),
    });
    const registry = createRegistryWithDescriptor(toolName, {
      ...invalidDescriptor,
    });

    expect(() => listUniversalTools(registry)).toThrow(
      `Generated tool "${toolName}" missing required flat input schema`,
    );
  });
});
