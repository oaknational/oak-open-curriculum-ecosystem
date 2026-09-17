import { describe, expect, it } from 'vitest';

import { PR_VERDICT_STATES } from './state-types.js';
import type { PrStateReading } from './state-types.js';
import { computePrVerdict } from './states.js';

/**
 * The D1 verdict function: one closed, typed verdict per compound reading,
 * executing the pr-lifecycle SKILL review-round state machine. Every
 * silent-wait class from the 2026-07-20/21 net-to-zero drive has a regression
 * fixture, plus the r2 classes: per-reviewer legs (never collapsed), the more-than-10
 * min quiet window, and the latestReviews backwards-pointer.
 */

const TIP = 'a'.repeat(40);
const OLD_TIP = 'b'.repeat(40);
const COPILOT = 'copilot-pull-request-reviewer';
/** A now safely past every fixture timestamp's quiet window. */
const LATE_NOW = '2026-07-21T13:00:00Z';

function settledReading(overrides: Partial<PrStateReading> = {}): PrStateReading {
  return {
    number: 999,
    url: 'https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/999',
    state: 'OPEN',
    isDraft: false,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: TIP,
    checks: { total: 3, passed: 3, failed: 0, pending: 0 },
    namedChecks: [
      { name: 'secret-scan', bucket: 'passed' },
      { name: 'SonarCloud Code Analysis', bucket: 'passed' },
      { name: 'CI / static-checks', bucket: 'passed' },
    ],
    checksGreenAt: '2026-07-21T12:00:00Z',
    reviewThreads: { total: 4, unresolved: 0 },
    autoMergeArmed: false,
    reviewRequests: [],
    expectedReviewers: [COPILOT],
    expectedDeclared: true,
    reviews: [
      {
        author: COPILOT,
        state: 'COMMENTED',
        body: 'Reviewed 2 of 2 files.',
        commitOid: TIP,
        submittedAt: '2026-07-21T12:05:00Z',
      },
    ],
    reviewRuns: { kind: 'read', runs: [] },
    ...overrides,
  };
}

describe('PR_VERDICT_STATES', () => {
  it('is the closed set from the plan plus the typed extensions', () => {
    const byLocale = (left: string, right: string): number => left.localeCompare(right);
    expect([...PR_VERDICT_STATES].sort(byLocale)).toEqual(
      [
        'SETTLE-READY',
        'SETTLING-QUIET-WINDOW',
        'DRAFT',
        'WAITING-REVIEW-RUN-LIVE',
        'SILENT-WAIT-NO-REVIEWER',
        'SILENT-WAIT-RUN-DEAD',
        'SILENT-WAIT-RUNS-UNREADABLE',
        'CHECKS-RUNNING',
        'CHECKS-RED',
        'THREADS-OPEN',
        'BEHIND-BASE',
        'ARMED-BEHIND-RED',
        'QUOTA-SKIPPED',
        'SETTLED-NO-REVIEW',
        'MERGED',
        'CLOSED',
        'CONFLICT-DIRTY',
      ].sort(byLocale),
    );
  });
});

describe('computePrVerdict — the timeout-skip settled round (security D1, 2026-08-06)', () => {
  // The timeout arm exists so a WATCH can end rather than hang forever; it
  // must never launder "nobody reviewed" into merge-eligibility. A round
  // settled by timeout-skips gets its own typed state, mirroring the
  // QUOTA-SKIPPED carve-out.
  it('a round settled ONLY by timeout-skips reads SETTLED-NO-REVIEW, never SETTLE-READY', () => {
    const verdict = computePrVerdict(settledReading({ reviews: [] }), LATE_NOW);

    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
    expect(verdict.evidence.join('\n')).toContain(COPILOT);
  });

  it('an outwaited LIVE review run still refuses — liveness stops mattering for wait, not for merge-eligibility', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [],
        reviewRequests: [COPILOT],
        reviewRuns: {
          kind: 'read',
          runs: [
            {
              id: 'run-1',
              name: 'copilot review',
              createdAt: '2026-07-21T12:01:00Z',
              completedAt: null,
            },
          ],
        },
      }),
      LATE_NOW,
    );

    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
  });

  it('one SATISFIED leg does not launder another reviewer timing out unreviewed', () => {
    const verdict = computePrVerdict(
      settledReading({ expectedReviewers: [COPILOT, 'second-reviewer'] }),
      LATE_NOW,
    );

    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
    expect(verdict.evidence.join('\n')).toContain('second-reviewer');
  });
});

describe('computePrVerdict — terminal and conflict states', () => {
  it('reports MERGED regardless of other legs', () => {
    const verdict = computePrVerdict(
      settledReading({ state: 'MERGED', checks: { total: 3, passed: 1, failed: 1, pending: 1 } }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('MERGED');
  });

  it('reports CLOSED (typed refusal) for closed-unmerged', () => {
    expect(computePrVerdict(settledReading({ state: 'CLOSED' }), LATE_NOW).state).toBe('CLOSED');
  });

  it('reports CONFLICT-DIRTY on CONFLICTING or DIRTY', () => {
    expect(computePrVerdict(settledReading({ mergeable: 'CONFLICTING' }), LATE_NOW).state).toBe(
      'CONFLICT-DIRTY',
    );
    expect(
      computePrVerdict(
        settledReading({ mergeable: 'UNKNOWN', mergeStateStatus: 'DIRTY' }),
        LATE_NOW,
      ).state,
    ).toBe('CONFLICT-DIRTY');
  });
});

describe('computePrVerdict — the armed-behind-red regression class (#437, 2026-07-21)', () => {
  it('an armed auto-merge behind a red check can NEVER read healthy, and names the check', () => {
    const verdict = computePrVerdict(
      settledReading({
        autoMergeArmed: true,
        checks: { total: 3, passed: 2, failed: 1, pending: 0 },
        namedChecks: [
          { name: 'secret-scan', bucket: 'passed' },
          { name: 'CI / static-checks', bucket: 'passed' },
          { name: 'SonarCloud Code Analysis', bucket: 'failed' },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('ARMED-BEHIND-RED');
    expect(verdict.evidence.join('\n')).toContain('SonarCloud Code Analysis');
  });

  it('unarmed red reads CHECKS-RED; red outranks pending', () => {
    expect(
      computePrVerdict(
        settledReading({
          checks: { total: 2, passed: 0, failed: 1, pending: 1 },
          namedChecks: [
            { name: 'CI / test', bucket: 'failed' },
            { name: 'CI / build', bucket: 'pending' },
          ],
        }),
        LATE_NOW,
      ).state,
    ).toBe('CHECKS-RED');
  });
});

describe('computePrVerdict — checks and threads ladder', () => {
  it('reports CHECKS-RUNNING while pending, and zero checks are never vacuously green', () => {
    expect(
      computePrVerdict(
        settledReading({
          checks: { total: 2, passed: 1, failed: 0, pending: 1 },
          namedChecks: [
            { name: 'secret-scan', bucket: 'passed' },
            { name: 'CI / test', bucket: 'pending' },
          ],
        }),
        LATE_NOW,
      ).state,
    ).toBe('CHECKS-RUNNING');
    expect(
      computePrVerdict(
        settledReading({ checks: { total: 0, passed: 0, failed: 0, pending: 0 }, namedChecks: [] }),
        LATE_NOW,
      ).state,
    ).toBe('CHECKS-RUNNING');
  });

  it('reports THREADS-OPEN when checks green but threads unresolved', () => {
    expect(
      computePrVerdict(settledReading({ reviewThreads: { total: 5, unresolved: 2 } }), LATE_NOW)
        .state,
    ).toBe('THREADS-OPEN');
  });
});

describe('computePrVerdict — per-reviewer legs (the collapsed-legs r2 class)', () => {
  it('one reviewer’s current review never settles another expected reviewer’s owed leg', () => {
    const verdict = computePrVerdict(
      settledReading({
        expectedReviewers: [COPILOT, 'claude'],
        checksGreenAt: '2026-07-21T12:56:00Z',
      }),
      '2026-07-21T13:00:00Z',
    );
    expect(verdict.state).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(verdict.evidence.join('\n')).toContain('claude');
  });

  it('an old-tip review submitted LATER never hides the current-tip review (backwards pointer)', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [
          {
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Reviewed current tip.',
            commitOid: TIP,
            submittedAt: '2026-07-21T12:01:00Z',
          },
          {
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Older-tip job finishing late.',
            commitOid: OLD_TIP,
            submittedAt: '2026-07-21T12:09:00Z',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
  });

  it('a stale-tip-only review leaves the leg owed', () => {
    const verdict = computePrVerdict(
      settledReading({
        checksGreenAt: '2026-07-21T12:56:00Z',
        reviews: [
          {
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Reviewed an older push.',
            commitOid: OLD_TIP,
            submittedAt: '2026-07-21T12:01:00Z',
          },
        ],
      }),
      '2026-07-21T13:00:00Z',
    );
    expect(verdict.state).toBe('SILENT-WAIT-NO-REVIEWER');
  });

  it('an empty commitOid never proves tip binding; the timeout settles the WATCH but the round is not merge-eligible', () => {
    // Until the security D1 cure (2026-08-06) this round read SETTLE-READY —
    // the exact hole: a timeout-settled round has no proven tip-bound review.
    const verdict = computePrVerdict(
      settledReading({
        reviews: [
          {
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Reviewed.',
            commitOid: '',
            submittedAt: '2026-07-21T12:05:00Z',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLED-NO-REVIEW');
    expect(verdict.evidence.join('\n')).toContain('timeout');
  });
});

describe('computePrVerdict — run liveness per reviewer', () => {
  it('WAITING-REVIEW-RUN-LIVE when the owed requested reviewer has a live run', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [],
        reviewRequests: [COPILOT],
        checksGreenAt: '2026-07-21T12:56:00Z',
        reviewRuns: {
          kind: 'read',
          runs: [
            { id: 'run-1', name: 'Review from @jimCresswell', createdAt: 't0', completedAt: null },
          ],
        },
      }),
      '2026-07-21T13:00:00Z',
    );
    expect(verdict.state).toBe('WAITING-REVIEW-RUN-LIVE');
  });

  it('SILENT-WAIT-RUN-DEAD when requested with no live run', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [],
        reviewRequests: [COPILOT],
        checksGreenAt: '2026-07-21T12:56:00Z',
        reviewRuns: {
          kind: 'read',
          runs: [
            {
              id: 'run-1',
              name: 'Review from @jimCresswell',
              createdAt: 't0',
              completedAt: '2026-07-21T12:40:00Z',
            },
          ],
        },
      }),
      '2026-07-21T13:00:00Z',
    );
    expect(verdict.state).toBe('SILENT-WAIT-RUN-DEAD');
  });

  it('an unavailable runs leg with a requested owed reviewer never asserts dead', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [],
        reviewRequests: [COPILOT],
        checksGreenAt: '2026-07-21T12:56:00Z',
        reviewRuns: { kind: 'unavailable', reason: 'gh agent-task missing' },
      }),
      '2026-07-21T13:00:00Z',
    );
    expect(verdict.state).toBe('SILENT-WAIT-RUNS-UNREADABLE');
  });

  it('an unavailable runs leg degrades typed, named in evidence', () => {
    const verdict = computePrVerdict(
      settledReading({ reviewRuns: { kind: 'unavailable', reason: 'gh agent-task missing' } }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
    expect(verdict.evidence.join('\n')).toContain('review-run liveness unavailable');
  });
});

describe('computePrVerdict — base currency and vacuous sets', () => {
  it('a BEHIND base never reads settled — the founding BEHIND-stall class', () => {
    const verdict = computePrVerdict(settledReading({ mergeStateStatus: 'BEHIND' }), LATE_NOW);
    expect(verdict.state).toBe('BEHIND-BASE');
  });

  it('an EMPTY expected set can never settle (first-round rule holds vacuously nowhere)', () => {
    const verdict = computePrVerdict(
      settledReading({ expectedReviewers: [], expectedDeclared: false, reviews: [] }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(verdict.evidence.join('\n')).toContain('EMPTY');
  });

  it('a missing quiet-window anchor holds the window open, never silently settles', () => {
    const verdict = computePrVerdict(
      settledReading({
        checksGreenAt: null,
        reviews: [
          {
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Reviewed.',
            commitOid: TIP,
            submittedAt: '',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLING-QUIET-WINDOW');
    expect(verdict.evidence.join('\n')).toContain('no parseable quiet-window anchor');
  });
});

describe('computePrVerdict — quiet window and settlement (SKILL item 4)', () => {
  it('withholds SETTLE-READY inside the >10 min window since the latest tip-bound review', () => {
    const verdict = computePrVerdict(
      settledReading(),
      // 4 minutes after the fixture's 12:05 review — window still open.
      '2026-07-21T12:09:00Z',
    );
    expect(verdict.state).toBe('SETTLING-QUIET-WINDOW');
  });

  it('reports SETTLE-READY once the window elapses', () => {
    expect(computePrVerdict(settledReading(), '2026-07-21T12:16:00Z').state).toBe('SETTLE-READY');
  });

  it('a settled round with a quota-skipped leg reads QUOTA-SKIPPED (owner ruling: skipped, not satisfied)', () => {
    const verdict = computePrVerdict(
      settledReading({
        expectedReviewers: [COPILOT, 'claude'],
        reviews: [
          ...settledReading().reviews,
          {
            author: 'claude',
            state: 'COMMENTED',
            body: '⚠️ **Code review skipped** — overage spend limit reached.',
            commitOid: TIP,
            submittedAt: '2026-07-21T12:05:30Z',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('QUOTA-SKIPPED');
    expect(verdict.evidence.join('\n')).toContain('claude: SKIPPED');
  });

  it('a signed self-authored reply never re-opens the quiet window (SKILL anchoring exclusion)', () => {
    const verdict = computePrVerdict(
      settledReading({
        reviews: [
          ...settledReading().reviews,
          {
            author: 'jimCresswell',
            state: 'COMMENTED',
            body: 'Fixed at source in abc1234.\n\n— Moth mends Dreamscape (92e9d6)',
            commitOid: TIP,
            submittedAt: '2026-07-21T12:58:00Z',
          },
        ],
      }),
      // 4 minutes after the self-reply but >10 after the real 12:05 review.
      '2026-07-21T13:02:00Z',
    );
    expect(verdict.state).toBe('SETTLE-READY');
  });

  it('a token-signed self-reply never re-opens the quiet window either', () => {
    // Same anchoring exclusion, signature carrying the MCP-145 display token
    // (prefix-idTail) instead of the bare prefix — a seat pasting its rendered
    // identity must not turn its own disposition reply into a round anchor.
    const verdict = computePrVerdict(
      settledReading({
        reviews: [
          ...settledReading().reviews,
          {
            author: 'jimCresswell',
            state: 'COMMENTED',
            body: 'Fixed at source in abc1234.\n\n— Moth mends Dreamscape (92e9d6-9c1)',
            commitOid: TIP,
            submittedAt: '2026-07-21T12:58:00Z',
          },
        ],
      }),
      '2026-07-21T13:02:00Z',
    );
    expect(verdict.state).toBe('SETTLE-READY');
  });

  it('an undeclared expected set is named in evidence, never silent', () => {
    const verdict = computePrVerdict(settledReading({ expectedDeclared: false }), LATE_NOW);
    expect(verdict.evidence.join('\n')).toContain('DEFAULTED from the observed surface');
  });
});

describe('computePrVerdict — round-6 classes (2026-07-21)', () => {
  it('a fully green settled DRAFT reads the typed DRAFT refusal, never SETTLE-READY (r6 regression)', () => {
    // Drafts cannot merge via the sanctioned landing path (the pr-throughput
    // invariant) — unlike review-gate BLOCKED (ratified landable), draftness
    // is a real merge blocker, so no settlement read may proceed over it.
    const verdict = computePrVerdict(settledReading({ isDraft: true }), LATE_NOW);
    expect(verdict.state).toBe('DRAFT');
    expect(verdict.evidence.join('\n')).toContain('mark ready for review');
  });
});

describe('computePrVerdict — round-4 residual classes (2026-07-21)', () => {
  it('an empty-submittedAt tip-bound review holds the quiet window open, never inherits the checks anchor', () => {
    // A landed review whose submittedAt gh omits could be NEWER than every
    // timestamped one; falling through to the (older) checks-green anchor
    // would read SETTLE-READY inside the un-provable window.
    const verdict = computePrVerdict(
      settledReading({
        reviews: [
          ...settledReading().reviews,
          {
            author: COPILOT,
            state: 'COMMENTED',
            body: 'Round n summary.',
            commitOid: TIP,
            submittedAt: '',
          },
        ],
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLING-QUIET-WINDOW');
  });

  it('a TRUNCATED run list never asserts deadness — the requested owed leg reads RUNS-UNREADABLE (r5 regression)', () => {
    // A full-window agent-task list (100 rows) leaves older runs unobserved:
    // absence of a scoped run in truncated data is not evidence of a dead
    // run, so the typed-uncertainty state applies, exactly as when the
    // surface cannot be read at all.
    const verdict = computePrVerdict(
      settledReading({
        reviews: [],
        reviewRequests: [COPILOT],
        checksGreenAt: '2026-07-21T12:58:00Z',
        reviewRuns: {
          kind: 'read',
          runs: [],
          truncated: true,
          note: 'agent-task list truncated at 100 — older runs unobserved',
        },
      }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SILENT-WAIT-RUNS-UNREADABLE');
  });

  it('SETTLE-READY evidence hands over the body-tally inputs (SKILL item 2: bodies count into the round tally)', () => {
    // A summary-only review carrying findings in its body would otherwise
    // read healthy at zero threads. The instrument cannot classify prose as
    // findings (a CLEAN Copilot round also posts a non-empty summary body —
    // verified on the merged #460's final tip — so refusing on body PRESENCE
    // would deadlock every landing); it names the tally inputs instead.
    const verdict = computePrVerdict(settledReading(), LATE_NOW);
    expect(verdict.state).toBe('SETTLE-READY');
    expect(verdict.evidence.join('\n')).toContain(
      `tip-bound review body present: ${COPILOT} (COMMENTED)`,
    );
  });
});
