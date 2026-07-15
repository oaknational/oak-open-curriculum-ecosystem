#!/usr/bin/env node

import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { isErr } from '@oaknational/result';
import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { runDefaultLedger } from './refound-default-ledger-helpers.js';
import { outDirUsageText, prepareOutDirEntry } from './refound-entry-args.js';
import { DEFAULT_BLOCK_DISPOSITION, LEDGER_DIR_SEGMENT } from './refound-ledger-row.js';

/**
 * `refound-default-ledger` — the per-area sentinel-ledger emitter (a
 * separate small entry, deliberately NOT a mode of `refound-tile`: the
 * verifier writes nothing, ever).
 *
 * Derives `ledger/<area>.ledger.jsonl` deterministically from the effective
 * denominator plus the inventory's anchors, reusing the landed residue
 * clustering (`buildFileBlocks`). Every row carries the mechanical sentinel
 * disposition `default-block` — asserting the ABSENCE of judgement — with
 * coordinate-derived block ids and empty `home`/`binding` (which the
 * challenge boundary keeps refusing). Refuses — nothing written — on missing
 * inputs, layer disagreements, unproven amendments, or ANY pre-existing
 * target ledger.
 *
 * Flags: `--out <dir>` (default `.agent/plans-refounding`), constrained to
 * the repository (`refound-path-resolve`).
 *
 * @packageDocumentation
 */

const TOOL = 'refound-default-ledger';
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
  const summary = await runDefaultLedger({ outDirAbs: entry.value.outDirAbs });
  if (isErr(summary)) {
    writeErrorLine(`${TOOL}: ${summary.error.message}`);
    process.exitCode = 1;
    return;
  }
  writeLine(
    `${TOOL}: wrote ${String(summary.value.rows)} '${DEFAULT_BLOCK_DISPOSITION}' sentinel ` +
      `row(s) across ${String(summary.value.areas)} area ledger(s) under ` +
      `${entry.value.outDir}/${LEDGER_DIR_SEGMENT}; every row asserts the ABSENCE of judgement.`,
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
