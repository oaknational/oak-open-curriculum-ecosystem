/**
 * CLI: read a committed META stage result checkpoint and write the final fix-ledger.
 *
 * @remarks
 * Reads the meta stage's own `MetaResult` checkpoint JSON (re-validated with
 * `parseMetaResult` — the Node-side boundary re-parses everything it reads back), then
 * writes `fix-ledger.v1.json` + `fix-ledger.v1.md` via `render-ledger.ts`. Implements
 * the repository CLI help contract (README §CLI help contract): `--help` prints the
 * full usage block and exits 0; flag misuse prints the error AND the block, non-zero;
 * unreadable or malformed checkpoint JSON fails with a controlled, path-specific
 * message, never a raw stack.
 *
 * @packageDocumentation
 */

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import {
  resolveReadPathWithinRepo,
  resolveWriteTargetWithinRepo,
} from '../core/flag-path-resolve.js';
import { parseFlags } from '../core/parse-flags.js';
import { resolveRepoRoot } from '../core/repo-root.js';
import type { LedgerRow } from './ledger-rows.js';
import { renderLedgerJson, renderLedgerMarkdown } from './render-ledger.js';
import { parseMetaResult } from './workflows/stage-io.js';

/** The full usage block the agent-tools help contract requires (README §CLI help contract). */
const USAGE = `Usage: pnpm restatement-audit-render-ledger --meta-result <meta.result.json> --out-dir <dir>

Read a committed META stage result checkpoint and write the final fix-ledger
(fix-ledger.v1.json + fix-ledger.v1.md) into the output directory (created if
absent). Relative flag paths resolve against the repository root; both paths
must stay inside the repository (traversal and symlink escapes refuse,
tssecurity:S8707).

Required:
  --meta-result <path>   Committed MetaResult checkpoint JSON (REQUIRED;
                         re-validated on read — a failed or malformed
                         checkpoint refuses with a named reason).
  --out-dir <path>       Output directory for the two ledger files (REQUIRED).

Other:
  --help                 Print this usage block and exit 0.

Example:
  pnpm restatement-audit-render-ledger --meta-result .agent/reports/restatement-audit/meta.result.json --out-dir .agent/reports/restatement-audit
`;

/** Print the error AND the full usage block, then flag a non-zero exit (help contract). */
function failWithUsage(message: string): void {
  process.stderr.write(`${message}\n\n${USAGE}`);
  process.exitCode = 1;
}

/** Runtime failures (unreadable/malformed checkpoint) are not flag misuse — no usage block. */
function fail(message: string): void {
  process.stderr.write(`${message}\n`);
  process.exitCode = 1;
}

interface CliFlags {
  readonly metaResultPath: string;
  readonly outDir: string;
}

function parseCliFlags(): Result<CliFlags, Error> {
  const flags = parseFlags({
    options: {
      'meta-result': { type: 'string' },
      'out-dir': { type: 'string' },
    },
  });
  if (!flags.ok) {
    return flags;
  }
  const metaResultPath = flags.value['meta-result'];
  const outDir = flags.value['out-dir'];
  if (metaResultPath === undefined || outDir === undefined) {
    return err(new Error('Missing required flag(s): --meta-result and --out-dir are REQUIRED.'));
  }
  return ok({ metaResultPath, outDir });
}

/** Read + JSON-parse the checkpoint behind a controlled boundary — never a raw stack. */
async function readCheckpoint(filePath: string): Promise<Result<unknown, Error>> {
  try {
    const parsed: unknown = JSON.parse(await readFile(filePath, 'utf8'));
    return ok(parsed);
  } catch (cause) {
    return err(
      new Error(
        `Failed to read or parse the meta-result checkpoint at ${filePath}: ${cause instanceof Error ? cause.message : String(cause)}`,
        { cause },
      ),
    );
  }
}

/** Resolve both flag paths against the repo root, refusing escapes (S8707). */
function resolvePaths(flags: CliFlags): Result<{ metaResult: string; outDir: string }, Error> {
  const repoRoot = resolveRepoRoot(import.meta.url);
  const safeMetaResult = resolveReadPathWithinRepo(repoRoot, flags.metaResultPath);
  if (!safeMetaResult.ok) {
    return safeMetaResult;
  }
  const safeOutDir = resolveWriteTargetWithinRepo(repoRoot, flags.outDir);
  if (!safeOutDir.ok) {
    return safeOutDir;
  }
  return ok({ metaResult: safeMetaResult.value, outDir: safeOutDir.value });
}

/** Load the checkpoint and re-validate it down to the successful ledger rows. */
async function loadLedgerRows(filePath: string): Promise<Result<readonly LedgerRow[], Error>> {
  const raw = await readCheckpoint(filePath);
  if (!raw.ok) {
    return raw;
  }
  const parsed = parseMetaResult(raw.value);
  if (!parsed.ok) {
    return parsed;
  }
  if (!parsed.value.ok) {
    return err(new Error(`meta stage did not succeed: ${parsed.value.error}`));
  }
  return ok(parsed.value.rows);
}

async function renderLedger(flags: CliFlags): Promise<void> {
  const paths = resolvePaths(flags);
  if (!paths.ok) {
    fail(paths.error.message);
    return;
  }
  const rows = await loadLedgerRows(paths.value.metaResult);
  if (!rows.ok) {
    fail(rows.error.message);
    return;
  }
  await mkdir(paths.value.outDir, { recursive: true });
  const jsonPath = path.join(paths.value.outDir, 'fix-ledger.v1.json');
  const mdPath = path.join(paths.value.outDir, 'fix-ledger.v1.md');
  await writeFile(jsonPath, renderLedgerJson(rows.value), 'utf8');
  await writeFile(mdPath, renderLedgerMarkdown(rows.value), 'utf8');
  process.stdout.write(`wrote ${jsonPath} and ${mdPath} (${rows.value.length} row(s))\n`);
}

if (process.argv.includes('--help')) {
  process.stdout.write(USAGE);
} else {
  const flags = parseCliFlags();
  if (flags.ok) {
    await renderLedger(flags.value);
  } else {
    failWithUsage(flags.error.message);
  }
}
