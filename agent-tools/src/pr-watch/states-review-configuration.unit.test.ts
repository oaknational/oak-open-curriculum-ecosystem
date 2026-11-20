import { describe, expect, it } from 'vitest';

import { computePrVerdict } from './states.js';
import { COPILOT, LATE_NOW, OLD_TIP, settledReading } from './state-reading-fixture.js';

/**
 * The `pr state` surface of a later tip whose reviewer has reviewed an
 * earlier commit: the leg reads UNOWED and the round settles, whatever the
 * base branch's review configuration reads. The configuration stays in the
 * evidence.
 */

describe('computePrVerdict — a later tip owes a reviewer nothing once their earlier review is in', () => {
  const NO_REVIEW_ON_PUSH = {
    kind: 'configured',
    reviewOnPush: false,
    reviewDraft: false,
  } as const;
  const earlierTipReview = {
    author: COPILOT,
    state: 'COMMENTED',
    body: 'Reviewed 2 of 2 files.',
    commitOid: OLD_TIP,
    submittedAt: '2026-07-21T12:05:00Z',
  };

  it('a later tip settles with the UNOWED leg, and the configuration read is in the evidence', () => {
    const verdict = computePrVerdict(
      settledReading({ reviews: [earlierTipReview], reviewConfiguration: NO_REVIEW_ON_PUSH }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
    const evidence = verdict.evidence.join('\n');
    expect(evidence).toContain(`${COPILOT}: UNOWED`);
    expect(evidence).toContain('review_on_push=false');
  });

  it('the same tip under an unread configuration owes nothing either: the configuration is evidence and decides no leg', () => {
    const verdict = computePrVerdict(
      settledReading({ reviews: [earlierTipReview], checksGreenAt: '2026-07-21T12:55:00Z' }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLING-QUIET-WINDOW');
    const evidence = verdict.evidence.join('\n');
    expect(evidence).toContain(`${COPILOT}: UNOWED`);
    expect(evidence).toContain('review configuration unread');
  });
});
