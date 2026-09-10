import { sessionIdPrefix } from '../collaboration-state/identity.js';
import { deriveIdentity } from '../core/agent-identity/index.js';
import { stripSessionIdTag } from '../core/agent-identity/session-seed.js';
import { shellSingleQuote } from '../core/shell-single-quote.js';

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
  /** Explicit operator seed — outranks the ambient platform id (PDR-027 precedence). */
  readonly PRACTICE_AGENT_SESSION_ID_CLAUDE?: string;
  /** Explicit operator display-name override — honoured for rendering only, never written back. */
  readonly OAK_AGENT_IDENTITY_OVERRIDE?: string;
  /**
   * Cloud-seat platform session id (`cse_`-tagged). Its untagged payload is
   * the PDR-027 seed there — the identifier the owner sees in the session
   * URL, the one Claude-Session commit trailers carry, and the one that
   * survives container recycling; harness stdin `session_id` remains the
   * seed on CLI seats.
   */
  readonly CLAUDE_CODE_REMOTE_SESSION_ID?: string;
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
  const sessionId = resolveSeed(input);
  if (sessionId === undefined) {
    return { hookOutput: {} };
  }

  const override = nonEmpty(input.environment.OAK_AGENT_IDENTITY_OVERRIDE);
  const displayName = deriveIdentity(
    sessionId,
    override === undefined ? {} : { override },
  ).displayName;
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
      // Seed only — never a pinned display name. Pinning
      // OAK_AGENT_IDENTITY_OVERRIDE here let a later seed change produce a
      // mixed-provenance tuple (name from the old seed, prefix and uuid
      // from the new one); the name derives from the live seed at every
      // point of use instead (PDR-027, 2026-08-24 amendment).
      appendLine: `export PRACTICE_AGENT_SESSION_ID_CLAUDE=${shellSingleQuote(sessionId)}\n`,
    },
  };
}

/**
 * Select the process-environment values the Claude `SessionStart` identity
 * hook consumes. The executable adapter MUST build its planner environment
 * through this function: hand-picking variables at the bin boundary is how
 * `CLAUDE_CODE_REMOTE_SESSION_ID` was silently dropped, leaving the
 * cloud-seat branch unreachable in production.
 */
export function claudeSessionIdentityHookEnvironmentFromProcessEnv(
  env: NodeJS.ProcessEnv,
): ClaudeSessionIdentityHookEnvironment {
  return {
    ...(env.CLAUDE_ENV_FILE === undefined ? {} : { CLAUDE_ENV_FILE: env.CLAUDE_ENV_FILE }),
    ...(env.PRACTICE_AGENT_SESSION_ID_CLAUDE === undefined
      ? {}
      : { PRACTICE_AGENT_SESSION_ID_CLAUDE: env.PRACTICE_AGENT_SESSION_ID_CLAUDE }),
    ...(env.CLAUDE_CODE_REMOTE_SESSION_ID === undefined
      ? {}
      : { CLAUDE_CODE_REMOTE_SESSION_ID: env.CLAUDE_CODE_REMOTE_SESSION_ID }),
    ...(env.OAK_AGENT_IDENTITY_OVERRIDE === undefined
      ? {}
      : { OAK_AGENT_IDENTITY_OVERRIDE: env.OAK_AGENT_IDENTITY_OVERRIDE }),
  };
}

function resolveSeed(input: ClaudeSessionIdentityHookInput): string | undefined {
  // PDR-027 precedence: an explicit Practice seed outranks the ambient
  // platform id, which outranks the harness stdin session_id.
  const explicitSeed = nonEmpty(input.environment.PRACTICE_AGENT_SESSION_ID_CLAUDE);
  if (explicitSeed !== undefined) {
    return explicitSeed;
  }
  const remoteSessionId = nonEmpty(input.environment.CLAUDE_CODE_REMOTE_SESSION_ID);
  if (remoteSessionId !== undefined) {
    return stripSessionIdTag(remoteSessionId);
  }
  return readSessionId(input.stdinText);
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

function identityContext(input: { readonly displayName: string; readonly prefix: string }): string {
  return [
    '[Practice agent identity]',
    `Session identity (PDR-027): ${input.displayName}.`,
    `PDR-027 session_id_prefix (first 6 of the PDR-027 seed): ${input.prefix}.`,
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
