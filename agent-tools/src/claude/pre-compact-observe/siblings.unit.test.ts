import { describe, expect, it } from 'vitest';

import { selectSiblings, type SiblingEntry } from './siblings.js';

function fileNamed(name: string): SiblingEntry {
  return { name, kind: 'file', size: name.length };
}

function siblingName(index: number): string {
  return `sibling-${String(index).padStart(2, '0')}.jsonl`;
}

const THIRTY_NAMES_ASCENDING = [...Array.from({ length: 30 }).keys()].map(siblingName);

describe('selectSiblings', () => {
  it('keeps the first 24 entries by name, and reports the full count', () => {
    const selection = selectSiblings(THIRTY_NAMES_ASCENDING.toReversed().map(fileNamed));

    expect(selection).toStrictEqual({
      entries: THIRTY_NAMES_ASCENDING.slice(0, 24).map(fileNamed),
      count: 30,
    });
  });

  it('sorts by UTF-16 code unit, so the order never depends on the locale', () => {
    // Code-unit order is B, _, a; locale order would be _, a, B.
    const selection = selectSiblings(['a.jsonl', 'B.jsonl', '_notes'].map(fileNamed));

    expect(selection).toStrictEqual({
      entries: ['B.jsonl', '_notes', 'a.jsonl'].map(fileNamed),
      count: 3,
    });
  });

  it('gives no entries and no count when the directory was not listed', () => {
    expect(selectSiblings(undefined)).toStrictEqual({ entries: [] });
  });

  it('gives no entries and a count of 0 for a directory listed and found empty', () => {
    expect(selectSiblings([])).toStrictEqual({ entries: [], count: 0 });
  });
});
