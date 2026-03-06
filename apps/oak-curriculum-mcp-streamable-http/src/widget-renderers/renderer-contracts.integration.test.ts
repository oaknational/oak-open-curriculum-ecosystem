/**
 * Cross-scope integration contract tests for search renderers.
 *
 * Validates that the renderer correctly reads fields from all four
 * scoped search result shapes plus the suggest shape. Fixtures are
 * parsed through generated Zod schemas to ensure they match the
 * real SDK types — if the ES index document schema changes,
 * `pnpm sdk-codegen` updates the Zod schemas, and these tests catch
 * the drift.
 *
 * @see ../../tests/widget/renderer-test-harness.ts
 * @see ../../tests/widget/fixture-builder.ts
 */

import { describe, expect, it } from 'vitest';

import {
  SearchLessonsIndexDocSchema,
  SearchUnitsIndexDocSchema,
  SearchThreadIndexDocSchema,
  SearchSequenceIndexDocSchema,
} from '@oaknational/sdk-codegen/search';

import { createRendererHarness } from '../../tests/widget/renderer-test-harness.js';
import {
  SEARCH_OUTPUT_FIXTURE,
  UNITS_SEARCH_OUTPUT_FIXTURE,
  THREADS_SEARCH_OUTPUT_FIXTURE,
  SEQUENCES_SEARCH_OUTPUT_FIXTURE,
  SUGGEST_OUTPUT_FIXTURE,
} from '../../tests/widget/fixtures.js';

describe('renderer contract: lessons scope', () => {
  const { renderSearch } = createRendererHarness();

  it('fixture lesson documents pass Zod schema validation', () => {
    for (const result of SEARCH_OUTPUT_FIXTURE.results) {
      const parsed = SearchLessonsIndexDocSchema.safeParse(result.lesson);
      expect(parsed.success).toBe(true);
    }
  });

  it('renders lesson titles from Zod-validated fixtures', () => {
    const html = renderSearch(SEARCH_OUTPUT_FIXTURE);
    for (const result of SEARCH_OUTPUT_FIXTURE.results) {
      expect(html).toContain(result.lesson.lesson_title);
    }
  });

  it('renders lesson URLs from Zod-validated fixtures', () => {
    const html = renderSearch(SEARCH_OUTPUT_FIXTURE);
    for (const result of SEARCH_OUTPUT_FIXTURE.results) {
      expect(html).toContain(result.lesson.lesson_url);
    }
  });
});

describe('renderer contract: units scope', () => {
  const { renderSearch } = createRendererHarness();

  it('fixture unit documents pass Zod schema validation', () => {
    for (const result of UNITS_SEARCH_OUTPUT_FIXTURE.results) {
      const parsed = SearchUnitsIndexDocSchema.safeParse(result.unit);
      expect(parsed.success).toBe(true);
    }
  });

  it('renders unit titles from Zod-validated fixtures', () => {
    const html = renderSearch(UNITS_SEARCH_OUTPUT_FIXTURE);
    for (const result of UNITS_SEARCH_OUTPUT_FIXTURE.results) {
      if (result.unit) {
        expect(html).toContain(result.unit.unit_title);
      }
    }
  });

  it('renders unit URLs from Zod-validated fixtures', () => {
    const html = renderSearch(UNITS_SEARCH_OUTPUT_FIXTURE);
    for (const result of UNITS_SEARCH_OUTPUT_FIXTURE.results) {
      if (result.unit) {
        expect(html).toContain(result.unit.unit_url);
      }
    }
  });

  it('handles null unit gracefully', () => {
    const fixture = {
      scope: 'units',
      total: 1,
      took: 5,
      results: [{ id: 'null-unit', rankScore: 0.5, unit: null, highlights: [] }],
    };
    const html = renderSearch(fixture);
    expect(html).toContain('Untitled');
  });
});

describe('renderer contract: threads scope', () => {
  const { renderSearch } = createRendererHarness();

  it('fixture thread documents pass Zod schema validation', () => {
    for (const result of THREADS_SEARCH_OUTPUT_FIXTURE.results) {
      const parsed = SearchThreadIndexDocSchema.safeParse(result.thread);
      expect(parsed.success).toBe(true);
    }
  });

  it('renders thread titles from Zod-validated fixtures', () => {
    const html = renderSearch(THREADS_SEARCH_OUTPUT_FIXTURE);
    for (const result of THREADS_SEARCH_OUTPUT_FIXTURE.results) {
      expect(html).toContain(result.thread.thread_title);
    }
  });

  it('renders subject_slugs array as joined text', () => {
    const html = renderSearch(THREADS_SEARCH_OUTPUT_FIXTURE);
    expect(html).toContain('biology');
  });
});

describe('renderer contract: sequences scope', () => {
  const { renderSearch } = createRendererHarness();

  it('fixture sequence documents pass Zod schema validation', () => {
    for (const result of SEQUENCES_SEARCH_OUTPUT_FIXTURE.results) {
      const parsed = SearchSequenceIndexDocSchema.safeParse(result.sequence);
      expect(parsed.success).toBe(true);
    }
  });

  it('renders sequence titles from Zod-validated fixtures', () => {
    const html = renderSearch(SEQUENCES_SEARCH_OUTPUT_FIXTURE);
    for (const result of SEQUENCES_SEARCH_OUTPUT_FIXTURE.results) {
      expect(html).toContain(result.sequence.sequence_title);
    }
  });

  it('renders sequence URLs from Zod-validated fixtures', () => {
    const html = renderSearch(SEQUENCES_SEARCH_OUTPUT_FIXTURE);
    for (const result of SEQUENCES_SEARCH_OUTPUT_FIXTURE.results) {
      expect(html).toContain(result.sequence.sequence_url);
    }
  });

  it('handles sequences without highlights gracefully', () => {
    const html = renderSearch(SEQUENCES_SEARCH_OUTPUT_FIXTURE);
    expect(html).not.toContain('undefined');
  });
});

describe('renderer contract: suggest', () => {
  const { renderSearch } = createRendererHarness();

  it('renders suggestion labels', () => {
    const html = renderSearch(SUGGEST_OUTPUT_FIXTURE);
    for (const suggestion of SUGGEST_OUTPUT_FIXTURE.suggestions) {
      expect(html).toContain(suggestion.label);
    }
  });

  it('renders suggestion URLs as links', () => {
    const html = renderSearch(SUGGEST_OUTPUT_FIXTURE);
    for (const suggestion of SUGGEST_OUTPUT_FIXTURE.suggestions) {
      expect(html).toContain(suggestion.url);
    }
  });

  it('does not show "No results found" for suggestions', () => {
    const html = renderSearch(SUGGEST_OUTPUT_FIXTURE);
    expect(html).not.toContain('No results found');
  });

  it('handles empty suggestions array', () => {
    const html = renderSearch({ suggestions: [], cache: { version: '1', ttlSeconds: 60 } });
    expect(html).toContain('No suggestions');
  });
});

describe('renderer contract: edge cases', () => {
  const { renderSearch } = createRendererHarness();

  it('renders empty results for each scope', () => {
    for (const scope of ['lessons', 'units', 'threads', 'sequences']) {
      const html = renderSearch({ scope, total: 0, took: 5, results: [] });
      expect(html).toContain('No results found');
    }
  });
});

describe('renderer contract: security invariants', () => {
  const { renderSearch, renderBrowse, renderExplore } = createRendererHarness();

  it('no renderer produces inline onclick handlers', () => {
    const searchHtml = renderSearch(SEARCH_OUTPUT_FIXTURE);
    const browseHtml = renderBrowse({
      facets: {
        sequences: [
          {
            subjectSlug: 'science',
            sequenceSlug: 's',
            keyStage: 'ks3',
            phaseSlug: 'p',
            phaseTitle: 'P',
            years: [],
            units: [],
            unitCount: 1,
            lessonCount: 1,
            hasKs4Options: false,
            sequenceUrl: 'https://example.com',
          },
        ],
      },
      filters: {},
    });
    const exploreHtml = renderExplore({
      topic: 'test',
      lessons: {
        ok: true,
        data: {
          scope: 'lessons',
          total: 1,
          took: 1,
          results: [
            {
              id: 'l1',
              rankScore: 0.9,
              lesson: { lesson_title: 'T', lesson_url: 'https://example.com' },
              highlights: [],
            },
          ],
        },
      },
      units: { ok: false, error: 'skip' },
      threads: { ok: false, error: 'skip' },
      totals: { lessonTotal: 1, unitTotal: 0, threadTotal: 0 },
    });

    for (const html of [searchHtml, browseHtml, exploreHtml]) {
      expect(html).not.toContain('onclick');
      expect(html).toContain('data-oak-url');
    }
  });
});
