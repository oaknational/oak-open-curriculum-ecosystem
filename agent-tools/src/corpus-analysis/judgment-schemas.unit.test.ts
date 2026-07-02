import { isErr, isOk, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  adversaryVerdictSchema,
  candidateSchema,
  leafSignalSchema,
  parseCandidate,
  parseLeafSignal,
  parseVoterOutcome,
  voterOutcomeSchema,
} from './judgment-schemas.js';

describe('leafSignalSchema', () => {
  const valid = {
    id: 'W04-s1',
    window: 'W04',
    category: 'motif',
    statement: 'the enforce-edge re-fires',
    grounding: [{ napkinDate: '2026-04-21', quote: 'zero of the three mechanisms fired' }],
    confidence: 'high',
  };

  it('parses a well-formed leaf signal', () => {
    expect(leafSignalSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an unknown field (strict boundary)', () => {
    expect(leafSignalSchema.safeParse({ ...valid, extra: 1 }).success).toBe(false);
  });

  it('rejects an empty grounding array', () => {
    expect(leafSignalSchema.safeParse({ ...valid, grounding: [] }).success).toBe(false);
  });

  it('round-trips a valid leaf through parseLeafSignal into an ok Result', () => {
    const parsed = parseLeafSignal(valid);
    expect(isOk(parsed)).toBe(true);
    expect(unwrap(parsed).window).toBe('W04');
  });

  it('returns an err Result for an invalid leaf rather than throwing', () => {
    expect(isErr(parseLeafSignal({ id: 'x' }))).toBe(true);
  });
});

describe('candidateSchema', () => {
  const valid = {
    id: 'c1',
    pattern: 'the enforce-edge is empirically open',
    kind: 'recurrence',
    isAbsenceClaim: false,
    supportingWindows: ['W04', 'W14'],
    supportingLeafIds: ['W04-s1', 'W14-s7'],
    groundingCount: 9,
  };

  it('parses a well-formed candidate', () => {
    expect(candidateSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects an unknown field (strict boundary)', () => {
    expect(candidateSchema.safeParse({ ...valid, extra: true }).success).toBe(false);
  });

  it('rejects a negative groundingCount', () => {
    expect(candidateSchema.safeParse({ ...valid, groundingCount: -1 }).success).toBe(false);
  });

  it('round-trips a valid candidate through parseCandidate into an ok Result', () => {
    const parsed = parseCandidate(valid);
    expect(isOk(parsed)).toBe(true);
    expect(unwrap(parsed).id).toBe('c1');
  });
});

describe('adversaryVerdictSchema', () => {
  it('parses the four tests with an optional Tier-2 lens', () => {
    const result = adversaryVerdictSchema.safeParse({
      lens: 'base-rate',
      grounded: { pass: true, confidence: 'high' },
      baseRateHolds: { pass: false, confidence: 'med' },
      survivesNull: { pass: true, confidence: 'high' },
      notArtefact: { pass: true, confidence: 'low' },
      importance: 'high',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a missing test', () => {
    expect(
      adversaryVerdictSchema.safeParse({
        grounded: { pass: true, confidence: 'high' },
        baseRateHolds: { pass: true, confidence: 'high' },
        survivesNull: { pass: true, confidence: 'high' },
        importance: 'med',
      }).success,
    ).toBe(false);
  });
});

describe('voterOutcomeSchema', () => {
  it('parses an adjudicated outcome carrying a verdict', () => {
    const outcome = parseVoterOutcome({
      status: 'adjudicated',
      candidateId: 'c1',
      voterId: 'v0',
      tier: 'tier-0',
      verdict: {
        grounded: { pass: true, confidence: 'high' },
        baseRateHolds: { pass: true, confidence: 'high' },
        survivesNull: { pass: true, confidence: 'high' },
        notArtefact: { pass: true, confidence: 'high' },
        importance: 'med',
      },
    });
    expect(isOk(outcome)).toBe(true);
    expect(unwrap(outcome).status).toBe('adjudicated');
  });

  it('parses an unadjudicated outcome carrying a reason', () => {
    const outcome = parseVoterOutcome({
      status: 'unadjudicated',
      candidateId: 'c1',
      voterId: 'v1',
      tier: 'tier-1',
      reason: 'retry-cap',
    });
    expect(isOk(outcome)).toBe(true);
    expect(unwrap(outcome).status).toBe('unadjudicated');
  });

  it('rejects an adjudicated outcome with no verdict', () => {
    expect(
      voterOutcomeSchema.safeParse({
        status: 'adjudicated',
        candidateId: 'c1',
        voterId: 'v0',
        tier: 'tier-0',
      }).success,
    ).toBe(false);
  });
});
