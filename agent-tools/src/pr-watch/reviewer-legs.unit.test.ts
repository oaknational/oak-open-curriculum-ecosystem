import { describe, expect, it } from 'vitest';
import type { ReviewConfiguration } from './review-configuration.js';

import { mostBlockingLeg } from './most-blocking-leg.js';
import { computeReviewerLegs, isSignedSelfReply } from './reviewer-legs.js';
import type { HarvestedReview } from './reviewer-legs.js';
import { NO_CONTENT, type ContentLeg } from './content-binding.js';
import type { RoundRequest } from './round-requests.js';

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

const base: {
  headRefOid: string;
  content: ContentLeg;
  checksGreenAt: string | null;
  roundRequests: readonly RoundRequest[];
  reviewConfiguration: ReviewConfiguration;
} = {
  headRefOid: TIP,
  content: NO_CONTENT,
  checksGreenAt: '2026-07-21T11:50:00Z',
  roundRequests: [],
  reviewConfiguration: { kind: 'unread', reason: 'the test reading declares none' },
};

const NO_REVIEW_ON_PUSH: ReviewConfiguration = {
  kind: 'configured',
  reviewOnPush: false,
  reviewDraft: false,
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
        detail: 'substantive review binds current tip',
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

// Replying to a review thread through the API creates a review with an EMPTY
// body under the replier's identity, so a pull request whose author has
// dispositioned findings carries tip-bound empty reviews of its own. Such a
// review says NOTHING — it is the reply's artefact, not a round — so it can
// neither satisfy a leg (SATISFIED would assert a review that never happened)
// nor mask the timeout arm. Recorded instances: #142's tip 92018c1f1 (seven
// empties beside Copilot's markers, 2026-09-12) and #147's tip 15de4bc69
// (seven, 2026-09-15). The empties are COUNTED in the detail rather than
// dropped silently: a reader must see what the instrument discarded.
describe('computeReviewerLegs — empty-bodied reviews (the thread-reply artefact)', () => {
  it('a tip-bound landed review with an EMPTY body never satisfies a leg, and the detail counts the empties', () => {
    const legs = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T11:56:00Z',
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [review({ body: '' }), review({ body: '   \n  ' })],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(legs[0]?.state).toBe('OWED');
    expect(legs[0]?.detail).toContain('2');
    expect(legs[0]?.detail).toContain('empty');
  });

  it('a substantive review beside the empties still satisfies the leg, and the detail counts them', () => {
    const legs = computeReviewerLegs({
      ...base,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [review({ body: '' }), review({ body: 'Reviewed 2 of 2 files.' })],
      reviewRequests: [],
      now: '2026-07-21T12:06:00Z',
    });
    expect(legs[0]?.state).toBe('SATISFIED');
    expect(legs[0]?.detail).toContain('1 tip-bound empty-bodied review ignored');
  });

  it('a quota marker beside an empty still skips on quota, and the detail counts the empty', () => {
    const legs = computeReviewerLegs({
      ...base,
      expectedReviewers: ['claude'],
      reviews: [
        review({ author: 'claude', body: '' }),
        review({ author: 'claude', body: '⚠️ Code review skipped — overage spend limit reached.' }),
      ],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(legs[0]).toMatchObject({ state: 'SKIPPED', skipReason: 'quota' });
    expect(legs[0]?.detail).toContain('1 tip-bound empty-bodied review ignored');
  });

  it('empties alone resolve via the timeout arm once the window elapses, never SATISFIED', () => {
    const legs = computeReviewerLegs({
      ...base,
      checksGreenAt: '2026-07-21T11:40:00Z',
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [review({ body: '' })],
      reviewRequests: [],
      now: '2026-07-21T12:00:00Z',
    });
    expect(legs[0]).toMatchObject({ state: 'SKIPPED', skipReason: 'timeout' });
    expect(legs[0]?.detail).toContain('empty');
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

describe('computeReviewerLegs — the base branch reviews no later push (review_on_push false)', () => {
  const earlier = review({ commitOid: OLD, submittedAt: '2026-07-21T11:00:00Z' });

  it('UNOWED on a later tip once the vendor reviewed an earlier one and nothing is requested', () => {
    const legs = computeReviewerLegs({
      ...base,
      reviewConfiguration: NO_REVIEW_ON_PUSH,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [earlier],
      reviewRequests: [],
      now: T0,
    });
    expect(legs[0]?.state).toBe('UNOWED');
    expect(
      mostBlockingLeg({ legs, reviewRequests: [], liveRunReviewers: [], runsReadable: true }),
    ).toEqual({ kind: 'settled' });
  });

  it('OWED while a request is outstanding on the tip: a hand-made request makes the leg owed again', () => {
    const legs = computeReviewerLegs({
      ...base,
      reviewConfiguration: NO_REVIEW_ON_PUSH,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [earlier],
      reviewRequests: ['copilot-pull-request-reviewer'],
      now: T0,
    });
    expect(legs[0]?.state).toBe('OWED');
  });

  it('OWED while a round asked of the vendor after its standing review stands in the pull request history: the pending surface lists no bot here', () => {
    const legs = computeReviewerLegs({
      ...base,
      reviewConfiguration: NO_REVIEW_ON_PUSH,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [earlier],
      reviewRequests: [],
      roundRequests: [{ reviewer: 'copilot-pull-request-reviewer', at: '2026-07-21T11:30:00Z' }],
      now: T0,
    });
    expect(legs[0]?.state).toBe('OWED');
  });

  it('UNOWED when the only round asked of the vendor was answered by its standing review', () => {
    const legs = computeReviewerLegs({
      ...base,
      reviewConfiguration: NO_REVIEW_ON_PUSH,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [earlier],
      reviewRequests: [],
      roundRequests: [{ reviewer: 'copilot-pull-request-reviewer', at: '2026-07-21T10:30:00Z' }],
      now: T0,
    });
    expect(legs[0]?.state).toBe('UNOWED');
  });

  it('OWED before the vendor has reviewed any tip: the configured first review is awaited, never raced', () => {
    const legs = computeReviewerLegs({
      ...base,
      reviewConfiguration: NO_REVIEW_ON_PUSH,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [],
      reviewRequests: [],
      now: T0,
    });
    expect(legs[0]?.state).toBe('OWED');
  });

  it('binds the Copilot leg only: another expected reviewer stays OWED on the same tip', () => {
    const legs = computeReviewerLegs({
      ...base,
      reviewConfiguration: NO_REVIEW_ON_PUSH,
      expectedReviewers: ['copilot-pull-request-reviewer', 'chatgpt-codex-connector'],
      reviews: [earlier, review({ author: 'chatgpt-codex-connector', commitOid: OLD })],
      reviewRequests: [],
      now: T0,
    });
    expect(legs.map((leg) => leg.state)).toEqual(['UNOWED', 'OWED']);
  });

  it('a failed review of this tip is never UNOWED: a tip-bound unevaluable marker keeps the leg OWED and the timeout arm ends it', () => {
    // The seat requested a review by hand; the vendor answered on the tip with a
    // body that is neither a review nor a scope-declared skip, and the request
    // cleared when it posted. The configuration's silence must not read that as
    // nothing asked.
    const bounce = review({
      body: 'Copilot encountered an error and was unable to review this pull request: service unavailable',
      submittedAt: '2026-07-21T11:55:00Z',
    });
    const inside = computeReviewerLegs({
      ...base,
      reviewConfiguration: NO_REVIEW_ON_PUSH,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [earlier, bounce],
      reviewRequests: [],
      now: T0,
    });
    expect(inside[0]?.state).toBe('OWED');
    const past = computeReviewerLegs({
      ...base,
      reviewConfiguration: NO_REVIEW_ON_PUSH,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      reviews: [earlier, bounce],
      reviewRequests: [],
      now: '2026-07-21T12:30:00Z',
    });
    expect(past[0]).toMatchObject({ state: 'SKIPPED', skipReason: 'timeout' });
  });

  it.each([
    [
      'a quota bounce on the earlier tip: no review ever happened',
      review({ commitOid: OLD, body: 'Code review skipped: overage spend limit reached.' }),
    ],
    [
      "another author's review of the earlier tip",
      review({ author: 'jimCresswell', commitOid: OLD }),
    ],
    ['an earlier review whose commit gh omitted', review({ commitOid: '' })],
    ['a PENDING draft on the earlier tip', review({ commitOid: OLD, state: 'PENDING' })],
  ])(
    'an earlier-tip body that is not a landed substantive Copilot review on a real oid never makes the leg UNOWED: %s',
    (_case, earlierBody) => {
      const legs = computeReviewerLegs({
        ...base,
        reviewConfiguration: NO_REVIEW_ON_PUSH,
        expectedReviewers: ['copilot-pull-request-reviewer'],
        reviews: [earlierBody],
        reviewRequests: [],
        now: T0,
      });
      expect(legs[0]?.state).toBe('OWED');
    },
  );

  it.each<ReviewConfiguration>([
    { kind: 'unread', reason: 'the test reading declares none' },
    { kind: 'absent' },
    { kind: 'configured', reviewOnPush: true, reviewDraft: false },
  ])(
    'keeps the leg OWED under a configuration that is not a read review_on_push=false: %o',
    (reviewConfiguration) => {
      const legs = computeReviewerLegs({
        ...base,
        reviewConfiguration,
        expectedReviewers: ['copilot-pull-request-reviewer'],
        reviews: [earlier],
        reviewRequests: [],
        now: T0,
      });
      expect(legs[0]?.state).toBe('OWED');
    },
  );
});
