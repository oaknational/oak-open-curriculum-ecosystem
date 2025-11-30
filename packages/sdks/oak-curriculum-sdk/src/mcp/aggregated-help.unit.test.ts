/**
 * Unit tests for get-help aggregated tool.
 *
 * The get-help tool returns structured guidance about how to use the
 * Oak Curriculum MCP server's tools effectively.
 */

import { describe, it, expect } from 'vitest';
import { GET_HELP_TOOL_DEF, GET_HELP_INPUT_SCHEMA, runHelpTool } from './aggregated-help/index.js';

describe('GET_HELP_TOOL_DEF', () => {
  it('has description with usage guidance', () => {
    expect(GET_HELP_TOOL_DEF.description).toContain('Use this when');
    expect(GET_HELP_TOOL_DEF.description).toContain('Do NOT use');
  });

  it('has readOnlyHint annotation set to true', () => {
    expect(GET_HELP_TOOL_DEF.annotations.readOnlyHint).toBe(true);
  });

  it('has idempotentHint annotation set to true', () => {
    expect(GET_HELP_TOOL_DEF.annotations.idempotentHint).toBe(true);
  });

  it('has title annotation', () => {
    expect(GET_HELP_TOOL_DEF.annotations.title).toBe('Get Tool Usage Help');
  });

  it('has openai/toolInvocation metadata', () => {
    expect(GET_HELP_TOOL_DEF._meta['openai/toolInvocation/invoking']).toBeDefined();
    expect(GET_HELP_TOOL_DEF._meta['openai/toolInvocation/invoked']).toBeDefined();
  });

  it('has openai/outputTemplate for widget', () => {
    expect(GET_HELP_TOOL_DEF._meta['openai/outputTemplate']).toBe(
      'ui://widget/oak-json-viewer.html',
    );
  });

  it('has openai/widgetAccessible set to true', () => {
    expect(GET_HELP_TOOL_DEF._meta['openai/widgetAccessible']).toBe(true);
  });

  it('has openai/visibility set to public', () => {
    expect(GET_HELP_TOOL_DEF._meta['openai/visibility']).toBe('public');
  });
});

describe('GET_HELP_INPUT_SCHEMA', () => {
  it('accepts optional tool_name parameter', () => {
    expect(GET_HELP_INPUT_SCHEMA.properties.tool_name).toBeDefined();
    expect(GET_HELP_INPUT_SCHEMA.properties.tool_name.type).toBe('string');
  });

  it('has no required fields', () => {
    expect('required' in GET_HELP_INPUT_SCHEMA).toBe(false);
  });
});

/**
 * Helper to parse JSON from CallToolResult text content.
 * Asserts that content is text type and parses the JSON.
 */
function parseResultJson(result: { content: readonly { type: string; text?: string }[] }): unknown {
  const content = result.content[0];
  expect(content.type).toBe('text');
  expect(content.text).toBeDefined();
  return JSON.parse(content.text ?? '{}');
}

describe('runHelpTool', () => {
  describe('without tool_name parameter', () => {
    it('returns server overview', () => {
      const result = runHelpTool({});
      expect(result.isError).toBeUndefined();
      const data = parseResultJson(result);
      expect(data).toHaveProperty('serverOverview');
    });

    it('returns tool categories', () => {
      const result = runHelpTool({});
      const data = parseResultJson(result);
      expect(data).toHaveProperty('toolCategories');
    });

    it('returns workflows', () => {
      const result = runHelpTool({});
      const data = parseResultJson(result);
      expect(data).toHaveProperty('workflows');
    });

    it('returns tips', () => {
      const result = runHelpTool({});
      const data = parseResultJson(result);
      expect(data).toHaveProperty('tips');
    });
  });

  describe('with tool_name parameter', () => {
    it('returns help for search tool', () => {
      const result = runHelpTool({ tool_name: 'search' });
      expect(result.isError).toBeUndefined();
      const data = parseResultJson(result);
      expect(data).toHaveProperty('tool');
      expect(data).toHaveProperty('category');
      expect(data).toHaveProperty('description');
    });

    it('returns help for fetch tool', () => {
      const result = runHelpTool({ tool_name: 'fetch' });
      expect(result.isError).toBeUndefined();
      const data = parseResultJson(result);
      expect(data).toHaveProperty('tool');
      const dataRecord = data as { tool: string };
      expect(dataRecord.tool).toBe('fetch');
    });

    it('returns help for get-threads tool', () => {
      const result = runHelpTool({ tool_name: 'get-threads' });
      expect(result.isError).toBeUndefined();
      const data = parseResultJson(result);
      expect(data).toHaveProperty('tool');
    });

    it('returns error for unknown tool', () => {
      const result = runHelpTool({ tool_name: 'unknown-tool' });
      expect(result.isError).toBe(true);
      const content = result.content[0];
      expect(content.type).toBe('text');
      // Narrow to text response type
      if (!('text' in content)) {
        throw new TypeError('Test: Expected text content, got blob');
      }
      expect(content.text).toContain('Unknown tool');
    });
  });
});
