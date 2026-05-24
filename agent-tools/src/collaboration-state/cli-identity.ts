import { deriveCollaborationIdentity } from './identity.js';
import { assertIdentityCanWrite } from './identity-write-guard.js';
import { optional, required, type Options } from './cli-options.js';
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

export async function preflightIdentity(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const identity = resolveIdentity(options, env);
  const nowIso = optional(options, 'now') ?? new Date().toISOString();

  if (optional(options, 'active') !== undefined) {
    await assertIdentityCanWrite({
      options,
      agentId: identity.agent_id,
      nowIso,
      surface: 'identity preflight',
    });
  }

  return `${JSON.stringify(identity, null, 2)}\n`;
}
