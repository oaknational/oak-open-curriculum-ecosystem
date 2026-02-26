/**
 * Integration test for synonym export utilities.
 *
 * Verifies that synonym builder functions produce structurally
 * correct output from the combined synonym data.
 */

import { describe, it, expect } from 'vitest';

import {
  buildElasticsearchSynonyms,
  buildSynonymLookup,
  buildPhraseVocabulary,
  serialiseElasticsearchSynonyms,
} from './synonym-export.js';

describe('buildElasticsearchSynonyms', () => {
  it('returns a synonym set with non-empty entries', () => {
    const result = buildElasticsearchSynonyms();
    expect(result.synonyms_set.length).toBeGreaterThan(0);
  });

  it('each entry has an id and synonyms string', () => {
    const result = buildElasticsearchSynonyms();
    for (const entry of result.synonyms_set) {
      expect(typeof entry.id).toBe('string');
      expect(entry.id.length).toBeGreaterThan(0);
      expect(typeof entry.synonyms).toBe('string');
      expect(entry.synonyms.length).toBeGreaterThan(0);
    }
  });
});

describe('buildSynonymLookup', () => {
  it('returns a non-empty map', () => {
    const result = buildSynonymLookup();
    expect(result.size).toBeGreaterThan(0);
  });

  it('maps known alternative to canonical form', () => {
    const result = buildSynonymLookup();
    expect(result.get('mathematics')).toBe('maths');
  });
});

describe('buildPhraseVocabulary', () => {
  it('returns a non-empty set of multi-word phrases', () => {
    const result = buildPhraseVocabulary();
    expect(result.size).toBeGreaterThan(0);
    for (const phrase of result) {
      expect(phrase).toContain(' ');
    }
  });
});

describe('serialiseElasticsearchSynonyms', () => {
  it('returns valid JSON', () => {
    const json = serialiseElasticsearchSynonyms();
    const parsed: unknown = JSON.parse(json);
    expect(parsed).toHaveProperty('synonyms_set');
  });
});
