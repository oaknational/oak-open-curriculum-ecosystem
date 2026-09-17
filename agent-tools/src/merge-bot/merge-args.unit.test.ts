import { describe, expect, it } from 'vitest';

import { parseMergeArgs } from './merge-args.js';

/**
 * The `merge-bot merge` argv contract — pure parsing, no fakes: --pr and
 * --expect required (the declared reviewer set backs an irreversible act),
 * the A4 poll budget bounded inside GitHub's one-hour token TTL, and the
 * D4 login grammar on every --expect value.
 */

const EXPECT_ARGS = ['--pr', '42', '--expect', 'copilot-pull-request-reviewer'] as const;

describe('parseMergeArgs', () => {
  it('parses the full flag line', () => {
    const parsed = parseMergeArgs([
      ...EXPECT_ARGS,
      '--expect',
      'second-reviewer',
      '--json',
      '--interval',
      '20',
      '--max-polls',
      '10',
    ]);

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value).toEqual({
        prNumber: 42,
        expect: ['copilot-pull-request-reviewer', 'second-reviewer'],
        json: true,
        intervalSeconds: 20,
        maxPolls: 10,
      });
    }
  });

  it('defaults the poll budget inside the token hour', () => {
    const parsed = parseMergeArgs([...EXPECT_ARGS]);

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      // The load-bearing property is the BOUND — the specific defaults are
      // owner-tunable knobs, deliberately not pinned (test-review O-9).
      expect(parsed.value.intervalSeconds * parsed.value.maxPolls).toBeLessThanOrEqual(3000);
      expect(parsed.value.json).toBe(false);
    }
  });

  it('requires --pr as a positive integer', () => {
    const missing = parseMergeArgs(['--expect', 'reviewer']);
    expect(missing.ok).toBe(false);
    if (!missing.ok) {
      expect(missing.error.message).toContain('--pr');
    }

    const wordy = parseMergeArgs(['--pr', 'seventeen', '--expect', 'reviewer']);
    expect(wordy.ok).toBe(false);
    if (!wordy.ok) {
      expect(wordy.error.message).toContain('--pr');
    }

    // '0' discriminates the [1-9] anchor a plain \d+ would not (test-review
    // D-3): --max-polls 0 would silently disable polling, --interval 0 a
    // zero-budget hot loop.
    const zero = parseMergeArgs(['--pr', '0', '--expect', 'reviewer']);
    expect(zero.ok).toBe(false);
    if (!zero.ok) {
      expect(zero.error.message).toContain('--pr');
    }
  });

  it('rejects a --pr beyond the safe-integer range rather than silently rounding it', () => {
    // 9007199254740993 rounds to ...992 through Number(): the digit regex
    // admits it, and the command would then act on a DIFFERENT PR than the
    // operator supplied — the one confusion an irreversible act must not have.
    const unsafe = parseMergeArgs(['--pr', '9007199254740993', '--expect', 'reviewer']);

    expect(unsafe.ok).toBe(false);
    if (!unsafe.ok) {
      expect(unsafe.error.message).toContain('--pr');
      expect(unsafe.error.message).toContain('safe integer');
    }
  });

  it('requires at least one --expect, teaching why a defaulted set cannot merge', () => {
    const parsed = parseMergeArgs(['--pr', '42']);

    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message).toContain('--expect');
      expect(parsed.error.message).toContain('defaulted');
    }
  });

  it('rejects blank, flag-shaped, and non-login --expect values (security D4)', () => {
    for (const bad of ['', '  ', '$(whoami)']) {
      const parsed = parseMergeArgs(['--pr', '42', '--expect', bad]);
      expect(parsed.ok).toBe(false);
      if (!parsed.ok) {
        expect(parsed.error.message).toContain('--expect');
      }
    }
    // A flag-shaped value must not be swallowed as a reviewer name (D-2).
    const flagShaped = parseMergeArgs(['--pr', '42', '--expect', '--json']);
    expect(flagShaped.ok).toBe(false);
    if (!flagShaped.ok) {
      expect(flagShaped.error.message).toContain('--expect');
    }
    // Real logins, including the app [bot] suffix, pass.
    expect(parseMergeArgs(['--pr', '42', '--expect', 'copilot-pull-request-reviewer']).ok).toBe(
      true,
    );
    expect(parseMergeArgs(['--pr', '42', '--expect', 'jimbot-oakington-iii[bot]']).ok).toBe(true);
  });

  it('bounds interval times max-polls under the one-hour token lifetime', () => {
    const over = parseMergeArgs([...EXPECT_ARGS, '--interval', '60', '--max-polls', '51']);
    expect(over.ok).toBe(false);
    if (!over.ok) {
      expect(over.error.message).toContain('hour');
      expect(over.error.message).toContain('3060');
    }

    const atBound = parseMergeArgs([...EXPECT_ARGS, '--interval', '60', '--max-polls', '50']);
    expect(atBound.ok).toBe(true);
  });

  it('refuses a repeated single-valued flag and unknown flags', () => {
    const repeated = parseMergeArgs([...EXPECT_ARGS, '--pr', '43']);
    expect(repeated.ok).toBe(false);
    if (!repeated.ok) {
      expect(repeated.error.message).toContain('more than once');
    }

    const unknown = parseMergeArgs([...EXPECT_ARGS, '--wat', 'x']);
    expect(unknown.ok).toBe(false);
    if (!unknown.ok) {
      expect(unknown.error.message).toContain('--wat');
    }
  });
});
