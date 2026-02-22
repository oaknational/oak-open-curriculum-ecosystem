/**
 * Integration contract test for the search renderer.
 *
 * Evaluates the renderer JS string via the test harness and
 * verifies it correctly reads the SDK's nested `LessonResult`
 * shape (`results[].lesson.lesson_title`, etc.).
 *
 * This catches data shape mismatches at build time — if the
 * renderer reads flat camelCase fields but the SDK provides
 * nested snake_case, this test fails.
 *
 * @see ../../tests/widget/renderer-test-harness.ts
 * @see ../../tests/widget/fixtures.ts
 */

import { describe, expect, it } from 'vitest';

import { createRendererHarness } from '../../tests/widget/renderer-test-harness.js';
import { SEARCH_OUTPUT_FIXTURE, EMPTY_SEARCH_OUTPUT_FIXTURE } from '../../tests/widget/fixtures.js';

describe('search renderer contract', () => {
  const { renderSearch } = createRendererHarness();

  it('renders lesson titles from nested lesson.lesson_title', () => {
    const html = renderSearch(SEARCH_OUTPUT_FIXTURE);
    expect(html).toContain('Introduction to Photosynthesis');
    expect(html).toContain('The Light-Dependent Reactions');
  });

  it('renders scope label from top-level scope field', () => {
    const html = renderSearch(SEARCH_OUTPUT_FIXTURE);
    expect(html).toContain('Search lessons');
  });

  it('renders total badge from top-level total field', () => {
    const html = renderSearch(SEARCH_OUTPUT_FIXTURE);
    expect(html).toContain('15');
  });

  it('renders subject from lesson.subject_title', () => {
    const html = renderSearch(SEARCH_OUTPUT_FIXTURE);
    expect(html).toContain('Science');
    expect(html).toContain('Biology');
  });

  it('renders key stage from lesson.key_stage_title', () => {
    const html = renderSearch(SEARCH_OUTPUT_FIXTURE);
    expect(html).toContain('KS3');
    expect(html).toContain('KS4');
  });

  it('renders View on Oak links from lesson.lesson_url', () => {
    const html = renderSearch(SEARCH_OUTPUT_FIXTURE);
    expect(html).toContain(
      'https://teachers.thenational.academy/lessons/introduction-to-photosynthesis',
    );
    expect(html).toContain('View on Oak');
  });

  it('renders "No results found" for empty results', () => {
    const html = renderSearch(EMPTY_SEARCH_OUTPUT_FIXTURE);
    expect(html).toContain('No results found');
  });

  it('renders "Untitled" when lesson object is missing', () => {
    const html = renderSearch({
      scope: 'lessons',
      total: 1,
      took: 5,
      results: [{ id: 'no-lesson', rankScore: 0.5, highlights: [] }],
    });
    expect(html).toContain('Untitled');
  });

  it('falls back to lesson_slug when lesson_title is missing', () => {
    const html = renderSearch({
      scope: 'lessons',
      total: 1,
      took: 5,
      results: [
        {
          id: 'slug-only',
          rankScore: 0.5,
          lesson: { lesson_slug: 'my-lesson-slug' },
          highlights: [],
        },
      ],
    });
    expect(html).toContain('my-lesson-slug');
  });

  it('falls back to subject_slug when subject_title is absent', () => {
    const html = renderSearch({
      scope: 'lessons',
      total: 1,
      took: 5,
      results: [
        {
          id: 'slug-subject',
          rankScore: 0.5,
          lesson: {
            lesson_title: 'Test Lesson',
            subject_slug: 'mathematics',
            key_stage: 'ks2',
          },
          highlights: [],
        },
      ],
    });
    expect(html).toContain('mathematics');
  });

  it('shows explicit error when scope field is missing', () => {
    const html = renderSearch({
      total: 2,
      took: 10,
      results: [
        {
          id: 'no-scope',
          rankScore: 0.8,
          lesson: { lesson_title: 'Absent Scope Lesson' },
          highlights: [],
        },
      ],
    });
    expect(html).toContain('Search data is missing required scope field');
  });

  it('shows explicit error when results array is missing', () => {
    const html = renderSearch({ scope: 'lessons', total: 0, took: 5 });
    expect(html).toContain('Search data is missing required results array');
  });

  it('shows explicit error when total field is missing', () => {
    const html = renderSearch({ scope: 'lessons', results: [], took: 5 });
    expect(html).toContain('Search data is missing required total field');
  });
});
