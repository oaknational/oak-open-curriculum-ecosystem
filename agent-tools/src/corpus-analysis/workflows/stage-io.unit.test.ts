import { isErr, isOk } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  parseMapResult,
  parseMapRunData,
  parseMetaResult,
  parseMetaRunData,
  parseReduceRunData,
  parseValidateResult,
  parseValidateRunData,
} from './stage-io.js';

/**
 * The stage I/O contracts: run data in (validated before inlining), result envelopes
 * out (re-parsed by the operator/driver before the next checkpoint is committed).
 * Strict everywhere; failures are typed values on a discriminated `ok` union.
 */

const leaf = {
  id: 'w01-L01',
  window: 'w01',
  category: 'motif',
  statement: 'the pre-commit hook promotes peer files via format:root',
  grounding: [{ napkinDate: '2026-05-06', quote: 'pre-commit swept peer files' }],
  confidence: 'high',
};

const candidate = {
  id: 'C01',
  pattern: 'repo-wide auto-fix promotes peer-owned files into the staged set',
  kind: 'recurrence',
  isAbsenceClaim: false,
  supportingWindows: ['w01', 'w08'],
  supportingLeafIds: ['w01-L01'],
  groundingCount: 4,
};

describe('run data contracts', () => {
  it('accepts a well-formed map partition and rejects an empty one', () => {
    expect(isOk(parseMapRunData({ windows: [{ window: 'w01', files: ['a.md'] }] }))).toBe(true);
    expect(isErr(parseMapRunData({ windows: [] }))).toBe(true);
    expect(isErr(parseMapRunData({ windows: [{ window: 'w01', files: [] }] }))).toBe(true);
  });

  it('accepts reduce leaves and rejects a leaf missing grounding', () => {
    expect(isOk(parseReduceRunData({ leaves: [leaf] }))).toBe(true);
    expect(isErr(parseReduceRunData({ leaves: [{ ...leaf, grounding: [] }] }))).toBe(true);
  });

  it('validate run data requires the grounding-leaf projection and an explicit ceiling', () => {
    const valid = {
      candidates: [candidate],
      groundingLeaves: [{ id: leaf.id, window: leaf.window, grounding: leaf.grounding }],
      resolvedIds: [],
      validateTokenCeiling: 30_000_000,
    };
    expect(isOk(parseValidateRunData(valid))).toBe(true);
    // A full leaf in the grounding projection is over-carriage — strict rejects it.
    expect(isErr(parseValidateRunData({ ...valid, groundingLeaves: [leaf] }))).toBe(true);
    const { validateTokenCeiling, ...withoutCeiling } = valid;
    expect(validateTokenCeiling).toBe(30_000_000);
    expect(isErr(parseValidateRunData(withoutCeiling))).toBe(true);
  });

  it('meta run data takes only terminally-dispositioned candidates, with unique ids', () => {
    const dispositioned = {
      id: 'C01',
      pattern: candidate.pattern,
      kind: 'recurrence',
      isAbsenceClaim: false,
      supportingWindows: ['w01'],
      disposition: 'keep',
    };
    expect(isOk(parseMetaRunData({ candidates: [dispositioned] }))).toBe(true);
    expect(
      isErr(
        parseMetaRunData({ candidates: [{ ...dispositioned, disposition: 'held-for-review' }] }),
      ),
    ).toBe(true);
    expect(isErr(parseMetaRunData({ candidates: [dispositioned, dispositioned] }))).toBe(true);
  });
});

describe('result envelopes', () => {
  it('map result discriminates ok from typed failure', () => {
    const success = {
      ok: true,
      partition: [{ window: 'w01', fileCount: 5 }],
      coverage: [{ window: 'w01', leafCount: 35 }],
      mapComplete: true,
      incompleteWindows: [],
      leafCount: 1,
      leaves: [leaf],
    };
    expect(isOk(parseMapResult(success))).toBe(true);
    expect(isOk(parseMapResult({ ok: false, error: 'artefact not seeded' }))).toBe(true);
    // A silent-partial shape without the completeness surface is not a valid result.
    const { mapComplete, ...withoutCompleteness } = success;
    expect(mapComplete).toBe(true);
    expect(isErr(parseMapResult(withoutCompleteness))).toBe(true);
  });

  it('validate result carries dispositions, voter outcomes, and resume bookkeeping', () => {
    const success = {
      ok: true,
      validateComplete: true,
      resolvedCandidateIds: ['C01'],
      incompleteCandidateIds: [],
      missingCandidateIds: [],
      dispositions: [{ candidateId: 'C01', disposition: 'keep', reason: null }],
      voterOutcomes: [
        {
          status: 'adjudicated',
          candidateId: 'C01',
          voterId: 'C01:tier-0:r0:0',
          tier: 'tier-0',
          verdict: {
            grounded: { pass: true, confidence: 'high' },
            baseRateHolds: { pass: true, confidence: 'high' },
            survivesNull: { pass: true, confidence: 'high' },
            notArtefact: { pass: true, confidence: 'high' },
            importance: 'med',
          },
        },
      ],
    };
    expect(isOk(parseValidateResult(success))).toBe(true);
    expect(isErr(parseValidateResult({ ...success, dispositions: [{ candidateId: 'C01' }] }))).toBe(
      true,
    );
  });

  it('meta result carries the full four-field envelope and rejects a smuggled aggregate', () => {
    const success = {
      ok: true,
      meta: {
        recallMatches: [
          { baselineId: 'b1', verdict: 'equal', matchedCandidateId: 'C01', note: 'n' },
        ],
        corroborationClaims: [{ candidateId: 'C01', claimedHomePaths: [] }],
        discountNote: 'note',
        synthesisNotes: ['takeaway'],
      },
    };
    expect(isOk(parseMetaResult(success))).toBe(true);
    expect(isOk(parseMetaResult({ ok: false, error: 'meta agent died' }))).toBe(true);
    expect(isErr(parseMetaResult({ ...success, meta: { ...success.meta, recall: 0.72 } }))).toBe(
      true,
    );
  });
});
