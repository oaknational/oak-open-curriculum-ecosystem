import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * CLI truth-set smoke for the `repo-check` entry the root format and markdown
 * gates run through. The root scripts run it from source under tsx, so the
 * smoke does the same, from the repository root:
 *
 * - `--help` exits 0 with usage on stdout;
 * - a mistyped repair flag exits non-zero with usage on stderr, no stack trace
 *   and no lint run (`markdownlint-tracked --fxi` must never run the
 *   read-only check and report green as a repair);
 * - pnpm's forwarded `--` separator is dropped before the command and after it,
 *   and the staged leg (the pre-commit hook's own) exits 0 either way.
 */

const AGENT_TOOLS_ROOT = fileURLToPath(new URL('..', import.meta.url));
const REPO_ROOT = join(AGENT_TOOLS_ROOT, '..');
const ENTRY = join(AGENT_TOOLS_ROOT, 'src', 'repo-check', 'repo-check.ts');

function fail(message: string): never {
  process.stderr.write(`repo-check CLI smoke: ${message}\n`);
  process.exit(1);
}

function run(args: readonly string[]): SpawnSyncReturns<string> {
  return spawnSync(process.execPath, ['--import', 'tsx', ENTRY, ...args], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
}

const help = run(['--help']);
if (help.status !== 0 || !help.stdout.startsWith('Usage:')) {
  fail(`--help expected exit 0 with usage on stdout, got ${String(help.status)}\n${help.stderr}`);
}

const mistyped = run(['markdownlint-tracked', '--fxi']);
if (
  mistyped.status === 0 ||
  !mistyped.stderr.includes('Usage:') ||
  mistyped.stderr.includes('    at ') ||
  mistyped.stdout.includes('Linting:')
) {
  fail(
    `markdownlint-tracked --fxi expected a refusal with usage on stderr, no stack and no lint run, got ${String(mistyped.status)}\n${mistyped.stdout}${mistyped.stderr}`,
  );
}

for (const args of [
  ['markdownlint-staged'],
  ['--', 'markdownlint-staged'],
  ['markdownlint-staged', '--'],
]) {
  const staged = run(args);
  if (staged.status !== 0) {
    fail(`${args.join(' ')} expected exit 0, got ${String(staged.status)}\n${staged.stderr}`);
  }
}

process.stdout.write(
  'repo-check CLI smoke OK: --help exit 0, mistyped flag refused, staged leg exit 0 with no separator and with one before or after the command\n',
);
