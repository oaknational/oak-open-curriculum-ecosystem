import { type CollaborationAgentId, type UuidV5 } from './types.js';

/**
 * Routing key used to compare identities for self-exclusion, directed
 * delivery, narrative addressing, claim ownership, and reply
 * authorisation.
 *
 * PDR-076a §Decision item 2: the routing weight is `(agent_name, id)` when
 * `id` is present; `session_id_prefix` remains as a readable fallback for
 * legacy rows. `platform` and `model` are NOT routing weights.
 *
 * Discriminated union (not optional `id?`): the cross-kind comparison
 * (id-keyed vs legacy) is made statically distinguishable so the
 * legacy-fallback path cannot silently compile clean if a comparator
 * forgets it. Exhaustive `switch` on `kind` in `sameAgentRoutingKey`
 * enforces all four combinations at the type level.
 */
export type AgentRoutingKey =
  | {
      readonly kind: 'id-keyed';
      readonly agent_name: string;
      readonly id: UuidV5;
    }
  | {
      readonly kind: 'legacy';
      readonly agent_name: string;
      readonly session_id_prefix: string;
    };

/**
 * Lift a CollaborationAgentId into its routing key. Single construction
 * site that two-phase narrows on `id` presence: id-keyed when the
 * identity carries the PDR-076a UUID, legacy when it doesn't (historical
 * rows pre-amendment, or rows written by external tools that have not
 * yet migrated).
 */
export function routingKeyFor(agentId: CollaborationAgentId): AgentRoutingKey {
  if (agentId.id !== undefined) {
    return {
      kind: 'id-keyed',
      agent_name: agentId.agent_name,
      id: agentId.id,
    };
  }
  return {
    kind: 'legacy',
    agent_name: agentId.agent_name,
    session_id_prefix: agentId.session_id_prefix,
  };
}

/**
 * Same-routing-key check: do two identities address the same agent?
 * Compares by `id` when both sides carry one (PDR-076a primary signal);
 * falls back to `(name, prefix)` when both sides are legacy. Cross-kind
 * pairs (id-keyed vs legacy) return false — they are not the same agent
 * until the legacy side carries an id, per PDR-076a §Acceptance
 * collision-case (c).
 */
export function sameAgentRoutingKey(
  left: CollaborationAgentId,
  right: CollaborationAgentId,
): boolean {
  return sameRoutingKey(routingKeyFor(left), routingKeyFor(right));
}

export function sameIdentity(left: CollaborationAgentId, right: CollaborationAgentId): boolean {
  return sameAgentRoutingKey(left, right) && left.model === right.model;
}

export function formatRoutingKey(key: AgentRoutingKey): string {
  // Human-readable; the legacy-fallback diagnostic surface (PDR-076a Cycle 10)
  // logs structured JSON to stderr for audit, so the display string stays
  // uncluttered.
  if (key.kind === 'id-keyed') {
    return `${key.agent_name} / id:${key.id}`;
  }
  return `${key.agent_name} / ${key.session_id_prefix}`;
}

export function formatAgent(agentId: CollaborationAgentId): string {
  const idSuffix = agentId.id === undefined ? '' : ` / id:${agentId.id}`;
  return `${agentId.agent_name} / ${agentId.platform} / ${agentId.model} / ${agentId.session_id_prefix}${idSuffix}`;
}

function sameRoutingKey(left: AgentRoutingKey, right: AgentRoutingKey): boolean {
  // TypeScript narrows by `kind`; cross-kind pairs (id-keyed vs legacy)
  // fall through to false — they are not the same agent until the legacy
  // side carries an id (PDR-076a §Acceptance collision-case (c)).
  if (left.kind === 'id-keyed') {
    return right.kind === 'id-keyed' && left.id === right.id;
  }
  return (
    right.kind === 'legacy' &&
    left.agent_name === right.agent_name &&
    left.session_id_prefix === right.session_id_prefix
  );
}
