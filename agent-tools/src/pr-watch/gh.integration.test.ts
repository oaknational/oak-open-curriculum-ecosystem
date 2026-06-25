import { describe, expect, it, vi } from 'vitest';

import { readPrSnapshot, type GhCommandExecutor } from './gh.js';

const prViewOut = JSON.stringify({
  number: 221,
  state: 'OPEN',
  mergeable: 'MERGEABLE',
  mergeStateStatus: 'CLEAN',
  reviewDecision: 'APPROVED',
  headRefOid: 'abcdef1234567890',
  statusCheckRollup: [{ __typename: 'CheckRun', status: 'COMPLETED', conclusion: 'SUCCESS' }],
  comments: [{ id: 'IC_1', author: { login: 'vercel' } }],
});
const reviewOut = JSON.stringify([{ id: 9, user: { login: 'Copilot' } }]);

function fakeExec() {
  return vi.fn((...call: Parameters<GhCommandExecutor>) =>
    call[1][0] === 'api' ? reviewOut : prViewOut,
  );
}

describe('readPrSnapshot', () => {
  it('assembles a snapshot from the two gh surfaces', () => {
    const snapshot = readPrSnapshot({
      target: { number: 221 },
      ghPath: '/custom/bin/gh',
      exists: () => true,
      execFileSync: fakeExec(),
    });
    expect(snapshot.state).toBe('OPEN');
    expect(snapshot.checks).toStrictEqual({ total: 1, passed: 1, failed: 0, pending: 0 });
    expect(snapshot.issueComments).toStrictEqual([{ id: 'IC_1', author: 'vercel' }]);
    expect(snapshot.reviewComments).toStrictEqual([{ id: '9', author: 'Copilot' }]);
  });

  it('uses the {owner}/{repo} placeholder for gh api when no repo is given', () => {
    const exec = fakeExec();
    readPrSnapshot({
      target: { number: 221 },
      ghPath: '/x/gh',
      exists: () => true,
      execFileSync: exec,
    });
    const apiCall = exec.mock.calls.find((call) => call[1][0] === 'api');
    expect(apiCall?.[1]).toStrictEqual([
      'api',
      'repos/{owner}/{repo}/pulls/221/comments',
      '--paginate',
    ]);
  });

  it('passes an explicit repo to both gh surfaces', () => {
    const exec = fakeExec();
    readPrSnapshot({
      target: { number: 221, repo: 'o/r' },
      ghPath: '/x/gh',
      exists: () => true,
      execFileSync: exec,
    });
    const calls = exec.mock.calls;
    const prView = calls.find((call) => call[1][0] === 'pr');
    const api = calls.find((call) => call[1][0] === 'api');
    expect(prView?.[1]).toContain('--repo');
    expect(prView?.[1]).toContain('o/r');
    expect(api?.[1][1]).toBe('repos/o/r/pulls/221/comments');
  });

  it('attributes a non-JSON gh response instead of surfacing a raw SyntaxError', () => {
    const exec = vi.fn(() => 'gh: not authenticated\n');
    expect(() =>
      readPrSnapshot({
        target: { number: 221 },
        ghPath: '/x/gh',
        exists: () => true,
        execFileSync: exec,
      }),
    ).toThrow(/non-JSON output/u);
  });
});
