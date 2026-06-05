import { spawnSync, type SpawnSyncReturns } from 'node:child_process';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Smoke test for the fail-closed PreToolUse guard shim
 * (`.claude/hooks/run-pretooluse-guard.mjs`). Real subprocess startup belongs to
 * smoke per the repo testing doctrine (vitest tests are in-process / DI). This
 * spawns the real shim against fake guard fixtures and proves the contract:
 * missing/broken guard becomes a block (exit 2); bypass only for the
 * missing-entry case; transparent passthrough of a healthy guard's verdict.
 */

const smokeDir = fileURLToPath(new URL('.', import.meta.url));
const repoRoot = resolve(smokeDir, '..', '..');
const shimPath = resolve(repoRoot, '.claude/hooks/run-pretooluse-guard.mjs');

function fail(message: string): never {
  process.stderr.write(`pretooluse-guard smoke FAILED: ${message}\n`);
  process.exit(1);
}

interface ShimRun {
  readonly guardRelative: string;
  readonly projectDir: string;
  readonly input?: string;
  readonly allowMissing?: boolean;
}

function runShim(run: ShimRun): SpawnSyncReturns<string> {
  const env: Record<string, string> = { CLAUDE_PROJECT_DIR: run.projectDir };
  if (run.allowMissing === true) {
    env.OAK_ALLOW_MISSING_PRETOOLUSE_GUARDS = '1';
  }
  return spawnSync(process.execPath, [shimPath, run.guardRelative], {
    input: run.input ?? '{}',
    encoding: 'utf8',
    env,
  });
}

function fakeGuard(source: string): ShimRun {
  const projectDir = mkdtempSync(join(tmpdir(), 'oak-guard-smoke-'));
  writeFileSync(join(projectDir, 'fake-guard.mjs'), source, 'utf8');
  return { projectDir, guardRelative: 'fake-guard.mjs' };
}

function emptyProject(): string {
  return mkdtempSync(join(tmpdir(), 'oak-guard-smoke-'));
}

const missingGuard = 'agent-tools/dist/src/hook-policy/check-blocked-patterns.js';

// 1. Missing artefact blocks (exit 2) with a remediation message.
const missing = runShim({ guardRelative: missingGuard, projectDir: emptyProject() });
if (missing.status !== 2) {
  fail(`missing guard should block (exit 2), got ${String(missing.status)}`);
}
if (!missing.stderr.includes('not built')) {
  fail('missing guard should explain the artefact is not built');
}

// 2. Missing artefact is allowed (exit 0) ONLY under the bypass, with a loud warning.
const bypassed = runShim({
  guardRelative: missingGuard,
  projectDir: emptyProject(),
  allowMissing: true,
});
if (bypassed.status !== 0) {
  fail(`missing guard with bypass should allow (exit 0), got ${String(bypassed.status)}`);
}
if (!bypassed.stderr.includes('BYPASSED') || !bypassed.stderr.includes('UNGUARDED')) {
  fail('the bypass must emit a loud UNGUARDED warning');
}

// 3. A present-but-broken guard (missing transitive import) blocks (exit 2)...
const broken = fakeGuard("import './does-not-exist.mjs';\n");
if (runShim(broken).status !== 2) {
  fail('a broken guard (exit 1) must be collapsed to a block (exit 2)');
}
// ...even with the bypass set: the bypass is scoped to the missing-entry case only.
if (runShim({ ...broken, allowMissing: true }).status !== 2) {
  fail('the bypass must NOT mask a present-but-broken guard');
}

// 4. A healthy guard's deny verdict (exit 0 + stdout payload) is passed through unchanged.
const denying = fakeGuard(
  'process.stdout.write(\'{"hookSpecificOutput":{"permissionDecision":"deny"}}\\n\');\nprocess.exit(0);\n',
);
const denied = runShim(denying);
if (denied.status !== 0 || !denied.stdout.includes('"permissionDecision":"deny"')) {
  fail('a healthy guard deny (exit 0 + stdout) must pass through unchanged');
}

// 5. A healthy guard's fail-closed verdict (exit 2) is passed through.
if (runShim(fakeGuard('process.exit(2);\n')).status !== 2) {
  fail('a healthy guard exit 2 must pass through');
}

// 6. The hook stdin payload is forwarded to the guard.
const echo = fakeGuard(
  "let d = '';\nprocess.stdin.on('data', (c) => { d += c; });\nprocess.stdin.on('end', () => { process.stdout.write('RECEIVED:' + d); process.exit(0); });\n",
);
const echoed = runShim({ ...echo, input: '{"tool_name":"Bash"}' });
if (echoed.status !== 0 || !echoed.stdout.includes('RECEIVED:{"tool_name":"Bash"}')) {
  fail('the shim must forward the hook stdin payload to the guard');
}

process.stdout.write(
  'pretooluse-guard smoke OK: fail-closed on missing/broken, bypass scoped to missing-only, transparent on a healthy guard\n',
);
