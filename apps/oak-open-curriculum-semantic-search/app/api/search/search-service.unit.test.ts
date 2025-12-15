/**
 * @fileoverview Unit tests for search-service pure functions.
 *
 * Per the testing strategy:
 * - Unit tests test PURE functions in isolation
 * - NO mocks, NO IO, NO side effects
 * - Static imports only, no dynamic imports
 *
 * Functions that call other modules are integration tests and live in
 * separate files with `.integration.test.ts` suffix.
 *
 * @see `.agent/directives-and-memory/testing-strategy.md`
 */
import { describe, expect, it } from 'vitest';

import type { SearchStructuredRequest } from '@oaknational/oak-curriculum-sdk/public/search.js';

import { buildStructuredQuery, buildMultiScopeInput } from './search-service';
import { isMultiScopePayload } from './fixture-responses';

describe('search-service pure functions', () => {
  describe('buildStructuredQuery', () => {
    it('normalises structured query fields', () => {
      const query = buildStructuredQuery({
        scope: 'lessons',
        text: 'fractions',
        subject: 'maths',
        keyStage: 'ks2',
        minLessons: 5,
        size: 20,
        includeFacets: true,
      } as SearchStructuredRequest);

      expect(query.scope).toBe('lessons');
      expect(query.text).toBe('fractions');
      expect(query.subject).toBe('maths');
      expect(query.keyStage).toBe('ks2');
      expect(query.includeFacets).toBe(true);
    });

    it('filters invalid key stages', () => {
      const query = buildStructuredQuery({
        scope: 'lessons',
        text: 'test',
        keyStage: 'invalid' as never,
        includeFacets: false,
      } as SearchStructuredRequest);

      expect(query.keyStage).toBeUndefined();
    });

    it('filters invalid subjects', () => {
      const query = buildStructuredQuery({
        scope: 'lessons',
        text: 'test',
        subject: 'invalid' as never,
        includeFacets: false,
      } as SearchStructuredRequest);

      expect(query.subject).toBeUndefined();
    });
  });

  describe('buildMultiScopeInput', () => {
    it('derives multiscope input without scope', () => {
      const input = buildMultiScopeInput({
        scope: 'lessons',
        text: 'query',
        includeFacets: true,
      });

      expect(input).toEqual({ text: 'query', includeFacets: true });
      expect('scope' in input).toBe(false);
    });

    it('preserves all non-scope fields', () => {
      const input = buildMultiScopeInput({
        scope: 'units',
        text: 'fractions',
        subject: 'maths',
        keyStage: 'ks2',
        size: 10,
        from: 5,
        includeFacets: true,
      });

      expect(input.text).toBe('fractions');
      expect(input.subject).toBe('maths');
      expect(input.keyStage).toBe('ks2');
      expect(input.size).toBe(10);
      expect(input.from).toBe(5);
      expect(input.includeFacets).toBe(true);
    });
  });

  describe('isMultiScopePayload', () => {
    it('identifies multi-scope payloads via scope and buckets', () => {
      const multiScope = {
        scope: 'all',
        buckets: [],
        suggestionCache: { version: 'v1' },
      } as never;

      expect(isMultiScopePayload(multiScope)).toBe(true);
    });

    it('rejects single-scope payloads', () => {
      const singleScope = { scope: 'lessons', total: 0 } as never;

      expect(isMultiScopePayload(singleScope)).toBe(false);
    });

    it('rejects payloads without buckets', () => {
      const noBuckets = { scope: 'all', total: 0 } as never;

      expect(isMultiScopePayload(noBuckets)).toBe(false);
    });
  });
});
