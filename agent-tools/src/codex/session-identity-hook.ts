import { deriveIdentity } from '../core/agent-identity/index.js';

const CODEX_PLATFORM = 'codex';
const CODEX_MODEL = 'GPT-5';
const PREFLIGHT_COMMAND =
  'pnpm agent-tools:collaboration-state -- identity preflight --platform codex --model GPT-5';

/**
 * Pure input for the Codex `SessionStart` identity hook planner.
 */
interface CodexSessionIdentityHookInput {
  /** Raw JSON text Codex passes to command hooks on stdin. */
  readonly stdinText: string;
}

/**
 * Hook stdout payload accepted by Codex for `SessionStart`.
 *
 * @remarks
 * Empty object is emitted when no deterministic session identity can be
 * derived. Codex treats exit 0 with no useful output as success, so this
 * payload keeps the hook soft while still allowing valid sessions to receive
 * deterministic Practice identity context.
 */
interface CodexSessionIdentityHookOutput {
  readonly hookSpecificOutput?: {
    readonly hookEventName: 'SessionStart';
    readonly additionalContext: string;
  };
}

/**
 * Side-effect-free plan for the Codex `SessionStart` identity hook.
 */
interface CodexSessionIdentityHookPlan {
  readonly hookOutput: CodexSessionIdentityHookOutput;
}

/**
 * Plan Codex `SessionStart` hook output from stdin.
 *
 * @param input - Raw stdin JSON from Codex.
 * @returns A hook output payload carrying deterministic identity context, or
 * an empty payload when the hook input cannot identify the session.
 */
export function planCodexSessionIdentityHook(
  input: CodexSessionIdentityHookInput,
): CodexSessionIdentityHookPlan {
  const sessionId = readSessionId(input.stdinText);
  if (sessionId === undefined) {
    return { hookOutput: {} };
  }

  const identity = deriveIdentity(sessionId);

  return {
    hookOutput: {
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: identityContext({
          agentName: identity.displayName,
          sessionIdPrefix: sessionIdPrefix(sessionId),
        }),
      },
    },
  };
}

interface SessionStartPayload {
  readonly session_id: string;
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

  if (!isSessionStartPayload(parsed)) {
    return undefined;
  }

  const trimmed = parsed.session_id.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function isSessionStartPayload(value: unknown): value is SessionStartPayload {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    'session_id' in value &&
    typeof value.session_id === 'string'
  );
}

function sessionIdPrefix(sessionId: string): string {
  return sessionId.length >= 6 ? sessionId.slice(0, 6) : sessionId;
}

function identityContext(input: {
  readonly agentName: string;
  readonly sessionIdPrefix: string;
}): string {
  return [
    '[Practice agent identity]',
    'PDR-027 identity block:',
    `agent_name: ${input.agentName}`,
    `platform: ${CODEX_PLATFORM}`,
    `model: ${CODEX_MODEL}`,
    `session_id_prefix: ${input.sessionIdPrefix}`,
    'seed_source: CODEX_THREAD_ID',
    'Use this exact preflight before thread registration or shared-state writes:',
    PREFLIGHT_COMMAND,
    'Thread titles and statusline text are display conveniences only; the identity block above is the correctness surface.',
  ].join('\n');
}
