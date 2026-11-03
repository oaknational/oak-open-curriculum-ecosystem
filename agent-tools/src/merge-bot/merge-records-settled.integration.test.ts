import { describe, expect, it } from 'vitest';

import type { PrStateReading } from '../pr-watch/state-types.js';
import { ReadingUnavailableError, runMergeExecution } from './merge.js';
import { makeInput } from './test-helpers/merge-execution-input.js';
import { settledReading } from './test-helpers/pr-state-reading.js';
import {
  CODE_FILES,
  makeClassPort,
  RECORDS_FILES,
  refusedEvidence,
  refusedState,
} from './test-helpers/records-class-port.js';

/**
 * The settled verdict at the execution level: the verdict alone merges and
 * the class is never read, but a GitHub App's pull request proves the base
 * branch's required contexts by name before the PUT — the ladder settles on
 * the checks as reported, so a required context with no check run yet would
 * otherwise send the merge into GitHub's own refusal — while a person's
 * settled pull request reads nothing and merges as before.
 */
describe('runMergeExecution — the settled verdict proves the required contexts', () => {
  /**
   * The bot's own pull request settled — the review bound to the tip, the
   * quiet window elapsed — with the required contexts green by name.
   */
  const botSettledReading = (): PrStateReading =>
    settledReading({
      author: 'app/acme-bot',
      namedChecks: [
        { name: 'run-quality-gates', bucket: 'passed' },
        { name: 'CodeQL', bucket: 'passed' },
      ],
      checks: { total: 2, passed: 2, failed: 0, pending: 0 },
    });

  /** The same settled pull request on a tip where one required context has no check run yet. */
  const botSettledUnreportedReading = (): PrStateReading =>
    settledReading({
      author: 'app/acme-bot',
      namedChecks: [{ name: 'CodeQL', bucket: 'passed' }],
      checks: { total: 1, passed: 1, failed: 0, pending: 0 },
    });

  it('merges a bot-authored settled pull request once its required contexts are green by name, reading no files', async () => {
    // A files read would surface as a reading failure, so the merge proves none happened.
    const { fetchImpl } = makeClassPort(CODE_FILES, { failing: '/pulls/42/files' });

    const outcome = await runMergeExecution(makeInput(botSettledReading(), fetchImpl));

    expect(outcome.ok && outcome.value.kind).toBe('merged');
  });

  it.each([
    ['records', RECORDS_FILES],
    ['code', CODE_FILES],
  ])(
    'holds a bot-authored settled pull request at CHECKS-RUNNING while a required context is unreported, whatever its diff (%s)',
    async (diff, files) => {
      const { fetchImpl, calls } = makeClassPort(files);

      const outcome = await runMergeExecution(makeInput(botSettledUnreportedReading(), fetchImpl));

      expect(refusedState(outcome), diff).toBe('CHECKS-RUNNING');
      expect(
        refusedEvidence(outcome).some(
          (line) => line.includes('not reported') && line.includes('(run-quality-gates)'),
        ),
      ).toBe(true);
      expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
    },
  );

  it('reports a failed rules read on a bot-authored settled verdict as a retryable reading failure, never a merge', async () => {
    const { fetchImpl, calls } = makeClassPort(RECORDS_FILES, { failing: '/rules/branches/' });

    const outcome = await runMergeExecution(makeInput(botSettledReading(), fetchImpl));

    expect(outcome.ok).toBe(false);
    if (!outcome.ok) {
      expect(outcome.error).toBeInstanceOf(ReadingUnavailableError);
      expect(outcome.error.message).toContain('branch rules read answered 502');
    }
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it("reads nothing on a person's settled pull request: a failing rules or files port cannot stop the merge there", async () => {
    const rules = makeClassPort(CODE_FILES, { failing: '/rules/branches/' });
    const files = makeClassPort(CODE_FILES, { failing: '/pulls/42/files' });

    const onRules = await runMergeExecution(makeInput(settledReading(), rules.fetchImpl));
    const onFiles = await runMergeExecution(makeInput(settledReading(), files.fetchImpl));

    expect(onRules.ok && onRules.value.kind).toBe('merged');
    expect(onFiles.ok && onFiles.value.kind).toBe('merged');
  });
});
