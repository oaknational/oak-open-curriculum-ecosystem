import { describe, expect, it } from 'vitest';

import { isMapRunData, isMetaRunData, isReduceRunData, isValidateRunData } from './stage-guards.js';

/**
 * The sandbox's defence line: every guard must accept exactly its own stage's tagged
 * run data and reject the other three stages' data, the unseeded sentinel, and a
 * right-shape-wrong-tag seeding. The full cross matrix is the discriminating fixture
 * set — a guard that merely shape-sniffs passes its own column and fails the rest
 * (`isMetaRunData` did exactly that against validate data before the stage tag).
 */

const leaf = {
  id: 'w01-L01',
  window: 'w01',
  category: 'motif',
  statement: 's',
  grounding: [{ napkinDate: '2026-05-06', quote: 'q' }],
  confidence: 'high',
};

const candidate = {
  id: 'C01',
  pattern: 'p',
  kind: 'recurrence',
  isAbsenceClaim: false,
  supportingWindows: ['w01'],
  supportingLeafIds: ['w01-L01'],
  groundingCount: 1,
};

const runDataByStage = {
  map: { windows: [{ window: 'w01', files: ['a.md'] }] },
  reduce: { leaves: [leaf] },
  validate: {
    candidates: [candidate],
    groundingLeaves: [{ id: leaf.id, window: leaf.window, grounding: leaf.grounding }],
    resolvedIds: [],
    validateTokenCeiling: 30_000_000,
  },
  meta: { candidates: [{ ...candidate, disposition: 'keep' }] },
} as const;

const guards = {
  map: isMapRunData,
  reduce: isReduceRunData,
  validate: isValidateRunData,
  meta: isMetaRunData,
} as const;

const STAGES = ['map', 'reduce', 'validate', 'meta'] as const;

describe.each(STAGES)('guard for stage %s', (guardStage) => {
  it.each(STAGES)('accepts only its own stage: data tagged %s', (dataStage) => {
    const accepted = guards[guardStage](runDataByStage[dataStage], dataStage);
    expect(accepted).toBe(guardStage === dataStage);
  });

  it('rejects the unseeded sentinel', () => {
    expect(guards[guardStage]({ unseeded: true }, 'unseeded')).toBe(false);
  });

  it('rejects right-stage tag with wrong-shape data (a malformed substitution)', () => {
    expect(guards[guardStage]({ nonsense: [] }, guardStage)).toBe(false);
  });
});

describe('validate guard specifics', () => {
  it('rejects a missing or non-positive ceiling even when correctly tagged', () => {
    const { validateTokenCeiling, ...withoutCeiling } = runDataByStage.validate;
    expect(validateTokenCeiling).toBe(30_000_000);
    expect(isValidateRunData(withoutCeiling, 'validate')).toBe(false);
    expect(
      isValidateRunData({ ...runDataByStage.validate, validateTokenCeiling: 0 }, 'validate'),
    ).toBe(false);
  });
});
