import { deriveIdentity } from '../core/agent-identity/index.js';

import {
  type CollaborationAgentId,
  type CollaborationStateEnvironment,
  type DerivedCollaborationIdentity,
} from './types.js';

interface SeedCandidate {
  readonly source: string;
  readonly value: string;
}

/**
 * Derive the PDR-027 identity block used by collaboration-state writes.
 */
export function deriveCollaborationIdentity(input: {
  readonly platform: string;
  readonly model: string;
  readonly env: CollaborationStateEnvironment;
}): DerivedCollaborationIdentity {
  const seed = resolveCollaborationSeed(input.env);
  if (seed === undefined) {
    throw new Error(
      'missing collaboration identity seed; set a Practice session id or CODEX_THREAD_ID',
    );
  }

  const identity = deriveIdentity(seed.value, {
    override: nonEmptyValue(input.env.OAK_AGENT_IDENTITY_OVERRIDE),
  });

  return {
    agentId: {
      agent_name: identity.displayName,
      platform: input.platform,
      model: input.model,
      session_id_prefix: seed.value.slice(0, 6),
    },
    seed_source: seed.source,
  };
}

/**
 * Validate that a write identity is not silently falling back to anonymous
 * Codex state while a real Codex thread id is available.
 */
export function validateSharedStateAgentId(input: {
  readonly agentId: CollaborationAgentId;
  readonly env: CollaborationStateEnvironment;
}): { readonly ok: true } | { readonly ok: false; readonly reason: string } {
  if (
    input.agentId.platform === 'codex' &&
    nonEmptyValue(input.env.CODEX_THREAD_ID) !== undefined &&
    (input.agentId.agent_name === 'Codex' || input.agentId.session_id_prefix === 'unknown')
  ) {
    return {
      ok: false,
      reason:
        'codex shared-state writes must use CODEX_THREAD_ID-derived identity when CODEX_THREAD_ID is present',
    };
  }

  return { ok: true };
}

function resolveCollaborationSeed(env: CollaborationStateEnvironment): SeedCandidate | undefined {
  return firstSeed([
    { source: 'PRACTICE_AGENT_SESSION_ID_CLAUDE', value: env.PRACTICE_AGENT_SESSION_ID_CLAUDE },
    { source: 'PRACTICE_AGENT_SESSION_ID_CURSOR', value: env.PRACTICE_AGENT_SESSION_ID_CURSOR },
    { source: 'PRACTICE_AGENT_SESSION_ID_CODEX', value: env.PRACTICE_AGENT_SESSION_ID_CODEX },
    { source: 'CODEX_THREAD_ID', value: env.CODEX_THREAD_ID },
  ]);
}

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

function nonEmptyValue(value: string | undefined): string | undefined {
  if (value === undefined) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}
