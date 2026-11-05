import { describe, expect, it } from 'vitest';

import { GH_SEARCH_RESULT_CAP } from './cli-args.js';
import {
  DEFAULT_REGISTER_PATH,
  parsePrThroughputArgs,
  runPrThroughput,
  type PrThroughputDeps,
} from './cli.js';
import { REGISTER_HEADER } from './index.js';

const NOW = new Date('2026-07-20T20:00:00Z');

const CORPUS = JSON.stringify([
  {
    number: 429,
    createdAt: '2026-07-20T08:14:00Z',
    mergedAt: '2026-07-20T19:19:49Z',
    headRefName: 'jimcresswell/aip-137-dtcg-css-consistency-validator',
  },
  {
    number: 434,
    createdAt: '2026-07-19T08:00:00Z',
    mergedAt: '2026-07-20T18:00:00Z',
    headRefName: 'coordination/estate-2026-07',
  },
]);

function fakeDeps(input?: {
  readonly executor?: PrThroughputDeps['executor'];
  readonly registerExists?: boolean;
  readonly registerHead?: string;
}): {
  deps: PrThroughputDeps;
  writes: { path: string; content: string }[];
  outputLines: string[];
  errorLines: string[];
} {
  const writes: { path: string; content: string }[] = [];
  const outputLines: string[] = [];
  const errorLines: string[] = [];

  return {
    writes,
    outputLines,
    errorLines,
    deps: {
      executor: input?.executor ?? (() => CORPUS),
      createRegister: (path, header) => {
        if (input?.registerExists === true) {
          return false;
        }

        writes.push({ path, content: header });
        return true;
      },
      appendRegisterRow: (path, row) => {
        writes.push({ path, content: row });
      },
      readRegisterHead: (_path, length) =>
        (input?.registerHead ?? REGISTER_HEADER).slice(0, length),
      writeLine: (message) => {
        outputLines.push(message);
      },
      writeError: (message) => {
        errorLines.push(message);
      },
    },
  };
}

describe('parsePrThroughputArgs', () => {
  it('defaults to a 7-day window, no write, and the tracked register path', () => {
    const options = parsePrThroughputArgs([], NOW);

    expect(options.windowDays).toBe(7);
    expect(options.write).toBe(false);
    expect(options.registerPath).toBe(DEFAULT_REGISTER_PATH);
  });

  it('rejects unknown flags loudly so a typo never silently no-ops', () => {
    expect(() => parsePrThroughputArgs(['--windowdays', '7'], NOW)).toThrow(/unknown flag/u);
  });

  it('rejects malformed integers that parseInt would silently truncate', () => {
    expect(() => parsePrThroughputArgs(['--window-days', '7days'], NOW)).toThrow(
      /positive integer/u,
    );
    expect(() => parsePrThroughputArgs(['--limit', '1.5'], NOW)).toThrow(/positive integer/u);
  });

  it('accepts the proleptic-Gregorian leap date 0000-02-29 (no Date.UTC year remapping)', () => {
    // Date.UTC remaps years 0-99 to 1900-1999; the calendar validator must
    // not inherit that and reject a valid ISO leap date.
    expect(parsePrThroughputArgs(['--now', '0000-02-29T00:00:00Z'], NOW).now.toISOString()).toBe(
      '0000-02-29T00:00:00.000Z',
    );
  });

  it('rejects a calendar-invalid or non-ISO --now instead of normalising it', () => {
    expect(() => parsePrThroughputArgs(['--now', '2026-02-30T10:00:00Z'], NOW)).toThrow(
      /invalid ISO date-time/u,
    );
    expect(() => parsePrThroughputArgs(['--now', 'July 20 2026'], NOW)).toThrow(
      /invalid ISO date-time/u,
    );
  });

  it('rejects a flag-shaped token as a missing value instead of consuming it', () => {
    // '--note --write' must not record '--write' as the note and silently
    // disable the requested write.
    expect(() => parsePrThroughputArgs(['--note', '--write'], NOW)).toThrow(/requires a value/u);
    expect(() => parsePrThroughputArgs(['--register', '--write'], NOW)).toThrow(
      /requires a value/u,
    );
  });

  it('rejects non-positive window sizes', () => {
    expect(() => parsePrThroughputArgs(['--window-days', '0'], NOW)).toThrow(/positive integer/u);
  });

  it('rejects --limit above the gh search-result cap so a truncated corpus can never pass as complete', () => {
    // gh serves `--search` from the Search API (hard cap: 1,000 results). A
    // larger --limit would let a capped 1,000-row corpus satisfy
    // `length < limit` and write plausible-but-truncated metrics.
    expect(() => parsePrThroughputArgs(['--limit', String(GH_SEARCH_RESULT_CAP + 1)], NOW)).toThrow(
      /search-result cap/u,
    );
    expect(parsePrThroughputArgs(['--limit', String(GH_SEARCH_RESULT_CAP)], NOW).limit).toBe(
      GH_SEARCH_RESULT_CAP,
    );
  });
});

describe('runPrThroughput', () => {
  it('prints the full usage block and exits 0 on --help', () => {
    const { deps, outputLines } = fakeDeps();

    expect(runPrThroughput(['--help'], deps)).toBe(0);
    expect(outputLines.join('\n')).toContain('Usage: pnpm agent-tools:pr-throughput');
    expect(outputLines.join('\n')).toContain('--window-days');
    expect(outputLines.join('\n')).toContain('Example:');
  });

  it('prints the error AND the full usage, exiting non-zero, on an invalid argument', () => {
    // Argument errors follow the CLI help contract, not the
    // fitness-informational path — a typo must be loud AND non-zero.
    const { deps, errorLines } = fakeDeps();

    expect(runPrThroughput(['--windowdays', '7'], deps)).toBe(2);
    expect(errorLines.join('\n')).toContain('unknown flag');
    expect(errorLines.join('\n')).toContain('Usage: pnpm agent-tools:pr-throughput');
  });

  it('exits 0 and appends a register row on --write, excluding the coordination tracker', () => {
    const { deps, writes } = fakeDeps();

    const exitCode = runPrThroughput(
      ['--write', '--now', NOW.toISOString(), '--note', 'founding window'],
      deps,
    );

    expect(exitCode).toBe(0);
    // Header creation (register absent) then one appended row — never a
    // read-modify-overwrite of the whole file.
    expect(writes).toHaveLength(2);
    expect(writes[0].path).toBe(DEFAULT_REGISTER_PATH);
    expect(writes[0].content).toBe(REGISTER_HEADER);
    // #429 counts (665.8 minutes open-to-merged, rounded); the coordination
    // tracker does not.
    expect(writes[1].content).toBe(
      '| 2026-07-20 | 7d | 1 | 0.14 | 666 | 666 | founding window |\n',
    );
  });

  it('appends WITHOUT re-writing the header when the register already exists', () => {
    const { deps, writes, errorLines } = fakeDeps({ registerExists: true });

    expect(runPrThroughput(['--write', '--now', NOW.toISOString()], deps)).toBe(0);
    expect(writes).toHaveLength(1);
    expect(writes[0].content.endsWith('\n')).toBe(true);
    expect(errorLines).toHaveLength(0);
  });

  it('reports loudly when an existing register head has drifted from REGISTER_HEADER', () => {
    // Single-source contract checked where the two copies meet: never
    // destructive (the row still appends, exit stays 0), never silent.
    const { deps, writes, errorLines } = fakeDeps({
      registerExists: true,
      registerHead: '# some drifted header\n',
    });

    expect(runPrThroughput(['--write', '--now', NOW.toISOString()], deps)).toBe(0);
    expect(errorLines.join('\n')).toContain('DRIFTED');
    expect(writes).toHaveLength(1);
  });

  it('exits 0 WITHOUT writing when --write is absent', () => {
    const { deps, writes } = fakeDeps();

    expect(runPrThroughput(['--now', NOW.toISOString()], deps)).toBe(0);
    expect(writes).toHaveLength(0);
  });

  it('exits 0 when the register write itself throws — the contract covers the file edge', () => {
    const { deps, errorLines } = fakeDeps();
    const throwingDeps = {
      ...deps,
      appendRegisterRow: () => {
        throw new Error('EACCES: permission denied');
      },
    };

    expect(runPrThroughput(['--write', '--now', NOW.toISOString()], throwingDeps)).toBe(0);
    // The other half of the contract: the failure is LOUD, with the
    // contract named — exit 0 alone must never read as a quiet pass.
    expect(errorLines.join('\n')).toContain('FAILED');
    expect(errorLines.join('\n')).toContain('EACCES');
    expect(errorLines.join('\n')).toContain('fitness-informational contract');
  });

  it('exits 0 on a transport failure — informational contract — and writes nothing', () => {
    const { deps, writes, errorLines } = fakeDeps({
      executor: () => {
        throw new Error('HTTP 403 rate limit');
      },
    });

    expect(runPrThroughput(['--write', '--now', NOW.toISOString()], deps)).toBe(0);
    expect(writes).toHaveLength(0);
    expect(errorLines.join('\n')).toContain('FAILED');
    expect(errorLines.join('\n')).toContain('fitness-informational contract');
  });
});
