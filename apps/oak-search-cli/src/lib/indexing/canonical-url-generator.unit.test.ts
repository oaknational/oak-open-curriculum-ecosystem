/**
 * Unit tests for canonical URL generation.
 *
 * These tests specify the CORRECT URL patterns (post-fix).
 * URL patterns confirmed against OWA source and live site on 2026-03-05:
 * - Sequences: `/teachers/curriculum/{sequenceSlug}/units`
 * - Units: `/teachers/curriculum/{sequenceSlug}/units/{unitSlug}`
 * - Threads: no OWA page, return `null`
 *
 * @see canonical-url-generator.ts
 */

import { describe, it, expect } from 'vitest';
import {
  OAK_BASE_URL,
  generateLessonCanonicalUrl,
  generateUnitCanonicalUrl,
  generateUnitCanonicalUrlFromSequence,
  generateSequenceCanonicalUrl,
  generateThreadCanonicalUrl,
  generateSubjectProgrammesUrl,
} from './canonical-url-generator';

describe('canonical-url-generator', () => {
  describe('OAK_BASE_URL', () => {
    it('is the teachers section of thenational.academy', () => {
      expect(OAK_BASE_URL).toBe('https://www.thenational.academy/teachers');
    });
  });

  describe('generateLessonCanonicalUrl', () => {
    it('generates the correct URL for a lesson', () => {
      const url = generateLessonCanonicalUrl('adding-fractions-with-same-denominator');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/lessons/adding-fractions-with-same-denominator',
      );
    });

    it('handles lesson slugs with hyphens', () => {
      const url = generateLessonCanonicalUrl('child-workers-in-the-victorian-era');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/lessons/child-workers-in-the-victorian-era',
      );
    });
  });

  describe('generateUnitCanonicalUrl', () => {
    it('generates the correct URL for a primary unit', () => {
      const url = generateUnitCanonicalUrl('fractions-year-5', 'maths', 'primary');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/curriculum/maths-primary/units/fractions-year-5',
      );
    });

    it('generates the correct URL for a secondary unit', () => {
      const url = generateUnitCanonicalUrl('algebra-basics', 'maths', 'secondary');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/curriculum/maths-secondary/units/algebra-basics',
      );
    });

    it('handles subjects with hyphens', () => {
      const url = generateUnitCanonicalUrl('knife-skills', 'cooking-nutrition', 'secondary');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/curriculum/cooking-nutrition-secondary/units/knife-skills',
      );
    });

    it('normalises key-stage style phase slugs via shared helper', () => {
      const url = generateUnitCanonicalUrl('fractions-year-2', 'maths', 'ks1');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/curriculum/maths-primary/units/fractions-year-2',
      );
    });
  });

  describe('generateUnitCanonicalUrlFromSequence', () => {
    it('uses explicit sequenceSlug for exam-board sequences', () => {
      const url = generateUnitCanonicalUrlFromSequence('atomic-structure', 'science-secondary-aqa');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/curriculum/science-secondary-aqa/units/atomic-structure',
      );
    });
  });

  describe('generateSequenceCanonicalUrl', () => {
    it('generates the correct URL for a primary sequence', () => {
      const url = generateSequenceCanonicalUrl('maths-primary');
      expect(url).toBe('https://www.thenational.academy/teachers/curriculum/maths-primary/units');
    });

    it('generates the correct URL for a secondary sequence', () => {
      const url = generateSequenceCanonicalUrl('english-secondary');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/curriculum/english-secondary/units',
      );
    });

    it('handles subjects with hyphens in sequence slug', () => {
      const url = generateSequenceCanonicalUrl('design-technology-secondary');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/curriculum/design-technology-secondary/units',
      );
    });
  });

  describe('generateThreadCanonicalUrl', () => {
    it('returns null for a thread (threads have no OWA page)', () => {
      const url = generateThreadCanonicalUrl('number-multiplication-and-division');
      expect(url).toBeNull();
    });

    it('returns null for any thread slug', () => {
      const url = generateThreadCanonicalUrl('algebra');
      expect(url).toBeNull();
    });
  });

  describe('generateSubjectProgrammesUrl', () => {
    it('generates the correct URL for key stage 2 maths', () => {
      const url = generateSubjectProgrammesUrl('maths', 'ks2');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/key-stages/ks2/subjects/maths/programmes',
      );
    });

    it('generates the correct URL for key stage 3 science', () => {
      const url = generateSubjectProgrammesUrl('science', 'ks3');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/key-stages/ks3/subjects/science/programmes',
      );
    });

    it('handles subjects with hyphens', () => {
      const url = generateSubjectProgrammesUrl('design-technology', 'ks4');
      expect(url).toBe(
        'https://www.thenational.academy/teachers/key-stages/ks4/subjects/design-technology/programmes',
      );
    });
  });
});
