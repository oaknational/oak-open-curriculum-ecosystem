/**
 * Unit tests for four-way RRF query builders.
 *
 * Tests verify BM25 + ELSER hybrid search on content + structure fields.
 * Phase 3 enhancement: four retrievers combine lexical and semantic matching
 * on both comprehensive content and curated pedagogical summaries.
 */

import { describe, expect, it } from 'vitest';

import { buildLessonRrfRequest, buildUnitRrfRequest } from './rrf-query-builders';

describe('buildLessonRrfRequest (four-way)', () => {
  it('builds request with correct index and size', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.index).toBe('oak_lessons');
    expect(request.size).toBe(10);
  });

  it('includes RRF retriever with four sub-retrievers', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers).toHaveLength(4);
  });

  it('uses BM25 content retriever as first retriever', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[0]?.standard?.query).toHaveProperty('multi_match');
  });

  it('uses ELSER content retriever as second retriever', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[1]?.standard?.query).toHaveProperty('semantic');
  });

  it('uses BM25 structure retriever as third retriever', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[2]?.standard?.query).toHaveProperty('multi_match');
  });

  it('uses ELSER structure retriever as fourth retriever', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[3]?.standard?.query).toHaveProperty('semantic');
  });

  it('includes fuzziness AUTO for typo tolerance in BM25', () => {
    const request = buildLessonRrfRequest({ text: 'pythagorus', size: 10 });
    const bm25Query = request.retriever?.rrf?.retrievers?.[0]?.standard?.query?.multi_match;
    expect(bm25Query?.fuzziness).toBe('AUTO');
  });

  it('sets RRF window_size and rank_constant for four retrievers', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.rank_window_size).toBe(80);
    expect(request.retriever?.rrf?.rank_constant).toBe(60);
  });

  it('includes filters when subject and keyStage provided', () => {
    const request = buildLessonRrfRequest({
      text: 'test',
      size: 10,
      subject: 'maths',
      keyStage: 'ks4',
    });
    expect(request.retriever?.rrf?.retrievers?.[0]?.standard?.filter).toBeDefined();
  });
});

describe('buildUnitRrfRequest (four-way)', () => {
  it('builds request with correct index and size', () => {
    const request = buildUnitRrfRequest({ text: 'algebra', size: 10 });
    expect(request.index).toBe('oak_unit_rollup');
    expect(request.size).toBe(10);
  });

  it('includes RRF retriever with four sub-retrievers', () => {
    const request = buildUnitRrfRequest({ text: 'algebra', size: 10 });
    expect(request.retriever?.rrf?.retrievers).toHaveLength(4);
  });

  it('includes fuzziness AUTO for typo tolerance in BM25', () => {
    const request = buildUnitRrfRequest({ text: 'trigonometree', size: 10 });
    const bm25Query = request.retriever?.rrf?.retrievers?.[0]?.standard?.query?.multi_match;
    expect(bm25Query?.fuzziness).toBe('AUTO');
  });

  it('uses ELSER for semantic matching', () => {
    const request = buildUnitRrfRequest({ text: 'algebra', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[1]?.standard?.query).toHaveProperty('semantic');
  });

  it('includes filters when subject and keyStage provided', () => {
    const request = buildUnitRrfRequest({
      text: 'test',
      size: 10,
      subject: 'maths',
      keyStage: 'ks4',
    });
    expect(request.retriever?.rrf?.retrievers?.[0]?.standard?.filter).toBeDefined();
  });
});
