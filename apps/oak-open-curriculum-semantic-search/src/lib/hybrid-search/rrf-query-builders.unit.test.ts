/**
 * Unit tests for two-way RRF query builders.
 *
 * Tests verify that BM25 + ELSER hybrid search queries are correctly constructed.
 * Phase 2 confirmed two-way hybrid is optimal; dense vectors provide no benefit.
 *
 * @module rrf-query-builders.unit.test
 */

import { describe, expect, it } from 'vitest';

// Mock ES client for tests
import { buildLessonRrfRequest, buildUnitRrfRequest } from './rrf-query-builders';

describe('buildLessonRrfRequest (two-way)', () => {
  it('builds request with correct index and size', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.index).toBe('oak_lessons');
    expect(request.size).toBe(10);
  });

  it('includes RRF retriever with two sub-retrievers', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers).toHaveLength(2);
  });

  it('wraps BM25 in standard retriever', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[0]?.standard?.query).toHaveProperty('multi_match');
  });

  it('includes fuzziness AUTO for typo tolerance in BM25', () => {
    const request = buildLessonRrfRequest({ text: 'pythagorus', size: 10 });
    const bm25Query = request.retriever?.rrf?.retrievers?.[0]?.standard?.query?.multi_match;
    expect(bm25Query?.fuzziness).toBe('AUTO');
  });

  it('wraps ELSER in standard retriever', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.retrievers?.[1]?.standard?.query).toHaveProperty('semantic');
  });

  it('sets RRF window_size and rank_constant', () => {
    const request = buildLessonRrfRequest({ text: 'pythagoras theorem', size: 10 });
    expect(request.retriever?.rrf?.rank_window_size).toBe(60);
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

describe('buildUnitRrfRequest (two-way)', () => {
  it('builds request with correct index and size', () => {
    const request = buildUnitRrfRequest({ text: 'algebra', size: 10 });
    expect(request.index).toBe('oak_unit_rollup');
    expect(request.size).toBe(10);
  });

  it('includes RRF retriever with two sub-retrievers', () => {
    const request = buildUnitRrfRequest({ text: 'algebra', size: 10 });
    expect(request.retriever?.rrf?.retrievers).toHaveLength(2);
  });

  it('includes fuzziness AUTO for typo tolerance in BM25', () => {
    const request = buildUnitRrfRequest({ text: 'trigonometree', size: 10 });
    const bm25Query = request.retriever?.rrf?.retrievers?.[0]?.standard?.query?.multi_match;
    expect(bm25Query?.fuzziness).toBe('AUTO');
  });

  it('wraps ELSER in standard retriever', () => {
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
