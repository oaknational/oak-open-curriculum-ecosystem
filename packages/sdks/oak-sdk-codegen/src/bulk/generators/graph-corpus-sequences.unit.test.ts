/**
 * Unit tests for the graph-corpus sequence emission (G3).
 *
 * @remarks
 * TDD: these tests describe the thread→unit placement data the corpus emits.
 * A thread is a tag; the order is the subject's authored curriculum sequence
 * (the bulk `sequence` array, primary phase then secondary), one sequence
 * per (thread, subject), never interleaved across subjects. The describing
 * surface is the emitted corpus dataset (`sequences` + the collapse stat);
 * the wire envelope is described at the tool cycle.
 *
 * @see ADR-086 for the vocab-gen graph export pattern
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedThread, ThreadUnit } from '../extractors/thread-extractor.js';

import { generateGraphCorpusData, type GraphCorpusInput } from './graph-corpus-generator.js';
import { compareSequencePositions } from './graph-corpus-sequences.js';

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

function mathsUnit(
  unitSlug: string,
  phase: 'primary' | 'secondary',
  sequenceIndex: number,
  year: number | undefined,
): ThreadUnit {
  return {
    unitSlug,
    unitTitle: unitSlug,
    subject: 'maths',
    sequenceSlug: `maths-${phase}`,
    sequenceIndex,
    keyStage: phase === 'primary' ? 'ks2' : 'ks3',
    year,
  };
}

describe('generateGraphCorpusData — sequences (G3 curriculum-ordered placement data)', () => {
  // Same-year units whose slugs sort AGAINST their curriculum position: the
  // authored order is what must survive.
  const fractionsThread: ExtractedThread = {
    slug: 'number-fractions',
    title: 'Number: Fractions',
    firstYear: 3,
    lastYear: 3,
    units: [
      mathsUnit('zebra-comes-first-in-the-curriculum', 'primary', 4, 3),
      mathsUnit('apple-comes-second-in-the-curriculum', 'primary', 9, 3),
      mathsUnit('mango-comes-third-in-the-curriculum', 'primary', 12, 3),
    ],
  };

  it('emits one sequence per thread with placements in the subject sequence order, not alphabetical', () => {
    const result = generateGraphCorpusData(makeInput({ threads: [fractionsThread] }));

    expect(result.sequences).toHaveLength(1);
    const sequence = result.sequences[0];
    expect(sequence?.threadId).toBe('thread:number-fractions');
    expect(sequence?.subject).toBe('maths');
    expect(sequence?.placements).toEqual([
      { unitId: 'unit:zebra-comes-first-in-the-curriculum', year: 3 },
      { unitId: 'unit:apple-comes-second-in-the-curriculum', year: 3 },
      { unitId: 'unit:mango-comes-third-in-the-curriculum', year: 3 },
    ]);
  });

  it('emits the same placements whatever order the units were encountered in', () => {
    const forward = generateGraphCorpusData(makeInput({ threads: [fractionsThread] }));
    const reversed = generateGraphCorpusData(
      makeInput({ threads: [{ ...fractionsThread, units: [...fractionsThread.units].reverse() }] }),
    );

    expect(reversed.sequences).toEqual(forward.sequences);
  });

  it('runs years ascending, with the sequence index ordering only within a year', () => {
    // The bulk array interleaves years (it is sorted by within-year rank), so
    // a year-3 unit at a high array index still precedes a year-6 unit at a
    // low one, and the primary file's years precede the secondary file's.
    const acrossYears: ExtractedThread = {
      ...fractionsThread,
      units: [
        mathsUnit('ratio-y7', 'secondary', 0, 7),
        mathsUnit('fractions-y6', 'primary', 2, 6),
        mathsUnit('fractions-y3', 'primary', 30, 3),
      ],
    };

    const result = generateGraphCorpusData(makeInput({ threads: [acrossYears] }));

    expect(result.sequences[0]?.placements.map((p) => p.unitId)).toEqual([
      'unit:fractions-y3',
      'unit:fractions-y6',
      'unit:ratio-y7',
    ]);
  });

  it('lists "All years" units after the year-placed units, in their sequence order', () => {
    // The two year-less slugs sort AGAINST their sequence indexes, so the
    // expected tail is only produced by index order — an alphabetical
    // tie-break would invert it.
    const withAllYears: ExtractedThread = {
      ...fractionsThread,
      units: [
        mathsUnit('zebra-swims-all-years', 'primary', 0, undefined),
        mathsUnit('fractions-y3', 'primary', 1, 3),
        mathsUnit('apple-swims-all-years', 'primary', 4, undefined),
      ],
    };

    const result = generateGraphCorpusData(makeInput({ threads: [withAllYears] }));

    expect(result.sequences[0]?.placements).toEqual([
      { unitId: 'unit:fractions-y3', year: 3 },
      { unitId: 'unit:zebra-swims-all-years', year: undefined },
      { unitId: 'unit:apple-swims-all-years', year: undefined },
    ]);
  });

  it('separates units sharing a year across two bulk sequences by sequence slug', () => {
    // A subject's primary and secondary files can both record a unit at one
    // year (KS4 tier overlaps; "All years" units listed in both phases). The
    // sequence slug decides, so the maths-primary unit leads even though its
    // unit slug sorts last — and both indexes are 0, so the slug term is the
    // only term that can order this pair.
    const acrossFiles: ExtractedThread = {
      ...fractionsThread,
      units: [
        mathsUnit('apple-recorded-in-secondary', 'secondary', 0, 6),
        mathsUnit('zebra-recorded-in-primary', 'primary', 0, 6),
      ],
    };

    const result = generateGraphCorpusData(makeInput({ threads: [acrossFiles] }));

    expect(result.sequences[0]?.placements.map((p) => p.unitId)).toEqual([
      'unit:zebra-recorded-in-primary',
      'unit:apple-recorded-in-secondary',
    ]);
  });

  it('emits one sequence per subject for a thread spanning subjects, subject-sorted and never interleaved', () => {
    const adjectives: ExtractedThread = {
      slug: 'adjectives',
      title: 'Adjectives',
      firstYear: 7,
      lastYear: 8,
      units: [
        { ...mathsUnit('spanish-adjectives-y8', 'secondary', 5, 8), subject: 'spanish' },
        { ...mathsUnit('french-adjectives-y7', 'secondary', 2, 7), subject: 'french' },
        { ...mathsUnit('spanish-adjectives-y7', 'secondary', 1, 7), subject: 'spanish' },
        { ...mathsUnit('french-adjectives-y8', 'secondary', 7, 8), subject: 'french' },
      ],
    };

    const result = generateGraphCorpusData(makeInput({ threads: [adjectives] }));

    expect(result.sequences).toEqual([
      {
        threadId: 'thread:adjectives',
        subject: 'french',
        placements: [
          { unitId: 'unit:french-adjectives-y7', year: 7 },
          { unitId: 'unit:french-adjectives-y8', year: 8 },
        ],
      },
      {
        threadId: 'thread:adjectives',
        subject: 'spanish',
        placements: [
          { unitId: 'unit:spanish-adjectives-y7', year: 7 },
          { unitId: 'unit:spanish-adjectives-y8', year: 8 },
        ],
      },
    ]);
  });

  it('sorts sequences by threadId for a deterministic artefact', () => {
    const algebra: ExtractedThread = {
      slug: 'algebra-foundations',
      title: 'Algebra foundations',
      firstYear: 6,
      lastYear: 6,
      units: [mathsUnit('sequences-intro', 'primary', 20, 6)],
    };

    const result = generateGraphCorpusData(makeInput({ threads: [fractionsThread, algebra] }));

    expect(result.sequences.map((s) => s.threadId)).toEqual([
      'thread:algebra-foundations',
      'thread:number-fractions',
    ]);
  });

  it('preserves a recurring unit as distinct placements at its distinct years', () => {
    const revisited: ExtractedThread = {
      ...fractionsThread,
      units: [
        mathsUnit('expressions', 'secondary', 3, 8),
        mathsUnit('expressions', 'secondary', 40, 10),
      ],
    };

    const result = generateGraphCorpusData(makeInput({ threads: [revisited] }));

    expect(result.sequences[0]?.placements).toEqual([
      { unitId: 'unit:expressions', year: 8 },
      { unitId: 'unit:expressions', year: 10 },
    ]);
  });

  it('collapses exact-duplicate placements (same unitId, same year) and counts them', () => {
    const restated: ExtractedThread = {
      ...fractionsThread,
      units: [
        mathsUnit('sequences-intro', 'primary', 20, 6),
        mathsUnit('sequences-intro', 'primary', 21, 6),
      ],
    };

    const result = generateGraphCorpusData(makeInput({ threads: [restated] }));

    expect(result.sequences[0]?.placements).toEqual([{ unitId: 'unit:sequences-intro', year: 6 }]);
    expect(result.stats.collapsedIdenticalPlacements).toBe(1);
  });

  it('resolves every sequence endpoint to an emitted node (zero dangling)', () => {
    const result = generateGraphCorpusData(makeInput({ threads: [fractionsThread] }));

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

/**
 * The comparator's three terms, each isolated so a deleted or reordered term
 * fails here rather than being diagnosed through the whole generator.
 */
describe('compareSequencePositions — one term at a time', () => {
  const sign = (n: number): number => Math.sign(n);

  it('orders by year first, whatever the slug and index say', () => {
    const earlier = mathsUnit('zzz-later-index-in-secondary', 'secondary', 99, 3);
    const later = mathsUnit('aaa-earlier-index-in-primary', 'primary', 0, 6);

    expect(sign(compareSequencePositions(earlier, later))).toBe(-1);
    expect(sign(compareSequencePositions(later, earlier))).toBe(1);
  });

  it('sorts a year-less unit after every year-placed unit', () => {
    const yearless = mathsUnit('aaa-all-years', 'primary', 0, undefined);
    const yearEleven = mathsUnit('zzz-year-11', 'secondary', 99, 11);

    expect(sign(compareSequencePositions(yearEleven, yearless))).toBe(-1);
    expect(sign(compareSequencePositions(yearless, yearEleven))).toBe(1);
  });

  it('breaks a year tie on the sequence slug before the index', () => {
    const primary = mathsUnit('zzz-in-primary', 'primary', 99, 6);
    const secondary = mathsUnit('aaa-in-secondary', 'secondary', 0, 6);

    expect(sign(compareSequencePositions(primary, secondary))).toBe(-1);
    expect(sign(compareSequencePositions(secondary, primary))).toBe(1);
  });

  it('breaks a year and slug tie on the bulk sequence index, not the unit slug', () => {
    const authoredFirst = mathsUnit('zzz-authored-first', 'primary', 3, 6);
    const authoredSecond = mathsUnit('aaa-authored-second', 'primary', 8, 6);

    expect(sign(compareSequencePositions(authoredFirst, authoredSecond))).toBe(-1);
    expect(sign(compareSequencePositions(authoredSecond, authoredFirst))).toBe(1);
  });

  it('reports two year-less units from one sequence as equal only when their index matches', () => {
    const first = mathsUnit('first', 'primary', 4, undefined);
    const same = mathsUnit('second', 'primary', 4, undefined);
    const later = mathsUnit('third', 'primary', 5, undefined);

    expect(compareSequencePositions(first, same)).toBe(0);
    expect(sign(compareSequencePositions(first, later))).toBe(-1);
  });
});
