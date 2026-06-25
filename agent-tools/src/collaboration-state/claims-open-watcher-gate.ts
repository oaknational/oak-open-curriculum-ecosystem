/**
 * The load-bearing half of the F-95 gate (Option B): a `claims open`
 * precondition that refuses to stake a claim into a populated registry while
 * this session is blind to the comms stream — the exact founding failure of
 * the worktree pilot (a blind claim opened alongside a simultaneous
 * identical-branch claim).
 *
 * It is solo-safe by construction: if no OTHER live agent is present, the
 * bootstrap fast-path applies and no watcher is required. Only when other
 * agents are live does the session's watcher presence become mandatory. The
 * check is a read-only precondition run BEFORE the transactional claim write
 * (never inside the locked retry transform), so it performs no IO under the
 * registry lock.
 */
import { liveAgentIdentities } from './active-agents.js';
import { sameAgentRoutingKey } from './active-agent-routing.js';
import { type CollaborationAgentId, type CollaborationRegistry } from './types.js';
import {
  classifyWatcherPresence,
  commsSeenFileForCodename,
  heartbeatFileForSeen,
} from './watcher-presence.js';
import { detectStaleWatcher, type WatcherStalenessIo } from './watcher-staleness.js';

/**
 * Whether any live agent (a fresh claim or an active commit-queue entry) other
 * than `selfAgentId`'s routing key is present. Reuses the one liveness notion
 * (`liveAgentIdentities`) so there is no second freshness definition. A solo
 * session (no OTHER live agent) is the bootstrap fast-path and needs no watcher.
 */
function hasOtherLiveAgents(
  registry: CollaborationRegistry,
  nowIso: string,
  selfAgentId: CollaborationAgentId,
): boolean {
  return liveAgentIdentities(registry, nowIso).some(
    (identity) => !sameAgentRoutingKey(identity, selfAgentId),
  );
}

export async function assertWatcherPresentForClaimOpen(input: {
  readonly registry: CollaborationRegistry;
  readonly nowIso: string;
  readonly nowMs: number;
  readonly selfIdentity: CollaborationAgentId;
  readonly commsSeenDir: string;
  readonly io: WatcherStalenessIo;
}): Promise<void> {
  if (!hasOtherLiveAgents(input.registry, input.nowIso, input.selfIdentity)) {
    return;
  }

  const heartbeatFile = heartbeatFileForSeen(
    commsSeenFileForCodename(input.selfIdentity.agent_name, input.commsSeenDir),
  );
  const result = await detectStaleWatcher({ heartbeatFile, nowMs: input.nowMs, io: input.io });
  const verdict = classifyWatcherPresence(result);

  if (verdict.kind === 'blind') {
    throw new Error(
      `refusing to open a claim while blind to comms: ${verdict.reason}. Other agents are live ` +
        `in the registry; arm the all-channels comms watcher as start-right-team move 1 first ` +
        `(see .agent/rules/comms-all-channels-watcher.md). Heartbeat expected at ${heartbeatFile}.`,
    );
  }
}
