import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

import { resolveTrustedGit } from '../src/core/trusted-git';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the Core host-name heading gate's entry point, two arms.
 *
 * The green arm runs the validator end to end over the live tracked tree (the
 * provenance chain, the changelog tags and the origin read, the Core documents
 * listed and read, the headings scanned) and expects its green line naming the
 * document count and the needle count, exit 0.
 *
 * The refusal arm runs it by its root argument over a fresh repository that
 * has an origin and no Core, and expects exit 2 with the missing-provenance
 * diagnostic: the first refusal on the entry point's path, which no helper
 * cell can reach (the record reads, the origin read and the Core listing are
 * the entry point's). The helpers' cells prove the pure matching; the shared
 * scan module's cells prove the unreadable-file arm.
 */
const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const packageDir = resolve(smokeDir, '..');
const entry = resolve(
  packageDir,
  'src/validators/core-host-names/validate-no-host-names-in-core-headings.ts',
);
const GREEN =
  /^✓ no host names in the headings of (\d+) Core documents \((\d+) host names from the Core's records and the origin\)$/mu;
const REFUSAL =
  /^validate-no-host-names-in-core-headings: cannot read \.agent\/practice-core\/provenance\.yml/mu;

const GIT = resolveTrustedGit();

function fail(message: string): never {
  process.stderr.write(`validate-no-host-names-in-core-headings CLI smoke: ${message}\n`);
  process.exit(1);
}

const result = spawnSync(process.execPath, ['--import', 'tsx', entry], {
  cwd: packageDir,
  encoding: 'utf8',
});
if (result.status !== 0) {
  fail(
    `expected exit 0 on the tracked tree, got ${String(result.status)}:\n${result.stderr.slice(0, 600)}`,
  );
}
const green = GREEN.exec(result.stdout);
if (green === null) {
  fail(`expected the green line, got:\n${result.stdout.slice(0, 600)}`);
}
if (Number(green[1]) === 0 || Number(green[2]) === 0) {
  fail('the scan reported zero Core documents or zero host names');
}

const bare = mkdtempSync(join(tmpdir(), 'core-host-names-smoke-'));
try {
  execFileSync(GIT, ['init', '-q', bare], { encoding: 'utf8' });
  execFileSync(
    GIT,
    ['-C', bare, 'remote', 'add', 'origin', 'https://github.com/example-owner/example-repo.git'],
    { encoding: 'utf8' },
  );
  const refusal = spawnSync(process.execPath, ['--import', 'tsx', entry, bare], {
    cwd: packageDir,
    encoding: 'utf8',
  });
  if (refusal.status !== 2) {
    fail(
      `expected exit 2 over a repository with no Core, got ${String(refusal.status)}:\n${refusal.stdout.slice(0, 300)}${refusal.stderr.slice(0, 300)}`,
    );
  }
  if (!REFUSAL.test(refusal.stderr)) {
    fail(`expected the missing-provenance refusal, got:\n${refusal.stderr.slice(0, 600)}`);
  }
} finally {
  rmSync(bare, { recursive: true, force: true });
}

process.stdout.write(
  `validate-no-host-names-in-core-headings CLI smoke OK: green over ${green[1]} Core documents with ${green[2]} host names; exit 2 with the missing-provenance refusal over a repository with no Core\n`,
);
