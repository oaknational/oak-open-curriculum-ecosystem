/**
 * Unit tests for the get-misconception-graph tool definition.
 *
 * @remarks
 * These tests verify the BEHAVIOUR of the tool definition and execution function.
 * They do NOT test the generated data itself (that's validated at generation time).
 *
 * @see ADR-086 for extraction methodology
 * @see ADR-157 for multi-source integration context
 */

import { describe, it, expect } from 'vitest';
import {
  GET_MISCONCEPTION_GRAPH_TOOL_DEF,
  runMisconceptionGraphTool,
} from './aggregated-misconception-graph.js';

describe('GET_MISCONCEPTION_GRAPH_TOOL_DEF', () => {
  it('has description explaining the graph purpose', () => {
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).toContain('misconception');
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).toContain('teacher');
  });

  it('does not include prerequisite guidance (graph tools are loaded as needed, not prerequisites)', () => {
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).not.toContain(
      'You MUST call `get-curriculum-model` first',
    );
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.description).not.toContain(
      'You MUST call this tool before using other curriculum tools',
    );
  });

  it('has annotations marking it as read-only and idempotent', () => {
    expect(GET_MISCONCEPTION_GRAPH_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  });
});

describe('runMisconceptionGraphTool', () => {
  it('returns a valid CallToolResult structure', () => {
    const result = runMisconceptionGraphTool();

    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);

    expect(result).toHaveProperty('structuredContent');
    expect(result.structuredContent).toBeDefined();
  });
});
