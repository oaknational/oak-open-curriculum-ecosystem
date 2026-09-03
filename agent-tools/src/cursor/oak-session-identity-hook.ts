import { join } from 'node:path';

import { sessionIdPrefix } from '../collaboration-state/identity.js';
import { deriveIdentity } from '../core/agent-identity/index.js';

const COMPOSER_MIRROR_FILE = 'oak-composer-session.local.json';
const MIRROR_SCHEMA = 'oak.cursor-composer-session.v1';

/**
 * Environment inputs consumed by the Cursor session identity hook.
 */
export interface CursorSessionIdentityHookEnvironment {
  readonly CURSOR_PROJECT_DIR?: string;
  readonly CLAUDE_PROJECT_DIR?: string;
  readonly OAK_SKIP_COMPOSER_SESSION_MIRROR?: string;
  /** Explicit operator display-name override — honoured for rendering only, never written back. */
  readonly OAK_AGENT_IDENTITY_OVERRIDE?: string;
}

/**
 * Pure planning input for the Cursor session identity hook.
 */
interface CursorSessionIdentityHookInput {
  readonly stdinText: string;
  readonly environment: CursorSessionIdentityHookEnvironment;
  readonly fallbackProjectDir: string;
  readonly nowIso: string;
}

/**
 * Hook output accepted by Cursor's `sessionStart` hook contract.
 */
interface CursorSessionIdentityHookOutput {
  readonly env: Record<string, string>;
  readonly additional_context: string;
  readonly user_message?: string;
}

/**
 * Gitignored local mirror payload for human-visible Composer identity.
 */
interface CursorSessionIdentityMirrorPayload {
  readonly schema: typeof MIRROR_SCHEMA;
  readonly updatedAt: string;
  readonly composerSessionId: string;
  readonly sessionIdPrefix: string;
  readonly displayName: string;
  readonly suggestedComposerTabTitle: string;
}

/**
 * Side-effect plan emitted by the pure Cursor hook planner.
 */
interface CursorSessionIdentityHookPlan {
  readonly output: CursorSessionIdentityHookOutput;
  readonly mirror?: {
    readonly absolutePath: string;
    readonly payload: CursorSessionIdentityMirrorPayload;
  };
}

/**
 * Select the process-environment values the Cursor session identity hook
 * consumes. The executable adapter MUST build its planner environment
 * through this function — hand-picking variables at the bin boundary is
 * the class of defect that silently dropped the remote session id and the
 * operator override from production hook runs.
 */
export function cursorSessionIdentityHookEnvironmentFromProcessEnv(
  env: NodeJS.ProcessEnv,
): CursorSessionIdentityHookEnvironment {
  return {
    ...(env.CURSOR_PROJECT_DIR === undefined ? {} : { CURSOR_PROJECT_DIR: env.CURSOR_PROJECT_DIR }),
    ...(env.CLAUDE_PROJECT_DIR === undefined ? {} : { CLAUDE_PROJECT_DIR: env.CLAUDE_PROJECT_DIR }),
    ...(env.OAK_SKIP_COMPOSER_SESSION_MIRROR === undefined
      ? {}
      : { OAK_SKIP_COMPOSER_SESSION_MIRROR: env.OAK_SKIP_COMPOSER_SESSION_MIRROR }),
    ...(env.OAK_AGENT_IDENTITY_OVERRIDE === undefined
      ? {}
      : { OAK_AGENT_IDENTITY_OVERRIDE: env.OAK_AGENT_IDENTITY_OVERRIDE }),
  };
}

/**
 * Plan Cursor `sessionStart` output from stdin and injected environment.
 */
export function planCursorSessionIdentityHook(
  input: CursorSessionIdentityHookInput,
): CursorSessionIdentityHookPlan {
  const sessionId = readSessionId(input.stdinText);
  if (sessionId === undefined) {
    return { output: emptyOutput() };
  }

  const projectDir = resolveProjectDir(input.environment, input.fallbackProjectDir);
  const prefix = sessionIdPrefix(sessionId);
  const override = input.environment.OAK_AGENT_IDENTITY_OVERRIDE?.trim();
  const displayName = deriveIdentity(
    sessionId,
    override === undefined || override.length === 0 ? {} : { override },
  ).displayName;
  const tabHint = `Oak · ${displayName}`;
  const output = {
    env: {
      // Seed only — a pinned name override lets a later seed change produce
      // a mixed-provenance identity tuple; the name derives from the live
      // seed at every point of use (PDR-027, 2026-08-24 amendment).
      PRACTICE_AGENT_SESSION_ID_CURSOR: sessionId,
    },
    additional_context: identityContext({ displayName, tabHint, prefix }),
    user_message: `${tabHint} — suggested Composer tab title; details in .cursor/${COMPOSER_MIRROR_FILE}`,
  };

  if (shouldSkipMirror(input.environment)) {
    return { output };
  }

  return {
    output,
    mirror: {
      absolutePath: join(projectDir, '.cursor', COMPOSER_MIRROR_FILE),
      payload: {
        schema: MIRROR_SCHEMA,
        updatedAt: input.nowIso,
        composerSessionId: sessionId,
        sessionIdPrefix: prefix,
        displayName,
        suggestedComposerTabTitle: tabHint,
      },
    },
  };
}

function emptyOutput(): CursorSessionIdentityHookOutput {
  return { env: {}, additional_context: '' };
}

function readSessionId(stdinText: string): string | undefined {
  try {
    const input: unknown = JSON.parse(stdinText);
    if (!isCursorSessionStartInput(input) || typeof input.session_id !== 'string') {
      return undefined;
    }
    const sessionId = input.session_id.trim();
    return sessionId.length === 0 ? undefined : sessionId;
  } catch {
    return undefined;
  }
}

function resolveProjectDir(
  environment: CursorSessionIdentityHookEnvironment,
  fallbackProjectDir: string,
): string {
  return (
    nonEmpty(environment.CURSOR_PROJECT_DIR) ??
    nonEmpty(environment.CLAUDE_PROJECT_DIR) ??
    fallbackProjectDir
  );
}

function identityContext(input: {
  readonly displayName: string;
  readonly tabHint: string;
  readonly prefix: string;
}): string {
  return [
    '[Practice agent identity]',
    `Deterministic display name for this composer session: ${input.displayName}`,
    `Suggested Composer tab title (Cursor has no hook API to set it automatically): ${input.tabHint}`,
    `PDR-027 session_id_prefix (first 6 of the PDR-027 seed): ${input.prefix}`,
    'PRACTICE_AGENT_SESSION_ID_CURSOR is set from the composer session_id for hook subprocesses in this session.',
    'From repo root, `pnpm agent-tools:agent-identity --format display` also resolves when PRACTICE_AGENT_SESSION_ID_CURSOR is set in your shell (if Cursor forwards session env to the terminal, it matches).',
  ].join('\n');
}

function shouldSkipMirror(environment: CursorSessionIdentityHookEnvironment): boolean {
  return environment.OAK_SKIP_COMPOSER_SESSION_MIRROR?.trim() === '1';
}

function nonEmpty(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

interface CursorSessionStartInput {
  readonly session_id?: unknown;
}

function isCursorSessionStartInput(value: unknown): value is CursorSessionStartInput {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
