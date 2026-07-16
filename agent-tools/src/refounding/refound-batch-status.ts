#!/usr/bin/env node

import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { isErr } from '@oaknational/result';
import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { decideBatchStatusVerdict } from './refound-batch-status-model.js';
import { runBatchStatus } from './refound-batch-status-helpers.js';
import { outDirUsageText, prepareOutDirEntry } from './refound-entry-args.js';

/**
 * `refound-batch-status` — the recomputed protocol dashboard (R0a cycle 4,
 * strictly last: pure in-process composition of the landed verifiers).
 *
 * Recomputes every stage from the artefacts themselves — the
 * `run-state.v1.json` cache is OVERWRITTEN, never read as truth
 * (`validators-must-recompute`) — and reports the stage lattice
 * `freeze ⊂ inventoried ⊂ tiled` per area, with absent artefacts as
 * explicit `not-reached` states. Any recomputed red or invalid stage exits
 * 1.
 *
 * Flags: `--out <dir>` (the artefact home, default
 * `.agent/plans-refounding`), constrained to the repository.
 *
 * @packageDocumentation
 */

const TOOL = 'refound-batch-status';
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
  const runState = await runBatchStatus({ outDirAbs: entry.value.outDirAbs });
  if (isErr(runState)) {
    writeErrorLine(`${TOOL}: ${runState.error.message}`);
    process.exitCode = 1;
    return;
  }
  const verdict = decideBatchStatusVerdict(runState.value);
  for (const line of verdict.lines) {
    writeLine(`${TOOL}: ${line}`);
  }
  process.exitCode = verdict.exitCode;
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
