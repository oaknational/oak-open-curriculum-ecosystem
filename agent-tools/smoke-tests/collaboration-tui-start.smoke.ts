import { spawn } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON,
  EMPTY_CLOSED_CLAIMS_ARCHIVE_JSON,
} from '../src/collaboration-state/state-file-seeds.js';

/**
 * Prove the built collaboration TUI starts and renders one text snapshot.
 *
 * The TUI is pointed at a coordination home this smoke seeds itself (empty
 * active and closed registries at the parsers' pinned versions, an empty
 * comms directory) via `--repo-root`. Without that, the binary resolves the
 * checkout's own coordination home, whose registries are untracked by design:
 * the smoke then proves the host's disk (green on a checkout with a registry,
 * red on a clean CI runner), not the binary.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const cliPath = resolve(repoRoot, 'agent-tools/dist/src/bin/agent-tools.js');

const fixtureRoot = mkdtempSync(join(tmpdir(), 'oak-collaboration-tui-start-'));
const collaborationDir = join(fixtureRoot, '.agent', 'state', 'collaboration');
try {
  mkdirSync(join(collaborationDir, 'comms'), { recursive: true });
  writeFileSync(
    join(collaborationDir, 'active-claims.json'),
    `${EMPTY_ACTIVE_CLAIMS_REGISTRY_JSON}\n`,
  );
  writeFileSync(
    join(collaborationDir, 'closed-claims.archive.json'),
    `${EMPTY_CLOSED_CLAIMS_ARCHIVE_JSON}\n`,
  );
} catch (error) {
  fail(
    `collaboration TUI smoke could not seed its coordination home: ${error instanceof Error ? error.message : String(error)}`,
  );
}

const child = spawn(
  process.execPath,
  [cliPath, 'collaboration-state', 'tui', '--format', 'text', '--repo-root', fixtureRoot],
  { cwd: repoRoot, stdio: ['ignore', 'pipe', 'pipe'] },
);

let stdout = '';
let stderr = '';

const timeout = setTimeout(() => {
  child.kill('SIGTERM');
  fail('collaboration TUI smoke timed out before the built command produced a snapshot');
}, 10_000);

child.stdout.setEncoding('utf8');
child.stdout.on('data', (chunk: string) => {
  stdout += chunk;
});

child.stderr.setEncoding('utf8');
child.stderr.on('data', (chunk: string) => {
  stderr += chunk;
});

child.on('error', (error) => {
  clearTimeout(timeout);
  fail(`collaboration TUI smoke could not start the built command: ${error.message}`);
});

child.on('close', (code) => {
  clearTimeout(timeout);
  removeFixture();
  if (code !== 0) {
    fail(`collaboration TUI smoke exited ${code ?? 'without a code'}\n${stderr}`);
  }
  if (!stdout.includes('Collaboration TUI Snapshot')) {
    fail(`collaboration TUI smoke did not render the snapshot heading\n${stdout}\n${stderr}`);
  }
  process.stdout.write('collaboration TUI smoke OK: the built command rendered a snapshot\n');
});

function removeFixture(): void {
  rmSync(fixtureRoot, { recursive: true, force: true });
}

function fail(message: string): never {
  removeFixture();
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
