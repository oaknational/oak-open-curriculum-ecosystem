import { describe, expect, it } from 'vitest';

import { parseGateSlotArgv } from './gate-slot-argv.js';

/**
 * The gate-slot command line. `run` takes a pnpm command and passes every
 * argument after `pnpm` through untouched, so a flag meant for pnpm is never
 * read as gate-slot's own; anything else is a usage error, never a silent
 * success that would skip the gate.
 */

describe('parseGateSlotArgv', () => {
  it('passes every argument after pnpm through verbatim', () => {
    expect(
      parseGateSlotArgv([
        'run',
        'pnpm',
        '--fail-if-no-match',
        '--filter',
        '@jimcresswell/www',
        'test:e2e',
      ]),
    ).toStrictEqual({
      kind: 'run',
      pnpmArgs: ['--fail-if-no-match', '--filter', '@jimcresswell/www', 'test:e2e'],
    });
  });

  it('gives a help flag after pnpm to pnpm', () => {
    expect(parseGateSlotArgv(['run', 'pnpm', '--help'])).toStrictEqual({
      kind: 'run',
      pnpmArgs: ['--help'],
    });
  });

  it('reads --help and -h before a subcommand as a request for usage', () => {
    expect(parseGateSlotArgv(['--help'])).toStrictEqual({ kind: 'help' });
    expect(parseGateSlotArgv(['-h'])).toStrictEqual({ kind: 'help' });
  });

  it('reads status with no arguments', () => {
    expect(parseGateSlotArgv(['status'])).toStrictEqual({ kind: 'status' });
  });

  it.each([
    { name: 'no arguments', argv: [] },
    { name: 'an unknown subcommand', argv: ['acquire'] },
    { name: 'run with no command', argv: ['run'] },
    { name: 'run with pnpm alone', argv: ['run', 'pnpm'] },
    { name: 'run with a command other than pnpm', argv: ['run', 'node', 'script.js'] },
    { name: 'run with a separator before the command', argv: ['run', '--', 'pnpm', 'check'] },
    { name: 'status with an argument', argv: ['status', '--json'] },
  ])('refuses $name as a usage error', ({ argv }) => {
    expect(parseGateSlotArgv(argv)).toMatchObject({ kind: 'usage-error' });
  });
});
