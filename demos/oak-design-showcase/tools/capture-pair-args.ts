/**
 * Argument parsing for capture-pair — pure, and the boundary where every
 * knob is validated (canonical width via DDR-009's seam, the window and
 * threshold floors, and the `--null-runs` two-capture floor below which
 * the empirical null's floor claim would be vacuous).
 */
import { err, ok, type Result } from '@oaknational/result';

import { assertCanonicalWidth } from './measurement-widths';
import type { CapturePairConfig } from './capture-shared';

/** argv as --flag value pairs. */
function collectFlags(argv: readonly string[]): Result<ReadonlyMap<string, string>, string> {
  const flags = new Map<string, string>();
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (key === undefined || !key.startsWith('--') || value === undefined) {
      return err(`arguments come in --flag value pairs; saw '${key ?? ''} ${value ?? ''}'`);
    }
    flags.set(key.slice(2), value);
  }
  return ok(flags);
}

function requireUrls(
  flags: ReadonlyMap<string, string>,
): Result<Pick<CapturePairConfig, 'left' | 'right' | 'out'>, string> {
  const left = flags.get('left');
  const right = flags.get('right');
  const out = flags.get('out');
  if (left === undefined || right === undefined || out === undefined) {
    return err('required: --left <url> --right <url> --out <dir>');
  }
  return ok({ left, right, out });
}

function parseWindow(flags: ReadonlyMap<string, string>): Result<number, string> {
  const window = Number(flags.get('window') ?? 32);
  return !Number.isInteger(window) || window < 4
    ? err(`--window must be an integer ≥ 4, saw '${flags.get('window') ?? ''}'`)
    : ok(window);
}

function parseThreshold(flags: ReadonlyMap<string, string>): Result<number, string> {
  const threshold = Number(flags.get('threshold') ?? 6);
  return !Number.isFinite(threshold) || threshold <= 0
    ? err(`--threshold must be a positive number, saw '${flags.get('threshold') ?? ''}'`)
    : ok(threshold);
}

/** k ≥ 2 when present: below two repeat captures the null has one pair
 *  and the floor claim is vacuous. Absent = the naive arm. */
function parseNullRuns(flags: ReadonlyMap<string, string>): Result<number | undefined, string> {
  const raw = flags.get('null-runs');
  if (raw === undefined) {
    return ok(undefined);
  }
  const nullRuns = Number(raw);
  return !Number.isInteger(nullRuns) || nullRuns < 2
    ? err(`--null-runs must be an integer ≥ 2, saw '${raw}'`)
    : ok(nullRuns);
}

/** The numeric knobs, validated together. */
function parseNumericFlags(
  flags: ReadonlyMap<string, string>,
): Result<{ window: number; threshold: number; nullRuns: number | undefined }, string> {
  const window = parseWindow(flags);
  if (!window.ok) {
    return window;
  }
  const threshold = parseThreshold(flags);
  if (!threshold.ok) {
    return threshold;
  }
  const nullRuns = parseNullRuns(flags);
  if (!nullRuns.ok) {
    return nullRuns;
  }
  return ok({ window: window.value, threshold: threshold.value, nullRuns: nullRuns.value });
}

/** Parse argv into a validated config. Pure. */
export function parseCapturePairArgs(argv: readonly string[]): Result<CapturePairConfig, string> {
  const flags = collectFlags(argv);
  if (!flags.ok) {
    return flags;
  }
  const urls = requireUrls(flags.value);
  if (!urls.ok) {
    return urls;
  }
  const width = assertCanonicalWidth(Number(flags.value.get('width') ?? Number.NaN));
  if (!width.ok) {
    return err(width.error);
  }
  const numbers = parseNumericFlags(flags.value);
  if (!numbers.ok) {
    return numbers;
  }
  return ok({
    ...urls.value,
    width: width.value,
    tag: flags.value.get('tag') ?? 'pair',
    window: numbers.value.window,
    threshold: numbers.value.threshold,
    ...(numbers.value.nullRuns === undefined ? {} : { nullRuns: numbers.value.nullRuns }),
  });
}
