/**
 * `claims open` gate composition (F-95). The watcher verdict resolves
 * OUTSIDE the registry lock: watcher staleness is 3x-interval-grained, so
 * a just-before-the-lock classification is not a race, and resolving it
 * early keeps the lock window short. The QUEUE is read INSIDE the locked
 * operation alongside the claims snapshot: a queue-only peer's entry
 * appearing before the claim write must be visible to both gates, and
 * every queue writer contends on the claims file's own transaction lock,
 * so the locked read sees a serialised composite state.
 */
import { readFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { unwrapOrThrow } from '@oaknational/result';

import { assertNoLiveIdentityRoutingCollision } from './active-agents.js';
import {
  assertNotBlindWithOtherAgents,
  resolveOpenClaimWatcherVerdict,
} from './claims-open-watcher-gate.js';
import { commitQueueDirForActivePath, readCommitQueueEntries } from './commit-queue-store.js';
import { type Options } from './cli-options.js';
import { type CliRuntime } from './cli-runtime.js';
import { resolveCanonicalCommsWatchPaths } from './comms-watch-paths.js';
import { activeClaimsWriteValidator } from './state-io-write-validators.js';
import { parseCollaborationRegistry } from './state-parsers.js';
import { runJsonStateTransaction, writeJsonFileWithinTransaction } from './transaction.js';
import { type WatcherPresenceVerdict } from './watcher-presence.js';
import {
  type CollaborationAgentId,
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CollaborationRegistry,
} from './types.js';

/** Resolve the pre-lock watcher verdict for `claims open`. */
export async function resolveOpenClaimWatcherGate(input: {
  readonly options: Options;
  readonly identity: CollaborationAgentId;
  readonly runtime: CliRuntime;
}): Promise<WatcherPresenceVerdict> {
  const watcherPaths = resolveCanonicalCommsWatchPaths(
    input.options,
    input.identity.agent_name,
    input.runtime,
  );
  return resolveOpenClaimWatcherVerdict(
    input.identity,
    dirname(watcherPaths.seenFile),
    watcherPaths.commsDir,
  );
}

/**
 * The locked half of `claims open`: claims AND queue read inside one
 * `activePath` transaction, both gates evaluated on that composite, and
 * the claim row appended and written back before the lock releases. The
 * caller's pre-transaction `readActiveClaimsFile` surfaces fresh-checkout
 * seeding errors and runs the one-time legacy migration, so the in-lock
 * read is a plain read of the new-shape file.
 */
export async function runLockedClaimOpen(input: {
  readonly activePath: string;
  readonly openedClaim: CollaborationClaim;
  readonly nowIso: string;
  readonly identity: CollaborationAgentId;
  readonly watcherVerdict: WatcherPresenceVerdict;
  /** Injectable store-read seam (ADR-078); defaults to the live store. */
  readonly readQueueEntries?: typeof readCommitQueueEntries;
}): Promise<void> {
  const readEntries = input.readQueueEntries ?? readCommitQueueEntries;
  await runJsonStateTransaction({
    filePaths: [input.activePath],
    operation: async () => {
      const registry = unwrapOrThrow(
        parseCollaborationRegistry(await readFile(input.activePath, 'utf8')),
      );
      const commitQueue = await readEntries({
        queueDir: commitQueueDirForActivePath(input.activePath),
        nowIso: input.nowIso,
      });
      const next = openClaimTransform({
        openedClaim: input.openedClaim,
        commitQueue,
        nowIso: input.nowIso,
        identity: input.identity,
        watcherVerdict: input.watcherVerdict,
      })(registry);
      await writeJsonFileWithinTransaction({
        filePath: input.activePath,
        value: next,
        // Mirror updateJsonStateWithRetry's write-back contract check: the
        // Ajv validator alone cannot see the PARSER contract (exact-version
        // pin, field shapes) on serialised output.
        validateText: async (text) => {
          unwrapOrThrow(parseCollaborationRegistry(text));
          return activeClaimsWriteValidator(input.activePath)(text);
        },
      });
    },
  });
}

/**
 * The pure gate-and-append transform of `claims open`: both gates evaluate
 * against the composite state the locked operation read, then the claim
 * row appends.
 */
function openClaimTransform(input: {
  readonly openedClaim: CollaborationClaim;
  readonly commitQueue: readonly CollaborationCommitQueueEntry[];
  readonly nowIso: string;
  readonly identity: CollaborationAgentId;
  readonly watcherVerdict: WatcherPresenceVerdict;
}): (registry: CollaborationRegistry) => CollaborationRegistry {
  return (registry) => {
    assertNoLiveIdentityRoutingCollision({
      registry,
      commitQueue: input.commitQueue,
      nowIso: input.nowIso,
      agentId: input.identity,
      surface: 'claims open',
    });
    assertNotBlindWithOtherAgents({
      registry,
      commitQueue: input.commitQueue,
      nowIso: input.nowIso,
      selfIdentity: input.identity,
      watcherVerdict: input.watcherVerdict,
    });

    return {
      ...registry,
      claims: [...registry.claims, input.openedClaim],
    };
  };
}
