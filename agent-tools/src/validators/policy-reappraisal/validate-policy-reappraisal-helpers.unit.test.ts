import { describe, expect, it } from 'vitest';

import {
  findBashEntriesMissingReappraisal,
  findGroupsMissingReappraisal,
} from './validate-policy-reappraisal-helpers.js';

function group(concept: string, reappraisal?: unknown): Record<string, unknown> {
  const base: Record<string, unknown> = {
    concept,
    patterns: ['x'],
    include_paths: ['.agent/'],
    citation: 'c',
  };
  if (reappraisal !== undefined) {
    base.reappraisal = reappraisal;
  }
  return base;
}

describe('findGroupsMissingReappraisal', () => {
  it('returns nothing when every group carries a non-empty reappraisal', () => {
    expect(
      findGroupsMissingReappraisal([group('a', 'do this'), group('b', 'do that')]),
    ).toStrictEqual([]);
  });

  it('flags a group whose reappraisal is absent', () => {
    expect(findGroupsMissingReappraisal([group('expediency-hedging')])).toStrictEqual([
      { concept: 'expediency-hedging', reason: 'absent' },
    ]);
  });

  it('flags a group whose reappraisal is an empty or whitespace-only string', () => {
    expect(findGroupsMissingReappraisal([group('a', ''), group('b', '   ')])).toStrictEqual([
      { concept: 'a', reason: 'empty' },
      { concept: 'b', reason: 'empty' },
    ]);
  });

  it('flags a group whose reappraisal is a non-string value', () => {
    expect(findGroupsMissingReappraisal([group('a', 42)])).toStrictEqual([
      { concept: 'a', reason: 'empty' },
    ]);
  });

  it('uses a positional label when the concept field is missing', () => {
    expect(findGroupsMissingReappraisal([{ patterns: ['x'] }])).toStrictEqual([
      { concept: '#0', reason: 'absent' },
    ]);
  });

  it('returns nothing for non-array input (shape malformation is the loader/schema concern)', () => {
    expect(findGroupsMissingReappraisal(undefined)).toStrictEqual([]);
    expect(findGroupsMissingReappraisal({})).toStrictEqual([]);
  });
});

function bashEntry(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    pattern: 'git reset --hard',
    concept: 'worktree-destruction',
    reappraisal: 'never use git to remove work; make forward-going filesystem changes instead',
    ...overrides,
  };
}

describe('findBashEntriesMissingReappraisal', () => {
  it('returns nothing when every entry is an object carrying a non-empty concept and reappraisal', () => {
    expect(
      findBashEntriesMissingReappraisal([
        bashEntry(),
        bashEntry({ pattern: 'git add .', concept: 'wildcard-staging' }),
      ]),
    ).toStrictEqual([]);
  });

  it('flags a bare-string entry because a string cannot carry a reappraisal to teach with', () => {
    expect(findBashEntriesMissingReappraisal(['git reset --hard'])).toStrictEqual([
      { pattern: 'git reset --hard', reason: 'not-an-object' },
    ]);
  });

  it('flags an object entry whose concept is absent (the deny builder skips the teaching path)', () => {
    const entry = bashEntry();
    delete entry.concept;
    expect(findBashEntriesMissingReappraisal([entry])).toStrictEqual([
      { pattern: 'git reset --hard', reason: 'concept-absent' },
    ]);
  });

  it('flags an object entry whose reappraisal is absent', () => {
    const absent = bashEntry();
    delete absent.reappraisal;
    expect(findBashEntriesMissingReappraisal([absent])).toStrictEqual([
      { pattern: 'git reset --hard', reason: 'reappraisal-absent' },
    ]);
  });

  it('flags an object entry whose reappraisal is empty or whitespace-only', () => {
    expect(findBashEntriesMissingReappraisal([bashEntry({ reappraisal: '   ' })])).toStrictEqual([
      { pattern: 'git reset --hard', reason: 'reappraisal-empty' },
    ]);
  });

  it('flags an object entry whose reappraisal is a non-string value', () => {
    expect(findBashEntriesMissingReappraisal([bashEntry({ reappraisal: 42 })])).toStrictEqual([
      { pattern: 'git reset --hard', reason: 'reappraisal-empty' },
    ]);
  });

  it('reports both missing fields when an object entry lacks concept and reappraisal', () => {
    expect(findBashEntriesMissingReappraisal([{ pattern: 'git add -A' }])).toStrictEqual([
      { pattern: 'git add -A', reason: 'concept-absent' },
      { pattern: 'git add -A', reason: 'reappraisal-absent' },
    ]);
  });

  it('uses a positional label in the finding when the pattern field is missing', () => {
    expect(findBashEntriesMissingReappraisal([{ concept: 'x' }])).toStrictEqual([
      { pattern: '#0', reason: 'reappraisal-absent' },
    ]);
  });

  it('returns nothing for non-array input (shape malformation is the loader/schema concern)', () => {
    expect(findBashEntriesMissingReappraisal(undefined)).toStrictEqual([]);
    expect(findBashEntriesMissingReappraisal({})).toStrictEqual([]);
  });
});
