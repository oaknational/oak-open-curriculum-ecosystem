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
 * attribution. The scan reads what the shared tracked-file policy reads
 * (`core/tracked-file-scan.ts`): binary files, lockfiles and source maps are
 * left out, because each is generated and a name in one is cured in the
 * manifest or source that produced it, which is scanned.
 *
 * It runs in the root `repo-validators:check`, which `pnpm check` runs at the
 * push hook and CI runs in its static checks: a name fails the push and the
 * pull request. The commit hook does not run it.
 *
 * With `--report` the validator prints a count per directory and exits 0, for
 * sizing a cleanup. Without it: exit 0 clean, exit 1 a name was found, exit 2
 * the scan could not be made (the code-owners file or the local list is there
 * and cannot be read, git could not list the tracked files, or a tracked file
 * could not be read).
 *
 * @packageDocumentation
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { errorCodeOf } from '../../core/error-code.js';
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

/**
 * The text of a file that may be absent. Absent reads as empty. A file that is
 * there and cannot be read is the error arm, carrying the refusal line: the
 * list of names would be short, so a clean verdict would not be one.
 */
function readOptional(relativePath: string): Result<string, string> {
  try {
    return ok(readFileSync(path.join(repoRoot, relativePath), 'utf8'));
  } catch (error) {
    const code = error instanceof Error ? errorCodeOf(error) : undefined;
    return code === 'ENOENT' ? ok('') : err(`cannot read '${relativePath}' (${code ?? 'unknown'})`);
  }
}

const codeOwners = readOptional(CODE_OWNERS_PATH);
const extraNames = readOptional(EXTRA_NAMES_PATH);
if (!codeOwners.ok || !extraNames.ok) {
  for (const source of [codeOwners, extraNames]) {
    if (!source.ok) {
      writeErrorLine(`${TOOL}: ${source.error}`);
    }
  }
  process.exit(2);
}

const names = [...parseCodeOwnerLogins(codeOwners.value), ...parseExtraNames(extraNames.value)];

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
