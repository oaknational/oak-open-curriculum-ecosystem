/**
 * @module rerank-experiment/query-builders.unit.test
 * @description Unit tests for search query builders.
 */

import { describe, it, expect } from 'vitest';
import { buildRetrievers, buildSearchBody } from './query-builders';
import type { SearchConfig } from './types';

const DEFAULT_BM25_FIELDS = ['title^2', 'content', 'keywords^1.5'];

describe('buildRetrievers', () => {
  it('builds 2-way retrievers without KNN when queryVector is null', () => {
    const retrievers = buildRetrievers('test query', null, DEFAULT_BM25_FIELDS, 50);
    expect(retrievers).toHaveLength(2);
  });

  it('builds 3-way retrievers with KNN when queryVector is provided', () => {
    const queryVector = [0.1, 0.2, 0.3];
    const retrievers = buildRetrievers('test query', queryVector, DEFAULT_BM25_FIELDS, 50);
    expect(retrievers).toHaveLength(3);
  });

  it('includes BM25 retriever', () => {
    const retrievers = buildRetrievers('my query', null, DEFAULT_BM25_FIELDS, 50);
    expect(retrievers[0]).toHaveProperty('standard');
  });

  it('includes semantic retriever', () => {
    const retrievers = buildRetrievers('my query', null, DEFAULT_BM25_FIELDS, 50);
    expect(retrievers[1]).toHaveProperty('standard');
  });

  it('includes KNN retriever when vector provided', () => {
    const queryVector = [0.1, 0.2, 0.3];
    const retrievers = buildRetrievers('test', queryVector, DEFAULT_BM25_FIELDS, 50);
    expect(retrievers[2]).toHaveProperty('knn');
  });
});

describe('buildSearchBody', () => {
  const baseConfig: SearchConfig = {
    query: 'test query',
    queryVector: null,
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
