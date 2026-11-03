import { describe, expect, it } from 'vitest';

import { settledReading } from './test-helpers/pr-state-reading.js';
import { isBotAuthored, narrowToRequired } from './merge-records-checks.js';

/**
 * "Checks green by name" for the records class: a pending check the base
 * branch's rules do not require is set aside; a failed check of any name
 * stays; a required context the tip has not reported is pending.
 */

const vendorPending = () =>
  settledReading({
    namedChecks: [
      { name: 'run-quality-gates', bucket: 'passed' },
      { name: 'CodeQL', bucket: 'passed' },
      { name: 'copilot-pull-request-reviewer', bucket: 'pending' },
    ],
    checks: { total: 3, passed: 2, failed: 0, pending: 1 },
  });

describe('isBotAuthored', () => {
  const BOT = 'jimbot-of-the-devonshire-jimbots';

  it("reads only gh's app/<slug> spelling of the CONFIGURED bot as the bot", () => {
    expect(isBotAuthored(`app/${BOT}`, BOT)).toBe(true);
  });

  it('reads another GitHub App, the bare slug, a person and a reviewer account as not the bot', () => {
    expect(isBotAuthored('app/dependabot', BOT)).toBe(false);
    expect(isBotAuthored(BOT, BOT)).toBe(false);
    expect(isBotAuthored('jimCresswell', BOT)).toBe(false);
    expect(isBotAuthored('copilot-pull-request-reviewer[bot]', BOT)).toBe(false);
    expect(isBotAuthored('', BOT)).toBe(false);
  });
});

describe('narrowToRequired', () => {
  it('sets aside a pending check the rules do not require and recounts', () => {
    const narrowed = narrowToRequired(vendorPending(), ['run-quality-gates', 'CodeQL']);

    expect(narrowed.setAside).toStrictEqual(['copilot-pull-request-reviewer']);
    expect(narrowed.reading.checks).toStrictEqual({ total: 2, passed: 2, failed: 0, pending: 0 });
    expect(narrowed.reading.namedChecks.map((check) => check.name)).toStrictEqual([
      'run-quality-gates',
      'CodeQL',
    ]);
  });

  it('keeps a pending required context and a failed check of any name', () => {
    const narrowed = narrowToRequired(
      settledReading({
        namedChecks: [
          { name: 'run-quality-gates', bucket: 'pending' },
          { name: 'CodeQL', bucket: 'passed' },
          { name: 'secret-scan', bucket: 'failed' },
          { name: 'copilot-pull-request-reviewer', bucket: 'pending' },
        ],
        checks: { total: 4, passed: 1, failed: 1, pending: 2 },
      }),
      ['run-quality-gates', 'CodeQL'],
    );

    expect(narrowed.setAside).toStrictEqual(['copilot-pull-request-reviewer']);
    expect(narrowed.reading.checks).toStrictEqual({ total: 3, passed: 1, failed: 1, pending: 1 });
  });

  it('reads a required context the tip has not reported as pending', () => {
    const narrowed = narrowToRequired(
      settledReading({
        namedChecks: [{ name: 'CodeQL', bucket: 'passed' }],
        checks: { total: 1, passed: 1, failed: 0, pending: 0 },
      }),
      ['run-quality-gates', 'CodeQL'],
    );

    expect(narrowed.setAside).toStrictEqual([]);
    expect(narrowed.notReported).toStrictEqual(['run-quality-gates']);
    expect(narrowed.reading.namedChecks).toStrictEqual([
      { name: 'CodeQL', bucket: 'passed' },
      { name: 'run-quality-gates', bucket: 'pending' },
    ]);
    expect(narrowed.reading.checks.pending).toBe(1);
  });

  it('reads a required context two rules name once, as one pending check', () => {
    const narrowed = narrowToRequired(settledReading(), ['run-quality-gates', 'run-quality-gates']);

    expect(narrowed.notReported).toStrictEqual(['run-quality-gates']);
    expect(narrowed.reading.checks).toStrictEqual({ total: 2, passed: 1, failed: 0, pending: 1 });
  });

  it('leaves a reading untouched when nothing pending is outside the rules', () => {
    const reading = settledReading();

    const narrowed = narrowToRequired(reading, ['lint']);

    expect(narrowed.setAside).toStrictEqual([]);
    expect(narrowed.reading.namedChecks).toStrictEqual(reading.namedChecks);
    expect(narrowed.reading.checks).toStrictEqual({ total: 1, passed: 1, failed: 0, pending: 0 });
  });
});
