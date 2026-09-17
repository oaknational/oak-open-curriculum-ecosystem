/**
 * Unit tests for the identity-naming census/ratchet contract.
 *
 * @remarks
 * Every forbidden-token fixture is string-constructed (principles §"Never
 * weaken a gate to solve a testing problem") so this test file never contains
 * the outgoing name as a literal — the validator it proves guards this file
 * too.
 */

import { describe, expect, it } from 'vitest';

import {
  CENSUS_PATH,
  compareToCensus,
  computeLiveCounts,
  countsEqual,
  findDuplicateKeys,
  type CensusEntry,
} from './validate-identity-naming-census.js';

/** The outgoing name in lower case, string-constructed. */
const NAME_LOWER = ['free', 'donia'].join('');

const ZERO = { name: 0, initialismUpper: 0, initialismLower: 0 };

describe('computeLiveCounts', () => {
  it('counts tracked PATHS unconditionally — a binary-named carrier still fails', () => {
    const entries = computeLiveCounts([`assets/${NAME_LOWER}.png`, 'clean/path.ts'], [], undefined);
    expect(entries).toEqual([
      {
        file: `assets/${NAME_LOWER}.png`,
        kind: 'path',
        countByVariant: { ...ZERO, name: 1 },
      },
    ]);
  });

  it('excludes exactly the census path from the CONTENT scan when asked (ratchet mode)', () => {
    const files = [
      { path: CENSUS_PATH, content: `rows referencing ${NAME_LOWER} paths` },
      { path: 'other.md', content: NAME_LOWER },
    ];
    const ratchet = computeLiveCounts([], files, CENSUS_PATH);
    expect(ratchet.map((entry) => entry.file)).toEqual(['other.md']);
    const strict = computeLiveCounts([], files, undefined);
    expect(strict.map((entry) => entry.file)).toEqual([CENSUS_PATH, 'other.md']);
  });
});

describe('compareToCensus', () => {
  const entry = (file: string, name: number): CensusEntry => ({
    file,
    kind: 'content',
    countByVariant: { ...ZERO, name },
  });

  it('is silent when live equals the census exactly', () => {
    expect(compareToCensus([entry('a.md', 2)], [entry('a.md', 2)])).toEqual([]);
  });

  it('fails a NEW occurrence — live above the census, including a row-less file', () => {
    const findings = compareToCensus([entry('a.md', 3), entry('new.md', 1)], [entry('a.md', 2)]);
    expect(findings.map((finding) => [finding.file, finding.reason])).toEqual([
      ['a.md', 'new-occurrence'],
      ['new.md', 'new-occurrence'],
    ]);
  });

  it('fails a STALE census — a removal must update the census in the same change', () => {
    const findings = compareToCensus([entry('a.md', 1)], [entry('a.md', 2), entry('gone.md', 1)]);
    expect(findings.map((finding) => [finding.file, finding.reason])).toEqual([
      ['a.md', 'stale-census'],
      ['gone.md', 'stale-census'],
    ]);
  });

  it('treats a re-casing as divergence via per-variant counts', () => {
    const live: CensusEntry[] = [
      {
        file: 'a.css',
        kind: 'content',
        countByVariant: { name: 0, initialismUpper: 0, initialismLower: 1 },
      },
    ];
    const census: CensusEntry[] = [
      {
        file: 'a.css',
        kind: 'content',
        countByVariant: { name: 0, initialismUpper: 1, initialismLower: 0 },
      },
    ];
    expect(compareToCensus(live, census)).toHaveLength(1);
  });

  it('countsEqual is exact over all three variants', () => {
    expect(countsEqual({ ...ZERO, name: 1 }, { ...ZERO, name: 1 })).toBe(true);
    expect(countsEqual({ ...ZERO, name: 1 }, { ...ZERO, initialismUpper: 1 })).toBe(false);
  });
});

describe('findDuplicateKeys', () => {
  const entry = (file: string, kind: 'content' | 'path'): CensusEntry => ({
    file,
    kind,
    countByVariant: { ...ZERO, name: 1 },
  });

  it('finds nothing in a row set with one row per cell', () => {
    expect(findDuplicateKeys([entry('a.md', 'content'), entry('b.md', 'content')])).toEqual([]);
  });

  it('does not confuse the two kinds — path and content are distinct cells', () => {
    expect(findDuplicateKeys([entry('a.md', 'content'), entry('a.md', 'path')])).toEqual([]);
  });

  it('names each duplicated cell once, however many rows claim it', () => {
    const rows = [entry('a.md', 'content'), entry('a.md', 'content'), entry('a.md', 'content')];

    expect(findDuplicateKeys(rows)).toEqual(['content a.md']);
  });
});
