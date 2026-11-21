import { describe, expect, it } from 'vitest';

import { isBotAuthored, withUnreportedRequired } from './merge-door-checks.js';
import { settledReading } from './test-helpers/pr-state-reading.js';

describe('isBotAuthored', () => {
  const BOT = 'a-merge-bot';

  it("reads only gh's app/<slug> spelling of the CONFIGURED bot as the bot", () => {
    expect(isBotAuthored(`app/${BOT}`, BOT)).toBe(true);
  });

  it('reads another GitHub App, the bare slug, a person and a reviewer account as not the bot', () => {
    expect(isBotAuthored('app/another-app', BOT)).toBe(false);
    expect(isBotAuthored(BOT, BOT)).toBe(false);
    expect(isBotAuthored('a-person', BOT)).toBe(false);
    expect(isBotAuthored('a-review-bot[bot]', BOT)).toBe(false);
    expect(isBotAuthored('', BOT)).toBe(false);
  });
});

describe('withUnreportedRequired', () => {
  it('reads a required context the tip has not reported as pending', () => {
    const proved = withUnreportedRequired(
      settledReading({
        namedChecks: [{ name: 'CodeQL', bucket: 'passed' }],
        checks: { total: 1, passed: 1, failed: 0, pending: 0 },
      }),
      ['run-quality-gates', 'CodeQL'],
    );

    expect(proved.notReported).toStrictEqual(['run-quality-gates']);
    expect(proved.reading.namedChecks).toStrictEqual([
      { name: 'CodeQL', bucket: 'passed' },
      { name: 'run-quality-gates', bucket: 'pending' },
    ]);
    expect(proved.reading.checks).toStrictEqual({ total: 2, passed: 1, failed: 0, pending: 1 });
  });

  it('reads a required context two rules name once, as one pending check', () => {
    const proved = withUnreportedRequired(settledReading(), [
      'run-quality-gates',
      'run-quality-gates',
    ]);

    expect(proved.notReported).toStrictEqual(['run-quality-gates']);
    expect(proved.reading.checks).toStrictEqual({ total: 2, passed: 1, failed: 0, pending: 1 });
  });

  it('keeps every reported check, pending and failed ones of any name among them', () => {
    const reading = settledReading({
      namedChecks: [
        { name: 'run-quality-gates', bucket: 'passed' },
        { name: 'secret-scan', bucket: 'failed' },
        { name: 'a-review-bot', bucket: 'pending' },
      ],
      checks: { total: 3, passed: 1, failed: 1, pending: 1 },
    });

    const proved = withUnreportedRequired(reading, ['run-quality-gates']);

    expect(proved.notReported).toStrictEqual([]);
    expect(proved.reading.namedChecks).toStrictEqual(reading.namedChecks);
    expect(proved.reading.checks).toStrictEqual(reading.checks);
  });
});
