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
        unavailable: [],
      });
    }
  });

  it('reads each --unavailable declaration, naming an expected reviewer in any case or [bot] form', () => {
    const url = 'https://github.com/acme/widgets/pull/42#issuecomment-1';
    const parsed = parseMergeArgs([
      ...EXPECT_ARGS,
      '--unavailable',
      `Copilot-Pull-Request-Reviewer[bot]=${url}`,
    ]);

    expect(parsed.ok ? parsed.value.unavailable : parsed.error.message).toStrictEqual([
      { login: 'Copilot-Pull-Request-Reviewer[bot]', url },
    ]);
  });

  it('refuses a declaration of a reviewer no --expect declares', () => {
    const parsed = parseMergeArgs([
      ...EXPECT_ARGS,
      '--unavailable',
      'chatgpt-codex-connector=https://github.com/acme/widgets/pull/42#issuecomment-1',
    ]);

    expect(parsed.ok ? '' : parsed.error.message).toContain(
      '--unavailable names chatgpt-codex-connector, which no --expect declares',
    );
  });

  it('refuses a malformed --unavailable value', () => {
    const parsed = parseMergeArgs([
      ...EXPECT_ARGS,
      '--unavailable',
      'copilot-pull-request-reviewer',
    ]);

    expect(parsed.ok ? '' : parsed.error.message).toContain(
      '--unavailable takes <login>=<comment-url>, got "copilot-pull-request-reviewer"',
    );
  });

  it.each(['toString', '__proto__', 'constructor'])(
    'refuses %s as an unknown flag, not a property every object carries',
    (token) => {
      const parsed = parseMergeArgs([...EXPECT_ARGS, token, 'value']);

      expect(parsed.ok ? '' : parsed.error.message).toContain(`unknown flag "${token}"`);
    },
  );

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

  it('accepts --expect none as the DECLARED empty set: the seat judged no pull-request review necessary', () => {
    const parsed = parseMergeArgs(['--pr', '42', '--expect', 'none']);

    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.expect).toEqual([]);
    }
  });

  it('refuses --expect none beside a login: the set is empty or it is not', () => {
    for (const args of [
      ['--pr', '42', '--expect', 'none', '--expect', 'copilot-pull-request-reviewer'],
      ['--pr', '42', '--expect', 'copilot-pull-request-reviewer', '--expect', 'none'],
    ]) {
      const parsed = parseMergeArgs(args);
      expect(parsed.ok).toBe(false);
      if (!parsed.ok) {
        expect(parsed.error.message).toContain('--expect none');
      }
    }
  });

  it('refuses --unavailable under --expect none: no reviewer is expected, so none can be down', () => {
    const parsed = parseMergeArgs([
      '--pr',
      '42',
      '--expect',
      'none',
      '--unavailable',
      'chatgpt-codex-connector=https://github.com/acme/widgets/pull/42#issuecomment-1',
    ]);

    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message).toContain('no --expect declares');
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
