import { describe, expect, it } from 'vitest';

import { findGroupsMissingReappraisal } from './validate-policy-reappraisal-helpers.js';

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
