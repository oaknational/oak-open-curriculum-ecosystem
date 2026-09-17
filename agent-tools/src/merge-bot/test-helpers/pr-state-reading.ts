import type { PrStateReading } from '../../pr-watch/state-types.js';

/**
 * The canonical settled-PR reading for merge-bot tests: quiet window
 * comfortably elapsed at a nowIso of 2026-08-06T09:00:00Z. One owner
 * (consolidate-at-second-consumer): the CLI tests' whole premise is that
 * this reading yields SETTLE-READY, so a silent value drift between twin
 * fixtures would change what those tests prove without breaking anything.
 * Variation is expressed through `overrides` at call sites, never by
 * editing this base.
 */

export const SETTLED_HEAD_OID = 'abc123def456abc123def456abc123def456abc1';

export function settledReading(overrides: Partial<PrStateReading> = {}): PrStateReading {
  return {
    number: 42,
    url: 'https://github.com/acme/widgets/pull/42',
    state: 'OPEN',
    isDraft: false,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'CLEAN',
    headRefOid: SETTLED_HEAD_OID,
    checks: { total: 3, passed: 3, failed: 0, pending: 0 },
    namedChecks: [{ name: 'lint', bucket: 'passed' }],
    checksGreenAt: '2026-08-06T08:00:00Z',
    reviewThreads: { total: 1, unresolved: 0 },
    autoMergeArmed: false,
    reviewRequests: [],
    expectedReviewers: ['copilot-pull-request-reviewer'],
    expectedDeclared: true,
    reviews: [
      {
        author: 'copilot-pull-request-reviewer',
        state: 'COMMENTED',
        body: 'review round complete',
        commitOid: SETTLED_HEAD_OID,
        submittedAt: '2026-08-06T08:05:00Z',
      },
    ],
    reviewRuns: { kind: 'read', runs: [] },
    ...overrides,
  };
}
