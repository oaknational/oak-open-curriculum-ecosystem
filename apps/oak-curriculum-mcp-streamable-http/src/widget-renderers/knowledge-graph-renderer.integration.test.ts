/**
 * Integration tests for the Knowledge Graph renderer.
 *
 * These tests verify how the knowledge graph renderer integrates with
 * the widget system - ensuring it's properly registered and wired.
 *
 * Per testing-strategy.md, integration tests verify how code units work
 * together when imported - NOT running systems.
 *
 * @see knowledge-graph-renderer.ts - Renderer implementation
 * @see widget-renderer-registry.ts - Tool to renderer mapping
 * @see widget-renderers/index.ts - Renderer exports
 * @see testing-strategy.md - Integration test definitions
 */

import { describe, it, expect } from 'vitest';
import { WIDGET_RENDERER_FUNCTIONS, RENDERER_FUNCTION_NAMES } from './index.js';
import { TOOL_RENDERER_MAP, RENDERER_IDS } from '../widget-renderer-registry.js';
import { WIDGET_SCRIPT } from '../widget-script.js';

describe('Knowledge Graph renderer integration with widget system', () => {
  describe('renderer registry', () => {
    it('knowledgeGraph is a valid renderer ID', () => {
      expect(RENDERER_IDS).toContain('knowledgeGraph');
    });

    it('get-knowledge-graph tool maps to knowledgeGraph renderer', () => {
      expect(TOOL_RENDERER_MAP['get-knowledge-graph']).toBe('knowledgeGraph');
    });

    it('knowledgeGraph maps to renderKnowledgeGraph function', () => {
      expect(RENDERER_FUNCTION_NAMES.knowledgeGraph).toBe('renderKnowledgeGraph');
    });
  });

  describe('renderer function in combined output', () => {
    it('renderKnowledgeGraph function is included in combined renderer functions', () => {
      expect(WIDGET_RENDERER_FUNCTIONS).toContain('function renderKnowledgeGraph(data)');
    });

    it('SVG visualization is embedded in combined renderer functions', () => {
      expect(WIDGET_RENDERER_FUNCTIONS).toContain('const KNOWLEDGE_GRAPH_SVG');
    });

    it('visualization prompt is embedded in combined renderer functions', () => {
      expect(WIDGET_RENDERER_FUNCTIONS).toContain('const KNOWLEDGE_GRAPH_VIZ_PROMPT');
    });

    it('CTA initialization function is included', () => {
      expect(WIDGET_RENDERER_FUNCTIONS).toContain('function initKnowledgeGraphCta()');
    });
  });

  describe('renderer in widget script', () => {
    it('RENDERERS object includes knowledgeGraph entry', () => {
      expect(WIDGET_SCRIPT).toContain('knowledgeGraph: renderKnowledgeGraph');
    });

    it('renderKnowledgeGraph function is accessible via RENDERERS dispatch', () => {
      // The getRendererForTool function looks up TOOL_RENDERER_MAP
      // then finds the function in RENDERERS object
      expect(WIDGET_SCRIPT).toContain('TOOL_RENDERER_MAP[toolName]');
      expect(WIDGET_SCRIPT).toContain('RENDERERS[rendererId]');
    });

    it('calls initKnowledgeGraphCta after rendering knowledge graph', () => {
      // The widget script should call the CTA init function after rendering
      expect(WIDGET_SCRIPT).toContain('initKnowledgeGraphCta()');
    });
  });

  describe('renderer coherence', () => {
    it('renderer ID exists in both RENDERER_IDS and RENDERER_FUNCTION_NAMES', () => {
      expect(RENDERER_IDS).toContain('knowledgeGraph');
      expect(RENDERER_FUNCTION_NAMES).toHaveProperty('knowledgeGraph');
    });

    it('tool mapping points to valid renderer ID', () => {
      const rendererId = TOOL_RENDERER_MAP['get-knowledge-graph'];
      expect(RENDERER_IDS).toContain(rendererId);
    });

    it('function name in RENDERER_FUNCTION_NAMES matches actual function', () => {
      const functionName = RENDERER_FUNCTION_NAMES.knowledgeGraph;
      // The function should be defined in the combined output
      expect(WIDGET_RENDERER_FUNCTIONS).toContain(`function ${functionName}(`);
    });
  });
});
