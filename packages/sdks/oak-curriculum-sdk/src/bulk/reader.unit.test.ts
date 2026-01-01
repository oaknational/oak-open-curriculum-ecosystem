/**
 * Unit tests for bulk download file reader.
 *
 * @remarks
 * Tests the PURE functions only. File system operations are tested separately
 * in integration tests.
 */
import { describe, expect, it } from 'vitest';

import { extractSubjectPhase } from './reader.js';

describe('extractSubjectPhase', () => {
  it('extracts subject and phase from filename', () => {
    const result = extractSubjectPhase('maths-primary.json');
    expect(result).toEqual({ subject: 'maths', phase: 'primary' });
  });

  it('extracts subject and phase from hyphenated subject', () => {
    const result = extractSubjectPhase('design-technology-secondary.json');
    expect(result).toEqual({ subject: 'design-technology', phase: 'secondary' });
  });

  it('extracts subject and phase from cooking-nutrition', () => {
    const result = extractSubjectPhase('cooking-nutrition-primary.json');
    expect(result).toEqual({ subject: 'cooking-nutrition', phase: 'primary' });
  });

  it('extracts subject and phase from religious-education', () => {
    const result = extractSubjectPhase('religious-education-secondary.json');
    expect(result).toEqual({ subject: 'religious-education', phase: 'secondary' });
  });

  it('extracts subject and phase from physical-education', () => {
    const result = extractSubjectPhase('physical-education-primary.json');
    expect(result).toEqual({ subject: 'physical-education', phase: 'primary' });
  });

  it('returns undefined for non-matching filename', () => {
    const result = extractSubjectPhase('random-file.txt');
    expect(result).toBeUndefined();
  });
});

