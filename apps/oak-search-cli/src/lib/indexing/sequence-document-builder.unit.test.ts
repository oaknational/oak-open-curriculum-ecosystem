/**
 * Unit tests for sequence document builder.
 *
 * TDD approach: These tests were written FIRST to specify the desired behaviour.
 *
 */

import { describe, it, expect } from 'vitest';
import {
  createSequenceDocument,
  type CreateSequenceDocumentParams,
} from './sequence-document-builder';

describe('createSequenceDocument', () => {
  const baseParams: CreateSequenceDocumentParams = {
    sequenceSlug: 'maths-secondary',
    subjectSlug: 'maths',
    subjectTitle: 'Mathematics',
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    keyStages: ['ks3', 'ks4'],
    years: ['7', '8', '9', '10', '11'],
    unitSlugs: ['algebra-1', 'geometry-1', 'number-1'],
    categoryTitles: ['Algebra', 'Geometry', 'Number'],
    sequenceSemantic: 'Mathematics Secondary is a Mathematics Secondary curriculum sequence.',
  };

  it('should create a sequence document with all required fields', () => {
    const doc = createSequenceDocument(baseParams);

    expect(doc.sequence_id).toBe('maths-secondary');
    expect(doc.sequence_slug).toBe('maths-secondary');
    expect(doc.sequence_title).toBe('Mathematics Secondary');
    expect(doc.subject_slug).toBe('maths');
    expect(doc.subject_title).toBe('Mathematics');
    expect(doc.phase_slug).toBe('secondary');
    expect(doc.phase_title).toBe('Secondary');
    expect(doc.key_stages).toEqual(['ks3', 'ks4']);
    expect(doc.years).toEqual(['7', '8', '9', '10', '11']);
    expect(doc.unit_slugs).toEqual(['algebra-1', 'geometry-1', 'number-1']);
    expect(doc.category_titles).toEqual(['Algebra', 'Geometry', 'Number']);
    expect(doc.sequence_url).toContain('maths-secondary');
  });

  it('should handle primary phase sequences', () => {
    const doc = createSequenceDocument({
      ...baseParams,
      sequenceSlug: 'english-primary',
      subjectSlug: 'english',
      subjectTitle: 'English',
      phaseSlug: 'primary',
      phaseTitle: 'Primary',
      keyStages: ['ks1', 'ks2'],
      years: ['1', '2', '3', '4', '5', '6'],
    });

    expect(doc.sequence_title).toBe('English Primary');
    expect(doc.phase_slug).toBe('primary');
    expect(doc.key_stages).toEqual(['ks1', 'ks2']);
  });

  it('should handle sequences with empty unit slugs', () => {
    const doc = createSequenceDocument({
      ...baseParams,
      unitSlugs: [],
    });

    expect(doc.unit_slugs).toEqual([]);
  });

  it('should handle sequences with empty category titles', () => {
    const doc = createSequenceDocument({
      ...baseParams,
      categoryTitles: [],
    });

    expect(doc.category_titles).toEqual([]);
  });

  it('should generate a valid sequence URL', () => {
    const doc = createSequenceDocument(baseParams);

    expect(doc.sequence_url).toBe(
      'https://www.thenational.academy/teachers/curriculum/maths-secondary/units',
    );
  });

  it('should include title_suggest with correct contexts', () => {
    const doc = createSequenceDocument(baseParams);

    expect(doc.title_suggest).toBeDefined();
    expect(doc.title_suggest?.input).toContain('Mathematics Secondary');
    expect(doc.title_suggest?.contexts).toEqual({
      subject: ['maths'],
      phase: ['secondary'],
    });
  });

  it('should populate sequence_semantic from params', () => {
    const doc = createSequenceDocument(baseParams);

    expect(doc.sequence_semantic).toBe(
      'Mathematics Secondary is a Mathematics Secondary curriculum sequence.',
    );
  });

  it('should fail fast when sequenceSemantic is empty or whitespace', () => {
    expect(() => createSequenceDocument({ ...baseParams, sequenceSemantic: '   ' })).toThrow(
      /sequenceSemantic/i,
    );
  });
});
