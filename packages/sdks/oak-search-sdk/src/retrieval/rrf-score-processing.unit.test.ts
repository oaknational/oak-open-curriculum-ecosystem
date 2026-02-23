/**
 * Unit tests for RRF query helper functions.
 *
 * Tests the post-RRF score filtering function that removes
 * low-relevance results to address the "volume problem" where
 * ES returns the entire index for short queries.
 */

import { describe, it, expect } from 'vitest';
import { filterByMinScore, clampSize, clampFrom } from './rrf-score-processing.js';
import type { SearchLessonsIndexDoc } from '@oaknational/curriculum-sdk/public/search.js';

function stubLessonDoc(slug: string): SearchLessonsIndexDoc {
  return {
    lesson_id: slug,
    lesson_slug: slug,
    lesson_title: `Lesson: ${slug}`,
    subject_slug: 'science',
    subject_parent: 'science',
    key_stage: 'ks1',
    unit_ids: [],
    unit_titles: [],
    has_transcript: false,
    lesson_url: `https://example.com/${slug}`,
    unit_urls: [],
    doc_type: 'lesson',
  };
}

function createHit(id: string, score: number) {
  return {
    _id: id,
    _score: score,
    _source: stubLessonDoc(id),
  };
}

describe('filterByMinScore', () => {
  it('removes hits below the minimum score', () => {
    const hits = [createHit('high', 0.06), createHit('low', 0.02), createHit('medium', 0.04)];

    const filtered = filterByMinScore(hits, 0.04);

    expect(filtered).toHaveLength(2);
    expect(filtered.map((h) => h._id)).toEqual(['high', 'medium']);
  });

  it('keeps all hits when all scores meet the threshold', () => {
    const hits = [createHit('a', 0.06), createHit('b', 0.05), createHit('c', 0.04)];

    const filtered = filterByMinScore(hits, 0.04);

    expect(filtered).toHaveLength(3);
  });

  it('returns empty array when all hits are below threshold', () => {
    const hits = [createHit('a', 0.01), createHit('b', 0.02), createHit('c', 0.03)];

    const filtered = filterByMinScore(hits, 0.04);

    expect(filtered).toHaveLength(0);
  });

  it('returns empty array for empty input', () => {
    const filtered = filterByMinScore([], 0.04);

    expect(filtered).toHaveLength(0);
  });

  it('treats score equal to threshold as passing', () => {
    const hits = [createHit('exact', 0.04)];

    const filtered = filterByMinScore(hits, 0.04);

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?._id).toBe('exact');
  });

  it('preserves highlight data when present', () => {
    const hit = {
      ...createHit('with-highlight', 0.06),
      _highlight: { lesson_content: ['Some <mark>highlighted</mark> text'] },
    };

    const filtered = filterByMinScore([hit], 0.04);

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?._highlight).toEqual({
      lesson_content: ['Some <mark>highlighted</mark> text'],
    });
  });
});

describe('clampSize', () => {
  it('defaults to 25 when undefined', () => {
    expect(clampSize(undefined)).toBe(25);
  });

  it('clamps below 1 to 1', () => {
    expect(clampSize(0)).toBe(1);
    expect(clampSize(-5)).toBe(1);
  });

  it('clamps above 100 to 100', () => {
    expect(clampSize(200)).toBe(100);
  });

  it('passes through valid values unchanged', () => {
    expect(clampSize(50)).toBe(50);
  });

  it('defaults to 25 when NaN', () => {
    expect(clampSize(NaN)).toBe(25);
  });

  it('defaults to 25 when Infinity', () => {
    expect(clampSize(Infinity)).toBe(25);
    expect(clampSize(-Infinity)).toBe(25);
  });
});

describe('clampFrom', () => {
  it('defaults to 0 when undefined', () => {
    expect(clampFrom(undefined)).toBe(0);
  });

  it('defaults to 0 for negative values', () => {
    expect(clampFrom(-1)).toBe(0);
  });

  it('passes through valid values unchanged', () => {
    expect(clampFrom(25)).toBe(25);
    expect(clampFrom(0)).toBe(0);
  });

  it('defaults to 0 when NaN', () => {
    expect(clampFrom(NaN)).toBe(0);
  });

  it('defaults to 0 when Infinity', () => {
    expect(clampFrom(Infinity)).toBe(0);
  });
});
