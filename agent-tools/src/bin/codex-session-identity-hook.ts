#!/usr/bin/env node
/**
 * Codex `SessionStart` identity hook adapter (Practice agent identity).
 *
 * @remarks
 * Reads the JSON object Codex passes on stdin, derives the deterministic
 * Practice agent identity from `session_id`, and prints a
 * `hookSpecificOutput.additionalContext` payload with the PDR-027 identity
 * block and canonical identity-preflight command. The hook is intentionally
 * soft: malformed stdin or unexpected failures emit `{}` and exit 0 so Codex
 * session startup is never blocked by identity display plumbing.
 *
 * @packageDocumentation
 */

import { readFileSync } from 'node:fs';

import { planCodexSessionIdentityHook } from '../codex/session-identity-hook.js';

emit();

function emit(): void {
  try {
    const plan = planCodexSessionIdentityHook({ stdinText: readStdin() });
    process.stdout.write(`${JSON.stringify(plan.hookOutput)}\n`);
  } catch {
    process.stdout.write('{}\n');
  }
}

function readStdin(): string {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}
