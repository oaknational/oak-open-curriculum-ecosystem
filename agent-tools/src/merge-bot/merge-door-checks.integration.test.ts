import { describe, expect, it } from 'vitest';

import type { PrStateReading } from '../pr-watch/state-types.js';
import { ReadingUnavailableError, runMergeExecution } from './merge.js';
import {
  makeDoorPort,
  mergeAsked,
  refusedEvidence,
  refusedState,
} from './test-helpers/door-port.js';
import { makeInput } from './test-helpers/merge-execution-input.js';
import { settledReading } from './test-helpers/pr-state-reading.js';

const GREEN_REQUIRED = {
  namedChecks: [
    { name: 'run-quality-gates', bucket: 'passed' },
    { name: 'CodeQL', bucket: 'passed' },
  ],
  checks: { total: 2, passed: 2, failed: 0, pending: 0 },
} as const;

/** The bot's own pull request settled: a review stands, the quiet window has elapsed, the required contexts are green by name. */
const botSettledReading = (): PrStateReading =>
  settledReading({ author: 'app/acme-bot', ...GREEN_REQUIRED });

/** The same settled pull request on a tip where one required context has no check run yet. */
const botSettledUnreportedReading = (): PrStateReading =>
  settledReading({
    author: 'app/acme-bot',
    namedChecks: [{ name: 'CodeQL', bucket: 'passed' }],
    checks: { total: 1, passed: 1, failed: 0, pending: 0 },
  });

/** The bot's own pull request with green required contexts that nobody has reviewed. */
const botUnreviewedReading = (): PrStateReading =>
  settledReading({
    author: 'app/acme-bot',
    expectedReviewers: [],
    reviews: [],
    checksGreenAt: '2026-08-06T08:58:00Z',
    ...GREEN_REQUIRED,
  });

/** The bot's own pull request whose only pending check is a review running as a check the rules do not require. */
const botReviewCheckPendingReading = (): PrStateReading =>
  settledReading({
    author: 'app/acme-bot',
    checksGreenAt: null,
    namedChecks: [...GREEN_REQUIRED.namedChecks, { name: 'a-review-bot', bucket: 'pending' }],
    checks: { total: 3, passed: 2, failed: 0, pending: 1 },
  });

/**
 * One door for every pull request: only a settled verdict merges, whatever
 * the changed paths, and the changed paths are never read.
 */
describe('runMergeExecution — one rule for every pull request', () => {
  it("refuses the bot's own pull request that nobody has reviewed, though every required context is green", async () => {
    const port = makeDoorPort();

    const outcome = await runMergeExecution(makeInput(botUnreviewedReading(), port.fetchImpl));

    expect(refusedState(outcome)).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(mergeAsked(port)).toBe(false);
  });

  it("holds the bot's own pull request while a review runs as a check the base branch does not require", async () => {
    const port = makeDoorPort();

    const outcome = await runMergeExecution(
      makeInput(botReviewCheckPendingReading(), port.fetchImpl),
    );

    expect(refusedState(outcome)).toBe('CHECKS-RUNNING');
    expect(mergeAsked(port)).toBe(false);
  });

  it.each([
    ['settled', botSettledReading()],
    ['unreviewed', botUnreviewedReading()],
    ['a review check pending', botReviewCheckPendingReading()],
    ['a required context unreported', botSettledUnreportedReading()],
  ])('never reads the changed files (%s)', async (_name, reading) => {
    const port = makeDoorPort();

    await runMergeExecution(makeInput(reading, port.fetchImpl));

    expect(port.calls.some((call) => call.url.includes('/files'))).toBe(false);
  });
});

/**
 * The verdict settles on the checks the tip has reported, so a required
 * context with no check run yet would send the merge into GitHub's own
 * refusal. Before the PUT, the bot's own settled pull request proves the
 * base branch's required contexts by name.
 */
describe('runMergeExecution — the settled verdict proves the required contexts', () => {
  it('merges a bot-authored settled pull request once its required contexts are green by name', async () => {
    const port = makeDoorPort();

    const outcome = await runMergeExecution(makeInput(botSettledReading(), port.fetchImpl));

    expect(outcome.ok && outcome.value.kind).toBe('merged');
    expect(port.calls.some((call) => call.url.includes('/rules/branches/main'))).toBe(true);
  });

  it('holds a bot-authored settled pull request at CHECKS-RUNNING while a required context is unreported, naming it', async () => {
    const port = makeDoorPort();

    const outcome = await runMergeExecution(
      makeInput(botSettledUnreportedReading(), port.fetchImpl),
    );

    expect(refusedState(outcome)).toBe('CHECKS-RUNNING');
    expect(
      refusedEvidence(outcome).some(
        (line) => line.includes('not reported') && line.includes('(run-quality-gates)'),
      ),
    ).toBe(true);
    expect(mergeAsked(port)).toBe(false);
  });

  it('reads every rules page: a required context on the second page still binds', async () => {
    const filler = Array.from({ length: 100 }, () => ({ type: 'deletion' }));
    const secondPage = [
      {
        type: 'required_status_checks',
        parameters: { required_status_checks: [{ context: 'secret-scan' }] },
      },
    ];
    const port = makeDoorPort({ rulesPages: [filler, secondPage] });

    const outcome = await runMergeExecution(makeInput(botSettledReading(), port.fetchImpl));

    expect(refusedState(outcome)).toBe('CHECKS-RUNNING');
    expect(refusedEvidence(outcome).some((line) => line.includes('(secret-scan)'))).toBe(true);
    expect(port.calls.filter((call) => call.url.includes('/rules/branches/main'))).toHaveLength(2);
  });

  it('reports a failed rules read on a bot-authored settled verdict as a retryable reading failure, never a merge', async () => {
    const port = makeDoorPort({ failing: '/rules/branches/' });

    const outcome = await runMergeExecution(makeInput(botSettledReading(), port.fetchImpl));

    const error = outcome.ok ? undefined : outcome.error;
    expect(error).toBeInstanceOf(ReadingUnavailableError);
    expect(error?.message).toContain('branch rules read answered 502');
    expect(mergeAsked(port)).toBe(false);
  });

  it('reads no rules before the verdict settles', async () => {
    const port = makeDoorPort({ failing: '/rules/branches/' });

    const outcome = await runMergeExecution(makeInput(botUnreviewedReading(), port.fetchImpl));

    expect(refusedState(outcome)).toBe('SILENT-WAIT-NO-REVIEWER');
    expect(port.calls.some((call) => call.url.includes('/rules/branches/'))).toBe(false);
  });

  it.each(['a-person', 'app/another-app'])(
    'reads no rules on a settled pull request authored by %s',
    async (author) => {
      const port = makeDoorPort({ failing: '/rules/branches/' });

      const outcome = await runMergeExecution(
        makeInput(settledReading({ author }), port.fetchImpl),
      );

      expect(outcome.ok && outcome.value.kind).toBe('merged');
    },
  );
});
