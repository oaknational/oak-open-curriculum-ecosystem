/**
 * Unit tests for the graph-corpus sequence emission (G3).
 *
 * @remarks
 * TDD: these tests describe the year-ordered thread→unit placement data the
 * corpus emits (plan `graph-tools-value-redesign`, deliverable G3). The bulk
 * exports NO authoritative within-thread unit ordering — `unit.threads[].order`
 * is the THREAD's display index, constant per thread (schema: "Display/order
 * index for the thread") — so the progression axis is the placement's teaching
 * YEAR, ordered `(year, unitId)` with year-less placements last: a total
 * order, deterministic regardless of bulk-file enumeration order. The
 * describing surface is the emitted corpus dataset (`sequences` + the
 * collapse stat); the wire envelope is described at the tool cycle.
 *
 * @see ADR-086 for the vocab-gen graph export pattern
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedThread } from '../extractors/thread-extractor.js';

import { generateGraphCorpusData, type GraphCorpusInput } from './graph-corpus-generator.js';

function makeInput(overrides: Partial<GraphCorpusInput> = {}): GraphCorpusInput {
  return {
    priorKnowledge: [],
    threads: [],
    lessons: [],
    misconceptions: [],
    keywords: [],
    sourceVersion: '2026-06-10T16:43:00.027Z',
    ...overrides,
  };
}

describe('generateGraphCorpusData — sequences (G3 year-ordered placement data)', () => {
  const fractionsThread: ExtractedThread = {
    slug: 'number-fractions',
    title: 'Number: Fractions',
    firstYear: 2,
    lastYear: 6,
    units: [
      {
        unitSlug: 'fractions-year-3',
        unitTitle: 'Fractions Year 3',
        order: 8,
        subject: 'maths',
        keyStage: 'ks2',
        year: 3,
      },
      {
        unitSlug: 'fractions-year-2',
        unitTitle: 'Fractions Year 2',
        order: 8,
        subject: 'maths',
        keyStage: 'ks1',
        year: 2,
      },
      {
        unitSlug: 'fractions-year-4',
        unitTitle: 'Fractions Year 4',
        order: 8,
        subject: 'maths',
        keyStage: 'ks2',
        year: 4,
      },
    ],
  };

  // A thread whose slug sorts BEFORE fractionsThread's, with a recurring unit
  // (same unit at two distinct years — a real revisit) and one exact-duplicate
  // placement (same unit, same year — the same placement fact restated by a
  // sibling sequence file).
  const recurringThread: ExtractedThread = {
    slug: 'algebra-foundations',
    title: 'Algebra foundations',
    firstYear: 6,
    lastYear: 11,
    units: [
      {
        unitSlug: 'expressions',
        unitTitle: 'Expressions',
        order: 8,
        subject: 'maths',
        keyStage: 'ks3',
        year: 8,
      },
      {
        unitSlug: 'sequences-intro',
        unitTitle: 'Sequences introduction',
        order: 8,
        subject: 'maths',
        keyStage: 'ks2',
        year: 6,
      },
      {
        unitSlug: 'expressions',
        unitTitle: 'Expressions',
        order: 8,
        subject: 'maths',
        keyStage: 'ks4',
        year: 10,
      },
      {
        unitSlug: 'sequences-intro',
        unitTitle: 'Sequences introduction',
        order: 8,
        subject: 'maths',
        keyStage: 'ks2',
        year: 6,
      },
    ],
  };

  it('emits one sequence per thread with placements ordered by (year, unitId)', () => {
    const result = generateGraphCorpusData(makeInput({ threads: [fractionsThread] }));

    expect(result.sequences).toHaveLength(1);
    const sequence = result.sequences[0];
    expect(sequence?.threadId).toBe('thread:number-fractions');
    expect(sequence?.placements).toEqual([
      { unitId: 'unit:fractions-year-2', year: 2 },
      { unitId: 'unit:fractions-year-3', year: 3 },
      { unitId: 'unit:fractions-year-4', year: 4 },
    ]);
  });

  it('breaks an equal-year tie deterministically by unitId', () => {
    const tiedThread: ExtractedThread = {
      ...fractionsThread,
      units: [
        {
          unitSlug: 'fractions-zebra',
          unitTitle: 'Fractions zebra',
          order: 8,
          subject: 'maths',
          keyStage: 'ks2',
          year: 3,
        },
        {
          unitSlug: 'fractions-apple',
          unitTitle: 'Fractions apple',
          order: 8,
          subject: 'maths',
          keyStage: 'ks2',
          year: 3,
        },
      ],
    };

    const result = generateGraphCorpusData(makeInput({ threads: [tiedThread] }));

    expect(result.sequences[0]?.placements.map((p) => p.unitId)).toEqual([
      'unit:fractions-apple',
      'unit:fractions-zebra',
    ]);
  });

  it('sorts year-less placements after yeared ones, by unitId', () => {
    const yearlessThread: ExtractedThread = {
      ...fractionsThread,
      units: [
        {
          unitSlug: 'all-years-unit',
          unitTitle: 'All-years unit',
          order: 8,
          subject: 'maths',
          keyStage: 'ks2',
          year: undefined,
        },
        ...fractionsThread.units,
      ],
    };

    const result = generateGraphCorpusData(makeInput({ threads: [yearlessThread] }));

    expect(result.sequences[0]?.placements.map((p) => p.unitId)).toEqual([
      'unit:fractions-year-2',
      'unit:fractions-year-3',
      'unit:fractions-year-4',
      'unit:all-years-unit',
    ]);
  });

  it('sorts sequences by threadId for a deterministic artefact', () => {
    const result = generateGraphCorpusData(
      makeInput({ threads: [fractionsThread, recurringThread] }),
    );

    expect(result.sequences.map((s) => s.threadId)).toEqual([
      'thread:algebra-foundations',
      'thread:number-fractions',
    ]);
  });

  it('preserves a recurring unit as distinct placements at its distinct years', () => {
    const result = generateGraphCorpusData(makeInput({ threads: [recurringThread] }));

    const placements = result.sequences[0]?.placements ?? [];
    const expressionYears = placements
      .filter((p) => p.unitId === 'unit:expressions')
      .map((p) => p.year);
    expect(expressionYears).toEqual([8, 10]);
  });

  it('collapses exact-duplicate placements (same unitId, same year) and counts them', () => {
    const result = generateGraphCorpusData(makeInput({ threads: [recurringThread] }));

    const placements = result.sequences[0]?.placements ?? [];
    const introPlacements = placements.filter((p) => p.unitId === 'unit:sequences-intro');
    expect(introPlacements).toHaveLength(1);
    expect(result.stats.collapsedIdenticalPlacements).toBe(1);
  });

  it('resolves every sequence endpoint to an emitted node (zero dangling)', () => {
    const result = generateGraphCorpusData(
      makeInput({ threads: [fractionsThread, recurringThread] }),
    );

    const nodeIds = new Set(result.nodes.map((node) => node.id));
    for (const sequence of result.sequences) {
      expect(nodeIds.has(sequence.threadId)).toBe(true);
      for (const placement of sequence.placements) {
        expect(nodeIds.has(placement.unitId)).toBe(true);
      }
    }
  });

  it('returns an empty sequences list for an empty thread input (well-formed absence)', () => {
    const result = generateGraphCorpusData(makeInput());

    expect(result.sequences).toEqual([]);
    expect(result.stats.collapsedIdenticalPlacements).toBe(0);
  });
});
