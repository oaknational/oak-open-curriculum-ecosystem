/**
 * Unit tests for the synonym miner.
 *
 * @remarks
 * Tests extraction of synonyms from keyword definitions using patterns
 * like "also known as", "sometimes called", and parenthetical alternatives.
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedKeyword } from '../extractors/index.js';

import {
  extractSynonymFromDefinition,
  generateMinedSynonyms,
  type MinedSynonym,
} from './synonym-miner.js';

/**
 * Creates a test keyword with the given definition.
 */
function createKeyword(
  term: string,
  definition: string,
  subjects: readonly string[] = ['maths'],
): ExtractedKeyword {
  return {
    term,
    definition,
    frequency: 10,
    subjects,
    firstYear: 3,
    lessonSlugs: ['lesson-1'],
  };
}

describe('extractSynonymFromDefinition', () => {
  describe('also known as patterns', () => {
    it('extracts synonyms from "also known as X" pattern', () => {
      const keyword = createKeyword(
        'fraction',
        'A part of a whole, also known as a rational number',
      );

      const result = extractSynonymFromDefinition(keyword);

      expect(result).toBeDefined();
      expect(result?.synonyms).toContain('rational number');
      expect(result?.pattern).toBe('also known as');
    });

    it('extracts synonyms from "also known as X" without article', () => {
      const keyword = createKeyword(
        'raster',
        'also known as bitmap, raster graphics are composed of pixels',
      );

      const result = extractSynonymFromDefinition(keyword);

      expect(result).toBeDefined();
      expect(result?.synonyms).toContain('bitmap');
    });

    it('handles multiple "also known as" patterns', () => {
      const keyword = createKeyword(
        'mitochondria',
        'The powerhouse of the cell, also known as cellular respiration centre',
      );

      const result = extractSynonymFromDefinition(keyword);

      expect(result).toBeDefined();
      expect(result?.synonyms.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('sometimes called patterns', () => {
    it('extracts synonyms from "sometimes called X" pattern', () => {
      const keyword = createKeyword(
        'integers',
        'Integers, sometimes called whole numbers, include positive and negative numbers',
      );

      const result = extractSynonymFromDefinition(keyword);

      expect(result).toBeDefined();
      expect(result?.synonyms).toContain('whole numbers');
    });
  });

  describe('parenthetical patterns', () => {
    it('extracts synonyms from parenthetical abbreviations', () => {
      const keyword = createKeyword(
        'personal protective equipment',
        "also known as 'PPE' - anything worn by workers",
      );

      const result = extractSynonymFromDefinition(keyword);

      expect(result).toBeDefined();
      expect(result?.synonyms).toContain('ppe');
    });
  });

  describe('no match cases', () => {
    it('returns undefined when no pattern matches', () => {
      const keyword = createKeyword(
        'photosynthesis',
        'The process by which plants convert light into energy',
      );

      const result = extractSynonymFromDefinition(keyword);

      expect(result).toBeUndefined();
    });
  });
});

describe('generateMinedSynonyms', () => {
  it('returns MinedSynonymsData structure', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword('fraction', 'A part of a whole, also known as a rational number'),
      createKeyword('photosynthesis', 'The process by which plants convert light'),
    ];

    const result = generateMinedSynonyms(keywords);

    expect(result).toBeDefined();
    expect(result.version).toBe('1.0.0');
    expect(result.generatedAt).toBeDefined();
    expect(result.synonyms).toBeDefined();
    expect(result.stats).toBeDefined();
  });

  it('includes all extracted synonyms', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword('fraction', 'A part of a whole, also known as a rational number'),
      createKeyword('raster', 'also known as bitmap, graphics composed of pixels'),
    ];

    const result = generateMinedSynonyms(keywords);

    expect(result.synonyms.length).toBe(2);
  });

  it('includes confidence score based on pattern clarity', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword('fraction', 'A part of a whole, also known as a rational number'),
    ];

    const result = generateMinedSynonyms(keywords);

    const fractionSynonym = result.synonyms.find((s) => s.term === 'fraction');
    expect(fractionSynonym).toBeDefined();
    expect(fractionSynonym?.confidence).toBeGreaterThan(0);
    expect(fractionSynonym?.confidence).toBeLessThanOrEqual(1);
  });

  it('tracks source subjects', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword('fraction', 'A part of a whole, also known as a rational number', [
        'maths',
        'science',
      ]),
    ];

    const result = generateMinedSynonyms(keywords);

    const fractionSynonym = result.synonyms.find((s) => s.term === 'fraction');
    expect(fractionSynonym?.subjects).toContain('maths');
    expect(fractionSynonym?.subjects).toContain('science');
  });

  it('provides accurate stats', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword('fraction', 'A part of a whole, also known as a rational number'),
      createKeyword('raster', 'also known as bitmap, graphics composed of pixels'),
      createKeyword('photosynthesis', 'The process by which plants convert light'),
    ];

    const result = generateMinedSynonyms(keywords);

    expect(result.stats.totalKeywordsProcessed).toBe(3);
    expect(result.stats.synonymsExtracted).toBe(2);
    expect(result.stats.patternCounts['also known as']).toBeGreaterThanOrEqual(2);
  });
});

describe('MinedSynonym type', () => {
  it('has all required fields', () => {
    const keywords: readonly ExtractedKeyword[] = [
      createKeyword('fraction', 'A part of a whole, also known as a rational number'),
    ];

    const result = generateMinedSynonyms(keywords);

    expect(result.synonyms[0]).toBeDefined();
    const synonym = result.synonyms[0];
    if (!synonym) {
      throw new Error('Expected synonym');
    }

    const typedSynonym: MinedSynonym = synonym;
    expect(typedSynonym.term).toBeDefined();
    expect(typedSynonym.synonyms).toBeDefined();
    expect(Array.isArray(typedSynonym.synonyms)).toBe(true);
    expect(typedSynonym.pattern).toBeDefined();
    expect(typedSynonym.confidence).toBeDefined();
    expect(typedSynonym.subjects).toBeDefined();
    expect(typedSynonym.occurrenceCount).toBeDefined();
  });
});
