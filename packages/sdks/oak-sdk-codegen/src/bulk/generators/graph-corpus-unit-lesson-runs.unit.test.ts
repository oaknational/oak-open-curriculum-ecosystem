/**
 * Unit tests for the graph-corpus unit→lesson run emission (MCP-682).
 *
 * @remarks
 * TDD: these tests describe the unit→lesson ordering data the corpus emits.
 * A unit's lessons are a taught SEQUENCE, not a set: the order is Oak's
 * authored `lessonOrder`, and the corpus `edges` array cannot carry it because
 * it is sorted by (type, source, target) for a deterministic artefact. The
 * describing surface is the emitted `unitLessonRuns` section.
 *
 * Every fixture names lessons whose slugs sort AGAINST their authored
 * position, so an id-sorted implementation cannot pass by coincidence.
 *
 * @see ADR-086 for the vocab-gen graph export pattern
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedLesson, ExtractedUnitLessons } from '../extractors/index.js';

import { generateGraphCorpusData, type GraphCorpusInput } from './graph-corpus-generator.js';
import type { GraphCorpusEdge } from './graph-corpus-types.js';
import { buildUnitLessonRuns } from './graph-corpus-unit-lesson-runs.js';

function makeInput(overrides: Partial<GraphCorpusInput> = {}): GraphCorpusInput {
  return {
    priorKnowledge: [],
    threads: [],
    lessons: [],
    unitLessons: [],
    misconceptions: [],
    keywords: [],
    sourceVersion: '2026-06-10T16:43:00.027Z',
    ...overrides,
  };
}

/** A lesson record — the membership source for `containsLesson` edges. */
function lessonRecord(lessonSlug: string, unitSlug: string): ExtractedLesson {
  return {
    lessonSlug,
    lessonTitle: lessonSlug,
    unitSlug,
    unitTitle: unitSlug,
    subject: 'computing',
    keyStage: 'ks3',
  };
}

/** One programme variant's lesson listing — the ordering source. */
function variant(
  unitSlug: string,
  lessons: readonly (readonly [slug: string, order: number | null])[],
): ExtractedUnitLessons {
  return {
    unitSlug,
    unitTitle: unitSlug,
    year: 7,
    yearSlug: 'year-7',
    keyStageSlug: 'ks3',
    lessonCount: lessons.length,
    lessons: lessons.map(([lessonSlug, lessonOrder]) => ({
      lessonSlug,
      lessonTitle: lessonSlug,
      lessonOrder,
      state: 'published',
    })),
  };
}

/** A containsLesson edge, for calling the run builder directly. */
function edgeFor(unitSlug: string, lessonSlug: string): GraphCorpusEdge {
  return {
    source: `unit:${unitSlug}`,
    type: 'containsLesson',
    target: `lesson:${lessonSlug}`,
  };
}

function runFor(corpus: ReturnType<typeof generateGraphCorpusData>, unitSlug: string): string[] {
  const run = corpus.unitLessonRuns.find((entry) => entry.unitId === `unit:${unitSlug}`);
  return [...(run?.lessonIds ?? [])];
}

describe('generateGraphCorpusData — unitLessonRuns (authored lesson order)', () => {
  it('serves a unit’s lessons in authored order, not id order', () => {
    const corpus = generateGraphCorpusData(
      makeInput({
        lessons: [
          lessonRecord('alpha-taught-last', 'unit-a'),
          lessonRecord('zulu-taught-first', 'unit-a'),
        ],
        unitLessons: [
          variant('unit-a', [
            ['zulu-taught-first', 1],
            ['alpha-taught-last', 2],
          ]),
        ],
      }),
    );

    expect(runFor(corpus, 'unit-a')).toEqual([
      'lesson:zulu-taught-first',
      'lesson:alpha-taught-last',
    ]);
  });

  it('takes the minimum position when programme variants disagree', () => {
    // `shared` is 3rd in one variant and 1st in the other, against `other` at
    // 2. The MINIMUM wins, so `shared` leads. Taking the maximum (or the first
    // variant seen) would order these the other way round, which is what this
    // fixture discriminates.
    const corpus = generateGraphCorpusData(
      makeInput({
        lessons: [lessonRecord('shared', 'unit-b'), lessonRecord('other', 'unit-b')],
        unitLessons: [
          variant('unit-b', [
            ['other', 2],
            ['shared', 3],
          ]),
          variant('unit-b', [['shared', 1]]),
        ],
      }),
    );

    expect(runFor(corpus, 'unit-b')).toEqual(['lesson:shared', 'lesson:other']);
  });

  it('breaks a shared authored position by lesson id, so the run is a total order', () => {
    const corpus = generateGraphCorpusData(
      makeInput({
        lessons: [
          lessonRecord('reading-text-files', 'unit-c'),
          lessonRecord('reading-csv-files', 'unit-c'),
        ],
        unitLessons: [
          variant('unit-c', [['reading-text-files', 3]]),
          variant('unit-c', [['reading-csv-files', 3]]),
        ],
      }),
    );

    expect(runFor(corpus, 'unit-c')).toEqual([
      'lesson:reading-csv-files',
      'lesson:reading-text-files',
    ]);
  });

  it('places a lesson with no authored position after every ordered lesson', () => {
    // A placement present in the lesson records but in no variant listing —
    // 79 such pairs on the 2026-09-03 snapshot. Slug order would put it first.
    const corpus = generateGraphCorpusData(
      makeInput({
        lessons: [
          lessonRecord('aaa-unordered', 'unit-d'),
          lessonRecord('zzz-ordered-first', 'unit-d'),
        ],
        unitLessons: [variant('unit-d', [['zzz-ordered-first', 1]])],
      }),
    );

    expect(runFor(corpus, 'unit-d')).toEqual(['lesson:zzz-ordered-first', 'lesson:aaa-unordered']);
  });

  // Contract test only: `extractUnitLessons` backfills a null `lessonOrder`
  // to its array index, so null never reaches this builder through the real
  // pipeline. In production the unordered case arises the other way — a
  // lesson absent from every variant listing (the test above).
  it('treats a null lessonOrder as unordered rather than as position zero', () => {
    const corpus = generateGraphCorpusData(
      makeInput({
        lessons: [lessonRecord('aaa-null-order', 'unit-e'), lessonRecord('zzz-ordered', 'unit-e')],
        unitLessons: [
          variant('unit-e', [
            ['aaa-null-order', null],
            ['zzz-ordered', 1],
          ]),
        ],
      }),
    );

    expect(runFor(corpus, 'unit-e')).toEqual(['lesson:zzz-ordered', 'lesson:aaa-null-order']);
  });

  it('takes membership from the edge set, never from the variant listings', () => {
    // `ghost` is listed by a variant but has no lesson record, so it has no
    // lesson node: including it would dangle. 40 such pairs on the snapshot.
    const corpus = generateGraphCorpusData(
      makeInput({
        lessons: [lessonRecord('real', 'unit-f')],
        unitLessons: [
          variant('unit-f', [
            ['ghost', 1],
            ['real', 2],
          ]),
        ],
      }),
    );

    expect(runFor(corpus, 'unit-f')).toEqual(['lesson:real']);
  });

  it('emits one run per unit, covering exactly the containsLesson edge set', () => {
    const corpus = generateGraphCorpusData(
      makeInput({
        lessons: [
          lessonRecord('one', 'unit-g'),
          lessonRecord('two', 'unit-g'),
          lessonRecord('three', 'unit-h'),
        ],
        unitLessons: [
          variant('unit-g', [
            ['two', 1],
            ['one', 2],
          ]),
        ],
      }),
    );

    const placed = corpus.unitLessonRuns.flatMap((run) => run.lessonIds).length;
    const edges = corpus.edges.filter((edge) => edge.type === 'containsLesson').length;
    expect(placed).toBe(edges);
    expect(corpus.unitLessonRuns.map((run) => run.unitId)).toEqual(['unit:unit-g', 'unit:unit-h']);
  });

  // The generator hands this builder an edge array already sorted by
  // (type, source, target), so through `generateGraphCorpusData` a tie in
  // authored position resolves to id order whether or not the builder asks for
  // it. That makes the tie-break unobservable from the generator and silently
  // dependent on another module's sort. These tests call the builder directly
  // with edges in a hostile order, so the property is pinned where it lives.
  describe('buildUnitLessonRuns — called directly, with unsorted edges', () => {
    it('breaks a shared authored position by lesson id, not by edge order', () => {
      const runs = buildUnitLessonRuns(
        [edgeFor('unit-j', 'zulu'), edgeFor('unit-j', 'alpha')],
        [
          variant('unit-j', [
            ['zulu', 3],
            ['alpha', 3],
          ]),
        ],
      );

      expect(runs.runs[0]?.lessonIds).toEqual(['lesson:alpha', 'lesson:zulu']);
    });

    it('orders the unordered tail by lesson id, not by edge order', () => {
      const runs = buildUnitLessonRuns(
        [edgeFor('unit-k', 'zulu'), edgeFor('unit-k', 'alpha'), edgeFor('unit-k', 'ordered')],
        [variant('unit-k', [['ordered', 1]])],
      );

      expect(runs.runs[0]?.lessonIds).toEqual(['lesson:ordered', 'lesson:alpha', 'lesson:zulu']);
    });
  });

  it('reports a unit the variants never ordered, rather than alphabetising it in silence', () => {
    // A unit with containsLesson edges but NO row in any `unitLessons`
    // listing: nothing supplies an authored position, so the run necessarily
    // falls back to lesson-id order — the exact failure this section removes.
    // The count makes that degradation visible in the artefact instead of
    // silent. Zero on the 2026-09-03 snapshot.
    const build = buildUnitLessonRuns(
      [edgeFor('orphan-unit', 'zulu'), edgeFor('orphan-unit', 'alpha')],
      [],
    );

    expect(build.unitsWithoutAuthoredLessonOrder).toBe(1);
    expect(build.runs[0]?.lessonIds).toEqual(['lesson:alpha', 'lesson:zulu']);
  });

  it('counts no unordered units when every unit is listed', () => {
    const build = buildUnitLessonRuns(
      [edgeFor('unit-l', 'one')],
      [variant('unit-l', [['one', 1]])],
    );

    expect(build.unitsWithoutAuthoredLessonOrder).toBe(0);
  });

  it('emits the same runs regardless of input order (the determinism contract)', () => {
    const lessons = [lessonRecord('beta', 'unit-i'), lessonRecord('alpha', 'unit-i')];
    const unitLessons = [variant('unit-i', [['beta', 1]]), variant('unit-i', [['alpha', 2]])];
    const forward = generateGraphCorpusData(makeInput({ lessons, unitLessons }));
    const reversed = generateGraphCorpusData(
      makeInput({ lessons: [...lessons].reverse(), unitLessons: [...unitLessons].reverse() }),
    );

    expect(reversed.unitLessonRuns).toEqual(forward.unitLessonRuns);
    expect(runFor(forward, 'unit-i')).toEqual(['lesson:beta', 'lesson:alpha']);
  });
});
