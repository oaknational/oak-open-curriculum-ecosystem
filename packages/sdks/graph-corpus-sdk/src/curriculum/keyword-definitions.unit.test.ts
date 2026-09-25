/**
 * Unit tests for the in-scope definitions of one keyword: every definition an
 * in-scope lesson authored, most-used first, each naming its lessons by slug
 * within a bounded window.
 */
import type {
  GraphCorpusKeywordDefinition,
  GraphCorpusLessonNode,
  GraphCorpusLessonNodeId,
} from '@oaknational/sdk-codegen/graph-corpus';
import { describe, expect, it } from 'vitest';

import { KEYWORD_DEFINITION_LESSON_LIMIT, scopedDefinitions } from './keyword-definitions.js';

const lessonId = (slug: string): GraphCorpusLessonNodeId => `lesson:${slug}`;

function lesson(slug: string): GraphCorpusLessonNode {
  return {
    kind: 'lesson',
    id: lessonId(slug),
    lessonSlug: slug,
    lessonTitle: `Title ${slug}`,
    subject: 'maths',
    keyStage: 'ks2',
  };
}

function row(definition: string, slugs: readonly string[]): GraphCorpusKeywordDefinition {
  return {
    keywordId: 'keyword:factor',
    term: 'factor',
    definition,
    lessonIds: slugs.map(lessonId),
  };
}

/** Slugs l00, l01, … — already in sorted order. */
const slugs = (count: number): readonly string[] =>
  Array.from({ length: count }, (_, i) => `l${String(i).padStart(2, '0')}`);

describe('scopedDefinitions', () => {
  it('serves the definitions in-scope lessons author, most-used first', () => {
    const definitions = scopedDefinitions(
      [
        row('Divides exactly', ['a']),
        row('A number multiplied', ['b', 'c']),
        row('Elsewhere', ['z']),
      ],
      [lesson('a'), lesson('b'), lesson('c')],
    );

    expect(
      definitions.map(({ definition, scopedLessonCount }) => ({ definition, scopedLessonCount })),
    ).toStrictEqual([
      { definition: 'A number multiplied', scopedLessonCount: 2 },
      { definition: 'Divides exactly', scopedLessonCount: 1 },
    ]);
  });

  it('keeps corpus order between definitions with equal counts', () => {
    const definitions = scopedDefinitions(
      [row('Zeta', ['a']), row('Alpha', ['b'])],
      [lesson('a'), lesson('b')],
    );

    expect(definitions.map((entry) => entry.definition)).toStrictEqual(['Zeta', 'Alpha']);
  });

  it('counts a lesson that authors two definitions under both', () => {
    const definitions = scopedDefinitions(
      [row('First', ['a']), row('Second', ['a'])],
      [lesson('a')],
    );

    expect(definitions.map((entry) => entry.scopedLessonCount)).toStrictEqual([1, 1]);
  });

  it('names lessons by slug, slug-sorted, and marks a window cut', () => {
    const all = slugs(KEYWORD_DEFINITION_LESSON_LIMIT + 1);

    const definitions = scopedDefinitions(
      [row('Divides exactly', [...all].reverse())],
      all.map(lesson),
    );

    expect(definitions).toStrictEqual([
      {
        term: 'factor',
        definition: 'Divides exactly',
        scopedLessonCount: KEYWORD_DEFINITION_LESSON_LIMIT + 1,
        lessonSlugs: all.slice(0, KEYWORD_DEFINITION_LESSON_LIMIT),
        hasMoreLessons: true,
      },
    ]);
  });

  it('marks no cut when the lessons exactly fill the window', () => {
    const all = slugs(KEYWORD_DEFINITION_LESSON_LIMIT);

    const [definition] = scopedDefinitions([row('Divides exactly', all)], all.map(lesson));

    expect(definition?.lessonSlugs).toHaveLength(KEYWORD_DEFINITION_LESSON_LIMIT);
    expect(definition?.hasMoreLessons).toBe(false);
  });
});
