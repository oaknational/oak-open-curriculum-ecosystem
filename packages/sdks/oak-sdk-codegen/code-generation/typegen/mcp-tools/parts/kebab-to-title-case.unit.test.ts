import { describe, it, expect } from 'vitest';
import { kebabToTitleCase } from './kebab-to-title-case.js';

/**
 * Unit tests for kebabToTitleCase pure function.
 *
 * This function converts kebab-case tool names to human-readable titles
 * for MCP tool annotations.
 */
describe('kebabToTitleCase', () => {
  describe('standard conversions', () => {
    it('converts get-key-stages to Get Key Stages', () => {
      expect(kebabToTitleCase('get-key-stages')).toBe('Get Key Stages');
    });

    it('converts get-lessons-transcript to Get Lessons Transcript', () => {
      expect(kebabToTitleCase('get-lessons-transcript')).toBe('Get Lessons Transcript');
    });

    it('converts get-key-stages-subject-lessons to Get Key Stages Subject Lessons', () => {
      expect(kebabToTitleCase('get-key-stages-subject-lessons')).toBe(
        'Get Key Stages Subject Lessons',
      );
    });

    it('converts get-key-stages-subject-questions to Get Key Stages Subject Questions', () => {
      expect(kebabToTitleCase('get-key-stages-subject-questions')).toBe(
        'Get Key Stages Subject Questions',
      );
    });
  });

  describe('single word handling', () => {
    it('handles single word: search', () => {
      expect(kebabToTitleCase('search')).toBe('Search');
    });

    it('handles single word: fetch', () => {
      expect(kebabToTitleCase('fetch')).toBe('Fetch');
    });
  });

  describe('long tool names', () => {
    it('handles get-key-stages-subject-assets (5 parts)', () => {
      expect(kebabToTitleCase('get-key-stages-subject-assets')).toBe(
        'Get Key Stages Subject Assets',
      );
    });

    it('handles get-lessons-assets-by-type (5 parts)', () => {
      expect(kebabToTitleCase('get-lessons-assets-by-type')).toBe('Get Lessons Assets By Type');
    });
  });

  describe('case normalization', () => {
    it('handles already capitalized words', () => {
      expect(kebabToTitleCase('GET-KEY-STAGES')).toBe('Get Key Stages');
    });

    it('handles mixed case words', () => {
      expect(kebabToTitleCase('Get-Key-Stages')).toBe('Get Key Stages');
    });

    it('handles lowercase input', () => {
      expect(kebabToTitleCase('get-key-stages')).toBe('Get Key Stages');
    });
  });

  describe('fail-fast validation', () => {
    it('throws TypeError for empty string', () => {
      expect(() => kebabToTitleCase('')).toThrow(TypeError);
      expect(() => kebabToTitleCase('')).toThrow('Name must be a string, given: ');
    });

    it('throws TypeError for non-string input', () => {
      expect(() => kebabToTitleCase(undefined)).toThrow(TypeError);
      expect(() => kebabToTitleCase(null)).toThrow(TypeError);
      expect(() => kebabToTitleCase(123)).toThrow(TypeError);
      expect(() => kebabToTitleCase({})).toThrow(TypeError);
    });
  });

  describe('edge cases with non-alphanumeric characters', () => {
    it('handles single hyphen (produces space from empty segments)', () => {
      expect(kebabToTitleCase('-')).toBe(' ');
    });

    it('handles leading hyphen (produces leading space)', () => {
      expect(kebabToTitleCase('-search')).toBe(' Search');
    });

    it('handles trailing hyphen (produces trailing space)', () => {
      expect(kebabToTitleCase('search-')).toBe('Search ');
    });

    it('handles underscores same as hyphens', () => {
      expect(kebabToTitleCase('get_key_stages')).toBe('Get Key Stages');
    });

    it('handles mixed separators', () => {
      expect(kebabToTitleCase('get-key_stages')).toBe('Get Key Stages');
    });
  });

  describe('real tool names from generated files', () => {
    const realToolNames = [
      ['get-changelog', 'Get Changelog'],
      ['get-changelog-latest', 'Get Changelog Latest'],
      ['get-key-stages', 'Get Key Stages'],
      ['get-lessons-summary', 'Get Lessons Summary'],
      ['get-lessons-quiz', 'Get Lessons Quiz'],
      ['get-rate-limit', 'Get Rate Limit'],
      ['get-key-stages-subject-units', 'Get Key Stages Subject Units'],
      ['get-key-stages-subject-lessons', 'Get Key Stages Subject Lessons'],
      ['get-sequences-units', 'Get Sequences Units'],
      ['get-subject-detail', 'Get Subject Detail'],
      ['get-subjects', 'Get Subjects'],
      ['get-subjects-key-stages', 'Get Subjects Key Stages'],
      ['get-subjects-sequences', 'Get Subjects Sequences'],
      ['get-subjects-years', 'Get Subjects Years'],
      ['get-threads', 'Get Threads'],
      ['get-threads-units', 'Get Threads Units'],
      ['get-units-summary', 'Get Units Summary'],
    ] as const;

    it.each(realToolNames)('converts %s to %s', (input, expected) => {
      expect(kebabToTitleCase(input)).toBe(expected);
    });
  });
});
