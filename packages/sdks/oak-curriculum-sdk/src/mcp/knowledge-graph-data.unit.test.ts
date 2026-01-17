/**
 * Unit tests for knowledge graph data structure.
 *
 * TDD: These tests are written FIRST to specify the expected structure.
 * Run this file before implementation to confirm RED phase.
 */

import { describe, it, expect } from 'vitest';
import { conceptGraph } from './knowledge-graph-data.js';
import { ontologyData } from './ontology-data.js';

describe('conceptGraph', () => {
  describe('structure', () => {
    it('has version string matching semver format', () => {
      expect(conceptGraph.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('has concepts array with at least 25 items', () => {
      expect(conceptGraph.concepts.length).toBeGreaterThanOrEqual(25);
    });

    it('has edges array with at least 40 items', () => {
      expect(conceptGraph.edges.length).toBeGreaterThanOrEqual(40);
    });

    it('has seeOntology cross-reference containing get-ontology', () => {
      expect(conceptGraph.seeOntology).toContain('get-ontology');
    });
  });

  describe('concepts', () => {
    it('each concept has non-empty required fields: id, label, brief, category', () => {
      for (const concept of conceptGraph.concepts) {
        expect(concept.id.length).toBeGreaterThan(0);
        expect(concept.label.length).toBeGreaterThan(0);
        expect(concept.brief.length).toBeGreaterThan(0);
        expect(concept.category.length).toBeGreaterThan(0);
      }
    });

    it('concept IDs are unique', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    it('includes core structure concepts', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      expect(ids).toContain('subject');
      expect(ids).toContain('sequence');
      expect(ids).toContain('unit');
      expect(ids).toContain('lesson');
    });

    it('includes context concepts', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      expect(ids).toContain('phase');
      expect(ids).toContain('keystage');
      expect(ids).toContain('yeargroup');
    });

    it('includes taxonomy concepts', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      expect(ids).toContain('thread');
      expect(ids).toContain('category');
    });

    it('includes KS4 complexity concepts', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      expect(ids).toContain('programme');
      expect(ids).toContain('tier');
      expect(ids).toContain('pathway');
      expect(ids).toContain('examboard');
      expect(ids).toContain('examsubject');
    });

    it('includes content concepts', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      expect(ids).toContain('quiz');
      expect(ids).toContain('question');
      expect(ids).toContain('answer');
      expect(ids).toContain('asset');
      expect(ids).toContain('transcript');
    });

    it('includes metadata concepts', () => {
      const ids = conceptGraph.concepts.map((c) => c.id);
      expect(ids).toContain('keyword');
      expect(ids).toContain('misconception');
      expect(ids).toContain('contentguidance');
    });
  });

  describe('edges', () => {
    it('each edge has non-empty required fields: from, to, rel', () => {
      for (const edge of conceptGraph.edges) {
        expect(edge.from.length).toBeGreaterThan(0);
        expect(edge.to.length).toBeGreaterThan(0);
        expect(edge.rel.length).toBeGreaterThan(0);
      }
    });

    it('all edge from references are valid concept IDs', () => {
      const validIds = new Set(conceptGraph.concepts.map((c) => c.id));
      for (const edge of conceptGraph.edges) {
        expect(validIds.has(edge.from)).toBe(true);
      }
    });

    it('all edge to references are valid concept IDs', () => {
      const validIds = new Set(conceptGraph.concepts.map((c) => c.id));
      for (const edge of conceptGraph.edges) {
        expect(validIds.has(edge.to)).toBe(true);
      }
    });

    it('includes core hierarchy edges', () => {
      const hasEdge = (from: string, to: string): boolean =>
        conceptGraph.edges.some((e) => e.from === from && e.to === to);

      expect(hasEdge('subject', 'sequence')).toBe(true);
      expect(hasEdge('sequence', 'unit')).toBe(true);
      expect(hasEdge('unit', 'lesson')).toBe(true);
    });

    it('includes content hierarchy edges', () => {
      const hasEdge = (from: string, to: string): boolean =>
        conceptGraph.edges.some((e) => e.from === from && e.to === to);

      expect(hasEdge('lesson', 'quiz')).toBe(true);
      expect(hasEdge('quiz', 'question')).toBe(true);
      expect(hasEdge('question', 'answer')).toBe(true);
    });

    it('has at least 15 inferred edges marked with inferred: true', () => {
      const inferredEdges = conceptGraph.edges.filter((e) => 'inferred' in e);
      expect(inferredEdges.length).toBeGreaterThanOrEqual(15);
    });

    it('inferred edges include unit context relationships', () => {
      const inferredEdges = conceptGraph.edges.filter((e) => 'inferred' in e);
      const hasInferredEdge = (from: string, to: string): boolean =>
        inferredEdges.some((e) => e.from === from && e.to === to);

      expect(hasInferredEdge('unit', 'subject')).toBe(true);
      expect(hasInferredEdge('unit', 'keystage')).toBe(true);
    });

    it('inferred edges include programme relationships', () => {
      const inferredEdges = conceptGraph.edges.filter((e) => 'inferred' in e);
      const hasInferredEdge = (from: string, to: string): boolean =>
        inferredEdges.some((e) => e.from === from && e.to === to);

      expect(hasInferredEdge('programme', 'sequence')).toBe(true);
      expect(hasInferredEdge('programme', 'subject')).toBe(true);
    });
  });

  describe('size constraints', () => {
    it('is within token budget (JSON size < 8000 bytes)', () => {
      const json = JSON.stringify(conceptGraph);
      expect(json.length).toBeLessThan(8000);
    });

    it('estimated tokens is under 2500', () => {
      const json = JSON.stringify(conceptGraph);
      // Rough estimate: ~4 characters per token
      const estimatedTokens = json.length / 4;
      expect(estimatedTokens).toBeLessThan(2500);
    });

    it('combined with ontology fits context budget (<65KB)', () => {
      const graphSize = JSON.stringify(conceptGraph).length;
      const ontologySize = JSON.stringify(ontologyData).length;
      const combined = graphSize + ontologySize;
      // Budget history:
      // - 45KB for modular synonym expansion (2025-12-29)
      // - 65KB for complete 17-subject synonym coverage (2026-01-16)
      expect(combined).toBeLessThan(65000);
    });
  });
});
