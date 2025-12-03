/**
 * Unit tests for the Knowledge Graph renderer.
 *
 * These tests verify the pure functions and static content that generate
 * the knowledge graph visualization HTML and JavaScript.
 *
 * @see knowledge-graph-renderer.ts - Source module
 * @see testing-strategy.md - Unit test definitions
 */

import { describe, it, expect } from 'vitest';
import {
  KNOWLEDGE_GRAPH_RENDERER,
  KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT,
} from './knowledge-graph-renderer.js';

describe('KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT', () => {
  it('instructs the agent to read the knowledge graph JSON', () => {
    expect(KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT).toContain('knowledge graph JSON');
  });

  it('requests a network diagram visualization', () => {
    expect(KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT).toContain('network diagram');
  });

  it('mentions professional teachers as the audience', () => {
    expect(KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT).toContain('professional teachers');
  });

  it('requests grouping by category', () => {
    expect(KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT).toContain('category');
    expect(KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT).toContain('structure');
    expect(KNOWLEDGE_GRAPH_VISUALIZATION_PROMPT).toContain('content');
  });
});

describe('KNOWLEDGE_GRAPH_RENDERER', () => {
  describe('SVG visualization', () => {
    it('contains an SVG element', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('<svg');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('</svg>');
    });

    it('has a viewBox for responsive sizing', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('viewBox=');
    });

    it('contains circle nodes', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('<circle');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('class="node"');
    });

    it('contains line edges', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('<line');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('class="edge"');
    });

    it('includes labels for core curriculum concepts', () => {
      // Core structure nodes should have labels
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('>Subject<');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('>Sequence<');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('>Unit<');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('>Lesson<');
    });

    it('includes labels for context concepts', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('>Phase<');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('>KeyStage<');
    });

    it('distinguishes inferred edges with dashed style', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('edge-inferred');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('stroke-dasharray');
    });
  });

  describe('renderKnowledgeGraph function', () => {
    it('defines the renderKnowledgeGraph function', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('function renderKnowledgeGraph(data)');
    });

    it('renders a header section', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Oak Knowledge Graph');
    });

    it('displays graph statistics when data is available', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('data?.concepts');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('data?.edges');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('conceptCount');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('edgeCount');
    });

    it('shows explicit vs inferred edge counts', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Explicit:');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Inferred:');
    });
  });

  describe('visualization CTA button', () => {
    it('includes a CTA button element', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('id="kg-viz-cta-btn"');
    });

    it('applies the cta-btn class', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('class="cta-btn"');
    });

    it('has "Visualize Oak Knowledge Graph" label', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Visualize Oak Knowledge Graph');
    });

    it('includes initialization function for the CTA', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('function initKnowledgeGraphCta()');
    });

    it('calls sendFollowUpMessage with visualization prompt', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain(
        'window.openai.sendFollowUpMessage({ prompt: KNOWLEDGE_GRAPH_VIZ_PROMPT })',
      );
    });

    it('includes loading state during visualization request', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('btn.disabled = true');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('Generating visualization');
    });

    it('includes error recovery', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('catch (error)');
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('btn.disabled = false');
    });
  });

  describe('empty state', () => {
    it('returns empty state message when no data', () => {
      expect(KNOWLEDGE_GRAPH_RENDERER).toContain('No knowledge graph data available');
    });
  });
});
