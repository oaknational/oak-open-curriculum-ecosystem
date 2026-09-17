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
 * The shim captures stdin itself and pipes it on to the adapter: Claude Code
 * supplies the hook payload exactly once, and the failure path must be able
 * to persist and name the actual `session_id` seed even when the adapter
 * never runs.
 *
 * Soft surface, loud failure: every failure path (missing build artefact,
 * spawn error, signal, non-zero child exit) still exits 0 so the hook never
 * disrupts the session — but instead of a silent `{}` it attempts to persist
 * the seed to `$CLAUDE_ENV_FILE` while it still holds that hook-scoped path
 * (best-effort: skipped without a shell-safe seed or an env-file path, and
 * the append itself can fail — the diagnostic reflects the outcome), emits a
 * `hookSpecificOutput.additionalContext` diagnostic naming the cause and the
 * recovery, mirrors it to stderr, and appends it to
 * `.claude/logs/hook-errors.log`. Exit 0 is deliberate: the harness does not
 * surface a non-blocking hook's non-zero exit to the assistant or terminal
 * (see `.claude/hooks/_lib/log-hook-errors.sh`), and `SessionStart` stdout is
 * only consumed on exit 0 — additionalContext is the one channel the session
 * is guaranteed to see. Same fail-open observability pattern as
 * `run-pretooluse-guard.mjs` (registered in ADR-167 §Limitations 6).
 *
 * The failure-path decisions (seed parsing, shell-safety gating, persistence
 * planning, diagnostic wording) live in — and are unit-tested as —
 * `agent-tools/src/claude/session-identity-shim-decisions.ts`, committed
 * source this shim imports directly (Node strips the types at runtime). This
 * file stays thin IO wiring, the same shape as `run-pretooluse-guard.mjs`.
 */

import { spawn } from 'node:child_process';
import { appendFileSync, existsSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot =
  process.env.CLAUDE_PROJECT_DIR ?? resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const adapterPath = resolve(repoRoot, 'agent-tools/dist/src/bin/claude-session-identity-hook.js');

const stdinText = readStdin();

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}

// Load the fail-open plan logic from committed source, co-located with this
// shim (the relative specifier resolves against this file, NOT
// CLAUDE_PROJECT_DIR). Node strips the types at runtime. A dynamic import is
// used so a load failure degrades to a minimal diagnostic instead of a
// non-zero exit the harness would swallow.
let planShimFailOpen;
try {
  ({ planShimFailOpen } =
    await import('../../agent-tools/src/claude/session-identity-shim-decisions.ts'));
} catch (error) {
  planShimFailOpen = ({ cause }) => ({
    messageWhenPersisted: '',
    messageWhenNotPersisted:
      '[Practice agent identity] Identity hook could not run — identity NOT derived, and its ' +
      `decision module failed to load (${error.message}). Cause: ${cause}. Recover with ` +
      '`pnpm install` at the repo root, then derive the identity by hand with ' +
      '`pnpm agent-tools:agent-identity --seed "<session_id>" --format display`.',
  });
}

function failOpen(cause) {
  const plan = planShimFailOpen({
    cause,
    stdinText,
    envFile: process.env.CLAUDE_ENV_FILE,
    explicitSeed: process.env.PRACTICE_AGENT_SESSION_ID_CLAUDE,
    remoteSessionId: process.env.CLAUDE_CODE_REMOTE_SESSION_ID,
  });
  let persisted = false;
  if (plan.envFileWrite !== undefined) {
    try {
      appendFileSync(plan.envFileWrite.absolutePath, plan.envFileWrite.appendLine);
      persisted = true;
    } catch {
      // Persistence is best-effort; the message reflects the actual outcome.
    }
  }
  const message = persisted ? plan.messageWhenPersisted : plan.messageWhenNotPersisted;
  process.stderr.write(`${message}\n`);
  try {
    const logDir = resolve(repoRoot, '.claude', 'logs');
    mkdirSync(logDir, { recursive: true });
    appendFileSync(
      resolve(logDir, 'hook-errors.log'),
      `[${new Date().toISOString()}] practice-session-identity fail-open\n  ${message}\n\n`,
    );
  } catch {
    // Best-effort log; observability must never break the session.
  }
  const hookOutput = {
    hookSpecificOutput: { hookEventName: 'SessionStart', additionalContext: message },
  };
  process.stdout.write(`${JSON.stringify(hookOutput)}\n`);
  process.exit(0);
}

if (!existsSync(adapterPath)) {
  failOpen(`built adapter missing at ${adapterPath} (fresh checkout without pnpm install?)`);
}

const child = spawn(process.execPath, [adapterPath], {
  stdio: ['pipe', 'inherit', 'inherit'],
});

child.on('error', (error) => {
  failOpen(`could not spawn node for the adapter (${error.message})`);
});

child.on('exit', (code, signal) => {
  if (signal !== null) {
    failOpen(`adapter terminated by signal ${signal}`);
  }
  if (code !== 0) {
    failOpen(`adapter exited with code ${String(code)}`);
  }
  process.exit(0);
});

// Forward the captured payload; the adapter reads it as its own stdin. An
// early child exit makes the pipe write fail — swallow it, the exit handler
// carries the verdict.
child.stdin.on('error', () => {});
child.stdin.end(stdinText);
