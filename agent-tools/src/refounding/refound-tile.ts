#!/usr/bin/env node

import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { entryUsageText, parseEntryArgs } from './refound-entry-args.js';
import { DEFAULT_OUT_DIR } from './refound-freeze-helpers.js';
import { resolveReadPathWithinRepo } from './refound-path-resolve.js';
import { runTile, type TileReport } from './refound-tile-helpers.js';
import { formatTilingViolation } from './refound-tile-violations.js';

/**
 * `refound-tile` — the exact-cover tiling verdict over the frozen
 * denominator (F1 §5 row `refound-tile`, D5, P6).
 *
 * A VERIFIER ONLY: reads the effective denominator, the inventory, and the
 * per-area ledgers; writes nothing. GREEN when every line of every frozen
 * text file is covered exactly once by anchor-aligned (or line-1 preamble)
 * blocks and every whole-file/opaque entry takes exactly one whole-span row;
 * RED (exit 1) otherwise, printing full per-kind counts and the first
 * {@link MAX_DETAILED_VIOLATIONS} violations with exact coordinates.
 * Refusals (missing inputs, layer disagreements, unproven amendments, an
 * absent — "not yet tiled" — area ledger) are typed errors, distinct from
 * RED.
 *
 * Flags: `--out <dir>` (default `.agent/plans-refounding`) and
 * `--area <area>` (one area's slice; default the whole denominator).
 *
 * @packageDocumentation
 */

const TOOL = 'refound-tile';
const repoRoot = resolveRepoRoot(import.meta.url);

/** RED verdicts detail at most this many violations (F1 §5: "first 50"). */
const MAX_DETAILED_VIOLATIONS = 50;

const USAGE = entryUsageText(TOOL, '[--out <dir>] [--area <area>]');

/** Parse `--out <dir>` / `--area <area>` under the shared entry contract. */
export function parseTileArgs(
  argv: readonly string[],
): Result<{ outDir: string; area: string; help: boolean }, Error> {
  const parsed = parseEntryArgs(
    argv,
    USAGE,
    { outDir: DEFAULT_OUT_DIR, area: '', areaSupplied: false },
    {
      '--out': (state, value) => {
        state.outDir = value;
      },
      '--area': (state, value) => {
        state.area = value;
        state.areaSupplied = true;
      },
    },
  );
  if (isErr(parsed)) {
    return parsed;
  }
  // An absent `--area` tiles the whole denominator; an explicitly-supplied empty
  // `--area` is a mistake, not a request for whole-denominator scope.
  if (!parsed.value.help && parsed.value.state.areaSupplied && parsed.value.state.area === '') {
    return err(
      new Error(
        '--area was supplied empty; omit the flag to tile the whole denominator, or name an area',
      ),
    );
  }
  return ok({
    outDir: parsed.value.state.outDir,
    area: parsed.value.state.area,
    help: parsed.value.help,
  });
}

/** Constrain the artefact home (which must exist to be verifiable) to the repo. */
function resolveOutDir(outDirFlag: string): Result<string, Error> {
  return resolveReadPathWithinRepo(repoRoot, outDirFlag);
}

/** Full per-kind counts, every kind named (never only the detailed subset). */
function formatKindCounts(report: TileReport): string {
  const counts = new Map<string, number>();
  for (const violation of report.violations) {
    counts.set(violation.kind, (counts.get(violation.kind) ?? 0) + 1);
  }
  return [...counts.entries()].map(([kind, count]) => `${kind}=${String(count)}`).join(', ');
}

/** The entry's decided verdict: the exit code and the exact operator lines. */
export interface TileVerdict {
  readonly exitCode: number;
  readonly lines: readonly string[];
}

/**
 * Decide the tiling verdict — pure, so the exit-code/first-50-truncation
 * contract is unit-testable without capturing stdout: GREEN is exit 0 with one
 * line; RED is exit 1 with a counts header, the first
 * {@link MAX_DETAILED_VIOLATIONS} detailed lines, and a truncation line when
 * more remain. The printer is the only IO.
 */
export function decideTileVerdict(report: TileReport, scope: string): TileVerdict {
  const coverage =
    `${String(report.rows)} ledger row(s) over ${String(report.files)} file(s) in ` +
    `${String(report.areas)} area(s)`;
  if (report.violations.length === 0) {
    return {
      exitCode: 0,
      lines: [`${TOOL}: GREEN — exact cover proven for ${scope}: ${coverage}.`],
    };
  }
  const lines: string[] = [
    `${TOOL}: RED — ${String(report.violations.length)} violation(s) for ${scope} ` +
      `(${coverage}); counts: ${formatKindCounts(report)}`,
  ];
  for (const violation of report.violations.slice(0, MAX_DETAILED_VIOLATIONS)) {
    lines.push(`  ${formatTilingViolation(violation)}`);
  }
  if (report.violations.length > MAX_DETAILED_VIOLATIONS) {
    lines.push(
      `  … ${String(report.violations.length - MAX_DETAILED_VIOLATIONS)} more (full counts above)`,
    );
  }
  return { exitCode: 1, lines };
}

/** Print the recomputed verdict; RED lists the first 50 violations, exit 1. */
function printReport(report: TileReport, scope: string): void {
  const verdict = decideTileVerdict(report, scope);
  for (const line of verdict.lines) {
    writeLine(line);
  }
  process.exitCode = verdict.exitCode;
}

async function main(): Promise<void> {
  const args = parseTileArgs(process.argv.slice(2));
  if (isErr(args)) {
    writeErrorLine(`${TOOL}: ${args.error.message}`);
    process.exitCode = 1;
    return;
  }
  if (args.value.help) {
    writeLine(USAGE);
    return;
  }
  const outDirAbs = resolveOutDir(args.value.outDir);
  if (isErr(outDirAbs)) {
    writeErrorLine(`${TOOL}: ${outDirAbs.error.message}`);
    process.exitCode = 1;
    return;
  }
  const area = args.value.area === '' ? undefined : args.value.area;
  const report = await runTile(
    area === undefined ? { outDirAbs: outDirAbs.value } : { outDirAbs: outDirAbs.value, area },
  );
  if (isErr(report)) {
    writeErrorLine(`${TOOL}: ${report.error.message}`);
    process.exitCode = 1;
    return;
  }
  printReport(report.value, area === undefined ? 'the whole denominator' : `area '${area}'`);
}

/** True when this module is the process's CLI entry (repo-check.ts pattern). */
function isCliEntryPoint(): boolean {
  const entryPoint = process.argv[1];
  if (entryPoint === undefined) {
    return false;
  }
  return import.meta.url === pathToFileURL(path.resolve(entryPoint)).href;
}

if (isCliEntryPoint()) {
  await main();
}
