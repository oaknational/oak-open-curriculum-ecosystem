import { describe, expect, it } from 'vitest';

import { failureMessage } from './test-helpers/result-failure.js';
import { deadlinePassed, tokenDeadlineFrom, type TokenDeadline } from './token-deadline.js';

/**
 * The deadline a token's stated expiry puts on work done with it: the expiry
 * less the margin the caller passes. Pure: values in, values out.
 */

const EXPIRES_AT = '2026-08-06T10:00:00Z';

/** Ninety seconds before the expiry above. */
const DEADLINE: TokenDeadline = {
  atEpochMs: Date.parse('2026-08-06T09:58:30.000Z'),
  atIso: '2026-08-06T09:58:30.000Z',
  tokenExpiresAt: EXPIRES_AT,
};

describe('tokenDeadlineFrom', () => {
  it('puts the deadline the given margin before the stated expiry, and keeps the expiry as stated', () => {
    expect(tokenDeadlineFrom(EXPIRES_AT, 90_000)).toEqual({ ok: true, value: DEADLINE });
  });

  it('fails on an expiry that is not a time, quoting it', () => {
    expect(failureMessage(tokenDeadlineFrom('in an hour', 90_000))).toContain('"in an hour"');
  });
});

describe('deadlinePassed', () => {
  it.each([
    { name: 'well before the deadline', now: '2026-08-06T09:00:00.000Z', passed: false },
    { name: 'at the deadline itself', now: '2026-08-06T09:58:30.000Z', passed: false },
    { name: 'one millisecond after the deadline', now: '2026-08-06T09:58:30.001Z', passed: true },
  ])('is $passed $name', ({ now, passed }) => {
    expect(deadlinePassed(now, DEADLINE)).toBe(passed);
  });
});
