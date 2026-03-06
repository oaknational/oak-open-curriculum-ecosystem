/**
 * Integration contract tests for the explore-topic renderer.
 *
 * The explore tool returns multi-scope results with ok/error per scope,
 * plus a topic string and totals summary. Fixtures use SDK index
 * document types to catch schema drift.
 *
 * @see ./explore-renderer.ts
 */

import { describe, expect, it } from 'vitest';

import { createRendererHarness } from '../../tests/widget/renderer-test-harness.js';
import { buildExploreFixture } from '../../tests/widget/fixture-builder-browse-explore.js';

const EXPLORE_FIXTURE = buildExploreFixture(
  {
    topic: 'photosynthesis',
    lessons: {
      ok: true,
      data: {
        scope: 'lessons',
        total: 3,
        took: 25,
        results: [
          {
            id: 'lesson-1',
            rankScore: 0.95,
            lesson: {
              lesson_title: 'Introduction to Photosynthesis',
              lesson_slug: 'intro-photosynthesis',
              subject_slug: 'science',
              key_stage: 'ks3',
              lesson_url: 'https://teachers.thenational.academy/lessons/intro-photosynthesis',
            },
            highlights: [],
          },
        ],
      },
    },
    units: {
      ok: true,
      data: {
        scope: 'units',
        total: 2,
        took: 18,
        results: [
          {
            id: 'unit-1',
            rankScore: 0.88,
            unit: {
              unit_title: 'Plant Biology',
              unit_slug: 'plant-biology',
              subject_slug: 'biology',
              key_stage: 'ks4',
              unit_url: 'https://teachers.thenational.academy/units/plant-biology',
            },
            highlights: [],
          },
        ],
      },
    },
    threads: {
      ok: true,
      data: {
        scope: 'threads',
        total: 1,
        took: 12,
        results: [
          {
            id: 'thread-1',
            rankScore: 0.82,
            thread: {
              thread_title: 'Evolution and Inheritance',
              thread_slug: 'evolution-and-inheritance',
              subject_slugs: ['biology', 'science'],
              unit_count: 8,
            },
            highlights: [],
          },
        ],
      },
    },
    totals: { lessonTotal: 3, unitTotal: 2, threadTotal: 1 },
  },
  undefined,
  'success',
);

describe('explore renderer contract', () => {
  const { renderExplore } = createRendererHarness();

  it('renders topic heading', () => {
    const html = renderExplore(EXPLORE_FIXTURE);
    expect(html).toContain('photosynthesis');
  });

  it('renders lesson titles from lessons scope', () => {
    const html = renderExplore(EXPLORE_FIXTURE);
    expect(html).toContain('Introduction to Photosynthesis');
  });

  it('renders unit titles from units scope', () => {
    const html = renderExplore(EXPLORE_FIXTURE);
    expect(html).toContain('Plant Biology');
  });

  it('renders thread titles from threads scope', () => {
    const html = renderExplore(EXPLORE_FIXTURE);
    expect(html).toContain('Evolution and Inheritance');
  });

  it('renders lesson URLs as links', () => {
    const html = renderExplore(EXPLORE_FIXTURE);
    expect(html).toContain('https://teachers.thenational.academy/lessons/intro-photosynthesis');
    expect(html).toContain('View on Oak');
  });

  it('handles scope with error gracefully', () => {
    const fixture = {
      ...EXPLORE_FIXTURE,
      units: { ok: false, error: 'Search timed out' },
    };
    const html = renderExplore(fixture);
    expect(html).toContain('Introduction to Photosynthesis');
    expect(html).not.toContain('Plant Biology');
  });

  it('handles all scopes failed', () => {
    const fixture = {
      topic: 'test',
      lessons: { ok: false, error: 'error' },
      units: { ok: false, error: 'error' },
      threads: { ok: false, error: 'error' },
      totals: { lessonTotal: 0, unitTotal: 0, threadTotal: 0 },
    };
    const html = renderExplore(fixture);
    expect(html).toContain('No results found');
  });

  it('handles missing data gracefully', () => {
    const html = renderExplore({});
    expect(html).toContain('No results found');
  });

  it('renders totals summary', () => {
    const html = renderExplore(EXPLORE_FIXTURE);
    expect(html).toContain('3');
    expect(html).toContain('2');
    expect(html).toContain('1');
  });
});
