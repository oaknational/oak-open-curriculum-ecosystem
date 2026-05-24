import { resolveIdentity } from './cli-identity.js';
import { optional, type Options } from './cli-options.js';
import { type CollaborationAgentId, type CollaborationStateEnvironment } from './types.js';

/**
 * Resolve the current comms CLI identity tuple.
 *
 * Explicit `--agent-name` selects override mode for admin/test usage.
 * Otherwise, identity is derived from the Practice session-id environment.
 */
export function resolveSelfIdentity(
  options: Options,
  env: CollaborationStateEnvironment,
): CollaborationAgentId {
  const explicitAgentName = optional(options, 'agent-name');
  if (explicitAgentName !== undefined) {
    return {
      agent_name: explicitAgentName,
      platform: optional(options, 'platform') ?? 'override',
      model: optional(options, 'model') ?? 'override',
      session_id_prefix: optional(options, 'session-prefix') ?? '',
    };
  }
  const identity = resolveIdentity(options, env);
  const overridePrefix = optional(options, 'session-prefix');
  return overridePrefix === undefined
    ? identity.agent_id
    : { ...identity.agent_id, session_id_prefix: overridePrefix };
}
