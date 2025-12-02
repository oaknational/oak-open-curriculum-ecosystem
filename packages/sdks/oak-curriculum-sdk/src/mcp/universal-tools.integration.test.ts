import { describe, it, expect } from 'vitest';
import { listUniversalTools } from './universal-tools/index.js';

/**
 * Integration tests verifying universal tools have proper MCP annotations.
 *
 * These tests verify that both generated and aggregated tools expose
 * the correct annotations for MCP clients to understand tool behavior.
 */
describe('listUniversalTools annotations', () => {
  it('returns tools with annotations property', () => {
    const tools = listUniversalTools();

    expect(tools.length).toBeGreaterThan(0);

    for (const tool of tools) {
      expect(tool.annotations).toBeDefined();
    }
  });

  it('all tools have readOnlyHint set to true', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool.annotations?.readOnlyHint).toBe(true);
    }
  });

  it('all tools have destructiveHint set to false', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool.annotations?.destructiveHint).toBe(false);
    }
  });

  it('all tools have idempotentHint set to true', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool.annotations?.idempotentHint).toBe(true);
    }
  });

  it('all tools have openWorldHint set to false', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool.annotations?.openWorldHint).toBe(false);
    }
  });

  it('all tools have a human-readable title', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool.annotations?.title).toBeDefined();
      expect(typeof tool.annotations?.title).toBe('string');
      expect(tool.annotations?.title?.length).toBeGreaterThan(0);
      // Title should be human-readable (contains spaces or is single word)
      // and not kebab-case
      expect(tool.annotations?.title).not.toContain('-');
    }
  });

  it('search tool has correct annotations', () => {
    const tools = listUniversalTools();
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
    const tools = listUniversalTools();
    const fetchTool = tools.find(findToolByName('fetch'));

    expect(fetchTool).toBeDefined();
    const annotations = fetchTool?.annotations;
    expect(annotations?.readOnlyHint).toBe(true);
    expect(annotations?.destructiveHint).toBe(false);
    expect(annotations?.idempotentHint).toBe(true);
    expect(annotations?.openWorldHint).toBe(false);
    expect(annotations?.title).toBe('Fetch Curriculum Resource');
  });

  it('get-ontology tool has correct annotations', () => {
    const tools = listUniversalTools();
    const ontologyTool = tools.find(findToolByName('get-ontology'));

    expect(ontologyTool).toBeDefined();
    const annotations = ontologyTool?.annotations;
    expect(annotations?.readOnlyHint).toBe(true);
    expect(annotations?.destructiveHint).toBe(false);
    expect(annotations?.idempotentHint).toBe(true);
    expect(annotations?.openWorldHint).toBe(false);
    expect(annotations?.title).toBe('Get Curriculum Ontology');
  });

  it('get-ontology tool has OpenAI _meta fields', () => {
    const tools = listUniversalTools();
    const ontologyTool = tools.find(findToolByName('get-ontology'));

    expect(ontologyTool).toBeDefined();
    expect(ontologyTool?._meta).toBeDefined();
    expect(ontologyTool?._meta?.['openai/toolInvocation/invoking']).toBe(
      'Loading curriculum model…',
    );
    expect(ontologyTool?._meta?.['openai/toolInvocation/invoked']).toBe('Curriculum model loaded');
  });
});

/**
 * Integration tests for OpenAI Apps SDK _meta fields across ALL tools.
 *
 * These tests verify that listUniversalTools() exposes _meta fields
 * for BOTH generated tools (from type-gen) and aggregated tools.
 * This proves the integration point where both camps meet.
 */
describe('listUniversalTools _meta integration', () => {
  it('ALL tools (generated + aggregated) have _meta defined', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool._meta).toBeDefined();
    }
  });

  it('ALL tools have openai/outputTemplate pointing to widget', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool._meta?.['openai/outputTemplate']).toBe('ui://widget/oak-json-viewer.html');
    }
  });

  it('ALL tools have openai/widgetAccessible set to true', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool._meta?.['openai/widgetAccessible']).toBe(true);
    }
  });

  it('ALL tools have openai/visibility set to public', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool._meta?.['openai/visibility']).toBe('public');
    }
  });

  it('ALL tools have openai/toolInvocation/invoking status text', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool._meta?.['openai/toolInvocation/invoking']).toBeDefined();
      expect(typeof tool._meta?.['openai/toolInvocation/invoking']).toBe('string');
      expect(tool._meta?.['openai/toolInvocation/invoking']?.length).toBeGreaterThan(0);
    }
  });

  it('ALL tools have openai/toolInvocation/invoked status text', () => {
    const tools = listUniversalTools();

    for (const tool of tools) {
      expect(tool._meta?.['openai/toolInvocation/invoked']).toBeDefined();
      expect(typeof tool._meta?.['openai/toolInvocation/invoked']).toBe('string');
      expect(tool._meta?.['openai/toolInvocation/invoked']?.length).toBeGreaterThan(0);
    }
  });
});

/**
 * Verify generated tools specifically have _meta.
 * This catches the bug where listUniversalTools() didn't include _meta for generated tools.
 */
describe('generated tools _meta integration', () => {
  const aggregatedNames = ['search', 'fetch', 'get-ontology', 'get-help'];

  it('generated tools (non-aggregated) have _meta defined', () => {
    const tools = listUniversalTools();
    const generatedTools = tools.filter((t) => !aggregatedNames.includes(t.name));

    expect(generatedTools.length).toBeGreaterThan(0);

    for (const tool of generatedTools) {
      expect(tool._meta).toBeDefined();
    }
  });

  it('at least one generated tool has complete _meta with all fields', () => {
    const tools = listUniversalTools();
    const generatedTools = tools.filter((t) => !aggregatedNames.includes(t.name));
    const sampleTool = generatedTools[0];

    expect(sampleTool).toBeDefined();
    expect(sampleTool._meta?.['openai/outputTemplate']).toBe('ui://widget/oak-json-viewer.html');
    expect(sampleTool._meta?.['openai/widgetAccessible']).toBe(true);
    expect(sampleTool._meta?.['openai/visibility']).toBe('public');
    expect(sampleTool._meta?.['openai/toolInvocation/invoking']).toBeDefined();
    expect(sampleTool._meta?.['openai/toolInvocation/invoked']).toBeDefined();
  });
});

/** Helper to find a tool by name, reducing complexity in test functions */
function findToolByName(name: string) {
  return (t: { name: string }) => t.name === name;
}
