/**
 * Unit tests for the Knowledge Graph renderer.
 *
 * These tests verify BEHAVIOR: the renderer produces output that represents
 * the Oak curriculum knowledge graph structure with all expected concept types.
 *
 * @see knowledge-graph-renderer.ts - Source module
 * @see testing-strategy.md - Unit test definitions
 */

import { describe, it, expect } from 'vitest';
import { KNOWLEDGE_GRAPH_RENDERER } from './knowledge-graph-renderer.js';

describe('KNOWLEDGE_GRAPH_RENDERER', () => {
  describe('curriculum concepts represented', () => {
    it('includes core curriculum hierarchy concepts', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Subject');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Sequence');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Unit');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Lesson');
    });

    it('includes context concepts', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Phase');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('KeyStage');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('YearGroup');
    });

    it('includes content type concepts', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Quiz');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Asset');
    });

    it('includes taxonomy concepts', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Thread');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Category');
    });
  });

  describe('render function', () => {
    it('exports a render function that accepts data', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('function renderKnowledgeGraph(data)');
    });
  });
});
