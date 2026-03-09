import { describe, expect, it } from 'vitest';
import {
  resolveSearchIndexName,
  currentSearchIndexTarget,
  coerceSearchIndexTarget,
  createIndexResolver,
} from './search-index-target';

describe('search index target helpers', () => {
  it('resolves primary and sandbox index names', () => {
    expect(resolveSearchIndexName('lessons', 'primary')).toBe('oak_lessons');
    expect(resolveSearchIndexName('lessons', 'sandbox')).toBe('oak_lessons_sandbox');
  });

  it('returns the explicit target when provided', () => {
    expect(currentSearchIndexTarget('sandbox')).toBe('sandbox');
    expect(currentSearchIndexTarget('primary')).toBe('primary');
    expect(currentSearchIndexTarget({ SEARCH_INDEX_TARGET: 'sandbox' })).toBe('sandbox');
    expect(currentSearchIndexTarget({ SEARCH_INDEX_TARGET: 'primary' })).toBe('primary');
    expect(currentSearchIndexTarget()).toBe('primary');
  });

  it('coerces search index target values', () => {
    expect(coerceSearchIndexTarget('primary')).toBe('primary');
    expect(coerceSearchIndexTarget('sandbox')).toBe('sandbox');
    expect(coerceSearchIndexTarget('staging')).toBeNull();
    expect(coerceSearchIndexTarget(undefined)).toBeNull();
  });

  describe('createIndexResolver', () => {
    it('returns a function that resolves primary index names', () => {
      const resolve = createIndexResolver('primary');
      expect(resolve('lessons')).toBe('oak_lessons');
      expect(resolve('units')).toBe('oak_units');
      expect(resolve('unit_rollup')).toBe('oak_unit_rollup');
      expect(resolve('sequences')).toBe('oak_sequences');
      expect(resolve('sequence_facets')).toBe('oak_sequence_facets');
      expect(resolve('threads')).toBe('oak_threads');
    });

    it('returns a function that resolves sandbox index names', () => {
      const resolve = createIndexResolver('sandbox');
      expect(resolve('lessons')).toBe('oak_lessons_sandbox');
      expect(resolve('units')).toBe('oak_units_sandbox');
      expect(resolve('unit_rollup')).toBe('oak_unit_rollup_sandbox');
      expect(resolve('sequences')).toBe('oak_sequences_sandbox');
      expect(resolve('sequence_facets')).toBe('oak_sequence_facets_sandbox');
      expect(resolve('threads')).toBe('oak_threads_sandbox');
    });
  });
});
