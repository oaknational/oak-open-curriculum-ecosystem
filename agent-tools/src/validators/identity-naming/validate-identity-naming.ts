#!/usr/bin/env node

/**
 * Identity-naming validator (PDS identity replacement).
 *
 * Enforces the owner-ratified end state of the `public-digital-service-identity`
 * plan (2026-08-03): the outgoing counter-identity's name and initialism must
 * not occur in any git-tracked file — contents or paths. Two census-driven
 * modes, one validator:
 *
 * - **Ratchet** (census present with entries): live per-file, per-kind,
 *   per-case-variant counts must EXACTLY equal the committed census
 *   (`.agent/reports/design/pds-identity-rename/census.json`). Above = a new
 *   occurrence; below = a stale census — the census update is the ratchet-down
 *   ceremony. The census's own path is excluded from the content scan (its
 *   `file` column necessarily carries the token).
 * - **Strict** (census empty or absent): zero occurrences, zero exclusions.
 *
 * The PATH leg is unconditional over every tracked path including binaries; the
 * CONTENT leg skips binary extensions and NUL-bearing files (the shared
 * `core/tracked-file-scan` policy). Forbidden tokens are string-constructed so
 * the gate never contains its own target. Both legs are reported on every
 * verdict, and either leg scanning nothing is a refusal, not a pass.
 *
 * `--print-counts` emits the live projection as JSON — and ONLY that JSON — on
 * stdout, with every human banner diverted to stderr, so the census authoring
 * source can be piped straight into a file. The exit code is the ordinary
 * verdict either way. Wired into root `repo-validators:check` (pre-commit AND
 * CI). Exit 0 = clean; 1 = findings; 2 = misconfiguration.
 *
 * @packageDocumentation
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { listTrackedFiles, readScanFiles } from '../../core/tracked-file-scan.js';

import {
  CENSUS_PATH,
  compareToCensus,
  computeLiveCounts,
} from './validate-identity-naming-census.js';
import {
  parseCensusText,
  parseIdentityNamingArgv,
  selectCensusMode,
  type CensusFileRow,
} from './validate-identity-naming-io.js';
import { findContentHits, hasAnyCount } from './validate-identity-naming-tokens.js';

/**
 * Load the census rows; `undefined` when the file does not exist. Exits 2
 * (misconfiguration) on unreadable or structurally invalid census content —
 * strict validation at the boundary, never a silent fallback.
 */
function loadCensus(root: string): CensusFileRow[] | undefined {
  const absolute = path.join(root, CENSUS_PATH);
  if (!existsSync(absolute)) {
    return undefined;
  }
  let text: string;
  try {
    text = readFileSync(absolute, 'utf8');
  } catch (error) {
    writeErrorLine(`validate-identity-naming: census at ${CENSUS_PATH} is unreadable.`);
    writeErrorLine(String(error));
    process.exit(2);
  }
  const parsed = parseCensusText({ label: `census at ${CENSUS_PATH}`, text });
  if (!parsed.ok) {
    writeErrorLine(`validate-identity-naming: ${parsed.error.message}`);
    process.exit(2);
  }
  return parsed.value;
}

const invocation = parseIdentityNamingArgv(process.argv.slice(2));
if (!invocation.ok) {
  writeErrorLine(`validate-identity-naming: ${invocation.error}`);
  process.exit(2);
}
const { printCounts } = invocation.value;

/**
 * Banners go to stderr under `--print-counts` so stdout carries the JSON and
 * nothing else; otherwise they are the operator's ordinary stdout verdict.
 */
const writeVerdictLine = printCounts ? writeErrorLine : writeLine;

const repoRoot = resolveRepoRoot(import.meta.url);
const trackedPaths = listTrackedFiles(repoRoot);
if (trackedPaths.length === 0) {
  writeErrorLine('validate-identity-naming: zero tracked files scanned — refusing a vacuous pass.');
  process.exit(2);
}

const scan = readScanFiles(repoRoot, trackedPaths);
if (!scan.ok) {
  writeErrorLine(
    `validate-identity-naming: cannot read tracked file '${scan.error.relativePath}' — most ` +
      `likely a tracked file deleted but not staged. Fix the file, its permissions, or the index ` +
      `— the scan must not skip a tracked file.`,
  );
  writeErrorLine(String(scan.error.cause));
  process.exit(2);
}
const scannable = scan.value;
if (scannable.length === 0) {
  writeErrorLine(
    `validate-identity-naming: zero file contents scanned across ${trackedPaths.length} tracked ` +
      `paths — refusing a vacuous content scan.`,
  );
  process.exit(2);
}

/** Both scan legs, reported on every verdict so neither can go quiet unnoticed. */
const legs = `${trackedPaths.length} tracked paths, ${scannable.length} contents scanned`;

const selection = selectCensusMode(loadCensus(repoRoot));
const live = computeLiveCounts(
  trackedPaths,
  scannable,
  selection.mode === 'ratchet' ? CENSUS_PATH : undefined,
);

if (printCounts) {
  writeLine(JSON.stringify({ mode: selection.mode, entries: live }, null, 2));
}

if (selection.mode === 'ratchet') {
  const findings = compareToCensus(live, selection.census);
  if (findings.length === 0) {
    writeVerdictLine(
      `✓ identity-naming ratchet: live counts match the census exactly ` +
        `(${live.length} carrier(s); ${legs})`,
    );
    process.exit(0);
  }
  writeErrorLine(
    `✖ identity-naming ratchet: ${findings.length} divergence(s) from the census (${legs}):`,
  );
  for (const finding of findings) {
    writeErrorLine(
      `  [${finding.reason}] ${finding.kind} ${finding.file} — live ` +
        `${JSON.stringify(finding.live)} vs census ${JSON.stringify(finding.census)}`,
    );
  }
  writeErrorLine('');
  writeErrorLine(
    'A new occurrence of the outgoing identity is forbidden (plan public-digital-service-identity); ' +
      'a removal must update the census in the same change — that update IS the ratchet-down ceremony.',
  );
  process.exit(1);
}

const carriers = live.filter((entry) => hasAnyCount(entry.countByVariant));
if (carriers.length === 0) {
  writeVerdictLine(`✓ identity-naming strict: zero occurrences (${legs})`);
  process.exit(0);
}

writeErrorLine(`✖ identity-naming strict: ${carriers.length} carrier(s) found (${legs}):`);
for (const entry of carriers) {
  if (entry.kind === 'path') {
    writeErrorLine(`  path ${entry.file} — ${JSON.stringify(entry.countByVariant)}`);
  }
}
// The content leg iterates the scanned files rather than looking each carrier's
// content up: a carrier's text is then in hand by construction, so there is no
// absent-content case to paper over with an empty-string fallback.
const contentCarriers = new Set(
  carriers.filter((entry) => entry.kind === 'content').map((entry) => entry.file),
);
for (const file of scannable) {
  if (!contentCarriers.has(file.path)) {
    continue;
  }
  for (const hit of findContentHits(file.path, file.content)) {
    writeErrorLine(`  ${hit.file}:${hit.line}:${hit.column}  [${hit.variant}]`);
  }
}
writeErrorLine('');
writeErrorLine(
  'The outgoing identity must not exist in the tracked tree (owner word 2026-08-03; ' +
    'plan public-digital-service-identity). Rename per the plan; never re-introduce.',
);
process.exit(1);
