import { describe, expect, it } from 'vitest';

import { parseMergeArgs } from './merge-args.js';

/**
 * The `merge-bot merge` argv contract — pure parsing, no fakes: --pr
 * required, the A4 poll budget bounded inside GitHub's one-hour token TTL,
 * and no reviewer list: the reviews are read from the pull request.
 */

const PR_ARGS = ['--pr', '42'] as const;

/** The parse's error message, or the empty string when it parsed. */
function refusalOf(args: readonly string[]): string {
  const parsed = parseMergeArgs(args);
  return parsed.ok ? '' : parsed.error.message;
}

describe('parseMergeArgs', () => {
  it('parses the full flag line', () => {
    const parsed = parseMergeArgs([...PR_ARGS, '--json', '--interval', '20', '--max-polls', '10']);

    expect(parsed).toMatchObject({
      ok: true,
      value: { prNumber: 42, json: true, intervalSeconds: 20, maxPolls: 10 },
    });
  });

  it.each(['--expect', '--unavailable'])(
    'takes no %s flag: the command is told no reviewer and no unavailability',
    (flag) => {
      expect(refusalOf([...PR_ARGS, flag, 'copilot-pull-request-reviewer'])).toContain(
        `unknown flag "${flag}"`,
      );
    },
  );

  it.each(['toString', '__proto__', 'constructor'])(
    'refuses %s as an unknown flag, not a property every object carries',
    (token) => {
      expect(refusalOf([...PR_ARGS, token, 'value'])).toContain(`unknown flag "${token}"`);
    },
  );

  it('defaults the poll budget inside the token hour', () => {
    const parsed = parseMergeArgs([...PR_ARGS]);

    // The load-bearing property is the BOUND — the specific defaults are
    // owner-tunable knobs, deliberately not pinned (test-review O-9).
    const budget = parsed.ok ? parsed.value.intervalSeconds * parsed.value.maxPolls : Infinity;
    expect(budget).toBeLessThanOrEqual(3000);
    expect(parsed).toMatchObject({ ok: true, value: { json: false } });
  });

  it('requires --pr as a positive integer', () => {
    expect(refusalOf(['--json'])).toContain('--pr');
    expect(refusalOf(['--pr', 'seventeen'])).toContain('--pr');
    // '0' discriminates the [1-9] anchor a plain \d+ would not (test-review
    // D-3): --max-polls 0 would silently disable polling, --interval 0 a
    // zero-budget hot loop.
    expect(refusalOf(['--pr', '0'])).toContain('--pr');
  });

  it('rejects a --pr beyond the safe-integer range rather than silently rounding it', () => {
    // 9007199254740993 rounds to ...992 through Number(): the digit regex
    // admits it, and the command would then act on a DIFFERENT PR than the
    // operator supplied — the one confusion an irreversible act must not have.
    const refusal = refusalOf(['--pr', '9007199254740993']);

    expect(refusal).toContain('--pr');
    expect(refusal).toContain('safe integer');
  });

  it('bounds interval times max-polls under the one-hour token lifetime', () => {
    const over = refusalOf([...PR_ARGS, '--interval', '60', '--max-polls', '51']);
    expect(over).toContain('hour');
    expect(over).toContain('3060');

    expect(parseMergeArgs([...PR_ARGS, '--interval', '60', '--max-polls', '50']).ok).toBe(true);
  });

  it('refuses a repeated single-valued flag and unknown flags', () => {
    expect(refusalOf([...PR_ARGS, '--pr', '43'])).toContain('more than once');
    expect(refusalOf([...PR_ARGS, '--wat', 'x'])).toContain('--wat');
  });
});
