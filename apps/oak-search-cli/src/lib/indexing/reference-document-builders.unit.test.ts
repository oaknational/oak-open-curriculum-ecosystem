/**
 * Unit tests for reference document builders.
 *
 * TDD approach: These tests were written FIRST to specify the desired behaviour.
 *
 */

import { describe, it, expect } from 'vitest';
import {
  createRefSubjectDocument,
  createRefKeyStageDocument,
  createGlossaryDocument,
  type CreateRefSubjectDocumentParams,
  type CreateRefKeyStageDocumentParams,
  type CreateGlossaryDocumentParams,
} from './reference-document-builders';

describe('createRefSubjectDocument', () => {
  const baseParams: CreateRefSubjectDocumentParams = {
    subjectSlug: 'maths',
    subjectTitle: 'Mathematics',
    keyStages: ['ks1', 'ks2', 'ks3', 'ks4'],
    sequenceCount: 8,
    unitCount: 120,
    lessonCount: 450,
    hasTiers: true,
  };

  it('should create a subject reference document with all required fields', () => {
    const doc = createRefSubjectDocument(baseParams);

    expect(doc.subject_slug).toBe('maths');
    expect(doc.subject_title).toBe('Mathematics');
    expect(doc.key_stages).toEqual(['ks1', 'ks2', 'ks3', 'ks4']);
    expect(doc.sequence_count).toBe(8);
    expect(doc.unit_count).toBe(120);
    expect(doc.lesson_count).toBe(450);
    expect(doc.has_tiers).toBe(true);
  });

  it('should generate a valid subject URL', () => {
    const doc = createRefSubjectDocument(baseParams);

    expect(doc.subject_url).toBe('https://www.thenational.academy/teachers/subjects/maths');
  });

  it('should handle subjects without tiers', () => {
    const doc = createRefSubjectDocument({
      ...baseParams,
      subjectSlug: 'english',
      subjectTitle: 'English',
      hasTiers: false,
    });

    expect(doc.has_tiers).toBe(false);
  });
});

describe('createRefKeyStageDocument', () => {
  const baseParams: CreateRefKeyStageDocumentParams = {
    keyStageSlug: 'ks4',
    keyStageTitle: 'Key Stage 4',
    phase: 'secondary',
    years: ['10', '11'],
    subjectCount: 12,
    unitCount: 200,
    lessonCount: 800,
  };

  it('should create a key stage reference document with all required fields', () => {
    const doc = createRefKeyStageDocument(baseParams);

    expect(doc.key_stage_slug).toBe('ks4');
    expect(doc.key_stage_title).toBe('Key Stage 4');
    expect(doc.phase).toBe('secondary');
    expect(doc.years).toEqual(['10', '11']);
    expect(doc.subject_count).toBe(12);
    expect(doc.unit_count).toBe(200);
    expect(doc.lesson_count).toBe(800);
  });

  it('should handle primary key stages', () => {
    const doc = createRefKeyStageDocument({
      ...baseParams,
      keyStageSlug: 'ks2',
      keyStageTitle: 'Key Stage 2',
      phase: 'primary',
      years: ['3', '4', '5', '6'],
    });

    expect(doc.key_stage_slug).toBe('ks2');
    expect(doc.phase).toBe('primary');
    expect(doc.years).toHaveLength(4);
  });
});

describe('createGlossaryDocument', () => {
  const baseParams: CreateGlossaryDocumentParams = {
    term: 'quadratic equations',
    definition:
      'An equation where the highest power of the variable is 2, in the form ax² + bx + c = 0',
    subjectSlugs: ['maths'],
    keyStages: ['ks4'],
    lessonIds: ['lesson-1', 'lesson-2', 'lesson-3'],
    usageCount: 12,
  };

  it('should create a glossary document with all required fields', () => {
    const doc = createGlossaryDocument(baseParams);

    expect(doc.term).toBe('quadratic equations');
    expect(doc.term_slug).toBe('quadratic-equations');
    expect(doc.definition).toBe(
      'An equation where the highest power of the variable is 2, in the form ax² + bx + c = 0',
    );
    expect(doc.subject_slugs).toEqual(['maths']);
    expect(doc.key_stages).toEqual(['ks4']);
    expect(doc.lesson_ids).toEqual(['lesson-1', 'lesson-2', 'lesson-3']);
    expect(doc.usage_count).toBe(12);
  });

  it('should generate a valid term slug from term', () => {
    const doc = createGlossaryDocument({
      ...baseParams,
      term: "Pythagoras' Theorem",
    });

    expect(doc.term_slug).toBe('pythagoras-theorem');
  });

  it('should handle terms without definitions', () => {
    const doc = createGlossaryDocument({
      ...baseParams,
      definition: undefined,
    });

    expect(doc.definition).toBeUndefined();
  });

  it('should handle terms appearing in multiple subjects', () => {
    const doc = createGlossaryDocument({
      ...baseParams,
      term: 'data',
      subjectSlugs: ['maths', 'science', 'computing'],
    });

    expect(doc.subject_slugs).toHaveLength(3);
  });
});
