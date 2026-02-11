/**
 * Unit tests for slug derivation utilities.
 *
 * @see slug-derivation.ts
 */

import { describe, it, expect } from 'vitest';
import { deriveSubjectSlugFromSequence, derivePhaseSlugFromSequence } from './slug-derivation';

describe('slug-derivation', () => {
  describe('deriveSubjectSlugFromSequence', () => {
    it('extracts subject from primary sequence', () => {
      expect(deriveSubjectSlugFromSequence('maths-primary')).toBe('maths');
    });

    it('extracts subject from secondary sequence', () => {
      expect(deriveSubjectSlugFromSequence('english-secondary')).toBe('english');
    });

    it('handles subjects with hyphens', () => {
      expect(deriveSubjectSlugFromSequence('design-technology-secondary')).toBe(
        'design-technology',
      );
    });

    it('handles cooking-nutrition', () => {
      expect(deriveSubjectSlugFromSequence('cooking-nutrition-secondary')).toBe(
        'cooking-nutrition',
      );
    });

    it('handles physical-education', () => {
      expect(deriveSubjectSlugFromSequence('physical-education-primary')).toBe(
        'physical-education',
      );
    });

    it('handles religious-education', () => {
      expect(deriveSubjectSlugFromSequence('religious-education-secondary')).toBe(
        'religious-education',
      );
    });

    it('handles rshe-pshe', () => {
      expect(deriveSubjectSlugFromSequence('rshe-pshe-secondary')).toBe('rshe-pshe');
    });

    it('returns the full slug if no phase suffix', () => {
      expect(deriveSubjectSlugFromSequence('maths')).toBe('maths');
    });
  });

  describe('derivePhaseSlugFromSequence', () => {
    it('extracts primary phase', () => {
      expect(derivePhaseSlugFromSequence('maths-primary')).toBe('primary');
    });

    it('extracts secondary phase', () => {
      expect(derivePhaseSlugFromSequence('english-secondary')).toBe('secondary');
    });

    it('handles subjects with hyphens', () => {
      expect(derivePhaseSlugFromSequence('design-technology-secondary')).toBe('secondary');
    });

    it('returns unknown for sequences without phase suffix', () => {
      expect(derivePhaseSlugFromSequence('maths')).toBe('unknown');
    });

    it('returns unknown for non-standard phase suffixes', () => {
      expect(derivePhaseSlugFromSequence('maths-tertiary')).toBe('unknown');
    });
  });
});
