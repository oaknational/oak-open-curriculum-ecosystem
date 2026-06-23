/**
 * Unit tests for prerequisiteFor dedup at graph-corpus emission.
 *
 * @remarks
 * TDD: these tests describe the deduplicated prerequisiteFor emission —
 * identical `{source, type, target}` triples recurring when threads share
 * adjacency carry no decodable signal in the emitted shape
 * (multiplicity-as-signal refuted; eef-revalidation report 2026-06-11 §2),
 * so each (source, target) pair emits once and occurrences collapsed beyond
 * the first surface as `stats.collapsedIdenticalPrerequisiteEdges`. The
 * builder-level contract is exercised directly; the stats wiring is
 * exercised through `generateGraphCorpusData` (the wider generator contract
 * lives in `graph-corpus-generator.unit.test.ts`).
 */
import { describe, expect, it } from 'vitest';

import type { ExtractedThread } from '../extractors/thread-extractor.js';

import { buildPrerequisiteEdges } from './graph-corpus-edges.js';
import { generateGraphCorpusData, type GraphCorpusInput } from './graph-corpus-generator.js';

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

// Two threads sharing the same consecutive (year-ordered) unit pair.
const sharedPairUnits = [
  {
    unitSlug: 'shared-a',
    unitTitle: 'Shared A',
    order: 1,
    subject: 'maths',
    keyStage: 'ks1',
    year: 2,
  },
  {
    unitSlug: 'shared-b',
    unitTitle: 'Shared B',
    order: 2,
    subject: 'maths',
    keyStage: 'ks2',
    year: 3,
  },
];
const threadOne: ExtractedThread = {
  slug: 'thread-one',
  title: 'Thread One',
  firstYear: 2,
  lastYear: 3,
  units: sharedPairUnits,
};
const threadTwo: ExtractedThread = {
  slug: 'thread-two',
  title: 'Thread Two',
  firstYear: 2,
  lastYear: 3,
  units: sharedPairUnits,
};
const distinctPairThread: ExtractedThread = {
  slug: 'thread-three',
  title: 'Thread Three',
  firstYear: 2,
  lastYear: 3,
  units: [
    {
      unitSlug: 'other-a',
      unitTitle: 'Other A',
      order: 1,
      subject: 'maths',
      keyStage: 'ks1',
      year: 2,
    },
    {
      unitSlug: 'other-b',
      unitTitle: 'Other B',
      order: 2,
      subject: 'maths',
      keyStage: 'ks2',
      year: 3,
    },
  ],
};

describe('buildPrerequisiteEdges dedup', () => {
  const knownUnitSlugs = new Set(['shared-a', 'shared-b', 'other-a', 'other-b']);

  it('emits each (source, target) pair exactly once when threads share adjacency', () => {
    const build = buildPrerequisiteEdges([threadOne, threadTwo], knownUnitSlugs);

    expect(build.edges).toEqual([
      { source: 'unit:shared-a', type: 'prerequisiteFor', target: 'unit:shared-b' },
    ]);
    expect(build.collapsedIdenticalPrerequisiteEdges).toBe(1);
  });

  it('reports zero collapses when every pair is distinct', () => {
    const build = buildPrerequisiteEdges([threadOne, distinctPairThread], knownUnitSlugs);

    expect(build.edges).toHaveLength(2);
    expect(build.collapsedIdenticalPrerequisiteEdges).toBe(0);
  });
});

describe('generateGraphCorpusData prerequisiteFor dedup wiring', () => {
  it('emits the deduplicated pair once and counts it in edgeTypeCounts', () => {
    const result = generateGraphCorpusData(makeInput({ threads: [threadOne, threadTwo] }));

    const prerequisiteEdges = result.edges.filter((edge) => edge.type === 'prerequisiteFor');
    expect(prerequisiteEdges).toEqual([
      { source: 'unit:shared-a', type: 'prerequisiteFor', target: 'unit:shared-b' },
    ]);
    expect(result.stats.edgeTypeCounts.prerequisiteFor).toBe(1);
  });

  it('surfaces identical occurrences collapsed beyond the first in stats', () => {
    const duplicated = generateGraphCorpusData(makeInput({ threads: [threadOne, threadTwo] }));
    const unduplicated = generateGraphCorpusData(makeInput({ threads: [distinctPairThread] }));

    expect(duplicated.stats.collapsedIdenticalPrerequisiteEdges).toBe(1);
    expect(unduplicated.stats.collapsedIdenticalPrerequisiteEdges).toBe(0);
  });
});
