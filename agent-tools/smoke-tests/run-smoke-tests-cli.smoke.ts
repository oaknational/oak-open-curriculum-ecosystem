import { spawnSync } from 'node:child_process';
import { closeSync, fstatSync, openSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** Owner, group and other execute bits of a POSIX file mode. */
const EXECUTE_BITS = 0o111;

/**
 * CLI truth-set smoke for the built `run-smoke-tests` binary
 * (testing-strategy §Smoke Checks — Artefact Viability): the dist file exists,
 * is executable and carries its shebang; `--help` exits 0 with usage on
 * stdout; an unknown argument exits non-zero with guidance on stderr and no
 * stack trace. The happy-path item is discharged by `test:e2e` itself, which
 * runs this bin with no arguments — this smoke must never do that, because
 * that run is the one running this smoke.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const artefactPath = resolve(smokeDir, '..', 'dist/src/bin/run-smoke-tests.js');

function fail(message: string): never {
  process.stderr.write(`run-smoke-tests CLI smoke: ${message}\n`);
  process.exit(1);
}

// One open serves the mode check and the content read, so there is no
// check-then-use window (CodeQL js/file-system-race).
let artefact: string;
try {
  const fd = openSync(artefactPath, 'r');
  try {
    if ((fstatSync(fd).mode & EXECUTE_BITS) === 0) {
      fail('the built artefact carries no executable bit');
    }
    artefact = readFileSync(fd, 'utf8');
  } finally {
    closeSync(fd);
  }
} catch (error) {
  fail(
    `the built artefact is not readable: ${error instanceof Error ? error.message : String(error)}`,
  );
}
if (!artefact.startsWith('#!/usr/bin/env node')) {
  fail('the built artefact does not start with its shebang');
}

const help = spawnSync(process.execPath, [artefactPath, '--help'], { encoding: 'utf8' });
if (help.status !== 0 || !help.stdout.startsWith('Usage:')) {
  fail(`--help expected exit 0 with usage on stdout, got ${String(help.status)}\n${help.stderr}`);
}

const bogus = spawnSync(process.execPath, [artefactPath, '--bogus'], { encoding: 'utf8' });
if (bogus.status === 0 || !bogus.stderr.includes('Usage:') || bogus.stderr.includes('    at ')) {
  fail(
    `--bogus expected a non-zero exit with usage on stderr and no stack, got ${String(bogus.status)}\n${bogus.stderr}`,
  );
}

process.stdout.write(
  'run-smoke-tests CLI smoke OK: shebang, --help exit 0, unknown argument refused\n',
);
