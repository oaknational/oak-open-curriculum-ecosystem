#!/usr/bin/env node
/**
 * Cursor CLI status-line shim.
 *
 * Delegates to the built Cursor status-line adapter inside agent-tools at
 * `agent-tools/dist/src/cursor/statusline-identity.js`. The adapter parses
 * Cursor CLI's stdin JSON, extracts `session_id`, and prints the deterministic
 * agent-identity display name.
 *
 * Soft surface: any failure (missing build artefact, spawn error, non-zero
 * child exit) results in exit 0 with no stdout, so the status line never
 * disrupts the session.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Prefer CURSOR_PROJECT_DIR when Cursor provides it; otherwise resolve from
// this repo-owned shim location.
const repoRoot =
  process.env.CURSOR_PROJECT_DIR ?? resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const adapterPath = resolve(repoRoot, 'agent-tools/dist/src/cursor/statusline-identity.js');

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
