#!/usr/bin/env node
/**
 * Claude Code `SessionStart` hook shim for the gate-expiry drift alert.
 *
 * Runs the built non-blocking drift checker
 * (`agent-tools/dist/src/validators/plan-schema/check-plan-gate-drift.js`)
 * and, when drift exists, injects its alert (the drift report plus the
 * standing resolution instructions) as session context — so every
 * session opens seeing the demand until the gate rows change. This is
 * the persistent, repo-riding, NEVER-BLOCKING surface the owner ruled
 * for gate-expiry drift (2026-07-31); the checker is deliberately
 * absent from every blocking aggregate.
 *
 * Soft surface: any failure (missing build artefact, spawn error)
 * results in exit 0 with `{}` on stdout, so the hook never disrupts
 * the session.
 */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot =
  process.env.CLAUDE_PROJECT_DIR ?? resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const checkerPath = resolve(
  repoRoot,
  'agent-tools/dist/src/validators/plan-schema/check-plan-gate-drift.js',
);

function emitEmpty() {
  process.stdout.write('{}\n');
  process.exit(0);
}

if (!existsSync(checkerPath)) {
  emitEmpty();
}

const child = spawn(process.execPath, [checkerPath], {
  stdio: ['ignore', 'pipe', 'ignore'],
});

let output = '';
child.stdout.on('data', (chunk) => {
  output += String(chunk);
});

child.on('error', () => {
  emitEmpty();
});

child.on('exit', (code) => {
  const alert = output.trim();
  if (code === 1 && alert.length > 0) {
    process.stdout.write(
      `${JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'SessionStart',
          additionalContext: `[Plan gate-expiry drift alert]\n${alert}`,
        },
      })}\n`,
    );
    process.exit(0);
  }
  emitEmpty();
});
