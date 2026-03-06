/**
 * Unit tests for sequence slug derivation utilities.
 */

import { describe, it, expect } from 'vitest';
import {
  deriveSequenceSlug,
  normalisePhaseSlug,
  deriveSubjectSlugFromSequence,
  derivePhaseSlugFromSequence,
} from './sequence-slug-derivation';

describe('normalisePhaseSlug', () => {
  it.each([
    ['primary', 'primary'],
    ['secondary', 'secondary'],
    ['ks1', 'primary'],
    ['ks2', 'primary'],
    ['ks3', 'secondary'],
    ['ks4', 'secondary'],
  ])('normalises %s to %s', (input, expected) => {
    expect(normalisePhaseSlug(input)).toBe(expected);
  });

  it.each([['upper-primary'], [''], ['  '], ['ks5'], ['Primary']])(
    'throws for unsupported phase slug %s',
    (input) => {
      expect(() => normalisePhaseSlug(input)).toThrow('Unsupported phase slug');
    },
  );
});

describe('deriveSequenceSlug', () => {
  it('derives canonical sequence slugs from subject + primary', () => {
    expect(deriveSequenceSlug('maths', 'primary')).toBe('maths-primary');
  });

  it('derives canonical sequence slugs from subject + secondary', () => {
    expect(deriveSequenceSlug('maths', 'secondary')).toBe('maths-secondary');
  });

  it('normalises ks1 while deriving a sequence slug', () => {
    expect(deriveSequenceSlug('maths', 'ks1')).toBe('maths-primary');
  });

  it('normalises ks2 while deriving a sequence slug', () => {
    expect(deriveSequenceSlug('science', 'ks2')).toBe('science-primary');
  });

  it('normalises ks3 while deriving a sequence slug', () => {
    expect(deriveSequenceSlug('science', 'ks3')).toBe('science-secondary');
  });

  it('normalises ks4 while deriving a sequence slug', () => {
    expect(deriveSequenceSlug('science', 'ks4')).toBe('science-secondary');
  });

  it('derives from hyphenated subject slugs', () => {
    expect(deriveSequenceSlug('design-technology', 'secondary')).toBe(
      'design-technology-secondary',
    );
  });

  it('trims subjectSlug before deriving sequence slug', () => {
    expect(deriveSequenceSlug('  maths  ', 'primary')).toBe('maths-primary');
  });

  it('throws for blank subjectSlug', () => {
    expect(() => deriveSequenceSlug('   ', 'primary')).toThrow(
      'subjectSlug must be a non-empty string',
    );
  });

  it('throws when phaseSlug cannot be normalised', () => {
    expect(() => deriveSequenceSlug('maths', 'upper-primary')).toThrow('Unsupported phase slug');
  });
});

describe('deriveSubjectSlugFromSequence', () => {
  it('extracts subject from primary sequence', () => {
    expect(deriveSubjectSlugFromSequence('maths-primary')).toBe('maths');
  });

  it('extracts subject from secondary sequence', () => {
    expect(deriveSubjectSlugFromSequence('english-secondary')).toBe('english');
  });

  it('handles subjects with hyphens', () => {
    expect(deriveSubjectSlugFromSequence('design-technology-secondary')).toBe('design-technology');
  });

  it('handles cooking-nutrition', () => {
    expect(deriveSubjectSlugFromSequence('cooking-nutrition-secondary')).toBe('cooking-nutrition');
  });

  it('handles physical-education', () => {
    expect(deriveSubjectSlugFromSequence('physical-education-primary')).toBe('physical-education');
  });

  it('handles religious-education', () => {
    expect(deriveSubjectSlugFromSequence('religious-education-secondary')).toBe(
      'religious-education',
    );
  });

  it('handles rshe-pshe', () => {
    expect(deriveSubjectSlugFromSequence('rshe-pshe-secondary')).toBe('rshe-pshe');
  });

  it.each([
    ['science-secondary-aqa', 'science'],
    ['physical-education-secondary-edexcel', 'physical-education'],
  ])('extracts subject from exam-board sequence %s', (input, expected) => {
    expect(deriveSubjectSlugFromSequence(input)).toBe(expected);
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

  it.each([
    ['science-secondary-aqa', 'secondary'],
    ['maths-primary-core', 'primary'],
  ])('extracts phase from exam-board sequence %s', (input, expected) => {
    expect(derivePhaseSlugFromSequence(input)).toBe(expected);
  });
});
