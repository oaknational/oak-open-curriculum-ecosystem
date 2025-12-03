/**
 * Unit tests for the get-knowledge-graph tool definition.
 *
 * TDD: These tests are written FIRST to specify the expected tool structure.
 * Run this file before implementation to confirm RED phase.
 *
 * @module aggregated-knowledge-graph.unit.test
 */

import { describe, it, expect } from 'vitest';
import {
  GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA,
  GET_KNOWLEDGE_GRAPH_TOOL_DEF,
  runKnowledgeGraphTool,
} from './aggregated-knowledge-graph.js';

describe('GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA', () => {
  it('is an object type', () => {
    expect(GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA.type).toBe('object');
  });

  it('has no properties (no parameters)', () => {
    expect(GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA.properties).toEqual({});
  });

  it('disallows additional properties', () => {
    expect(GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA.additionalProperties).toBe(false);
  });
});

describe('GET_KNOWLEDGE_GRAPH_TOOL_DEF', () => {
  it('has description mentioning concept relationships', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('concept');
  });

  it('has description referencing get-ontology', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF.description).toContain('get-ontology');
  });

  it('has readOnlyHint annotation set to true', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF.annotations.readOnlyHint).toBe(true);
  });

  it('has idempotentHint annotation set to true', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF.annotations.idempotentHint).toBe(true);
  });

  it('has inputSchema matching GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF.inputSchema).toEqual(GET_KNOWLEDGE_GRAPH_INPUT_SCHEMA);
  });

  it('has OpenAI widget metadata', () => {
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF._meta).toBeDefined();
    expect(GET_KNOWLEDGE_GRAPH_TOOL_DEF._meta['openai/outputTemplate']).toBeDefined();
  });
});

describe('runKnowledgeGraphTool', () => {
  it('returns CallToolResult structure with content array', () => {
    const result = runKnowledgeGraphTool();
    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
  });

  it('has text content with summary', () => {
    const result = runKnowledgeGraphTool();
    const textContent = result.content[0];
    expect(textContent).toHaveProperty('type', 'text');
    expect(textContent).toHaveProperty('text');
  });

  it('has structuredContent containing the graph', () => {
    const result = runKnowledgeGraphTool();
    expect(result.structuredContent).toHaveProperty('version');
    expect(result.structuredContent).toHaveProperty('concepts');
    expect(result.structuredContent).toHaveProperty('edges');
    expect(result.structuredContent).toHaveProperty('seeOntology');
  });

  it('has structuredContent.concepts as array', () => {
    const result = runKnowledgeGraphTool();
    expect(result.structuredContent).toBeDefined();
    if (result.structuredContent) {
      expect(Array.isArray(result.structuredContent.concepts)).toBe(true);
    }
  });

  it('has structuredContent.edges as array', () => {
    const result = runKnowledgeGraphTool();
    expect(result.structuredContent).toBeDefined();
    if (result.structuredContent) {
      expect(Array.isArray(result.structuredContent.edges)).toBe(true);
    }
  });

  it('has _meta with toolName', () => {
    const result = runKnowledgeGraphTool();
    expect(result._meta).toHaveProperty('toolName', 'get-knowledge-graph');
  });

  it('structuredContent.seeOntology contains get-ontology reference', () => {
    const result = runKnowledgeGraphTool();
    expect(result.structuredContent).toBeDefined();
    if (result.structuredContent) {
      expect(result.structuredContent.seeOntology).toContain('get-ontology');
    }
  });

  it('returns identical data on repeated calls (idempotent)', () => {
    const first = runKnowledgeGraphTool();
    const second = runKnowledgeGraphTool();
    expect(first.structuredContent).toEqual(second.structuredContent);
  });
});
