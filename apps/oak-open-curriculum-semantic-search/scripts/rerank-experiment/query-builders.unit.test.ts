/**
 * Unit tests for search query builders.
 *
 * Uses two-way hybrid search (BM25 + ELSER) per ADR-075 - dense vectors removed.
 */

import { describe, it, expect } from 'vitest';
import { buildRetrievers, buildSearchBody } from './query-builders';
import type { SearchConfig } from './types';

const DEFAULT_BM25_FIELDS = ['title^2', 'content', 'keywords^1.5'];

describe('buildRetrievers', () => {
  it('builds 2-way retrievers (BM25 + ELSER semantic)', () => {
    const retrievers = buildRetrievers('test query', DEFAULT_BM25_FIELDS);
    expect(retrievers).toHaveLength(2);
  });

  it('includes BM25 retriever', () => {
    const retrievers = buildRetrievers('my query', DEFAULT_BM25_FIELDS);
    expect(retrievers[0]).toHaveProperty('standard');
  });

  it('includes semantic retriever', () => {
    const retrievers = buildRetrievers('my query', DEFAULT_BM25_FIELDS);
    expect(retrievers[1]).toHaveProperty('standard');
  });
});

describe('buildSearchBody', () => {
  const baseConfig: SearchConfig = {
    query: 'test query',
    useRerank: false,
    retrieveSize: 50,
    rerankSize: 20,
    bm25Fields: DEFAULT_BM25_FIELDS,
  };

  it('builds RRF search body without rerank', () => {
    const body = buildSearchBody(baseConfig);
    expect(body.index).toBe('oak_lessons');
    expect(body.size).toBe(10);
  });

  it('builds reranker search body with rerank', () => {
    const config: SearchConfig = { ...baseConfig, useRerank: true };
    const body = buildSearchBody(config);
    expect(body.retriever).toHaveProperty('text_similarity_reranker');
  });

  it('includes RRF retriever when not reranking', () => {
    const body = buildSearchBody(baseConfig);
    expect(body.retriever).toHaveProperty('rrf');
  });

  it('sets source fields', () => {
    const body = buildSearchBody(baseConfig);
    expect(body._source).toEqual(['lesson_slug']);
  });
});
