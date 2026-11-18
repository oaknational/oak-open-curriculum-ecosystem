import { NO_CONTENT } from './content-binding.js';
import { NO_DECLARATIONS } from './declared-unavailable.js';
import type { PrStateReading } from './state-types.js';

/**
 * The settled-PR reading the `pr state` verdict specs start from: green
 * checks anchored at 12:00Z, one tip-bound Copilot review at 12:05Z, no
 * threads open. Variation is expressed through `overrides` at call sites,
 * never by editing this base (consolidate-at-second-consumer: the settlement
 * suites share one premise). The merge-bot suites carry their own base in
 * `merge-bot/test-helpers/pr-state-reading.ts`, anchored to their own clock.
 */

export const TIP = 'a'.repeat(40);
export const OLD_TIP = 'b'.repeat(40);
export const COPILOT = 'copilot-pull-request-reviewer';
/** A now safely past every fixture timestamp's quiet window. */
export const LATE_NOW = '2026-07-21T13:00:00Z';

export function settledReading(overrides: Partial<PrStateReading> = {}): PrStateReading {
  return {
    number: 999,
    url: 'https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/999',
    author: 'app/el-graphael',
    state: 'OPEN',
    isDraft: false,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: TIP,
    baseRefName: 'main',
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
    roundRequests: [],
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
    completionComments: { reviews: [], refused: [], notices: [] },
    declaredUnavailable: NO_DECLARATIONS,
    reviewRuns: { kind: 'read', runs: [] },
    reviewConfiguration: { kind: 'unread', reason: 'the test reading declares none' },
    content: NO_CONTENT,
    ...overrides,
  };
}
