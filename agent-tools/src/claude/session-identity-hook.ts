import { deriveIdentity } from '../core/agent-identity/index.js';

/**
 * Environment inputs consumed by the Claude `SessionStart` identity hook.
 *
 * @remarks
 * Claude Code provides `CLAUDE_ENV_FILE` to `SessionStart`, `CwdChanged`, and
 * `FileChanged` hooks as a path that may be appended with `export FOO=bar`
 * lines. Variables written there persist for the rest of the session's Bash
 * tool calls. See https://code.claude.com/docs/en/hooks.
 */
export interface ClaudeSessionIdentityHookEnvironment {
  readonly CLAUDE_ENV_FILE?: string;
}

/**
 * Pure planning input for the Claude `SessionStart` identity hook.
 */
export interface ClaudeSessionIdentityHookInput {
  /** Raw JSON text Claude Code passes on stdin. */
  readonly stdinText: string;
  /** Environment values relevant to env-file persistence. */
  readonly environment: ClaudeSessionIdentityHookEnvironment;
}

/**
 * Hook stdout payload accepted by Claude Code's `SessionStart` contract.
 *
 * @remarks
 * Empty object is emitted when no derivation is possible. `hookSpecificOutput`
 * carries `additionalContext` only — `SessionStart` does not support a
 * session-title field. Title-setting is documented as `UserPromptSubmit`-only.
 */
export interface ClaudeSessionIdentityHookOutput {
  readonly hookSpecificOutput?: {
    readonly hookEventName: 'SessionStart';
    readonly additionalContext: string;
  };
}

/**
 * Side-effect plan emitted by the pure Claude `SessionStart` hook planner.
 */
export interface ClaudeSessionIdentityHookPlan {
  readonly hookOutput: ClaudeSessionIdentityHookOutput;
  readonly envFileWrite?: {
    readonly absolutePath: string;
    readonly appendLine: string;
  };
}

/**
 * Plan Claude Code `SessionStart` hook output and env-file persistence.
 *
 * @param input - Raw stdin JSON and environment values.
 * @returns Hook stdout payload plus an optional env-file write description.
 */
export function planClaudeSessionIdentityHook(
  input: ClaudeSessionIdentityHookInput,
): ClaudeSessionIdentityHookPlan {
  const sessionId = readSessionId(input.stdinText);
  if (sessionId === undefined) {
    return { hookOutput: {} };
  }

  const displayName = deriveIdentity(sessionId).displayName;
  const prefix = sessionIdPrefix(sessionId);
  const additionalContext = identityContext({ displayName, prefix });

  const hookOutput: ClaudeSessionIdentityHookOutput = {
    hookSpecificOutput: {
      hookEventName: 'SessionStart',
      additionalContext,
    },
  };

  const envFile = nonEmpty(input.environment.CLAUDE_ENV_FILE);
  if (envFile === undefined) {
    return { hookOutput };
  }

  return {
    hookOutput,
    envFileWrite: {
      absolutePath: envFile,
      appendLine: `export PRACTICE_AGENT_SESSION_ID_CLAUDE=${sessionId}\n`,
    },
  };
}

interface SessionIdPayload {
  readonly session_id: string;
}
function isSessionIdPayload(value: unknown): value is SessionIdPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    'session_id' in value &&
    typeof value.session_id === 'string'
  );
}

function readSessionId(stdinText: string): string | undefined {
  if (stdinText.length === 0) {
    return undefined;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdinText);
  } catch {
    return undefined;
  }
  if (!isSessionIdPayload(parsed)) {
    return undefined;
  }
  const candidate = parsed.session_id;
  if (typeof candidate !== 'string') {
    return undefined;
  }
  const trimmed = candidate.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function sessionIdPrefix(sessionId: string): string {
  return sessionId.length >= 6 ? sessionId.slice(0, 6) : sessionId;
}

function identityContext(input: { readonly displayName: string; readonly prefix: string }): string {
  return [
    '[Practice agent identity]',
    `Session identity (PDR-027): ${input.displayName}.`,
    `PDR-027 session_id_prefix (first 6 of session_id): ${input.prefix}.`,
    'PRACTICE_AGENT_SESSION_ID_CLAUDE is set in $CLAUDE_ENV_FILE so shell tools (e.g. `pnpm agent-tools:agent-identity --format display`) resolve the same identity without --seed.',
    `Once the session intent is clear, suggest the user run: /rename ${input.displayName} - <intent>`,
    'so the agent name is the first part of the session title. Do not auto-rename — the user owns the title.',
  ].join('\n');
}

function nonEmpty(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}
