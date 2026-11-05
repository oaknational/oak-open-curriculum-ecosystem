#!/usr/bin/env node

/**
 * Core host-name heading validator: no heading in a Core document names a
 * repository the Practice has lived in (the decision-records README's
 * portability constraint, "no host-repo names as the carrier of meaning", in
 * the `practice-core-portability` rule's strict form).
 *
 * A host's adoption of a Practice decision is recorded in that host's own
 * decision record and paired in its bridge index (PDR-079); a dated amendment
 * heading of the shape `<date> — <host>: ...` records it inside the Core, where
 * it travels to repositories that have never seen the host and diverges the
 * estates' copies of one record. The needles are derived, not declared: the
 * `repo:` field of every provenance entry and the repository tag of every
 * changelog entry in the Core's own records, plus the scanned tree's origin
 * owner and repository name (the helpers module says why). Headings only,
 * outside fenced code; the changelog's own headings are exempt by its tagging
 * convention.
 *
 * Usage: `validate-no-host-names-in-core-headings [repo-root]`. Without the
 * argument the gate reads the tree it runs inside; with it, another tracked
 * tree (a sibling estate's checkout) is read with the same rule, which is how
 * one estate reads the other's Core before a carry.
 *
 * Wired into root `docs-validators:check`, which runs in `pnpm check`,
 * `pnpm check:docs` and CI. Exit 0 = clean; 1 = findings; 2 = refusal (the
 * provenance file or the changelog missing, the two together naming no
 * repository, the origin remote missing or not an owner/repository URL, no
 * tracked Core document, or a Core document unreadable or not scannable as
 * text). The status is returned from `main` and
 * set on `process.exitCode`, so buffered diagnostics reach a pipe before the
 * process ends.
 *
 * @packageDocumentation
 */

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { parseGitRemoteUrl, type GitRemoteRepository } from '../../core/git-remote-url.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import { writeErrorLine, writeLine } from '../../core/terminal-output.js';
import { describeGitReadFailure, listTrackedFiles } from '../../core/repository-paths.js';
import { describeUnreadable, readScanFiles } from '../../core/tracked-file-scan.js';
import { resolveTrustedGit } from '../../core/trusted-git.js';

import {
  CHANGELOG_PATH,
  changelogRepositories,
  hostNeedles,
  isScannedCorePath,
  PROVENANCE_PATH,
  provenanceRepositories,
  scanCoreHeadings,
  type HostNameHeadingHit,
  type ScanFile,
} from './validate-no-host-names-in-core-headings-helpers.js';

const NAME = 'validate-no-host-names-in-core-headings';

function refuse(reason: string): number {
  writeErrorLine(`${NAME}: ${reason}`);
  return 2;
}

/** One Core record's text; a refusal reason when it cannot be read. */
function readCoreRecord(repoRoot: string, relativePath: string): Result<string, string> {
  try {
    return ok(readFileSync(path.join(repoRoot, relativePath), 'utf8'));
  } catch {
    return err(`cannot read ${relativePath} — the Core's own records name its hosts`);
  }
}

/**
 * The repository names the Core's records declare: the provenance chain's
 * `repo:` fields and the changelog's entry tags; a refusal reason when either
 * record is missing or the two together name none.
 */
function readDeclaredRepositories(repoRoot: string): Result<string[], string> {
  const provenance = readCoreRecord(repoRoot, PROVENANCE_PATH);
  if (!provenance.ok) {
    return provenance;
  }
  const changelog = readCoreRecord(repoRoot, CHANGELOG_PATH);
  if (!changelog.ok) {
    return changelog;
  }
  const names = [
    ...provenanceRepositories(provenance.value),
    ...changelogRepositories(changelog.value),
  ];
  if (names.length === 0) {
    return err(
      `${PROVENANCE_PATH} declares no repo field and ${CHANGELOG_PATH} no entry tag — ` +
        'refusing a vacuous needle set',
    );
  }
  return ok(names);
}

/** The origin remote's owner and repository; a refusal reason when absent or not that shape. */
function readOrigin(repoRoot: string): Result<GitRemoteRepository, string> {
  let git: string;
  try {
    git = resolveTrustedGit();
  } catch (error) {
    return err(
      `cannot resolve a trusted git binary — ${error instanceof Error ? error.message : 'unknown'}`,
    );
  }
  let url: string;
  try {
    url = execFileSync(git, ['remote', 'get-url', 'origin'], {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
  } catch {
    return err(
      'no origin remote — the scanned tree names itself by its origin owner and repository',
    );
  }
  const origin = parseGitRemoteUrl(url);
  return origin === undefined
    ? err(
        'the origin remote URL does not name an owner/repository path (the URL is withheld from this log: a remote may carry a credential)',
      )
    : ok(origin);
}

/** The tracked Core documents as text; a refusal reason when any cannot be read as text. */
function readCoreDocuments(repoRoot: string): Result<ScanFile[], string> {
  const listing = listTrackedFiles(repoRoot);
  if (!listing.ok) {
    return err(`cannot list tracked files — ${describeGitReadFailure(listing.error)}`);
  }
  const corePaths = listing.value.filter(isScannedCorePath);
  if (corePaths.length === 0) {
    return err('zero tracked Core documents found — refusing a vacuous pass');
  }
  const scan = readScanFiles(repoRoot, corePaths);
  if (!scan.ok) {
    return err(describeUnreadable(scan.error));
  }
  if (scan.value.length !== corePaths.length) {
    const read = new Set(scan.value.map((file) => file.path));
    const dropped = corePaths.filter((corePath) => !read.has(corePath));
    return err(
      `tracked Core document(s) not scannable as text, so the scan cannot vouch for them: ` +
        dropped.join(', '),
    );
  }
  return ok(scan.value);
}

/** Every hit as `path:line:column  text`, then the cure. */
function reportHits(hits: readonly HostNameHeadingHit[]): void {
  writeErrorLine(`✖ ${String(hits.length)} host name(s) in Core headings:`);
  for (const hit of hits) {
    writeErrorLine(`  ${hit.file}:${String(hit.line)}:${String(hit.column)}  ${hit.text}`);
  }
  writeErrorLine('');
  writeErrorLine(
    "A Core heading names the decision, never the host that adopted it. Move the host's " +
      "adoption to the host's own decision record and pair it in the bridge index (PDR-079; " +
      'the decision-records README §Portability Constraint), and head the Core entry by its ' +
      'date and subject alone.',
  );
}

/** The scanned tree: the one positional argument, else the tree this file runs inside. */
function scannedRoot(argv: readonly string[]): string {
  const [given] = argv;
  if (given !== undefined) {
    return path.resolve(given);
  }
  // projectDir is explicitly disabled: without an argument this validator
  // reads the tree it runs inside. The CLAUDE_PROJECT_DIR leg would rebind a
  // worktree invocation to the primary checkout and report the wrong estate.
  return resolveRepoRoot(import.meta.url, { projectDir: undefined });
}

function main(argv: readonly string[]): number {
  if (argv.length > 1) {
    return refuse(`usage: ${NAME} [repo-root] — at most one argument`);
  }
  const repoRoot = scannedRoot(argv);
  const declared = readDeclaredRepositories(repoRoot);
  if (!declared.ok) {
    return refuse(declared.error);
  }
  const origin = readOrigin(repoRoot);
  if (!origin.ok) {
    return refuse(origin.error);
  }
  const documents = readCoreDocuments(repoRoot);
  if (!documents.ok) {
    return refuse(documents.error);
  }
  const needles = hostNeedles(declared.value, origin.value);
  const hits = scanCoreHeadings(documents.value, needles);
  if (hits.length > 0) {
    reportHits(hits);
    return 1;
  }
  writeLine(
    `✓ no host names in the headings of ${String(documents.value.length)} Core documents ` +
      `(${String(needles.length)} host names from the Core's records and the origin)`,
  );
  return 0;
}

process.exitCode = main(process.argv.slice(2));
