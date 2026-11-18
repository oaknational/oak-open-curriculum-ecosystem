import { isOk, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { TestJudgment } from '../judgment-schemas.js';
import {
  bankedFreetoolVerdictsSchema,
  opusQuorumOutcomes,
  parseBankedFreetoolVerdicts,
} from './banked-verdicts.js';
import type { BankedFreetoolEntry } from './banked-verdicts.js';

const judgment = (pass: boolean): TestJudgment => ({ pass, confidence: 'high' });

const keepVerdict = (): BankedFreetoolEntry['verdict'] => ({
  grounded: judgment(true),
  baseRateHolds: judgment(true),
  survivesNull: judgment(true),
  notArtefact: judgment(true),
  importance: 'med',
});

const killVerdict = (): BankedFreetoolEntry['verdict'] => ({
  ...keepVerdict(),
  notArtefact: judgment(false),
});

const opusEntry = (
  candidateId: string,
  lens: BankedFreetoolEntry['lens'],
  verdict: BankedFreetoolEntry['verdict'],
): BankedFreetoolEntry => ({ candidateId, regime: 'opus-freetool', lens, verdict });

describe('opusQuorumOutcomes', () => {
  it('holds a full-size ensemble whose lenses collide as incomplete: a held quorum is no terminal disposition and never a keep', () => {
    const outcomes = opusQuorumOutcomes([
      opusEntry('C1', 'base-rate', keepVerdict()),
      opusEntry('C1', 'base-rate', keepVerdict()),
      opusEntry('C1', 'correctness-grounding', keepVerdict()),
    ]);
    // The frozen quorum's lens-collision hold: three unanimous keeps with a duplicated
    // lens are correlated votes and never license a keep.
    expect(outcomes.get('C1')).toEqual({ complete: false });
  });
});

describe('bankedFreetoolVerdictsSchema', () => {
  const wellFormed = {
    description: 'banked verdicts',
    opusFreetool: [
      {
        candidateId: 'C1',
        regime: 'opus-freetool',
        lens: 'base-rate',
        verdict: keepVerdict(),
      },
      { candidateId: 'C1', regime: 'opus-freetool', lens: null, verdict: killVerdict() },
    ],
    sonnetFreetool: [
      {
        candidateId: 'C2',
        regime: 'sonnet-freetool',
        lens: null,
        verdict: keepVerdict(),
      },
    ],
  };

  it('parses the banked checkpoint shape, lensed and lens-null entries alike', () => {
    const parsed = parseBankedFreetoolVerdicts(wellFormed);
    expect(isOk(parsed)).toBe(true);
    expect(unwrap(parsed).opusFreetool).toHaveLength(2);
  });

  it('rejects an unknown field at the entry boundary (strict)', () => {
    const entry = { ...wellFormed.opusFreetool[0], extra: true };
    expect(
      bankedFreetoolVerdictsSchema.safeParse({ ...wellFormed, opusFreetool: [entry] }).success,
    ).toBe(false);
  });

  it('rejects an inner verdict that carries its own lens', () => {
    const entry = {
      candidateId: 'C1',
      regime: 'opus-freetool',
      lens: 'base-rate',
      verdict: { ...keepVerdict(), lens: 'base-rate' },
    };
    expect(
      bankedFreetoolVerdictsSchema.safeParse({ ...wellFormed, opusFreetool: [entry] }).success,
    ).toBe(false);
  });

  it('rejects an entry whose lens key is absent rather than null', () => {
    const entry = {
      candidateId: 'C1',
      regime: 'opus-freetool',
      verdict: keepVerdict(),
    };
    expect(
      bankedFreetoolVerdictsSchema.safeParse({ ...wellFormed, opusFreetool: [entry] }).success,
    ).toBe(false);
  });

  it('rejects an entry banked under the wrong regime array', () => {
    const entry = {
      candidateId: 'C1',
      regime: 'sonnet-freetool',
      lens: null,
      verdict: keepVerdict(),
    };
    expect(
      bankedFreetoolVerdictsSchema.safeParse({ ...wellFormed, opusFreetool: [entry] }).success,
    ).toBe(false);
  });
});
