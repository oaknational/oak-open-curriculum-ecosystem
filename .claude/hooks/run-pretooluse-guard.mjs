#!/usr/bin/env node
// Verdict wrapper for the dist-built PreToolUse guards.
//
// The PreToolUse guards live in agent-tools/dist (gitignored, materialised by
// the build). Invoking `node <missing>.js` directly exits 1, which Claude Code
// treats as a NON-BLOCKING error — so a missing/broken guard would SILENTLY let
// the dangerous tool call proceed unguarded. This wrapper takes control of the
// verdict and splits the two failure shapes:
//
//   - guard PRESENT but broken (crashes, killed, failed module load, bad args):
//     fail CLOSED (exit 2) — a built guard that misbehaves is a suspicious signal.
//   - guard NOT BUILT (artefact missing): fail OPEN (exit 0) with a loud, logged
//     warning — blocking here would brick a fresh / branch-switched worktree by
//     also blocking the `pnpm install` / `pnpm agent-tools:build` that recovers it.
//
// The security-critical decisions live in (and are unit-tested as)
// agent-tools/src/hook-policy/guard-runner-decisions.ts — committed source that
// Node imports directly (type-stripping). This file stays thin IO wiring.
//
// Build-free by necessity: it is the failsafe FOR a missing build artefact, so
// it cannot itself live in that artefact. Must remain at .claude/hooks/ — the
// repo-root depth ('..','..') is hardcoded.
import { spawn } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BLOCK = 2; // Claude Code hook contract: only exit 2 blocks the tool call.

const repoRoot =
  process.env.CLAUDE_PROJECT_DIR ?? resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const guardRelative = process.argv[2];
const log = (message) => process.stderr.write(`[hook-policy] ${message}\n`);

// Durable, best-effort observability for a fail-open allow. On an exit-0 allow the
// harness does not surface PreToolUse stderr, so persist the warning to the shared
// hook-error log at .claude/logs/hook-errors.log. That file's ADR-167 wrapper
// (.claude/hooks/_lib/log-hook-errors.sh) records only NON-zero exits, so it never
// captures an exit-0 fail-open; this is the complementary record for that case, in a
// deliberately simpler line format. Fully swallowed: a log-write failure must NEVER
// change the verdict or exit code — that would resurrect the catch-22 the fail-open
// exists to cure.
const appendHookErrorLog = (message) => {
  try {
    const logDir = resolve(repoRoot, '.claude', 'logs');
    mkdirSync(logDir, { recursive: true });
    appendFileSync(
      resolve(logDir, 'hook-errors.log'),
      `[${new Date().toISOString()}] hook-policy fail-open\n  ${message}\n\n`,
    );
  } catch {
    // best-effort observability only — never block on a log-write failure.
  }
};

// Load the fail-closed exit-code decision from committed source, co-located with
// this shim (the relative specifier resolves against this file, NOT
// CLAUDE_PROJECT_DIR). Node strips the types at runtime. A dynamic import is used
// so a load failure can be caught and made to fail closed — a static import that
// threw would exit 1, which Claude Code treats as non-blocking (fail open).
let resolveGuardExitCode;
let decideMissingGuardArtifact;
try {
  ({ resolveGuardExitCode, decideMissingGuardArtifact } =
    await import('../../agent-tools/src/hook-policy/guard-runner-decisions.ts'));
} catch (error) {
  log(`could not load guard decision logic: ${error.message}; blocking.`);
  process.exit(BLOCK);
}

if (!guardRelative) {
  log('run-pretooluse-guard: missing guard path argument; blocking.');
  process.exit(BLOCK);
}

const guardPath = resolve(repoRoot, guardRelative);

if (!existsSync(guardPath)) {
  // A not-built guard fails OPEN so a fresh / branch-switched worktree can run the
  // build instead of being bricked (blocking here would block the very `pnpm install`
  // / `pnpm agent-tools:build` that recovers it). existsSync is a liveness hint only,
  // never a security boundary: a guard that is present but crashes, is killed, or
  // races a deletion after this check still fails closed below (child exit code /
  // child.on('error')). The allow is loud — stderr plus a durable log line — so a
  // genuinely-missing guard is noticed, not silent.
  const { exitCode, warning } = decideMissingGuardArtifact(guardRelative);
  log(warning);
  appendHookErrorLog(warning);
  process.exit(exitCode);
}

// stdio:'inherit' forwards the hook payload (stdin) to the guard and passes the
// guard's stdout deny-JSON and stderr straight through to Claude Code.
const child = spawn(process.execPath, [guardPath], { stdio: 'inherit' });

child.on('error', (error) => {
  log(`failed to start guard ${guardRelative}: ${error.message}; blocking.`);
  process.exit(BLOCK);
});

child.on('exit', (code, signal) => {
  process.exit(resolveGuardExitCode(code, signal));
});
