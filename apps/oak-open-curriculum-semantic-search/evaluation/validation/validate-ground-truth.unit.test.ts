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
import type { GroundTruthQuery } from '../../src/lib/search-quality/ground-truth/types.js';

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
      priority: 'medium',
    };
  }

  describe('required categories', () => {
    it('should include pedagogical-intent as a required category', () => {
      expect(REQUIRED_CATEGORIES).toContain('pedagogical-intent');
    });

    it('should require minimum 1 pedagogical-intent query', () => {
      expect(CATEGORY_MINIMUMS['pedagogical-intent']).toBe(1);
    });
  });

  describe('validation behaviour', () => {
    it('should report error when pedagogical-intent queries are missing', () => {
      const queries: readonly GroundTruthQuery[] = [
        // Has all categories EXCEPT pedagogical-intent
        createQuery('precise-topic'),
        createQuery('precise-topic'),
        createQuery('precise-topic'),
        createQuery('precise-topic'),
        createQuery('natural-expression'),
        createQuery('natural-expression'),
        createQuery('imprecise-input'),
        createQuery('cross-topic'),
      ];

      const issues: ValidationIssue[] = [];
      checkCategoryCoverage('test/entry', queries, issues);

      // Should have an error about missing pedagogical-intent
      const pedagogicalIntentError = issues.find(
        (issue) =>
          issue.category === 'category-coverage' && issue.message.includes('pedagogical-intent'),
      );
      expect(pedagogicalIntentError).toBeDefined();
      expect(pedagogicalIntentError?.message).toContain(
        "'pedagogical-intent' queries - minimum 1 required",
      );
    });

    it('should pass when all required categories including pedagogical-intent are present', () => {
      const queries: readonly GroundTruthQuery[] = [
        createQuery('precise-topic'),
        createQuery('precise-topic'),
        createQuery('precise-topic'),
        createQuery('precise-topic'),
        createQuery('natural-expression'),
        createQuery('natural-expression'),
        createQuery('imprecise-input'),
        createQuery('cross-topic'),
        createQuery('pedagogical-intent'), // Now included
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

      // Should have errors for all 5 required categories
      expect(issues.length).toBe(5);

      const messages = issues.map((i) => i.message);
      expect(messages.some((m) => m.includes('precise-topic'))).toBe(true);
      expect(messages.some((m) => m.includes('natural-expression'))).toBe(true);
      expect(messages.some((m) => m.includes('imprecise-input'))).toBe(true);
      expect(messages.some((m) => m.includes('cross-topic'))).toBe(true);
      expect(messages.some((m) => m.includes('pedagogical-intent'))).toBe(true);
    });
  });
});
