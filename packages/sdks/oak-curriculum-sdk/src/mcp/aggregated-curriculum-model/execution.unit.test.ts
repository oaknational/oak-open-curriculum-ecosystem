/**
 * Unit tests for get-curriculum-model tool execution.
 *
 * Tests the runCurriculumModelTool function that combines ontology
 * data and tool guidance into a single orientation response.
 */

import { describe, it, expect } from 'vitest';
import { runCurriculumModelTool } from './execution.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

type StructuredContent = NonNullable<CallToolResult['structuredContent']>;

function extractStructuredData(result: {
  structuredContent?: StructuredContent;
}): StructuredContent {
  expect(result.structuredContent).toBeDefined();
  return result.structuredContent ?? {};
}

describe('runCurriculumModelTool', () => {
  describe('without tool_name', () => {
    it('returns CallToolResult with structuredContent', () => {
      const result = runCurriculumModelTool({});
      expect(result.isError).toBeUndefined();
      expect(result.structuredContent).toBeDefined();
    });

    it('returns domainModel in structuredContent', () => {
      const result = runCurriculumModelTool({});
      const data = extractStructuredData(result);
      expect(data).toHaveProperty('domainModel');
    });

    it('returns toolGuidance in structuredContent', () => {
      const result = runCurriculumModelTool({});
      const data = extractStructuredData(result);
      expect(data).toHaveProperty('toolGuidance');
    });

    it('returns human-readable summary in content', () => {
      const result = runCurriculumModelTool({});
      expect(result.content[0]).toHaveProperty('type', 'text');
      const firstContent = result.content[0];
      if ('text' in firstContent) {
        expect(firstContent.text).toMatch(/curriculum/i);
      }
    });
  });

  describe('with tool_name', () => {
    it('includes tool-specific help for known tool', () => {
      const result = runCurriculumModelTool({ tool_name: 'search' });
      const data = extractStructuredData(result);
      expect(data).toHaveProperty('toolSpecificHelp');
    });

    it('handles unknown tool gracefully', () => {
      const result = runCurriculumModelTool({ tool_name: 'nonexistent-tool' });
      expect(result.isError).toBeUndefined();
    });
  });

  describe('idempotency', () => {
    it('returns identical data on repeated calls', () => {
      const first = runCurriculumModelTool({});
      const second = runCurriculumModelTool({});
      expect(first.structuredContent).toEqual(second.structuredContent);
    });
  });
});
