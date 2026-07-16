#!/usr/bin/env node

import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { isErr } from '@oaknational/result';

import { resolveRepoRoot } from '../core/repo-root.js';

import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { outDirUsageText, prepareOutDirEntry } from './refound-entry-args.js';
import { verifyFreeze, type VerifyReport } from './refound-verify-freeze-helpers.js';
import { formatViolation } from './refound-verify-freeze-model.js';

/**
 * `refound-verify-freeze` — the standing byte-identity gate over the frozen
 * plan corpus (F1 §5 row 2, §6 layer 2).
 *
 * Re-hashes and recounts every file the denominator names against its frozen
 * copy and enumerates the frozen tree for extras; RED (exit 1) on any hash
 * difference, missing or unreadable file, extra file, per-row recount
 * disagreement, or totals disagreement. It recomputes every claim; it never
 * trusts a recorded green. Intended to join the `repo-validators:check`
 * chain for the refounding run's duration.
 *
 * Flags: `--out <dir>` (default `.agent/plans-refounding`), constrained to
 * the repository (`refound-path-resolve`).
 *
 * @packageDocumentation
 */

const TOOL = 'refound-verify-freeze';
const repoRoot = resolveRepoRoot(import.meta.url);

/** Print the recomputed verdict; RED lists every violation and exits 1. */
function printReport(report: VerifyReport): void {
  if (report.violations.length > 0) {
    writeLine(
      `${TOOL}: RED — ${String(report.violations.length)} violation(s) across ` +
        `${String(report.checkedFiles)} denominator file(s):`,
    );
    for (const violation of report.violations) {
      writeLine(`  ${formatViolation(violation)}`);
    }
    process.exitCode = 1;
    return;
  }
  writeLine(
    `${TOOL}: OK — ${String(report.checkedFiles)} frozen file(s) re-hashed and recounted ` +
      `byte-identical; no missing, unreadable, or extra files; totals recomputed clean.`,
  );
}

async function main(): Promise<void> {
  const entry = prepareOutDirEntry(repoRoot, process.argv.slice(2), TOOL);
  if (isErr(entry)) {
    writeErrorLine(`${TOOL}: ${entry.error.message}`);
    process.exitCode = 1;
    return;
  }
  if (entry.value.help) {
    writeLine(outDirUsageText(TOOL));
    return;
  }
  const report = await verifyFreeze({ outDirAbs: entry.value.outDirAbs });
  if (isErr(report)) {
    writeErrorLine(`${TOOL}: ${report.error.message}`);
    process.exitCode = 1;
    return;
  }
  printReport(report.value);
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
