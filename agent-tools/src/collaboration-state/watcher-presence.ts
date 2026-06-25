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
import { HEARTBEAT_FILE_SUFFIX } from './watcher-heartbeat.js';
import { type WatcherStalenessResult } from './watcher-staleness.js';

/**
 * Whether a session has a live comms watcher. `blind` carries a human-readable
 * reason the gate surfaces (with a fix instruction) on stderr.
 */
export type WatcherPresenceVerdict =
  | { readonly kind: 'present' }
  | { readonly kind: 'blind'; readonly reason: string };

/** Canonical location of per-agent comms seen-files (and their heartbeats). */
export const DEFAULT_COMMS_SEEN_DIR = '.agent/state/collaboration/comms-seen';

/** Conventional seen-file path for an agent codename under a comms-seen dir. */
export function commsSeenFileForCodename(codename: string, commsSeenDir: string): string {
  const trimmedDir = commsSeenDir.endsWith('/') ? commsSeenDir.slice(0, -1) : commsSeenDir;
  return `${trimmedDir}/${codename}.json`;
}

/** Heartbeat path derived from a watcher's seen-file (`<seen-file>.heartbeat.json`). */
export function heartbeatFileForSeen(seenFile: string): string {
  return `${seenFile}${HEARTBEAT_FILE_SUFFIX}`;
}

/**
 * Map a staleness result to a presence verdict.
 *
 * - `live` is present.
 * - `stale-no-emit` is present ONLY while its heartbeat mtime is fresh: a watcher
 *   armed seconds ago (e.g. at start-right-team move 1) has emitted nothing yet
 *   and must not be falsely blocked, whereas a started-then-frozen watcher whose
 *   mtime has aged out is dead and blinds the session.
 * - `stale-aged`, `absent`, and `malformed` are all blind — the session cannot
 *   confirm it is watching the stream.
 */
export function classifyWatcherPresence(result: WatcherStalenessResult): WatcherPresenceVerdict {
  if (result.kind === 'live') {
    return { kind: 'present' };
  }
  if (result.kind === 'stale-no-emit') {
    return result.agedMs <= result.thresholdMs
      ? { kind: 'present' }
      : {
          kind: 'blind',
          reason:
            'comms watcher started but has emitted nothing and its heartbeat is stale — presumed dead',
        };
  }
  if (result.kind === 'stale-aged') {
    return {
      kind: 'blind',
      reason: 'comms watcher heartbeat aged out (no update within 3x its interval) — presumed dead',
    };
  }
  if (result.kind === 'absent') {
    return {
      kind: 'blind',
      reason: `no comms watcher heartbeat at ${result.heartbeatFile} — watcher not running`,
    };
  }
  // The only remaining variant is `malformed`; accessing `result.reason` keeps
  // this exhaustive — a new union member would fail to type-check here.
  return {
    kind: 'blind',
    reason: `comms watcher heartbeat unreadable (${result.reason}) — cannot confirm liveness`,
  };
}
