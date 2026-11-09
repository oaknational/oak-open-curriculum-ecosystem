/**
 * Argument parsing for the `pr-throughput` CLI — fail-loud by construction:
 * unknown flags, flag-shaped values, malformed integers, and non-ISO or
 * calendar-invalid `--now` overrides all refuse rather than silently
 * producing a valid-looking report for the wrong question.
 *
 * @packageDocumentation
 */
import { requireIsoDateTime } from '../core/iso-date-time.js';

export const DEFAULT_REGISTER_PATH = '.agent/reports/agentic-engineering/pr-throughput-register.md';

/**
 * gh serves `pr list --search` from the GitHub Search API, which hard-caps
 * result sets at 1,000 rows regardless of `--limit`. Limits above the cap
 * would let a truncated corpus satisfy the `length < limit` coverage check.
 */
export const GH_SEARCH_RESULT_CAP = 1000;

/** Full help block per the agent-tools CLI help contract (README §CLI Norms). */
export const USAGE = `Usage: pnpm agent-tools:pr-throughput [-- <options>]

PDR-131 throughput register: computes merges-to-main/day and open-to-merged
cycle-time percentiles over a trailing window, and renders one dated register
row. Fitness-informational: runtime/measurement failures report loudly and
still exit 0; only argument errors exit non-zero.

Options (all optional):
  --window-days <n>   Trailing window in days (positive integer; default 7)
  --limit <n>         Max PRs to fetch (positive integer <= ${String(GH_SEARCH_RESULT_CAP)},
                      the gh search-result cap; default 200)
  --write             Append the row to the tracked register (default: print only)
  --register <path>   Register path (default ${DEFAULT_REGISTER_PATH})
  --note <text>       Free-text note for the row (pipes/line breaks sanitised)
  --now <iso>         ISO-8601 date-time override for the window end (default: now)
  --help              Print this help and exit 0

Example:
  pnpm agent-tools:pr-throughput -- --window-days 7 --note "weekly reading" --write`;

export interface PrThroughputOptions {
  readonly windowDays: number;
  readonly limit: number;
  readonly write: boolean;
  readonly registerPath: string;
  readonly note: string;
  readonly now: Date;
}

interface MutablePrThroughputOptions {
  windowDays: number;
  limit: number;
  write: boolean;
  registerPath: string;
  note: string;
  now: Date;
}

/** Parse argv; unknown flags fail loud (a typo must never silently no-op). */
export function parsePrThroughputArgs(argv: readonly string[], now: Date): PrThroughputOptions {
  const options: MutablePrThroughputOptions = {
    windowDays: 7,
    limit: 200,
    write: false,
    registerPath: DEFAULT_REGISTER_PATH,
    note: '',
    now,
  };
  let index = 0;

  while (index < argv.length) {
    const flag = argv[index];
    const value = argv[index + 1];

    if (flag === '--write') {
      options.write = true;
      index += 1;
      continue;
    }

    // A flag-shaped token is a MISSING value, not a value: `--note --write`
    // would otherwise record '--write' as the note and silently disable the
    // requested write.
    if (value === undefined || value.startsWith('--')) {
      throw new Error(`${flag} requires a value`);
    }

    applyValueFlag(options, flag, value);
    index += 2;
  }

  return options;
}

function applyValueFlag(options: MutablePrThroughputOptions, flag: string, value: string): void {
  if (flag === '--window-days') {
    options.windowDays = parsePositiveInteger(flag, value);
  } else if (flag === '--limit') {
    options.limit = parseSearchLimit(flag, value);
  } else if (flag === '--register') {
    options.registerPath = value;
  } else if (flag === '--note') {
    options.note = value;
  } else if (flag === '--now') {
    options.now = parseIsoDate(value);
  } else {
    throw new Error(`unknown flag: ${flag}`);
  }
}

function parsePositiveInteger(flag: string, value: string): number {
  // Full-token validation: Number.parseInt would silently accept '7days',
  // '1.5', or '1e2' and report from a wrong-looking-right window.
  if (!/^\d+$/u.test(value)) {
    throw new Error(`${flag} requires a positive integer, got: ${value}`);
  }

  const parsed = Number.parseInt(value, 10);

  if (!Number.isSafeInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} requires a positive integer, got: ${value}`);
  }

  return parsed;
}

function parseSearchLimit(flag: string, value: string): number {
  const parsed = parsePositiveInteger(flag, value);

  if (parsed > GH_SEARCH_RESULT_CAP) {
    throw new Error(
      `${flag} must not exceed ${GH_SEARCH_RESULT_CAP} (the gh search-result cap), got: ${value}`,
    );
  }

  return parsed;
}

function parseIsoDate(value: string): Date {
  // Strict shape + calendar validation — Date.parse alone would let a
  // mistyped override write a valid-looking row for a different instant.
  return new Date(Date.parse(requireIsoDateTime(value, '--now')));
}
