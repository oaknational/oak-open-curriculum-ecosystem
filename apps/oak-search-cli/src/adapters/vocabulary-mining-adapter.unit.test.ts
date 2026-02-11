/**
 * Unit tests for VocabularyMiningAdapter.
 *
 * @remarks
 * Tests vocabulary extraction and synonym mining integration.
 * Uses fixtures based on bulk download data structure.
 */
import { describe, it, expect } from 'vitest';

import { createVocabularyMiningAdapter } from './vocabulary-mining-adapter';
import type { BulkDownloadFile } from '@oaknational/oak-curriculum-sdk/public/bulk';

// ============================================================================
// Test Fixtures
// ============================================================================

function createMinimalBulkFile(): BulkDownloadFile {
  return {
    sequenceSlug: 'maths-primary',
    subjectTitle: 'Maths',
    sequence: [
      {
        unitSlug: 'fractions-unit',
        unitTitle: 'Fractions',
        year: 3,
        yearSlug: 'year-3',
        keyStageSlug: 'ks2',
        unitLessons: [
          {
            lessonSlug: 'adding-fractions',
            lessonTitle: 'Adding fractions',
            lessonOrder: 1,
            state: 'published',
          },
        ],
        threads: [{ slug: 'number-fractions', title: 'Number: Fractions', order: 1 }],
        priorKnowledgeRequirements: ['Understanding of whole numbers'],
        nationalCurriculumContent: ['Add and subtract fractions with the same denominator'],
        whyThisWhyNow: 'Builds on whole number understanding',
        description: 'Introduction to fractions',
      },
    ],
    lessons: [
      {
        lessonSlug: 'adding-fractions',
        lessonTitle: 'Adding fractions',
        unitSlug: 'fractions-unit',
        unitTitle: 'Fractions',
        subjectSlug: 'maths',
        subjectTitle: 'Maths',
        keyStageSlug: 'ks2',
        keyStageTitle: 'Key Stage 2',
        transcript_sentences:
          'Today we will learn about adding fractions. Fractions are parts of a whole.',
        lessonKeywords: [
          {
            keyword: 'fraction',
            description:
              'A fraction (also known as a rational number) represents a part of a whole.',
          },
          {
            keyword: 'denominator',
            description: 'The denominator is the bottom number in a fraction.',
          },
        ],
        keyLearningPoints: [{ keyLearningPoint: 'Fractions represent parts of a whole' }],
        misconceptionsAndCommonMistakes: [
          {
            misconception: 'Adding numerators and denominators separately',
            response: 'Only add numerators when denominators are the same',
          },
        ],
        teacherTips: [
          {
            teacherTip: 'Use visual representations to show fraction addition',
          },
        ],
        pupilLessonOutcome: 'Add fractions with the same denominator',
        contentGuidance: null,
        supervisionLevel: null,
        downloadsavailable: true,
      },
    ],
  };
}

function createBulkFileWithSynonymPatterns(): BulkDownloadFile {
  const base = createMinimalBulkFile();
  const baseLesson = base.lessons[0];
  if (!baseLesson) {
    throw new Error('Test fixture missing base lesson');
  }
  return {
    ...base,
    lessons: [
      {
        ...baseLesson,
        lessonKeywords: [
          {
            keyword: 'numerator',
            // Format: "also known as X." where X is followed by period
            description:
              'The numerator, also known as the top number, is the number above the line.',
          },
          {
            keyword: 'equivalent fraction',
            // Format: "sometimes called X." where X is followed by period
            description: 'An equivalent fraction is sometimes called an equal fraction.',
          },
          {
            keyword: 'improper fraction',
            description: 'An improper fraction has a numerator larger than its denominator.',
          },
        ],
      },
    ],
  };
}

// ============================================================================
// Tests
// ============================================================================

describe('VocabularyMiningAdapter', () => {
  describe('createVocabularyMiningAdapter', () => {
    it('extracts keywords from lessons', () => {
      const bulkFile = createMinimalBulkFile();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const result = adapter.getVocabularyResult();

      expect(result.stats.uniqueKeywords).toBeGreaterThan(0);
      expect(result.extractedData.keywords.length).toBeGreaterThan(0);
    });

    it('extracts misconceptions from lessons', () => {
      const bulkFile = createMinimalBulkFile();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const result = adapter.getVocabularyResult();

      expect(result.stats.totalMisconceptions).toBeGreaterThan(0);
      expect(result.extractedData.misconceptions.length).toBeGreaterThan(0);
    });

    it('extracts learning points from lessons', () => {
      const bulkFile = createMinimalBulkFile();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const result = adapter.getVocabularyResult();

      expect(result.stats.totalLearningPoints).toBeGreaterThan(0);
      expect(result.extractedData.learningPoints.length).toBeGreaterThan(0);
    });

    it('extracts teacher tips from lessons', () => {
      const bulkFile = createMinimalBulkFile();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const result = adapter.getVocabularyResult();

      expect(result.stats.totalTeacherTips).toBeGreaterThan(0);
      expect(result.extractedData.teacherTips.length).toBeGreaterThan(0);
    });

    it('extracts prior knowledge from units', () => {
      const bulkFile = createMinimalBulkFile();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const result = adapter.getVocabularyResult();

      expect(result.stats.totalPriorKnowledge).toBeGreaterThan(0);
      expect(result.extractedData.priorKnowledge.length).toBeGreaterThan(0);
    });

    it('extracts NC statements from units', () => {
      const bulkFile = createMinimalBulkFile();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const result = adapter.getVocabularyResult();

      expect(result.stats.totalNCStatements).toBeGreaterThan(0);
      expect(result.extractedData.ncStatements.length).toBeGreaterThan(0);
    });

    it('extracts threads from units', () => {
      const bulkFile = createMinimalBulkFile();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const result = adapter.getVocabularyResult();

      expect(result.stats.uniqueThreads).toBeGreaterThan(0);
      expect(result.extractedData.threads.length).toBeGreaterThan(0);
    });
  });

  describe('synonym mining', () => {
    it('mines synonyms from keyword definitions with "also known as"', () => {
      const bulkFile = createBulkFileWithSynonymPatterns();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const synonyms = adapter.getMinedSynonyms();

      expect(synonyms.stats.synonymsExtracted).toBeGreaterThan(0);
      // Should find "the top number" from "also known as the top number,"
      const numeratorSynonyms = synonyms.synonyms.find((s) => s.term === 'numerator');
      expect(numeratorSynonyms?.synonyms).toContain('the top number');
    });

    it('mines synonyms from keyword definitions with "sometimes called"', () => {
      const bulkFile = createBulkFileWithSynonymPatterns();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const synonyms = adapter.getMinedSynonyms();

      // Should find "equal fraction" from "sometimes called an equal fraction"
      const eqFracSynonyms = synonyms.synonyms.find((s) => s.term === 'equivalent fraction');
      expect(eqFracSynonyms?.synonyms).toContain('equal fraction');
    });

    it('returns empty synonyms when no patterns match', () => {
      const bulkFile = createMinimalBulkFile();
      const firstLesson = bulkFile.lessons[0];
      if (!firstLesson) {
        throw new Error('Test fixture missing first lesson');
      }
      // Update keywords to have no synonym patterns
      firstLesson.lessonKeywords = [
        {
          keyword: 'fraction',
          description: 'A part of a whole number.',
        },
      ];
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const synonyms = adapter.getMinedSynonyms();

      expect(synonyms.stats.synonymsExtracted).toBe(0);
    });
  });

  describe('getStats', () => {
    it('returns comprehensive statistics', () => {
      const bulkFile = createMinimalBulkFile();
      const adapter = createVocabularyMiningAdapter([bulkFile]);

      const stats = adapter.getStats();

      expect(stats.filesProcessed).toBe(1);
      expect(stats.totalLessons).toBe(1);
      expect(stats.totalUnits).toBe(1);
      expect(typeof stats.uniqueKeywords).toBe('number');
      expect(typeof stats.totalMisconceptions).toBe('number');
      expect(typeof stats.totalLearningPoints).toBe('number');
      expect(typeof stats.totalTeacherTips).toBe('number');
      expect(typeof stats.totalPriorKnowledge).toBe('number');
      expect(typeof stats.totalNCStatements).toBe('number');
      expect(typeof stats.uniqueThreads).toBe('number');
      expect(typeof stats.synonymsExtracted).toBe('number');
    });
  });

  describe('multiple bulk files', () => {
    it('aggregates vocabulary across multiple files', () => {
      const file1 = createMinimalBulkFile();
      const baseUnit = file1.sequence[0];
      const baseLesson = file1.lessons[0];
      if (!baseUnit || !baseLesson) {
        throw new Error('Test fixture missing base unit or lesson');
      }
      const file2: BulkDownloadFile = {
        ...createMinimalBulkFile(),
        sequenceSlug: 'english-primary',
        subjectTitle: 'English',
        sequence: [
          {
            ...baseUnit,
            unitSlug: 'grammar-unit',
            unitTitle: 'Grammar',
          },
        ],
        lessons: [
          {
            ...baseLesson,
            lessonSlug: 'nouns-lesson',
            lessonTitle: 'Nouns',
            unitSlug: 'grammar-unit',
            subjectSlug: 'english',
            subjectTitle: 'English',
            lessonKeywords: [
              { keyword: 'noun', description: 'A word that names a person, place, or thing.' },
            ],
          },
        ],
      };

      const adapter = createVocabularyMiningAdapter([file1, file2]);
      const stats = adapter.getStats();

      expect(stats.filesProcessed).toBe(2);
      expect(stats.totalLessons).toBe(2);
      expect(stats.totalUnits).toBe(2);
      // Keywords from both files
      expect(stats.uniqueKeywords).toBeGreaterThanOrEqual(2);
    });
  });
});
