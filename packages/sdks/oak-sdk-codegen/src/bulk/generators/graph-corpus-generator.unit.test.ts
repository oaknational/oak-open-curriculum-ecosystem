/**
 * Unit tests for the graph-corpus generator (G1a foundation + G2 chain).
 *
 * @remarks
 * TDD: these tests specify the emitted graph-corpus dataset. The describing
 * surface (plan `graph-tools-value-redesign`, deliverables G1a + G2) is the
 * emitted dataset:
 * - nodes each carrying a `kind` discriminant and an explicit, kind-qualified
 *   `id` (`unit:<unitSlug>`, `thread:<threadSlug>`, `lesson:<lessonSlug>`,
 *   `misconception:<lessonSlug>#<hash16>` — the identity model, never a bare
 *   slug);
 * - typed edges in the `graph-core` GraphEdge shape of source, type, and
 *   target: `prerequisiteFor` between units, plus the
 *   thread→unit→lesson→misconception chain (`containsUnit`, `containsLesson`,
 *   `addressesMisconception`);
 * - integrity resolution: every edge endpoint resolves to a node (zero
 *   dangling endpoints), so the corpus constructs in `createGraphView`
 *   without throwing; unresolvable endpoints drop their edge into
 *   `droppedEdges` provenance;
 * - the G2 stability contract: order-independent deterministic emission,
 *   honest churn semantics under content edits, idempotent within-lesson
 *   dedup with `droppedDuplicates` provenance (the mint golden vectors live
 *   in `misconception-mint.unit.test.ts`).
 *
 * The "constructs in createGraphView without throwing" assertion lives in
 * the graph-corpus-sdk adapter integration test (that workspace depends on
 * `@oaknational/graph-core`); this unit test proves zero-dangling by node-id
 * set membership without crossing that dependency boundary.
 *
 * @see ADR-086 for the vocab-gen graph export pattern
 * @see docs/architecture/architectural-decisions/031 for generation-time extraction
 */
import { describe, expect, it } from 'vitest';

import type {
  ExtractedKeyword,
  ExtractedLesson,
  ExtractedMisconception,
  ExtractedPriorKnowledge,
} from '../extractors/index.js';
import type { ExtractedThread } from '../extractors/thread-extractor.js';

import {
  generateGraphCorpusData,
  type GraphCorpus,
  type GraphCorpusInput,
  type GraphCorpusUnitNode,
} from './graph-corpus-generator.js';
import { mintMisconceptionId } from './misconception-mint.js';

function makeInput(overrides: Partial<GraphCorpusInput> = {}): GraphCorpusInput {
  return {
    priorKnowledge: [],
    threads: [],
    lessons: [],
    misconceptions: [],
    keywords: [],
    sourceVersion: '2026-05-21T13:45:16.086Z',
    ...overrides,
  };
}

function unitNodes(corpus: GraphCorpus): readonly GraphCorpusUnitNode[] {
  return corpus.nodes.filter((node): node is GraphCorpusUnitNode => node.kind === 'unit');
}

describe('generateGraphCorpusData', () => {
  const baseThread: ExtractedThread = {
    slug: 'number-fractions',
    title: 'Number: Fractions',
    firstYear: 2,
    lastYear: 6,
    units: [
      {
        unitSlug: 'fractions-year-2',
        unitTitle: 'Fractions Year 2',
        order: 1,
        subject: 'maths',
        keyStage: 'ks1',
        year: 2,
      },
      {
        unitSlug: 'fractions-year-3',
        unitTitle: 'Fractions Year 3',
        order: 2,
        subject: 'maths',
        keyStage: 'ks2',
        year: 3,
      },
      {
        unitSlug: 'fractions-year-4',
        unitTitle: 'Fractions Year 4',
        order: 3,
        subject: 'maths',
        keyStage: 'ks2',
        year: 4,
      },
    ],
  };

  // A unit with a prior-knowledge entry. It is also the last unit of baseThread,
  // so it is both a PK unit and a thread unit (the de-duplication case).
  const basePriorKnowledge: ExtractedPriorKnowledge = {
    requirement: 'Understand equal parts',
    unitSlug: 'fractions-year-4',
    unitTitle: 'Fractions Year 4',
    subject: 'maths',
    keyStage: 'ks2',
    year: 4,
  };

  // A lesson placed in a thread unit, carrying one misconception.
  const baseLesson: ExtractedLesson = {
    lessonSlug: 'comparing-fractions',
    lessonTitle: 'Comparing fractions',
    unitSlug: 'fractions-year-3',
    unitTitle: 'Fractions Year 3',
    subject: 'maths',
    keyStage: 'ks2',
  };

  const baseMisconception: ExtractedMisconception = {
    misconception: 'A bigger denominator means a bigger fraction',
    response: 'Use bar models to show that more parts means smaller parts.',
    subject: 'maths',
    keyStage: 'ks2',
    lessonSlug: 'comparing-fractions',
    lessonTitle: 'Comparing fractions',
  };

  const baseKeyword: ExtractedKeyword = {
    term: 'denominator',
    displayTerm: 'Denominator',
    definition: 'The number below the line in a fraction.',
    frequency: 1,
    subjects: ['maths'],
    firstYear: 3,
    lessonSlugs: ['comparing-fractions'],
  };

  describe('graph metadata', () => {
    it('returns a semver corpus version (the exact value is generator metadata, not contract)', () => {
      const result = generateGraphCorpusData(makeInput());

      expect(result.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('includes a generatedAt ISO timestamp', () => {
      const result = generateGraphCorpusData(makeInput());

      expect(result.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('carries the sourceVersion through from input', () => {
      const result = generateGraphCorpusData(makeInput());

      expect(result.sourceVersion).toBe('2026-05-21T13:45:16.086Z');
    });
  });

  describe('identity model — materialised kind-qualified node ids', () => {
    it('gives every node an explicit id qualified by its kind', () => {
      const result = generateGraphCorpusData(
        makeInput({
          priorKnowledge: [basePriorKnowledge],
          threads: [baseThread],
          lessons: [baseLesson],
          misconceptions: [baseMisconception],
        }),
      );

      expect(result.nodes.length).toBeGreaterThan(0);
      for (const node of result.nodes) {
        expect(node.id.startsWith(`${node.kind}:`)).toBe(true);
      }
    });

    it('preserves the unitSlug as a content key alongside the id', () => {
      const result = generateGraphCorpusData(makeInput({ threads: [baseThread] }));

      const node = unitNodes(result).find((n) => n.id === 'unit:fractions-year-2');
      expect(node?.unitSlug).toBe('fractions-year-2');
    });
  });

  describe('unit nodes — union of prior-knowledge, thread, and lesson-hosting units', () => {
    it('creates a node for a thread unit that has no prior-knowledge entry', () => {
      const result = generateGraphCorpusData(
        makeInput({ priorKnowledge: [basePriorKnowledge], threads: [baseThread] }),
      );

      expect(unitNodes(result).find((n) => n.unitSlug === 'fractions-year-2')).toBeDefined();
      expect(unitNodes(result).find((n) => n.unitSlug === 'fractions-year-3')).toBeDefined();
    });

    it('carries unit metadata onto nodes built from thread units', () => {
      const result = generateGraphCorpusData(makeInput({ threads: [baseThread] }));

      const node = unitNodes(result).find((n) => n.unitSlug === 'fractions-year-3');
      expect(node?.unitTitle).toBe('Fractions Year 3');
      expect(node?.subject).toBe('maths');
      expect(node?.keyStage).toBe('ks2');
      expect(node?.year).toBe(3);
    });

    it('collects prior-knowledge requirements on the node where present', () => {
      const priorKnowledge: readonly ExtractedPriorKnowledge[] = [
        { ...basePriorKnowledge, requirement: 'Requirement 1' },
        { ...basePriorKnowledge, requirement: 'Requirement 2' },
      ];

      const result = generateGraphCorpusData(makeInput({ priorKnowledge, threads: [baseThread] }));

      const node = unitNodes(result).find((n) => n.unitSlug === 'fractions-year-4');
      expect(node?.priorKnowledge).toContain('Requirement 1');
      expect(node?.priorKnowledge).toContain('Requirement 2');
      expect(node?.priorKnowledge).toHaveLength(2);
    });

    it('gives a thread-only unit an empty prior-knowledge list (not undefined)', () => {
      const result = generateGraphCorpusData(makeInput({ threads: [baseThread] }));

      const node = unitNodes(result).find((n) => n.unitSlug === 'fractions-year-2');
      expect(node?.priorKnowledge).toEqual([]);
    });

    it('records thread membership on nodes', () => {
      const result = generateGraphCorpusData(
        makeInput({ priorKnowledge: [basePriorKnowledge], threads: [baseThread] }),
      );

      const node = unitNodes(result).find((n) => n.unitSlug === 'fractions-year-4');
      expect(node?.threadSlugs).toContain('number-fractions');
    });

    it('does not duplicate a unit present in both prior knowledge and a thread', () => {
      const result = generateGraphCorpusData(
        makeInput({ priorKnowledge: [basePriorKnowledge], threads: [baseThread] }),
      );

      const matches = unitNodes(result).filter((n) => n.unitSlug === 'fractions-year-4');
      expect(matches).toHaveLength(1);
    });

    it('emits a unit node for a lesson-hosting unit absent from threads and prior knowledge', () => {
      // The G1a integrity rule: the unit exists in the bulk source (it hosts a
      // lesson record), so it is emitted rather than leaving a dangling
      // placement edge.
      const orphanHostedLesson: ExtractedLesson = {
        ...baseLesson,
        lessonSlug: 'performance-poem',
        lessonTitle: 'Performing a poem',
        unitSlug: 'performance-poetry',
        unitTitle: 'Performance Poetry',
        subject: 'english',
        keyStage: 'ks2',
      };

      const result = generateGraphCorpusData(makeInput({ lessons: [orphanHostedLesson] }));

      const node = unitNodes(result).find((n) => n.unitSlug === 'performance-poetry');
      expect(node).toBeDefined();
      expect(node?.year).toBeUndefined();
      expect(node?.priorKnowledge).toEqual([]);
      expect(node?.threadSlugs).toEqual([]);
    });
  });

  describe('G2 nodes — thread, lesson, and misconception kinds', () => {
    const fullInput = makeInput({
      priorKnowledge: [basePriorKnowledge],
      threads: [baseThread],
      lessons: [baseLesson],
      misconceptions: [baseMisconception],
    });

    it('emits a thread node per extracted thread with its metadata', () => {
      const result = generateGraphCorpusData(fullInput);

      const thread = result.nodes.find((n) => n.kind === 'thread');
      expect(thread).toMatchObject({
        id: 'thread:number-fractions',
        threadSlug: 'number-fractions',
        title: 'Number: Fractions',
        firstYear: 2,
        lastYear: 6,
      });
    });

    it('emits one lesson node per distinct lesson slug with its metadata', () => {
      const result = generateGraphCorpusData(fullInput);

      const lesson = result.nodes.find((n) => n.kind === 'lesson');
      expect(lesson).toMatchObject({
        id: 'lesson:comparing-fractions',
        lessonSlug: 'comparing-fractions',
        lessonTitle: 'Comparing fractions',
        subject: 'maths',
        keyStage: 'ks2',
      });
    });

    it('emits a misconception node with the content-hash mint id and raw display text', () => {
      const result = generateGraphCorpusData(fullInput);

      const expectedId = mintMisconceptionId(
        'comparing-fractions',
        'A bigger denominator means a bigger fraction',
      );
      const node = result.nodes.find((n) => n.id === expectedId);
      expect(node).toMatchObject({
        kind: 'misconception',
        misconception: 'A bigger denominator means a bigger fraction',
        response: 'Use bar models to show that more parts means smaller parts.',
      });
    });

    it('models multi-unit lesson placement as edges, never duplicate lesson nodes', () => {
      const secondPlacement: ExtractedLesson = {
        ...baseLesson,
        unitSlug: 'fractions-year-4',
        unitTitle: 'Fractions Year 4',
      };

      const result = generateGraphCorpusData(
        makeInput({ threads: [baseThread], lessons: [baseLesson, secondPlacement] }),
      );

      const lessons = result.nodes.filter((n) => n.kind === 'lesson');
      expect(lessons).toHaveLength(1);
      const placements = result.edges.filter((e) => e.type === 'containsLesson');
      expect(placements).toHaveLength(2);
      expect(placements.map((e) => e.source).sort((a, b) => a.localeCompare(b))).toEqual([
        'unit:fractions-year-3',
        'unit:fractions-year-4',
      ]);
    });
  });

  describe('edges — prerequisiteFor in GraphEdge shape, endpoints as node ids', () => {
    it('creates prerequisiteFor edges from thread ordering with id endpoints', () => {
      const result = generateGraphCorpusData(makeInput({ threads: [baseThread] }));

      const edge = result.edges.find(
        (e) => e.source === 'unit:fractions-year-2' && e.target === 'unit:fractions-year-3',
      );
      expect(edge).toBeDefined();
      expect(edge?.type).toBe('prerequisiteFor');
    });

    it('orders edges along the thread sequence (year-3 → year-4 present)', () => {
      const result = generateGraphCorpusData(makeInput({ threads: [baseThread] }));

      const edge = result.edges.find(
        (e) => e.source === 'unit:fractions-year-3' && e.target === 'unit:fractions-year-4',
      );
      expect(edge).toBeDefined();
    });

    it('creates no prerequisiteFor edges for a single-unit thread', () => {
      const singleUnitThread: ExtractedThread = {
        slug: 'single-unit-thread',
        title: 'Single Unit',
        firstYear: 5,
        lastYear: 5,
        units: [
          {
            unitSlug: 'only-unit',
            unitTitle: 'Only Unit',
            order: 1,
            subject: 'science',
            keyStage: 'ks2',
            year: 5,
          },
        ],
      };

      const result = generateGraphCorpusData(makeInput({ threads: [singleUnitThread] }));

      expect(result.edges.filter((e) => e.type === 'prerequisiteFor')).toHaveLength(0);
    });
  });

  describe('G2 edges — the thread→unit→lesson→misconception chain', () => {
    const fullInput = makeInput({
      threads: [baseThread],
      lessons: [baseLesson],
      misconceptions: [baseMisconception],
    });

    it('links each thread to its units with containsUnit edges', () => {
      const result = generateGraphCorpusData(fullInput);

      const edges = result.edges.filter((e) => e.type === 'containsUnit');
      expect(
        edges.map((e) => `${e.source}>${e.target}`).sort((a, b) => a.localeCompare(b)),
      ).toEqual([
        'thread:number-fractions>unit:fractions-year-2',
        'thread:number-fractions>unit:fractions-year-3',
        'thread:number-fractions>unit:fractions-year-4',
      ]);
    });

    it('links each placing unit to the lesson with a containsLesson edge', () => {
      const result = generateGraphCorpusData(fullInput);

      expect(result.edges).toContainEqual({
        source: 'unit:fractions-year-3',
        type: 'containsLesson',
        target: 'lesson:comparing-fractions',
      });
    });

    it('links each lesson to its misconceptions with addressesMisconception edges', () => {
      const result = generateGraphCorpusData(fullInput);

      const expectedId = mintMisconceptionId(
        'comparing-fractions',
        'A bigger denominator means a bigger fraction',
      );
      expect(result.edges).toContainEqual({
        source: 'lesson:comparing-fractions',
        type: 'addressesMisconception',
        target: expectedId,
      });
    });

    it('emits distinct containsUnit edges for boundary-coincident thread/unit slug pairs', () => {
      // "ab"+"cdef" and "abc"+"def" concatenate identically; each pair is a
      // distinct thread→unit containment and must emit its own edge.
      const threadA: ExtractedThread = {
        slug: 'ab',
        title: 'Thread AB',
        firstYear: 2,
        lastYear: 3,
        units: [
          {
            unitSlug: 'cdef',
            unitTitle: 'Unit CDEF',
            order: 1,
            subject: 'maths',
            keyStage: 'ks1',
            year: 2,
          },
        ],
      };
      const threadB: ExtractedThread = {
        slug: 'abc',
        title: 'Thread ABC',
        firstYear: 2,
        lastYear: 3,
        units: [
          {
            unitSlug: 'def',
            unitTitle: 'Unit DEF',
            order: 1,
            subject: 'maths',
            keyStage: 'ks1',
            year: 2,
          },
        ],
      };

      const result = generateGraphCorpusData(makeInput({ threads: [threadA, threadB] }));

      const edges = result.edges.filter((e) => e.type === 'containsUnit');
      expect(edges).toHaveLength(2);
      expect(edges).toContainEqual({
        source: 'thread:ab',
        type: 'containsUnit',
        target: 'unit:cdef',
      });
      expect(edges).toContainEqual({
        source: 'thread:abc',
        type: 'containsUnit',
        target: 'unit:def',
      });
    });

    it('emits distinct containsLesson edges for boundary-coincident unit/lesson slug pairs', () => {
      const lessonA: ExtractedLesson = {
        lessonSlug: 'cdef',
        lessonTitle: 'Lesson CDEF',
        unitSlug: 'ab',
        unitTitle: 'Unit AB',
        subject: 'maths',
        keyStage: 'ks2',
      };
      const lessonB: ExtractedLesson = {
        lessonSlug: 'def',
        lessonTitle: 'Lesson DEF',
        unitSlug: 'abc',
        unitTitle: 'Unit ABC',
        subject: 'maths',
        keyStage: 'ks2',
      };

      const result = generateGraphCorpusData(makeInput({ lessons: [lessonA, lessonB] }));

      const edges = result.edges.filter((e) => e.type === 'containsLesson');
      expect(edges).toHaveLength(2);
      expect(edges).toContainEqual({
        source: 'unit:ab',
        type: 'containsLesson',
        target: 'lesson:cdef',
      });
      expect(edges).toContainEqual({
        source: 'unit:abc',
        type: 'containsLesson',
        target: 'lesson:def',
      });
    });
  });

  describe('integrity — zero dangling endpoints (constructs in createGraphView)', () => {
    it('resolves every edge endpoint to a node id across all kinds (zero dangling)', () => {
      const result = generateGraphCorpusData(
        makeInput({
          priorKnowledge: [basePriorKnowledge],
          threads: [baseThread],
          lessons: [baseLesson],
          misconceptions: [baseMisconception],
        }),
      );

      const nodeIds = new Set(result.nodes.map((n) => n.id));
      for (const edge of result.edges) {
        expect(nodeIds.has(edge.source)).toBe(true);
        expect(nodeIds.has(edge.target)).toBe(true);
      }
    });

    it('emits no duplicate node ids (createGraphView rejects duplicates)', () => {
      const result = generateGraphCorpusData(
        makeInput({
          priorKnowledge: [basePriorKnowledge],
          threads: [baseThread],
          lessons: [baseLesson],
          misconceptions: [baseMisconception],
        }),
      );

      const ids = result.nodes.map((n) => n.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('records dropped-edge provenance — empty when all endpoints resolve', () => {
      const result = generateGraphCorpusData(
        makeInput({ priorKnowledge: [basePriorKnowledge], threads: [baseThread] }),
      );

      expect(result.droppedEdges).toEqual([]);
    });

    it('drops a misconception edge whose lesson is absent from the lesson records, with provenance', () => {
      // A misconception whose lessonSlug has no lesson record cannot anchor a
      // resolvable addressesMisconception edge; the node is still emitted and
      // the edge drop is recorded (fail-loud, the droppedEdges pattern).
      const orphan: ExtractedMisconception = {
        ...baseMisconception,
        lessonSlug: 'no-such-lesson',
      };

      const result = generateGraphCorpusData(makeInput({ misconceptions: [orphan] }));

      expect(result.edges.filter((e) => e.type === 'addressesMisconception')).toHaveLength(0);
      expect(result.droppedEdges).toHaveLength(1);
      expect(result.droppedEdges[0]).toMatchObject({
        source: 'lesson:no-such-lesson',
        type: 'addressesMisconception',
      });
    });

    it('keeps the dropped list well-formed with mixed PK + thread input', () => {
      const pkOnly: ExtractedPriorKnowledge = {
        requirement: 'Standalone requirement',
        unitSlug: 'isolated-unit',
        unitTitle: 'Isolated Unit',
        subject: 'science',
        keyStage: 'ks3',
        year: 7,
      };

      const result = generateGraphCorpusData(
        makeInput({ priorKnowledge: [pkOnly], threads: [baseThread] }),
      );

      expect(Array.isArray(result.droppedEdges)).toBe(true);
      // The isolated PK unit still gets a node (anchorable), with no edges.
      expect(unitNodes(result).find((n) => n.unitSlug === 'isolated-unit')).toBeDefined();
    });
  });

  describe('stats', () => {
    const fullInput = makeInput({
      priorKnowledge: [basePriorKnowledge],
      threads: [baseThread],
      lessons: [baseLesson],
      misconceptions: [baseMisconception],
      keywords: [baseKeyword],
    });

    it('reports node and edge totals', () => {
      const result = generateGraphCorpusData(fullInput);

      expect(result.stats.totalNodes).toBe(result.nodes.length);
      expect(result.stats.totalEdges).toBe(result.edges.length);
    });

    it('reports per-kind node counts and per-type edge counts', () => {
      const result = generateGraphCorpusData(fullInput);

      expect(result.stats.nodeKindCounts).toEqual({
        unit: 3,
        thread: 1,
        lesson: 1,
        misconception: 1,
        keyword: 1,
      });
      expect(result.stats.edgeTypeCounts).toEqual({
        prerequisiteFor: 2,
        containsUnit: 3,
        containsLesson: 1,
        addressesMisconception: 1,
        containsKeyword: 1,
      });
    });

    it('lists the unique subjects present in the corpus', () => {
      const result = generateGraphCorpusData(makeInput({ threads: [baseThread] }));

      expect(result.stats.subjectsCovered).toContain('maths');
    });
  });

  describe('graph structure', () => {
    it('returns a well-formed GraphCorpus with all required fields', () => {
      const result = generateGraphCorpusData(
        makeInput({ priorKnowledge: [basePriorKnowledge], threads: [baseThread] }),
      );

      expect(result).toHaveProperty('version');
      expect(result).toHaveProperty('generatedAt');
      expect(result).toHaveProperty('sourceVersion');
      expect(result).toHaveProperty('stats');
      expect(result).toHaveProperty('nodes');
      expect(result).toHaveProperty('edges');
      expect(result).toHaveProperty('sequences');
      expect(result).toHaveProperty('droppedEdges');
      expect(result).toHaveProperty('droppedDuplicates');
      expect(result).toHaveProperty('seeAlso');
    });
  });
});
