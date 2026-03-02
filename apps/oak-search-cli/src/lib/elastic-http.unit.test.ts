import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { estypes } from '@elastic/elasticsearch';

type SearchResponse = estypes.SearchResponse<
  Record<string, unknown>,
  Record<string, estypes.AggregationsAggregate>
>;

const searchMock = vi.fn<(request: estypes.SearchRequest) => Promise<SearchResponse>>();

vi.mock('./es-client', () => ({
  esClient: () => ({ search: searchMock }),
}));

import { esSearch } from './elastic-http';

const baseResponse: SearchResponse = {
  took: 1,
  timed_out: false,
  hits: { hits: [], total: { value: 0, relation: 'eq' }, max_score: null },
  _shards: { total: 1, successful: 1, failed: 0, skipped: 0 },
};

describe('esSearch', () => {
  beforeEach(() => {
    searchMock.mockReset();
  });

  it('passes retriever, aggs, and from through to the underlying client', async () => {
    const retriever: estypes.RetrieverContainer = {
      rrf: {
        retrievers: [{ standard: { query: { match_all: {} } } }],
        rank_window_size: 60,
        rank_constant: 60,
      },
    };
    const aggs = { key_stages: { terms: { field: 'key_stage' } } } satisfies Record<
      string,
      estypes.AggregationsAggregationContainer
    >;

    searchMock.mockResolvedValueOnce(baseResponse);

    await esSearch({
      index: 'oak_lessons',
      size: 10,
      retriever,
      aggs,
      from: 15,
    });

    expect(searchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 'oak_lessons',
        size: 10,
        retriever,
        aggs,
        from: 15,
      }),
    );
  });

  it('passes query through to the underlying client when not using retriever', async () => {
    searchMock.mockResolvedValueOnce(baseResponse);

    await esSearch({
      index: 'oak_lessons',
      size: 10,
      query: { match_all: {} },
    });

    expect(searchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        index: 'oak_lessons',
        size: 10,
        query: { match_all: {} },
      }),
    );
  });

  it('returns aggregations from the raw response', async () => {
    const aggregations = {
      subjects: {
        buckets: [
          { key: 'maths', doc_count: 12 },
          { key: 'science', doc_count: 4 },
        ],
      },
    } satisfies Record<string, estypes.AggregationsAggregate>;

    searchMock.mockResolvedValueOnce({ ...baseResponse, aggregations });

    const res = await esSearch({ index: 'oak_lessons', query: { match_all: {} } });

    expect('aggregations' in res).toBe(true);
    if ('aggregations' in res) {
      expect(res.aggregations).toEqual(aggregations);
    }
  });

  it('preserves the timed_out flag from the Elasticsearch response', async () => {
    searchMock.mockResolvedValueOnce({ ...baseResponse, timed_out: true });

    const res = await esSearch({ index: 'oak_lessons', query: { match_all: {} } });

    expect(res.timed_out).toBe(true);
  });
});
