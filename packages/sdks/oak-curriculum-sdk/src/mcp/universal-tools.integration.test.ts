import { describe, it, expect } from 'vitest';
import { listUniversalTools, generatedToolRegistry } from './universal-tools/index.js';
import { AGGREGATED_TOOL_DEFS } from './universal-tools/definitions.js';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';

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

/** Non-widget tools have _meta for securitySchemes but no ui.resourceUri. */
const NON_WIDGET_TOOLS = new Set(['download-asset']);

/**
 * Integration tests for MCP Apps standard _meta fields (ADR-141).
 *
 * Verifies that listUniversalTools() exposes _meta fields for BOTH
 * generated tools (from sdk-codegen) and aggregated tools.
 */
describe('listUniversalTools _meta integration', () => {
  it('widget tools have _meta.ui.resourceUri pointing to widget', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const widgetTools = tools.filter((t) => !NON_WIDGET_TOOLS.has(t.name));

    for (const tool of widgetTools) {
      expect(tool._meta?.ui?.resourceUri).toBe(WIDGET_URI);
    }
  });
});

/**
 * Verify generated tools specifically have _meta.
 * This catches the bug where listUniversalTools() didn't include _meta for generated tools.
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

  it('at least one generated tool has _meta.ui.resourceUri and securitySchemes', () => {
    const tools = listUniversalTools(generatedToolRegistry);
    const generatedTools = tools.filter((t) => !aggregatedNameSet.has(t.name));
    const sampleTool = generatedTools[0];

    expect(sampleTool).toBeDefined();
    expect(sampleTool._meta?.ui?.resourceUri).toBe(WIDGET_URI);
    expect(sampleTool._meta?.securitySchemes).toBeDefined();
  });
});

/** Helper to find a tool by name, reducing complexity in test functions */
function findToolByName(name: string) {
  return (t: { name: string }) => t.name === name;
}
