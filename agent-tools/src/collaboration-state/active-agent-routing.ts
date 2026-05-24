import { type CollaborationAgentId } from './types.js';

export interface AgentRoutingKey {
  readonly agent_name: string;
  readonly platform: string;
  readonly session_id_prefix: string;
}

export function routingKeyFor(agentId: CollaborationAgentId): AgentRoutingKey {
  return {
    agent_name: agentId.agent_name,
    platform: agentId.platform,
    session_id_prefix: agentId.session_id_prefix,
  };
}

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
  return `${key.agent_name} / ${key.platform} / ${key.session_id_prefix}`;
}

export function formatAgent(agentId: CollaborationAgentId): string {
  return `${agentId.agent_name} / ${agentId.platform} / ${agentId.model} / ${agentId.session_id_prefix}`;
}

function sameRoutingKey(left: AgentRoutingKey, right: AgentRoutingKey): boolean {
  return (
    left.agent_name === right.agent_name &&
    left.platform === right.platform &&
    left.session_id_prefix === right.session_id_prefix
  );
}
