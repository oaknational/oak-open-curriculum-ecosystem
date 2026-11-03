import { describe, expect, it } from 'vitest';

import type { GhCommandExecutor } from '../pr-watch/gh.js';
import { readFoldClockReading } from './fold-clock-gh.js';

/**
 * The gh seam over a constant table keyed by the REST path: the argv shapes
 * are the vendor call shapes verified live on pull request 326 (2026-10-10),
 * so a drift in a path or a pagination flag fails here before it fails on a
 * fold. No process is spawned.
 */

const HEAD = '6c340d864683792c36e12fb43f71cddafac58bbb';
const SUCCESSOR = 'fa74b7270000000000000000000000000000abcd';

const pull = {
  created_at: '2026-10-09T13:34:15Z',
  merged_at: '2026-10-10T11:33:09Z',
  head: { sha: HEAD },
  base: { ref: 'main' },
};
const timeline = [
  [
    { event: 'ready_for_review', created_at: '2026-10-10T11:18:20Z' },
    {
      event: 'review_requested',
      created_at: '2026-10-10T11:18:35Z',
      requested_reviewer: { login: 'Copilot', type: 'Bot' },
    },
    {
      event: 'reviewed',
      submitted_at: '2026-10-10T11:22:45Z',
      user: { login: 'Copilot', type: 'Bot' },
    },
  ],
];
const rules = [
  {
    type: 'required_status_checks',
    parameters: { required_status_checks: [{ context: 'CodeQL' }] },
  },
];
const headRuns = [
  {
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
];
const headStatus = {
  state: 'success',
  statuses: [
    {
      context: 'Vercel',
      state: 'success',
      created_at: '2026-10-10T11:29:00Z',
      updated_at: '2026-10-10T11:33:00Z',
    },
  ],
};
const successorRuns = [
  {
    check_runs: [
      {
        name: 'install',
        status: 'in_progress',
        conclusion: null,
        started_at: '2026-10-10T11:38:00Z',
        completed_at: null,
      },
    ],
  },
];

const CHECK_RUNS_ARGS = (repo: string, sha: string): readonly string[] => [
  'api',
  '--paginate',
  '--slurp',
  `repos/${repo}/commits/${sha}/check-runs?per_page=100&filter=all`,
];

/** An executor answering by the path argument, recording every argv. */
function fakeGh(answers: Readonly<Record<string, unknown>>): {
  exec: GhCommandExecutor;
  calls: (readonly string[])[];
} {
  const calls: (readonly string[])[] = [];
  const exec: GhCommandExecutor = (_file, args) => {
    calls.push(args);
    const path = args.find((arg) => arg.startsWith('repos/')) ?? '';
    const answer = answers[path];
    if (answer === undefined) {
      throw new Error(`unexpected gh path: ${path}`);
    }
    return typeof answer === 'string' ? answer : JSON.stringify(answer);
  };
  return { exec, calls };
}

const answers = {
  'repos/acme/widgets/pulls/326': pull,
  'repos/acme/widgets/issues/326/timeline?per_page=100': timeline,
  'repos/acme/widgets/rules/branches/main?per_page=100': [rules],
  [`repos/acme/widgets/commits/${HEAD}/check-runs?per_page=100&filter=all`]: headRuns,
  [`repos/acme/widgets/commits/${HEAD}/status?per_page=100`]: [headStatus],
  [`repos/acme/widgets/commits/${SUCCESSOR}/check-runs?per_page=100&filter=all`]: successorRuns,
};

const target = { number: 326, repo: 'acme/widgets' };

describe('readFoldClockReading', () => {
  it('reads the five surfaces with the pinned argv shapes and assembles the reading', () => {
    const { exec, calls } = fakeGh(answers);

    const reading = readFoldClockReading({
      target,
      ghPath: '/custom/bin/gh',
      exists: () => true,
      execFileSync: exec,
    });

    expect(reading.ok).toBe(true);
    if (reading.ok) {
      expect(reading.value.headSha).toBe(HEAD);
      expect(reading.value.readyMarks).toStrictEqual(['2026-10-10T11:18:20Z']);
      expect(reading.value.requests).toStrictEqual([
        { at: '2026-10-10T11:18:35Z', login: 'Copilot' },
      ]);
      expect(reading.value.requiredChecks).toStrictEqual(['CodeQL']);
      expect(reading.value.headCheckRuns.map((run) => run.name)).toStrictEqual([
        'CodeQL',
        'Vercel',
      ]);
      expect(reading.value.successor).toBeUndefined();
    }
    expect(calls).toStrictEqual([
      ['api', 'repos/acme/widgets/pulls/326'],
      ['api', '--paginate', '--slurp', 'repos/acme/widgets/issues/326/timeline?per_page=100'],
      ['api', '--paginate', '--slurp', 'repos/acme/widgets/rules/branches/main?per_page=100'],
      CHECK_RUNS_ARGS('acme/widgets', HEAD),
      ['api', '--paginate', '--slurp', `repos/acme/widgets/commits/${HEAD}/status?per_page=100`],
    ]);
  });

  it('reads the successor tip as a sixth surface when one is named', () => {
    const { exec, calls } = fakeGh(answers);

    const reading = readFoldClockReading({
      target,
      successorSha: SUCCESSOR,
      exists: () => true,
      execFileSync: exec,
    });

    expect(reading.ok && reading.value.successor?.sha).toBe(SUCCESSOR);
    expect(reading.ok && reading.value.successor?.checkRuns).toHaveLength(1);
    expect(calls).toHaveLength(6);
    expect(calls[5]).toStrictEqual(CHECK_RUNS_ARGS('acme/widgets', SUCCESSOR));
  });

  it('refuses a successor that is not a commit sha before any path carries it', () => {
    const { exec, calls } = fakeGh(answers);

    const reading = readFoldClockReading({
      target,
      successorSha: 'coordination/x',
      exists: () => true,
      execFileSync: exec,
    });

    expect(reading.ok).toBe(false);
    if (!reading.ok) {
      expect(reading.error.message).toContain('not a commit sha');
    }
    expect(calls).toHaveLength(5);
  });

  it('lets gh infer the repository through its placeholder when the target names none', () => {
    const { exec, calls } = fakeGh({
      'repos/{owner}/{repo}/pulls/7': pull,
      'repos/{owner}/{repo}/issues/7/timeline?per_page=100': [[]],
      'repos/{owner}/{repo}/rules/branches/main?per_page=100': [[]],
      [`repos/{owner}/{repo}/commits/${HEAD}/check-runs?per_page=100&filter=all`]: [
        { check_runs: [] },
      ],
      [`repos/{owner}/{repo}/commits/${HEAD}/status?per_page=100`]: [
        { state: 'pending', statuses: [] },
      ],
    });

    const reading = readFoldClockReading({
      target: { number: 7 },
      exists: () => true,
      execFileSync: exec,
    });

    expect(reading.ok).toBe(true);
    expect(calls[0]).toStrictEqual(['api', 'repos/{owner}/{repo}/pulls/7']);
  });

  it('names the surface when gh answers with something other than JSON', () => {
    const { exec } = fakeGh({
      ...answers,
      'repos/acme/widgets/rules/branches/main?per_page=100': 'gh: Not Found (HTTP 404)',
    });

    const reading = readFoldClockReading({ target, exists: () => true, execFileSync: exec });

    expect(reading.ok).toBe(false);
    if (!reading.ok) {
      expect(reading.error.message).toContain('branch rules');
    }
  });

  it('names the surface when a body fails its shape', () => {
    const { exec } = fakeGh({
      ...answers,
      'repos/acme/widgets/pulls/326': { ...pull, head: { sha: 'short' } },
    });

    const reading = readFoldClockReading({ target, exists: () => true, execFileSync: exec });

    expect(reading.ok).toBe(false);
    if (!reading.ok) {
      expect(reading.error.message).toContain('fold-clock pull request');
    }
  });

  it('refuses a base ref that is not a branch name before it reaches a path', () => {
    const { exec, calls } = fakeGh({
      ...answers,
      'repos/acme/widgets/pulls/326': { ...pull, base: { ref: '../main' } },
    });

    const reading = readFoldClockReading({ target, exists: () => true, execFileSync: exec });

    expect(reading.ok).toBe(false);
    if (!reading.ok) {
      expect(reading.error.message).toContain('not a branch name');
    }
    expect(calls).toHaveLength(1);
  });

  it('fails loudly when gh cannot be found', () => {
    const { exec, calls } = fakeGh(answers);

    const reading = readFoldClockReading({ target, exists: () => false, execFileSync: exec });

    expect(reading.ok).toBe(false);
    if (!reading.ok) {
      expect(reading.error.message).toContain('gh CLI not found');
    }
    expect(calls).toHaveLength(0);
  });
});
