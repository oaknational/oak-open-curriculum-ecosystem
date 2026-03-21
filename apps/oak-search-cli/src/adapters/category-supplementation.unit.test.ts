/**
 * Unit tests for category supplementation.
 *
 * @see category-supplementation.ts
 */

import { describe, it, expect } from 'vitest';
import {
  buildCategoryMap,
  getCategoriesForUnit,
  extractCategoryTitles,
  type CategoryInfo,
  type SequenceUnitsData,
} from './category-supplementation';

describe('category-supplementation', () => {
  describe('buildCategoryMap', () => {
    it('builds a map of unit slugs to categories', () => {
      const sequenceData: SequenceUnitsData = [
        {
          year: 5,
          units: [
            {
              unitSlug: 'five-sentence-types',
              unitTitle: 'Five sentence types',
              categories: [{ categoryTitle: 'Grammar', categorySlug: 'grammar' }],
            },
            {
              unitSlug: 'verb-adjective-noun-suffixes',
              unitTitle: 'Verb, adjective and noun suffixes',
              categories: [{ categoryTitle: 'Spelling', categorySlug: 'spelling' }],
            },
          ],
        },
      ];

      const map = buildCategoryMap(sequenceData);

      expect(map.get('five-sentence-types')).toEqual([{ title: 'Grammar', slug: 'grammar' }]);
      expect(map.get('verb-adjective-noun-suffixes')).toEqual([
        { title: 'Spelling', slug: 'spelling' },
      ]);
    });

    it('handles units with multiple categories', () => {
      const sequenceData: SequenceUnitsData = [
        {
          year: 5,
          units: [
            {
              unitSlug: 'multi-category-unit',
              unitTitle: 'Multi Category Unit',
              categories: [
                { categoryTitle: 'Reading', categorySlug: 'reading' },
                { categoryTitle: 'Writing', categorySlug: 'writing' },
              ],
            },
          ],
        },
      ];

      const map = buildCategoryMap(sequenceData);

      expect(map.get('multi-category-unit')).toEqual([
        { title: 'Reading', slug: 'reading' },
        { title: 'Writing', slug: 'writing' },
      ]);
    });

    it('handles units without categories', () => {
      const sequenceData: SequenceUnitsData = [
        {
          year: 5,
          units: [
            {
              unitSlug: 'no-category-unit',
              unitTitle: 'No Category Unit',
              // No categories property
            },
          ],
        },
      ];

      const map = buildCategoryMap(sequenceData);

      expect(map.has('no-category-unit')).toBe(false);
    });

    it('handles empty categories array', () => {
      const sequenceData: SequenceUnitsData = [
        {
          year: 5,
          units: [
            {
              unitSlug: 'empty-category-unit',
              unitTitle: 'Empty Category Unit',
              categories: [],
            },
          ],
        },
      ];

      const map = buildCategoryMap(sequenceData);

      expect(map.has('empty-category-unit')).toBe(false);
    });

    it('handles multiple years', () => {
      const sequenceData: SequenceUnitsData = [
        {
          year: 4,
          units: [
            {
              unitSlug: 'year-4-unit',
              unitTitle: 'Year 4 Unit',
              categories: [{ categoryTitle: 'Grammar', categorySlug: 'grammar' }],
            },
          ],
        },
        {
          year: 5,
          units: [
            {
              unitSlug: 'year-5-unit',
              unitTitle: 'Year 5 Unit',
              categories: [{ categoryTitle: 'Spelling', categorySlug: 'spelling' }],
            },
          ],
        },
      ];

      const map = buildCategoryMap(sequenceData);

      expect(map.get('year-4-unit')).toEqual([{ title: 'Grammar', slug: 'grammar' }]);
      expect(map.get('year-5-unit')).toEqual([{ title: 'Spelling', slug: 'spelling' }]);
    });

    it('returns empty map for empty sequence data', () => {
      const map = buildCategoryMap([]);

      expect(map.size).toBe(0);
    });

    it('handles unit options (alternative units)', () => {
      const sequenceData: SequenceUnitsData = [
        {
          year: 5,
          units: [
            {
              unitSlug: undefined, // Parent has no slug
              unitTitle: 'Parent Unit',
              unitOptions: [
                { unitSlug: 'option-a', unitTitle: 'Option A' },
                { unitSlug: 'option-b', unitTitle: 'Option B' },
              ],
              categories: [{ categoryTitle: 'Reading', categorySlug: 'reading' }],
            },
          ],
        },
      ];

      const map = buildCategoryMap(sequenceData);

      // Options should inherit parent's categories
      expect(map.get('option-a')).toEqual([{ title: 'Reading', slug: 'reading' }]);
      expect(map.get('option-b')).toEqual([{ title: 'Reading', slug: 'reading' }]);
    });
  });

  describe('getCategoriesForUnit', () => {
    const categoryMap = new Map<string, readonly CategoryInfo[]>([
      ['unit-with-cats', [{ title: 'Grammar', slug: 'grammar' }]],
    ]);

    it('returns categories when found', () => {
      const result = getCategoriesForUnit(categoryMap, 'unit-with-cats');

      expect(result).toEqual([{ title: 'Grammar', slug: 'grammar' }]);
    });

    it('returns undefined when not found', () => {
      const result = getCategoriesForUnit(categoryMap, 'unknown-unit');

      expect(result).toBeUndefined();
    });
  });

  describe('extractCategoryTitles', () => {
    it('extracts titles from categories', () => {
      const categories: readonly CategoryInfo[] = [
        { title: 'Grammar', slug: 'grammar' },
        { title: 'Spelling', slug: 'spelling' },
      ];

      expect(extractCategoryTitles(categories)).toEqual(['Grammar', 'Spelling']);
    });

    it('returns undefined for undefined input', () => {
      expect(extractCategoryTitles(undefined)).toBeUndefined();
    });

    it('returns undefined for empty array', () => {
      expect(extractCategoryTitles([])).toBeUndefined();
    });
  });

  describe('buildCategoryMap — slug derivation', () => {
    it('derives slug from title when categorySlug is absent', () => {
      const sequenceData: SequenceUnitsData = [
        {
          year: 5,
          units: [
            {
              unitSlug: 'some-unit',
              unitTitle: 'Some Unit',
              categories: [{ categoryTitle: 'Number and Place Value' }],
            },
          ],
        },
      ];

      const map = buildCategoryMap(sequenceData);

      expect(map.get('some-unit')).toEqual([
        { title: 'Number and Place Value', slug: 'number-and-place-value' },
      ]);
    });
  });
});
