/**
 * Integration tests for runLessonsSearch.
 *
 * Verifies that the search function correctly integrates:
 * 1. RRF query building
 * 2. ES search execution (via injected fake)
 * 3. Transcript-aware score normalisation (ADR-099)
 * 4. Result transformation
 *
 * @see ADR-078 Dependency Injection for Testability
 * @see ADR-099 Transcript-aware RRF normalisation
 */
import { describe, it, expect } from 'vitest';
import { runLessonsSearch } from './lessons';
import type { EsSearchFnForDoc, EsSearchResponse, EsSearchRequest } from '../elastic-http';
import type { SearchLessonsIndexDoc } from '../../types/oak';

/**
 * Creates a fake ES search function that returns the provided response.
 * Typed as EsSearchFnForDoc<SearchLessonsIndexDoc> so no type assertion is needed.
 */
function createFakeSearch(
  response: EsSearchResponse<SearchLessonsIndexDoc>,
): EsSearchFnForDoc<SearchLessonsIndexDoc> {
  return async (body: EsSearchRequest): Promise<EsSearchResponse<SearchLessonsIndexDoc>> => {
    void body;
    return response;
  };
}

/**
 * Base lesson document for testing. All fields have default values.
 */
const BASE_LESSON_DOC: Omit<SearchLessonsIndexDoc, 'has_transcript'> = {
  lesson_id: 'test-lesson-id',
  lesson_slug: 'test-lesson',
  lesson_title: 'Test Lesson',
  subject_slug: 'maths',
  subject_parent: 'maths',
  key_stage: 'ks2',
  years: ['4'],
  unit_ids: ['unit-1'],
  unit_titles: ['Unit 1'],
  unit_urls: ['https://example.com/unit-1'],
  lesson_url: 'https://example.com/lesson',
  lesson_structure: 'Test structure',
  lesson_structure_semantic: 'Test structure semantic',
  doc_type: 'lesson',
};

/**
 * Creates a minimal lesson document for testing.
 * Merges overrides with base defaults.
 */
function createLessonDoc(
  overrides: Partial<SearchLessonsIndexDoc> & { has_transcript: boolean },
): SearchLessonsIndexDoc {
  const base = { ...BASE_LESSON_DOC, has_transcript: overrides.has_transcript };
  const merged = { ...base, ...overrides };

  // Content fields only present when has_transcript is true
  if (merged.has_transcript) {
    return {
      ...merged,
      lesson_content: merged.lesson_content ?? 'Test content',
      lesson_content_semantic: merged.lesson_content_semantic ?? 'Test content semantic',
    };
  }

  return merged;
}

describe('runLessonsSearch integration', () => {
  describe('transcript-aware RRF normalisation (ADR-099)', () => {
    it('doubles scores for documents without transcripts', async () => {
      const fakeSearch = createFakeSearch({
        hits: {
          total: { value: 1, relation: 'eq' },
          max_score: 0.033,
          hits: [
            {
              _index: 'oak_lessons_v1',
              _id: 'no-transcript-lesson',
              _score: 0.033, // 2/4 retrievers contributing
              _source: createLessonDoc({
                lesson_slug: 'no-transcript-lesson',
                has_transcript: false,
              }),
            },
          ],
        },
        took: 10,
        timed_out: false,
      });

      const result = await runLessonsSearch(
        { scope: 'lessons', text: 'test query' },
        10,
        0,
        false,
        { search: fakeSearch },
      );

      expect(result.results).toHaveLength(1);
      const lesson = result.results[0];
      if (!('lesson' in lesson)) {
        throw new Error('Expected lesson result');
      }
      // Score should be doubled: 0.033 * 2 = 0.066
      expect(lesson.rankScore).toBeCloseTo(0.066, 3);
    });

    it('preserves scores for documents with transcripts', async () => {
      const fakeSearch = createFakeSearch({
        hits: {
          total: { value: 1, relation: 'eq' },
          max_score: 0.066,
          hits: [
            {
              _index: 'oak_lessons_v1',
              _id: 'has-transcript-lesson',
              _score: 0.066, // 4/4 retrievers contributing
              _source: createLessonDoc({
                lesson_slug: 'has-transcript-lesson',
                has_transcript: true,
              }),
            },
          ],
        },
        took: 10,
        timed_out: false,
      });

      const result = await runLessonsSearch(
        { scope: 'lessons', text: 'test query' },
        10,
        0,
        false,
        { search: fakeSearch },
      );

      expect(result.results).toHaveLength(1);
      const lesson = result.results[0];
      if (!('lesson' in lesson)) {
        throw new Error('Expected lesson result');
      }
      // Score should remain unchanged: 0.066 * 1 = 0.066
      expect(lesson.rankScore).toBeCloseTo(0.066, 3);
    });

    it('re-ranks results after normalisation when transcript-less doc becomes higher', async () => {
      // Scenario: A transcript-less document has lower raw score but should rank higher after normalisation
      // Before normalisation: with-transcript (0.050) > without-transcript (0.030)
      // After normalisation: without-transcript (0.060) > with-transcript (0.050)
      const fakeSearch = createFakeSearch({
        hits: {
          total: { value: 2, relation: 'eq' },
          max_score: 0.05,
          hits: [
            {
              _index: 'oak_lessons_v1',
              _id: 'with-transcript',
              _score: 0.05, // Higher raw score
              _source: createLessonDoc({
                lesson_slug: 'with-transcript',
                has_transcript: true,
              }),
            },
            {
              _index: 'oak_lessons_v1',
              _id: 'without-transcript',
              _score: 0.03, // Lower raw score, but penalised by RRF
              _source: createLessonDoc({
                lesson_slug: 'without-transcript',
                has_transcript: false,
              }),
            },
          ],
        },
        took: 10,
        timed_out: false,
      });

      const result = await runLessonsSearch(
        { scope: 'lessons', text: 'test query' },
        10,
        0,
        false,
        { search: fakeSearch },
      );

      expect(result.results).toHaveLength(2);

      // After normalisation and re-ranking, the transcript-less doc should be first
      const first = result.results[0];
      const second = result.results[1];
      if (!('lesson' in first) || !('lesson' in second)) {
        throw new Error('Expected lesson results');
      }

      expect(first.lesson.lesson_slug).toBe('without-transcript');
      expect(first.rankScore).toBeCloseTo(0.06, 3); // 0.03 * 2

      expect(second.lesson.lesson_slug).toBe('with-transcript');
      expect(second.rankScore).toBeCloseTo(0.05, 3); // 0.05 * 1
    });

    it('handles mixed results correctly', async () => {
      const fakeSearch = createFakeSearch({
        hits: {
          total: { value: 3, relation: 'eq' },
          max_score: 0.066,
          hits: [
            {
              _index: 'oak_lessons_v1',
              _id: 'doc-a',
              _score: 0.066,
              _source: createLessonDoc({
                lesson_slug: 'doc-a',
                has_transcript: true,
              }),
            },
            {
              _index: 'oak_lessons_v1',
              _id: 'doc-b',
              _score: 0.033,
              _source: createLessonDoc({
                lesson_slug: 'doc-b',
                has_transcript: false,
              }),
            },
            {
              _index: 'oak_lessons_v1',
              _id: 'doc-c',
              _score: 0.02,
              _source: createLessonDoc({
                lesson_slug: 'doc-c',
                has_transcript: true,
              }),
            },
          ],
        },
        took: 10,
        timed_out: false,
      });

      const result = await runLessonsSearch(
        { scope: 'lessons', text: 'test query' },
        10,
        0,
        false,
        { search: fakeSearch },
      );

      expect(result.results).toHaveLength(3);

      // After normalisation:
      // doc-a: 0.066 * 1 = 0.066 (has transcript)
      // doc-b: 0.033 * 2 = 0.066 (no transcript)
      // doc-c: 0.02 * 1 = 0.02 (has transcript)
      // Order should be: doc-a, doc-b (stable sort), doc-c
      const slugs = result.results.map((r) => {
        if (!('lesson' in r)) {
          throw new Error('Expected lesson result');
        }
        return r.lesson.lesson_slug;
      });
      expect(slugs).toEqual(['doc-a', 'doc-b', 'doc-c']);
    });
  });

  describe('result transformation', () => {
    it('transforms ES hits to LessonResult format', async () => {
      const fakeSearch = createFakeSearch({
        hits: {
          total: { value: 1, relation: 'eq' },
          max_score: 0.066,
          hits: [
            {
              _index: 'oak_lessons_v1',
              _id: 'lesson-123',
              _score: 0.066,
              _source: createLessonDoc({
                lesson_id: 'lesson-123',
                lesson_slug: 'test-lesson-slug',
                lesson_title: 'Test Lesson Title',
                subject_slug: 'science',
                key_stage: 'ks3',
                has_transcript: true,
              }),
              highlight: {
                lesson_content: ['<mark>highlighted</mark> text'],
              },
            },
          ],
        },
        took: 15,
        timed_out: false,
      });

      const result = await runLessonsSearch({ scope: 'lessons', text: 'test query' }, 10, 0, true, {
        search: fakeSearch,
      });

      expect(result.scope).toBe('lessons');
      expect(result.total).toBe(1);
      expect(result.took).toBe(15);
      expect(result.timedOut).toBe(false);

      const lesson = result.results[0];
      if (!('lesson' in lesson)) {
        throw new Error('Expected lesson result');
      }
      expect(lesson.id).toBe('lesson-123');
      expect(lesson.lesson.lesson_slug).toBe('test-lesson-slug');
      expect(lesson.lesson.lesson_title).toBe('Test Lesson Title');
      expect(lesson.highlights).toEqual(['<mark>highlighted</mark> text']);
    });

    it('handles null scores as zero', async () => {
      const fakeSearch = createFakeSearch({
        hits: {
          total: { value: 1, relation: 'eq' },
          max_score: null,
          hits: [
            {
              _index: 'oak_lessons_v1',
              _id: 'null-score-lesson',
              _score: null,
              _source: createLessonDoc({
                lesson_slug: 'null-score-lesson',
                has_transcript: true,
              }),
            },
          ],
        },
        took: 10,
        timed_out: false,
      });

      const result = await runLessonsSearch(
        { scope: 'lessons', text: 'test query' },
        10,
        0,
        false,
        { search: fakeSearch },
      );

      const lesson = result.results[0];
      if (!('lesson' in lesson)) {
        throw new Error('Expected lesson result');
      }
      expect(lesson.rankScore).toBe(0);
    });
  });
});
