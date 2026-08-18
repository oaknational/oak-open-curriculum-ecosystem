import { describe, expect, it } from 'vitest';

import { parseStateView } from './state-fields.js';
import { stateViewFixture } from './state-view-fixture.js';

describe('parseStateView: latest run per check name', () => {
  // GitHub evaluates a check BY NAME through its latest run on the head
  // commit; superseded runs stay in the rollup as residue. Worked instance
  // (PR #846, 2026-08-13): a duplicated pull_request delivery left one CI
  // run concurrency-cancelled beside its green twin on the SAME sha, and
  // the undeduped read held CHECKS-RED against a head GitHub itself
  // evaluated as green.
  it('a concurrency-cancelled twin is superseded by the same-named later success', () => {
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'run-quality-gates',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'FAILURE',
          startedAt: '2026-08-13T21:17:17Z',
          completedAt: '2026-08-13T21:17:17Z',
        },
        {
          __typename: 'CheckRun',
          name: 'run-quality-gates',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          startedAt: '2026-08-13T21:22:01Z',
          completedAt: '2026-08-13T21:22:04Z',
        },
        {
          __typename: 'CheckRun',
          name: 'browser-tests',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'CANCELLED',
          startedAt: '2026-08-13T21:17:17Z',
          completedAt: '2026-08-13T21:17:18Z',
        },
        {
          __typename: 'CheckRun',
          name: 'browser-tests',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          startedAt: '2026-08-13T21:18:00Z',
          completedAt: '2026-08-13T21:20:12Z',
        },
      ],
    });
    expect(parsed.namedChecks).toEqual([
      { name: 'run-quality-gates', bucket: 'passed' },
      { name: 'browser-tests', bucket: 'passed' },
    ]);
    expect(parsed.checks).toEqual({ total: 2, passed: 2, failed: 0, pending: 0 });
  });

  it('an anchor tie resolves to the more-blocking item in either array order', () => {
    // gh timestamps are second-granularity; twins can complete in the same
    // second. Array order is not contractual, so a tie must never green.
    const tied = (first: string, second: string): readonly Record<string, unknown>[] => [
      {
        __typename: 'CheckRun',
        name: 'build',
        workflowName: 'CI',
        status: 'COMPLETED',
        conclusion: first,
        completedAt: '2026-08-13T21:17:17Z',
      },
      {
        __typename: 'CheckRun',
        name: 'build',
        workflowName: 'CI',
        status: 'COMPLETED',
        conclusion: second,
        completedAt: '2026-08-13T21:17:17Z',
      },
    ];
    for (const rollup of [tied('SUCCESS', 'FAILURE'), tied('FAILURE', 'SUCCESS')]) {
      const parsed = parseStateView({ ...stateViewFixture(), statusCheckRollup: rollup });
      expect(parsed.namedChecks).toEqual([{ name: 'build', bucket: 'failed' }]);
    }
  });

  it('an undated failure survives a dated success in either array order', () => {
    // Undated does not mean older: when either side has no parseable
    // anchor, recency is unknowable and the more-blocking item stands.
    const dated = {
      __typename: 'CheckRun',
      name: 'unit-tests',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'SUCCESS',
      completedAt: '2026-08-13T21:25:00Z',
    };
    const undated = {
      __typename: 'CheckRun',
      name: 'unit-tests',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'FAILURE',
    };
    for (const rollup of [
      [dated, undated],
      [undated, dated],
    ]) {
      const parsed = parseStateView({ ...stateViewFixture(), statusCheckRollup: rollup });
      expect(parsed.namedChecks).toEqual([{ name: 'unit-tests', bucket: 'failed' }]);
    }
  });

  it('two undated same-named items resolve to the more-blocking one in either order', () => {
    const green = {
      __typename: 'CheckRun',
      name: 'lint',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'SUCCESS',
    };
    const red = {
      __typename: 'CheckRun',
      name: 'lint',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'FAILURE',
    };
    for (const rollup of [
      [green, red],
      [red, green],
    ]) {
      const parsed = parseStateView({ ...stateViewFixture(), statusCheckRollup: rollup });
      expect(parsed.namedChecks).toEqual([{ name: 'lint', bucket: 'failed' }]);
    }
  });

  it('a StatusContext never joins the reduction — a same-named CheckRun cannot displace it', () => {
    // GitHub already collapses commit statuses per context; a CheckRun
    // sharing a status's name is a DIFFERENT check, and both count.
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        { __typename: 'StatusContext', context: 'deploy', state: 'FAILURE' },
        {
          __typename: 'CheckRun',
          name: 'deploy',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          completedAt: '2026-08-13T21:25:00Z',
        },
      ],
    });
    expect(parsed.namedChecks).toEqual([
      { name: 'deploy', bucket: 'failed' },
      { name: 'deploy', bucket: 'passed' },
    ]);
    expect(parsed.checks).toEqual({ total: 2, passed: 1, failed: 1, pending: 0 });
  });

  it('a newer failure listed before its older green twin still reads failed (array order is not recency)', () => {
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'unit-tests',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'FAILURE',
          completedAt: '2026-08-13T21:25:00Z',
        },
        {
          __typename: 'CheckRun',
          name: 'unit-tests',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          completedAt: '2026-08-13T21:17:17Z',
        },
      ],
    });
    expect(parsed.namedChecks).toEqual([{ name: 'unit-tests', bucket: 'failed' }]);
  });

  it('an unparseable timestamp is undated — a garbage-dated failure survives a valid-dated success in either order', () => {
    const garbage = {
      __typename: 'CheckRun',
      name: 'install',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'FAILURE',
      completedAt: 'not-a-timestamp',
    };
    const dated = {
      __typename: 'CheckRun',
      name: 'install',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'SUCCESS',
      completedAt: '2026-08-13T21:25:00Z',
    };
    for (const rollup of [
      [garbage, dated],
      [dated, garbage],
    ]) {
      const parsed = parseStateView({ ...stateViewFixture(), statusCheckRollup: rollup });
      expect(parsed.namedChecks).toEqual([{ name: 'install', bucket: 'failed' }]);
    }
  });

  it('an undated queued re-run outranks its dated green predecessor in either order — no premature settlement', () => {
    const done = {
      __typename: 'CheckRun',
      name: 'build',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'SUCCESS',
      completedAt: '2026-08-13T21:17:17Z',
    };
    const queued = {
      __typename: 'CheckRun',
      name: 'build',
      workflowName: 'CI',
      status: 'QUEUED',
      conclusion: null,
    };
    for (const rollup of [
      [done, queued],
      [queued, done],
    ]) {
      const parsed = parseStateView({ ...stateViewFixture(), statusCheckRollup: rollup });
      expect(parsed.namedChecks).toEqual([{ name: 'build', bucket: 'pending' }]);
    }
  });

  it('the workflow/name key never conflates on concatenation ambiguity', () => {
    // ('CI', 'extra build') and ('CI extra', 'build') concatenate equal
    // under a naive space join; they are different checks and both count.
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'extra build',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'FAILURE',
          completedAt: '2026-08-13T21:17:17Z',
        },
        {
          __typename: 'CheckRun',
          name: 'build',
          workflowName: 'CI extra',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          completedAt: '2026-08-13T21:25:00Z',
        },
      ],
    });
    expect(parsed.checks).toEqual({ total: 2, passed: 1, failed: 1, pending: 0 });
  });

  it('same-named checks from different workflows never conflate', () => {
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'Analyze (python)',
          workflowName: 'CodeQL',
          status: 'COMPLETED',
          conclusion: 'FAILURE',
          completedAt: '2026-08-13T21:17:17Z',
        },
        {
          __typename: 'CheckRun',
          name: 'Analyze (python)',
          workflowName: 'Code Quality',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          completedAt: '2026-08-13T21:25:00Z',
        },
      ],
    });
    expect(parsed.checks).toEqual({ total: 2, passed: 1, failed: 1, pending: 0 });
  });

  it('a newer in-progress re-run supersedes an older completed conclusion', () => {
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'unit-tests',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'FAILURE',
          completedAt: '2026-08-13T21:17:17Z',
        },
        {
          __typename: 'CheckRun',
          name: 'unit-tests',
          workflowName: 'CI',
          status: 'IN_PROGRESS',
          conclusion: null,
          startedAt: '2026-08-13T21:30:00Z',
        },
      ],
    });
    expect(parsed.namedChecks).toEqual([{ name: 'unit-tests', bucket: 'pending' }]);
  });

  it('a newer failure supersedes an older success — the dangerous direction stays red', () => {
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'secret-scan',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          completedAt: '2026-08-13T21:17:17Z',
        },
        {
          __typename: 'CheckRun',
          name: 'secret-scan',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'FAILURE',
          completedAt: '2026-08-13T21:25:00Z',
        },
      ],
    });
    expect(parsed.namedChecks).toEqual([{ name: 'secret-scan', bucket: 'failed' }]);
    expect(parsed.checksGreenAt).toBeNull();
  });

  it('an unanchored item never displaces an anchored incumbent', () => {
    // Conservative: residue is out-ranked only by a DATED successor — an
    // undatable green must not silence a dated failure.
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'static-checks',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'FAILURE',
          completedAt: '2026-08-13T21:17:17Z',
        },
        {
          __typename: 'CheckRun',
          name: 'static-checks',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
        },
      ],
    });
    expect(parsed.namedChecks).toEqual([{ name: 'static-checks', bucket: 'failed' }]);
  });

  it('superseded residue no longer nulls checksGreenAt', () => {
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'build',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'CANCELLED',
          startedAt: '2026-08-13T21:17:17Z',
          completedAt: '2026-08-13T21:17:18Z',
        },
        {
          __typename: 'CheckRun',
          name: 'build',
          workflowName: 'CI',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          startedAt: '2026-08-13T21:18:00Z',
          completedAt: '2026-08-13T21:19:30Z',
        },
      ],
    });
    expect(parsed.checksGreenAt).toBe('2026-08-13T21:19:30Z');
  });

  it('recency is start order: a slow-to-cancel old run completing AFTER its fast green twin never wins', () => {
    // Cancellation can lag: the superseded run starts first but completes
    // last. Completion order would resurrect the stuck-red condition.
    const slowCancelled = {
      __typename: 'CheckRun',
      name: 'build',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'CANCELLED',
      startedAt: '2026-08-13T21:00:00Z',
      completedAt: '2026-08-13T21:05:00Z',
    };
    const fastGreen = {
      __typename: 'CheckRun',
      name: 'build',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'SUCCESS',
      startedAt: '2026-08-13T21:01:00Z',
      completedAt: '2026-08-13T21:02:00Z',
    };
    for (const rollup of [
      [slowCancelled, fastGreen],
      [fastGreen, slowCancelled],
    ]) {
      const parsed = parseStateView({ ...stateViewFixture(), statusCheckRollup: rollup });
      expect(parsed.namedChecks).toEqual([{ name: 'build', bucket: 'passed' }]);
    }
  });

  it('the reduction is order-independent: a queued undated re-run blocks settlement in every arrangement', () => {
    // A pairwise fold is not associative: [dated failure, undated queued,
    // dated success] could discard the queued run against the failure and
    // then green on the success — premature settlement by array order.
    const datedFailure = {
      __typename: 'CheckRun',
      name: 'deploy-check',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'FAILURE',
      startedAt: '2026-08-13T10:00:00Z',
    };
    const undatedQueued = {
      __typename: 'CheckRun',
      name: 'deploy-check',
      workflowName: 'CI',
      status: 'QUEUED',
      conclusion: null,
    };
    const datedSuccess = {
      __typename: 'CheckRun',
      name: 'deploy-check',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'SUCCESS',
      startedAt: '2026-08-13T20:00:00Z',
    };
    const arrangements = [
      [datedFailure, undatedQueued, datedSuccess],
      [datedFailure, datedSuccess, undatedQueued],
      [undatedQueued, datedSuccess, datedFailure],
      [datedSuccess, undatedQueued, datedFailure],
    ];
    for (const rollup of arrangements) {
      const parsed = parseStateView({ ...stateViewFixture(), statusCheckRollup: rollup });
      expect(parsed.namedChecks).toEqual([{ name: 'deploy-check', bucket: 'pending' }]);
    }
  });

  it('checks without a workflow identity never reduce — one provider cannot hide another', () => {
    // Non-workflow providers carry no workflowName, and this read has no
    // app identity to namespace them: two apps both emitting "build" must
    // not collapse into one survivor.
    const parsed = parseStateView({
      ...stateViewFixture(),
      statusCheckRollup: [
        {
          __typename: 'CheckRun',
          name: 'build',
          status: 'COMPLETED',
          conclusion: 'FAILURE',
          completedAt: '2026-08-13T21:17:17Z',
        },
        {
          __typename: 'CheckRun',
          name: 'build',
          status: 'COMPLETED',
          conclusion: 'SUCCESS',
          completedAt: '2026-08-13T21:25:00Z',
        },
      ],
    });
    expect(parsed.checks).toEqual({ total: 2, passed: 1, failed: 1, pending: 0 });
  });
});

describe('full-tie survivor: the later completion anchors checksGreenAt', () => {
  // GitHub timestamps are second-granular: two green twins can tie on
  // startedAt AND rank. The survivor's completion feeds checksGreenAt,
  // which waives owed-review quiet windows — an array-order-dependent
  // survivor could report the green moment early and waive prematurely.
  it('two green runs tying on start resolve to the later completion in either order', () => {
    const earlyDone = {
      __typename: 'CheckRun',
      name: 'build',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'SUCCESS',
      startedAt: '2026-08-13T21:17:17Z',
      completedAt: '2026-08-13T21:18:00Z',
    };
    const lateDone = {
      __typename: 'CheckRun',
      name: 'build',
      workflowName: 'CI',
      status: 'COMPLETED',
      conclusion: 'SUCCESS',
      startedAt: '2026-08-13T21:17:17Z',
      completedAt: '2026-08-13T21:26:30Z',
    };
    for (const rollup of [
      [earlyDone, lateDone],
      [lateDone, earlyDone],
    ]) {
      const parsed = parseStateView({ ...stateViewFixture(), statusCheckRollup: rollup });
      expect(parsed.namedChecks).toEqual([{ name: 'build', bucket: 'passed' }]);
      expect(parsed.checksGreenAt).toBe('2026-08-13T21:26:30Z');
    }
  });
});
