import { unwrapOrThrow, type Result } from '@oaknational/result';

import { assertNoLiveIdentityRoutingCollision } from './active-agents.js';
import { required, type Options } from './cli-options.js';
import { commitQueueDirForActivePath, readCommitQueueEntries } from './commit-queue-store.js';
import { readActiveClaimsFile } from './state-io.js';
import {
  type CollaborationAgentId,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
} from './types.js';

interface IdentityWriteGuardInput {
  readonly options: Options;
  readonly agentId: CollaborationAgentId;
  readonly nowIso: string;
  readonly surface: string;
  readonly readActiveClaimsFile?: (
    activePath: string,
  ) => Promise<Result<CollaborationRegistry, Error>>;
  readonly readCommitQueueEntries?: (input: {
    readonly queueDir: string;
    readonly nowIso: string;
  }) => Promise<readonly CollaborationCommitQueueEntry[]>;
}

/**
 * The one guarded snapshot an identity-writing command reads: the claims
 * registry plus the live per-intent queue entries beside it, taken together
 * so the collision guard and any downstream derivation see the same state.
 */
export interface IdentityWriteRegistrySnapshot {
  readonly registry: CollaborationRegistry;
  readonly commitQueue: readonly CollaborationCommitQueueEntry[];
}

/**
 * Read the active-claims registry named by `--active` and enforce P4
 * identity-route uniqueness for shared-state writers, returning the
 * registry so a caller that also needs registry data reads the file exactly
 * once (`comms direct` derives the recipient prefix from this same read —
 * a second read would tear the guard's snapshot from the derivation's).
 */
export async function registryForIdentityWrite(
  input: IdentityWriteGuardInput,
): Promise<IdentityWriteRegistrySnapshot> {
  const readActive = input.readActiveClaimsFile ?? readActiveClaimsFile;
  const readQueue = input.readCommitQueueEntries ?? readCommitQueueEntries;
  const activePath = required(input.options, 'active');
  const registry = unwrapOrThrow(await readActive(activePath));
  const commitQueue = await readQueue({
    queueDir: commitQueueDirForActivePath(activePath),
    nowIso: input.nowIso,
  });

  assertNoLiveIdentityRoutingCollision({
    registry,
    commitQueue,
    nowIso: input.nowIso,
    agentId: input.agentId,
    surface: input.surface,
  });

  return { registry, commitQueue };
}

/**
 * Guard-only view of {@link registryForIdentityWrite} for call sites that
 * need the P4 collision check and nothing else.
 */
export async function assertIdentityCanWrite(input: IdentityWriteGuardInput): Promise<void> {
  await registryForIdentityWrite(input);
}
