import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { estypes } from '@elastic/elasticsearch';
import type {
  SearchLessonsIndexDoc,
  SearchSequenceIndexDoc,
  SearchUnitRollupDoc,
} from '../../types/oak';

type SearchFn = (
  request: estypes.SearchRequest,
) => Promise<estypes.SearchResponse<unknown, Record<string, estypes.AggregationsAggregate>>>;

const searchMock = vi.fn<SearchFn>();

vi.mock('../es-client', () => ({
  esClient: () => ({ search: searchMock }),
}));

class SuggestionError extends Error {}

vi.mock('../logger', () => ({
  suggestLogger: {
    error: (message: string, context?: unknown) => {
      throw new SuggestionError(`${message} ${JSON.stringify(context)}`);
    },
    debug: vi.fn(),
    info: vi.fn(),
  },
}));

import { runSuggestions } from './index';

interface CompletionOption<TDoc> {
  text: string;
  _index: string;
  _id: string;
  _score: number;
  _source: TDoc;
}

function completionResponse<TDoc>(
  options: CompletionOption<TDoc>[],
): estypes.SearchResponse<TDoc, Record<string, estypes.AggregationsAggregate>> {
  return {
    took: 5,
    timed_out: false,
    _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
    hits: { total: { value: 0, relation: 'eq' }, max_score: null, hits: [] },
    suggest: {
      suggestions: [
        {
          length: 5,
          offset: 0,
          text: 'mount',
          options,
        },
      ],
    },
  };
}

function fallbackResponse<TDoc>(
  hits: estypes.SearchHit<TDoc>[],
): estypes.SearchResponse<TDoc, Record<string, estypes.AggregationsAggregate>> {
  return {
    took: 7,
    timed_out: false,
    _shards: { total: 1, successful: 1, skipped: 0, failed: 0 },
    hits: {
      total: { value: hits.length, relation: 'eq' },
      max_score: null,
      hits,
    },
  };
}

function extractContexts(request: estypes.SearchRequest | undefined): unknown {
  if (!request) {
    return undefined;
  }
  if (typeof request.suggest !== 'object' || request.suggest === null) {
    return undefined;
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const suggestions: unknown = Reflect.get(request.suggest, 'suggestions');
  if (typeof suggestions !== 'object' || suggestions === null) {
    return undefined;
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  const completion: unknown = Reflect.get(suggestions, 'completion');
  if (typeof completion !== 'object' || completion === null) {
    return undefined;
  }
  // eslint-disable-next-line no-restricted-properties -- REFACTOR
  return Reflect.get(completion, 'contexts');
}

describe('runSuggestions', () => {
  beforeEach(() => {
    searchMock.mockReset();
    process.env.SEARCH_INDEX_VERSION = 'v-test-index';
  });

  it('returns completion suggestions for lessons with contextual filters', async () => {
    const lessonDoc: SearchLessonsIndexDoc = {
      lesson_id: 'lesson-1',
      lesson_slug: 'lesson-one',
      lesson_title: 'Mountains and glaciation',
      subject_slug: 'geography',
      key_stage: 'ks4',
      unit_ids: ['unit-1'],
      unit_titles: ['Glaciation'],
      transcript_text: 'Sample',
      lesson_url: 'https://example.com/lesson-one',
      unit_urls: ['https://example.com/unit-1'],
      title_suggest: {
        input: ['Mountains and glaciation'],
        contexts: { subject: ['geography'], key_stage: ['ks4'] },
      },
    };

    searchMock
      .mockResolvedValueOnce(
        completionResponse<SearchLessonsIndexDoc>([
          {
            text: lessonDoc.lesson_title,
            _index: 'oak_lessons',
            _id: lessonDoc.lesson_slug,
            _score: 42,
            _source: lessonDoc,
          },
        ]),
      )
      .mockResolvedValueOnce(fallbackResponse<SearchLessonsIndexDoc>([]));

    const result = await runSuggestions({
      prefix: 'mount',
      scope: 'lessons',
      subject: 'geography',
      keyStage: 'ks4',
      limit: 5,
    });

    expect(searchMock).toHaveBeenCalledTimes(2);
    const request = searchMock.mock.calls[0]?.[0];
    expect(request?.index).toBe('oak_lessons');
    const completionContexts = extractContexts(request);
    expect(completionContexts).toEqual({
      subject: ['geography'],
      key_stage: ['ks4'],
    });
    const fallbackRequest = searchMock.mock.calls[1]?.[0];
    expect(fallbackRequest?.query).toMatchObject({
      bool: {
        filter: [{ term: { subject_slug: 'geography' } }, { term: { key_stage: 'ks4' } }],
      },
    });
    expect(result).toEqual({
      suggestions: [
        {
          label: 'Mountains and glaciation',
          scope: 'lessons',
          subject: 'geography',
          keyStage: 'ks4',
          url: 'https://example.com/lesson-one',
          contexts: {},
        },
      ],
      cache: { version: 'v-test-index', ttlSeconds: 60 },
    });
  });

  it('falls back to search_as_you_type matches when completion is empty', async () => {
    const unitDoc: SearchUnitRollupDoc = {
      unit_id: 'unit-2',
      unit_slug: 'weather-and-climate',
      unit_title: 'Weather and climate',
      subject_slug: 'geography',
      key_stage: 'ks3',
      lesson_ids: ['lesson-a'],
      lesson_count: 10,
      rollup_text: 'Summary',
      unit_url: 'https://example.com/unit-two',
      subject_programmes_url: 'https://example.com/programme',
      title_suggest: {
        input: ['Weather and climate'],
        contexts: { subject: ['geography'], key_stage: ['ks3'], sequence: ['sequence-9'] },
      },
      sequence_ids: ['sequence-9'],
    };

    searchMock
      .mockResolvedValueOnce(completionResponse<SearchUnitRollupDoc>([]))
      .mockResolvedValueOnce(
        fallbackResponse<SearchUnitRollupDoc>([
          {
            _index: 'oak_unit_rollup',
            _id: 'unit-2',
            _score: 21,
            _source: unitDoc,
          },
        ]),
      );

    const result = await runSuggestions({
      prefix: 'weath',
      scope: 'units',
      subject: 'geography',
      keyStage: 'ks3',
      limit: 3,
    });

    expect(searchMock).toHaveBeenCalledTimes(2);
    const fallbackRequest = searchMock.mock.calls[1]?.[0];
    expect(fallbackRequest?.query).toMatchObject({
      bool: {
        filter: [{ term: { subject_slug: 'geography' } }, { term: { key_stage: 'ks3' } }],
        must: {
          multi_match: {
            query: 'weath',
            type: 'bool_prefix',
          },
        },
      },
    });
    expect(result.suggestions).toEqual([
      {
        label: 'Weather and climate',
        scope: 'units',
        subject: 'geography',
        keyStage: 'ks3',
        url: 'https://example.com/unit-two',
        contexts: { sequenceId: 'sequence-9' },
      },
    ]);
  });

  it('applies phase context when querying sequences', async () => {
    const sequenceDoc: SearchSequenceIndexDoc = {
      sequence_id: 'sequence-44',
      sequence_slug: 'earth-science',
      sequence_title: 'Earth science',
      subject_slug: 'geography',
      phase_slug: 'secondary',
      sequence_url: 'https://example.com/sequence-44',
      title_suggest: {
        input: ['Earth science'],
        contexts: { subject: ['geography'], phase: ['secondary'] },
      },
    };

    searchMock
      .mockResolvedValueOnce(
        completionResponse<SearchSequenceIndexDoc>([
          {
            text: sequenceDoc.sequence_title,
            _index: 'oak_sequences',
            _id: 'sequence-44',
            _score: 11,
            _source: sequenceDoc,
          },
        ]),
      )
      .mockResolvedValueOnce(fallbackResponse<SearchSequenceIndexDoc>([]));

    const result = await runSuggestions({
      prefix: 'earth',
      scope: 'sequences',
      subject: 'geography',
      phaseSlug: 'secondary',
      limit: 4,
    });

    expect(searchMock).toHaveBeenCalledTimes(2);
    const request = searchMock.mock.calls[0]?.[0];
    const completionContexts = extractContexts(request);
    expect(completionContexts).toEqual({
      subject: ['geography'],
      phase: ['secondary'],
    });
    expect(result.suggestions[0]).toEqual({
      label: 'Earth science',
      scope: 'sequences',
      subject: 'geography',
      url: 'https://example.com/sequence-44',
      contexts: { phaseSlug: 'secondary' },
    });
  });
});
