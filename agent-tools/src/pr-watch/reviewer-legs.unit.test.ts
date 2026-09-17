import { describe, expect, it } from 'vitest';

import { computeReviewerLegs, isSignedSelfReply, mostBlockingLeg } from './reviewer-legs.js';
import type { HarvestedReview } from './reviewer-legs.js';

/**
 * Per-(reviewer, tip) leg computation per the pr-lifecycle SKILL's review-round
 * state machine item 3: SATISFIED / SKIPPED (marker or timeout) / OWED, with
 * the expected reviewer set as a DECLARED input, evaluated against the FULL
 * review harvest (never the per-author latestReviews pointer, which can move
 * backwards when an older-tip job completes late).
 */

const TIP = 'a'.repeat(40);
const OLD = 'b'.repeat(40);
const T0 = '2026-07-21T12:00:00Z';

function review(overrides: Partial<HarvestedReview>): HarvestedReview {
  return {
    author: 'copilot-pull-request-reviewer',
    state: 'COMMENTED',
    body: 'Reviewed.',
    commitOid: TIP,
    submittedAt: T0,
    ...overrides,
  };
}

const base: { headRefOid: string; checksGreenAt: string | null } = {
  headRefOid: TIP,
  checksGreenAt: '2026-07-21T11:50:00Z',
};

describe('computeReviewerLegs', () => {
  it('SATISFIED when ANY harvested review by the reviewer binds the tip', () => {
    // The backwards-pointer regression: an older-tip review submitted LATER
    // must not hide the earlier current-tip review (SKILL item 3).
    const legs = computeReviewerLegs({
      ...base,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [
        review({ submittedAt: '2026-07-21T12:01:00Z' }),
        review({ commitOid: OLD, submittedAt: '2026-07-21T12:05:00Z' }),
      ],
      reviewRequests: [],
      now: '2026-07-21T12:06:00Z',
    });
    expect(legs).toEqual([
      {
        reviewer: 'copilot-pull-request-reviewer',
        state: 'SATISFIED',
        detail: 'review binds current tip',
      },
    ]);
  });

  it('a tip-bound QUOTA bounce settles the leg as SKIPPED (owner ruling 2026-07-21), never SATISFIED', () => {
    const legs = computeReviewerLegs({
      ...base,
      expectedReviewers: ['claude'],
      reviews: [
        review({
          author: 'claude',
          body: '⚠️ **Code review skipped** — overage spend limit reached.',
        }),
      ],
      reviewRequests: [],
      now: '2026-07-21T12:06:00Z',
    });
    expect(legs[0]).toMatchObject({ reviewer: 'claude', state: 'SKIPPED', skipReason: 'quota' });
    expect(legs[0]?.detail).toContain('quota');
  });

  it('an OLD-tip quota marker does not skip the current tip (unscoped-marker discipline)', () => {
    const legs = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T12:05:00Z',
      expectedReviewers: ['claude'],
      reviews: [
        review({
          author: 'claude',
          commitOid: OLD,
          body: 'Code review skipped — quota.',
        }),
      ],
      reviewRequests: [],
      now: '2026-07-21T12:06:00Z',
    });
    expect(legs[0]?.state).toBe('OWED');
  });

  it('SKIPPED via timeout: checks green >10 min with no tip-bound review', () => {
    const legs = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T11:50:00Z',
      expectedReviewers: ['claude'],
      reviews: [],
      reviewRequests: [],
      now: '2026-07-21T12:01:00Z',
    });
    // skipReason travels STRUCTURALLY — settlement classifies on it, never on
    // the prose detail (security D1, 2026-08-06).
    expect(legs[0]).toMatchObject({ reviewer: 'claude', state: 'SKIPPED', skipReason: 'timeout' });
    expect(legs[0]?.detail).toContain('timeout');
  });

  it('OWED inside the checks-green window (no premature timeout), and OWED when checks not yet green', () => {
    const inWindow = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T11:55:00Z',
      expectedReviewers: ['claude'],
      reviews: [],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(inWindow[0]?.state).toBe('OWED');
    const noGreen = computeReviewerLegs({
      ...base,
      checksGreenAt: null,
      expectedReviewers: ['claude'],
      reviews: [],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(noGreen[0]?.state).toBe('OWED');
  });

  it('evaluates each expected reviewer independently (the collapsed-legs regression)', () => {
    const legs = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T11:56:00Z',
      expectedReviewers: ['copilot-pull-request-reviewer', 'claude'],
      reviews: [review({})],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(legs.map((leg) => `${leg.reviewer}:${leg.state}`)).toEqual([
      'copilot-pull-request-reviewer:SATISFIED',
      'claude:OWED',
    ]);
  });
});

describe('mostBlockingLeg', () => {
  const owedClaude = { reviewer: 'claude', state: 'OWED' as const, detail: '' };

  it('a dead requested leg outranks another reviewer’s live run (per-reviewer, not PR-wide)', () => {
    const verdict = mostBlockingLeg({
      legs: [{ reviewer: 'copilot-pull-request-reviewer', state: 'OWED', detail: '' }, owedClaude],
      reviewRequests: ['copilot-pull-request-reviewer', 'claude'],
      liveRunReviewers: ['copilot-pull-request-reviewer'],
      runsReadable: true,
    });
    expect(verdict).toMatchObject({ kind: 'SILENT-WAIT-RUN-DEAD', reviewer: 'claude' });
  });

  it('an owed unrequested leg reads SILENT-WAIT-NO-REVIEWER', () => {
    expect(
      mostBlockingLeg({
        legs: [owedClaude],
        reviewRequests: [],
        liveRunReviewers: [],
        runsReadable: true,
      }),
    ).toMatchObject({ kind: 'SILENT-WAIT-NO-REVIEWER', reviewer: 'claude' });
  });

  it('a requested leg with a live run reads WAITING-REVIEW-RUN-LIVE', () => {
    expect(
      mostBlockingLeg({
        legs: [owedClaude],
        reviewRequests: ['claude'],
        liveRunReviewers: ['claude'],
        runsReadable: true,
      }),
    ).toMatchObject({ kind: 'WAITING-REVIEW-RUN-LIVE', reviewer: 'claude' });
  });

  it('an unreadable run surface never asserts deadness (typed uncertainty)', () => {
    expect(
      mostBlockingLeg({
        legs: [owedClaude],
        reviewRequests: ['claude'],
        liveRunReviewers: [],
        runsReadable: false,
      }),
    ).toMatchObject({ kind: 'SILENT-WAIT-RUNS-UNREADABLE', reviewer: 'claude' });
  });

  it('matches reviewer logins case-insensitively (GitHub logins are)', () => {
    const legs = computeReviewerLegs({
      ...base,
      expectedReviewers: ['JIMCRESSWELL'],
      reviews: [review({ author: 'jimCresswell' })],
      reviewRequests: [],
      now: '2026-07-21T12:06:00Z',
    });
    expect(legs[0]?.state).toBe('SATISFIED');
    expect(
      mostBlockingLeg({
        legs: [{ reviewer: 'JIMCRESSWELL', state: 'OWED', detail: '' }],
        reviewRequests: ['jimCresswell'],
        liveRunReviewers: [],
        runsReadable: true,
      }),
    ).toMatchObject({ kind: 'SILENT-WAIT-RUN-DEAD' });
  });

  it('a PENDING (unsubmitted) review neither satisfies nor skips a leg', () => {
    const legs = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T11:56:00Z',
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [review({ state: 'PENDING', submittedAt: '' })],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(legs[0]?.state).toBe('OWED');
  });

  it('returns settled when no leg is OWED', () => {
    expect(
      mostBlockingLeg({
        legs: [{ reviewer: 'claude', state: 'SKIPPED', skipReason: 'quota', detail: 'quota' }],
        reviewRequests: [],
        liveRunReviewers: [],
        runsReadable: true,
      }),
    ).toEqual({ kind: 'settled' });
  });
});

describe('computeReviewerLegs — explicit non-quota skip markers (r5 regression)', () => {
  it('an explicit skip marker WITHOUT a scope declaration never reads SATISFIED — it awaits the timeout', () => {
    // "Code review skipped — service unavailable" declares that NO review
    // occurred, but carries no evaluable scope (quota/billing) phrase: it is
    // not a substantive review (SATISFIED would be a lie) and not a
    // scope-declared SKIPPED; the leg falls through to the timeout arm.
    const legs = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T11:56:00Z',
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [review({ body: 'Code review skipped — service unavailable.' })],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(legs[0]?.state).toBe('OWED');
    expect(legs[0]?.detail).toContain('skip marker');
  });

  it('an unevaluable skip marker resolves SKIPPED via the timeout once the window elapses', () => {
    const legs = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T11:40:00Z',
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [review({ body: 'Code review skipped — service unavailable.' })],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(legs[0]?.state).toBe('SKIPPED');
    expect(legs[0]?.detail).toContain('timeout');
  });

  it('a scope-declared quota marker still reads SKIPPED immediately, and a substantive review still wins', () => {
    const legs = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T11:56:00Z',
      expectedReviewers: ['copilot-pull-request-reviewer', 'claude'],
      reviews: [
        review({ body: 'Reviewed 2 of 2 files.' }),
        review({ author: 'claude', body: '⚠️ Code review skipped — overage spend limit reached.' }),
      ],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(legs[0]?.state).toBe('SATISFIED');
    expect(legs[1]?.state).toBe('SKIPPED');
  });
});

// The signature's canonical parenthesised field is the BARE session_id_prefix
// (the join key, pr-lifecycle SKILL); the detector additionally tolerates the
// MCP-145 visual-disambiguator token because a seat may paste its rendered
// identity. The asymmetry drives every row below: a false POSITIVE silently
// excludes a real reviewer at all three consumers (quiet-window anchoring,
// body-tally evidence, and the defaulted expected-reviewer set — the
// load-bearing one), so the prefix arm stays exactly six lowercase hex —
// the ratified rows with
// non-hex, uppercase, or hyphen-bearing prefixes are DELIBERATE non-matches
// (their cost is only a bounded wait via the timeout arm).
describe('isSignedSelfReply', () => {
  it('accepts the canonical bare-prefix signature', () => {
    expect(isSignedSelfReply('Fixed at source.\n\n— Moth mends Dreamscape (92e9d6)')).toBe(true);
  });

  it('accepts a token-form signature (prefix-idTail pasted from a rendered surface)', () => {
    expect(isSignedSelfReply('Fixed at source.\n\n— Moth mends Dreamscape (92e9d6-9c1)')).toBe(
      true,
    );
  });

  it('accepts an uppercase id tail in a token signature (ratified 22e835-DDA row)', () => {
    expect(isSignedSelfReply('Cured.\n\n— Uplifted Wheeling Sky (22e835-DDA)')).toBe(true);
  });

  it('rejects lookalike last lines in the safe direction', () => {
    // Non-hex prefix (ratified antigr row), uppercase prefix (ratified 22E835
    // row), hyphen-bearing override prefix, human prose, and a signature line
    // without the em-dash opener — none may read as a self-reply, because a
    // false positive drops a real review from the round.
    expect(isSignedSelfReply('— Antigravity seat (antigr-33e)')).toBe(false);
    expect(isSignedSelfReply('— Loud Seat (22E835-675)')).toBe(false);
    expect(isSignedSelfReply('— Operator seat (override-prefix-265)')).toBe(false);
    expect(isSignedSelfReply('— see the note above (line 42)')).toBe(false);
    expect(isSignedSelfReply('Moth mends Dreamscape (92e9d6)')).toBe(false);
  });
});
