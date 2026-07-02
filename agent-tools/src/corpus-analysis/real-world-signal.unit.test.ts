import { isErr, isOk, unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  corroborateAgainstHomes,
  corroborationClaimSchema,
  parseCorroborationClaim,
} from './real-world-signal.js';

describe('corroborateAgainstHomes', () => {
  const existingHomePaths = new Set([
    '.agent/memory/active/patterns/fluency-is-a-failure-vector.md',
    '.agent/rules/stage-by-explicit-pathspec.md',
  ]);

  it('corroborates a pattern whose claimed home exists on disk', () => {
    const result = corroborateAgainstHomes({
      claims: [
        {
          candidateId: 'enforce-edge',
          claimedHomePaths: ['.agent/memory/active/patterns/fluency-is-a-failure-vector.md'],
        },
      ],
      existingHomePaths,
    });
    expect(result).toEqual([
      {
        candidateId: 'enforce-edge',
        corroboratedBy: ['.agent/memory/active/patterns/fluency-is-a-failure-vector.md'],
        missingClaims: [],
        isCorroborated: true,
      },
    ]);
  });

  it('surfaces a claimed home that does not exist as a discrepancy, not a corroboration', () => {
    const result = corroborateAgainstHomes({
      claims: [{ candidateId: 'invented', claimedHomePaths: ['.agent/rules/does-not-exist.md'] }],
      existingHomePaths,
    });
    expect(result[0]).toEqual({
      candidateId: 'invented',
      corroboratedBy: [],
      missingClaims: ['.agent/rules/does-not-exist.md'],
      isCorroborated: false,
    });
  });

  it('treats a pattern with no claimed homes as uncorroborated, not a discrepancy', () => {
    const result = corroborateAgainstHomes({
      claims: [{ candidateId: 'novel-pattern', claimedHomePaths: [] }],
      existingHomePaths,
    });
    expect(result[0]).toEqual({
      candidateId: 'novel-pattern',
      corroboratedBy: [],
      missingClaims: [],
      isCorroborated: false,
    });
  });

  it('partially corroborates when one of several claimed homes exists', () => {
    const result = corroborateAgainstHomes({
      claims: [
        {
          candidateId: 'destructive-ops',
          claimedHomePaths: ['.agent/rules/stage-by-explicit-pathspec.md', '.agent/rules/ghost.md'],
        },
      ],
      existingHomePaths,
    });
    expect(result[0].isCorroborated).toBe(true);
    expect(result[0].corroboratedBy).toEqual(['.agent/rules/stage-by-explicit-pathspec.md']);
    expect(result[0].missingClaims).toEqual(['.agent/rules/ghost.md']);
  });
});

describe('corroborationClaimSchema', () => {
  it('parses a well-formed claim', () => {
    expect(
      corroborationClaimSchema.safeParse({
        candidateId: 'c1',
        claimedHomePaths: ['.agent/rules/x.md'],
      }).success,
    ).toBe(true);
  });

  it('rejects an unknown field (strict boundary)', () => {
    expect(
      corroborationClaimSchema.safeParse({ candidateId: 'c1', claimedHomePaths: [], extra: true })
        .success,
    ).toBe(false);
  });
});

describe('parseCorroborationClaim', () => {
  it('parses a well-formed claim into an ok Result', () => {
    const parsed = parseCorroborationClaim({
      candidateId: 'c1',
      claimedHomePaths: ['.agent/rules/x.md'],
    });
    expect(isOk(parsed)).toBe(true);
    expect(unwrap(parsed).candidateId).toBe('c1');
  });

  it('returns an err Result for an unknown field rather than throwing', () => {
    expect(
      isErr(parseCorroborationClaim({ candidateId: 'c1', claimedHomePaths: [], extra: true })),
    ).toBe(true);
  });
});
