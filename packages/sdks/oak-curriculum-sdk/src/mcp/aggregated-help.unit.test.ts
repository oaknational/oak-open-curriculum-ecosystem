/**
 * Unit tests for get-help aggregated tool.
 *
 * The get-help tool returns structured guidance about how to use the
 * Oak Curriculum MCP server's tools effectively.
 */

import { describe, it, expect } from 'vitest';
import { GET_HELP_TOOL_DEF, GET_HELP_INPUT_SCHEMA, runHelpTool } from './aggregated-help/index.js';
import { WIDGET_URI } from '@oaknational/sdk-codegen/widget-constants';
import { AGGREGATED_TOOL_DEFS } from './universal-tools/definitions.js';
import { typeSafeKeys } from '../types/helpers/type-helpers.js';

describe('GET_HELP_TOOL_DEF', () => {
  it('has description with usage guidance', () => {
    expect(GET_HELP_TOOL_DEF.description).toContain('Use this when');
    expect(GET_HELP_TOOL_DEF.description).toContain('Do NOT use');
  });

  it('has description mentioning "understand Oak"', () => {
    expect(GET_HELP_TOOL_DEF.description).toMatch(/understand oak/i);
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
    expect(GET_HELP_TOOL_DEF._meta['openai/outputTemplate']).toBe(WIDGET_URI);
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

import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

/** Type alias to reference SDK's structuredContent type without direct Record usage */
type StructuredContent = NonNullable<CallToolResult['structuredContent']>;

/**
 * Helper to extract full data from structuredContent (model sees this).
 * Per OpenAI Apps SDK: structuredContent is "Surfaced to the model and the component".
 */
function extractStructuredData(result: {
  structuredContent?: StructuredContent;
}): StructuredContent {
  expect(result.structuredContent).toBeDefined();
  return result.structuredContent ?? {};
}

/**
 * Tests per OpenAI Apps SDK reference (https://developers.openai.com/apps-sdk/reference#tool-results):
 * - structuredContent: Model AND widget see this (full data for reasoning)
 * - content: Model AND widget see this (human-readable summary)
 * - _meta: Widget ONLY (model never sees this)
 */
describe('runHelpTool', () => {
  describe('without tool_name parameter', () => {
    it('returns server overview in structuredContent (model sees this)', () => {
      const result = runHelpTool({});
      expect(result.isError).toBeUndefined();
      const data = extractStructuredData(result);
      expect(data).toHaveProperty('serverOverview');
    });

    it('returns tool categories in structuredContent', () => {
      const result = runHelpTool({});
      const data = extractStructuredData(result);
      expect(data).toHaveProperty('toolCategories');
    });

    it('returns workflows in structuredContent', () => {
      const result = runHelpTool({});
      const data = extractStructuredData(result);
      expect(data).toHaveProperty('workflows');
    });

    it('returns tips in structuredContent', () => {
      const result = runHelpTool({});
      const data = extractStructuredData(result);
      expect(data).toHaveProperty('tips');
    });

    it('returns human-readable summary in content', () => {
      const result = runHelpTool({});
      expect(result.content[0]).toHaveProperty('type', 'text');
      const firstContent = result.content[0];
      if ('text' in firstContent) {
        // Content is human-readable summary for conversation display
        expect(firstContent.text).toContain('guidance');
      }
    });
  });

  describe('with tool_name parameter', () => {
    it('returns help for search tool in structuredContent', () => {
      const result = runHelpTool({ tool_name: 'search' });
      expect(result.isError).toBeUndefined();
      const data = extractStructuredData(result);
      expect(data).toHaveProperty('tool');
      expect(data).toHaveProperty('category');
      expect(data).toHaveProperty('description');
    });

    it('returns help for fetch tool in structuredContent', () => {
      const result = runHelpTool({ tool_name: 'fetch' });
      expect(result.isError).toBeUndefined();
      const data = extractStructuredData(result);
      expect(data).toHaveProperty('tool');
    });

    it('returns help for get-threads tool in structuredContent', () => {
      const result = runHelpTool({ tool_name: 'get-threads' });
      expect(result.isError).toBeUndefined();
      const data = extractStructuredData(result);
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

    it('returns help for every aggregated tool (drift detection)', () => {
      const toolNames = typeSafeKeys(AGGREGATED_TOOL_DEFS);
      for (const name of toolNames) {
        const result = runHelpTool({ tool_name: name });
        expect(result.isError).toBeUndefined();
      }
    });
  });
});
