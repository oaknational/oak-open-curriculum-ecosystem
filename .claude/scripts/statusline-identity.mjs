#!/usr/bin/env node
/**
 * Claude Code statusline shim.
 *
 * Delegates to the built Claude statusline adapter inside agent-tools at
 * `agent-tools/dist/src/claude/statusline-identity.js`. The adapter parses
 * Claude Code's stdin JSON, extracts `session_id`, and prints the
 * deterministic agent-identity display name.
 *
 * Soft surface: any failure (missing build artefact, spawn error, non-zero
 * child exit) results in exit 0 with no stdout, so the statusline never
 * disrupts the session.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Prefer CLAUDE_PROJECT_DIR (set by Claude Code in newer versions) over
// positional path arithmetic, which would silently drift if `.claude/scripts/`
// or `agent-tools/` ever relocates.
const repoRoot =
  process.env.CLAUDE_PROJECT_DIR ?? resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const adapterPath = resolve(repoRoot, 'agent-tools/dist/src/claude/statusline-identity.js');

if (!existsSync(adapterPath)) {
  process.exit(0);
}

const child = spawn(process.execPath, [adapterPath], {
  stdio: 'inherit',
});

child.on('error', () => {
  process.exit(0);
});

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
