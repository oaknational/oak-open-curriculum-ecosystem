/**
 * Unit tests for noise phrase removal.
 *
 * Tests the pure function that removes colloquial filler phrases
 * from search queries to improve signal-to-noise ratio.
 *
 * **Classification**: UNIT TEST
 * - Tests pure function
 * - No side effects, no IO, no mocks
 * - Per testing-strategy.md: "Unit tests DO NOT trigger IO"
 *
 * @see `.agent/plans/semantic-search/part-1-search-excellence.md` Phase B.4
 */

import { describe, it, expect } from 'vitest';
import { removeNoisePhrases } from './remove-noise-phrases.js';

describe('removeNoisePhrases', () => {
  describe('colloquial filler patterns', () => {
    it('removes "that ... stuff" pattern', () => {
      const result = removeNoisePhrases('that sohcahtoa stuff for triangles');
      expect(result).toBe('sohcahtoa triangles');
    });

    it('removes "the bit where" pattern', () => {
      const result = removeNoisePhrases('the bit where you complete the square');
      expect(result).toBe('complete the square');
    });

    it('removes "how do I" pattern', () => {
      const result = removeNoisePhrases('how do I solve quadratic equations');
      expect(result).toBe('solve quadratic equations');
    });

    it('removes "how to" pattern', () => {
      const result = removeNoisePhrases('how to find the gradient');
      expect(result).toBe('find the gradient');
    });

    it('removes "what is" pattern', () => {
      const result = removeNoisePhrases('what is pythagoras theorem');
      expect(result).toBe('pythagoras theorem');
    });
  });

  describe('pedagogical intent patterns', () => {
    it('removes "teach my students about" pattern', () => {
      const result = removeNoisePhrases('teach my students about solving for x');
      expect(result).toBe('solving for x');
    });

    it('removes "lesson on" pattern', () => {
      const result = removeNoisePhrases('lesson on working out angles');
      expect(result).toBe('working out angles');
    });

    it('removes "help with" pattern', () => {
      const result = removeNoisePhrases('help with algebra homework');
      expect(result).toBe('algebra homework');
    });
  });

  describe('edge cases', () => {
    it('returns query unchanged if no noise patterns match', () => {
      const result = removeNoisePhrases('quadratic equations');
      expect(result).toBe('quadratic equations');
    });

    it('handles empty string', () => {
      const result = removeNoisePhrases('');
      expect(result).toBe('');
    });

    it('handles query with only noise (returns minimal result)', () => {
      const result = removeNoisePhrases('how do I');
      // Note: "how do I" without trailing content leaves "how do I" since pattern requires trailing space
      expect(result).toBe('how do I');
    });

    it('normalizes multiple spaces to single space', () => {
      const result = removeNoisePhrases('quadratic  equations');
      // Whitespace normalization is intentional to clean up query
      expect(result).toBe('quadratic equations');
    });

    it('trims leading/trailing whitespace from result', () => {
      const result = removeNoisePhrases('  how to solve equations  ');
      expect(result).toBe('solve equations');
    });
  });

  describe('multiple noise patterns', () => {
    it('removes multiple patterns in sequence', () => {
      const result = removeNoisePhrases('how do I teach my students about algebra');
      expect(result).toBe('algebra');
    });
  });

  describe('case insensitivity', () => {
    it('matches patterns case-insensitively', () => {
      const result = removeNoisePhrases('How To solve equations');
      expect(result).toBe('solve equations');
    });

    it('matches "THAT ... STUFF" in uppercase', () => {
      const result = removeNoisePhrases('THAT trigonometry STUFF');
      expect(result).toBe('trigonometry');
    });
  });
});
