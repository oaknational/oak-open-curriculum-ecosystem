import { unwrap, unwrapErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { decideTileVerdict, parseTileArgs } from './refound-tile.js';
import { type TileReport } from './refound-tile-helpers.js';
import { type TilingViolation } from './refound-tile-violations.js';

/**
 * Unit proofs for `refound-tile`'s two pure decision points (test-I3, F1 §5):
 * the verdict→exit-code/first-50-truncation contract, and the empty-`--area`
 * refusal. Both are pure — no stdout capture, no filesystem.
 */

const report = (violations: readonly TilingViolation[]): TileReport => ({
  areas: 1,
  files: 1,
  rows: violations.length,
  violations,
});

const gap = (lineStart: number): TilingViolation => ({
  kind: 'gap',
  file: 'plans/alpha/a.md',
  lineStart,
  lineEnd: lineStart,
});

describe('decideTileVerdict — exit code and truncation contract', () => {
  it('GREEN (no violations) decides exit 0 with a single line', () => {
    const verdict = decideTileVerdict(report([]), 'the whole denominator');
    expect(verdict.exitCode).toBe(0);
    expect(verdict.lines).toHaveLength(1);
    expect(verdict.lines[0]).toContain('GREEN');
  });

  it('RED (any violation) decides exit 1 and details each violation', () => {
    const verdict = decideTileVerdict(report([gap(1), gap(2)]), "area 'plans--alpha'");
    expect(verdict.exitCode).toBe(1);
    expect(verdict.lines[0]).toContain('RED');
    // one header line + one detail line per violation, no truncation under 50.
    expect(verdict.lines).toHaveLength(3);
    expect(verdict.lines.some((line) => line.includes('more (full counts above)'))).toBe(false);
  });

  it('caps details at the first 50 and emits a truncation line beyond that', () => {
    const violations = Array.from({ length: 55 }, (_, index) => gap(index + 1));
    const verdict = decideTileVerdict(report(violations), 'the whole denominator');
    expect(verdict.exitCode).toBe(1);
    // header + 50 detail lines + 1 truncation line.
    expect(verdict.lines).toHaveLength(52);
    const truncation = verdict.lines.at(-1);
    expect(truncation).toContain('5 more (full counts above)');
  });
});

describe('parseTileArgs — empty --area refusal', () => {
  it('refuses an explicitly-supplied empty --area', () => {
    const error = unwrapErr(parseTileArgs(['--area', '']));
    expect(error.message).toContain('--area was supplied empty');
  });

  it('treats an absent --area as the whole denominator (empty string sentinel)', () => {
    expect(unwrap(parseTileArgs([])).area).toBe('');
  });

  it('accepts a named --area', () => {
    expect(unwrap(parseTileArgs(['--area', 'plans--alpha'])).area).toBe('plans--alpha');
  });
});

describe('parseTileArgs — shared entry contract', () => {
  it.each(['--help', '-h'])('recognises %s as a run-nothing short-circuit request', (flag) => {
    expect(unwrap(parseTileArgs([flag])).help).toBe(true);
  });

  it('reports help false on an ordinary run', () => {
    expect(unwrap(parseTileArgs(['--area', 'plans--alpha'])).help).toBe(false);
  });

  it('lets the --help verdict win over the empty --area refusal (run-nothing beats validation)', () => {
    expect(unwrap(parseTileArgs(['--help', '--area', ''])).help).toBe(true);
  });

  it.each([[['--']], [['--', '--help']]])(
    'refuses the -- terminator instead of silently swallowing what follows it (argv %j)',
    (argv) => {
      expect(unwrapErr(parseTileArgs(argv)).message).toContain('takes no positional arguments');
    },
  );

  it('rejects an unknown flag rather than silently ignoring it', () => {
    expect(parseTileArgs(['--rule', 'r.json']).ok).toBe(false);
  });
});
