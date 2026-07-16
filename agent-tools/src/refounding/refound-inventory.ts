#!/usr/bin/env node

import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { isErr } from '@oaknational/result';

import { resolveRepoRoot } from '../core/repo-root.js';

import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { outDirUsageText, prepareOutDirEntry } from './refound-entry-args.js';
import { INVENTORY_BASENAME, NET_DIFF_BASENAME } from './refound-inventory-model.js';
import { runInventory } from './refound-inventory-runner.js';

/**
 * `refound-inventory` — the scripted line-level inventory over the frozen
 * plan corpus (F1 §4, §5 row 3).
 *
 * Runs the three overlapping deterministic nets (A structure, B rows, C
 * fixed keywords) over every `inventory_mode: lines` file the denominator
 * names, writing `inventory.v1.jsonl` (verbatim captures, sorted by
 * (file, line)) and `net-diff.v1.report.json` (per-net unique captures — the
 * omission-detector feed). Halts with the named H2 error, nothing written,
 * when the whole-corpus anchor ratio falls outside the 20–70% sanity band,
 * and on any line-recount disagreement with the denominator.
 *
 * Flags: `--out <dir>` (default `.agent/plans-refounding`), constrained to
 * the repository (`refound-path-resolve`).
 *
 * @packageDocumentation
 */

const TOOL = 'refound-inventory';
const repoRoot = resolveRepoRoot(import.meta.url);

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
  const summary = await runInventory({ outDirAbs: entry.value.outDirAbs });
  if (isErr(summary)) {
    writeErrorLine(`${TOOL}: ${summary.error.message}`);
    process.exitCode = 1;
    return;
  }
  writeLine(
    `${TOOL}: scanned ${String(summary.value.mdFiles)} md file(s), ` +
      `${String(summary.value.mdLines)} line(s); ${String(summary.value.anchors)} anchor(s), ` +
      `ratio ${String(summary.value.anchorRatioPercent)}% (band 20%-70%).`,
  );
  writeLine(
    `${TOOL}: wrote ${INVENTORY_BASENAME} and ${NET_DIFF_BASENAME} under ${entry.value.outDir}.`,
  );
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
