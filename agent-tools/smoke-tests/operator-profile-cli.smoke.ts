import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { writeErrorLine, writeLine } from '../src/core/terminal-output.js';
import {
  VALID_INDEX_DOCUMENT,
  VALID_SCOPE_DOCUMENT,
} from '../src/validators/operator-profile/operator-profile-fixtures.js';
import { OPERATOR_PROFILE_CONTRACT_REL_PATH } from '../src/validators/operator-profile/operator-profile-schema.js';

/**
 * CLI smoke for the built `validate-operator-profile` entry against a
 * temporary profile root under the OS temp dir (never the home directory):
 * the behaviours only a real filesystem and a real process can show.
 *
 * 1. A symlinked `index.md` pointing outside the root is refused as not a
 *    regular file; the conforming document it points at is never read (were
 *    it read, it would conform and the report would not name it).
 * 2. A report larger than one pipe buffer arrives whole: the entry sets
 *    `process.exitCode` and never calls `process.exit()`, which can end the
 *    process before piped stdout has flushed.
 * 3. An absent root exits 0 with its one line, and an empty `--root` is a
 *    usage error, never the current checkout.
 * 4. A symlinked `repos/` directory is refused as not regular and never
 *    descended: a conforming document behind it is never named or counted.
 * 5. `--emit` prints a named conforming document from the check's own read
 *    after a conforming check, prints one line for an absent name, and prints
 *    nothing at all when the check refused; an argument the grammar does not
 *    name is refused with exit 2.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const artefactPath = resolve(
  repoRoot,
  'agent-tools/dist/src/validators/operator-profile/validate-operator-profile.js',
);

/** Enough refused documents that the report outgrows one 64 KiB pipe buffer. */
const REFUSED_DOCUMENT_COUNT = 1000;
const PIPE_BUFFER_BYTES = 64 * 1024;

const failures: string[] = [];

function check(condition: boolean, message: string): void {
  if (!condition) {
    failures.push(message);
  }
}

function runCheck(args: readonly string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, [artefactPath, ...args], {
    cwd: repoRoot,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
  });
}

const root = mkdtempSync(join(tmpdir(), 'operator-profile-cli-smoke-'));
try {
  const profile = join(root, 'profile');
  mkdirSync(join(profile, 'repos'), { recursive: true });
  const outside = join(root, 'outside.md');
  writeFileSync(outside, VALID_INDEX_DOCUMENT, 'utf8');
  symlinkSync(outside, join(profile, 'index.md'));
  const refusedPaths = Array.from(
    { length: REFUSED_DOCUMENT_COUNT },
    (_, index) => `repos/owner--repo-${index}.md`,
  );
  for (const relPath of refusedPaths) {
    writeFileSync(join(profile, relPath), '# A document with no frontmatter block\n', 'utf8');
  }

  const refused = runCheck(['--root', profile]);
  check(
    refused.status === 1,
    `a non-conforming profile expected exit 1, got ${String(refused.status)}\n${refused.stderr}`,
  );
  check(
    refused.stdout.includes('index.md is not a regular file or directory'),
    'the symlinked index.md was not refused as not a regular file',
  );
  check(
    refused.stdout.includes(`✗ ${REFUSED_DOCUMENT_COUNT + 1} documents at`),
    'the refusal count does not include the symlink alongside every refused document',
  );
  check(
    refused.stdout.length > PIPE_BUFFER_BYTES,
    `the report is ${refused.stdout.length} bytes; the flush proof needs more than one pipe buffer`,
  );
  const missing = refusedPaths.filter((relPath) => !refused.stdout.includes(relPath));
  check(
    missing.length === 0,
    `${missing.length} refused documents are missing from the piped output (first: ${missing[0] ?? ''}) — the output was cut before it flushed`,
  );
  check(
    refused.stdout.trimEnd().endsWith(`The contract is ${OPERATOR_PROFILE_CONTRACT_REL_PATH}.`),
    'the remediation line, the last thing written, did not arrive',
  );

  const absent = runCheck(['--root', join(root, 'nowhere')]);
  check(
    absent.status === 0 && absent.stdout.includes('absence is the expected condition'),
    `an absent root expected exit 0 with its one line, got ${String(absent.status)}\n${absent.stdout}${absent.stderr}`,
  );

  const blank = runCheck(['--root', '']);
  check(
    blank.status === 2 && blank.stderr.includes('--root needs a value'),
    `an empty --root expected a usage error, got ${String(blank.status)}\n${blank.stdout}${blank.stderr}`,
  );

  const typo = runCheck(['--rot', profile]);
  check(
    typo.status === 2 && typo.stderr.includes('unknown argument "--rot"'),
    `an unknown argument expected exit 2 naming it, got ${String(typo.status)}\n${typo.stderr}`,
  );

  const emitOnRefused = runCheck(['--root', profile, '--emit', 'index.md']);
  check(
    emitOnRefused.status === 1 && !emitOnRefused.stdout.includes('=== index.md ==='),
    'a refused check must print no document, whatever --emit names',
  );

  // A conforming root: index.md regular, repos/ a symlink to a directory
  // outside the root that holds a conforming scope document.
  const conforming = join(root, 'conforming');
  mkdirSync(conforming, { recursive: true });
  writeFileSync(join(conforming, 'index.md'), VALID_INDEX_DOCUMENT, 'utf8');
  const outsideRepos = join(root, 'outside-repos');
  mkdirSync(outsideRepos, { recursive: true });
  writeFileSync(join(outsideRepos, 'owner--repo.md'), VALID_SCOPE_DOCUMENT, 'utf8');
  symlinkSync(outsideRepos, join(conforming, 'repos'));

  const linkedDir = runCheck(['--root', conforming, '--emit', 'index.md']);
  check(
    linkedDir.status === 1 && linkedDir.stdout.includes('repos is not a regular file or directory'),
    `a symlinked repos/ expected a refusal naming it, got ${String(linkedDir.status)}\n${linkedDir.stdout}`,
  );
  check(
    !linkedDir.stdout.includes('owner--repo'),
    'the document behind the symlinked repos/ was listed or read: the link was descended',
  );
  check(
    !linkedDir.stdout.includes('=== index.md ==='),
    'a refused check printed a document through --emit',
  );

  rmSync(join(conforming, 'repos'));
  const emitted = runCheck([
    '--root',
    conforming,
    '--emit',
    'index.md',
    '--emit',
    'repos/absent--scope.md',
  ]);
  check(
    emitted.status === 0 &&
      emitted.stdout.includes('=== index.md ===') &&
      emitted.stdout.includes(VALID_INDEX_DOCUMENT.trim()),
    `--emit index.md on a conforming root expected the document, got ${String(emitted.status)}\n${emitted.stdout}${emitted.stderr}`,
  );
  check(
    !emitted.stdout.includes('=== repos/absent--scope.md ===') &&
      emitted.stdout.includes('no document at repos/absent--scope.md'),
    'an absent named document must print its one line and no header',
  );
} finally {
  rmSync(root, { recursive: true, force: true });
}

if (failures.length > 0) {
  for (const failure of failures) {
    writeErrorLine(`operator-profile CLI smoke: ${failure}`);
  }
  process.exitCode = 1;
} else {
  writeLine(
    `operator-profile CLI smoke OK: symlinked index.md refused unread, ${REFUSED_DOCUMENT_COUNT + 1} refusals arrived whole through a pipe, absent root exit 0, empty --root and an unknown argument refused, a symlinked repos/ never descended, --emit printed the conforming index only`,
  );
}
