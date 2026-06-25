import { describe, expect, it } from 'vitest';

import { parseIsoTimestampMs, parseOptions } from '../../src/collaboration-state/cli-options';

describe('parseOptions — bare-boolean flags', () => {
  it('parses --seed-from-now as a bare-boolean flag without consuming the next token', () => {
    const parsed = parseOptions([
      '--',
      'comms',
      'watch',
      '--seed-from-now',
      '--comms-dir',
      '/fake-test-path/comms',
    ]);

    expect(parsed.values.get('seed-from-now')).toBe('true');
    expect(parsed.values.get('comms-dir')).toBe('/fake-test-path/comms');
  });

  it('parses --no-auto-seed as a bare-boolean flag without consuming the next token', () => {
    const parsed = parseOptions([
      '--',
      'comms',
      'watch',
      '--no-auto-seed',
      '--seen-file',
      '/fake-test-path/seen.json',
    ]);

    expect(parsed.values.get('no-auto-seed')).toBe('true');
    expect(parsed.values.get('seen-file')).toBe('/fake-test-path/seen.json');
  });

  it('parses both --seed-from-now and --no-auto-seed together as bare booleans', () => {
    const parsed = parseOptions([
      '--',
      'comms',
      'watch',
      '--seed-from-now',
      '--no-auto-seed',
      '--comms-dir',
      '/fake-test-path/comms',
    ]);

    expect(parsed.values.get('seed-from-now')).toBe('true');
    expect(parsed.values.get('no-auto-seed')).toBe('true');
    expect(parsed.values.get('comms-dir')).toBe('/fake-test-path/comms');
  });

  it('parses --seed-from-now at the end of argv without consuming a non-existent next token', () => {
    const parsed = parseOptions(['--', 'comms', 'watch', '--seed-from-now']);

    expect(parsed.values.get('seed-from-now')).toBe('true');
  });
});

describe('parseIsoTimestampMs', () => {
  it('parses a valid ISO-8601 timestamp to epoch milliseconds', () => {
    expect(parseIsoTimestampMs('2026-06-25T08:00:00.000Z', 'now')).toBe(
      Date.parse('2026-06-25T08:00:00.000Z'),
    );
  });

  it('fails loud on a malformed timestamp instead of returning NaN (would weaken time gates)', () => {
    expect(() => parseIsoTimestampMs('not-a-date', 'now')).toThrow(/valid ISO-8601/);
  });
});
