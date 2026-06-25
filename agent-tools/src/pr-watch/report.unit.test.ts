import { describe, expect, it } from 'vitest';

import type { PrSnapshot } from './index.js';
import { diffSnapshots, formatSnapshot, isTerminalState } from './report.js';

function makeSnapshot(overrides: Partial<PrSnapshot> = {}): PrSnapshot {
  return {
    number: 221,
    state: 'OPEN',
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'CLEAN',
    reviewDecision: '',
    headRefOid: '20d61cb74d4c9cffdcd536d11992be960756f800',
    checks: { total: 4, passed: 2, failed: 1, pending: 1 },
    reviewComments: [{ id: '3465383611', author: 'Copilot' }],
    issueComments: [{ id: 'IC_kwDO1', author: 'vercel' }],
    ...overrides,
  };
}

describe('formatSnapshot', () => {
  it('renders a single line with state, mergeability, review, checks, comment counts, and short head sha', () => {
    expect(formatSnapshot(makeSnapshot())).toBe(
      'PR #221 OPEN · merge=MERGEABLE/CLEAN · review=(none) · checks 2✓ 1✗ 1⋯ · comments 1r/1i · head 20d61cb7',
    );
  });
});

describe('diffSnapshots', () => {
  it('returns no lines when the snapshots are identical', () => {
    expect(diffSnapshots(makeSnapshot(), makeSnapshot())).toStrictEqual([]);
  });

  it('reports each changed state field as its own line, in field order', () => {
    const next = makeSnapshot({ mergeStateStatus: 'BLOCKED', reviewDecision: 'APPROVED' });
    expect(diffSnapshots(makeSnapshot(), next)).toStrictEqual([
      'mergeStateStatus: CLEAN → BLOCKED',
      'review: (none) → APPROVED',
    ]);
  });

  it('emits a head change (force-push) comparing full shas but displaying the short form', () => {
    const next = makeSnapshot({ headRefOid: 'abcdef0123456789abcdef0123456789abcdef01' });
    expect(diffSnapshots(makeSnapshot(), next)).toStrictEqual(['head: 20d61cb7 → abcdef01']);
  });

  it('emits a line naming the author of a NEW review comment (the bot-finding signal)', () => {
    const next = makeSnapshot({
      reviewComments: [
        { id: '3465383611', author: 'Copilot' },
        { id: '999', author: 'bugbot' },
      ],
    });
    expect(diffSnapshots(makeSnapshot(), next)).toStrictEqual(['new review comment from bugbot']);
  });

  it('emits a line for a new issue comment', () => {
    const next = makeSnapshot({
      issueComments: [
        { id: 'IC_kwDO1', author: 'vercel' },
        { id: 'IC_2', author: 'octocat' },
      ],
    });
    expect(diffSnapshots(makeSnapshot(), next)).toStrictEqual(['new issue comment from octocat']);
  });
});

describe('isTerminalState', () => {
  it('is true once the PR is merged or closed', () => {
    expect(isTerminalState(makeSnapshot({ state: 'MERGED' }))).toBe(true);
    expect(isTerminalState(makeSnapshot({ state: 'CLOSED' }))).toBe(true);
  });

  it('is false while the PR is open', () => {
    expect(isTerminalState(makeSnapshot())).toBe(false);
  });
});
