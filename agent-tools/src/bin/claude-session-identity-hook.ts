#!/usr/bin/env node
/**
 * Claude Code `SessionStart` identity hook adapter (Practice agent identity).
 *
 * @remarks
 * Reads the JSON object Claude Code passes on stdin, derives the deterministic
 * agent identity from `session_id`, appends `PRACTICE_AGENT_SESSION_ID_CLAUDE`
 * to `$CLAUDE_ENV_FILE` so subsequent Bash tool calls in the session can read
 * it, and prints a `hookSpecificOutput` JSON object with `additionalContext`
 * carrying the identity row plus a non-binding `/rename` suggestion. The hook
 * is a soft surface: any failure path emits an empty `{}` object so the
 * harness never disrupts the session.
 *
 * @packageDocumentation
 */

import { appendFileSync, readFileSync } from 'node:fs';

import {
  planClaudeSessionIdentityHook,
  type ClaudeSessionIdentityHookEnvironment,
} from '../claude/session-identity-hook.js';

emit();

function emit(): void {
  const stdinText = readStdin();
  const plan = planClaudeSessionIdentityHook({
    stdinText,
    environment: hookEnvironment(),
  });

  if (plan.envFileWrite !== undefined) {
    try {
      appendFileSync(plan.envFileWrite.absolutePath, plan.envFileWrite.appendLine);
    } catch {
      // The env-file write is best-effort; hook stdout remains valid.
    }
  }

  process.stdout.write(`${JSON.stringify(plan.hookOutput)}\n`);
}

function readStdin(): string {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

function hookEnvironment(): ClaudeSessionIdentityHookEnvironment {
  if (process.env.CLAUDE_ENV_FILE === undefined) {
    return {};
  }
  return { CLAUDE_ENV_FILE: process.env.CLAUDE_ENV_FILE };
}
