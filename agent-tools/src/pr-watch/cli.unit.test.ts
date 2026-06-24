import { describe, expect, it } from 'vitest';

import { parseArgs } from './cli.js';

describe('parseArgs', () => {
  it('captures a bare PR positional with defaults', () => {
    expect(parseArgs(['221'])).toStrictEqual({
      pr: '221',
      json: false,
      watch: false,
      intervalSeconds: 30,
      maxPolls: 240,
      help: false,
    });
  });

  it('captures all flags and values, including the URL positional and --repo', () => {
    const parsed = parseArgs([
      'https://github.com/o/r/pull/7',
      '--repo',
      'o/r',
      '--json',
      '--watch',
      '--interval',
      '15',
      '--max-polls',
      '5',
      '--gh',
      '/abs/gh',
    ]);
    expect(parsed).toStrictEqual({
      pr: 'https://github.com/o/r/pull/7',
      repo: 'o/r',
      json: true,
      watch: true,
      intervalSeconds: 15,
      maxPolls: 5,
      ghPath: '/abs/gh',
      help: false,
    });
  });

  it('omits optional repo/ghPath keys when not supplied', () => {
    const parsed = parseArgs(['221']);
    expect('repo' in parsed).toBe(false);
    expect('ghPath' in parsed).toBe(false);
  });

  it('does not require a positional when --help is present', () => {
    expect(parseArgs(['--help']).help).toBe(true);
  });

  it('throws when no PR positional is given', () => {
    expect(() => parseArgs(['--json'])).toThrow(/exactly one PR/u);
  });

  it('throws when more than one positional is given', () => {
    expect(() => parseArgs(['221', '222'])).toThrow(/exactly one PR/u);
  });

  it('throws on an unknown option', () => {
    expect(() => parseArgs(['221', '--nope'])).toThrow(/unknown option/u);
  });

  it('rejects a non-positive --interval and --max-polls', () => {
    expect(() => parseArgs(['221', '--interval', '0'])).toThrow(
      /--interval requires a positive integer/u,
    );
    expect(() => parseArgs(['221', '--max-polls', 'x'])).toThrow(
      /--max-polls requires a positive integer/u,
    );
  });

  it('throws when a value option is given no value (next token is a flag)', () => {
    expect(() => parseArgs(['221', '--repo', '--json'])).toThrow(/--repo requires a value/u);
  });
});
