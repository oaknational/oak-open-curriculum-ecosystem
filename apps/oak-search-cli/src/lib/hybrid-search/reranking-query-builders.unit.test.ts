/**
 * Unit tests for semantic reranking query builders.
 *
 * Tests that reranking query builders correctly wrap RRF retrievers
 * with the text_similarity_reranker retriever.
 *
 * @see E-001-semantic-reranking.experiment.md
 */

import { describe, it, expect } from 'vitest';
import {
  buildLessonRerankingRrfRequest,
  buildUnitRerankingRrfRequest,
  type LessonRerankingParams,
  type UnitRerankingParams,
} from './reranking-query-builders';

describe('buildLessonRerankingRrfRequest', () => {
  const defaultParams: LessonRerankingParams = {
    text: 'quadratic equations',
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  };

  it('wraps RRF retriever in text_similarity_reranker', () => {
    const request = buildLessonRerankingRrfRequest(defaultParams);

    expect(request.retriever).toBeDefined();
    expect(request.retriever).toHaveProperty('text_similarity_reranker');
  });

  it('uses lesson_structure field for reranking', () => {
    const request = buildLessonRerankingRrfRequest(defaultParams);

    const reranker = request.retriever?.text_similarity_reranker;
    expect(reranker).toBeDefined();
    expect(reranker?.field).toBe('lesson_structure');
  });

  it('uses .rerank-v1-elasticsearch inference endpoint', () => {
    const request = buildLessonRerankingRrfRequest(defaultParams);

    const reranker = request.retriever?.text_similarity_reranker;
    expect(reranker?.inference_id).toBe('.rerank-v1-elasticsearch');
  });

  it('sets inference_text to the query text', () => {
    const request = buildLessonRerankingRrfRequest({
      ...defaultParams,
      text: 'that sohcahtoa stuff for triangles',
    });

    const reranker = request.retriever?.text_similarity_reranker;
    expect(reranker?.inference_text).toBe('that sohcahtoa stuff for triangles');
  });

  it('uses default rank_window_size of 20', () => {
    const request = buildLessonRerankingRrfRequest(defaultParams);

    const reranker = request.retriever?.text_similarity_reranker;
    expect(reranker?.rank_window_size).toBe(20);
  });

  it('allows custom rank_window_size', () => {
    const request = buildLessonRerankingRrfRequest({
      ...defaultParams,
      rerankWindowSize: 25,
    });

    const reranker = request.retriever?.text_similarity_reranker;
    expect(reranker?.rank_window_size).toBe(25);
  });

  it('contains nested RRF retriever with 4 sub-retrievers', () => {
    const request = buildLessonRerankingRrfRequest(defaultParams);

    const reranker = request.retriever?.text_similarity_reranker;
    const innerRetriever = reranker?.retriever;
    expect(innerRetriever).toHaveProperty('rrf');
    expect(innerRetriever?.rrf?.retrievers).toHaveLength(4);
  });

  it('targets the lessons index', () => {
    const request = buildLessonRerankingRrfRequest(defaultParams);

    expect(request.index).toContain('lessons');
  });
});

describe('buildUnitRerankingRrfRequest', () => {
  const defaultParams: UnitRerankingParams = {
    text: 'algebra and graphs',
    size: 10,
    subject: 'maths',
    keyStage: 'ks4',
  };

  it('wraps RRF retriever in text_similarity_reranker', () => {
    const request = buildUnitRerankingRrfRequest(defaultParams);

    expect(request.retriever).toBeDefined();
    expect(request.retriever).toHaveProperty('text_similarity_reranker');
  });

  it('uses unit_structure field for reranking', () => {
    const request = buildUnitRerankingRrfRequest(defaultParams);

    const reranker = request.retriever?.text_similarity_reranker;
    expect(reranker?.field).toBe('unit_structure');
  });

  it('uses .rerank-v1-elasticsearch inference endpoint', () => {
    const request = buildUnitRerankingRrfRequest(defaultParams);

    const reranker = request.retriever?.text_similarity_reranker;
    expect(reranker?.inference_id).toBe('.rerank-v1-elasticsearch');
  });

  it('targets the unit_rollup index', () => {
    const request = buildUnitRerankingRrfRequest(defaultParams);

    expect(request.index).toContain('unit_rollup');
  });

  it('contains nested RRF retriever with 4 sub-retrievers', () => {
    const request = buildUnitRerankingRrfRequest(defaultParams);

    const reranker = request.retriever?.text_similarity_reranker;
    const innerRetriever = reranker?.retriever;
    expect(innerRetriever).toHaveProperty('rrf');
    expect(innerRetriever?.rrf?.retrievers).toHaveLength(4);
  });
});
