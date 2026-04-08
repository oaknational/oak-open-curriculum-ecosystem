/**
 * Unit tests for the get-prerequisite-graph tool definition.
 *
 * @remarks
 * These tests verify the BEHAVIOUR of the tool definition and execution function.
 * They do NOT test the generated data itself (that's validated at generation time).
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for extraction methodology
 */

import { describe, it, expect } from 'vitest';
import {
  GET_PREREQUISITE_GRAPH_TOOL_DEF,
  runPrerequisiteGraphTool,
} from './aggregated-prerequisite-graph.js';

describe('GET_PREREQUISITE_GRAPH_TOOL_DEF', () => {
  it('has description explaining the graph purpose', () => {
    expect(GET_PREREQUISITE_GRAPH_TOOL_DEF.description).toContain('prerequisite graph');
    expect(GET_PREREQUISITE_GRAPH_TOOL_DEF.description).toContain('prior knowledge');
  });

  it('references get-curriculum-model as the prerequisite, not itself', () => {
    expect(GET_PREREQUISITE_GRAPH_TOOL_DEF.description).toContain(
      'You MUST call `get-curriculum-model` first',
    );
    expect(GET_PREREQUISITE_GRAPH_TOOL_DEF.description).not.toContain(
      'You MUST call this tool before using other curriculum tools',
    );
  });

  it('has annotations marking it as read-only and idempotent', () => {
    expect(GET_PREREQUISITE_GRAPH_TOOL_DEF.annotations).toEqual({
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    });
  });
});

describe('runPrerequisiteGraphTool', () => {
  it('returns a valid CallToolResult structure', () => {
    const result = runPrerequisiteGraphTool();

    // Verify MCP protocol structure
    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content.length).toBeGreaterThan(0);

    // Verify structured content exists (AI model needs this)
    expect(result).toHaveProperty('structuredContent');
    expect(result.structuredContent).toBeDefined();
  });

  it('includes summary text in content', () => {
    const result = runPrerequisiteGraphTool();
    const textContent = result.content[0];

    expect(textContent).toHaveProperty('type', 'text');
    expect(textContent).toHaveProperty('text');
  });
});
