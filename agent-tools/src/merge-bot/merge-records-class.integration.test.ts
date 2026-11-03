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

const makeReading = settledReading;

/**
 * The records class at the execution level: the class is read from the diff
 * only on a verdict where it decides, a records fold merges while its vendor
 * leg is still owed once the required contexts are green by name, a code diff
 * on the same verdict stays at the door, and an unreported required context
 * holds any diff at CHECKS-RUNNING. The settled verdict has its own suite
 * (`merge-records-settled.integration.test.ts`).
 */
describe('runMergeExecution — the records class (the owner ruling of 2026-09-03)', () => {
  /**
   * The bot's own pull request (the ruling's class), the vendor leg owed: no
   * review binds the tip, and the required contexts went green by name two
   * minutes ago.
   */
  const owedLegReading = (): PrStateReading =>
    makeReading({
      author: 'app/acme-bot',
      reviews: [],
      checksGreenAt: '2026-08-06T08:58:00Z',
      namedChecks: [
        { name: 'run-quality-gates', bucket: 'passed' },
        { name: 'CodeQL', bucket: 'passed' },
      ],
      checks: { total: 2, passed: 2, failed: 0, pending: 0 },
    });

  /**
   * The same owed leg on a tip that has reported only a check the rules do
   * not name: no check run exists yet for either required context, so the
   * verdict ladder reads every reported check green.
   */
  const requiredUnreportedReading = (): PrStateReading =>
    makeReading({
      author: 'app/acme-bot',
      reviews: [],
      checksGreenAt: '2026-08-06T08:58:00Z',
      namedChecks: [{ name: 'lint', bucket: 'passed' }],
      checks: { total: 1, passed: 1, failed: 0, pending: 0 },
    });

  /** The real fold shape: required checks green, the vendor's own review run still pending. */
  const vendorRunPendingReading = (): PrStateReading =>
    makeReading({
      author: 'app/acme-bot',
      reviews: [],
      checksGreenAt: null,
      namedChecks: [
        { name: 'run-quality-gates', bucket: 'passed' },
        { name: 'CodeQL', bucket: 'passed' },
        { name: 'copilot-pull-request-reviewer', bucket: 'pending' },
      ],
      checks: { total: 3, passed: 2, failed: 0, pending: 1 },
    });

  it('merges a records fold at checks green while the vendor leg is still owed, naming the ground', async () => {
    const { fetchImpl, calls } = makeClassPort(RECORDS_FILES);

    const outcome = await runMergeExecution(makeInput(owedLegReading(), fetchImpl));

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.kind).toBe('merged');
      expect(
        outcome.value.evidence.some((line) => line.startsWith('records-class (2 changed paths')),
      ).toBe(true);
    }
    const urls = calls.map((call) => call.url);
    expect(urls.findIndex((url) => url.includes('/pulls/42/files'))).toBeLessThan(
      urls.findIndex((url) => url.endsWith('/pulls/42/merge')),
    );
  });

  it("keeps the door closed to another GitHub App's records fold on the same owed leg, naming the bot it is not, reading no files", async () => {
    const { fetchImpl, calls } = makeClassPort(RECORDS_FILES, { failing: '/pulls/42/files' });

    const outcome = await runMergeExecution(
      makeInput({ ...owedLegReading(), author: 'app/some-other-app' }, fetchImpl),
    );

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.kind).toBe('refused');
    }
    expect(
      refusedEvidence(outcome).some((line) =>
        line.includes('the author app/some-other-app is not the merge bot app/acme-bot'),
      ),
    ).toBe(true);
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it('holds a records fold on an owed leg until every REQUIRED context has reported on the tip, naming the missing ones and reading no files', async () => {
    // A files read on this leg would surface as a reading failure, so a CHECKS-RUNNING refusal proves none happened.
    const { fetchImpl, calls } = makeClassPort(RECORDS_FILES, { failing: '/pulls/42/files' });

    const outcome = await runMergeExecution(makeInput(requiredUnreportedReading(), fetchImpl));

    expect(refusedState(outcome)).toBe('CHECKS-RUNNING');
    expect(
      refusedEvidence(outcome).some(
        (line) => line.includes('not reported') && line.includes('(run-quality-gates, CodeQL)'),
      ),
    ).toBe(true);
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it('holds a code-class pull request on an owed leg at CHECKS-RUNNING too while a required context is unreported: the class is not read there', async () => {
    const { fetchImpl, calls } = makeClassPort(CODE_FILES);

    const outcome = await runMergeExecution(makeInput(requiredUnreportedReading(), fetchImpl));

    expect(refusedState(outcome)).toBe('CHECKS-RUNNING');
    expect(refusedEvidence(outcome).some((line) => line.includes('not reported'))).toBe(true);
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it("merges a records fold whose only pending check is the vendor's own review run, naming what was set aside", async () => {
    const { fetchImpl, calls } = makeClassPort(RECORDS_FILES);

    const outcome = await runMergeExecution(makeInput(vendorRunPendingReading(), fetchImpl));

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.kind).toBe('merged');
      expect(
        outcome.value.evidence.some((line) =>
          line.includes('set aside (copilot-pull-request-reviewer)'),
        ),
      ).toBe(true);
    }
    expect(calls.some((call) => call.url.includes('/rules/branches/main'))).toBe(true);
  });

  it('keeps a code diff at the door on the same pending vendor run and sends no merge', async () => {
    const { fetchImpl, calls } = makeClassPort([
      { filename: '.agent/memory/active/napkin.md' },
      { filename: 'agent-tools/src/merge-bot/merge.ts' },
    ]);

    const outcome = await runMergeExecution(makeInput(vendorRunPendingReading(), fetchImpl));

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.kind).toBe('refused');
      if (outcome.value.kind === 'refused') {
        expect(outcome.value.verdictState).toBe('CHECKS-RUNNING');
      }
    }
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
    expect(calls.some((call) => call.url.includes('/pulls/42/files'))).toBe(true);
  });

  it('holds a records fold while a REQUIRED context is pending, whatever else is set aside', async () => {
    const { fetchImpl, calls } = makeClassPort(RECORDS_FILES, {
      required: ['run-quality-gates', 'CodeQL', 'secret-scan'],
    });

    const outcome = await runMergeExecution(makeInput(vendorRunPendingReading(), fetchImpl));

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.kind).toBe('refused');
      if (outcome.value.kind === 'refused') {
        expect(outcome.value.verdictState).toBe('CHECKS-RUNNING');
      }
    }
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it('keeps a code diff at the door on an owed leg and names the code paths', async () => {
    const { fetchImpl, calls } = makeClassPort([
      { filename: '.agent/memory/active/napkin.md' },
      { filename: 'agent-tools/src/merge-bot/merge.ts' },
    ]);

    const outcome = await runMergeExecution(makeInput(owedLegReading(), fetchImpl));

    expect(outcome.ok).toBe(true);
    if (outcome.ok) {
      expect(outcome.value.kind).toBe('refused');
      if (outcome.value.kind === 'refused') {
        expect(outcome.value.verdictState).toBe('SILENT-WAIT-NO-REVIEWER');
        expect(outcome.value.reason).toContain('agent-tools/src/merge-bot/merge.ts');
      }
    }
    expect(calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it('reports a failed rules or files read on an owed leg as a retryable reading failure, never a merge', async () => {
    const rules = makeClassPort(RECORDS_FILES, { failing: '/rules/branches/' });
    const files = makeClassPort(RECORDS_FILES, { failing: '/pulls/42/files' });

    const onRules = await runMergeExecution(makeInput(owedLegReading(), rules.fetchImpl));
    const onFiles = await runMergeExecution(makeInput(owedLegReading(), files.fetchImpl));

    for (const [outcome, surface] of [
      [onRules, 'branch rules read answered 502'],
      [onFiles, 'changed files read answered 502'],
    ] as const) {
      expect(outcome.ok).toBe(false);
      if (!outcome.ok) {
        expect(outcome.error).toBeInstanceOf(ReadingUnavailableError);
        expect(outcome.error.message).toContain(surface);
      }
    }
    expect(rules.calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
    expect(files.calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it('keeps CHECKS-RUNNING as read, naming the reason, when the rules or the files cannot be read this poll', async () => {
    const rules = makeClassPort(RECORDS_FILES, { failing: '/rules/branches/' });
    const files = makeClassPort(RECORDS_FILES, { failing: '/pulls/42/files' });

    const onRules = await runMergeExecution(makeInput(vendorRunPendingReading(), rules.fetchImpl));
    const onFiles = await runMergeExecution(makeInput(vendorRunPendingReading(), files.fetchImpl));

    for (const outcome of [onRules, onFiles]) {
      expect(outcome.ok).toBe(true);
      if (outcome.ok) {
        expect(outcome.value.kind).toBe('refused');
        if (outcome.value.kind === 'refused') {
          expect(outcome.value.verdictState).toBe('CHECKS-RUNNING');
          expect(
            outcome.value.evidence.some((line) =>
              line.startsWith('records-class narrowing unavailable this poll:'),
            ),
          ).toBe(true);
        }
      }
    }
    expect(rules.calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
    expect(files.calls.some((call) => call.url.endsWith('/pulls/42/merge'))).toBe(false);
  });

  it('reads every rules page: a required context on the second page still binds', async () => {
    const filler = Array.from({ length: 100 }, () => ({ type: 'deletion' }));
    const secondPage = [
      {
        type: 'required_status_checks',
        parameters: {
          required_status_checks: [{ context: 'run-quality-gates' }, { context: 'CodeQL' }],
        },
      },
    ];
    const { fetchImpl, calls } = makeClassPort(RECORDS_FILES, { rulesPages: [filler, secondPage] });

    const outcome = await runMergeExecution(makeInput(vendorRunPendingReading(), fetchImpl));

    expect(outcome.ok && outcome.value.kind).toBe('merged');
    expect(calls.filter((call) => call.url.includes('/rules/branches/main'))).toHaveLength(2);
  });

  it('closes the records door on a pull request a person authored, whatever its paths', async () => {
    const pending = makeClassPort(RECORDS_FILES);
    const owed = makeClassPort(RECORDS_FILES);
    const human = { author: 'jimCresswell' };

    const onPending = await runMergeExecution(
      makeInput({ ...vendorRunPendingReading(), ...human }, pending.fetchImpl),
    );
    const onOwed = await runMergeExecution(
      makeInput({ ...owedLegReading(), ...human }, owed.fetchImpl),
    );

    expect(refusedState(onPending)).toBe('CHECKS-RUNNING');
    expect(refusedState(onOwed)).toBe('SILENT-WAIT-NO-REVIEWER');
    for (const outcome of [onPending, onOwed]) {
      expect(
        refusedEvidence(outcome).some((line) =>
          line.startsWith('records-class door closed: the author jimCresswell'),
        ),
      ).toBe(true);
    }
    for (const port of [pending, owed]) {
      expect(port.calls.some((call) => call.url.includes('/pulls/42/files'))).toBe(false);
      expect(port.calls.some((call) => call.url.includes('/rules/branches/'))).toBe(false);
    }
  });

  it('reads no files while a code-class pull request waits on its own required checks', async () => {
    const { fetchImpl, calls } = makeClassPort(CODE_FILES);
    const requiredPending = makeReading({
      reviews: [],
      checksGreenAt: null,
      namedChecks: [
        { name: 'run-quality-gates', bucket: 'pending' },
        { name: 'CodeQL', bucket: 'passed' },
      ],
      checks: { total: 2, passed: 1, failed: 0, pending: 1 },
    });

    const outcome = await runMergeExecution(makeInput(requiredPending, fetchImpl));

    expect(outcome.ok && outcome.value.kind === 'refused' && outcome.value.verdictState).toBe(
      'CHECKS-RUNNING',
    );
    expect(calls.some((call) => call.url.includes('/pulls/42/files'))).toBe(false);
  });
});
