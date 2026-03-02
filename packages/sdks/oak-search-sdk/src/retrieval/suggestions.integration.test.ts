/**
 * Integration tests for the suggest() function.
 *
 * Injects a fake completion client and a fake bool-prefix search
 * function via DI. Asserts query shapes and merge/dedup behaviour.
 * No network calls, no global state.
 */

import { describe, it, expect, vi } from 'vitest';
import type { SearchSdkConfig } from '../types/sdk.js';
import type { EsSearchRequest, EsSearchResponse } from '../internal/types.js';
import type { BoolPrefixSearchFn, TitleSourceDoc } from './suggest-bool-prefix.js';
import type { SuggestClient, SuggestRawResponse } from './suggestions.js';
import { suggest } from './suggestions.js';

const DEFAULT_SUGGEST_RESPONSE: SuggestRawResponse = {
  suggest: {
    suggestions: [
      {
        options: [{ text: 'photosynthesis' }, { text: 'photography' }],
      },
    ],
  },
};

function createFakeClient(response: SuggestRawResponse = DEFAULT_SUGGEST_RESPONSE) {
  const search = vi.fn<SuggestClient['search']>().mockResolvedValue(response);
  const client: SuggestClient = { search };
  return { client, search };
}

function emptyBoolPrefixResponse(): EsSearchResponse<TitleSourceDoc> {
  return {
    hits: { total: { value: 0, relation: 'eq' }, max_score: null, hits: [] },
    took: 1,
    timed_out: false,
  };
}

function createFakeDocSearch(
  response: EsSearchResponse<TitleSourceDoc> = emptyBoolPrefixResponse(),
): { docSearch: BoolPrefixSearchFn; calls: EsSearchRequest[] } {
  const calls: EsSearchRequest[] = [];
  const docSearch: BoolPrefixSearchFn = (body) => {
    calls.push(body);
    return Promise.resolve(response);
  };
  return { docSearch, calls };
}

function stubIndexResolver(): string {
  return 'oak_lessons_test';
}

const testConfig: SearchSdkConfig = { indexTarget: 'primary', indexVersion: 'v1' };

describe('suggest', () => {
  describe('completion query contexts', () => {
    it('includes contexts in ES completion query when subject and keyStage provided', async () => {
      const { client, search } = createFakeClient();
      const { docSearch } = createFakeDocSearch();

      await suggest(
        { prefix: 'photo', scope: 'lessons', subject: 'science', keyStage: 'ks3' },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      const arg = search.mock.calls[0]?.[0];
      expect(arg).toBeDefined();
      expect(arg?.suggest.suggestions.completion.contexts).toEqual({
        subject: ['science'],
        key_stage: ['ks3'],
      });
    });

    it('includes only subject context when keyStage not provided', async () => {
      const { client, search } = createFakeClient();
      const { docSearch } = createFakeDocSearch();

      await suggest(
        { prefix: 'photo', scope: 'lessons', subject: 'science' },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      const arg = search.mock.calls[0]?.[0];
      expect(arg?.suggest.suggestions.completion.contexts).toEqual({
        subject: ['science'],
      });
    });

    it('returns validation error when neither subject nor keyStage provided', async () => {
      const { client, search } = createFakeClient();
      const { docSearch } = createFakeDocSearch();

      const result = await suggest(
        { prefix: 'photo', scope: 'lessons' },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('validation_error');
        expect(result.error.message).toContain('subject');
      }
      expect(search).not.toHaveBeenCalled();
    });
  });

  describe('basic suggest behaviour', () => {
    it('returns suggestions from ES response', async () => {
      const { client } = createFakeClient();
      const { docSearch } = createFakeDocSearch();

      const result = await suggest(
        { prefix: 'photo', scope: 'lessons', subject: 'science' },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.suggestions).toHaveLength(2);
        expect(result.value.suggestions[0]).toHaveProperty('label', 'photosynthesis');
      }
    });

    it('returns validation error for empty prefix', async () => {
      const { client } = createFakeClient();
      const { docSearch } = createFakeDocSearch();

      const result = await suggest(
        { prefix: '  ', scope: 'lessons' },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('validation_error');
      }
    });
  });

  function extractMultiMatch(calls: EsSearchRequest[]) {
    const boolQuery = calls[0]?.query?.bool;
    const mustArray = boolQuery?.must;
    if (!Array.isArray(mustArray)) {
      throw new Error('Expected must to be an array');
    }
    return mustArray[0]?.multi_match;
  }

  describe('bool_prefix fallback', () => {
    it('runs bool_prefix query when completion returns fewer than limit results', async () => {
      const { client } = createFakeClient({
        suggest: { suggestions: [{ options: [{ text: 'fractions overview' }] }] },
      });
      const boolPrefixResponse: EsSearchResponse<TitleSourceDoc> = {
        hits: {
          total: { value: 2, relation: 'eq' },
          max_score: 5.0,
          hits: [
            {
              _index: 'oak_lessons_test',
              _id: 'lesson-2',
              _score: 5.0,
              _source: { lesson_title: 'Adding fractions' },
            },
            {
              _index: 'oak_lessons_test',
              _id: 'lesson-3',
              _score: 4.0,
              _source: { lesson_title: 'Fraction walls' },
            },
          ],
        },
        took: 2,
        timed_out: false,
      };
      const { docSearch, calls } = createFakeDocSearch(boolPrefixResponse);

      const result = await suggest(
        { prefix: 'frac', scope: 'lessons', subject: 'maths', limit: 5 },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      expect(calls).toHaveLength(1);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.suggestions.length).toBeGreaterThan(1);
      }
    });

    it('does NOT run bool_prefix when completion fills the limit', async () => {
      const fullCompletionResponse: SuggestRawResponse = {
        suggest: {
          suggestions: [
            {
              options: [
                { text: 'fractions overview' },
                { text: 'fractions adding' },
                { text: 'fractions subtracting' },
              ],
            },
          ],
        },
      };
      const { client } = createFakeClient(fullCompletionResponse);
      const { docSearch, calls } = createFakeDocSearch();

      await suggest(
        { prefix: 'frac', scope: 'lessons', subject: 'maths', limit: 3 },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      expect(calls).toHaveLength(0);
    });

    it('uses scope-appropriate bool_prefix fields for lessons', async () => {
      const { client } = createFakeClient({ suggest: { suggestions: [] } });
      const { docSearch, calls } = createFakeDocSearch();

      await suggest(
        { prefix: 'frac', scope: 'lessons', subject: 'maths' },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      expect(calls).toHaveLength(1);
      const multiMatch = extractMultiMatch(calls);
      expect(multiMatch?.fields).toEqual(
        expect.arrayContaining([
          'lesson_title.sa',
          'lesson_title.sa._2gram',
          'lesson_title.sa._3gram',
        ]),
      );
      expect(multiMatch?.type).toBe('bool_prefix');
    });

    it('uses scope-appropriate bool_prefix fields for units', async () => {
      const { client } = createFakeClient({ suggest: { suggestions: [] } });
      const { docSearch, calls } = createFakeDocSearch();

      await suggest(
        { prefix: 'algeb', scope: 'units', subject: 'maths' },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      expect(calls).toHaveLength(1);
      const multiMatch = extractMultiMatch(calls);
      expect(multiMatch?.fields).toEqual(
        expect.arrayContaining(['unit_title.sa', 'unit_title.sa._2gram', 'unit_title.sa._3gram']),
      );
    });

    it('deduplicates results between completion and bool_prefix by label', async () => {
      const { client } = createFakeClient({
        suggest: { suggestions: [{ options: [{ text: 'Adding fractions' }] }] },
      });
      const boolPrefixResponse: EsSearchResponse<TitleSourceDoc> = {
        hits: {
          total: { value: 2, relation: 'eq' },
          max_score: 5.0,
          hits: [
            {
              _index: 'oak_lessons_test',
              _id: 'lesson-1',
              _score: 5.0,
              _source: { lesson_title: 'Adding fractions' },
            },
            {
              _index: 'oak_lessons_test',
              _id: 'lesson-2',
              _score: 4.0,
              _source: { lesson_title: 'Fraction walls' },
            },
          ],
        },
        took: 2,
        timed_out: false,
      };
      const { docSearch } = createFakeDocSearch(boolPrefixResponse);

      const result = await suggest(
        { prefix: 'frac', scope: 'lessons', subject: 'maths', limit: 10 },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      expect(result.ok).toBe(true);
      if (result.ok) {
        const labels = result.value.suggestions.map((s) => s.label);
        expect(labels).toEqual(['Adding fractions', 'Fraction walls']);
      }
    });

    it('includes subject and keyStage filters in bool_prefix query', async () => {
      const { client } = createFakeClient({ suggest: { suggestions: [] } });
      const { docSearch, calls } = createFakeDocSearch();

      await suggest(
        { prefix: 'frac', scope: 'lessons', subject: 'maths', keyStage: 'ks3' },
        client,
        docSearch,
        stubIndexResolver,
        testConfig,
      );

      const filterClauses = calls[0]?.query?.bool?.filter;
      expect(filterClauses).toEqual(
        expect.arrayContaining([
          { term: { subject_slug: 'maths' } },
          { term: { key_stage: 'ks3' } },
        ]),
      );
    });
  });
});
