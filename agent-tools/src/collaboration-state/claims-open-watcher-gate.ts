/**
 * The load-bearing half of the F-95 gate (Option B): `claims open` refuses to
 * stake a claim into a populated registry while this session is blind to the
 * comms stream — the founding pilot failure (a blind claim opened alongside a
 * simultaneous identical-branch claim).
 *
 * Split into two steps so the populated-vs-solo decision is made under the
 * registry lock and is therefore race-free:
 *
 * - `resolveWatcherVerdict` (async, OUTSIDE the lock) does the filesystem IO
 *   once to classify this session's watcher presence. Watcher staleness is
 *   3x-interval-grained, so reading it just before the lock is not a race.
 * - `assertNotBlindWithOtherAgents` (sync, INSIDE the transactional transform)
 *   evaluates `hasOtherLiveAgents` against the LOCKED registry snapshot and
 *   throws only when another agent is live AND the verdict is blind. Evaluating
 *   the population check inside the lock closes the solo-then-peer TOCTOU: an
 *   agent that read an empty registry but whose peer's claim lands before the
 *   write still sees the peer inside the transform and is refused.
 *
 * Solo-safe by construction: a session with no OTHER live agent in the locked
 * snapshot passes regardless of watcher state (the bootstrap fast-path).
 */
import { sameAgentRoutingKey } from './active-agent-routing.js';
import { liveAgentIdentities } from './active-agents.js';
import { type CollaborationAgentId, type CollaborationRegistry } from './types.js';
import {
  classifyWatcherPresence,
  commsSeenFileForCodename,
  DEFAULT_COMMS_SEEN_DIR,
  heartbeatFileForSeen,
  type WatcherPresenceVerdict,
} from './watcher-presence.js';
import { detectStaleWatcher, type WatcherStalenessIo } from './watcher-staleness.js';
import { productionWatcherStalenessIo } from './watcher-staleness-io.js';

/**
 * Whether any live agent (a fresh claim or an active commit-queue entry) other
 * than `selfAgentId`'s routing key is present. Reuses the one liveness notion
 * (`liveAgentIdentities`) so there is no second freshness definition.
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

/**
 * Classify this session's comms-watcher presence (the IO step, outside the
 * lock). The heartbeat path follows the canonical codename-derived convention
 * (`<comms-seen-dir>/<agent_name>.json.heartbeat.json`); a watcher armed at a
 * non-canonical `--seen-file` is intentionally NOT discovered here — the
 * `claims open` gate must not offer a path override that could weaken the
 * guarantee. `comms assert-watcher-live` carries `--heartbeat-file` for the
 * relocated-watcher case.
 */
export async function resolveWatcherVerdict(input: {
  readonly selfIdentity: CollaborationAgentId;
  readonly commsSeenDir: string;
  readonly nowMs: number;
  readonly io: WatcherStalenessIo;
}): Promise<WatcherPresenceVerdict> {
  const heartbeatFile = heartbeatFileForSeen(
    commsSeenFileForCodename(input.selfIdentity.agent_name, input.commsSeenDir),
  );
  const result = await detectStaleWatcher({ heartbeatFile, nowMs: input.nowMs, io: input.io });
  return classifyWatcherPresence(result, input.selfIdentity);
}

/**
 * Resolve the watcher verdict for a `claims open` with the production policy
 * baked in: the canonical comms-seen dir ONLY (no path override — a planted
 * heartbeat must not satisfy this load-bearing backstop), the real wall clock
 * (`Date.now()`, never the claim's `--now`, which can lag real time and
 * understate the heartbeat's age), and the production filesystem adapter. The
 * thin wrapper keeps `openClaim` free of that wiring and gives the open gate's
 * policy a single home.
 */
export async function resolveOpenClaimWatcherVerdict(
  identity: CollaborationAgentId,
): Promise<WatcherPresenceVerdict> {
  return resolveWatcherVerdict({
    selfIdentity: identity,
    commsSeenDir: DEFAULT_COMMS_SEEN_DIR,
    nowMs: Date.now(),
    io: productionWatcherStalenessIo,
  });
}

/**
 * Throw when the locked registry holds another live agent AND this session's
 * watcher verdict is blind. Pure and synchronous so it runs inside the
 * `updateActiveClaimsFile` transform on the authoritative snapshot.
 */
export function assertNotBlindWithOtherAgents(input: {
  readonly registry: CollaborationRegistry;
  readonly nowIso: string;
  readonly selfIdentity: CollaborationAgentId;
  readonly watcherVerdict: WatcherPresenceVerdict;
}): void {
  if (input.watcherVerdict.kind === 'present') {
    return;
  }
  if (!hasOtherLiveAgents(input.registry, input.nowIso, input.selfIdentity)) {
    return;
  }
  throw new Error(
    `refusing to open a claim while blind to comms: ${input.watcherVerdict.reason}. Other agents ` +
      `are live in the registry; arm the all-channels comms watcher as start-right-team move 1 ` +
      `first (see .agent/rules/comms-all-channels-watcher.md).`,
  );
}
