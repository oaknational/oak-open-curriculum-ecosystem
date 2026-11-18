import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the corpus-analysis run-artefact builder: every flag-supplied
 * checkpoint path goes through the repo-anchored reader, so a well-formed
 * partition file that lives OUTSIDE the repository is refused before it is read
 * or embedded in a launchable artefact (the two post-run drivers read through the
 * same helper). A missing file would fail either way, so the smoke writes a real,
 * valid partition under the system temp directory and points the builder at it.
 */
const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const packageDir = resolve(smokeDir, '..');
const entry = resolve(packageDir, 'src/corpus-analysis/workflows/build/build-run-artefact.ts');

function fail(message: string): never {
  process.stderr.write(`build-run-artefact CLI smoke: ${message}\n`);
  process.exit(1);
}

function run(args: readonly string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, ['--import', 'tsx', entry, ...args], {
    cwd: packageDir,
    encoding: 'utf8',
  });
}

const outside = mkdtempSync(join(tmpdir(), 'corpus-partition-'));
const partition = join(outside, 'partition.json');
let failure: string | undefined;
try {
  writeFileSync(partition, JSON.stringify({ windows: [{ window: 'w01', files: ['README.md'] }] }));
  const escaping = run(['--stage', 'map', '--partition', partition]);
  const combined = `${escaping.stdout}${escaping.stderr}`;
  if (escaping.status === 0) {
    failure = 'a partition file outside the repository was accepted; expected a refusal';
  } else if (!combined.includes('Refusing path outside the permitted base')) {
    failure = `expected the anchored reader's refusal, got:\n${combined.slice(0, 600)}`;
  } else if (combined.includes('    at ')) {
    failure = 'the refusal carried a stack trace';
  }
} finally {
  // Cleanup runs before any exit: `process.exit` inside the try would skip this block.
  rmSync(outside, { recursive: true, force: true });
}
if (failure !== undefined) {
  fail(failure);
}
process.stdout.write(
  'build-run-artefact CLI smoke OK: a valid partition file outside the repository is refused by the anchored reader, no stack trace\n',
);
