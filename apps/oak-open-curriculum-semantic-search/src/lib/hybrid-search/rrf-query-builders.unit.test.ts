import { describe, expect, it } from 'vitest';
import { buildLessonRrfRequest } from './rrf-query-builders';

// Mock ES client for tests

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
