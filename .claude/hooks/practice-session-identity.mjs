#!/usr/bin/env node
/**
 * Claude Code `SessionStart` hook shim for Practice agent identity.
 *
 * Delegates to the built adapter inside agent-tools at
 * `agent-tools/dist/src/bin/claude-session-identity-hook.js`. The adapter
 * parses Claude Code's stdin JSON, appends `PRACTICE_AGENT_SESSION_ID_CLAUDE`
 * to `$CLAUDE_ENV_FILE` so subsequent Bash tool calls in the session can read
 * the deterministic seed, and prints a `hookSpecificOutput` payload carrying
 * the agent identity row.
 *
 * Soft surface: any failure (missing build artefact, spawn error, non-zero
 * child exit) results in exit 0 with `{}` on stdout, so the hook never
 * disrupts the session.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot =
  process.env.CLAUDE_PROJECT_DIR ?? resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const adapterPath = resolve(repoRoot, 'agent-tools/dist/src/bin/claude-session-identity-hook.js');

if (!existsSync(adapterPath)) {
  process.stdout.write('{}\n');
  process.exit(0);
}

const child = spawn(process.execPath, [adapterPath], {
  stdio: ['inherit', 'inherit', 'inherit'],
});

child.on('error', () => {
  process.stdout.write('{}\n');
  process.exit(0);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
