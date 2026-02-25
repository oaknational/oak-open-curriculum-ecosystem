/**
 * Integration tests for the suggest() function.
 *
 * Injects a fake search client via DI and asserts the query shape
 * passed to search(). No network calls, no real ES client.
 */

import { describe, it, expect, vi } from 'vitest';
import type { SearchSdkConfig } from '../types/sdk.js';
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

function stubIndexResolver(): string {
  return 'oak_lessons_test';
}

const testConfig: SearchSdkConfig = { indexTarget: 'primary', indexVersion: 'v1' };

describe('suggest', () => {
  describe('completion query contexts', () => {
    it('includes contexts in ES completion query when subject and keyStage provided', async () => {
      const { client, search } = createFakeClient();

      await suggest(
        { prefix: 'photo', scope: 'lessons', subject: 'science', keyStage: 'ks3' },
        client,
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

      await suggest(
        { prefix: 'photo', scope: 'lessons', subject: 'science' },
        client,
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

      const result = await suggest(
        { prefix: 'photo', scope: 'lessons' },
        client,
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

      const result = await suggest(
        { prefix: 'photo', scope: 'lessons', subject: 'science' },
        client,
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

      const result = await suggest(
        { prefix: '  ', scope: 'lessons' },
        client,
        stubIndexResolver,
        testConfig,
      );

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error.type).toBe('validation_error');
      }
    });
  });
});
