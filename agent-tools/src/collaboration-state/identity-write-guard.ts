import { assertNoLiveIdentityRoutingCollision } from './active-agents.js';
import { required, type Options } from './cli-options.js';
import { readActiveClaimsFile } from './state-io.js';
import { type CollaborationAgentId } from './types.js';

/**
 * Enforce P4 identity-route uniqueness for shared-state writers.
 */
export async function assertIdentityCanWrite(input: {
  readonly options: Options;
  readonly agentId: CollaborationAgentId;
  readonly nowIso: string;
  readonly surface: string;
}): Promise<void> {
  assertNoLiveIdentityRoutingCollision({
    registry: await readActiveClaimsFile(required(input.options, 'active')),
    nowIso: input.nowIso,
    agentId: input.agentId,
    surface: input.surface,
  });
}
