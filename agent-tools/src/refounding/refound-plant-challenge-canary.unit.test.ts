import { unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { parseCanaryArgs } from './refound-plant-challenge-canary.js';
import { unwrapErr } from './test-helpers.js';

/**
 * Unit proofs for the canary entry's arg contract: the shared run-nothing
 * `--help` verdict must win over the entry's own mode validation (a help
 * probe must never require a valid run configuration — the founding
 * incident's failure class), while a non-help run still refuses a missing
 * or unknown mode.
 */

describe('parseCanaryArgs — shared entry contract', () => {
  it.each(['--help', '-h'])('lets %s win over mode validation (run-nothing verdict)', (flag) => {
    expect(unwrap(parseCanaryArgs([flag])).help).toBe(true);
  });

  it('refuses a missing mode on a non-help run', () => {
    const error = unwrapErr(parseCanaryArgs([]));
    expect(error.message).toContain('--mode must be plant, seal, or score');
  });

  it('refuses an unknown mode on a non-help run', () => {
    expect(parseCanaryArgs(['--mode', 'audit']).ok).toBe(false);
  });

  it('accepts a valid mode with help false', () => {
    const value = unwrap(parseCanaryArgs(['--mode', 'seal', '--keys', 'k.jsonl']));
    expect(value.help).toBe(false);
    expect(value.args.mode).toBe('seal');
    expect(value.args.keysPath).toBe('k.jsonl');
  });

  it.each([[['--']], [['--', '--help']]])(
    'refuses the -- terminator instead of silently swallowing what follows it (argv %j)',
    (argv) => {
      expect(unwrapErr(parseCanaryArgs(argv)).message).toContain('takes no positional arguments');
    },
  );

  it('rejects an unknown flag rather than silently ignoring it', () => {
    expect(parseCanaryArgs(['--mode', 'plant', '--rates', '10']).ok).toBe(false);
  });
});
