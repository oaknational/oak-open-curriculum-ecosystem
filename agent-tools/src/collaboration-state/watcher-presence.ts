/**
 * Pure presence classifier behind the F-95 comms-watcher-presence gate. It maps
 * the five-state `WatcherStalenessResult` to a binary `present | blind` verdict
 * — the question the gate asks is narrower than full staleness classification:
 * "can THIS session see the comms stream right now?".
 *
 * The classifier holds no IO and no clock; it consumes a `WatcherStalenessResult`
 * (which already encapsulates the heartbeat read + mtime aging) so the same
 * verdict logic backs both the `comms assert-watcher-live` subcommand and the
 * `claims open` precondition. Path derivation lives here too so the two surfaces
 * resolve a session's heartbeat path identically.
 */
import { sameAgentRoutingKey } from './active-agent-routing.js';
import { type CollaborationAgentId } from './types.js';
import { HEARTBEAT_FILE_SUFFIX } from './watcher-heartbeat.js';
import { type WatcherStalenessResult } from './watcher-staleness.js';

/**
 * Whether a session has a live comms watcher. `blind` carries a human-readable
 * reason the gate surfaces (with a fix instruction) on stderr.
 */
export type WatcherPresenceVerdict =
  { readonly kind: 'present' } | { readonly kind: 'blind'; readonly reason: string };

/** Canonical location of per-agent comms seen-files (and their heartbeats). */
export const DEFAULT_COMMS_SEEN_DIR = '.agent/state/collaboration/comms-seen';

/**
 * Conventional seen-file path for an agent codename under a comms-seen dir.
 * The codename is interpolated into a path, so reject path separators and
 * parent-traversal (codenames are otherwise unconstrained, and `--agent-name`
 * is caller-supplied) — a `/` or `..` would let the derived heartbeat path
 * escape the comms-seen directory.
 */
export function commsSeenFileForCodename(codename: string, commsSeenDir: string): string {
  if (
    codename.length === 0 ||
    codename.includes('/') ||
    codename.includes('\\') ||
    codename.includes('..')
  ) {
    throw new Error(`agent codename is not a safe path segment: ${JSON.stringify(codename)}`);
  }
  const trimmedDir = commsSeenDir.endsWith('/') ? commsSeenDir.slice(0, -1) : commsSeenDir;
  if (trimmedDir.length === 0) {
    throw new Error(
      `comms-seen dir must be a non-empty path that is not the filesystem root, not ` +
        `${JSON.stringify(commsSeenDir)} (an empty or root dir would derive a root-absolute ` +
        `heartbeat path); absolute paths under a real directory are accepted`,
    );
  }
  return `${trimmedDir}/${codename}.json`;
}

/** Heartbeat path derived from a watcher's seen-file (`<seen-file>.heartbeat.json`). */
export function heartbeatFileForSeen(seenFile: string): string {
  return `${seenFile}${HEARTBEAT_FILE_SUFFIX}`;
}

/**
 * A heartbeat that is otherwise present counts only when its identity matches
 * this session (same routing key); a foreign or copied heartbeat does not.
 */
function presentIfThisSession(
  heartbeatIdentity: CollaborationAgentId,
  expectedIdentity: CollaborationAgentId,
): WatcherPresenceVerdict {
  if (sameAgentRoutingKey(heartbeatIdentity, expectedIdentity)) {
    return { kind: 'present' };
  }
  return {
    kind: 'blind',
    reason:
      `a live comms watcher heartbeat exists, but its identity ` +
      `(${heartbeatIdentity.agent_name} / ${heartbeatIdentity.session_id_prefix}) is not this ` +
      `session's — this session is not running the watcher (a foreign or copied heartbeat does ` +
      `not count)`,
  };
}

/**
 * Map a staleness result to a presence verdict for `expectedIdentity`'s session.
 *
 * - `live` / fresh `stale-no-emit` are present ONLY when the heartbeat's
 *   `watcher_identity` matches this session (same routing key). The heartbeat
 *   path is codename-derived, but codenames can collide across sessions and a
 *   file can be copied, so a live heartbeat with a different identity is NOT
 *   this session's watcher — binding to identity closes that hole in the
 *   load-bearing `claims open` backstop.
 * - `stale-no-emit` with an aged mtime is a started-then-frozen watcher (dead).
 * - `stale-aged`, `absent`, and `malformed` are all blind — the session cannot
 *   confirm it is watching the stream.
 */
export function classifyWatcherPresence(
  result: WatcherStalenessResult,
  expectedIdentity: CollaborationAgentId,
): WatcherPresenceVerdict {
  switch (result.kind) {
    case 'live':
      return presentIfThisSession(result.identity, expectedIdentity);
    case 'stale-no-emit':
      if (result.agedMs > result.thresholdMs) {
        return {
          kind: 'blind',
          reason:
            'comms watcher started but has emitted nothing and its heartbeat is stale — presumed dead',
        };
      }
      return presentIfThisSession(result.identity, expectedIdentity);
    case 'stale-aged':
      return {
        kind: 'blind',
        reason:
          'comms watcher heartbeat aged out (no update within 3x its interval) — presumed dead',
      };
    case 'absent':
      return {
        kind: 'blind',
        reason: `no comms watcher heartbeat at ${result.heartbeatFile} — watcher not running`,
      };
    case 'malformed':
      return {
        kind: 'blind',
        reason: `comms watcher heartbeat unreadable (${result.reason}) — cannot confirm liveness`,
      };
    default: {
      // Exhaustiveness: any new WatcherStalenessResult member fails to compile
      // here regardless of its field shape (stronger than a `.reason` access).
      const exhaustive: never = result;
      throw new Error(`Unhandled WatcherStalenessResult kind: ${JSON.stringify(exhaustive)}`);
    }
  }
}
