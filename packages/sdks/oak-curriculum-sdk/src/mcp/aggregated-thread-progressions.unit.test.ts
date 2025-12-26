/**
 * Unit tests for the get-thread-progressions tool definition.
 *
 * @remarks
 * These tests verify the BEHAVIOUR of the tool definition and execution function.
 * They do NOT test the generated data itself (that's validated at generation time).
 *
 * @see {@link https://github.com/oaknationalacademy/oak-notion-mcp/blob/main/docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md | ADR-086} for extraction methodology
 */

import { describe, it, expect } from 'vitest';
import {
  GET_THREAD_PROGRESSIONS_INPUT_SCHEMA,
  GET_THREAD_PROGRESSIONS_TOOL_DEF,
  runThreadProgressionsTool,
} from './aggregated-thread-progressions.js';

describe('GET_THREAD_PROGRESSIONS_INPUT_SCHEMA', () => {
  it('is an object type with no parameters', () => {
    expect(GET_THREAD_PROGRESSIONS_INPUT_SCHEMA).toEqual({
      type: 'object',
      properties: {},
      additionalProperties: false,
    });
  });
});

describe('GET_THREAD_PROGRESSIONS_TOOL_DEF', () => {
  it('has description explaining the graph purpose', () => {
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).toContain('thread');
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).toContain('learning path');
  });

  it('has annotations marking it as read-only and idempotent', () => {
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
      title: 'Get Thread Progressions',
    });
  });

  it('references the input schema', () => {
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.inputSchema).toBe(GET_THREAD_PROGRESSIONS_INPUT_SCHEMA);
  });
});

describe('runThreadProgressionsTool', () => {
  it('returns a valid CallToolResult structure', () => {
    const result = runThreadProgressionsTool();

    // Verify MCP protocol structure
    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);

    // Verify structured content exists (AI model needs this)
    expect(result).toHaveProperty('structuredContent');
    expect(result.structuredContent).toBeDefined();
  });

  it('includes summary text in content', () => {
    const result = runThreadProgressionsTool();
    const textContent = result.content[0];

    expect(textContent).toHaveProperty('type', 'text');
    expect(textContent).toHaveProperty('text');
  });

  it('is idempotent - returns identical data on repeated calls', () => {
    const first = runThreadProgressionsTool();
    const second = runThreadProgressionsTool();
    expect(first.structuredContent).toEqual(second.structuredContent);
  });
});
