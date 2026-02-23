/**
 * Integration tests for the suggest() function.
 *
 * Tests query construction by injecting a mock ES client and asserting
 * the query shape passed to client.search(). No network calls.
 */

import { describe, it, expect, vi } from 'vitest';
import type { Client } from '@elastic/elasticsearch';
import type { SearchSdkConfig } from '../types/sdk.js';
import { suggest } from './suggestions.js';

function createMockClient(suggestResponse?: unknown): Client {
  return {
    search: vi.fn().mockResolvedValue(
      suggestResponse ?? {
        suggest: {
          suggestions: [
            {
              options: [{ text: 'photosynthesis' }, { text: 'photography' }],
            },
          ],
        },
      },
    ),
  } as unknown as Client;
}

function stubIndexResolver(): string {
  return 'oak_lessons_test';
}

const testConfig: SearchSdkConfig = { indexTarget: 'primary', indexVersion: 'v1' };

interface CompletionQuery {
  suggest: {
    suggestions: {
      completion: {
        contexts?: { subject?: string[]; key_stage?: string[] };
      };
    };
  };
}

function isNonNullObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isCompletionQuery(value: unknown): value is CompletionQuery {
  if (!isNonNullObject(value) || !('suggest' in value)) {
    return false;
  }
  if (!isNonNullObject(value.suggest) || !('suggestions' in value.suggest)) {
    return false;
  }
  return isNonNullObject(value.suggest.suggestions) && 'completion' in value.suggest.suggestions;
}

function extractCompletion(
  client: Client,
): CompletionQuery['suggest']['suggestions']['completion'] {
  const searchCall = vi.mocked(client.search).mock.calls[0];
  if (!searchCall) {
    throw new Error('Expected client.search to have been called');
  }
  const query = searchCall[0];
  if (!isCompletionQuery(query)) {
    throw new Error(`Expected completion query shape, got: ${JSON.stringify(query)}`);
  }
  return query.suggest.suggestions.completion;
}

describe('suggest', () => {
  describe('completion query contexts (Snag 1)', () => {
    it('includes contexts in ES completion query when subject and keyStage provided', async () => {
      const client = createMockClient();

      await suggest(
        { prefix: 'photo', scope: 'lessons', subject: 'science', keyStage: 'ks3' },
        client,
        stubIndexResolver,
        testConfig,
      );

      const completion = extractCompletion(client);
      expect(completion).toHaveProperty('contexts');
      expect(completion.contexts).toEqual({
        subject: ['science'],
        key_stage: ['ks3'],
      });
    });

    it('includes only subject context when keyStage not provided', async () => {
      const client = createMockClient();

      await suggest(
        { prefix: 'photo', scope: 'lessons', subject: 'science' },
        client,
        stubIndexResolver,
        testConfig,
      );

      const completion = extractCompletion(client);
      expect(completion.contexts).toEqual({
        subject: ['science'],
      });
    });

    it('returns validation error when neither subject nor keyStage provided', async () => {
      const client = createMockClient();

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
      expect(vi.mocked(client.search)).not.toHaveBeenCalled();
    });
  });

  describe('basic suggest behaviour', () => {
    it('returns suggestions from ES response', async () => {
      const client = createMockClient();

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
      const client = createMockClient();

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
