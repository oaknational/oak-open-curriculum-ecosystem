import { type CollaborationAgentId, type UuidV5 } from './types.js';

/**
 * Routing key used to compare identities for self-exclusion, directed
 * delivery, narrative addressing, claim ownership, and reply authorisation.
 *
 * PDR-076a §Decision item 2: the routing weight is `(agent_name, id)`.
 * `platform`, `model`, and `session_id_prefix` are NOT routing weights.
 *
 * The PDR-076a Phase 3 sunset (2026-05-29) removed the legacy
 * `(agent_name, session_id_prefix)` fallback: routing is now strict and
 * single-path. An identity without an `id` is not a valid routing target — it
 * fails fast at {@link routingKeyFor} and is treated as "not the same agent" by
 * {@link sameAgentRoutingKey}, never lifted into a legacy key. Historical
 * pre-PDR-076a comms rows (id-less) therefore never reach routing-key
 * construction; the deleted legacy arm used to emit a per-identity stderr
 * diagnostic for each, which is what flooded the all-channels watcher on
 * 2026-05-28.
 */
export interface AgentRoutingKey {
  readonly agent_name: string;
  readonly id: UuidV5;
}

/**
 * Lift a CollaborationAgentId into its routing key. Total over id-bearing
 * identities; fails fast on an id-less identity (no legacy fallback). A caller
 * that may hold a historical id-less identity — e.g. comparing against the
 * immutable comms backlog — MUST gate on `id` presence first; {@link
 * sameAgentRoutingKey} does exactly that.
 */
export function routingKeyFor(agentId: CollaborationAgentId): AgentRoutingKey {
  if (agentId.id === undefined) {
    throw new Error(
      `routingKeyFor requires an id-bearing identity; got id-less ${formatAgent(agentId)}`,
    );
  }
  return {
    agent_name: agentId.agent_name,
    id: agentId.id,
  };
}

/**
 * Same-routing-key check: do two identities address the same agent? Compares by
 * `id` — the only PDR-076a routing signal. An id-less identity (a historical
 * pre-sunset row) is never the same live agent as any other identity, so the
 * comparison short-circuits to `false` without constructing a routing key. This
 * is the strict replacement for the deleted `(name, prefix)` legacy fallback and
 * the structural cure for the comms-watcher runaway over the id-less backlog.
 */
export function sameAgentRoutingKey(
  left: CollaborationAgentId,
  right: CollaborationAgentId,
): boolean {
  if (left.id === undefined || right.id === undefined) {
    return false;
  }
  return left.id === right.id;
}

export function sameIdentity(left: CollaborationAgentId, right: CollaborationAgentId): boolean {
  return sameAgentRoutingKey(left, right) && left.model === right.model;
}

export function formatRoutingKey(key: AgentRoutingKey): string {
  return `${key.agent_name} / id:${key.id}`;
}

export function formatAgent(agentId: CollaborationAgentId): string {
  const idSuffix = agentId.id === undefined ? '' : ` / id:${agentId.id}`;
  return `${agentId.agent_name} / ${agentId.platform} / ${agentId.model} / ${agentId.session_id_prefix}${idSuffix}`;
}
