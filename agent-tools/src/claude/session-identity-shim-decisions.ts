/**
 * Pure fail-open decisions for the Claude `SessionStart` identity shim
 * (`.claude/hooks/practice-session-identity.mjs`).
 *
 * Extracted so the shim's failure-path behaviour — seed parsing, shell-safety
 * gating, env-file persistence planning, and diagnostic wording — is
 * unit-tested in isolation; the shim imports this committed source directly
 * (Node strips the types at runtime) and stays a thin IO orchestrator, the
 * same shape as `../hook-policy/guard-runner-decisions.ts`. This module is
 * deliberately dependency-free: the shim loads it before any build exists.
 *
 * @packageDocumentation
 */

/**
 * Only a seed that is unambiguously shell-safe may be embedded in the env
 * file or a suggested command — stdin is external input, and neither surface
 * may become a quote-injection vector.
 */
const SAFE_SEED = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

/**
 * Parse the `session_id` seed from the hook's stdin JSON.
 *
 * @param stdinText - Raw stdin text Claude Code piped to the hook.
 * @returns The trimmed seed, or `undefined` when stdin carries no usable one.
 *
 * @example
 *
 * ```ts
 * readShimSessionId('{"session_id":"abc-123"}'); // 'abc-123'
 * readShimSessionId('not json'); // undefined
 * ```
 */
/**
 * Resolve the fail-open seed: the stripped cloud platform session id when
 * present (PDR-027 cloud-seat clause), the stdin `session_id` otherwise.
 */
function nonBlankShimValue(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed === undefined || trimmed.length === 0 ? undefined : trimmed;
}

function resolveShimSeed(input: {
  readonly explicitSeed?: string;
  readonly remoteSessionId?: string;
  readonly stdinText: string;
}): string | undefined {
  return (
    nonBlankShimValue(input.explicitSeed) ??
    stripShimSessionIdTag(input.remoteSessionId) ??
    readShimSessionId(input.stdinText)
  );
}

/**
 * Local copy of the PDR-027 session-id tag strip (canonical:
 * \`core/agent-identity/session-seed.ts\`). Duplicated deliberately: the shim
 * imports THIS module from raw source before any build exists, so it must
 * stay dependency-free — a \`.js\` relative import cannot resolve in the
 * source tree and would collapse the whole fail-open path to the minimal
 * diagnostic. The unit tests pin both copies to the same behaviour.
 */
function stripShimSessionIdTag(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (trimmed === undefined || trimmed.length === 0) {
    return undefined;
  }
  const payload = /^[a-z]+_(?<payload>.+)$/u.exec(trimmed)?.groups?.['payload'];
  if (payload === undefined || payload.length === 0) {
    return trimmed;
  }
  return payload;
}

export function readShimSessionId(stdinText: string): string | undefined {
  let parsed: unknown;
  try {
    parsed = JSON.parse(stdinText);
  } catch {
    return undefined;
  }
  if (typeof parsed !== 'object' || parsed === null || !('session_id' in parsed)) {
    return undefined;
  }
  const candidate: unknown = parsed.session_id;
  if (typeof candidate !== 'string') {
    return undefined;
  }
  const trimmed = candidate.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

/**
 * Whether a seed may be embedded in shell-facing surfaces.
 *
 * @param seed - The candidate seed.
 * @returns `true` only for the shell-safe character set.
 */
export function isShellSafeSeed(seed: string): boolean {
  return SAFE_SEED.test(seed);
}

/**
 * The shim's planned fail-open behaviour for one failure event.
 */
export interface ShimFailOpenPlan {
  /**
   * Env-file append that persists the seed, present only when the seed is
   * shell-safe and the hook holds a `CLAUDE_ENV_FILE` path. The shim
   * attempts this write first and selects the message by the outcome.
   */
  readonly envFileWrite?: {
    readonly absolutePath: string;
    readonly appendLine: string;
  };
  /** Diagnostic when the seed was persisted (env-file write succeeded). */
  readonly messageWhenPersisted: string;
  /** Diagnostic when no persistence happened (no write planned, or it failed). */
  readonly messageWhenNotPersisted: string;
}

/**
 * Plan the shim's loud fail-open: what to persist and what to say.
 *
 * Pure planning only — the shim performs the write and picks
 * {@link ShimFailOpenPlan.messageWhenPersisted} or
 * {@link ShimFailOpenPlan.messageWhenNotPersisted} by the write's outcome.
 *
 * @param input - The failure cause, raw stdin, and the hook-scoped env-file
 *   path (`CLAUDE_ENV_FILE` reaches the hook process only, never later shell
 *   calls — so persistence must be planned here or not at all).
 * @returns The fail-open plan.
 *
 * @example
 *
 * ```ts
 * const plan = planShimFailOpen({
 *   cause: 'built adapter missing',
 *   stdinText: '{"session_id":"abc-123"}',
 *   envFile: '/tmp/env',
 * });
 * plan.envFileWrite?.appendLine; // "export PRACTICE_AGENT_SESSION_ID_CLAUDE='abc-123'\n"
 * ```
 */
export function planShimFailOpen(input: {
  readonly cause: string;
  readonly stdinText: string;
  readonly envFile: string | undefined;
  /** Explicit operator seed — outranks the ambient platform id (PDR-027 precedence). */
  readonly explicitSeed?: string;
  /** Cloud-seat platform session id (raw, possibly tagged) — preferred over stdin per PDR-027. */
  readonly remoteSessionId?: string;
}): ShimFailOpenPlan {
  const sessionId = resolveShimSeed(input);
  const embeddable = sessionId !== undefined && isShellSafeSeed(sessionId);
  const envFile =
    input.envFile !== undefined && input.envFile.trim().length > 0 ? input.envFile : undefined;

  const envFileWrite =
    embeddable && envFile !== undefined
      ? {
          absolutePath: envFile,
          appendLine: `export PRACTICE_AGENT_SESSION_ID_CLAUDE='${sessionId}'\n`,
        }
      : undefined;

  const seed = embeddable ? sessionId : '<session_id>';
  const seedNote = embeddable
    ? ''
    : ' (seed = the Claude Code session UUID; this hook received no usable session_id on stdin)';

  const persistedRecovery =
    'The session seed WAS persisted: PRACTICE_AGENT_SESSION_ID_CLAUDE is exported via ' +
    '$CLAUDE_ENV_FILE, so identity-dependent tools resolve it as soon as the build exists. ' +
    'Recover with `pnpm install` at the repo root (the postinstall bootstrap builds ' +
    'agent-tools/dist), then confirm with `pnpm agent-tools:agent-identity --format display`.';

  const notPersistedRecovery =
    'The seed could NOT be persisted — the hook received no shell-safe session_id seed, held ' +
    'no $CLAUDE_ENV_FILE path, or the env-file append itself failed; the path does not reach ' +
    'later shell calls, so there is no retry surface. Recover with `pnpm install` at the repo root (the ' +
    'postinstall bootstrap builds agent-tools/dist), then supply the seed inline on each ' +
    'identity-dependent command: ' +
    `\`PRACTICE_AGENT_SESSION_ID_CLAUDE='${seed}' pnpm agent-tools:agent-identity --format display\`` +
    seedNote +
    '.';

  const prefix = '[Practice agent identity] Identity hook could not run — ';
  return {
    envFileWrite,
    messageWhenPersisted: `${prefix}display identity NOT derived (seed exported). Cause: ${input.cause}. ${persistedRecovery}`,
    messageWhenNotPersisted: `${prefix}identity NOT derived, PRACTICE_AGENT_SESSION_ID_CLAUDE NOT exported. Cause: ${input.cause}. ${notPersistedRecovery}`,
  };
}
