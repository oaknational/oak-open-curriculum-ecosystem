import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI smoke for the three corpus-analysis drivers' repo root: each is tree-bound,
 * resolving the root by walking up from its own module with the harness project
 * directory explicitly disabled. The falsifier is a decoy `CLAUDE_PROJECT_DIR`
 * naming another sentinel-bearing directory: a driver that followed it would
 * anchor its checkpoint reads there and REFUSE an in-repo checkpoint path as
 * outside the permitted base; a tree-bound driver reads the in-repo path and
 * fails later, on the file's content, with the schema's validation message and no
 * stack frame.
 */
const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const packageDir = resolve(smokeDir, '..');
const REFUSAL = 'Refusing path outside the permitted base';
// The schema's refusal of a file it did read: proof the driver got past the path check.
const VALIDATION_FAILURE = 'failed validation';

interface Driver {
  readonly name: string;
  readonly entry: string;
  readonly args: readonly string[];
}

// `package.json` is a real in-repo file that is not a checkpoint, so every driver fails
// on its content once the path is accepted.
const drivers: readonly Driver[] = [
  {
    name: 'post-run-driver',
    entry: 'src/corpus-analysis/post-run/post-run-driver.ts',
    args: ['--map-result', 'package.json'],
  },
  {
    name: 'salvage-driver',
    entry: 'src/corpus-analysis/post-run/salvage-driver.ts',
    args: ['--reduce-result', 'package.json'],
  },
  {
    name: 'build-run-artefact',
    entry: 'src/corpus-analysis/workflows/build/build-run-artefact.ts',
    args: ['--stage', 'map', '--partition', 'package.json'],
  },
];

function fail(message: string): never {
  process.stderr.write(`corpus drivers tree-bound root smoke: ${message}\n`);
  process.exit(1);
}

function run(driver: Driver, decoy: string): SpawnSyncReturns<string> {
  return spawnSync(
    process.execPath,
    ['--import', 'tsx', resolve(packageDir, driver.entry), ...driver.args],
    {
      cwd: packageDir,
      encoding: 'utf8',
      env: { ...process.env, CLAUDE_PROJECT_DIR: decoy },
    },
  );
}

const decoy = mkdtempSync(join(tmpdir(), 'decoy-checkout-'));
let failure: string | undefined;
try {
  writeFileSync(join(decoy, 'pnpm-workspace.yaml'), 'packages: []\n');
  for (const driver of drivers) {
    const result = run(driver, decoy);
    const combined = `${result.stdout}${result.stderr}`;
    if (result.status !== 1) {
      failure = `${driver.name}: expected exit 1 on a non-checkpoint file, got ${String(result.status)}`;
      break;
    }
    if (combined.includes(REFUSAL)) {
      failure = `${driver.name}: anchored at the decoy project directory (refused an in-repo path):\n${combined.slice(0, 600)}`;
      break;
    }
    if (!combined.includes(VALIDATION_FAILURE) || combined.includes('    at ')) {
      failure = `${driver.name}: expected the in-repo file read and refused on its content, got:\n${combined.slice(0, 600)}`;
      break;
    }
  }
} finally {
  // Cleanup runs before any exit: `process.exit` inside the try would skip this block.
  rmSync(decoy, { recursive: true, force: true });
}
if (failure !== undefined) {
  fail(failure);
}
process.stdout.write(
  'corpus drivers tree-bound root smoke OK: a decoy CLAUDE_PROJECT_DIR never re-anchors any of the three drivers\n',
);
