#!/usr/bin/env node
/**
 * Claude Code statusline adapter for the deterministic agent-identity CLI.
 *
 * @remarks
 * Reads the JSON object Claude Code passes on stdin, extracts `session_id`,
 * and prints the deterministic display name produced by the built
 * `agent-identity` CLI at
 * `agent-tools/dist/src/bin/agent-identity.js`.
 *
 * The statusline is a soft surface: missing input, missing build artefact, or
 * any spawn failure exits 0 with empty stdout rather than disrupting the
 * session. The underlying CLI honours `OAK_AGENT_IDENTITY_OVERRIDE`; this
 * adapter forwards the inherited environment unchanged.
 *
 * @packageDocumentation
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { planStatuslineExecution, type StatuslinePlan } from './statusline-identity-input.js';

const builtIdentityCliPath = resolveBuiltIdentityCliPath();

let stdinBuffer = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  stdinBuffer += chunk;
});
process.stdin.on('end', () => {
  emitStatuslineIdentity(stdinBuffer);
});

function emitStatuslineIdentity(rawJson: string): void {
  const plan: StatuslinePlan = planStatuslineExecution(rawJson);
  if (plan.kind === 'noop') {
    return;
  }
  if (!existsSync(builtIdentityCliPath)) {
    return;
  }

  const result = spawnSync(
    process.execPath,
    [builtIdentityCliPath, '--seed', plan.seed, '--format', 'display'],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    return;
  }
  process.stdout.write(result.stdout.trim());
}

function resolveBuiltIdentityCliPath(): string {
  const moduleDir = dirname(fileURLToPath(import.meta.url));
  return resolve(moduleDir, '..', 'bin', 'agent-identity.js');
}
