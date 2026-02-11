/**
 * Unit tests for unit-document-core.
 *
 * @remarks
 * Tests the shared unit document builder that provides a single source
 * of truth for unit document creation (DRY compliance).
 *
 */
import { describe, it, expect } from 'vitest';
import { buildUnitDocument, type CreateUnitDocParams } from './unit-document-core';

/**
 * Creates minimal valid params for testing.
 */
function createMinimalParams(overrides?: Partial<CreateUnitDocParams>): CreateUnitDocParams {
  return {
    unitSlug: 'fractions-year-3',
    unitTitle: 'Fractions Year 3',
    subjectSlug: 'maths',
    subjectParent: 'maths',
    subjectTitle: 'Mathematics',
    keyStage: 'ks2',
    keyStageTitle: 'Key Stage 2',
    years: ['3'],
    lessonIds: ['lesson-1', 'lesson-2'],
    unitUrl: 'https://example.com/units/fractions-year-3',
    subjectProgrammesUrl: 'https://example.com/programmes/maths-ks2',
    threadInfo: {
      slugs: ['number-fractions'],
      titles: ['Number: Fractions'],
      orders: [1],
    },
    enrichment: {
      description: 'Learn about fractions',
      why_this_why_now: 'Foundation for future maths',
      prior_knowledge_requirements: ['Addition', 'Subtraction'],
      national_curriculum_content: ['NC1', 'NC2'],
    },
    ks4: undefined,
    ...overrides,
  };
}

describe('unit-document-core', () => {
  describe('buildUnitDocument', () => {
    it('builds a unit document with all required fields', () => {
      const params = createMinimalParams();

      const doc = buildUnitDocument(params);

      expect(doc.unit_id).toBe('fractions-year-3');
      expect(doc.unit_slug).toBe('fractions-year-3');
      expect(doc.unit_title).toBe('Fractions Year 3');
      expect(doc.subject_slug).toBe('maths');
      expect(doc.subject_title).toBe('Mathematics');
      expect(doc.key_stage).toBe('ks2');
      expect(doc.key_stage_title).toBe('Key Stage 2');
      expect(doc.doc_type).toBe('unit');
    });

    it('derives phase_slug as "primary" for KS1 units', () => {
      const params = createMinimalParams({ keyStage: 'ks1' });

      const doc = buildUnitDocument(params);

      expect(doc.phase_slug).toBe('primary');
    });

    it('derives phase_slug as "primary" for KS2 units', () => {
      const params = createMinimalParams({ keyStage: 'ks2' });

      const doc = buildUnitDocument(params);

      expect(doc.phase_slug).toBe('primary');
    });

    it('derives phase_slug as "secondary" for KS3 units', () => {
      const params = createMinimalParams({ keyStage: 'ks3' });

      const doc = buildUnitDocument(params);

      expect(doc.phase_slug).toBe('secondary');
    });

    it('derives phase_slug as "secondary" for KS4 units', () => {
      const params = createMinimalParams({ keyStage: 'ks4' });

      const doc = buildUnitDocument(params);

      expect(doc.phase_slug).toBe('secondary');
    });

    it('includes lesson IDs and count', () => {
      const params = createMinimalParams({
        lessonIds: ['lesson-a', 'lesson-b', 'lesson-c'],
      });

      const doc = buildUnitDocument(params);

      expect(doc.lesson_ids).toEqual(['lesson-a', 'lesson-b', 'lesson-c']);
      expect(doc.lesson_count).toBe(3);
    });

    it('includes years when provided', () => {
      const params = createMinimalParams({ years: ['3', '4'] });

      const doc = buildUnitDocument(params);

      expect(doc.years).toEqual(['3', '4']);
    });

    it('omits years when undefined', () => {
      const params = createMinimalParams({ years: undefined });

      const doc = buildUnitDocument(params);

      expect(doc.years).toBeUndefined();
    });

    it('includes thread info when provided', () => {
      const params = createMinimalParams({
        threadInfo: {
          slugs: ['thread-1', 'thread-2'],
          titles: ['Thread 1', 'Thread 2'],
          orders: [1, 2],
        },
      });

      const doc = buildUnitDocument(params);

      expect(doc.sequence_ids).toEqual(['thread-1', 'thread-2']);
      expect(doc.thread_slugs).toEqual(['thread-1', 'thread-2']);
      expect(doc.thread_titles).toEqual(['Thread 1', 'Thread 2']);
      expect(doc.thread_orders).toEqual([1, 2]);
    });

    it('handles empty thread arrays', () => {
      const params = createMinimalParams({
        threadInfo: { slugs: [], titles: [], orders: [] },
      });

      const doc = buildUnitDocument(params);

      expect(doc.sequence_ids).toBeUndefined();
      expect(doc.thread_slugs).toBeUndefined();
      expect(doc.thread_titles).toBeUndefined();
      expect(doc.thread_orders).toBeUndefined();
    });

    it('includes enrichment fields when provided', () => {
      const params = createMinimalParams({
        enrichment: {
          unit_topics: ['Fractions', 'Decimals'],
          description: 'Unit description',
          why_this_why_now: 'Important foundation',
          prior_knowledge_requirements: ['Addition'],
          national_curriculum_content: ['NC Statement'],
        },
      });

      const doc = buildUnitDocument(params);

      expect(doc.unit_topics).toEqual(['Fractions', 'Decimals']);
      expect(doc.description).toBe('Unit description');
      expect(doc.why_this_why_now).toBe('Important foundation');
      expect(doc.prior_knowledge_requirements).toEqual(['Addition']);
      expect(doc.national_curriculum_content).toEqual(['NC Statement']);
    });

    it('omits enrichment arrays when empty', () => {
      const params = createMinimalParams({
        enrichment: {
          unit_topics: [],
          description: 'Description',
          why_this_why_now: undefined,
          prior_knowledge_requirements: [],
          national_curriculum_content: [],
        },
      });

      const doc = buildUnitDocument(params);

      expect(doc.unit_topics).toBeUndefined();
      expect(doc.description).toBe('Description');
      expect(doc.why_this_why_now).toBeUndefined();
      expect(doc.prior_knowledge_requirements).toBeUndefined();
      expect(doc.national_curriculum_content).toBeUndefined();
    });

    it('includes title_suggest for autocomplete', () => {
      const params = createMinimalParams({
        threadInfo: { slugs: ['seq-1'], titles: ['Seq 1'], orders: [1] },
      });

      const doc = buildUnitDocument(params);

      expect(doc.title_suggest).toEqual({
        input: ['Fractions Year 3'],
        contexts: {
          subject: ['maths'],
          key_stage: ['ks2'],
          sequence: ['seq-1'],
        },
      });
    });

    it('handles empty sequence in title_suggest', () => {
      const params = createMinimalParams({ threadInfo: undefined });

      const doc = buildUnitDocument(params);

      expect(doc.title_suggest?.contexts?.sequence).toEqual([]);
    });

    it('spreads KS4 fields when provided', () => {
      const params = createMinimalParams({
        ks4: {
          tiers: ['foundation', 'higher'],
          tier_titles: ['Foundation', 'Higher'],
          exam_boards: ['aqa'],
          exam_board_titles: ['AQA'],
        },
      });

      const doc = buildUnitDocument(params);

      expect(doc.tiers).toEqual(['foundation', 'higher']);
      expect(doc.tier_titles).toEqual(['Foundation', 'Higher']);
      expect(doc.exam_boards).toEqual(['aqa']);
      expect(doc.exam_board_titles).toEqual(['AQA']);
    });

    describe('subject_parent from params (ADR-101)', () => {
      it('uses subjectParent param for subject_parent field', () => {
        const params = createMinimalParams({
          subjectSlug: 'physics',
          subjectParent: 'science',
        });

        const doc = buildUnitDocument(params);

        expect(doc.subject_slug).toBe('physics');
        expect(doc.subject_parent).toBe('science');
      });

      it('preserves distinct subject_slug and subject_parent for KS4 science variants', () => {
        const params = createMinimalParams({
          subjectSlug: 'chemistry',
          subjectParent: 'science',
          keyStage: 'ks4',
        });

        const doc = buildUnitDocument(params);

        expect(doc.subject_slug).toBe('chemistry');
        expect(doc.subject_parent).toBe('science');
        expect(doc.subject_slug).not.toBe(doc.subject_parent);
      });

      it('allows subject_parent to equal subject_slug for non-science subjects', () => {
        const params = createMinimalParams({
          subjectSlug: 'maths',
          subjectParent: 'maths',
        });

        const doc = buildUnitDocument(params);

        expect(doc.subject_slug).toBe('maths');
        expect(doc.subject_parent).toBe('maths');
      });

      it('sets subject_parent to science for combined-science', () => {
        const params = createMinimalParams({
          subjectSlug: 'combined-science',
          subjectParent: 'science',
          keyStage: 'ks4',
        });

        const doc = buildUnitDocument(params);

        expect(doc.subject_slug).toBe('combined-science');
        expect(doc.subject_parent).toBe('science');
      });
    });
  });
});
