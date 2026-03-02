/**
 * Unit tests for curriculum phrase detection.
 *
 * Tests the pure function that detects multi-word curriculum terms
 * in search queries for phrase boost matching.
 *
 * **Classification**: UNIT TEST
 * - Tests pure function
 * - No side effects, no IO, no mocks
 * - Per testing-strategy.md: "Unit tests DO NOT trigger IO"
 *
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md` Phase B.5
 */

import { describe, it, expect } from 'vitest';
import { detectCurriculumPhrases } from './detect-curriculum-phrases.js';

describe('detectCurriculumPhrases', () => {
  describe('phrase detection basics', () => {
    it('detects "straight line" phrase in query', () => {
      const result = detectCurriculumPhrases('straight line equations');
      expect(result).toContain('straight line');
    });

    it('detects "completing the square" phrase in query', () => {
      const result = detectCurriculumPhrases('completing the square quadratics');
      expect(result).toContain('completing the square');
    });

    it('detects "circle rules" phrase in query', () => {
      const result = detectCurriculumPhrases('circle rules tangent');
      expect(result).toContain('circle rules');
    });

    it('detects "systems of equations" phrase in query', () => {
      const result = detectCurriculumPhrases('solving systems of equations');
      expect(result).toContain('systems of equations');
    });
  });

  describe('phrase position independence', () => {
    it('detects phrase at start of query', () => {
      const result = detectCurriculumPhrases('straight line graphs help');
      expect(result).toContain('straight line');
    });

    it('detects phrase at end of query', () => {
      const result = detectCurriculumPhrases('help with straight line');
      expect(result).toContain('straight line');
    });

    it('detects phrase in middle of query', () => {
      const result = detectCurriculumPhrases('finding straight line gradient');
      expect(result).toContain('straight line');
    });
  });

  describe('multiple phrase detection', () => {
    it('detects multiple phrases in one query', () => {
      const result = detectCurriculumPhrases('straight line and circle rules');
      expect(result).toContain('straight line');
      expect(result).toContain('circle rules');
    });

    it('returns phrases in order of appearance', () => {
      const result = detectCurriculumPhrases('circle rules and straight line');
      expect(result.indexOf('circle rules')).toBeLessThan(result.indexOf('straight line'));
    });
  });

  describe('case insensitivity', () => {
    it('detects phrases regardless of case', () => {
      const result = detectCurriculumPhrases('Straight Line equations');
      expect(result).toContain('straight line');
    });

    it('returns phrases in lowercase', () => {
      const result = detectCurriculumPhrases('STRAIGHT LINE');
      expect(result).toEqual(['straight line']);
    });
  });

  describe('edge cases', () => {
    it('returns empty array when no phrases detected', () => {
      const result = detectCurriculumPhrases('algebra');
      expect(result).toEqual([]);
    });

    it('handles empty string', () => {
      const result = detectCurriculumPhrases('');
      expect(result).toEqual([]);
    });

    it('does not detect partial phrase matches', () => {
      // "straight" alone is not a phrase, only "straight line" is
      const result = detectCurriculumPhrases('straight road');
      expect(result).not.toContain('straight');
      expect(result).toEqual([]);
    });

    it('handles overlapping phrase boundaries correctly', () => {
      // Should not double-count or produce malformed results
      const result = detectCurriculumPhrases('straight line graph');
      // Should detect "straight line" but not duplicate
      const straightLineCount = result.filter((p) => p === 'straight line').length;
      expect(straightLineCount).toBe(1);
    });
  });

  describe('phrase vocabulary coverage', () => {
    it('detects trigonometry-related phrases', () => {
      const result = detectCurriculumPhrases('sin cos tan triangles');
      expect(result).toContain('sin cos tan');
    });

    it('detects index laws phrases', () => {
      const result = detectCurriculumPhrases('laws of indices');
      expect(result).toContain('laws of indices');
    });

    it('detects changing the subject phrases', () => {
      const result = detectCurriculumPhrases('rearranging formulas');
      expect(result).toContain('rearranging formulas');
    });

    it('detects y = mx + c variations', () => {
      const result = detectCurriculumPhrases('y equals mx plus c');
      expect(result).toContain('y equals mx plus c');
    });
  });
});
