import { describe, expect, it } from 'vitest';

import {
  assembleReading,
  parseCheckRuns,
  parseCommitStatus,
  parsePull,
  parseRequiredChecksPages,
  parseTimeline,
} from './fold-clock-reading.js';

/**
 * The read boundary over the shapes the API served for pull request 326 on
 * 2026-10-10, reduced to the fields the clock reads; anything else is
 * refused with the surface named.
 */

const HEAD = '6c340d864683792c36e12fb43f71cddafac58bbb';

describe('parsePull', () => {
  it('reads the opening, the merge, the tip and the base', () => {
    const pull = parsePull({
      created_at: '2026-10-09T13:34:15Z',
      merged_at: '2026-10-10T11:33:09Z',
      head: { sha: HEAD, ref: 'coordination/2026-10-09-213f94' },
      base: { ref: 'main' },
      draft: false,
    });

    expect(pull).toStrictEqual({
      ok: true,
      value: {
        createdAt: '2026-10-09T13:34:15Z',
        mergedAt: '2026-10-10T11:33:09Z',
        headSha: HEAD,
        baseRef: 'main',
      },
    });
  });

  it('reads an open pull request with no merge instant, and refuses an abbreviated tip', () => {
    const open = parsePull({
      created_at: '2026-10-09T13:34:15Z',
      merged_at: null,
      head: { sha: HEAD },
      base: { ref: 'main' },
    });
    const short = parsePull({
      created_at: '2026-10-09T13:34:15Z',
      merged_at: null,
      head: { sha: '6c340d86' },
      base: { ref: 'main' },
    });

    expect(open.ok && open.value.mergedAt).toBeUndefined();
    expect(short.ok).toBe(false);
    if (!short.ok) {
      expect(short.error.message).toContain('fold-clock pull request');
    }
  });
});

describe('parseTimeline', () => {
  it('reads ready-marks, Bot requests and submitted reviews across slurped pages, ignoring the rest', () => {
    const timeline = parseTimeline([
      [
        { event: 'committed', sha: 'abc' },
        {
          event: 'ready_for_review',
          created_at: '2026-10-10T11:18:20Z',
          actor: { login: 'bot[bot]' },
        },
        {
          event: 'review_requested',
          created_at: '2026-10-10T11:18:21Z',
          requested_reviewer: { login: 'jimCresswell', type: 'User' },
        },
        {
          event: 'review_requested',
          created_at: '2026-10-10T11:18:35Z',
          requested_reviewer: { login: 'Copilot', type: 'Bot' },
        },
      ],
      [
        {
          event: 'reviewed',
          submitted_at: '2026-10-10T11:22:45Z',
          user: { login: 'Copilot', type: 'Bot' },
        },
        { event: 'reviewed', submitted_at: null, user: { login: 'Copilot', type: 'Bot' } },
        { event: 'merged', created_at: '2026-10-10T11:33:09Z' },
      ],
    ]);

    expect(timeline).toStrictEqual({
      ok: true,
      value: {
        readyMarks: ['2026-10-10T11:18:20Z'],
        requests: [{ at: '2026-10-10T11:18:35Z', login: 'Copilot' }],
        reviews: [{ at: '2026-10-10T11:22:45Z', login: 'Copilot' }],
      },
    });
  });

  it('refuses a timeline that is not slurped pages', () => {
    const flat = parseTimeline([{ event: 'merged' }]);

    expect(flat.ok).toBe(false);
    if (!flat.ok) {
      expect(flat.error.message).toContain('fold-clock timeline');
    }
  });
});

describe('parseCheckRuns', () => {
  it('reads every page of runs with their nulls as absences', () => {
    const runs = parseCheckRuns([
      {
        total_count: 2,
        check_runs: [
          {
            name: 'CodeQL',
            status: 'completed',
            conclusion: 'success',
            started_at: '2026-10-10T11:29:33Z',
            completed_at: '2026-10-10T11:29:35Z',
          },
        ],
      },
      {
        total_count: 2,
        check_runs: [
          {
            name: 'e2e',
            status: 'in_progress',
            conclusion: null,
            started_at: '2026-10-10T11:29:30Z',
            completed_at: null,
          },
        ],
      },
    ]);

    expect(runs).toStrictEqual({
      ok: true,
      value: [
        {
          name: 'CodeQL',
          conclusion: 'success',
          startedAt: '2026-10-10T11:29:33Z',
          completedAt: '2026-10-10T11:29:35Z',
        },
        {
          name: 'e2e',
          conclusion: undefined,
          startedAt: '2026-10-10T11:29:30Z',
          completedAt: undefined,
        },
      ],
    });
  });

  it('refuses a body that is not slurped pages of check runs', () => {
    expect(parseCheckRuns({ check_runs: [] }).ok).toBe(false);
    expect(parseCheckRuns([{ message: 'Not Found' }]).ok).toBe(false);
  });
});

describe('parseCommitStatus', () => {
  it('reads each context of every page as a run: a terminal state is its conclusion and completion, pending is open', () => {
    const runs = parseCommitStatus([
      {
        state: 'pending',
        sha: HEAD,
        statuses: [
          {
            context: 'Vercel',
            state: 'success',
            created_at: '2026-10-10T11:29:00Z',
            updated_at: '2026-10-10T11:33:00Z',
          },
        ],
      },
      {
        state: 'pending',
        sha: HEAD,
        statuses: [
          {
            context: 'Sonar',
            state: 'pending',
            created_at: '2026-10-10T11:29:10Z',
            updated_at: '2026-10-10T11:29:10Z',
          },
        ],
      },
    ]);

    expect(runs).toStrictEqual({
      ok: true,
      value: [
        {
          name: 'Vercel',
          conclusion: 'success',
          startedAt: '2026-10-10T11:29:00Z',
          completedAt: '2026-10-10T11:33:00Z',
        },
        {
          name: 'Sonar',
          conclusion: undefined,
          startedAt: '2026-10-10T11:29:10Z',
          completedAt: undefined,
        },
      ],
    });
  });

  it('reads a commit with no statuses as no runs, and refuses a body that is not slurped pages', () => {
    expect(parseCommitStatus([{ state: 'pending', statuses: [] }])).toStrictEqual({
      ok: true,
      value: [],
    });
    expect(parseCommitStatus({ state: 'pending', statuses: [] }).ok).toBe(false);
  });
});

describe('parseRequiredChecksPages', () => {
  it('flattens slurped rules pages into the shared parser and refuses a flat list', () => {
    const pages = parseRequiredChecksPages([
      [{ type: 'deletion' }],
      [
        {
          type: 'required_status_checks',
          parameters: { required_status_checks: [{ context: 'CodeQL' }] },
        },
      ],
    ]);

    expect(pages).toStrictEqual({ ok: true, value: ['CodeQL'] });
    expect(parseRequiredChecksPages([{ type: 'deletion' }]).ok).toBe(false);
  });

  it("surfaces the shared parser's refusal of a blocking rule it does not read, so the clock never calls checks green under it", () => {
    const pages = parseRequiredChecksPages([
      [{ type: 'deletion' }],
      [
        {
          type: 'required_deployments',
          parameters: { required_deployment_environments: ['live'] },
        },
      ],
    ]);

    expect(pages.ok).toBe(false);
    if (!pages.ok) {
      expect(pages.error.message).toContain('required_deployments rule at index 1');
    }
  });
});

describe('assembleReading', () => {
  it('carries every validated surface into the one reading', () => {
    const reading = assembleReading({
      prNumber: 326,
      pull: {
        createdAt: '2026-10-09T13:34:15Z',
        mergedAt: undefined,
        headSha: HEAD,
        baseRef: 'main',
      },
      timeline: { readyMarks: [], requests: [], reviews: [] },
      requiredChecks: ['CodeQL'],
      headCheckRuns: [],
      successor: undefined,
    });

    expect(reading).toStrictEqual({
      prNumber: 326,
      headSha: HEAD,
      createdAt: '2026-10-09T13:34:15Z',
      readyMarks: [],
      mergedAt: undefined,
      requests: [],
      reviews: [],
      requiredChecks: ['CodeQL'],
      headCheckRuns: [],
      successor: undefined,
    });
  });
});
