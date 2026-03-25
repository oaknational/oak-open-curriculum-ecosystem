import { describe, expect, it } from 'vitest';
import { SEARCH_FIELD_INVENTORY } from '@oaknational/search-contracts';
import { buildSequenceFilters } from './rrf-query-helpers.js';

describe('search field integrity unit contracts', () => {
  it('uses match_phrase semantics for category_titles text mapping', () => {
    const filters = buildSequenceFilters({
      query: 'science',
      category: 'physics',
    });
    let categoryFilter:
      | {
          readonly match_phrase?: {
            readonly category_titles?: string;
          };
        }
      | undefined;
    for (const entry of filters) {
      if (entry === undefined) {
        continue;
      }
      if (entry.match_phrase !== undefined) {
        categoryFilter = entry;
      }
    }
    const categoryInventoryField = SEARCH_FIELD_INVENTORY.find(
      (entry) => entry.indexFamily === 'sequences' && entry.fieldName === 'category_titles',
    );

    expect(categoryInventoryField).toBeDefined();
    expect(categoryInventoryField?.mappingType).toBe('text');
    expect(categoryFilter).toEqual({ match_phrase: { category_titles: 'physics' } });
  });
});
