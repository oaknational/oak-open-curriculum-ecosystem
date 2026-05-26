import { resolveIdentity } from './cli-identity.js';
import { optional, type Options } from './cli-options.js';
import { deriveOverrideCollaborationIdentity } from './identity.js';
import { type CollaborationAgentIdWrite, type CollaborationStateEnvironment } from './types.js';

/**
 * Resolve the current comms CLI identity tuple as a write-side identity
 * (PDR-076a §Cascade item 1 — `id` is required on every collaboration-state
 * write).
 *
 * Explicit `--agent-name` selects override mode for admin/test usage. The
 * override path derives a deterministic UUID v5 from
 * `<agent_name>|<session_id_prefix>` (see
 * `deriveOverrideCollaborationIdentity`), preserving the single
 * v5-derivation site invariant.
 *
 * Otherwise, identity is derived from the Practice session-id environment
 * via `resolveIdentity` (which composes over `deriveCollaborationIdentity`),
 * and any `--session-prefix` override replaces only the readable prefix
 * field — the `id` stays bound to the env-derived seed.
 */
export function resolveSelfIdentity(
  options: Options,
  env: CollaborationStateEnvironment,
): CollaborationAgentIdWrite {
  const explicitAgentName = optional(options, 'agent-name');
  if (explicitAgentName !== undefined) {
    return deriveOverrideCollaborationIdentity({
      agent_name: explicitAgentName,
      platform: optional(options, 'platform') ?? 'override',
      model: optional(options, 'model') ?? 'override',
      session_id_prefix: optional(options, 'session-prefix') ?? '',
    });
  }
  const identity = resolveIdentity(options, env);
  const overridePrefix = optional(options, 'session-prefix');
  return overridePrefix === undefined
    ? identity.agent_id
    : { ...identity.agent_id, session_id_prefix: overridePrefix };
}
