/**
 * Unit tests for bulk download file reader.
 *
 * @remarks
 * Tests the PURE functions only. File system operations are tested separately
 * in integration tests.
 */
import { describe, expect, it } from 'vitest';

import { isErr, isOk } from '@oaknational/result';
import {
  checkBulkFileSet,
  classifyBulkFilename,
  duplicateSequenceSlugs,
  extractSubjectPhase,
} from './reader-utils.js';

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

describe('classifyBulkFilename', () => {
  it('recognises a subject-phase data file', () => {
    expect(classifyBulkFilename('maths-primary.json')).toBe('data');
  });

  it('allows exactly the known non-data files to be skipped', () => {
    expect(classifyBulkFilename('manifest.json')).toBe('non-data');
    expect(classifyBulkFilename('schema.json')).toBe('non-data');
  });

  it('refuses to classify an unexpected name as skippable', () => {
    expect(classifyBulkFilename('science-secondary-part-2.json')).toBe('unrecognised');
    expect(classifyBulkFilename('notes.json')).toBe('unrecognised');
  });
});

describe('duplicateSequenceSlugs', () => {
  it('is empty when every file carries its own sequence', () => {
    expect(
      duplicateSequenceSlugs([
        { filename: 'maths-primary.json', sequenceSlug: 'maths-primary' },
        { filename: 'maths-secondary.json', sequenceSlug: 'maths-secondary' },
      ]),
    ).toStrictEqual([]);
  });

  it('names a sequence that two files carry, once, in first-seen order', () => {
    expect(
      duplicateSequenceSlugs([
        { filename: 'science-secondary.json', sequenceSlug: 'science-secondary' },
        { filename: 'maths-primary.json', sequenceSlug: 'maths-primary' },
        { filename: 'science-secondary-2.json', sequenceSlug: 'science-secondary' },
        { filename: 'science-secondary-3.json', sequenceSlug: 'science-secondary' },
      ]),
    ).toStrictEqual(['science-secondary']);
  });
});

describe('checkBulkFileSet', () => {
  it('accepts the shape the download has today: data files plus the manifest and schema', () => {
    expect(
      isOk(
        checkBulkFileSet([
          { filename: 'maths-primary.json', sequenceSlug: 'maths-primary' },
          { filename: 'manifest.json', sequenceSlug: undefined },
          { filename: 'schema.json', sequenceSlug: undefined },
        ]),
      ),
    ).toBe(true);
  });

  it('refuses an unrecognised file name rather than skipping it', () => {
    const result = checkBulkFileSet([
      { filename: 'science-secondary-part-2.json', sequenceSlug: undefined },
    ]);
    expect(isErr(result) && result.error.message).toContain('science-secondary-part-2.json');
  });

  it('refuses a sequence carried by more than one file', () => {
    const result = checkBulkFileSet([
      { filename: 'science-secondary.json', sequenceSlug: 'science-secondary' },
      { filename: 'combined-science-secondary.json', sequenceSlug: 'science-secondary' },
    ]);
    expect(isErr(result) && result.error.message).toContain('science-secondary');
  });
});
