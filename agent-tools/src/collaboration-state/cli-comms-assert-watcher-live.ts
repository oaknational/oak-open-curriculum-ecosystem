/**
 * `comms assert-watcher-live` (F-95, Option A) — the mechanical move-1 check
 * that backs the prose "arm the all-channels comms watcher" rule. It resolves
 * THIS session's heartbeat path (from the session codename, or an explicit
 * `--heartbeat-file`), classifies presence over the shared staleness detector,
 * and fails loud (non-zero exit + a fix instruction) when the session has no
 * live watcher — so a session cannot proceed blind to the comms stream by
 * merely forgetting to run the watcher.
 *
 * Solo/n=1 sessions are unaffected: this check is invoked by `start-right-team`,
 * and the unskippable backstop is the `claims open` precondition (Option B),
 * which exempts the bootstrap fast-path.
 */
import { optional, type Options } from './cli-options.js';
import { resolveSelfIdentity } from './cli-self-identity.js';
import { type CollaborationStateEnvironment } from './types.js';
import {
  classifyWatcherPresence,
  commsSeenFileForCodename,
  heartbeatFileForSeen,
} from './watcher-presence.js';
import { detectStaleWatcher } from './watcher-staleness.js';
import { productionWatcherStalenessIo } from './watcher-staleness-io.js';

/** Canonical location of per-agent comms seen-files (and their heartbeats). */
const DEFAULT_COMMS_SEEN_DIR = '.agent/state/collaboration/comms-seen';

export async function assertWatcherLive(
  options: Options,
  env: CollaborationStateEnvironment,
): Promise<string> {
  const codename = resolveSelfIdentity(options, env).agent_name;
  const explicitHeartbeat = optional(options, 'heartbeat-file');
  const commsSeenDir = optional(options, 'comms-seen-dir') ?? DEFAULT_COMMS_SEEN_DIR;
  const heartbeatFile =
    explicitHeartbeat ?? heartbeatFileForSeen(commsSeenFileForCodename(codename, commsSeenDir));

  const nowOpt = optional(options, 'now');
  const nowMs = nowOpt === undefined ? Date.now() : Date.parse(nowOpt);

  const result = await detectStaleWatcher({
    heartbeatFile,
    nowMs,
    io: productionWatcherStalenessIo,
  });
  const verdict = classifyWatcherPresence(result);

  if (verdict.kind === 'blind') {
    throw new Error(
      `${verdict.reason}. Arm the all-channels comms watcher as start-right-team move 1, before ` +
        `coordinating or opening a claim (see .agent/rules/comms-all-channels-watcher.md). ` +
        `Heartbeat expected at ${heartbeatFile}.`,
    );
  }

  return `comms watcher live for ${codename} (heartbeat ${heartbeatFile})\n`;
}
