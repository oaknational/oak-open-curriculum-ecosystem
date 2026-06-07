import { describe, expect, it, expectTypeOf } from 'vitest';

import { EEF_TOOLKIT_DATA } from './eef-toolkit.external-data.js';
import { strandById, isValidStrandKey, EEF_STRAND_IDS, type EefStrandId } from './strand-lookup.js';

describe('strandById', () => {
  it('resolves every real corpus id to the matching strand', () => {
    for (const strand of EEF_TOOLKIT_DATA.strands) {
      expect(strandById(strand.id).id).toBe(strand.id);
    }
  });

  it('returns the exact single strand for a known literal id', () => {
    const arts = strandById('eef-tl-arts-participation');
    expect(arts.name).toBe('Arts participation');
    expect(arts.headline.impact_months).toBe(3);
    // Compile-time proof: the literal id narrows to the exact strand, so the
    // metric is the literal `3`, not the widened `number | null` union.
    expectTypeOf(arts.headline.impact_months).toEqualTypeOf<3>();
  });
});

describe('isValidStrandKey', () => {
  it('returns true for every real corpus id', () => {
    for (const strand of EEF_TOOLKIT_DATA.strands) {
      expect(isValidStrandKey(strand.id)).toBe(true);
    }
  });

  it('returns false for a typo, an empty string, and non-string inputs', () => {
    expect(isValidStrandKey('eef-tl-not-a-real-strand')).toBe(false);
    expect(isValidStrandKey('')).toBe(false);
    expect(isValidStrandKey(undefined)).toBe(false);
    expect(isValidStrandKey(null)).toBe(false);
    expect(isValidStrandKey(42)).toBe(false);
    expect(isValidStrandKey({ id: 'eef-tl-feedback' })).toBe(false);
  });

  it('narrows an unknown value to EefStrandId, which then flows into strandById', () => {
    const value: unknown = 'eef-tl-feedback';
    if (!isValidStrandKey(value)) {
      throw new Error('expected a real corpus id to narrow');
    }
    // Compile-time proof: the predicate narrowed `unknown` to `EefStrandId`,
    // so `value` crosses into the keyed lookup with no cast.
    expectTypeOf(value).toEqualTypeOf<EefStrandId>();
    expect(strandById(value).id).toBe('eef-tl-feedback');
  });
});

describe('EEF_STRAND_IDS', () => {
  it('lists every real corpus strand id, uniquely, and nothing that is not one', () => {
    // unique
    expect(new Set(EEF_STRAND_IDS).size).toBe(EEF_STRAND_IDS.length);
    // complete: every real corpus strand appears
    for (const strand of EEF_TOOLKIT_DATA.strands) {
      expect(EEF_STRAND_IDS).toContain(strand.id);
    }
    // sound: cross-checked against the independent membership predicate
    for (const id of EEF_STRAND_IDS) {
      expect(isValidStrandKey(id)).toBe(true);
    }
  });

  it('includes a known strand id and types each entry as EefStrandId', () => {
    expect(EEF_STRAND_IDS).toContain('eef-tl-arts-participation');
    expectTypeOf(EEF_STRAND_IDS).toEqualTypeOf<readonly EefStrandId[]>();
  });
});
