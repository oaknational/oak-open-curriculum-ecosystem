import { describe, expect, it } from 'vitest';

import { parseOptions } from '../../src/collaboration-state/cli-options';

describe('parseOptions — bare-boolean flags', () => {
  it('parses --seed-from-now as a bare-boolean flag without consuming the next token', () => {
    const parsed = parseOptions([
      '--',
      'comms',
      'watch',
      '--seed-from-now',
      '--comms-dir',
      '/tmp/comms',
    ]);

    expect(parsed.values.get('seed-from-now')).toBe('true');
    expect(parsed.values.get('comms-dir')).toBe('/tmp/comms');
  });

  it('parses --no-auto-seed as a bare-boolean flag without consuming the next token', () => {
    const parsed = parseOptions([
      '--',
      'comms',
      'watch',
      '--no-auto-seed',
      '--seen-file',
      '/tmp/seen.json',
    ]);

    expect(parsed.values.get('no-auto-seed')).toBe('true');
    expect(parsed.values.get('seen-file')).toBe('/tmp/seen.json');
  });

  it('parses both --seed-from-now and --no-auto-seed together as bare booleans', () => {
    const parsed = parseOptions([
      '--',
      'comms',
      'watch',
      '--seed-from-now',
      '--no-auto-seed',
      '--comms-dir',
      '/tmp/comms',
    ]);

    expect(parsed.values.get('seed-from-now')).toBe('true');
    expect(parsed.values.get('no-auto-seed')).toBe('true');
    expect(parsed.values.get('comms-dir')).toBe('/tmp/comms');
  });

  it('parses --seed-from-now at the end of argv without consuming a non-existent next token', () => {
    const parsed = parseOptions(['--', 'comms', 'watch', '--seed-from-now']);

    expect(parsed.values.get('seed-from-now')).toBe('true');
  });
});
