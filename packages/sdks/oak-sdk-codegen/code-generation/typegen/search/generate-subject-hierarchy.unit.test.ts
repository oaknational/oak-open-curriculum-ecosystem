/**
 * TDD tests for subject hierarchy generated functions.
 *
 * These tests verify the generated subject hierarchy exports work correctly.
 * They test the GENERATED output, not the generator itself.
 *
 * @see ./generate-subject-hierarchy.ts - The generator that produces the tested code
 */

import { describe, it, expect } from 'vitest';

// These imports will fail until the generator runs (TDD RED phase)
import {
  SUBJECT_TO_PARENT,
  ALL_SUBJECTS,
  KS4_SCIENCE_VARIANTS,
  PARENT_TO_SUBJECTS,
  isKs4ScienceVariant,
  getSubjectParent,
  isAllSubject,
  type AllSubjectSlug,
  type ParentSubjectSlug,
  type Ks4ScienceVariant,
} from '../../../src/types/generated/search/subject-hierarchy.js';

describe('Subject Hierarchy Generated Exports', () => {
  describe('SUBJECT_TO_PARENT lookup table', () => {
    it('maps science variants to science parent', () => {
      expect(SUBJECT_TO_PARENT['physics']).toBe('science');
      expect(SUBJECT_TO_PARENT['chemistry']).toBe('science');
      expect(SUBJECT_TO_PARENT['biology']).toBe('science');
      expect(SUBJECT_TO_PARENT['combined-science']).toBe('science');
      expect(SUBJECT_TO_PARENT['science']).toBe('science');
    });

    it('maps non-science subjects to themselves', () => {
      expect(SUBJECT_TO_PARENT['maths']).toBe('maths');
      expect(SUBJECT_TO_PARENT['english']).toBe('english');
      expect(SUBJECT_TO_PARENT['art']).toBe('art');
      expect(SUBJECT_TO_PARENT['history']).toBe('history');
      expect(SUBJECT_TO_PARENT['geography']).toBe('geography');
    });

    it('contains all 21 subjects (17 canonical + 4 KS4 science variants)', () => {
      const keys = Object.keys(SUBJECT_TO_PARENT);
      expect(keys).toHaveLength(21);
    });
  });

  describe('ALL_SUBJECTS array', () => {
    it('contains all 21 subjects', () => {
      expect(ALL_SUBJECTS).toHaveLength(21);
    });

    it('includes all 17 canonical subjects from OpenAPI schema', () => {
      const canonicalSubjects = [
        'art',
        'citizenship',
        'computing',
        'cooking-nutrition',
        'design-technology',
        'english',
        'french',
        'geography',
        'german',
        'history',
        'maths',
        'music',
        'physical-education',
        'religious-education',
        'rshe-pshe',
        'science',
        'spanish',
      ];
      for (const subject of canonicalSubjects) {
        expect(ALL_SUBJECTS).toContain(subject);
      }
    });

    it('includes all 4 KS4 science variants', () => {
      expect(ALL_SUBJECTS).toContain('physics');
      expect(ALL_SUBJECTS).toContain('chemistry');
      expect(ALL_SUBJECTS).toContain('biology');
      expect(ALL_SUBJECTS).toContain('combined-science');
    });
  });

  describe('KS4_SCIENCE_VARIANTS array', () => {
    it('contains exactly the 4 KS4 science variants', () => {
      expect(KS4_SCIENCE_VARIANTS).toEqual(['physics', 'chemistry', 'biology', 'combined-science']);
    });
  });

  describe('PARENT_TO_SUBJECTS lookup table', () => {
    it('maps science to all science subjects including variants', () => {
      expect(PARENT_TO_SUBJECTS['science']).toEqual([
        'science',
        'physics',
        'chemistry',
        'biology',
        'combined-science',
      ]);
    });

    it('maps non-science subjects to arrays containing only themselves', () => {
      expect(PARENT_TO_SUBJECTS['maths']).toEqual(['maths']);
      expect(PARENT_TO_SUBJECTS['english']).toEqual(['english']);
      expect(PARENT_TO_SUBJECTS['art']).toEqual(['art']);
    });

    it('contains all 17 parent subjects', () => {
      const keys = Object.keys(PARENT_TO_SUBJECTS);
      expect(keys).toHaveLength(17);
    });
  });

  describe('isKs4ScienceVariant type guard', () => {
    it('returns true for KS4 science variants', () => {
      expect(isKs4ScienceVariant('physics')).toBe(true);
      expect(isKs4ScienceVariant('chemistry')).toBe(true);
      expect(isKs4ScienceVariant('biology')).toBe(true);
      expect(isKs4ScienceVariant('combined-science')).toBe(true);
    });

    it('returns false for science parent', () => {
      expect(isKs4ScienceVariant('science')).toBe(false);
    });

    it('returns false for non-science subjects', () => {
      expect(isKs4ScienceVariant('maths')).toBe(false);
      expect(isKs4ScienceVariant('english')).toBe(false);
      expect(isKs4ScienceVariant('art')).toBe(false);
    });

    it('returns false for invalid strings', () => {
      expect(isKs4ScienceVariant('invalid')).toBe(false);
      expect(isKs4ScienceVariant('')).toBe(false);
    });
  });

  describe('getSubjectParent function', () => {
    it('returns science for all science variants', () => {
      expect(getSubjectParent('physics')).toBe('science');
      expect(getSubjectParent('chemistry')).toBe('science');
      expect(getSubjectParent('biology')).toBe('science');
      expect(getSubjectParent('combined-science')).toBe('science');
    });

    it('returns the same subject for non-science subjects', () => {
      expect(getSubjectParent('maths')).toBe('maths');
      expect(getSubjectParent('english')).toBe('english');
      expect(getSubjectParent('art')).toBe('art');
      expect(getSubjectParent('history')).toBe('history');
    });
  });

  describe('isAllSubject type guard', () => {
    it('returns true for all 17 canonical subjects', () => {
      const canonicalSubjects = [
        'art',
        'citizenship',
        'computing',
        'cooking-nutrition',
        'design-technology',
        'english',
        'french',
        'geography',
        'german',
        'history',
        'maths',
        'music',
        'physical-education',
        'religious-education',
        'rshe-pshe',
        'science',
        'spanish',
      ];
      for (const subject of canonicalSubjects) {
        expect(isAllSubject(subject)).toBe(true);
      }
    });

    it('returns true for all 4 KS4 science variants', () => {
      expect(isAllSubject('physics')).toBe(true);
      expect(isAllSubject('chemistry')).toBe(true);
      expect(isAllSubject('biology')).toBe(true);
      expect(isAllSubject('combined-science')).toBe(true);
    });

    it('returns false for invalid strings', () => {
      expect(isAllSubject('invalid')).toBe(false);
      expect(isAllSubject('')).toBe(false);
      expect(isAllSubject('MATHS')).toBe(false); // case sensitive
    });
  });

  describe('Type compatibility', () => {
    it('AllSubjectSlug includes all 21 subjects', () => {
      // Type-level test: these should compile without errors
      const physics: AllSubjectSlug = 'physics';
      const maths: AllSubjectSlug = 'maths';
      const science: AllSubjectSlug = 'science';
      expect(physics).toBe('physics');
      expect(maths).toBe('maths');
      expect(science).toBe('science');
    });

    it('ParentSubjectSlug includes only the 17 canonical subjects', () => {
      // Type-level test: these should compile without errors
      const science: ParentSubjectSlug = 'science';
      const maths: ParentSubjectSlug = 'maths';
      expect(science).toBe('science');
      expect(maths).toBe('maths');
    });

    it('Ks4ScienceVariant includes only the 4 variants', () => {
      // Type-level test: these should compile without errors
      const physics: Ks4ScienceVariant = 'physics';
      const chemistry: Ks4ScienceVariant = 'chemistry';
      expect(physics).toBe('physics');
      expect(chemistry).toBe('chemistry');
    });
  });
});
