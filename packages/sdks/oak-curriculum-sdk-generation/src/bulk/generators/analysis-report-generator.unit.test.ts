/**
 * Unit tests for the analysis report generator.
 *
 * @remarks
 * Tests the generation of exploratory analysis reports from extracted data.
 * These reports provide insights into vocabulary patterns, synonym opportunities,
 * and misconception density to inform subsequent generators.
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedData } from '../processing.js';

import { generateAnalysisReport, type AnalysisReport } from './analysis-report-generator.js';

/**
 * Creates minimal test fixtures for extracted data.
 */
function createTestExtractedData(overrides: Partial<ExtractedData> = {}): ExtractedData {
  return {
    keywords: [
      {
        term: 'photosynthesis',
        definition: 'The process by which plants convert light into energy',
        frequency: 15,
        subjects: ['science'],
        firstYear: 3,
        lessonSlugs: ['lesson-1', 'lesson-2'],
      },
      {
        term: 'fraction',
        definition: 'A part of a whole, also known as a rational number',
        frequency: 42,
        subjects: ['maths', 'science'],
        firstYear: 2,
        lessonSlugs: ['lesson-3', 'lesson-4', 'lesson-5'],
      },
      {
        term: 'equation',
        definition: 'A mathematical statement showing equality',
        frequency: 30,
        subjects: ['maths'],
        firstYear: 4,
        lessonSlugs: ['lesson-6'],
      },
    ],
    misconceptions: [
      {
        misconception: 'Plants get food from the soil',
        response: 'Plants make their own food through photosynthesis',
        subject: 'science',
        keyStage: 'ks2',
        lessonSlug: 'lesson-1',
        lessonTitle: 'Photosynthesis Basics',
      },
      {
        misconception: 'Fractions are always less than 1',
        response: 'Fractions can be greater than 1 when the numerator exceeds the denominator',
        subject: 'maths',
        keyStage: 'ks2',
        lessonSlug: 'lesson-3',
        lessonTitle: 'Understanding Fractions',
      },
    ],
    learningPoints: [
      {
        learningPoint: 'Understand photosynthesis',
        lessonSlug: 'lesson-1',
        lessonTitle: 'Photosynthesis Basics',
        subject: 'science',
        keyStage: 'ks2',
      },
    ],
    teacherTips: [
      {
        tip: 'Use visual diagrams',
        lessonSlug: 'lesson-1',
        lessonTitle: 'Photosynthesis Basics',
        subject: 'science',
        keyStage: 'ks2',
      },
    ],
    priorKnowledge: [
      {
        requirement: 'Know basic plant parts',
        unitSlug: 'plants-unit',
        unitTitle: 'Plants Unit',
        subject: 'science',
        keyStage: 'ks2',
        year: 3,
      },
    ],
    ncStatements: [
      {
        statement: 'Identify and describe the functions of different parts of flowering plants',
        unitSlug: 'plants-unit',
        unitTitle: 'Plants Unit',
        subject: 'science',
        keyStage: 'ks2',
      },
    ],
    threads: [
      {
        slug: 'plants-and-photosynthesis',
        title: 'Plants and Photosynthesis',
        units: [
          {
            unitSlug: 'plants-unit',
            unitTitle: 'Plants Unit',
            order: 1,
            subject: 'science',
            keyStage: 'ks2',
            year: 3,
          },
        ],
        firstYear: 3,
        lastYear: 3,
      },
    ],
    ...overrides,
  };
}

describe('generateAnalysisReport', () => {
  it('returns an AnalysisReport structure', () => {
    const extractedData = createTestExtractedData();

    const report = generateAnalysisReport(extractedData);

    expect(report).toBeDefined();
    expect(report.generatedAt).toBeDefined();
    expect(report.keywordStats).toBeDefined();
    expect(report.synonymPatterns).toBeDefined();
    expect(report.misconceptionDensity).toBeDefined();
    expect(report.ncCoverage).toBeDefined();
  });

  describe('keywordStats', () => {
    it('identifies top keywords by frequency', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.keywordStats.topByFrequency).toHaveLength(3);
      expect(report.keywordStats.topByFrequency[0]?.term).toBe('fraction');
      expect(report.keywordStats.topByFrequency[0]?.frequency).toBe(42);
    });

    it('identifies cross-subject terms', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.keywordStats.crossSubjectTerms).toHaveLength(1);
      expect(report.keywordStats.crossSubjectTerms[0]?.term).toBe('fraction');
      expect(report.keywordStats.crossSubjectTerms[0]?.subjectCount).toBe(2);
    });

    it('tracks first-year distribution', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.keywordStats.firstYearDistribution).toBeDefined();
      expect(report.keywordStats.firstYearDistribution[2]).toBe(1); // fraction
      expect(report.keywordStats.firstYearDistribution[3]).toBe(1); // photosynthesis
      expect(report.keywordStats.firstYearDistribution[4]).toBe(1); // equation
    });
  });

  describe('synonymPatterns', () => {
    it('counts "also known as" patterns in definitions', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.synonymPatterns.alsoKnownAsCount).toBeGreaterThanOrEqual(1);
    });

    it('extracts synonym candidates from definitions', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.synonymPatterns.candidates).toBeDefined();
      // 'fraction' has 'also known as a rational number' in definition
      const fractionCandidate = report.synonymPatterns.candidates.find(
        (c) => c.term === 'fraction',
      );
      expect(fractionCandidate).toBeDefined();
      expect(fractionCandidate?.synonyms).toContain('rational number');
    });
  });

  describe('misconceptionDensity', () => {
    it('groups misconceptions by subject', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.misconceptionDensity.bySubject).toBeDefined();
      expect(report.misconceptionDensity.bySubject['science']).toBe(1);
      expect(report.misconceptionDensity.bySubject['maths']).toBe(1);
    });

    it('identifies top misconception subjects', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.misconceptionDensity.topSubjects).toBeDefined();
      expect(report.misconceptionDensity.topSubjects.length).toBeGreaterThan(0);
    });
  });

  describe('ncCoverage', () => {
    it('counts NC statements by subject', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.ncCoverage.bySubject).toBeDefined();
      expect(report.ncCoverage.bySubject['science']).toBe(1);
    });

    it('identifies subjects with most/fewest statements', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.ncCoverage.mostStatements).toBeDefined();
      expect(report.ncCoverage.fewestStatements).toBeDefined();
    });
  });

  describe('summary statistics', () => {
    it('includes total counts', () => {
      const extractedData = createTestExtractedData();

      const report = generateAnalysisReport(extractedData);

      expect(report.summary.totalKeywords).toBe(3);
      expect(report.summary.totalMisconceptions).toBe(2);
      expect(report.summary.totalNCStatements).toBe(1);
      expect(report.summary.totalThreads).toBe(1);
    });
  });
});

describe('AnalysisReport type', () => {
  it('has all required fields', () => {
    const extractedData = createTestExtractedData();
    const report: AnalysisReport = generateAnalysisReport(extractedData);

    // Type assertion ensures the interface is complete
    expect(report.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(typeof report.keywordStats.totalUniqueKeywords).toBe('number');
    expect(Array.isArray(report.keywordStats.topByFrequency)).toBe(true);
    expect(Array.isArray(report.keywordStats.crossSubjectTerms)).toBe(true);
    expect(typeof report.synonymPatterns.alsoKnownAsCount).toBe('number');
    expect(Array.isArray(report.synonymPatterns.candidates)).toBe(true);
    expect(typeof report.misconceptionDensity.total).toBe('number');
  });
});
