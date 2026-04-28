import { deriveCollaborationIdentity } from './identity.js';
import { required, type Options } from './cli-options.js';
import { type CollaborationAgentId, type CollaborationStateEnvironment } from './types.js';

interface ResolvedCliIdentity {
  readonly agent_id: CollaborationAgentId;
  readonly seed_source: string;
}

export function resolveIdentity(
  options: Options,
  env: CollaborationStateEnvironment,
): ResolvedCliIdentity {
  const identity = deriveCollaborationIdentity({
    platform: required(options, 'platform'),
    model: required(options, 'model'),
    env,
  });

  return {
    agent_id: identity.agentId,
    seed_source: identity.seed_source,
  };
}
