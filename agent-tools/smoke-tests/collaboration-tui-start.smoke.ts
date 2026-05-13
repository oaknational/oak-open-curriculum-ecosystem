import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const cliPath = resolve(repoRoot, 'agent-tools/dist/src/bin/agent-tools.js');

const child = spawn(process.execPath, [cliPath, 'collaboration-state', 'tui', '--format', 'text'], {
  cwd: repoRoot,
  stdio: ['ignore', 'pipe', 'pipe'],
});

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
  if (code !== 0) {
    fail(`collaboration TUI smoke exited ${code ?? 'without a code'}\n${stderr}`);
  }
  if (!stdout.includes('Collaboration TUI Snapshot')) {
    fail(`collaboration TUI smoke did not render the snapshot heading\n${stdout}\n${stderr}`);
  }
});

function fail(message: string): never {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
