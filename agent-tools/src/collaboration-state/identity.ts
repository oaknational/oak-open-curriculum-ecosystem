/**
 * Derivation of a collaboration identity from its PDR-027 seed.
 *
 * @remarks
 * The seed → identity half of the identity seam: UUID v5 derivation at the
 * single sanctioned site, the `session_id_prefix` slice, the write-identity
 * shapes, and the Codex anonymous-write guard. Which environment value IS
 * the seed, and in what precedence, is the other half — the sibling module
 * `collaboration-seed.ts` — which this module consumes.
 *
 * @packageDocumentation
 */

import { v5 as uuidv5 } from 'uuid';

import { deriveIdentity } from '../core/agent-identity/index.js';

import {
  missingCollaborationIdentitySeedMessage,
  nonEmptyValue,
  resolveCollaborationSeed,
} from './collaboration-seed.js';
import {
  type CollaborationAgentId,
  type CollaborationAgentIdWrite,
  type CollaborationStateEnvironment,
  type DerivedCollaborationIdentity,
  type UuidV5,
  uuidV5Schema,
} from './types.js';

/**
 * PDR-076a §Cascade item 3 host-local namespace for collaboration-identity
 * UUID v5 derivation. The namespace is a fixed UUID v4 generated once on
 * 2026-05-26 (no special properties — a stable salt that distinguishes
 * collaboration-identity v5s from any future v5s deriving from the same
 * seed for unrelated purposes). The "same seed → stable id" invariant
 * follows by construction of uuid.v5(name, namespace).
 *
 * Per PDR-076a §Cascade item 3 the namespace value is host-local; the
 * Practice-wide invariant is the stable-derivation property, not the
 * specific namespace.
 */
const COLLABORATION_IDENTITY_NAMESPACE = '6b9a4e2c-3f1d-4d8a-9c0e-1b5f7a8c9d2e';

/**
 * Single internal v5-derivation site for collaboration-identity ids. Both
 * `deriveCollaborationIdentity` (env-seeded path) and
 * `deriveOverrideCollaborationIdentity` (admin/test override path) compose
 * over this helper; no other module in the workspace calls `uuid.v5`
 * directly for collaboration-identity purposes. See PDR-076a §Cascade
 * item 3 (single derivation site invariant).
 */
function deriveIdFromSeed(seed: string): UuidV5 {
  return uuidV5Schema.parse(uuidv5(seed, COLLABORATION_IDENTITY_NAMESPACE));
}

/**
 * The PDR-027 `session_id_prefix`: the first 6 characters of the PDR-027 seed
 * (the untagged platform session id on cloud seats; the harness session id
 * otherwise — PDR-027, 2026-08-24 amendment).
 * The one canonical derivation — the prefix is the cross-repo join key
 * (per-estate name derivations diverge; the prefix does not), so every
 * display and write site must slice identically or the join silently breaks.
 */
export function sessionIdPrefix(sessionId: string): string {
  return sessionId.slice(0, 6);
}

/**
 * Derive the PDR-027 identity block used by collaboration-state writes from
 * the Practice session-id environment seed. Returns a
 * `CollaborationAgentIdWrite` (id required) so missing-id is caught at
 * compile time at every consumer write site.
 */
export function deriveCollaborationIdentity(input: {
  readonly platform: string;
  readonly model: string;
  readonly env: CollaborationStateEnvironment;
}): DerivedCollaborationIdentity {
  const seed = resolveCollaborationSeed(input.env);
  if (seed === undefined) {
    throw new Error(missingCollaborationIdentitySeedMessage(input.platform));
  }

  const identity = deriveIdentity(seed.value, {
    override: nonEmptyValue(input.env.OAK_AGENT_IDENTITY_OVERRIDE),
  });

  const agentId: CollaborationAgentIdWrite = {
    agent_name: identity.displayName,
    platform: input.platform,
    model: input.model,
    session_id_prefix: sessionIdPrefix(seed.value),
    id: deriveIdFromSeed(seed.value),
    naming_schema_version: identity.namingSchemaVersion,
  };

  return {
    agentId,
    seed_source: seed.source,
  };
}

/**
 * Override-mode identity derivation for admin/test CLI usage. Derives a
 * deterministic id from the supplied override fields, treating
 * `<agent_name>|<session_id_prefix>` as the host-local seed. Used by the
 * `--agent-name` CLI override path when no env-resolved Practice session
 * seed is available (or when the operator explicitly bypasses it).
 *
 * Preserves the "single derivation site" invariant: this function and
 * `deriveCollaborationIdentity` share `deriveIdFromSeed` as the only v5
 * call site in the workspace.
 */
export function deriveOverrideCollaborationIdentity(input: {
  readonly agent_name: string;
  readonly platform: string;
  readonly model: string;
  readonly session_id_prefix: string;
}): CollaborationAgentIdWrite {
  return {
    agent_name: input.agent_name,
    platform: input.platform,
    model: input.model,
    session_id_prefix: input.session_id_prefix,
    id: deriveIdFromSeed(`${input.agent_name}|${input.session_id_prefix}`),
    naming_schema_version: 'override',
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
  // Primary discriminator is session_id_prefix (the unique tuple field per
  // WS1 / PDR-027); agent_name remains a secondary fallback because legacy
  // anonymous Codex writes can carry `Codex` as the display name with no
  // prefix yet derived. See ADR-186 + memory feedback_identity_routing_uses_name_and_prefix_pair.
  if (
    input.agentId.platform === 'codex' &&
    nonEmptyValue(input.env.CODEX_THREAD_ID) !== undefined &&
    (input.agentId.session_id_prefix === 'unknown' || input.agentId.agent_name === 'Codex')
  ) {
    return {
      ok: false,
      reason:
        'codex shared-state writes must use CODEX_THREAD_ID-derived identity when CODEX_THREAD_ID is present',
    };
  }

  return { ok: true };
}
