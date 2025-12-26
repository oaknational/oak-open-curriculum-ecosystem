/**
 * Unit tests for universal tool shared utilities.
 *
 * Tests the core formatting and serialisation functions used by all tools
 * (both aggregated and generated) for MCP response construction.
 */

import { describe, it, expect } from 'vitest';
import {
  formatData,
  formatDataWithContext,
  formatError,
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

describe('formatDataWithContext', () => {
  it('includes oakContextHint in structuredContent when includeContextHint is true', () => {
    const result = formatDataWithContext({
      status: 200,
      data: { items: [] },
      includeContextHint: true,
    });

    expect(result.structuredContent).toBeDefined();
    const hint = (result.structuredContent as { oakContextHint?: string }).oakContextHint;
    expect(hint).toContain('get-ontology');
    expect(hint).toContain('get-help');
  });

  it('does NOT include oakContextHint when includeContextHint is false', () => {
    const result = formatDataWithContext({
      status: 200,
      data: { items: [] },
      includeContextHint: false,
    });

    expect(result.structuredContent).toBeDefined();
    expect(result.structuredContent).not.toHaveProperty('oakContextHint');
  });

  it('returns content with JSON data like formatData', () => {
    const result = formatDataWithContext({
      status: 200,
      data: { name: 'test' },
      includeContextHint: true,
    });

    expect(result.content).toHaveLength(1);
    expect(result.content[0]).toEqual({
      type: 'text',
      text: JSON.stringify({ status: 200, data: { name: 'test' } }),
    });
  });

  it('does not set isError flag', () => {
    const result = formatDataWithContext({
      status: 200,
      data: {},
      includeContextHint: true,
    });

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
