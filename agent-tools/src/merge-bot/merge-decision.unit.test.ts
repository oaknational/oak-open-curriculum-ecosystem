import { describe, expect, it } from 'vitest';

import { PR_VERDICT_STATES, type PrVerdict } from '../pr-watch/state-types.js';
import {
  decideMergeAction,
  RECORDS_CLASS_MERGE_STATES,
  verdictAwaitsSettlement,
  verdictMergesRecordsClass,
} from './merge-decision.js';

describe('the records class at the door', () => {
  const owedLeg: PrVerdict = {
    state: 'SILENT-WAIT-NO-REVIEWER',
    evidence: ['copilot-pull-request-reviewer: OWED — no review binds the current tip'],
  };
  const records = { kind: 'records', pathCount: 4 } as const;
  const code = { kind: 'code', offenders: ['.claude/settings.json'] } as const;

  it('merges a records-class pull request on every verdict that differs from settled only by the vendor leg', () => {
    for (const state of RECORDS_CLASS_MERGE_STATES) {
      const decision = decideMergeAction({
        verdict: { state, evidence: [] },
        allowMergeCommit: true,
        changeClass: records,
      });
      expect(decision.kind, state).toBe('merge');
    }
  });

  it('names the ground when the class, not the verdict, opened the door, and stays silent on SETTLE-READY', () => {
    const byClass = decideMergeAction({
      verdict: owedLeg,
      allowMergeCommit: true,
      changeClass: records,
    });
    expect(byClass.kind).toBe('merge');
    if (byClass.kind === 'merge') {
      expect(byClass.ground).toContain('records-class (4 changed paths');
      expect(byClass.ground).toContain('SILENT-WAIT-NO-REVIEWER');
      expect(byClass.ground).toContain('harvested after the merge');
    }

    const settled = decideMergeAction({
      verdict: { state: 'SETTLE-READY', evidence: [] },
      allowMergeCommit: true,
      changeClass: records,
    });
    expect(settled).toStrictEqual({ kind: 'merge' });
  });

  it('keeps a code-class pull request at the door on the same verdict and names the code paths', () => {
    const decision = decideMergeAction({
      verdict: owedLeg,
      allowMergeCommit: true,
      changeClass: code,
    });

    expect(decision).toStrictEqual({
      kind: 'refuse',
      reason:
        'verdict SILENT-WAIT-NO-REVIEWER — only SETTLE-READY merges; a records-class pull request would merge here, but the diff is code-class (.claude/settings.json)',
      awaitsSettlement: false,
    });
  });

  it('never lets the records class past a red check, an open thread, unclassified evidence or a draft', () => {
    for (const state of [
      'CHECKS-RED',
      'CHECKS-RUNNING',
      'THREADS-OPEN',
      'UNCLASSIFIED-EVIDENCE',
      'DRAFT',
      'BEHIND-BASE',
      'CONFLICT-DIRTY',
      'ARMED-BEHIND-RED',
      'CLOSED',
    ] as const) {
      const decision = decideMergeAction({
        verdict: { state, evidence: [] },
        allowMergeCommit: true,
        changeClass: records,
      });
      expect(decision, state).toStrictEqual({
        kind: 'refuse',
        reason: `verdict ${state} — only SETTLE-READY merges`,
        // Only running checks resolve by time; every other state here is terminal.
        awaitsSettlement: state === 'CHECKS-RUNNING',
      });
      expect(verdictMergesRecordsClass(state), state).toBe(false);
    }
  });

  it('still refuses disallowed merge commits for the records class', () => {
    expect(
      decideMergeAction({
        verdict: owedLeg,
        allowMergeCommit: false,
        changeClass: records,
      }),
    ).toStrictEqual({
      kind: 'refuse',
      reason:
        'repo settings no longer allow merge commits (allow_merge_commit is false) — the never-squash ruling stands; restore the setting rather than changing method',
      awaitsSettlement: false,
    });
  });
});

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

  it('refuses every non-settled verdict, carrying the verdict state in the reason', () => {
    const nonSettled: PrVerdict = {
      state: 'CHECKS-RED',
      evidence: ['check lint: fail'],
    };

    const decision = decideMergeAction({ ...baseInput, verdict: nonSettled });

    expect(decision.kind).toBe('refuse');
    if (decision.kind === 'refuse') {
      expect(decision.reason).toContain('CHECKS-RED');
    }
  });

  it('refuses an already-merged PR — another actor merging is never this invocation merging', () => {
    const merged: PrVerdict = { state: 'MERGED', evidence: ['PR is merged'] };

    const decision = decideMergeAction({ ...baseInput, verdict: merged });

    expect(decision.kind).toBe('refuse');
    if (decision.kind === 'refuse') {
      expect(decision.reason).toContain('MERGED');
      expect(decision.reason).toContain('another');
    }
  });

  it('refuses when repo settings no longer allow merge commits, never falling back to squash', () => {
    const decision = decideMergeAction({ ...baseInput, allowMergeCommit: false });

    expect(decision.kind).toBe('refuse');
    if (decision.kind === 'refuse') {
      expect(decision.reason).toContain('merge commits');
      expect(decision.reason).not.toContain('squash instead');
    }
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

describe('decideMergeAction — the timeout-skip settled round (security D1)', () => {
  it('refuses SETTLED-NO-REVIEW by name — a round nobody reviewed never merges', () => {
    const decision = decideMergeAction({
      ...baseInput,
      verdict: {
        state: 'SETTLED-NO-REVIEW',
        evidence: ['round settled ONLY by timeout — an expected reviewer never reviewed this tip'],
      },
    });

    expect(decision.kind).toBe('refuse');
    if (decision.kind === 'refuse') {
      expect(decision.reason).toContain('SETTLED-NO-REVIEW');
    }
  });
});

describe('the code-class suffix on an empty change set', () => {
  it('names the absence of any changed path rather than an empty list', () => {
    const decision = decideMergeAction({
      verdict: { state: 'SILENT-WAIT-NO-REVIEWER', evidence: [] },
      allowMergeCommit: true,
      changeClass: { kind: 'code', offenders: [] },
    });

    expect(decision).toStrictEqual({
      kind: 'refuse',
      reason:
        'verdict SILENT-WAIT-NO-REVIEWER — only SETTLE-READY merges; a records-class pull request would merge here, but the diff is code-class (no changed path)',
      awaitsSettlement: false,
    });
  });
});
