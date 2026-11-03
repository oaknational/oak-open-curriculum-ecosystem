import { describe, expect, it } from 'vitest';

import { textHasher } from './content-fixture.js';
import { graphqlPayload, HEAD, PR_URL, viewPayload } from './test-helpers/state-gh-payloads.js';
import { readPrStateReading } from './state-gh.js';
import type { GhCommandExecutor } from './gh.js';

/**
 * IO-composition tests for `readPrStateReading` with an injected executor —
 * no real gh. The executor dispatches on argv shape, mirroring the surfaces
 * verified live 2026-07-21.
 */

interface ExecutorScript {
  readonly agentTaskList?: string | Error;
  readonly agentTaskViews?: Readonly<Record<string, string>>;
}

function viewsOf(entries: readonly (readonly [string, string])[]): Record<string, string> {
  const views: Record<string, string> = {};
  for (const [id, view] of entries) {
    views[id] = view;
  }
  return views;
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
    const query = args.find((arg) => arg.startsWith('query='));
    if (args[0] === 'api' && query !== undefined) {
      return graphqlPayload(query);
    }
    if (args[0] === 'agent-task') {
      return agentTaskResponse(script, args);
    }
    throw new Error(`unexpected gh argv: ${args.join(' ')}`);
  };
}

const ghSeam = { ghPath: '/usr/bin/gh', exists: () => true, patchIdOf: textHasher };

describe('readPrStateReading', () => {
  it('composes view, threads, the full reviews harvest, and PR-scoped runs into one reading', () => {
    const calls: string[][] = [];
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
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
            'done-1': JSON.stringify({
              id: 'done-1',
              completedAt: 't2',
              pullRequestNumber: 999,
              pullRequestUrl: PR_URL.replace('/pull/461', '/pull/999'),
            }),
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
      ...ghSeam,
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

  it('a PR-less run (null PR fields, the live shape) in the window never voids the leg', () => {
    // 2026-09-09: one run with no pull request anywhere in the window blinded
    // the liveness read for EVERY PR — the view schema rejected the explicit
    // nulls and the whole leg degraded to unavailable.
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: makeExecutor(
        {
          agentTaskList: JSON.stringify([
            { id: 'no-pr', name: 'Task from @x', createdAt: 't0', completedAt: 't1' },
            { id: 'live-1', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
          ]),
          agentTaskViews: {
            'no-pr': JSON.stringify({
              id: 'no-pr',
              completedAt: 't1',
              pullRequestNumber: null,
              pullRequestUrl: null,
            }),
            'live-1': JSON.stringify({
              id: 'live-1',
              completedAt: null,
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
        { id: 'live-1', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
      ],
    });
  });

  it('a LIVE run whose view carries neither PR key is unobserved, never read as unrelated', () => {
    // If a build of gh ever omitted the pair instead of sending nulls, a
    // live run for THIS PR would otherwise collapse to "no mapping" and the
    // leg would assert deadness for a reviewer whose run is live — the same
    // class as the null-field defect, in the unsafe direction.
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: makeExecutor(
        {
          agentTaskList: JSON.stringify([
            { id: 'keyless', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
          ]),
          agentTaskViews: {
            keyless: JSON.stringify({ id: 'keyless', completedAt: null }),
          },
        },
        [],
      ),
    });
    expect(reading.reviewRuns).toEqual({
      kind: 'read',
      runs: [],
      truncated: true,
      note: 'agent-task view unreadable for keyless — those runs unobserved (first: Invalid input: expected number, received undefined at pullRequestNumber)',
    });
  });

  it('a run whose view cannot be read is skipped, marked unobserved, and never voids the leg', () => {
    // A single misshapen or failing view is that run's problem: the other
    // runs still map, and the leg reports the gap as truncation (absence
    // conclusions unsupported) rather than as a whole-surface failure.
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: makeExecutor(
        {
          agentTaskList: JSON.stringify([
            { id: 'broken', name: 'Task from @x', createdAt: 't0', completedAt: null },
            { id: 'live-1', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
          ]),
          agentTaskViews: {
            broken: JSON.stringify({ id: 'broken', completedAt: null, pullRequestNumber: 'x' }),
            'live-1': JSON.stringify({
              id: 'live-1',
              completedAt: null,
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
        { id: 'live-1', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
      ],
      truncated: true,
      note: 'agent-task view unreadable for broken — those runs unobserved (first: Invalid input: expected number, received string at pullRequestNumber)',
    });
  });

  it("a view whose read itself fails (gh error) is that run's gap, with the cause on the note", () => {
    // The executor throwing on ONE view (a token expiring mid-read, a vendor
    // 5xx) is the same gap class as a misshapen view: the run is unobserved,
    // the others still map, and the leg keeps the cause where the whole-leg
    // `unavailable` reason used to carry it.
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: makeExecutor(
        {
          agentTaskList: JSON.stringify([
            { id: 'gone', name: 'Task from @x', createdAt: 't0', completedAt: null },
            { id: 'live-1', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
          ]),
          agentTaskViews: {
            'live-1': JSON.stringify({
              id: 'live-1',
              completedAt: null,
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
        { id: 'live-1', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
      ],
      truncated: true,
      note: 'agent-task view unreadable for gone — those runs unobserved (first: unexpected agent-task view gone)',
    });
  });

  it('a LIVE run with a partial mapping (number, no URL) withholds deadness, never reads unrelated', () => {
    // The vendor pairs the fields; a half-mapped live view is an unknown
    // shape, so the run is unobserved (truncated) rather than counted as an
    // observed run for another PR — the latter would let an outstanding
    // request read run-dead.
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: makeExecutor(
        {
          agentTaskList: JSON.stringify([
            { id: 'half', name: 'Review from @jimCresswell', createdAt: 't', completedAt: null },
          ]),
          agentTaskViews: {
            half: JSON.stringify({ id: 'half', completedAt: null, pullRequestNumber: 461 }),
          },
        },
        [],
      ),
    });
    expect(reading.reviewRuns).toEqual({
      kind: 'read',
      runs: [],
      truncated: true,
      note: 'agent-task view unreadable for half — those runs unobserved (first: Invalid input: expected string, received undefined at pullRequestUrl)',
    });
  });

  it('bounds the evidence line: three unreadable ids named, the rest counted, the first cause kept', () => {
    // Four live runs with no readable view: the note names the first three,
    // counts the fourth, and keeps the first failure's cause; all four are
    // live, so the leg is truncated.
    const live = ['u-1', 'u-2', 'u-3', 'u-4'].map((id) => ({
      id,
      name: 'Task from @x',
      createdAt: 't',
      completedAt: null,
    }));
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: makeExecutor({ agentTaskList: JSON.stringify(live), agentTaskViews: {} }, []),
    });
    expect(reading.reviewRuns).toEqual({
      kind: 'read',
      runs: [],
      truncated: true,
      note: 'agent-task view unreadable for u-1, u-2, u-3 +1 more — those runs unobserved (first: unexpected agent-task view u-1)',
    });
  });

  it('an unreadable COMPLETED run is named on the note but never withholds deadness', () => {
    // The list already says the run finished, so its view gap cannot hide a
    // live run: no `truncated`, the note still names the gap and its cause.
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: makeExecutor(
        {
          agentTaskList: JSON.stringify([
            { id: 'old', name: 'Task from @x', createdAt: 't0', completedAt: 't1' },
          ]),
          agentTaskViews: {},
        },
        [],
      ),
    });
    expect(reading.reviewRuns).toEqual({
      kind: 'read',
      runs: [],
      note: 'agent-task view unreadable for old — those runs unobserved (first: unexpected agent-task view old)',
    });
  });

  it('a full list window AND an unreadable view report both gaps on one note', () => {
    // Two gap classes at once: the list filled its window (older runs
    // unobserved) and one of the five mapped completed runs has no readable
    // view. The evidence line must name both, in this order.
    const listed = Array.from({ length: 100 }, (_, index) => ({
      id: `done-${index}`,
      name: 'Review from @jimCresswell',
      createdAt: `2026-09-09T00:${String(99 - index).padStart(2, '0')}:00Z`,
      completedAt: 'done',
    }));
    const views = viewsOf(
      listed
        .slice(0, 5)
        .filter((run) => run.id !== 'done-2')
        .map((run) => [
          run.id,
          JSON.stringify({
            id: run.id,
            completedAt: 'done',
            pullRequestNumber: 461,
            pullRequestUrl: PR_URL,
          }),
        ]),
    );
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: makeExecutor(
        { agentTaskList: JSON.stringify(listed), agentTaskViews: views },
        [],
      ),
    });
    expect(reading.reviewRuns).toEqual({
      kind: 'read',
      runs: [0, 1, 3, 4].map((index) => ({ ...listed[index], completedAt: 'done' })),
      truncated: true,
      note: 'agent-task list truncated at 100 — older runs unobserved; agent-task view unreadable for done-2 — those runs unobserved (first: unexpected agent-task view done-2)',
    });
  });

  it('uses the fresher view completedAt: a run finishing between list and view is not live', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
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
      ...ghSeam,
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
      ...ghSeam,
      expectedReviewers: ['copilot-pull-request-reviewer'],
      execFileSync: makeExecutor({}, []),
    });
    expect(reading.expectedDeclared).toBe(true);
    expect(reading.expectedReviewers).toEqual(['copilot-pull-request-reviewer']);
  });

  it('a set declared EMPTY (--expect none) is declared, never defaulted from the observed surface', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      expectedReviewers: [],
      execFileSync: makeExecutor({}, []),
    });
    expect(reading.expectedDeclared).toBe(true);
    expect(reading.expectedReviewers).toEqual([]);
  });

  it('degrades the runs leg to a typed unavailable when gh agent-task fails', () => {
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
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
    // Paired views (the vendor's shape): the first three map to THIS PR, the
    // rest to another PR in the same repository.
    const views = viewsOf(
      completed.map((run, index) => [
        run.id,
        JSON.stringify({
          id: run.id,
          completedAt: 't2',
          pullRequestNumber: index < 3 ? 461 : 1,
          pullRequestUrl: index < 3 ? PR_URL : PR_URL.replace('/pull/461', '/pull/1'),
        }),
      ]),
    );
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: makeExecutor(
        { agentTaskList: JSON.stringify(completed), agentTaskViews: views },
        calls,
      ),
    });
    const viewCalls = calls.filter((args) => args[0] === 'agent-task' && args[1] === 'view');
    expect(viewCalls).toHaveLength(5);
    // Of the five views read, the three for this PR map; nothing is unobserved.
    expect(reading.reviewRuns).toEqual({
      kind: 'read',
      runs: completed.slice(0, 3),
    });
    // The view leg must name its fields: bare --json is a usage error on this
    // vendor surface (caught live, 2026-07-21).
    expect(viewCalls[0]).toContain('id,completedAt,pullRequestNumber,pullRequestUrl');
    // The list leg requests the full supported window (vendor default is 30).
    const listCall = calls.find((args) => args[0] === 'agent-task' && args[1] === 'list');
    expect(listCall).toContain('--limit');
    expect(listCall).toContain('100');
  });

  it('fails loud on mergeable UNKNOWN (never settles over uncomputed conflicts)', () => {
    const unknownView = viewPayload(HEAD, {
      mergeable: 'UNKNOWN',
      mergeStateStatus: 'UNKNOWN',
      statusCheckRollup: [],
      reviewRequests: [],
    });
    const calls: string[][] = [];
    expect(() =>
      readPrStateReading({
        target: { number: 461 },
        ...ghSeam,
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
    const mergedView = viewPayload(HEAD, {
      state: 'MERGED',
      mergeable: 'UNKNOWN',
      mergeStateStatus: 'UNKNOWN',
      statusCheckRollup: [],
      reviewRequests: [],
    });
    const reading = readPrStateReading({
      target: { number: 461 },
      ...ghSeam,
      execFileSync: (_file, args) => {
        if (args[0] === 'pr') {
          return mergedView;
        }
        const query = args.find((arg) => arg.startsWith('query='));
        if (args[0] === 'api' && query !== undefined) {
          return graphqlPayload(query);
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
      ...ghSeam,
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
      const query = args.find((arg) => arg.startsWith('query='));
      if (args[0] === 'api' && query !== undefined) {
        return graphqlPayload(query);
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
      ...ghSeam,
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
        ...ghSeam,
        execFileSync: movingTipExecutor([HEAD, NEW_HEAD, 'd'.repeat(40)], calls),
      }),
    ).toThrow(/head moved during the compound read/);
  });
});
