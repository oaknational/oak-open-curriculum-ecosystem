/**
 * Unit tests for bulk-sequence-transformer.
 *
 * @remarks
 * Tests the transformation of bulk download sequence data into ES documents.
 * Tests are written TDD-style (RED phase) before implementation.
 *
 * @module adapters/bulk-sequence-transformer.unit.test
 */
import { describe, it, expect } from 'vitest';
import type { BulkDownloadFile } from '@oaknational/oak-curriculum-sdk/public/bulk';
import {
  extractSequenceParamsFromBulkFile,
  extractSequenceFacetParamsFromBulkFile,
  buildSequenceBulkOperations,
} from './bulk-sequence-transformer';

/**
 * Creates a minimal valid bulk file fixture for testing.
 */
function createMinimalBulkFile(overrides?: Partial<BulkDownloadFile>): BulkDownloadFile {
  return {
    sequenceSlug: 'maths-primary',
    subjectTitle: 'Mathematics',
    sequence: [
      {
        unitSlug: 'fractions-year-1',
        unitTitle: 'Fractions Year 1',
        year: 1,
        yearSlug: 'year-1',
        keyStageSlug: 'ks1',
        priorKnowledgeRequirements: [],
        nationalCurriculumContent: [],
        description: 'Learn about fractions in Year 1',
        threads: [],
        unitLessons: [
          { lessonSlug: 'lesson-1', lessonTitle: 'Lesson 1', lessonOrder: 1, state: 'published' },
          { lessonSlug: 'lesson-2', lessonTitle: 'Lesson 2', lessonOrder: 2, state: 'published' },
        ],
      },
      {
        unitSlug: 'fractions-year-2',
        unitTitle: 'Fractions Year 2',
        year: 2,
        yearSlug: 'year-2',
        keyStageSlug: 'ks1',
        priorKnowledgeRequirements: [],
        nationalCurriculumContent: [],
        description: 'Learn about fractions in Year 2',
        threads: [],
        unitLessons: [
          { lessonSlug: 'lesson-3', lessonTitle: 'Lesson 3', lessonOrder: 1, state: 'published' },
        ],
      },
      {
        unitSlug: 'fractions-year-3',
        unitTitle: 'Fractions Year 3',
        year: 3,
        yearSlug: 'year-3',
        keyStageSlug: 'ks2',
        priorKnowledgeRequirements: [],
        nationalCurriculumContent: [],
        description: 'Learn about fractions in Year 3',
        threads: [],
        unitLessons: [
          { lessonSlug: 'lesson-4', lessonTitle: 'Lesson 4', lessonOrder: 1, state: 'published' },
          { lessonSlug: 'lesson-5', lessonTitle: 'Lesson 5', lessonOrder: 2, state: 'published' },
        ],
      },
    ],
    lessons: [
      {
        lessonSlug: 'lesson-1',
        lessonTitle: 'Lesson 1',
        unitSlug: 'fractions-year-1',
        unitTitle: 'Fractions Year 1',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks1',
        keyStageTitle: 'Key Stage 1',
        lessonKeywords: [],
        keyLearningPoints: [],
        misconceptionsAndCommonMistakes: [],
        pupilLessonOutcome: '',
        teacherTips: [],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsavailable: true,
      },
      {
        lessonSlug: 'lesson-4',
        lessonTitle: 'Lesson 4',
        unitSlug: 'fractions-year-3',
        unitTitle: 'Fractions Year 3',
        subjectSlug: 'maths',
        subjectTitle: 'Mathematics',
        keyStageSlug: 'ks2',
        keyStageTitle: 'Key Stage 2',
        lessonKeywords: [],
        keyLearningPoints: [],
        misconceptionsAndCommonMistakes: [],
        pupilLessonOutcome: '',
        teacherTips: [],
        contentGuidance: null,
        supervisionLevel: null,
        downloadsavailable: true,
      },
    ],
    ...overrides,
  };
}

describe('bulk-sequence-transformer', () => {
  describe('extractSequenceParamsFromBulkFile', () => {
    it('extracts sequence params from a bulk file', () => {
      const bulkFile = createMinimalBulkFile();

      const params = extractSequenceParamsFromBulkFile(bulkFile);

      expect(params.sequenceSlug).toBe('maths-primary');
      expect(params.subjectSlug).toBe('maths');
      expect(params.subjectTitle).toBe('Mathematics');
      expect(params.phaseSlug).toBe('primary');
      expect(params.phaseTitle).toBe('Primary');
    });

    it('collects unique key stages from units', () => {
      const bulkFile = createMinimalBulkFile();

      const params = extractSequenceParamsFromBulkFile(bulkFile);

      expect(params.keyStages).toContain('ks1');
      expect(params.keyStages).toContain('ks2');
      expect(params.keyStages).toHaveLength(2);
    });

    it('collects unique years from units', () => {
      const bulkFile = createMinimalBulkFile();

      const params = extractSequenceParamsFromBulkFile(bulkFile);

      expect(params.years).toContain('1');
      expect(params.years).toContain('2');
      expect(params.years).toContain('3');
      expect(params.years).toHaveLength(3);
    });

    it('collects unit slugs from sequence', () => {
      const bulkFile = createMinimalBulkFile();

      const params = extractSequenceParamsFromBulkFile(bulkFile);

      expect(params.unitSlugs).toContain('fractions-year-1');
      expect(params.unitSlugs).toContain('fractions-year-2');
      expect(params.unitSlugs).toContain('fractions-year-3');
      expect(params.unitSlugs).toHaveLength(3);
    });

    it('derives subject slug from sequence slug for multi-word subjects', () => {
      const bulkFile = createMinimalBulkFile({
        sequenceSlug: 'design-technology-secondary',
        subjectTitle: 'Design Technology',
      });

      const params = extractSequenceParamsFromBulkFile(bulkFile);

      expect(params.subjectSlug).toBe('design-technology');
      expect(params.phaseSlug).toBe('secondary');
    });

    it('handles "All years" year value', () => {
      const bulkFile = createMinimalBulkFile({
        sequence: [
          {
            unitSlug: 'all-years-unit',
            unitTitle: 'All Years Unit',
            year: 'All years',
            yearSlug: 'all-years',
            keyStageSlug: 'ks1',
            priorKnowledgeRequirements: [],
            nationalCurriculumContent: [],
            description: 'A unit for all years',
            threads: [],
            unitLessons: [],
          },
        ],
      });

      const params = extractSequenceParamsFromBulkFile(bulkFile);

      // Should use yearSlug when year is "All years"
      expect(params.years).toContain('all-years');
    });
  });

  describe('extractSequenceFacetParamsFromBulkFile', () => {
    it('creates one facet params object per unique key stage', () => {
      const bulkFile = createMinimalBulkFile();

      const facetParams = extractSequenceFacetParamsFromBulkFile(bulkFile);

      // File has ks1 and ks2 units
      expect(facetParams).toHaveLength(2);
    });

    it('groups units by key stage', () => {
      const bulkFile = createMinimalBulkFile();

      const facetParams = extractSequenceFacetParamsFromBulkFile(bulkFile);

      // Find ks1 facet
      const ks1Facet = facetParams.find((f) => f.keyStage === 'ks1');
      expect(ks1Facet).toBeDefined();
      expect(ks1Facet?.unitSlugs).toContain('fractions-year-1');
      expect(ks1Facet?.unitSlugs).toContain('fractions-year-2');
      expect(ks1Facet?.unitSlugs).toHaveLength(2);

      // Find ks2 facet
      const ks2Facet = facetParams.find((f) => f.keyStage === 'ks2');
      expect(ks2Facet).toBeDefined();
      expect(ks2Facet?.unitSlugs).toContain('fractions-year-3');
      expect(ks2Facet?.unitSlugs).toHaveLength(1);
    });

    it('collects unit titles per key stage', () => {
      const bulkFile = createMinimalBulkFile();

      const facetParams = extractSequenceFacetParamsFromBulkFile(bulkFile);

      const ks1Facet = facetParams.find((f) => f.keyStage === 'ks1');
      expect(ks1Facet?.unitTitles).toContain('Fractions Year 1');
      expect(ks1Facet?.unitTitles).toContain('Fractions Year 2');
    });

    it('computes lesson count per key stage', () => {
      const bulkFile = createMinimalBulkFile();

      const facetParams = extractSequenceFacetParamsFromBulkFile(bulkFile);

      // ks1 has 2 + 1 = 3 lessons
      const ks1Facet = facetParams.find((f) => f.keyStage === 'ks1');
      expect(ks1Facet?.lessonCount).toBe(3);

      // ks2 has 2 lessons
      const ks2Facet = facetParams.find((f) => f.keyStage === 'ks2');
      expect(ks2Facet?.lessonCount).toBe(2);
    });

    it('collects years per key stage', () => {
      const bulkFile = createMinimalBulkFile();

      const facetParams = extractSequenceFacetParamsFromBulkFile(bulkFile);

      const ks1Facet = facetParams.find((f) => f.keyStage === 'ks1');
      expect(ks1Facet?.years).toContain('1');
      expect(ks1Facet?.years).toContain('2');
      expect(ks1Facet?.years).toHaveLength(2);

      const ks2Facet = facetParams.find((f) => f.keyStage === 'ks2');
      expect(ks2Facet?.years).toContain('3');
      expect(ks2Facet?.years).toHaveLength(1);
    });

    it('gets key stage title from lessons', () => {
      const bulkFile = createMinimalBulkFile();

      const facetParams = extractSequenceFacetParamsFromBulkFile(bulkFile);

      const ks1Facet = facetParams.find((f) => f.keyStage === 'ks1');
      expect(ks1Facet?.keyStageTitle).toBe('Key Stage 1');

      const ks2Facet = facetParams.find((f) => f.keyStage === 'ks2');
      expect(ks2Facet?.keyStageTitle).toBe('Key Stage 2');
    });

    it('sets hasKs4Options from bulk file', () => {
      const bulkFileWithKs4 = createMinimalBulkFile({
        ks4Options: [{ slug: 'aqa', title: 'AQA' }],
      });

      const facetParams = extractSequenceFacetParamsFromBulkFile(bulkFileWithKs4);

      expect(facetParams.every((f) => f.hasKs4Options)).toBe(true);
    });

    it('sets hasKs4Options false when no ks4Options', () => {
      const bulkFile = createMinimalBulkFile();

      const facetParams = extractSequenceFacetParamsFromBulkFile(bulkFile);

      expect(facetParams.every((f) => !f.hasKs4Options)).toBe(true);
    });

    it('includes shared sequence metadata in all facets', () => {
      const bulkFile = createMinimalBulkFile();

      const facetParams = extractSequenceFacetParamsFromBulkFile(bulkFile);

      for (const facet of facetParams) {
        expect(facet.sequenceSlug).toBe('maths-primary');
        expect(facet.subjectSlug).toBe('maths');
        expect(facet.phaseSlug).toBe('primary');
        expect(facet.phaseTitle).toBe('Primary');
      }
    });
  });

  describe('buildSequenceBulkOperations', () => {
    it('builds bulk operations for sequences and facets', () => {
      const bulkFile = createMinimalBulkFile();

      const operations = buildSequenceBulkOperations(
        [bulkFile],
        'oak_sequences',
        'oak_sequence_facets',
      );

      // Should have:
      // - 1 sequence doc (2 ops: action + doc)
      // - 2 facet docs (4 ops: 2 actions + 2 docs)
      // Total: 6 ops
      expect(operations.length).toBe(6);
    });

    it('builds sequence operations with correct index', () => {
      const bulkFile = createMinimalBulkFile();

      const operations = buildSequenceBulkOperations(
        [bulkFile],
        'oak_sequences',
        'oak_sequence_facets',
      );

      // First operation should be sequence index action
      const firstAction = operations[0];
      expect(firstAction).toHaveProperty('index');
      if ('index' in firstAction) {
        expect(firstAction.index._index).toBe('oak_sequences');
        expect(firstAction.index._id).toBe('maths-primary');
      }
    });

    it('builds facet operations with correct index and composite ID', () => {
      const bulkFile = createMinimalBulkFile();

      const operations = buildSequenceBulkOperations(
        [bulkFile],
        'oak_sequences',
        'oak_sequence_facets',
      );

      // Find a facet action (should be after the sequence ops)
      const facetActions = operations.filter(
        (op) => 'index' in op && op.index._index === 'oak_sequence_facets',
      );

      expect(facetActions.length).toBe(2); // ks1 and ks2

      // Check composite ID format: subject-sequence-keystage
      const ks1Action = facetActions.find(
        (op) => 'index' in op && op.index._id === 'maths-maths-primary-ks1',
      );
      expect(ks1Action).toBeDefined();
    });

    it('handles multiple bulk files', () => {
      const file1 = createMinimalBulkFile({ sequenceSlug: 'maths-primary' });
      const file2 = createMinimalBulkFile({
        sequenceSlug: 'science-primary',
        subjectTitle: 'Science',
        sequence: [
          {
            unitSlug: 'plants-year-1',
            unitTitle: 'Plants Year 1',
            year: 1,
            yearSlug: 'year-1',
            keyStageSlug: 'ks1',
            priorKnowledgeRequirements: [],
            nationalCurriculumContent: [],
            description: 'Learn about plants',
            threads: [],
            unitLessons: [],
          },
        ],
        lessons: [
          {
            lessonSlug: 'plant-lesson-1',
            lessonTitle: 'Plant Lesson 1',
            unitSlug: 'plants-year-1',
            unitTitle: 'Plants Year 1',
            subjectSlug: 'science',
            subjectTitle: 'Science',
            keyStageSlug: 'ks1',
            keyStageTitle: 'Key Stage 1',
            lessonKeywords: [],
            keyLearningPoints: [],
            misconceptionsAndCommonMistakes: [],
            pupilLessonOutcome: '',
            teacherTips: [],
            contentGuidance: null,
            supervisionLevel: null,
            downloadsavailable: true,
          },
        ],
      });

      const operations = buildSequenceBulkOperations(
        [file1, file2],
        'oak_sequences',
        'oak_sequence_facets',
      );

      // File 1: 1 sequence + 2 facets = 6 ops
      // File 2: 1 sequence + 1 facet = 4 ops
      // Total: 10 ops
      expect(operations.length).toBe(10);
    });

    it('returns empty array when no bulk files provided', () => {
      const operations = buildSequenceBulkOperations([], 'oak_sequences', 'oak_sequence_facets');

      expect(operations).toHaveLength(0);
    });
  });
});
