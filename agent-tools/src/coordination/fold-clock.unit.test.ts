import { describe, expect, it } from 'vitest';

import { computeFoldClock, type FoldClockReading } from './fold-clock.js';
import { formatFoldClock } from './fold-clock-format.js';

/**
 * The clock over the instants pull request 326 carried on 2026-10-10 (read
 * from the API that day): ready 11:18:20Z; Copilot requested 11:18:35Z and
 * 11:28:55Z, its reviews 11:22:45Z and 11:32:47Z; the owner's own code-owner
 * request is not a round; the merge bot's disposition reviews pair with
 * nothing; the tip's required checks completed 11:32:30Z and 11:29:35Z while
 * the vendor's own check-run completed later; merged 11:33:09Z.
 */

const HEAD = '6c340d864683792c36e12fb43f71cddafac58bbb';
const SUCCESSOR = 'fa74b7270000000000000000000000000000abcd';

function run(name: string, completedAt: string, conclusion = 'success') {
  return { name, conclusion, startedAt: '2026-10-10T11:28:54Z', completedAt };
}

const fold326: FoldClockReading = {
  prNumber: 326,
  headSha: HEAD,
  createdAt: '2026-10-09T13:34:15Z',
  readyMarks: ['2026-10-10T11:18:20Z'],
  mergedAt: '2026-10-10T11:33:09Z',
  requests: [
    { at: '2026-10-10T11:18:35Z', login: 'Copilot' },
    { at: '2026-10-10T11:28:55Z', login: 'Copilot' },
  ],
  reviews: [
    { at: '2026-10-10T11:22:45Z', login: 'Copilot' },
    { at: '2026-10-10T11:26:50Z', login: 'jimbot-of-the-devonshire-jimbots[bot]' },
    { at: '2026-10-10T11:32:47Z', login: 'Copilot' },
  ],
  requiredChecks: ['run-quality-gates', 'CodeQL'],
  headCheckRuns: [
    run('run-quality-gates', '2026-10-10T11:32:30Z'),
    run('CodeQL', '2026-10-10T11:29:35Z'),
    run('copilot-pull-request-reviewer', '2026-10-10T11:32:46Z'),
    run('Vercel Preview Comments', '2026-10-10T11:30:06Z'),
  ],
  successor: undefined,
};

function clockOf(reading: FoldClockReading) {
  const clock = computeFoldClock(reading);
  if (!clock.ok) {
    throw clock.error;
  }
  return clock.value;
}

describe('computeFoldClock', () => {
  it('measures the fold of 326 from its instants', () => {
    const clock = clockOf(fold326);

    expect(clock.readyAt).toBe('2026-10-10T11:18:20Z');
    expect(clock.checksGreenAt).toBe('2026-10-10T11:32:30Z');
    expect(clock.checksMissing).toStrictEqual([]);
    expect(clock.readyToGreenMinutes).toBe(14.2);
    expect(clock.rounds.map((round) => [round.outcome, round.minutes])).toStrictEqual([
      ['reviewed', 4.2],
      ['reviewed', 3.9],
    ]);
    expect(clock.readyToMergeMinutes).toBe(14.8);
    expect(clock.successorLandedAt).toBeUndefined();
  });

  it('pairs case-insensitively, ignores a review before its request, and leaves a later request in flight', () => {
    const clock = clockOf({
      ...fold326,
      requests: [
        { at: '2026-10-10T11:18:35Z', login: 'copilot' },
        { at: '2026-10-10T11:28:55Z', login: 'Copilot' },
      ],
      reviews: [
        { at: '2026-10-10T11:18:00Z', login: 'Copilot' },
        { at: '2026-10-10T11:22:45Z', login: 'Copilot' },
      ],
    });

    expect(clock.rounds).toStrictEqual([
      {
        login: 'copilot',
        requestedAt: '2026-10-10T11:18:35Z',
        reviewedAt: '2026-10-10T11:22:45Z',
        minutes: 4.2,
        outcome: 'reviewed',
      },
      {
        login: 'Copilot',
        requestedAt: '2026-10-10T11:28:55Z',
        reviewedAt: undefined,
        minutes: undefined,
        outcome: 'in-flight',
      },
    ]);
  });

  it('answers a review with the latest request before it and marks the earlier one superseded', () => {
    const clock = clockOf({
      ...fold326,
      requests: [
        { at: '2026-10-10T11:18:35Z', login: 'Copilot' },
        { at: '2026-10-10T11:20:00Z', login: 'Copilot' },
      ],
      reviews: [{ at: '2026-10-10T11:24:00Z', login: 'Copilot' }],
    });

    expect(clock.rounds.map((round) => [round.outcome, round.minutes])).toStrictEqual([
      ['superseded', undefined],
      ['reviewed', 4],
    ]);
  });

  it('supersedes an open request the moment a newer one arrives, review or no review', () => {
    const noReview = clockOf({
      ...fold326,
      requests: [
        { at: '2026-10-10T11:18:35Z', login: 'Copilot' },
        { at: '2026-10-10T11:28:55Z', login: 'Copilot' },
      ],
      reviews: [],
    });
    const twoReviews = clockOf({
      ...fold326,
      requests: [
        { at: '2026-10-10T11:18:35Z', login: 'Copilot' },
        { at: '2026-10-10T11:20:00Z', login: 'Copilot' },
      ],
      reviews: [
        { at: '2026-10-10T11:24:00Z', login: 'Copilot' },
        { at: '2026-10-10T11:30:00Z', login: 'Copilot' },
      ],
    });

    expect(noReview.rounds.map((round) => round.outcome)).toStrictEqual([
      'superseded',
      'in-flight',
    ]);
    expect(twoReviews.rounds.map((round) => [round.outcome, round.minutes])).toStrictEqual([
      ['superseded', undefined],
      ['reviewed', 4],
    ]);
  });

  it('never answers two requests with one review', () => {
    const clock = clockOf({
      ...fold326,
      requests: [
        { at: '2026-10-10T11:18:35Z', login: 'Copilot' },
        { at: '2026-10-10T11:28:55Z', login: 'Copilot' },
      ],
      reviews: [{ at: '2026-10-10T11:32:47Z', login: 'Copilot' }],
    });

    expect(clock.rounds.filter((round) => round.outcome === 'reviewed')).toHaveLength(1);
    expect(clock.rounds[0]?.outcome).toBe('superseded');
  });

  it('takes the last ready-mark, and the opening when the pull request was never a draft', () => {
    const twice = clockOf({
      ...fold326,
      readyMarks: ['2026-10-10T10:00:00Z', '2026-10-10T11:18:20Z'],
    });
    const never = clockOf({ ...fold326, readyMarks: [] });

    expect(twice.readyAt).toBe('2026-10-10T11:18:20Z');
    expect(never.readyAt).toBe('2026-10-09T13:34:15Z');
  });

  it('names a required context with no passing run and leaves green undefined', () => {
    const clock = clockOf({
      ...fold326,
      headCheckRuns: [
        run('run-quality-gates', '2026-10-10T11:32:30Z'),
        run('CodeQL', '2026-10-10T11:29:35Z', 'failure'),
      ],
    });

    expect(clock.checksGreenAt).toBeUndefined();
    expect(clock.checksMissing).toStrictEqual(['CodeQL']);
    expect(clock.readyToGreenMinutes).toBeUndefined();
  });

  it('judges a context by its LATEST run: an older success never masks a newer failure or rerun', () => {
    const rerunFailed = clockOf({
      ...fold326,
      headCheckRuns: [
        {
          name: 'run-quality-gates',
          conclusion: 'success',
          startedAt: '2026-10-10T11:28:54Z',
          completedAt: '2026-10-10T11:32:30Z',
        },
        {
          name: 'run-quality-gates',
          conclusion: 'failure',
          startedAt: '2026-10-10T11:40:00Z',
          completedAt: '2026-10-10T11:43:00Z',
        },
        run('CodeQL', '2026-10-10T11:29:35Z'),
      ],
    });
    const rerunOpen = clockOf({
      ...fold326,
      headCheckRuns: [
        {
          name: 'run-quality-gates',
          conclusion: 'success',
          startedAt: '2026-10-10T11:28:54Z',
          completedAt: '2026-10-10T11:32:30Z',
        },
        {
          name: 'run-quality-gates',
          conclusion: undefined,
          startedAt: '2026-10-10T11:40:00Z',
          completedAt: undefined,
        },
        run('CodeQL', '2026-10-10T11:29:35Z'),
      ],
    });

    expect(rerunFailed.checksMissing).toStrictEqual(['run-quality-gates']);
    expect(rerunOpen.checksMissing).toStrictEqual(['run-quality-gates']);
  });

  it('holds a context open while a queued run carries no instant yet, whichever order the API lists the runs in', () => {
    const queued = {
      name: 'run-quality-gates',
      conclusion: undefined,
      startedAt: undefined,
      completedAt: undefined,
    };
    const success = run('run-quality-gates', '2026-10-10T11:32:30Z');
    const codeql = run('CodeQL', '2026-10-10T11:29:35Z');

    const queuedListedAfter = clockOf({ ...fold326, headCheckRuns: [success, queued, codeql] });
    const queuedListedBefore = clockOf({ ...fold326, headCheckRuns: [queued, success, codeql] });

    expect(queuedListedAfter.checksMissing).toStrictEqual(['run-quality-gates']);
    expect(queuedListedBefore.checksMissing).toStrictEqual(['run-quality-gates']);
    expect(queuedListedAfter.checksGreenAt).toBeUndefined();
  });

  it('reads a commit status as a run of its context when the rules require it', () => {
    const clock = clockOf({
      ...fold326,
      requiredChecks: ['run-quality-gates', 'Vercel'],
      headCheckRuns: [
        run('run-quality-gates', '2026-10-10T11:32:30Z'),
        {
          name: 'Vercel',
          conclusion: 'success',
          startedAt: '2026-10-10T11:29:00Z',
          completedAt: '2026-10-10T11:33:00Z',
        },
      ],
    });

    expect(clock.checksGreenAt).toBe('2026-10-10T11:33:00Z');
  });

  it("passes the conclusions GitHub's required gate passes: success, neutral, skipped", () => {
    const clock = clockOf({
      ...fold326,
      headCheckRuns: [
        run('run-quality-gates', '2026-10-10T11:32:30Z', 'skipped'),
        run('CodeQL', '2026-10-10T11:29:35Z', 'neutral'),
      ],
    });

    expect(clock.checksGreenAt).toBe('2026-10-10T11:32:30Z');
  });

  it('judges a rerun context by the run that started last, whatever the others concluded', () => {
    const clock = clockOf({
      ...fold326,
      headCheckRuns: [
        {
          name: 'run-quality-gates',
          conclusion: 'failure',
          startedAt: '2026-10-10T11:18:00Z',
          completedAt: '2026-10-10T11:20:00Z',
        },
        {
          name: 'run-quality-gates',
          conclusion: 'success',
          startedAt: '2026-10-10T11:36:00Z',
          completedAt: '2026-10-10T11:40:00Z',
        },
        run('CodeQL', '2026-10-10T11:29:35Z'),
      ],
    });

    expect(clock.checksGreenAt).toBe('2026-10-10T11:40:00Z');
  });

  it('reads the successor as on CI at its earliest check-run start', () => {
    const clock = clockOf({
      ...fold326,
      successor: {
        sha: SUCCESSOR,
        checkRuns: [
          {
            name: 'install',
            conclusion: undefined,
            startedAt: '2026-10-10T11:38:10Z',
            completedAt: undefined,
          },
          {
            name: 'e2e',
            conclusion: undefined,
            startedAt: '2026-10-10T11:38:00Z',
            completedAt: undefined,
          },
        ],
      },
    });

    expect(clock.successorLandedAt).toBe('2026-10-10T11:38:00Z');
    expect(clock.readyToSuccessorMinutes).toBe(19.7);
  });

  it('refuses a ready instant that is not a date', () => {
    const clock = computeFoldClock({ ...fold326, readyMarks: ['yesterday'] });

    expect(clock.ok).toBe(false);
    if (!clock.ok) {
      expect(clock.error.message).toContain("'yesterday'");
    }
  });
});

describe('formatFoldClock', () => {
  it('prints the fold of 326 as one line', () => {
    expect(formatFoldClock(clockOf(fold326))).toBe(
      'fold-clock PR 326 tip 6c340d86: ready 2026-10-10T11:18:20Z; checks green +14.2 min; ' +
        'rounds 2 (Copilot 4.2 min, Copilot 3.9 min); merged +14.8 min',
    );
  });

  it('names a round in flight, a superseded request, missing checks, an unmerged pull request and a successor not yet on CI', () => {
    const clock = clockOf({
      ...fold326,
      mergedAt: undefined,
      requests: [
        { at: '2026-10-10T11:18:35Z', login: 'Copilot' },
        { at: '2026-10-10T11:20:00Z', login: 'Copilot' },
        { at: '2026-10-10T11:28:55Z', login: 'Copilot' },
      ],
      reviews: [{ at: '2026-10-10T11:24:00Z', login: 'Copilot' }],
      headCheckRuns: [run('CodeQL', '2026-10-10T11:29:35Z')],
      successor: { sha: SUCCESSOR, checkRuns: [] },
    });

    expect(formatFoldClock(clock)).toBe(
      'fold-clock PR 326 tip 6c340d86: ready 2026-10-10T11:18:20Z; checks not green (run-quality-gates); ' +
        'rounds 3 (Copilot request at 2026-10-10T11:18:35Z superseded, Copilot 4.0 min, ' +
        'Copilot in flight since 2026-10-10T11:28:55Z); not merged; successor fa74b727 not yet on CI',
    );
  });

  it('says so when the base requires no checks, and signs a green that preceded the ready-mark', () => {
    const none = clockOf({ ...fold326, requiredChecks: [], requests: [], reviews: [] });
    const early = clockOf({
      ...fold326,
      readyMarks: ['2026-10-10T11:35:00Z'],
      requests: [],
      reviews: [],
      mergedAt: undefined,
    });

    expect(formatFoldClock(none)).toBe(
      'fold-clock PR 326 tip 6c340d86: ready 2026-10-10T11:18:20Z; checks: none required on the base; rounds 0; merged +14.8 min',
    );
    expect(formatFoldClock(early)).toBe(
      'fold-clock PR 326 tip 6c340d86: ready 2026-10-10T11:35:00Z; checks green -2.5 min; rounds 0; not merged',
    );
  });
});
