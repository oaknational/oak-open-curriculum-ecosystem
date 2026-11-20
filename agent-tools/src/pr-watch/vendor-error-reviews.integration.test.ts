import { describe, expect, it } from 'vitest';

import { NO_CONTENT } from './content-binding.js';
import { computeReviewerLegs, type HarvestedReview } from './reviewer-legs.js';
import { COPILOT, LATE_NOW, settledReading, TIP } from './state-reading-fixture.js';
import { computePrVerdict } from './states.js';

/**
 * The reviewer leg and the verdict over a vendor's error review: the review
 * object is real, and no review occurred, so it satisfies no leg whatever its
 * state, the leg counts it, and the body tally leaves it out. A finding that
 * quotes the error's wording, or a skip phrase, is still a review.
 */

const COPILOT_ERROR =
  'Copilot encountered an error and was unable to review this pull request. You can try again by re-requesting a review.';

function review(overrides: Partial<HarvestedReview>): HarvestedReview {
  return {
    author: COPILOT,
    state: 'COMMENTED',
    body: COPILOT_ERROR,
    commitOid: TIP,
    submittedAt: '2026-07-21T12:05:00Z',
    ...overrides,
  };
}

function legsOver(reviews: readonly HarvestedReview[], checksGreenAt: string) {
  return computeReviewerLegs({
    headRefOid: TIP,
    content: NO_CONTENT,
    checksGreenAt,
    roundRequests: [],
    expectedReviewers: [COPILOT],
    reviews,
    reviewRequests: [],
    now: '2026-07-21T12:10:00Z',
  });
}

const ONE_ERROR_NOTE =
  '; 1 tip-bound vendor error review ignored (the vendor could not review this tip)';

describe('computeReviewerLegs over a vendor error review', () => {
  it.each(['COMMENTED', 'APPROVED', 'CHANGES_REQUESTED'])(
    'an error review under %s satisfies no leg, and the detail counts it',
    (state) => {
      expect(legsOver([review({ state })], '2026-07-21T12:04:00Z')).toStrictEqual([
        {
          reviewer: COPILOT,
          state: 'OWED',
          detail: `no substantive review binds the current tip${ONE_ERROR_NOTE}`,
        },
      ]);
    },
  );

  it('two error reviews and then a content review satisfy the leg, as on the recorded pull request', () => {
    const legs = legsOver(
      [
        review({ submittedAt: '2026-07-21T12:01:00Z' }),
        review({ submittedAt: '2026-07-21T12:03:00Z' }),
        review({ body: 'Reviewed 2 of 2 files.', submittedAt: '2026-07-21T12:05:00Z' }),
      ],
      '2026-07-21T12:00:00Z',
    );
    expect(legs).toStrictEqual([
      {
        reviewer: COPILOT,
        state: 'SATISFIED',
        detail:
          'substantive review binds current tip; 2 tip-bound vendor error reviews ignored (the vendor could not review this tip)',
      },
    ]);
  });

  it.each([
    [
      'the recorded quoting finding',
      'The body "Unable to review: service unavailable" must satisfy no leg.',
    ],
    [
      'a finding quoting the Copilot sentence',
      `The vendor posted "${COPILOT_ERROR}" on the old tip.`,
    ],
  ])('%s is a review, and satisfies the leg', (_name, body) => {
    expect(legsOver([review({ body })], '2026-07-21T12:04:00Z')).toStrictEqual([
      { reviewer: COPILOT, state: 'SATISFIED', detail: 'substantive review binds current tip' },
    ]);
  });

  it('an error review alone resolves through the timeout arm, never SATISFIED', () => {
    expect(legsOver([review({})], '2026-07-21T11:40:00Z')).toStrictEqual([
      {
        reviewer: COPILOT,
        state: 'SKIPPED',
        skipReason: 'timeout',
        detail: `timeout: no substantive tip-bound review one quiet window after checks green (2026-07-21T11:40:00Z)${ONE_ERROR_NOTE}`,
      },
    ]);
  });
});

describe('the quiet window over a vendor error review', () => {
  it('an error review after the last real review does not restart the window', () => {
    const reading = settledReading({
      reviews: [
        review({ body: 'Reviewed 2 of 2 files.', submittedAt: '2026-07-21T12:05:00Z' }),
        review({ submittedAt: '2026-07-21T12:20:00Z' }),
      ],
    });

    expect(computePrVerdict(reading, '2026-07-21T12:25:00Z').state).toBe('SETTLE-READY');
  });
});

describe('computePrVerdict over a tip whose only review is a vendor error review', () => {
  it('settles NO-REVIEW, with no body to tally', () => {
    const verdict = computePrVerdict(settledReading({ reviews: [review({})] }), LATE_NOW);

    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
    expect(
      verdict.evidence.filter((line) => line.startsWith('tip-bound review body present')),
    ).toStrictEqual([]);
  });
});
