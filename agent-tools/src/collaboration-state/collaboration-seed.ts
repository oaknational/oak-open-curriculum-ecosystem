/**
 * Resolution of the PDR-027 seed a collaboration identity derives from.
 *
 * @remarks
 * This module answers one question: given the process environment a seat
 * runs in, which value is its PDR-027 seed, and where did it come from? It is
 * the environment → seed half of the identity seam; the seed → identity half
 * (UUID v5 derivation, the `session_id_prefix` slice, the write-identity
 * shapes) lives in the sibling module `identity.ts` and consumes this
 * module. Splitting here keeps each half fully documented within the
 * repository's file-size limit without trimming either.
 *
 * Seed precedence (PDR-027 §Seed precedence, 2026-08-24 amendment): the
 * explicit Practice seeds in platform order, then the cloud seat's ambient
 * platform session id with its type tag stripped, then the harness-native
 * fallbacks (`CODEX_THREAD_ID`, Antigravity `conversationId`). Every explicit
 * Practice seed outranks the ambient cloud id — they are the operator's
 * stated contract.
 *
 * @packageDocumentation
 */

import { stripSessionIdTagIfPresent } from '../core/agent-identity/session-seed.js';

import { type CollaborationStateEnvironment } from './types.js';

/**
 * A resolved seed and the environment variable it was read from. `source`
 * is recorded on every derived identity (`seed_source`) so a registry row
 * can say which contract produced it.
 */
interface SeedCandidate {
  readonly source: string;
  readonly value: string;
}

/**
 * Resolve the PDR-027 seed from the environment, in precedence order.
 *
 * @param env - The collaboration-state environment (the subset of process
 * env the identity contract reads).
 * @returns The first non-blank candidate with its source name, or
 * `undefined` when no seed is present — the caller decides how to fail
 * (see {@link missingCollaborationIdentitySeedMessage}).
 */
export function resolveCollaborationSeed(
  env: CollaborationStateEnvironment,
): SeedCandidate | undefined {
  return firstSeed([
    { source: 'PRACTICE_AGENT_SESSION_ID_CLAUDE', value: env.PRACTICE_AGENT_SESSION_ID_CLAUDE },
    { source: 'PRACTICE_AGENT_SESSION_ID_CURSOR', value: env.PRACTICE_AGENT_SESSION_ID_CURSOR },
    { source: 'PRACTICE_AGENT_SESSION_ID_GEMINI', value: env.PRACTICE_AGENT_SESSION_ID_GEMINI },
    { source: 'PRACTICE_AGENT_SESSION_ID_CODEX', value: env.PRACTICE_AGENT_SESSION_ID_CODEX },
    // Cloud-seat ambient platform session id (PDR-027, 2026-08-24 cloud-seat
    // clause): the untagged payload joins registry rows with Claude-Session
    // commit trailers and the owner-visible session URL. EVERY explicit
    // PRACTICE_* seed stays ahead of it — they are the operator's stated
    // contract — while it outranks the harness-native fallbacks below.
    {
      source: 'CLAUDE_CODE_REMOTE_SESSION_ID',
      value: stripSessionIdTagIfPresent(env.CLAUDE_CODE_REMOTE_SESSION_ID),
    },
    { source: 'CODEX_THREAD_ID', value: env.CODEX_THREAD_ID },
    { source: 'conversationId', value: env.conversationId },
    {
      source: 'ANTIGRAVITY_SOURCE_METADATA.conversationId',
      value: antigravitySourceMetadataConversationId(env.ANTIGRAVITY_SOURCE_METADATA),
    },
  ]);
}

/**
 * The fail-fast message for a seat with no resolvable seed: names the seeds
 * an operator can set — the four Practice variables and the harness-native
 * fallbacks — and, where the platform is known, the primary Practice seed
 * for that platform. The cloud seat's ambient `CLAUDE_CODE_REMOTE_SESSION_ID`
 * is supplied by the harness, never set by hand, so the hint does not name
 * it.
 *
 * @param platform - The seat's platform label (e.g. `claude`, `codex`), used
 * only to point at the right variable in the hint.
 */
export function missingCollaborationIdentitySeedMessage(platform: string): string {
  const platformPracticeVar = practiceSessionVarForPlatform(platform);
  const platformHint =
    platformPracticeVar === undefined
      ? ''
      : ` For ${platform}, the primary Practice seed is ${platformPracticeVar}.`;

  return (
    'missing collaboration identity seed; set one of ' +
    'PRACTICE_AGENT_SESSION_ID_CLAUDE, PRACTICE_AGENT_SESSION_ID_CURSOR, ' +
    'PRACTICE_AGENT_SESSION_ID_GEMINI, PRACTICE_AGENT_SESSION_ID_CODEX, ' +
    'CODEX_THREAD_ID, or Antigravity conversationId.' +
    platformHint
  );
}

/**
 * The primary Practice seed variable for a platform label, for the
 * missing-seed hint; `undefined` for a platform the contract does not name.
 */
function practiceSessionVarForPlatform(platform: string): string | undefined {
  switch (platform.toLowerCase()) {
    case 'claude':
      return 'PRACTICE_AGENT_SESSION_ID_CLAUDE';
    case 'cursor':
      return 'PRACTICE_AGENT_SESSION_ID_CURSOR';
    case 'gemini':
    case 'antigravity':
      return 'PRACTICE_AGENT_SESSION_ID_GEMINI or Antigravity conversationId';
    case 'codex':
      return 'PRACTICE_AGENT_SESSION_ID_CODEX or CODEX_THREAD_ID';
    default:
      return undefined;
  }
}

/**
 * Read `conversationId` out of Antigravity's JSON source-metadata variable.
 * Malformed JSON or a missing/blank field resolves to `undefined` — the
 * variable is an optional fallback, never a hard contract.
 */
function antigravitySourceMetadataConversationId(value: string | undefined): string | undefined {
  const trimmed = nonEmptyValue(value);
  if (trimmed === undefined) {
    return undefined;
  }

  try {
    const parsed: unknown = JSON.parse(trimmed);
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'conversationId' in parsed &&
      typeof parsed.conversationId === 'string'
    ) {
      return nonEmptyValue(parsed.conversationId);
    }
  } catch {
    return undefined;
  }

  return undefined;
}

/**
 * The first candidate whose value is non-blank, in the order given — the
 * precedence rule is the order of the list, nothing else.
 */
function firstSeed(
  candidates: readonly {
    readonly source: string;
    readonly value: string | undefined;
  }[],
): SeedCandidate | undefined {
  for (const candidate of candidates) {
    const value = nonEmptyValue(candidate.value);
    if (value !== undefined) {
      return {
        source: candidate.source,
        value,
      };
    }
  }

  return undefined;
}

/**
 * A trimmed, non-empty string or `undefined` — the one reading of "present"
 * every seed and override check in the identity contract shares, so a
 * whitespace-only variable is never mistaken for a value.
 */
export function nonEmptyValue(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
