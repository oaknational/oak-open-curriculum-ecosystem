import { isErr, isOk } from '@oaknational/result';
import type { Result } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { metaRunDataFrom, reduceRunDataFrom, validateRunDataFrom } from './run-inputs.js';
import type { MapResult, ReduceResult, ValidateResult } from './stage-io.js';

/**
 * The Node-side pipeline glue: each stage's run data is derived from the PREVIOUS
 * stage's committed result envelope, with the structural gates that used to be operator
 * discipline — a partial map cannot seed reduce, and meta cannot run over a merged
 * disposition set with a missing, duplicate, or non-terminal candidate.
 */

const leaf = {
  id: 'w01-L01',
  window: 'w01',
  category: 'motif' as const,
  statement: 'statement',
  grounding: [{ napkinDate: '2026-05-06', quote: 'quote' }],
  confidence: 'high' as const,
};

const candidate = {
  id: 'C01',
  pattern: 'pattern',
  kind: 'recurrence' as const,
  isAbsenceClaim: false,
  supportingWindows: ['w01'],
  supportingLeafIds: ['w01-L01'],
  groundingCount: 2,
};

const mapOk: MapResult = {
  ok: true,
  partition: [{ window: 'w01', fileCount: 5 }],
  coverage: [{ window: 'w01', leafCount: 1 }],
  mapComplete: true,
  incompleteWindows: [],
  leafCount: 1,
  leaves: [leaf],
};

const reduceOk: ReduceResult = { ok: true, leafCount: 1, candidates: [candidate] };

function validateOk(
  overrides: Partial<Extract<ValidateResult, { ok: true }>> = {},
): ValidateResult {
  return {
    ok: true,
    validateComplete: true,
    resolvedCandidateIds: ['C01'],
    incompleteCandidateIds: [],
    missingCandidateIds: [],
    dispositions: [{ candidateId: 'C01', disposition: 'keep', reason: null }],
    voterOutcomes: [],
    ...overrides,
  };
}

function unwrap<T>(result: Result<T, Error>): T {
  if (!result.ok) {
    expect.fail(`expected ok, got: ${result.error.message}`);
  }
  return result.value;
}

describe('reduceRunDataFrom', () => {
  it('derives the leaves from a complete map result', () => {
    expect(unwrap(reduceRunDataFrom(mapOk)).leaves).toEqual([leaf]);
  });

  it('refuses a failed map result', () => {
    expect(isErr(reduceRunDataFrom({ ok: false, error: 'unseeded' }))).toBe(true);
  });

  it('refuses a PARTIAL map — the structural cure for the silently-committed partial map', () => {
    const partial: MapResult = { ...mapOk, mapComplete: false, incompleteWindows: ['w02'] };
    const result = reduceRunDataFrom(partial);
    expect(isErr(result) && result.error.message).toMatch(/w02/);
  });
});

describe('validateRunDataFrom', () => {
  it('projects leaves to grounding-only and derives resolvedIds from prior validate results', () => {
    const runData = unwrap(
      validateRunDataFrom({
        mapResult: mapOk,
        reduceResult: reduceOk,
        priorValidateResults: [validateOk()],
        validateTokenCeiling: 30_000_000,
      }),
    );
    expect(runData.groundingLeaves).toEqual([
      { id: leaf.id, window: leaf.window, grounding: leaf.grounding },
    ]);
    expect(runData.resolvedIds).toEqual(['C01']);
    expect(runData.candidates).toEqual([candidate]);
    expect(runData.validateTokenCeiling).toBe(30_000_000);
  });

  it('starts with no resolved ids on a fresh run', () => {
    const runData = unwrap(
      validateRunDataFrom({
        mapResult: mapOk,
        reduceResult: reduceOk,
        priorValidateResults: [],
        validateTokenCeiling: 30_000_000,
      }),
    );
    expect(runData.resolvedIds).toEqual([]);
  });

  it('refuses a failed reduce result and a partial map', () => {
    expect(
      isErr(
        validateRunDataFrom({
          mapResult: mapOk,
          reduceResult: { ok: false, error: 'died' },
          priorValidateResults: [],
          validateTokenCeiling: 1,
        }),
      ),
    ).toBe(true);
    expect(
      isErr(
        validateRunDataFrom({
          mapResult: { ...mapOk, mapComplete: false, incompleteWindows: ['w02'] },
          reduceResult: reduceOk,
          priorValidateResults: [],
          validateTokenCeiling: 1,
        }),
      ),
    ).toBe(true);
  });
});

describe('metaRunDataFrom (the merged-set gate, now structural)', () => {
  it('merges terminal dispositions onto the reduce candidates', () => {
    const runData = unwrap(
      metaRunDataFrom({ reduceResult: reduceOk, validateResults: [validateOk()] }),
    );
    expect(runData.candidates).toEqual([
      {
        id: 'C01',
        pattern: candidate.pattern,
        kind: candidate.kind,
        isAbsenceClaim: false,
        supportingWindows: candidate.supportingWindows,
        disposition: 'keep',
      },
    ]);
  });

  it('merges a resumed run: the tail result supplies what the first run held', () => {
    const two = { ...candidate, id: 'C02' };
    const reduceTwo: ReduceResult = { ok: true, leafCount: 1, candidates: [candidate, two] };
    const first = validateOk({
      validateComplete: false,
      resolvedCandidateIds: ['C01'],
      incompleteCandidateIds: ['C02'],
      dispositions: [
        { candidateId: 'C01', disposition: 'keep', reason: null },
        { candidateId: 'C02', disposition: 'held-for-review', reason: 'retry-cap' },
      ],
    });
    const tail = validateOk({
      resolvedCandidateIds: ['C02'],
      dispositions: [{ candidateId: 'C02', disposition: 'kill', reason: null }],
    });
    const runData = unwrap(
      metaRunDataFrom({ reduceResult: reduceTwo, validateResults: [first, tail] }),
    );
    expect(runData.candidates.map((entry) => [entry.id, entry.disposition])).toEqual([
      ['C01', 'keep'],
      ['C02', 'kill'],
    ]);
  });

  it('refuses a candidate with no terminal disposition (meta must never score a wrong denominator)', () => {
    const held = validateOk({
      validateComplete: false,
      resolvedCandidateIds: [],
      incompleteCandidateIds: ['C01'],
      dispositions: [{ candidateId: 'C01', disposition: 'held-for-review', reason: 'quorum-tie' }],
    });
    const result = metaRunDataFrom({ reduceResult: reduceOk, validateResults: [held] });
    expect(isErr(result) && result.error.message).toMatch(/C01/);
  });

  it('refuses conflicting terminal dispositions for one candidate across results', () => {
    const first = validateOk();
    const conflicting = validateOk({
      dispositions: [{ candidateId: 'C01', disposition: 'kill', reason: null }],
    });
    const result = metaRunDataFrom({
      reduceResult: reduceOk,
      validateResults: [first, conflicting],
    });
    expect(isErr(result) && result.error.message).toMatch(/C01/);
  });

  it('refuses a disposition for an unknown candidate id', () => {
    const rogue = validateOk({
      resolvedCandidateIds: ['C99'],
      dispositions: [
        { candidateId: 'C01', disposition: 'keep', reason: null },
        { candidateId: 'C99', disposition: 'keep', reason: null },
      ],
    });
    const result = metaRunDataFrom({ reduceResult: reduceOk, validateResults: [rogue] });
    expect(isErr(result) && result.error.message).toMatch(/C99/);
  });

  it('refuses any failed validate result in the merge set', () => {
    expect(
      isOk(
        metaRunDataFrom({
          reduceResult: reduceOk,
          validateResults: [validateOk(), { ok: false, error: 'x' }],
        }),
      ),
    ).toBe(false);
  });
});
