import { describe, it, expect } from 'vitest';
import { listUniversalTools, generatedToolRegistry } from './universal-tools/index.js';
import { AGGREGATED_TOOL_DEFS } from './universal-tools/definitions.js';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';
import { WIDGET_URI, WIDGET_TOOL_NAMES } from '@oaknational/sdk-codegen/widget-constants';

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
      expect(tool.annotations?.title).toBeDefined();
      // Title should be human-readable (contains spaces or is single word)
      // and not kebab-case
      expect(tool.annotations?.title).not.toContain('-');
    }
  });

  it('search tool has correct annotations', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const searchTool = tools.find(findToolByName('search'));

    expect(searchTool).toBeDefined();
    const annotations = searchTool?.annotations;
    expect(annotations?.readOnlyHint).toBe(true);
    expect(annotations?.destructiveHint).toBe(false);
    expect(annotations?.idempotentHint).toBe(true);
    expect(annotations?.openWorldHint).toBe(false);
    expect(annotations?.title).toBe('Search Curriculum');
  });

  it('fetch tool has correct annotations', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const fetchTool = tools.find(findToolByName('fetch'));

    expect(fetchTool).toBeDefined();
    const annotations = fetchTool?.annotations;
    expect(annotations?.readOnlyHint).toBe(true);
    expect(annotations?.destructiveHint).toBe(false);
    expect(annotations?.idempotentHint).toBe(true);
    expect(annotations?.openWorldHint).toBe(false);
    expect(annotations?.title).toBe('Fetch Curriculum Resource');
  });

  it('get-curriculum-model tool has correct annotations', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const modelTool = tools.find(findToolByName('get-curriculum-model'));

    expect(modelTool).toBeDefined();
    const annotations = modelTool?.annotations;
    expect(annotations?.readOnlyHint).toBe(true);
    expect(annotations?.destructiveHint).toBe(false);
    expect(annotations?.idempotentHint).toBe(true);
    expect(annotations?.openWorldHint).toBe(false);
    expect(annotations?.title).toBeDefined();
  });

  it('get-curriculum-model tool has MCP Apps _meta fields', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const modelTool = tools.find(findToolByName('get-curriculum-model'));

    expect(modelTool).toBeDefined();
    expect(modelTool?._meta).toBeDefined();
    expect(modelTool?._meta?.ui?.resourceUri).toBeDefined();
  });
});

// WIDGET_TOOL_NAMES imported from canonical source above.

/**
 * Integration tests for MCP Apps standard _meta fields (ADR-141).
 *
 * Verifies that listUniversalTools() exposes _meta.ui only for allowlisted
 * widget tools, and that all other tools have no _meta.ui.
 */
describe('listUniversalTools _meta integration', () => {
  it('widget tools have _meta.ui.resourceUri pointing to widget', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const widgetTools = tools.filter((t) => WIDGET_TOOL_NAMES.has(t.name));

    expect(widgetTools.length).toBe(WIDGET_TOOL_NAMES.size);
    for (const tool of widgetTools) {
      expect(tool._meta?.ui?.resourceUri).toBe(WIDGET_URI);
    }
  });

  it('non-widget tools do not have _meta.ui', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const nonWidgetTools = tools.filter((t) => !WIDGET_TOOL_NAMES.has(t.name));

    expect(nonWidgetTools.length).toBeGreaterThan(0);
    for (const tool of nonWidgetTools) {
      expect(tool._meta?.ui).toBeUndefined();
    }
  });
});

/**
 * Verify generated tools have _meta with securitySchemes but no widget UI.
 *
 * Generated tools are not in the WIDGET_TOOL_NAMES allowlist, so they should
 * have _meta.securitySchemes but no _meta.ui.
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

  it('generated tools have _meta.securitySchemes but no _meta.ui', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const generatedTools = tools.filter((t) => !aggregatedNameSet.has(t.name));
    const sampleTool = generatedTools[0];

    expect(sampleTool).toBeDefined();
    expect(sampleTool._meta?.ui).toBeUndefined();
    expect(sampleTool._meta?.securitySchemes).toBeDefined();
  });
});

/** Helper to find a tool by name, reducing complexity in test functions */
function findToolByName(name: string) {
  return (t: { name: string }) => t.name === name;
}
