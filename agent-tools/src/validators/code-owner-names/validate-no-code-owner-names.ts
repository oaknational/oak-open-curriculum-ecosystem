#!/usr/bin/env node

/**
 * Code-owner-names validator.
 *
 * A tracked file other than the code-owners file names no code owner's
 * account. The names come from `.github/CODEOWNERS` itself, so the check runs
 * in CI and in a fork with no list to maintain. A machine may add names of its
 * own (a domain, a mail address) in the untracked file
 * `.agent/state/personal-names.local.txt`, one per line.
 *
 * The Practice Core is exempt: it names its authors and origins as
 * attribution.
 *
 * With `--report` the validator prints a count per directory and exits 0, for
 * sizing a cleanup. Without it: exit 0 clean, exit 1 a name was found, exit 2
 * the scan could not be made (git could not list the tracked files, or a
 * tracked file could not be read).
 *
 * @packageDocumentation
 */

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { resolveRepoRoot } from '../../core/repo-root.js';
import { describeGitReadFailure, listTrackedFiles } from '../../core/repository-paths.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { describeUnreadable, readScanFiles } from '../../core/tracked-file-scan.js';

import {
  CODE_OWNERS_PATH,
  isExemptPath,
  parseCodeOwnerLogins,
  parseExtraNames,
  scanForNames,
  summariseByDirectory,
  type NameHit,
} from './validate-no-code-owner-names-helpers.js';

const TOOL = 'validate-no-code-owner-names';
const EXTRA_NAMES_PATH = '.agent/state/personal-names.local.txt';

const repoRoot = resolveRepoRoot(import.meta.url);
const reportOnly = process.argv.includes('--report');

/** The text of a file that may be absent; absent reads as empty, unreadable throws. */
function readOptional(relativePath: string): string {
  const absolutePath = path.join(repoRoot, relativePath);
  return existsSync(absolutePath) ? readFileSync(absolutePath, 'utf8') : '';
}

const names = [
  ...parseCodeOwnerLogins(readOptional(CODE_OWNERS_PATH)),
  ...parseExtraNames(readOptional(EXTRA_NAMES_PATH)),
];

if (names.length === 0) {
  writeLine(`✓ ${TOOL}: no code owners named in ${CODE_OWNERS_PATH}; nothing to look for`);
  process.exit(0);
}

const listing = listTrackedFiles(repoRoot);
if (!listing.ok) {
  writeErrorLine(`${TOOL}: cannot list tracked files — ${describeGitReadFailure(listing.error)}`);
  process.exit(2);
}

const scan = readScanFiles(
  repoRoot,
  listing.value.filter((file) => !isExemptPath(file)),
);
if (!scan.ok) {
  writeErrorLine(`${TOOL}: ${describeUnreadable(scan.error)}`);
  process.exit(2);
}

const hits: NameHit[] = scan.value.flatMap((file) => scanForNames(file.path, file.content, names));

if (reportOnly) {
  const summary = summariseByDirectory(hits);
  writeLine(`${TOOL}: ${String(hits.length)} line(s) in ${String(summary.length)} directories`);
  for (const row of summary) {
    writeLine(`  ${String(row.lines)} line(s), ${String(row.files)} file(s)  ${row.directory}`);
  }
  process.exit(0);
}

if (hits.length === 0) {
  writeLine(`✓ ${TOOL}: no code owner named in ${String(scan.value.length)} tracked files`);
  process.exit(0);
}

writeErrorLine(`✖ ${TOOL}: ${String(hits.length)} line(s) name a code owner's account:`);
for (const hit of hits) {
  writeErrorLine(`  ${hit.path}:${String(hit.line)}`);
}
writeErrorLine('');
writeErrorLine(
  'A fork inherits every tracked file. Write the role (the owner, a code owner), use an ' +
    'invented login such as `a-person` in a fixture, and read who is configured from the live ' +
    `system at run time. Only ${CODE_OWNERS_PATH} names real accounts.`,
);
process.exit(1);
