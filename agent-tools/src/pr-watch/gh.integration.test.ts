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
// A slurped single-page reviewThreads response (`gh api graphql --paginate --slurp`).
const threadsOut = JSON.stringify([
  {
    data: {
      repository: {
        pullRequest: {
          reviewThreads: {
            totalCount: 1,
            pageInfo: { hasNextPage: false, endCursor: null },
            nodes: [{ isResolved: false }],
          },
        },
      },
    },
  },
]);

const isGraphql = (args: readonly string[]) => args[0] === 'api' && args[1] === 'graphql';
const isRestComments = (args: readonly string[]) =>
  args[0] === 'api' && (args[1]?.startsWith('repos/') ?? false);

function fakeExec() {
  return vi.fn((...call: Parameters<GhCommandExecutor>) => {
    if (isGraphql(call[1])) {
      return threadsOut;
    }
    return isRestComments(call[1]) ? reviewOut : prViewOut;
  });
}

describe('readPrSnapshot', () => {
  it('assembles a snapshot from the three gh surfaces', () => {
    const snapshot = readPrSnapshot({
      target: { number: 221 },
      execFileSync: fakeExec(),
    });
    expect(snapshot.state).toBe('OPEN');
    expect(snapshot.checks).toStrictEqual({ total: 1, passed: 1, failed: 0, pending: 0 });
    expect(snapshot.issueComments).toStrictEqual([{ id: 'IC_1', author: 'vercel' }]);
    expect(snapshot.reviewComments).toStrictEqual([{ id: '9', author: 'Copilot' }]);
    expect(snapshot.reviewThreads).toStrictEqual({ total: 1, unresolved: 1 });
  });

  it('uses the {owner}/{repo} placeholder for gh api when no repo is given', () => {
    const exec = fakeExec();
    readPrSnapshot({
      target: { number: 221 },
      execFileSync: exec,
    });
    const apiCall = exec.mock.calls.find((call) => isRestComments(call[1]));
    expect(apiCall?.[1]).toStrictEqual([
      'api',
      'repos/{owner}/{repo}/pulls/221/comments',
      '--paginate',
    ]);
  });

  it('lets gh page the reviewThreads query itself: one slurped invocation with placeholder variables', () => {
    const exec = fakeExec();
    readPrSnapshot({
      target: { number: 221 },
      execFileSync: exec,
    });
    const graphqlCalls = exec.mock.calls.filter((call) => isGraphql(call[1]));
    expect(graphqlCalls).toHaveLength(1);
    const args = graphqlCalls[0]?.[1] ?? [];
    expect(args).toContain('--paginate');
    expect(args).toContain('--slurp');
    expect(args).toContain('owner={owner}');
    expect(args).toContain('name={repo}');
    expect(args).toContain('number=221');
    // The cursor mechanics live in the query document — without these gh cannot page.
    const query = args.find((arg) => arg.startsWith('query='));
    expect(query).toContain('$endCursor');
    expect(query).toContain('after: $endCursor');
  });

  it('passes an explicit repo to all three gh surfaces', () => {
    const exec = fakeExec();
    readPrSnapshot({
      target: { number: 221, repo: 'o/r' },
      execFileSync: exec,
    });
    const calls = exec.mock.calls;
    const prView = calls.find((call) => call[1][0] === 'pr');
    const api = calls.find((call) => isRestComments(call[1]));
    const graphql = calls.find((call) => isGraphql(call[1]));
    expect(prView?.[1]).toContain('--repo');
    expect(prView?.[1]).toContain('o/r');
    expect(api?.[1][1]).toBe('repos/o/r/pulls/221/comments');
    expect(graphql?.[1]).toContain('owner=o');
    expect(graphql?.[1]).toContain('name=r');
  });

  it('attributes a non-JSON gh response instead of surfacing a raw SyntaxError', () => {
    const exec = vi.fn(() => 'gh: not authenticated\n');
    expect(() =>
      readPrSnapshot({
        target: { number: 221 },
        execFileSync: exec,
      }),
    ).toThrow(/non-JSON output/u);
  });

  it('attributes a non-JSON reviewThreads response to the graphql surface', () => {
    const exec = vi.fn((...call: Parameters<GhCommandExecutor>) => {
      if (isGraphql(call[1])) {
        return 'GraphQL: something went wrong\n';
      }
      return isRestComments(call[1]) ? reviewOut : prViewOut;
    });
    expect(() =>
      readPrSnapshot({
        target: { number: 221 },
        execFileSync: exec,
      }),
    ).toThrow(/reviewThreads.*non-JSON output/u);
  });
});
