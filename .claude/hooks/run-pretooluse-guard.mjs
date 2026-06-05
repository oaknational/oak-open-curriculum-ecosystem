#!/usr/bin/env node
// Fail-closed wrapper for the dist-built PreToolUse guards.
//
// The PreToolUse guards live in agent-tools/dist (gitignored, materialised by
// the build). Invoking `node <missing>.js` directly exits 1, which Claude Code
// treats as a NON-BLOCKING error — so a missing/broken guard would let the
// dangerous tool call proceed UNGUARDED (fail open). This wrapper closes that:
// it blocks (exit 2) unless the guard actually runs and returns a legitimate
// verdict (exit 0 = allow / stdout deny-JSON, or exit 2 = fail closed). Any
// other child exit — missing entry, crashed module load, signal — fails closed.
//
// Build-free by necessity: it is the failsafe FOR a missing build artefact, so
// it cannot itself live in that artefact. Mirrors the existing
// .claude/scripts/statusline-identity.mjs shim, inverted from soft to closed.
//
// Usage (from .claude/settings.json):
//   node "${CLAUDE_PROJECT_DIR}/.claude/hooks/run-pretooluse-guard.mjs" <guard-dist-relative-path>
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const BLOCK = 2; // Claude Code hook contract: only exit 2 blocks the tool call.

const repoRoot =
  process.env.CLAUDE_PROJECT_DIR ?? resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const guardRelative = process.argv[2];
const log = (message) => process.stderr.write(`[hook-policy] ${message}\n`);

if (!guardRelative) {
  log('run-pretooluse-guard: missing guard path argument; blocking.');
  process.exit(BLOCK);
}

const guardPath = resolve(repoRoot, guardRelative);

if (!existsSync(guardPath)) {
  // Break-glass ONLY for the benign "not built yet" case. A guard that exists
  // but crashes is handled below and always fails closed, even with this set.
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
  if (signal !== null) {
    log(`guard ${guardRelative} was killed by ${signal}; blocking.`);
    process.exit(BLOCK);
  }
  // The guards only ever exit 0 (allow / stdout-deny) or 2 (fail closed).
  // Treat the legitimate verdicts as a closed set; anything else (1 from a
  // broken module load, null, etc.) is an unavailable guard → fail closed.
  if (code === 0 || code === 2) {
    process.exit(code);
  }
  log(
    `guard ${guardRelative} exited ${code ?? 'null'} (likely a broken build); blocking. Rebuild agent-tools.`,
  );
  process.exit(BLOCK);
});
