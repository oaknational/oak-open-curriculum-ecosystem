#!/usr/bin/env node

/**
 * Operator Profile Check
 *
 * Validates the operator profile on this machine — the Practice's one
 * surface outside a repository (the operator-profile PDR) — against the
 * family-1 enforcement schema: `<root>/index.md`, every
 * `<root>/repos/<scope-key>.md` and every `<root>/machines/<machine-key>.md`,
 * where `<root>` is `${PRACTICE_HOME:-~/.practice}/profile` or the
 * `--root <dir>` argument. A root that is itself a git repository (the
 * operator syncing the profile between machines) is expected: its git
 * furniture is not a finding, and when it has a remote its sync state is
 * reported — a dirty tree, unpushed commits or a branch behind its remote
 * are findings, each with the one command that cures it.
 *
 * The profile is strictly optional. A missing root exits 0 with one line
 * saying so: absence is the expected condition on any machine without a
 * profile, and nothing may fail or warn on it. A PRESENT profile must
 * conform: exit 1 names every document and every failure.
 *
 * `--emit <relPath>` (repeatable) prints a named document after a conforming
 * check, from the same read the check validated, so a caller never reopens
 * a path after the check (a file replaced by a link in between would
 * otherwise enter the session unread). A named document that is absent
 * prints one line naming it, so a drifted key is seen rather than hidden by
 * the silence of strict optionality; no document prints unless every
 * present document conformed.
 *
 * This check is not part of the commit or push gates by design — the
 * profile is per person, and nothing in the repository may depend on it.
 * Run it at session open (the start-right grounding names it) and after
 * editing the profile: `pnpm profile:check`.
 */

import { homedir } from 'node:os';
import { fileURLToPath } from 'node:url';

import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { parseCheckArgs } from './operator-profile-check-args.js';
import {
  type ConformingDocument,
  type DocumentFailure,
  readProfileReport,
  resolveProfileRoot,
} from './operator-profile-root.js';
import { OPERATOR_PROFILE_CONTRACT_REL_PATH } from './operator-profile-schema.js';
import { SYNC_REL_PATH } from './operator-profile-sync-report.js';

function plural(count: number, noun: string): string {
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}

// Plain text throughout: `writeLine` sanitises escape characters by design,
// so ANSI styling would render as literal fragments.
function reportDocumentFailures(root: string, failures: readonly DocumentFailure[]): void {
  writeLine(`✗ ${plural(failures.length, 'document')} at ${root} refused:\n`);
  for (const failure of failures) {
    writeLine(`  ${failure.relPath}`);
    for (const message of failure.messages) {
      writeLine(`    - ${message}`);
    }
    writeLine('');
  }
  writeLine(
    `Remediation: fix the document in place. The contract is ${OPERATOR_PROFILE_CONTRACT_REL_PATH}.\n`,
  );
}

/** Sync findings carry their own cure each; they are not document failures. */
function reportSyncFindings(root: string, findings: readonly string[]): void {
  writeLine(`✗ the profile at ${root} is out of sync with its remote:\n`);
  for (const finding of findings) {
    writeLine(`    - ${finding}`);
  }
  writeLine('');
}

function reportFailures(root: string, failures: readonly DocumentFailure[]): void {
  const documents = failures.filter((failure) => failure.relPath !== SYNC_REL_PATH);
  const sync = failures.filter((failure) => failure.relPath === SYNC_REL_PATH);
  if (documents.length > 0) {
    reportDocumentFailures(root, documents);
  }
  if (sync.length > 0) {
    reportSyncFindings(
      root,
      sync.flatMap((failure) => failure.messages),
    );
  }
}

/**
 * Print the named conforming documents, in the order asked, from the check's
 * own reads; a named document that is absent prints one line saying so, the
 * trigger that makes a reader notice a key that matches no file.
 */
function emitDocuments(documents: readonly ConformingDocument[], emit: readonly string[]): void {
  for (const relPath of emit) {
    const document = documents.find((candidate) => candidate.relPath === relPath);
    if (document === undefined) {
      writeLine(`  · no document at ${relPath}; nothing read for it`);
      continue;
    }
    writeLine(`=== ${relPath} ===`);
    writeLine(document.content);
  }
}

async function checkRoot(root: string, emit: readonly string[]): Promise<number> {
  const report = await readProfileReport(root);
  if (!report.ok) {
    writeErrorLine(`✗ ${report.error}`);
    return 1;
  }
  if (report.value === 'absent') {
    writeLine(`✓ No operator profile at ${root} — absence is the expected condition.\n`);
    return 0;
  }
  for (const line of report.value.info) {
    writeLine(`  · ${line}`);
  }
  if (report.value.failures.length > 0) {
    reportFailures(root, report.value.failures);
    return 1;
  }
  const count = report.value.documentCount;
  writeLine(
    `✓ ${plural(count, 'document')} at ${root} conform${count === 1 ? 's' : ''} to the family-1 schema.\n`,
  );
  emitDocuments(report.value.documents, emit);
  return 0;
}

async function main(argv: readonly string[]): Promise<number> {
  const args = parseCheckArgs(argv);
  if (!args.ok) {
    writeErrorLine(`✗ ${args.error}`);
    return 2;
  }
  const root = resolveProfileRoot(args.value.root, process.env, homedir());
  writeLine('\nOperator Profile Check (family 1)');
  writeLine('═════════════════════════════════\n');
  return checkRoot(root, args.value.emit);
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  // process.exitCode, never process.exit(): exit() can terminate before
  // piped stdout/stderr flush, truncating the output a caller captures.
  // Nothing runs after this assignment; the process ends when the loop drains.
  process.exitCode = await main(process.argv.slice(2));
}
