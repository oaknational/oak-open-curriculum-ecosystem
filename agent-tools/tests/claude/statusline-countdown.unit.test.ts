import { formatCountdown } from '../../src/claude/statusline-countdown';

describe('formatCountdown', () => {
  it.each([
    // Minutes: under an hour shows the nearest minute.
    { label: '23 minutes', seconds: 23 * 60, expected: '23m' },
    { label: 'exactly reset', seconds: 0, expected: '0m' },
    { label: 'already past (clock skew)', seconds: -300, expected: '0m' },
    // Hours: an hour or more shows the nearest hour.
    { label: '2h14m → nearest hour down', seconds: 2 * 3600 + 14 * 60, expected: '2h' },
    { label: '1h30m → nearest hour up', seconds: 90 * 60, expected: '2h' },
    { label: '11h (under a day)', seconds: 11 * 3600, expected: '11h' },
    // Rollover promotion: never render the degenerate 60m or 24h.
    { label: '59m40s promotes to 1h, not 60m', seconds: 59 * 60 + 40, expected: '1h' },
    { label: '23h30m promotes to 1d, not 24h', seconds: 23 * 3600 + 30 * 60, expected: '1d' },
    // Days: a day or more shows the nearest day.
    { label: '3d4h → nearest day', seconds: 3 * 86400 + 4 * 3600, expected: '3d' },
    { label: '3d12h → nearest day up', seconds: 3 * 86400 + 12 * 3600, expected: '4d' },
    { label: 'full seven days', seconds: 7 * 86400, expected: '7d' },
  ])('formats $label as $expected', ({ seconds, expected }) => {
    expect(formatCountdown(seconds)).toBe(expected);
  });
});
