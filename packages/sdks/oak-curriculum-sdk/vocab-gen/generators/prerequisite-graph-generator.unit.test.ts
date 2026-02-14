/**
 * Unit tests for the prerequisite graph generator.
 *
 * @remarks
 * TDD: These tests specify the behaviour of the prerequisite graph generator.
 * Written FIRST before implementation (RED phase).
 *
 * @see ADR-086 (`docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md`) for requirements
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedPriorKnowledge } from '../extractors/index.js';
import type { ExtractedThread } from '../extractors/thread-extractor.js';

import { generatePrerequisiteGraphData } from './prerequisite-graph-generator.js';

describe('generatePrerequisiteGraphData', () => {
  const baseThread: ExtractedThread = {
    slug: 'number-fractions',
    title: 'Number: Fractions',
    firstYear: 2,
    lastYear: 6,
    units: [
      {
        unitSlug: 'fractions-year-2',
        unitTitle: 'Fractions Year 2',
        order: 1,
        subject: 'maths',
        keyStage: 'ks1',
        year: 2,
      },
      {
        unitSlug: 'fractions-year-3',
        unitTitle: 'Fractions Year 3',
        order: 2,
        subject: 'maths',
        keyStage: 'ks2',
        year: 3,
      },
      {
        unitSlug: 'fractions-year-4',
        unitTitle: 'Fractions Year 4',
        order: 3,
        subject: 'maths',
        keyStage: 'ks2',
        year: 4,
      },
    ],
  };

  const basePriorKnowledge: ExtractedPriorKnowledge = {
    requirement: 'Understand equal parts',
    unitSlug: 'fractions-year-4',
    unitTitle: 'Fractions Year 4',
    subject: 'maths',
    keyStage: 'ks2',
    year: 4,
  };

  describe('graph metadata', () => {
    it('returns a graph with version 1.0.0', () => {
      const result = generatePrerequisiteGraphData([], [], '2025-12-07T09:37:04.693Z');

      expect(result.version).toBe('1.0.0');
    });

    it('includes generatedAt timestamp', () => {
      const result = generatePrerequisiteGraphData([], [], '2025-12-07T09:37:04.693Z');

      expect(result.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('includes sourceVersion from input', () => {
      const result = generatePrerequisiteGraphData([], [], '2025-12-07T09:37:04.693Z');

      expect(result.sourceVersion).toBe('2025-12-07T09:37:04.693Z');
    });

    it('includes seeAlso cross-reference', () => {
      const result = generatePrerequisiteGraphData([], [], '2025-12-07T09:37:04.693Z');

      expect(result.seeAlso).toContain('get-thread-progressions');
    });
  });

  describe('stats', () => {
    it('counts units with prior knowledge', () => {
      const priorKnowledge: readonly ExtractedPriorKnowledge[] = [
        { ...basePriorKnowledge, unitSlug: 'unit-1' },
        { ...basePriorKnowledge, unitSlug: 'unit-1' }, // Same unit, different requirement
        { ...basePriorKnowledge, unitSlug: 'unit-2' },
      ];

      const result = generatePrerequisiteGraphData(priorKnowledge, [], '2025-12-07');

      expect(result.stats.unitsWithPrerequisites).toBe(2);
    });

    it('counts total edges', () => {
      const threads: readonly ExtractedThread[] = [baseThread];
      const priorKnowledge: readonly ExtractedPriorKnowledge[] = [basePriorKnowledge];

      const result = generatePrerequisiteGraphData(priorKnowledge, threads, '2025-12-07');

      // At minimum: 2 thread edges (fractions-year-2 → year-3 → year-4)
      expect(result.stats.totalEdges).toBeGreaterThanOrEqual(2);
    });

    it('lists unique subjects', () => {
      const priorKnowledge: readonly ExtractedPriorKnowledge[] = [
        { ...basePriorKnowledge, subject: 'maths' },
        { ...basePriorKnowledge, subject: 'science', unitSlug: 'different-unit' },
      ];

      const result = generatePrerequisiteGraphData(priorKnowledge, [], '2025-12-07');

      expect(result.stats.subjectsCovered).toContain('maths');
      expect(result.stats.subjectsCovered).toContain('science');
    });
  });

  describe('nodes', () => {
    it('creates a node for each unit with prior knowledge', () => {
      const priorKnowledge: readonly ExtractedPriorKnowledge[] = [basePriorKnowledge];

      const result = generatePrerequisiteGraphData(priorKnowledge, [], '2025-12-07');

      const node = result.nodes.find((n) => n.unitSlug === 'fractions-year-4');
      expect(node).toBeDefined();
    });

    it('includes unit metadata on nodes', () => {
      const priorKnowledge: readonly ExtractedPriorKnowledge[] = [basePriorKnowledge];

      const result = generatePrerequisiteGraphData(priorKnowledge, [], '2025-12-07');

      const node = result.nodes.find((n) => n.unitSlug === 'fractions-year-4');
      expect(node?.unitTitle).toBe('Fractions Year 4');
      expect(node?.subject).toBe('maths');
      expect(node?.keyStage).toBe('ks2');
      expect(node?.year).toBe(4);
    });

    it('collects all prior knowledge requirements for a unit', () => {
      const priorKnowledge: readonly ExtractedPriorKnowledge[] = [
        { ...basePriorKnowledge, requirement: 'Requirement 1' },
        { ...basePriorKnowledge, requirement: 'Requirement 2' },
      ];

      const result = generatePrerequisiteGraphData(priorKnowledge, [], '2025-12-07');

      const node = result.nodes.find((n) => n.unitSlug === 'fractions-year-4');
      expect(node?.priorKnowledge).toContain('Requirement 1');
      expect(node?.priorKnowledge).toContain('Requirement 2');
      expect(node?.priorKnowledge).toHaveLength(2);
    });

    it('includes thread slugs for units in threads', () => {
      const threads: readonly ExtractedThread[] = [baseThread];
      const priorKnowledge: readonly ExtractedPriorKnowledge[] = [basePriorKnowledge];

      const result = generatePrerequisiteGraphData(priorKnowledge, threads, '2025-12-07');

      const node = result.nodes.find((n) => n.unitSlug === 'fractions-year-4');
      expect(node?.threadSlugs).toContain('number-fractions');
    });
  });

  describe('edges from threads', () => {
    it('creates prerequisiteFor edges from thread ordering', () => {
      const threads: readonly ExtractedThread[] = [baseThread];

      const result = generatePrerequisiteGraphData([], threads, '2025-12-07');

      // Thread has 3 units: fractions-year-2 → fractions-year-3 → fractions-year-4
      const edge1 = result.edges.find(
        (e) => e.from === 'fractions-year-2' && e.to === 'fractions-year-3',
      );
      const edge2 = result.edges.find(
        (e) => e.from === 'fractions-year-3' && e.to === 'fractions-year-4',
      );

      expect(edge1).toBeDefined();
      expect(edge1?.rel).toBe('prerequisiteFor');
      expect(edge1?.source).toBe('thread');

      expect(edge2).toBeDefined();
      expect(edge2?.rel).toBe('prerequisiteFor');
    });

    it('does not create edges for single-unit threads', () => {
      const singleUnitThread: ExtractedThread = {
        slug: 'single-unit-thread',
        title: 'Single Unit',
        firstYear: 5,
        lastYear: 5,
        units: [
          {
            unitSlug: 'only-unit',
            unitTitle: 'Only Unit',
            order: 1,
            subject: 'science',
            keyStage: 'ks2',
            year: 5,
          },
        ],
      };

      const result = generatePrerequisiteGraphData([], [singleUnitThread], '2025-12-07');

      expect(result.edges.filter((e) => e.source === 'thread')).toHaveLength(0);
    });
  });

  describe('graph structure validation', () => {
    it('returns a valid PrerequisiteGraph structure', () => {
      const result = generatePrerequisiteGraphData(
        [basePriorKnowledge],
        [baseThread],
        '2025-12-07',
      );

      // Check all required fields exist
      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('generatedAt');
      expect(result).toHaveProperty('sourceVersion');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(result).toHaveProperty('seeAlso');

      // Check stats structure
      expect(result.stats).toHaveProperty('unitsWithPrerequisites');
      expect(result.stats).toHaveProperty('totalEdges');
      expect(result.stats).toHaveProperty('subjectsCovered');
    });
  });
});
