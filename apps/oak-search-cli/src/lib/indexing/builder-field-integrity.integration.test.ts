import { describe, expect, it } from 'vitest';
import { SEARCH_FIELD_INVENTORY } from '@oaknational/search-contracts';
import { buildLessonDocument, type CreateLessonDocParams } from './lesson-document-core.js';
import {
  createSequenceDocument,
  type CreateSequenceDocumentParams,
} from './sequence-document-builder.js';

function createLessonParams(): CreateLessonDocParams {
  return {
    lessonSlug: 'intro-fractions',
    lessonTitle: 'Intro Fractions',
    subjectSlug: 'maths',
    subjectParent: 'maths',
    subjectTitle: 'Mathematics',
    keyStage: 'ks2',
    keyStageTitle: 'Key Stage 2',
    years: ['3'],
    units: [
      {
        unitSlug: 'fractions-year-3',
        unitTitle: 'Fractions Year 3',
        canonicalUrl: 'https://example.com/units/fractions-year-3',
      },
    ],
    unitCount: 1,
    threadSlugs: ['number-fractions'],
    threadTitles: ['Number: Fractions'],
    lessonKeywords: ['fraction'],
    keyLearningPoints: ['Understand fractions'],
    misconceptions: ['Bigger denominator means bigger fraction'],
    teacherTips: ['Use bar models'],
    contentGuidance: undefined,
    transcript: 'Fractions are parts of a whole.',
    lessonStructure: 'Intro Fractions is a KS2 maths lesson.',
    lessonUrl: 'https://example.com/lessons/intro-fractions',
    pupilLessonOutcome: 'I can identify fractions',
    supervisionLevel: undefined,
    downloadsAvailable: true,
    ks4: undefined,
  };
}

function createSequenceParams(): CreateSequenceDocumentParams {
  return {
    sequenceSlug: 'maths-primary',
    subjectSlug: 'maths',
    subjectTitle: 'Mathematics',
    phaseSlug: 'primary',
    phaseTitle: 'Primary',
    keyStages: ['ks1', 'ks2'],
    years: ['1', '2', '3', '4', '5', '6'],
    unitSlugs: ['fractions-year-3'],
    categoryTitles: ['Number'],
    sequenceSemantic: 'Mathematics Primary is a Mathematics Primary curriculum sequence.',
  };
}

describe('builder field integrity', () => {
  it('builds lesson fields that match shared inventory expectations', () => {
    const lessonDoc = buildLessonDocument(createLessonParams());
    const lessonInventory = SEARCH_FIELD_INVENTORY.filter(
      (entry) => entry.indexFamily === 'lessons',
    );

    for (const field of ['lesson_slug', 'thread_slugs', 'thread_titles', 'unit_ids'] as const) {
      expect(lessonInventory.some((entry) => entry.fieldName === field)).toBe(true);
      expect(field in lessonDoc).toBe(true);
    }
  });

  it('builds sequence category field with mapping-aligned semantics', () => {
    const sequenceDoc = createSequenceDocument(createSequenceParams());
    const sequenceCategoryField = SEARCH_FIELD_INVENTORY.find(
      (entry) => entry.indexFamily === 'sequences' && entry.fieldName === 'category_titles',
    );

    expect(sequenceCategoryField).toBeDefined();
    expect(sequenceCategoryField?.mappingType).toBe('text');
    expect(sequenceDoc.category_titles).toEqual(['Number']);
  });

  it('populates sequence_semantic per ADR-139 contract', () => {
    const sequenceDoc = createSequenceDocument(createSequenceParams());
    const semanticField = SEARCH_FIELD_INVENTORY.find(
      (entry) => entry.indexFamily === 'sequences' && entry.fieldName === 'sequence_semantic',
    );

    expect(semanticField).toBeDefined();
    expect(semanticField?.mappingType).toBe('semantic_text');
    expect(sequenceDoc.sequence_semantic).toBeDefined();
    expect(sequenceDoc.sequence_semantic?.trim().length).toBeGreaterThan(0);
  });
});
