/**
 * G2 stability-contract tests for the graph-corpus generator: the
 * order-independence, churn-semantics, and dedup/provenance halves of the
 * five-part contract (mint golden vectors live in
 * `misconception-mint.unit.test.ts`; edge-end integrity and the real-corpus
 * count guards live in `graph-corpus-generator.unit.test.ts` and
 * `graph-corpus-emitted.integration.test.ts`).
 *
 * @remarks
 * The contract is the stability-across-regenerations promise of the settled
 * mint rule (design verdict
 * `.agent/reports/g2-misconception-mint-rule-design-2026-06-10.md`): the same
 * logical corpus emits identically regardless of enumeration order; content
 * edits churn ids honestly (never silent re-pointing, never renumber
 * cascades); within-lesson dedup is idempotent with fail-loud provenance.
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

/** The corpus with its generation timestamp pinned (the only legitimately varying field). */
function timeless(corpus: GraphCorpus): GraphCorpus {
  return { ...corpus, generatedAt: 'pinned-for-comparison' };
}

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

const basePriorKnowledge: ExtractedPriorKnowledge = {
  requirement: 'Understand equal parts',
  unitSlug: 'fractions-year-4',
  unitTitle: 'Fractions Year 4',
  subject: 'maths',
  keyStage: 'ks2',
  year: 4,
};

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

describe('generateGraphCorpusData — G2 stability contract', () => {
  describe('G2 contract — order-independence (deterministic emission)', () => {
    it('emits an identical corpus when every input array arrives in reversed order', () => {
      const secondLesson: ExtractedLesson = {
        lessonSlug: 'adding-fractions',
        lessonTitle: 'Adding fractions',
        unitSlug: 'fractions-year-4',
        unitTitle: 'Fractions Year 4',
        subject: 'maths',
        keyStage: 'ks2',
      };
      const secondMisconception: ExtractedMisconception = {
        misconception: 'You add denominators when adding fractions',
        response: 'Show that the parts must be the same size before counting them.',
        subject: 'maths',
        keyStage: 'ks2',
        lessonSlug: 'adding-fractions',
        lessonTitle: 'Adding fractions',
      };
      const secondThread: ExtractedThread = {
        slug: 'algebra-foundations',
        title: 'Algebra Foundations',
        firstYear: 4,
        lastYear: 6,
        units: [
          {
            unitSlug: 'fractions-year-4',
            unitTitle: 'Fractions Year 4',
            order: 1,
            subject: 'maths',
            keyStage: 'ks2',
            year: 4,
          },
          {
            unitSlug: 'algebra-year-5',
            unitTitle: 'Algebra Year 5',
            order: 2,
            subject: 'maths',
            keyStage: 'ks2',
            year: 5,
          },
        ],
      };

      const firstKeyword: ExtractedKeyword = {
        term: 'denominator',
        displayTerm: 'Denominator',
        definition: 'The number below the line in a fraction.',
        frequency: 1,
        subjects: ['maths'],
        firstYear: 3,
        lessonSlugs: ['comparing-fractions'],
      };
      const secondKeyword: ExtractedKeyword = {
        term: 'numerator',
        displayTerm: 'Numerator',
        definition: 'The number above the line in a fraction.',
        frequency: 1,
        subjects: ['maths'],
        firstYear: 3,
        lessonSlugs: ['adding-fractions'],
      };

      const forward = makeInput({
        priorKnowledge: [basePriorKnowledge],
        threads: [baseThread, secondThread],
        lessons: [baseLesson, secondLesson],
        misconceptions: [baseMisconception, secondMisconception],
        keywords: [firstKeyword, secondKeyword],
      });
      const reversed = makeInput({
        priorKnowledge: [...forward.priorKnowledge].reverse(),
        threads: [...forward.threads].reverse(),
        lessons: [...forward.lessons].reverse(),
        misconceptions: [...forward.misconceptions].reverse(),
        keywords: [...forward.keywords].reverse(),
      });

      expect(timeless(generateGraphCorpusData(reversed))).toEqual(
        timeless(generateGraphCorpusData(forward)),
      );
    });

    it('emits an identical corpus when one thread’s unit placements arrive in reversed order', () => {
      // Placement encounter order must not leak ANYWHERE in the corpus —
      // sequences AND prerequisiteFor chains share the (year, unitId) total
      // order (the year-axis re-derivation ruled at the G3 falsification;
      // the bulk's `unit.threads[].order` is a thread display index and
      // carries no within-thread ordering).
      const forwardThread: ExtractedThread = baseThread;
      const reversedThread: ExtractedThread = {
        ...baseThread,
        units: [...baseThread.units].reverse(),
      };

      const forward = generateGraphCorpusData(makeInput({ threads: [forwardThread] }));
      const reversed = generateGraphCorpusData(makeInput({ threads: [reversedThread] }));

      expect(timeless(reversed)).toEqual(timeless(forward));
      expect(reversed.sequences[0]?.placements.map((p) => p.year)).toEqual([2, 3, 4]);
    });

    it('chains same-year units deterministically by unitId (stated-arbitrary tie-break)', () => {
      // Within one year the order is not curricular; same-year units still
      // chain (count preservation — a ruling ground) in unitId order, and the
      // contract states the arbitrariness rather than implying pedagogy.
      const sameYearThread: ExtractedThread = {
        slug: 'same-year-thread',
        title: 'Same-year thread',
        firstYear: 4,
        lastYear: 5,
        units: [
          {
            unitSlug: 'unit-zebra',
            unitTitle: 'Unit zebra',
            order: 8,
            subject: 'maths',
            keyStage: 'ks2',
            year: 4,
          },
          {
            unitSlug: 'unit-apple',
            unitTitle: 'Unit apple',
            order: 8,
            subject: 'maths',
            keyStage: 'ks2',
            year: 4,
          },
          {
            unitSlug: 'unit-final',
            unitTitle: 'Unit final',
            order: 8,
            subject: 'maths',
            keyStage: 'ks2',
            year: 5,
          },
        ],
      };

      const result = generateGraphCorpusData(makeInput({ threads: [sameYearThread] }));

      const chain = result.edges
        .filter((edge) => edge.type === 'prerequisiteFor')
        .map((edge) => `${edge.source}>${edge.target}`);
      expect(chain).toEqual(['unit:unit-apple>unit:unit-zebra', 'unit:unit-zebra>unit:unit-final']);

      // Encounter order must not leak into the same-year chain either: the
      // pinned order above holds regardless of placement arrival order.
      const reversed = generateGraphCorpusData(
        makeInput({
          threads: [{ ...sameYearThread, units: [...sameYearThread.units].reverse() }],
        }),
      );
      expect(timeless(reversed)).toEqual(timeless(result));
    });

    it('emits an identical corpus when same-unit prior-knowledge records arrive in reversed order', () => {
      // Two requirements on ONE unit: encounter order must not leak into the
      // emitted priorKnowledge array (the bulk file enumeration is unsorted).
      const requirementA: ExtractedPriorKnowledge = {
        ...basePriorKnowledge,
        requirement: 'Understand equal parts',
      };
      const requirementB: ExtractedPriorKnowledge = {
        ...basePriorKnowledge,
        requirement: 'Count in fractions on a number line',
      };

      const forward = makeInput({ priorKnowledge: [requirementA, requirementB] });
      const reversed = makeInput({ priorKnowledge: [requirementB, requirementA] });

      expect(timeless(generateGraphCorpusData(reversed))).toEqual(
        timeless(generateGraphCorpusData(forward)),
      );
    });

    it('emits an identical corpus when same-lesson records arrive in reversed order', () => {
      // Same lesson, three records: two distinct texts plus a keep-first pair
      // (same text, different response). Intra-lesson encounter order must not
      // affect the emitted ids, the kept response, or the provenance.
      const secondText: ExtractedMisconception = {
        ...baseMisconception,
        misconception: 'Fractions are always smaller than one',
      };
      const responseVariant: ExtractedMisconception = {
        ...baseMisconception,
        response: 'Z — a different response for the same misconception text.',
      };

      const forward = makeInput({
        lessons: [baseLesson],
        misconceptions: [baseMisconception, secondText, responseVariant],
      });
      const reversed = makeInput({
        lessons: [baseLesson],
        misconceptions: [...forward.misconceptions].reverse(),
      });

      expect(timeless(generateGraphCorpusData(reversed))).toEqual(
        timeless(generateGraphCorpusData(forward)),
      );
    });
  });

  describe('G2 contract — churn semantics (honest churn, no silent re-pointing)', () => {
    const inputWith = (misconceptions: readonly ExtractedMisconception[]) =>
      makeInput({ lessons: [baseLesson], misconceptions });

    it('a text edit mints a NEW id and the old id is absent (no silent re-pointing)', () => {
      const before = generateGraphCorpusData(inputWith([baseMisconception]));
      const after = generateGraphCorpusData(
        inputWith([
          { ...baseMisconception, misconception: 'A bigger denominator makes a bigger fraction' },
        ]),
      );

      const oldId = mintMisconceptionId(
        'comparing-fractions',
        'A bigger denominator means a bigger fraction',
      );
      const newId = mintMisconceptionId(
        'comparing-fractions',
        'A bigger denominator makes a bigger fraction',
      );
      expect(before.nodes.some((n) => n.id === oldId)).toBe(true);
      expect(after.nodes.some((n) => n.id === oldId)).toBe(false);
      expect(after.nodes.some((n) => n.id === newId)).toBe(true);
    });

    it('a response edit preserves the id and updates the payload', () => {
      const after = generateGraphCorpusData(
        inputWith([{ ...baseMisconception, response: 'A fully reworded response.' }]),
      );

      const id = mintMisconceptionId(
        'comparing-fractions',
        'A bigger denominator means a bigger fraction',
      );
      const node = after.nodes.find((n) => n.id === id);
      expect(node).toMatchObject({ kind: 'misconception', response: 'A fully reworded response.' });
    });

    it('inserting a new misconception leaves every existing id unchanged (no renumber cascade)', () => {
      const before = generateGraphCorpusData(inputWith([baseMisconception]));
      const inserted: ExtractedMisconception = {
        ...baseMisconception,
        misconception: 'All fractions are smaller than one',
        response: 'Show improper fractions on a number line.',
      };
      const after = generateGraphCorpusData(inputWith([inserted, baseMisconception]));

      const beforeIds = before.nodes.filter((n) => n.kind === 'misconception').map((n) => n.id);
      const afterIds = new Set(
        after.nodes.filter((n) => n.kind === 'misconception').map((n) => n.id),
      );
      for (const id of beforeIds) {
        expect(afterIds.has(id)).toBe(true);
      }
      expect(afterIds.size).toBe(beforeIds.length + 1);
    });

    it('a lesson-slug rename churns the ids and edges honestly (old absent, new minted)', () => {
      const before = generateGraphCorpusData(inputWith([baseMisconception]));
      const renamedLesson: ExtractedLesson = { ...baseLesson, lessonSlug: 'comparing-fractions-2' };
      const renamedMisconception: ExtractedMisconception = {
        ...baseMisconception,
        lessonSlug: 'comparing-fractions-2',
      };
      const after = generateGraphCorpusData(
        makeInput({ lessons: [renamedLesson], misconceptions: [renamedMisconception] }),
      );

      const oldId = mintMisconceptionId(
        'comparing-fractions',
        'A bigger denominator means a bigger fraction',
      );
      const newId = mintMisconceptionId(
        'comparing-fractions-2',
        'A bigger denominator means a bigger fraction',
      );
      expect(before.nodes.some((n) => n.id === oldId)).toBe(true);
      expect(after.nodes.some((n) => n.id === oldId)).toBe(false);
      expect(after.nodes.some((n) => n.id === newId)).toBe(true);
      expect(after.edges.some((e) => e.target === oldId)).toBe(false);
      expect(after.edges).toContainEqual({
        source: 'lesson:comparing-fractions-2',
        type: 'addressesMisconception',
        target: newId,
      });
    });
  });

  describe('G2 contract — dedup idempotence and droppedDuplicates provenance', () => {
    it('collapses identical (lessonSlug, text) occurrences to one node, idempotently', () => {
      // The real-corpus multi-placement shape: the same lesson appears in two
      // records (two unit placements) carrying byte-identical pairs.
      const placementA = baseLesson;
      const placementB: ExtractedLesson = {
        ...baseLesson,
        unitSlug: 'fractions-year-4',
        unitTitle: 'Fractions Year 4',
      };

      const result = generateGraphCorpusData(
        makeInput({
          lessons: [placementA, placementB],
          misconceptions: [baseMisconception, { ...baseMisconception }],
        }),
      );

      expect(result.nodes.filter((n) => n.kind === 'misconception')).toHaveLength(1);
      expect(result.edges.filter((e) => e.type === 'addressesMisconception')).toHaveLength(1);
      expect(result.stats.collapsedIdenticalMisconceptions).toBe(1);
      expect(result.droppedDuplicates).toEqual([]);
    });

    it('keeps the first occurrence of a same-text-different-response pair and records provenance', () => {
      const variantResponse: ExtractedMisconception = {
        ...baseMisconception,
        response: 'Z — a different response for the same misconception text.',
      };

      const result = generateGraphCorpusData(
        makeInput({
          lessons: [baseLesson],
          misconceptions: [variantResponse, baseMisconception],
        }),
      );

      const nodes = result.nodes.filter((n) => n.kind === 'misconception');
      expect(nodes).toHaveLength(1);
      // Keep-first is deterministic: occurrences are ordered by (lessonSlug,
      // normalised text, response) before the keep-first pass, so the kept
      // response is independent of input order.
      expect(nodes[0]).toMatchObject({
        response: 'Use bar models to show that more parts means smaller parts.',
      });
      expect(result.droppedDuplicates).toHaveLength(1);
      expect(result.droppedDuplicates[0]).toMatchObject({
        lessonSlug: 'comparing-fractions',
        misconception: 'A bigger denominator means a bigger fraction',
        keptResponse: 'Use bar models to show that more parts means smaller parts.',
        droppedResponse: 'Z — a different response for the same misconception text.',
      });
      expect(result.droppedDuplicates[0]?.reason).toContain('keep-first');
    });

    it('skips blank misconception texts (defensive guard, zero hits on current data)', () => {
      const blank: ExtractedMisconception = { ...baseMisconception, misconception: '   ' };

      const result = generateGraphCorpusData(
        makeInput({ lessons: [baseLesson], misconceptions: [blank] }),
      );

      expect(result.nodes.filter((n) => n.kind === 'misconception')).toHaveLength(0);
    });
  });
});
