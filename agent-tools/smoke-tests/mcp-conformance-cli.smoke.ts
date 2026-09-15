/**
 * Smoke test for the built `mcp-conformance` binary (MCP-189), proving the
 * testing-strategy §"CLI binary" truth-set network-free: the dist entrypoint
 * EXISTS, is EXECUTABLE and carries its SHEBANG; it cold-starts under plain
 * `node`; `--help` exits 0 with usage on stdout; and the usage-error paths
 * (missing --target, unknown flag, duplicate --suite) exit 2 with guidance on
 * stderr and no stack trace.
 *
 * The truth-set's remaining clause — "one trivial happy-path invocation exits
 * 0" — is NOT satisfiable here network-free, and that is a property of this
 * binary rather than an omission: every non-`--help` invocation runs
 * conformance suites against a live MCP target, and testing-strategy forbids
 * network in gated tests. The real happy path is exercised end-to-end by the
 * scheduled `mcp-conformance-unattended` workflow against the deployed alpha
 * on every run, which is where a happy-path regression surfaces. Recorded
 * rather than silently skipped, so the gap is a stated decision with a named
 * home.
 *
 * Requires the workspace to be built (the turbo `test:e2e` task depends on
 * `build`, so the pipeline guarantees it); a missing dist fails loudly with
 * the build command rather than spawning a package manager from PATH here
 * (S4036: only fixed executables are spawned — the current Node binary).
 */
import { spawnSync } from 'node:child_process';
import { accessSync, constants, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const AGENT_TOOLS_ROOT = fileURLToPath(new URL('..', import.meta.url));
const REPO_ROOT = join(AGENT_TOOLS_ROOT, '..');
const BIN = join(AGENT_TOOLS_ROOT, 'dist', 'src', 'bin', 'mcp-conformance.js');

const failures: string[] = [];

function check(label: string, condition: boolean, detail: string): void {
  if (!condition) {
    failures.push(`${label}: ${detail}`);
  }
}

if (!existsSync(BIN)) {
  process.stderr.write(
    'SMOKE FAILED: dist entrypoint missing — run `pnpm --filter @oaknational/agent-tools build` first\n',
  );
  process.exit(1);
}

// Artefact-shape proofs. A build that drops the shebang or the executable bit
// still passes every `node <path>` invocation below, so `pnpm mcp:conformance`
// could break while this smoke stayed green — these assert the artefact as
// SHIPPED, not merely as loadable.
let executable = true;
try {
  accessSync(BIN, constants.X_OK);
} catch {
  executable = false;
}
check('dist entry is executable', executable, `${BIN} lacks the executable bit`);
check(
  'dist entry carries its shebang',
  readFileSync(BIN, 'utf8').startsWith('#!/usr/bin/env node'),
  'first line is not the node shebang',
);

const help = spawnSync(process.execPath, [BIN, '--help'], { cwd: REPO_ROOT, encoding: 'utf8' });
check('help exit code', help.status === 0, `expected 0, got ${String(help.status)}`);
check(
  'help usage on stdout',
  help.stdout.includes('Usage: pnpm -s mcp:conformance'),
  help.stdout.slice(0, 200),
);

const missingTarget = spawnSync(process.execPath, [BIN, '--unattended'], {
  cwd: REPO_ROOT,
  encoding: 'utf8',
});
check(
  'missing --target exit code',
  missingTarget.status === 2,
  `expected 2, got ${String(missingTarget.status)}`,
);
check(
  'missing --target guidance on stderr',
  missingTarget.stderr.includes('--target is required'),
  missingTarget.stderr.slice(0, 200),
);
check(
  'missing --target no stack trace',
  !missingTarget.stderr.includes('    at '),
  'stderr carries a stack trace',
);

const unknownFlag = spawnSync(process.execPath, [BIN, '--target', 'https://x.test/mcp', '--nope'], {
  cwd: REPO_ROOT,
  encoding: 'utf8',
});
check(
  'unknown flag exit code',
  unknownFlag.status === 2,
  `expected 2, got ${String(unknownFlag.status)}`,
);
check(
  'unknown flag guidance on stderr',
  unknownFlag.stderr.includes('--nope'),
  unknownFlag.stderr.slice(0, 200),
);

const duplicateSuite = spawnSync(
  process.execPath,
  [BIN, '--target', 'https://x.test/mcp', '--suite', 'protocol', '--suite', 'protocol'],
  { cwd: REPO_ROOT, encoding: 'utf8' },
);
check(
  'duplicate --suite exit code',
  duplicateSuite.status === 2,
  `expected 2, got ${String(duplicateSuite.status)}`,
);
check(
  'duplicate --suite guidance on stderr',
  duplicateSuite.stderr.includes('duplicate --suite'),
  duplicateSuite.stderr.slice(0, 200),
);

// Drive-operation flag wiring (MCP-303): these two paths prove the new
// CLI_FLAGS/CLI_VALUE_OPTIONS entries reach the state they name — a
// miswired handler (e.g. --pack-out landing on preambleFile) produces a
// DIFFERENT refusal string here while every state-literal unit test stays
// green, since nothing else exercises the argv table at any scale.
const packOutWithoutDrive = spawnSync(
  process.execPath,
  [BIN, '--target', 'https://x.test/mcp', '--pack-out', 'tmp/pack.md'],
  { cwd: REPO_ROOT, encoding: 'utf8' },
);
check(
  'pack-out without drive exit code',
  packOutWithoutDrive.status === 2,
  `expected 2, got ${String(packOutWithoutDrive.status)}`,
);
check(
  'pack-out without drive guidance on stderr',
  packOutWithoutDrive.stderr.includes('--pack-out is only meaningful with --drive'),
  packOutWithoutDrive.stderr.slice(0, 200),
);

const driveWithSeed = spawnSync(
  process.execPath,
  [BIN, '--target', 'https://x.test/mcp', '--drive', '--seed'],
  { cwd: REPO_ROOT, encoding: 'utf8' },
);
check(
  'drive with seed exit code',
  driveWithSeed.status === 2,
  `expected 2, got ${String(driveWithSeed.status)}`,
);
check(
  'drive with seed guidance on stderr',
  driveWithSeed.stderr.includes('--drive and --seed are different operations'),
  driveWithSeed.stderr.slice(0, 200),
);

// Compat-operation flag wiring: the same argv-table proof as the drive pair
// above. A miswired `--compat` handler (landing on `drive`, say) produces a
// DIFFERENT refusal string here while every state-literal unit test stays
// green, because nothing else exercises the real argv table.
const compatWithUnattended = spawnSync(
  process.execPath,
  [BIN, '--target', 'https://x.test/mcp', '--compat', '--unattended'],
  { cwd: REPO_ROOT, encoding: 'utf8' },
);
check(
  'compat with unattended exit code',
  compatWithUnattended.status === 2,
  `expected 2, got ${String(compatWithUnattended.status)}`,
);
check(
  'compat with unattended guidance on stderr',
  compatWithUnattended.stderr.includes('--compat has no unattended mode'),
  compatWithUnattended.stderr.slice(0, 200),
);

const compatWithSuite = spawnSync(
  process.execPath,
  [BIN, '--target', 'https://x.test/mcp', '--compat', '--suite', 'protocol'],
  { cwd: REPO_ROOT, encoding: 'utf8' },
);
check(
  'compat with suite exit code',
  compatWithSuite.status === 2,
  `expected 2, got ${String(compatWithSuite.status)}`,
);
check(
  'compat with suite guidance on stderr',
  compatWithSuite.stderr.includes('drop --suite'),
  compatWithSuite.stderr.slice(0, 200),
);

if (failures.length > 0) {
  process.stderr.write(`SMOKE FAILED (mcp-conformance-cli):\n${failures.join('\n')}\n`);
  process.exit(1);
}
process.stdout.write(
  'SMOKE OK (mcp-conformance-cli): artefact shape + help + usage-error truth-set verified\n',
);
