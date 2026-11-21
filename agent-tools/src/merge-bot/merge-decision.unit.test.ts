import { describe, expect, it } from 'vitest';

import { PR_VERDICT_STATES, type PrVerdict } from '../pr-watch/state-types.js';
import { decideMergeAction, verdictAwaitsSettlement } from './merge-decision.js';

/**
 * The verdict→action mapping is the heart of `merge-bot merge`: it acts only
 * on SETTLE-READY, and every other outcome is a typed refusal carrying the
 * verdict's own evidence. The estate's never-squash ruling and the
 * tip-consistency guarantee are pinned here as behaviour, not prose.
 */

const SETTLE_READY: PrVerdict = {
  state: 'SETTLE-READY',
  evidence: ['every expected reviewer leg settled; quiet window elapsed'],
};

const baseInput = {
  verdict: SETTLE_READY,
  allowMergeCommit: true,
} as const;

describe('decideMergeAction', () => {
  it('merges a settled verdict when merge commits are allowed, told no reviewer', () => {
    const decision = decideMergeAction(baseInput);

    expect(decision).toEqual({ kind: 'merge' });
  });

  it.each(PR_VERDICT_STATES.filter((state) => state !== 'SETTLE-READY' && state !== 'MERGED'))(
    'refuses %s with the verdict state alone as the reason',
    (state) => {
      const decision = decideMergeAction({ ...baseInput, verdict: { state, evidence: [] } });

      expect(decision).toStrictEqual({
        kind: 'refuse',
        reason: `verdict ${state} — only SETTLE-READY merges`,
        awaitsSettlement: verdictAwaitsSettlement(state),
      });
    },
  );

  it('refuses an already-merged PR — another actor merging is never this invocation merging', () => {
    const merged: PrVerdict = { state: 'MERGED', evidence: ['PR is merged'] };

    const decision = decideMergeAction({ ...baseInput, verdict: merged });

    expect(decision).toMatchObject({ kind: 'refuse', awaitsSettlement: false });
    expect(JSON.stringify(decision)).toContain('MERGED');
    expect(JSON.stringify(decision)).toContain('another');
  });

  it('refuses when repo settings no longer allow merge commits, never falling back to squash', () => {
    const decision = decideMergeAction({ ...baseInput, allowMergeCommit: false });

    expect(decision).toMatchObject({ kind: 'refuse', awaitsSettlement: false });
    expect(JSON.stringify(decision)).toContain('merge commits');
    expect(JSON.stringify(decision)).not.toContain('squash instead');
  });
});

describe('verdictAwaitsSettlement', () => {
  // The CLOSED partition of the verdict set: exactly three verdicts resolve
  // by waiting (checks finishing, a live review run completing, the quiet
  // window elapsing). Everything else needs an operator act or is terminal,
  // so polling on it would burn the budget silently. The `satisfies` record
  // is the compile-time anchor: a verdict state added later fails TYPE-CHECK
  // here until it is deliberately classified (test-review D-1 cure — the
  // earlier includes() form defaulted BOTH sides to false for a new state).
  const CLASSIFICATION = {
    'SETTLE-READY': false,
    'SETTLING-QUIET-WINDOW': true,
    DRAFT: false,
    'WAITING-REVIEW-RUN-LIVE': true,
    'SILENT-WAIT-NO-REVIEWER': false,
    'SILENT-WAIT-RUN-DEAD': false,
    'SILENT-WAIT-RUNS-UNREADABLE': false,
    'CHECKS-RUNNING': true,
    'CHECKS-RED': false,
    'THREADS-OPEN': false,
    'BEHIND-BASE': false,
    'ARMED-BEHIND-RED': false,
    'QUOTA-SKIPPED': false,
    'SETTLED-NO-REVIEW': false,
    // A refused near-miss resolves by an operator act (a re-request), never by time.
    'UNCLASSIFIED-EVIDENCE': false,
    MERGED: false,
    CLOSED: false,
    'CONFLICT-DIRTY': false,
  } satisfies Record<PrVerdict['state'], boolean>;

  it.each(PR_VERDICT_STATES)('classifies %s deliberately', (state) => {
    expect(verdictAwaitsSettlement(state)).toBe(CLASSIFICATION[state]);
  });
});
