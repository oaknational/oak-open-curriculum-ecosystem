/**
 * Unit tests for universal tool shared utilities.
 *
 * Tests the core formatting and serialisation functions used by all tools
 * (both aggregated and generated) for MCP response construction.
 */

import { describe, it, expect } from 'vitest';
import {
  formatData,
  formatError,
  formatOptimizedResult,
  formatUnknownTool,
  serialiseArg,
  toErrorMessage,
} from './universal-tool-shared.js';
import { McpToolError, McpParameterError } from './execute-tool-call.js';

describe('formatData', () => {
  describe('content field', () => {
    it('returns content array with JSON text', () => {
      const result = formatData({ status: 200, data: { name: 'test' } });

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'text',
        text: JSON.stringify({ status: 200, data: { name: 'test' } }),
      });
    });

    it('serialises bigint values to strings in content', () => {
      const result = formatData({ value: BigInt(123) });

      expect(result.content[0]).toEqual({
        type: 'text',
        text: '{"value":"123"}',
      });
    });
  });

  describe('structuredContent field (OpenAI Apps SDK support)', () => {
    it('includes structuredContent with object data for widget access via window.openai.toolOutput', () => {
      const data = { status: 200, data: { lessons: [] } };
      const result = formatData(data);

      expect(result.structuredContent).toEqual(data);
    });

    it('wraps primitive values in a data object for structuredContent', () => {
      const result = formatData('hello');

      expect(result.structuredContent).toEqual({ data: 'hello' });
    });

    it('wraps array values in a data object for structuredContent', () => {
      const result = formatData([1, 2, 3]);

      expect(result.structuredContent).toEqual({ data: [1, 2, 3] });
    });

    it('wraps null values in a data object for structuredContent', () => {
      const result = formatData(null);

      expect(result.structuredContent).toEqual({ data: null });
    });

    it('serialises bigint in structuredContent', () => {
      const result = formatData({ value: BigInt(456) });

      expect(result.structuredContent).toEqual({ value: '456' });
    });
  });

  it('does not set isError flag', () => {
    const result = formatData({ ok: true });

    expect(result.isError).toBeUndefined();
  });
});

describe('formatError', () => {
  it('returns content with error message', () => {
    const result = formatError('Something went wrong');

    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toEqual({
      type: 'text',
      text: 'Something went wrong',
    });
  });

  it('sets isError flag to true', () => {
    const result = formatError('Error');

    expect(result.isError).toBe(true);
  });
});

describe('formatUnknownTool', () => {
  it('formats string tool name in error message', () => {
    const result = formatUnknownTool('unknown-tool-name');

    expect(result.isError).toBe(true);
    expect(result.content[0]).toEqual({
      type: 'text',
      text: 'Unknown tool: unknown-tool-name',
    });
  });

  it('formats generic error for non-string values', () => {
    const result = formatUnknownTool(123);

    expect(result.isError).toBe(true);
    expect(result.content[0]).toEqual({
      type: 'text',
      text: 'Unknown tool',
    });
  });
});

describe('serialiseArg', () => {
  it('converts bigint to string', () => {
    expect(serialiseArg(BigInt(999))).toBe('999');
  });

  it('recursively serialises arrays', () => {
    expect(serialiseArg([BigInt(1), BigInt(2)])).toEqual(['1', '2']);
  });

  it('recursively serialises object values', () => {
    expect(serialiseArg({ a: BigInt(1), b: { c: BigInt(2) } })).toEqual({
      a: '1',
      b: { c: '2' },
    });
  });

  it('passes through primitive values unchanged', () => {
    expect(serialiseArg('hello')).toBe('hello');
    expect(serialiseArg(42)).toBe(42);
    expect(serialiseArg(true)).toBe(true);
    expect(serialiseArg(null)).toBe(null);
  });
});

describe('toErrorMessage', () => {
  it('extracts message from McpToolError', () => {
    const error = new McpToolError('Tool failed', 'test-tool');
    expect(toErrorMessage(error)).toBe('Tool failed');
  });

  it('extracts message from McpParameterError', () => {
    const error = new McpParameterError('Invalid param', 'test-tool');
    expect(toErrorMessage(error)).toBe('Invalid param');
  });

  it('extracts message from generic Error', () => {
    const error = new Error('Generic error');
    expect(toErrorMessage(error)).toBe('Generic error');
  });

  it('returns "Unknown error" for Error with empty message', () => {
    const error = new Error('');
    expect(toErrorMessage(error)).toBe('Unknown error');
  });

  it('returns string values directly', () => {
    expect(toErrorMessage('Direct string')).toBe('Direct string');
  });

  it('converts number to string', () => {
    expect(toErrorMessage(404)).toBe('404');
  });

  it('converts boolean to string', () => {
    expect(toErrorMessage(false)).toBe('false');
  });

  it('returns "Unknown error" for other types', () => {
    expect(toErrorMessage({})).toBe('Unknown error');
    expect(toErrorMessage([])).toBe('Unknown error');
  });
});

describe('formatOptimizedResult', () => {
  describe('_meta field (widget-only data)', () => {
    it('includes _meta with full data for widget access via window.openai.toolResponseMetadata', () => {
      const fullData = {
        lessons: [
          { id: '1', title: 'Lesson 1' },
          { id: '2', title: 'Lesson 2' },
          { id: '3', title: 'Lesson 3' },
        ],
        totalCount: 3,
      };

      const result = formatOptimizedResult({
        summary: 'Found 3 lessons',
        fullData,
      });

      expect(result._meta).toEqual({
        fullResults: fullData,
        context:
          'If you have not already, use the get-help and get-ontology tools to understand the Oak context',
      });
    });

    it('includes query and timestamp in _meta when provided', () => {
      const result = formatOptimizedResult({
        summary: 'Results for search',
        fullData: { items: [] },
        query: 'photosynthesis',
        timestamp: 1700000000000,
      });

      expect(result._meta).toEqual({
        fullResults: { items: [] },
        query: 'photosynthesis',
        timestamp: 1700000000000,
        context:
          'If you have not already, use the get-help and get-ontology tools to understand the Oak context',
      });
    });

    it('includes toolName in _meta when provided', () => {
      const result = formatOptimizedResult({
        summary: 'Found lessons',
        fullData: { lessons: [] },
        toolName: 'get-search-lessons',
      });

      expect(result._meta).toHaveProperty('toolName', 'get-search-lessons');
    });

    it('includes annotationsTitle in _meta when provided', () => {
      const result = formatOptimizedResult({
        summary: 'Found lessons',
        fullData: { lessons: [] },
        annotationsTitle: 'Search Lessons',
      });

      expect(result._meta).toHaveProperty('annotations/title', 'Search Lessons');
    });

    it('includes all metadata fields together in _meta', () => {
      const result = formatOptimizedResult({
        summary: 'Found lessons',
        fullData: { lessons: [] },
        toolName: 'get-search-lessons',
        annotationsTitle: 'Search Lessons',
        query: 'cats',
        timestamp: 1700000000000,
      });

      expect(result._meta).toEqual({
        fullResults: { lessons: [] },
        toolName: 'get-search-lessons',
        'annotations/title': 'Search Lessons',
        query: 'cats',
        timestamp: 1700000000000,
        context:
          'If you have not already, use the get-help and get-ontology tools to understand the Oak context',
      });
    });

    it('always includes context guidance string in _meta', () => {
      const result = formatOptimizedResult({
        summary: 'Basic result',
        fullData: {},
      });

      expect(result._meta).toHaveProperty(
        'context',
        'If you have not already, use the get-help and get-ontology tools to understand the Oak context',
      );
    });
  });

  describe('structuredContent field (model + widget minimal data)', () => {
    it('includes structuredContent with summary for model reasoning', () => {
      const result = formatOptimizedResult({
        summary: 'Found 10 lessons matching your query',
        fullData: { lessons: [] },
      });

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toHaveProperty('summary');
      expect(result.structuredContent).toEqual(
        expect.objectContaining({ summary: 'Found 10 lessons matching your query' }),
      );
    });

    it('includes preview items limited to 5 in structuredContent', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({
        id: String(i + 1),
        title: `Item ${String(i + 1)}`,
      }));

      const result = formatOptimizedResult({
        summary: 'Found 10 items',
        fullData: { items },
        previewItems: items,
      });

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toEqual(
        expect.objectContaining({
          previewItems: items.slice(0, 5),
        }),
      );
    });

    it('includes hasMore flag when items exceed 5', () => {
      const items = Array.from({ length: 10 }, (_, i) => ({ id: String(i + 1) }));

      const result = formatOptimizedResult({
        summary: 'Found 10 items',
        fullData: { items },
        previewItems: items,
      });

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toEqual(expect.objectContaining({ hasMore: true }));
    });

    it('sets hasMore to false when items are 5 or fewer', () => {
      const items = Array.from({ length: 3 }, (_, i) => ({ id: String(i + 1) }));

      const result = formatOptimizedResult({
        summary: 'Found 3 items',
        fullData: { items },
        previewItems: items,
      });

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toEqual(expect.objectContaining({ hasMore: false }));
    });

    it('includes status in structuredContent', () => {
      const result = formatOptimizedResult({
        summary: 'Success',
        fullData: {},
        status: 'success',
      });

      expect(result.structuredContent).toBeDefined();
      expect(result.structuredContent).toEqual(expect.objectContaining({ status: 'success' }));
    });
  });

  describe('content field (human-readable text)', () => {
    it('returns content array with human-readable text', () => {
      const result = formatOptimizedResult({
        summary: 'Found 5 lessons on photosynthesis',
        fullData: {},
      });

      expect(result.content).toHaveLength(1);
      expect(result.content[0]).toEqual({
        type: 'text',
        text: 'Found 5 lessons on photosynthesis',
      });
    });
  });

  describe('serialisation', () => {
    it('serialises bigint values in fullData', () => {
      const result = formatOptimizedResult({
        summary: 'Data with bigint',
        fullData: { count: BigInt(999) },
      });

      expect(result._meta?.fullResults).toEqual({ count: '999' });
    });
  });

  it('does not set isError flag', () => {
    const result = formatOptimizedResult({
      summary: 'OK',
      fullData: {},
    });

    expect(result.isError).toBeUndefined();
  });
});
