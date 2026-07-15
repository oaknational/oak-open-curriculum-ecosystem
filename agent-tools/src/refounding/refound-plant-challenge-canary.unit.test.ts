import { describe, expect, it } from 'vitest';

import { parseCanaryArgs } from './refound-plant-challenge-canary.js';

/**
 * Unit proofs for the canary entry's arg contract: the shared run-nothing
 * `--help` verdict must win over the entry's own mode validation (a help
 * probe must never require a valid run configuration — the founding
 * incident's failure class), while a non-help run still refuses a missing
 * or unknown mode.
 */

describe('parseCanaryArgs — shared entry contract', () => {
  it.each(['--help', '-h'])('lets %s win over mode validation (run-nothing verdict)', (flag) => {
    const parsed = parseCanaryArgs([flag]);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.help).toBe(true);
    }
  });

  it('refuses a missing mode on a non-help run', () => {
    const parsed = parseCanaryArgs([]);
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.error.message).toContain('--mode must be plant, seal, or score');
    }
  });

  it('refuses an unknown mode on a non-help run', () => {
    expect(parseCanaryArgs(['--mode', 'audit']).ok).toBe(false);
  });

  it('accepts a valid mode with help false', () => {
    const parsed = parseCanaryArgs(['--mode', 'seal', '--keys', 'k.jsonl']);
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.value.help).toBe(false);
      expect(parsed.value.args.mode).toBe('seal');
      expect(parsed.value.args.keysPath).toBe('k.jsonl');
    }
  });

  it.each([[['--']], [['--', '--help']]])(
    'refuses the -- terminator instead of silently swallowing what follows it (argv %j)',
    (argv) => {
      const parsed = parseCanaryArgs(argv);
      expect(parsed.ok).toBe(false);
      if (!parsed.ok) {
        expect(parsed.error.message).toContain('takes no positional arguments');
      }
    },
  );

  it('rejects an unknown flag rather than silently ignoring it', () => {
    expect(parseCanaryArgs(['--mode', 'plant', '--rates', '10']).ok).toBe(false);
  });
});
