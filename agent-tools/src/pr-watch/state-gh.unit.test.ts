import { describe, expect, it } from 'vitest';

import { readPrStateReading } from './state-gh.js';
import type { GhCommandExecutor } from './gh.js';

/**
 * IO-composition tests for `readPrStateReading` with an injected executor —
 * no real gh. The executor dispatches on argv shape, mirroring the surfaces
 * verified live 2026-07-21.
 */

const HEAD = 'f'.repeat(40);
const PR_URL = 'https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/461';

function viewPayload(oid: string = HEAD): string {
  return JSON.stringify({
    number: 461,
    url: PR_URL,
    state: 'OPEN',
    isDraft: false,
    mergeable: 'MERGEABLE',
    mergeStateStatus: 'BLOCKED',
    headRefOid: oid,
    statusCheckRollup: [
      {
        __typename: 'CheckRun',
        name: 'secret-scan',
        status: 'COMPLETED',
        conclusion: 'SUCCESS',
        completedAt: '2026-07-21T10:33:35Z',
      },
    ],
    autoMergeRequest: null,
    reviewRequests: [{ __typename: 'User', login: 'jimCresswell' }],
  });
}

function threadsPayload(): string {
  return JSON.stringify([
    {
      data: {
        repository: {
          pullRequest: {
            reviewThreads: { totalCount: 2, nodes: [{ isResolved: true }, { isResolved: true }] },
          },
        },
      },
    },
  ]);
}

function reviewsPayload(): string {
  return JSON.stringify([
    {
      data: {
        repository: {
          pullRequest: {
            reviews: {
              nodes: [
                {
                  author: { login: 'copilot-pull-request-reviewer' },
                  state: 'COMMENTED',
                  body: 'Reviewed.',
                  submittedAt: '2026-07-21T12:00:00Z',
                  commit: { oid: HEAD },
                },
              ],
            },
          },
        },
      },
    },
  ]);
}

interface ExecutorScript {
  readonly agentTaskList?: string | Error;
  readonly agentTaskViews?: Readonly<Record<string, string>>;
}

function agentTaskResponse(script: ExecutorScript, args: readonly string[]): string {
  if (args[1] === 'list') {
    const listResult = script.agentTaskList ?? JSON.stringify([]);
    if (listResult instanceof Error) {
      throw listResult;
    }
    return listResult;
  }
  const id = args[2] ?? '';
  const view = script.agentTaskViews?.[id];
  if (view === undefined) {
    throw new Error(`unexpected agent-task view ${id}`);
  }
  return view;
}

function makeExecutor(script: ExecutorScript, calls: string[][]): GhCommandExecutor {
  return (_file, args) => {
    calls.push([...args]);
    if (args[0] === 'pr') {
      return viewPayload();
    }
    if (args[0] === 'api') {
      // Both GraphQL legs arrive as `api graphql`; dispatch on the query text.
      const query = args.find((arg) => arg.startsWith('query='));
      return query?.includes('reviewThreads') === true ? threadsPayload() : reviewsPayload();
    }
    if (args[0] === 'agent-task') {
      return agentTaskResponse(script, args);
    }
    throw new Error(`unexpected gh argv: ${args.join(' ')}`);
  };
}

describe('readPrStateReading', () => {
  it('composes view, threads, the full reviews harvest, and PR-scoped runs into one reading', () => {
    const calls: string[][] = [];
    const reading = readPrStateReading({
      target: { number: 461 },
      execFileSync: makeExecutor(
        {
          agentTaskList: JSON.stringify([
            { id: 'live-1', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
            { id: 'done-1', name: 'Review from @jimCresswell', createdAt: 't', completedAt: 't2' },
          ]),
          agentTaskViews: {
            'live-1': JSON.stringify({
              id: 'live-1',
              completedAt: null,
              pullRequestNumber: 461,
              pullRequestUrl: PR_URL,
            }),
            'done-1': JSON.stringify({ id: 'done-1', completedAt: 't2', pullRequestNumber: 999 }),
          },
        },
        calls,
      ),
    });
    expect(reading.number).toBe(461);
    expect(reading.checks).toEqual({ total: 1, passed: 1, failed: 0, pending: 0 });
    expect(reading.reviewThreads).toEqual({ total: 2, unresolved: 0 });
    expect(reading.reviews).toHaveLength(1);
    // Only the run mapped to THIS PR survives; the other PR's run is filtered.
    expect(reading.reviewRuns).toEqual({
      kind: 'read',
      runs: [
        { id: 'live-1', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
      ],
    });
  });

  it('a run for the same PR number in ANOTHER repo never backs this PR', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      execFileSync: makeExecutor(
        {
          agentTaskList: JSON.stringify([
            { id: 'foreign', name: 'Review from @x', createdAt: 't', completedAt: null },
          ]),
          agentTaskViews: {
            foreign: JSON.stringify({
              id: 'foreign',
              completedAt: null,
              pullRequestNumber: 461,
              pullRequestUrl: 'https://github.com/oaknational/some-other-repo/pull/461',
            }),
          },
        },
        [],
      ),
    });
    expect(reading.reviewRuns).toEqual({ kind: 'read', runs: [] });
  });

  it('uses the fresher view completedAt: a run finishing between list and view is not live', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      execFileSync: makeExecutor(
        {
          agentTaskList: JSON.stringify([
            { id: 'finishing', name: 'Review from @x', createdAt: 't', completedAt: null },
          ]),
          agentTaskViews: {
            finishing: JSON.stringify({
              id: 'finishing',
              completedAt: '2026-07-21T14:00:00Z',
              pullRequestNumber: 461,
              pullRequestUrl: PR_URL,
            }),
          },
        },
        [],
      ),
    });
    expect(reading.reviewRuns).toEqual({
      kind: 'read',
      runs: [
        {
          id: 'finishing',
          name: 'Review from @x',
          createdAt: 't',
          completedAt: '2026-07-21T14:00:00Z',
        },
      ],
    });
  });

  it('defaults the expected set from the observed surface and marks it undeclared', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      execFileSync: makeExecutor({}, []),
    });
    expect(reading.expectedDeclared).toBe(false);
    expect([...reading.expectedReviewers].sort((a, b) => a.localeCompare(b))).toEqual([
      'copilot-pull-request-reviewer',
      'jimCresswell',
    ]);
  });

  it('a declared expected set wins and marks declared', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      expectedReviewers: ['copilot-pull-request-reviewer'],
      execFileSync: makeExecutor({}, []),
    });
    expect(reading.expectedDeclared).toBe(true);
    expect(reading.expectedReviewers).toEqual(['copilot-pull-request-reviewer']);
  });

  it('degrades the runs leg to a typed unavailable when gh agent-task fails', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      execFileSync: makeExecutor({ agentTaskList: new Error('unknown command "agent-task"') }, []),
    });
    expect(reading.reviewRuns.kind).toBe('unavailable');
    // The other legs still read — a missing preview command never blanks the verdict.
    expect(reading.checks.passed).toBe(1);
  });

  it('bounds run→PR mapping: live runs always mapped, completed capped at five', () => {
    const calls: string[][] = [];
    const completed = Array.from({ length: 9 }, (_, index) => ({
      id: `done-${index}`,
      name: 'Review from @jimCresswell',
      createdAt: 't',
      completedAt: 't2',
    }));
    const views = Object.fromEntries(
      completed.map((run) => [
        run.id,
        JSON.stringify({ id: run.id, completedAt: 't2', pullRequestNumber: 1 }),
      ]),
    );
    readPrStateReading({
      target: { number: 461 },
      execFileSync: makeExecutor(
        { agentTaskList: JSON.stringify(completed), agentTaskViews: views },
        calls,
      ),
    });
    const viewCalls = calls.filter((args) => args[0] === 'agent-task' && args[1] === 'view');
    expect(viewCalls).toHaveLength(5);
    // The view leg must name its fields: bare --json is a usage error on this
    // vendor surface (caught live, 2026-07-21).
    expect(viewCalls[0]).toContain('id,completedAt,pullRequestNumber,pullRequestUrl');
    // The list leg requests the full supported window (vendor default is 30).
    const listCall = calls.find((args) => args[0] === 'agent-task' && args[1] === 'list');
    expect(listCall).toContain('--limit');
    expect(listCall).toContain('100');
  });

  it('fails loud on mergeable UNKNOWN (never settles over uncomputed conflicts)', () => {
    const unknownView = JSON.stringify({
      number: 461,
      url: PR_URL,
      state: 'OPEN',
      isDraft: false,
      mergeable: 'UNKNOWN',
      mergeStateStatus: 'UNKNOWN',
      headRefOid: HEAD,
      statusCheckRollup: [],
      autoMergeRequest: null,
      reviewRequests: [],
    });
    const calls: string[][] = [];
    expect(() =>
      readPrStateReading({
        target: { number: 461 },
        execFileSync: (_file, args) => {
          calls.push([...args]);
          if (args[0] === 'pr') {
            return unknownView;
          }
          throw new Error('should not reach other legs');
        },
      }),
    ).toThrow(/mergeability not yet computed/);
    // No blind immediate retries: mergeability computes over seconds, so the
    // boundary fails loud on the single read.
    expect(calls.filter((args) => args[0] === 'pr')).toHaveLength(1);
  });

  it('a MERGED PR with mergeable UNKNOWN composes terminal-ready — the refusal binds OPEN PRs only (r6 regression)', () => {
    // GitHub stops computing mergeability post-merge/close; refusing there
    // would make the advertised terminal MERGED/CLOSED verdicts unreachable.
    const mergedView = JSON.stringify({
      number: 461,
      url: PR_URL,
      state: 'MERGED',
      isDraft: false,
      mergeable: 'UNKNOWN',
      mergeStateStatus: 'UNKNOWN',
      headRefOid: HEAD,
      statusCheckRollup: [],
      autoMergeRequest: null,
      reviewRequests: [],
    });
    const reading = readPrStateReading({
      target: { number: 461 },
      execFileSync: (_file, args) => {
        if (args[0] === 'pr') {
          return mergedView;
        }
        if (args[0] === 'api') {
          const query = args.find((arg) => arg.startsWith('query='));
          return query?.includes('reviewThreads') === true ? threadsPayload() : reviewsPayload();
        }
        if (args[0] === 'agent-task') {
          return agentTaskResponse({}, args);
        }
        throw new Error(`unexpected gh argv: ${args.join(' ')}`);
      },
    });
    expect(reading.state).toBe('MERGED');
  });

  it('passes --repo through to the pr view leg', () => {
    const calls: string[][] = [];
    readPrStateReading({
      target: { number: 461, repo: 'oaknational/oak-open-curriculum-ecosystem' },
      execFileSync: makeExecutor({}, calls),
    });
    const prView = calls.find((args) => args[0] === 'pr' && args[1] === 'view');
    expect(prView).toContain('--repo');
    expect(prView).toContain('oaknational/oak-open-curriculum-ecosystem');
  });
});

describe('readPrStateReading — tip consistency (r4 regression)', () => {
  const NEW_HEAD = 'e'.repeat(40);

  // Serves one oid per `pr view` call (last oid repeats), so a push landing
  // between the view snapshot and the later legs is reproducible.
  function movingTipExecutor(oids: readonly string[], calls: string[][]): GhCommandExecutor {
    let viewCall = 0;
    return (_file, args) => {
      calls.push([...args]);
      if (args[0] === 'pr') {
        const oid = oids[Math.min(viewCall, oids.length - 1)] ?? HEAD;
        viewCall += 1;
        return viewPayload(oid);
      }
      if (args[0] === 'api') {
        const query = args.find((arg) => arg.startsWith('query='));
        return query?.includes('reviewThreads') === true ? threadsPayload() : reviewsPayload();
      }
      if (args[0] === 'agent-task') {
        return agentTaskResponse({}, args);
      }
      throw new Error(`unexpected gh argv: ${args.join(' ')}`);
    };
  }

  it('one mid-read push retries the legs and binds the reading to the fresh tip', () => {
    const calls: string[][] = [];
    const reading = readPrStateReading({
      target: { number: 461 },
      execFileSync: movingTipExecutor([HEAD, NEW_HEAD, NEW_HEAD], calls),
    });
    expect(reading.headRefOid).toBe(NEW_HEAD);
    // Initial view + first confirm (moved) + second confirm (held still).
    expect(calls.filter((args) => args[0] === 'pr')).toHaveLength(3);
  });

  it('fails loud when the tip moves on consecutive attempts — a reading never spans two tips', () => {
    const calls: string[][] = [];
    expect(() =>
      readPrStateReading({
        target: { number: 461 },
        execFileSync: movingTipExecutor([HEAD, NEW_HEAD, 'd'.repeat(40)], calls),
      }),
    ).toThrow(/head moved during the compound read/);
  });
});
