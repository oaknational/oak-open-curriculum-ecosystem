/**
 * Unit tests for ground truth validation.
 *
 * Tests the pure validation functions that check category coverage
 * and other ground truth quality requirements.
 *
 * @packageDocumentation
 */

import { describe, it, expect } from 'vitest';
import {
  checkCategoryCoverage,
  REQUIRED_CATEGORIES,
  CATEGORY_MINIMUMS,
  type ValidationIssue,
} from './validate-ground-truth.js';
import type { GroundTruthQuery } from '../../src/lib/search-quality/ground-truth-archive/types.js';

describe('checkCategoryCoverage', () => {
  /**
   * Helper to create a minimal valid query for testing.
   */
  function createQuery(category: GroundTruthQuery['category']): GroundTruthQuery {
    return {
      query: 'test query for category',
      expectedRelevance: { 'test-slug-1': 3, 'test-slug-2': 2 },
      category,
      description: 'Test query for validation',
    };
  }

  describe('required categories', () => {
    it('should include all four required categories', () => {
      expect(REQUIRED_CATEGORIES).toContain('precise-topic');
      expect(REQUIRED_CATEGORIES).toContain('natural-expression');
      expect(REQUIRED_CATEGORIES).toContain('imprecise-input');
      expect(REQUIRED_CATEGORIES).toContain('cross-topic');
      expect(REQUIRED_CATEGORIES).toHaveLength(4);
    });

    it('should require minimum 1 precise-topic query', () => {
      // Updated 2026-01-11: M3 plan specifies 1 query per category
      expect(CATEGORY_MINIMUMS['precise-topic']).toBe(1);
    });

    it('should require minimum 1 natural-expression query', () => {
      // Updated 2026-01-11: M3 plan specifies 1 query per category
      expect(CATEGORY_MINIMUMS['natural-expression']).toBe(1);
    });

    it('should require minimum 1 imprecise-input query', () => {
      expect(CATEGORY_MINIMUMS['imprecise-input']).toBe(1);
    });

    it('should require minimum 1 cross-topic query', () => {
      expect(CATEGORY_MINIMUMS['cross-topic']).toBe(1);
    });
  });

  describe('validation behaviour', () => {
    it('should report error when cross-topic queries are missing', () => {
      const queries: readonly GroundTruthQuery[] = [
        // Has all categories EXCEPT cross-topic (1 each per M3 plan)
        createQuery('precise-topic'),
        createQuery('natural-expression'),
        createQuery('imprecise-input'),
      ];

      const issues: ValidationIssue[] = [];
      checkCategoryCoverage('test/entry', queries, issues);

      // Should have an error about missing cross-topic
      const crossTopicError = issues.find(
        (issue) => issue.category === 'category-coverage' && issue.message.includes('cross-topic'),
      );
      expect(crossTopicError).toBeDefined();
      expect(crossTopicError?.message).toContain("'cross-topic' queries - minimum 1 required");
    });

    it('should pass when all required categories are present', () => {
      // M3 plan: 1 query per category = 4 total
      const queries: readonly GroundTruthQuery[] = [
        createQuery('precise-topic'),
        createQuery('natural-expression'),
        createQuery('imprecise-input'),
        createQuery('cross-topic'),
      ];

      const issues: ValidationIssue[] = [];
      checkCategoryCoverage('test/entry', queries, issues);

      // Should have no errors
      expect(issues).toHaveLength(0);
    });

    it('should report error for each missing required category', () => {
      const queries: readonly GroundTruthQuery[] = [];

      const issues: ValidationIssue[] = [];
      checkCategoryCoverage('test/entry', queries, issues);

      // Should have errors for all 4 required categories
      expect(issues.length).toBe(4);

      const messages = issues.map((i) => i.message);
      expect(messages.some((m) => m.includes('precise-topic'))).toBe(true);
      expect(messages.some((m) => m.includes('natural-expression'))).toBe(true);
      expect(messages.some((m) => m.includes('imprecise-input'))).toBe(true);
      expect(messages.some((m) => m.includes('cross-topic'))).toBe(true);
    });
  });
});
