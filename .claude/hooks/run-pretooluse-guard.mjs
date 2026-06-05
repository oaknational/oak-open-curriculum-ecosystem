#!/usr/bin/env node
// Fail-closed wrapper for the dist-built PreToolUse guards.
//
// The PreToolUse guards live in agent-tools/dist (gitignored, materialised by
// the build). Invoking `node <missing>.js` directly exits 1, which Claude Code
// treats as a NON-BLOCKING error — so a missing/broken guard would let the
// dangerous tool call proceed UNGUARDED (fail open). This wrapper closes that:
// it blocks (exit 2) unless the guard actually runs and returns a legitimate
// verdict (exit 0 = allow / stdout deny-JSON, or exit 2 = fail closed).
//
// The security-critical exit-code mapping lives in (and is unit-tested as)
// agent-tools/src/hook-policy/guard-runner-decisions.ts — committed source that
// Node imports directly (type-stripping). This file stays thin IO wiring.
//
// Build-free by necessity: it is the failsafe FOR a missing build artefact, so
// it cannot itself live in that artefact. Must remain at .claude/hooks/ — the
// repo-root depth ('..','..') is hardcoded.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BLOCK = 2; // Claude Code hook contract: only exit 2 blocks the tool call.

const repoRoot =
  process.env.CLAUDE_PROJECT_DIR ?? resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const guardRelative = process.argv[2];
const log = (message) => process.stderr.write(`[hook-policy] ${message}\n`);

// Load the fail-closed exit-code decision from committed source, co-located with
// this shim (the relative specifier resolves against this file, NOT
// CLAUDE_PROJECT_DIR). Node strips the types at runtime. A dynamic import is used
// so a load failure can be caught and made to fail closed — a static import that
// threw would exit 1, which Claude Code treats as non-blocking (fail open).
let resolveGuardExitCode;
try {
  ({ resolveGuardExitCode } =
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
  // Break-glass ONLY for the benign "not built yet" case. A guard that exists
  // but crashes is handled by resolveGuardExitCode and always fails closed.
  if (process.env.OAK_ALLOW_MISSING_PRETOOLUSE_GUARDS === '1') {
    log(
      `BYPASSED — ${guardRelative} is not built and OAK_ALLOW_MISSING_PRETOOLUSE_GUARDS=1; this tool call runs UNGUARDED.`,
    );
    process.exit(0);
  }
  log(`PreToolUse guard not built: ${guardRelative}`);
  log('Rebuild it: `pnpm install` (postinstall builds dist) or `pnpm agent-tools:build`.');
  log(
    'Break-glass (per-invocation only, NOT for your shell profile): OAK_ALLOW_MISSING_PRETOOLUSE_GUARDS=1.',
  );
  process.exit(BLOCK);
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
