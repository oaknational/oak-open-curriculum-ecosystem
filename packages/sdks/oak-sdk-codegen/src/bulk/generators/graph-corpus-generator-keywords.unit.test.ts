/**
 * Unit tests for the graph-corpus generator's keyword emission (G4b).
 *
 * @remarks
 * TDD: these tests specify the keyword half of the emitted graph-corpus
 * dataset at the generator surface (plan `graph-tools-value-redesign`,
 * deliverable G4b): lean `keyword` nodes minted as
 * `keyword:<normalised-term>`, lesson→keyword `containsKeyword` edges — one
 * per unique lesson placement, with unresolvable lessons dropping their edge
 * into `droppedEdges` provenance (zero dangling endpoints by construction) —
 * and the `keywordDefinitions` section, which gives each placement the
 * definition its lesson authored rather than one definition per term. The
 * keyword node builder's own shape contract lives in
 * `graph-corpus-keyword-nodes.unit.test.ts`; the corpus-wide stats and
 * integrity describes live in `graph-corpus-generator.unit.test.ts`.
 *
 * @see ADR-086 for the vocab-gen graph export pattern
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedKeyword, ExtractedLesson } from '../extractors/index.js';

import { generateGraphCorpusData, type GraphCorpusInput } from './graph-corpus-generator.js';

function makeInput(overrides: Partial<GraphCorpusInput> = {}): GraphCorpusInput {
  return {
    priorKnowledge: [],
    threads: [],
    lessons: [],
    unitLessons: [],
    misconceptions: [],
    keywords: [],
    sourceVersion: '2026-05-21T13:45:16.086Z',
    ...overrides,
  };
}

const baseLesson: ExtractedLesson = {
  lessonSlug: 'comparing-fractions',
  lessonTitle: 'Comparing fractions',
  unitSlug: 'fractions-year-3',
  unitTitle: 'Fractions Year 3',
  subject: 'maths',
  keyStage: 'ks2',
};

const baseKeyword: ExtractedKeyword = {
  term: 'denominator',
  definition: 'The number below the line in a fraction.',
  frequency: 1,
  subjects: ['maths'],
  firstYear: 3,
  lessonSlugs: ['comparing-fractions'],
  definitions: [
    {
      term: 'Denominator',
      definition: 'The number below the line in a fraction.',
      lessonSlugs: ['comparing-fractions'],
    },
  ],
};

describe('generateGraphCorpusData — keyword kind and lesson→keyword placement (G4b)', () => {
  const keywordInput = makeInput({
    lessons: [baseLesson],
    keywords: [baseKeyword],
  });

  it('emits a lean keyword node termed by its normalised term', () => {
    const result = generateGraphCorpusData(keywordInput);

    const keyword = result.nodes.find((n) => n.kind === 'keyword');
    expect(keyword).toEqual({
      kind: 'keyword',
      id: 'keyword:denominator',
      term: 'denominator',
      frequency: 1,
      firstYear: 3,
      subjects: ['maths'],
    });
  });

  it('links each placing lesson to the keyword with a containsKeyword edge', () => {
    const result = generateGraphCorpusData(keywordInput);

    expect(result.edges).toContainEqual({
      source: 'lesson:comparing-fractions',
      type: 'containsKeyword',
      target: 'keyword:denominator',
    });
  });

  it('drops a keyword edge whose lesson is absent from the lesson records, with provenance', () => {
    // A keyword whose lessonSlug has no lesson record cannot anchor a
    // resolvable containsKeyword edge; the node is still emitted and the
    // edge drop is recorded (fail-loud, the droppedEdges pattern).
    const orphan: ExtractedKeyword = {
      ...baseKeyword,
      lessonSlugs: ['no-such-lesson'],
      definitions: [
        { term: 'Denominator', definition: 'Bottom number', lessonSlugs: ['no-such-lesson'] },
      ],
    };

    const result = generateGraphCorpusData(makeInput({ keywords: [orphan] }));

    expect(result.nodes.filter((n) => n.kind === 'keyword')).toHaveLength(1);
    expect(result.edges.filter((e) => e.type === 'containsKeyword')).toHaveLength(0);
    expect(result.droppedEdges).toHaveLength(1);
    expect(result.droppedEdges[0]).toMatchObject({
      source: 'lesson:no-such-lesson',
      target: 'keyword:denominator',
      type: 'containsKeyword',
    });
  });

  it('emits one containsKeyword edge per unique lesson placement of a keyword', () => {
    const secondLesson: ExtractedLesson = {
      ...baseLesson,
      lessonSlug: 'adding-fractions',
      lessonTitle: 'Adding fractions',
    };
    const shared: ExtractedKeyword = {
      ...baseKeyword,
      frequency: 2,
      lessonSlugs: ['adding-fractions', 'comparing-fractions'],
    };

    const result = generateGraphCorpusData(
      makeInput({ lessons: [baseLesson, secondLesson], keywords: [shared] }),
    );

    const edges = result.edges.filter((e) => e.type === 'containsKeyword');
    expect(edges).toHaveLength(2);
    expect(edges.map((e) => e.source).sort((a, b) => a.localeCompare(b))).toEqual([
      'lesson:adding-fractions',
      'lesson:comparing-fractions',
    ]);
  });
});

describe('generateGraphCorpusData — lesson-authored keyword definitions', () => {
  const addingLesson: ExtractedLesson = {
    ...baseLesson,
    lessonSlug: 'adding-fractions',
    lessonTitle: 'Adding fractions',
  };

  it('emits each authored definition with its own lessons, sorted by keyword, term, then definition', () => {
    const twoSenses: ExtractedKeyword = {
      ...baseKeyword,
      lessonSlugs: ['adding-fractions', 'comparing-fractions'],
      definitions: [
        {
          term: 'denominator',
          definition: 'How many equal parts the whole is split into.',
          lessonSlugs: ['adding-fractions'],
        },
        {
          term: 'Denominator',
          definition: 'The number below the line in a fraction.',
          lessonSlugs: ['comparing-fractions'],
        },
      ],
    };

    const result = generateGraphCorpusData(
      makeInput({ lessons: [baseLesson, addingLesson], keywords: [twoSenses] }),
    );

    expect(result.keywordDefinitions).toEqual([
      {
        keywordId: 'keyword:denominator',
        term: 'Denominator',
        definition: 'The number below the line in a fraction.',
        lessonIds: ['lesson:comparing-fractions'],
      },
      {
        keywordId: 'keyword:denominator',
        term: 'denominator',
        definition: 'How many equal parts the whole is split into.',
        lessonIds: ['lesson:adding-fractions'],
      },
    ]);
  });

  it('places a definition only in lessons that have a containsKeyword edge to its keyword', () => {
    // Membership is the edge set's: a lesson whose edge was dropped cannot
    // carry a definition, and a definition left with no lesson is not emitted.
    const partlyOrphaned: ExtractedKeyword = {
      ...baseKeyword,
      lessonSlugs: ['comparing-fractions', 'no-such-lesson'],
      definitions: [
        {
          term: 'Denominator',
          definition: 'The number below the line in a fraction.',
          lessonSlugs: ['comparing-fractions', 'no-such-lesson'],
        },
        { term: 'denominator', definition: 'Bottom number', lessonSlugs: ['no-such-lesson'] },
      ],
    };

    const result = generateGraphCorpusData(
      makeInput({ lessons: [baseLesson], keywords: [partlyOrphaned] }),
    );

    expect(result.keywordDefinitions).toEqual([
      {
        keywordId: 'keyword:denominator',
        term: 'Denominator',
        definition: 'The number below the line in a fraction.',
        lessonIds: ['lesson:comparing-fractions'],
      },
    ]);
  });
});
