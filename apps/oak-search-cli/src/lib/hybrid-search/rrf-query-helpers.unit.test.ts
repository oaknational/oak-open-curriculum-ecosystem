/**
 * Unit tests for RRF query helpers.
 *
 * @remarks
 * Tests filter building with support for phases, multiple key stages, years,
 * and other curriculum dimensions.
 *
 */
import { describe, it, expect } from 'vitest';
import { createLessonFilters, createUnitFilters } from './rrf-query-helpers';

describe('createLessonFilters', () => {
  describe('subject filtering (ADR-101 smart filtering)', () => {
    it('uses subject_parent for canonical subjects (broad match)', () => {
      const filters = createLessonFilters({ subject: 'science' });

      expect(filters).toContainEqual({ term: { subject_parent: 'science' } });
    });

    it('uses subject_parent for non-science subjects', () => {
      const filters = createLessonFilters({ subject: 'maths' });

      expect(filters).toContainEqual({ term: { subject_parent: 'maths' } });
    });

    it('uses subject_slug for KS4 science variant at KS4 (specific match)', () => {
      const filters = createLessonFilters({ subject: 'physics', keyStage: 'ks4' });

      expect(filters).toContainEqual({ term: { subject_slug: 'physics' } });
      expect(filters).not.toContainEqual({ term: { subject_parent: 'physics' } });
    });

    it('uses subject_slug for chemistry at KS4', () => {
      const filters = createLessonFilters({ subject: 'chemistry', keyStage: 'ks4' });

      expect(filters).toContainEqual({ term: { subject_slug: 'chemistry' } });
    });

    it('uses subject_slug for biology at KS4', () => {
      const filters = createLessonFilters({ subject: 'biology', keyStage: 'ks4' });

      expect(filters).toContainEqual({ term: { subject_slug: 'biology' } });
    });

    it('uses subject_slug for combined-science at KS4', () => {
      const filters = createLessonFilters({ subject: 'combined-science', keyStage: 'ks4' });

      expect(filters).toContainEqual({ term: { subject_slug: 'combined-science' } });
    });

    it('uses subject_parent for physics NOT at KS4 (falls back to parent)', () => {
      const filters = createLessonFilters({ subject: 'physics', keyStage: 'ks3' });

      expect(filters).toContainEqual({ term: { subject_parent: 'science' } });
      expect(filters).not.toContainEqual({ term: { subject_slug: 'physics' } });
    });

    it('uses subject_parent for physics when no keyStage specified', () => {
      const filters = createLessonFilters({ subject: 'physics' });

      expect(filters).toContainEqual({ term: { subject_parent: 'science' } });
    });
  });

  describe('phase filtering', () => {
    it('expands phase "primary" to keyStages ks1 and ks2', () => {
      const filters = createLessonFilters({ phase: 'primary' });

      expect(filters).toContainEqual({
        terms: { key_stage: ['ks1', 'ks2'] },
      });
    });

    it('expands phase "secondary" to keyStages ks3 and ks4', () => {
      const filters = createLessonFilters({ phase: 'secondary' });

      expect(filters).toContainEqual({
        terms: { key_stage: ['ks3', 'ks4'] },
      });
    });

    it('expands phases array to combined keyStages', () => {
      const filters = createLessonFilters({ phases: ['primary', 'secondary'] });

      expect(filters).toContainEqual({
        terms: { key_stage: ['ks1', 'ks2', 'ks3', 'ks4'] },
      });
    });
  });

  describe('multiple key stages', () => {
    it('uses terms query for multiple keyStages', () => {
      const filters = createLessonFilters({ keyStages: ['ks1', 'ks2'] });

      expect(filters).toContainEqual({
        terms: { key_stage: ['ks1', 'ks2'] },
      });
    });

    it('uses term query for single keyStage (backward compatibility)', () => {
      const filters = createLessonFilters({ keyStage: 'ks3' });

      expect(filters).toContainEqual({
        term: { key_stage: 'ks3' },
      });
    });

    it('prefers phases over keyStages when both provided', () => {
      const filters = createLessonFilters({
        phase: 'primary',
        keyStages: ['ks3', 'ks4'],
      });

      // Phase takes precedence
      expect(filters).toContainEqual({
        terms: { key_stage: ['ks1', 'ks2'] },
      });
      // keyStages is ignored
      expect(filters).not.toContainEqual({
        terms: { key_stage: ['ks3', 'ks4'] },
      });
    });
  });

  describe('multiple years', () => {
    it('uses terms query for multiple years', () => {
      const filters = createLessonFilters({ years: ['3', '4', '5'] });

      expect(filters).toContainEqual({
        terms: { years: ['3', '4', '5'] },
      });
    });

    it('uses terms query for single year (backward compatibility)', () => {
      const filters = createLessonFilters({ year: '7' });

      expect(filters).toContainEqual({
        terms: { years: ['7'] },
      });
    });
  });

  describe('multiple exam boards', () => {
    it('uses terms query for multiple examBoards', () => {
      const filters = createLessonFilters({ examBoards: ['aqa', 'edexcel'] });

      expect(filters).toContainEqual({
        terms: { exam_boards: ['aqa', 'edexcel'] },
      });
    });
  });
});

describe('createUnitFilters', () => {
  describe('subject filtering (ADR-101 smart filtering)', () => {
    it('uses subject_parent for canonical subjects (broad match)', () => {
      const filters = createUnitFilters({ subject: 'science' });

      expect(filters).toContainEqual({ term: { subject_parent: 'science' } });
    });

    it('uses subject_slug for KS4 science variant at KS4 (specific match)', () => {
      const filters = createUnitFilters({ subject: 'physics', keyStage: 'ks4' });

      expect(filters).toContainEqual({ term: { subject_slug: 'physics' } });
    });

    it('uses subject_parent for physics NOT at KS4', () => {
      const filters = createUnitFilters({ subject: 'physics', keyStage: 'ks3' });

      expect(filters).toContainEqual({ term: { subject_parent: 'science' } });
    });
  });

  describe('phase filtering', () => {
    it('expands phase "primary" to keyStages ks1 and ks2', () => {
      const filters = createUnitFilters({ phase: 'primary' });

      expect(filters).toContainEqual({
        terms: { key_stage: ['ks1', 'ks2'] },
      });
    });

    it('expands phase "secondary" to keyStages ks3 and ks4', () => {
      const filters = createUnitFilters({ phase: 'secondary' });

      expect(filters).toContainEqual({
        terms: { key_stage: ['ks3', 'ks4'] },
      });
    });
  });

  describe('multiple key stages', () => {
    it('uses terms query for multiple keyStages', () => {
      const filters = createUnitFilters({ keyStages: ['ks3', 'ks4'] });

      expect(filters).toContainEqual({
        terms: { key_stage: ['ks3', 'ks4'] },
      });
    });
  });
});
