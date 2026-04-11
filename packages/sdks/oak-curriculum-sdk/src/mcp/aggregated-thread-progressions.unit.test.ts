/**
 * Unit tests for the get-thread-progressions tool definition.
 *
 * @remarks
 * These tests verify the BEHAVIOUR of the tool definition and execution function.
 * They do NOT test the generated data itself (that's validated at generation time).
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */

import { describe, it, expect } from 'vitest';
import {
  GET_THREAD_PROGRESSIONS_TOOL_DEF,
  runThreadProgressionsTool,
} from './aggregated-thread-progressions.js';

describe('GET_THREAD_PROGRESSIONS_TOOL_DEF', () => {
  it('has description explaining the graph purpose', () => {
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).toContain('thread');
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).toContain('learning path');
  });

  it('does not include prerequisite guidance (graph tools are loaded as needed, not prerequisites)', () => {
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).not.toContain(
      'You MUST call `get-curriculum-model` first',
    );
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.description).not.toContain(
      'You MUST call this tool before using other curriculum tools',
    );
  });

  it('has annotations marking it as read-only and idempotent', () => {
    expect(GET_THREAD_PROGRESSIONS_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
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
});
