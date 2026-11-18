import { describe, expect, it } from 'vitest';

import { computePrVerdict } from './states.js';
import { COPILOT, LATE_NOW, OLD_TIP, settledReading } from './state-reading-fixture.js';

/**
 * The `pr state` surface of the configuration-derived owing (the owner's
 * word of 2026-10-16): a tip the base branch does not review settles with its
 * leg named UNOWED and the rule in evidence; an unread configuration keeps
 * the leg owed and the blocking verdict names the gap.
 */

describe('computePrVerdict — what a tip is owed is read from the review configuration', () => {
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

  it('a later tip the base branch does not review settles with the UNOWED leg and the rule named', () => {
    const verdict = computePrVerdict(
      settledReading({ reviews: [earlierTipReview], reviewConfiguration: NO_REVIEW_ON_PUSH }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SETTLE-READY');
    const evidence = verdict.evidence.join('\n');
    expect(evidence).toContain(`${COPILOT}: UNOWED`);
    expect(evidence).toContain('review_on_push=false');
  });

  it('the same tip under an unread configuration stays owed, and the blocking verdict says why', () => {
    const verdict = computePrVerdict(
      settledReading({ reviews: [earlierTipReview], checksGreenAt: '2026-07-21T12:55:00Z' }),
      LATE_NOW,
    );
    expect(verdict.state).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(verdict.evidence.join('\n')).toContain('review configuration unread');
  });
});
