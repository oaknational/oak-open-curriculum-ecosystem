import { drainRelevantEvents, watchCommsLoop, type WatcherTickStatus } from './comms-use-cases.js';
import { writeWatcherHeartbeat, WATCHER_HEARTBEAT_SCHEMA_VERSION } from './watcher-heartbeat.js';
import { optional, optionalPositiveInteger, required, type Options } from './cli-options.js';
import {
  cliIo,
  type CollaborationStateCliIo,
  type CliRuntime,
  waitForCommsChange,
} from './cli-runtime.js';
import { resolveSelfIdentity } from './cli-self-identity.js';
import { type CollaborationAgentId, type CollaborationStateEnvironment } from './types.js';

const DEFAULT_POLL_MS = 500;
const DEFAULT_HEARTBEAT_INTERVAL_MS = 30000;

/**
 * Watch the comms stream. Emits every non-self event under the current
 * view-token set: broadcast, group, directed, observed, and lifecycle.
 *
 * Liveness surface (FM-2 cure, 2026-05-23): when `--heartbeat-file <path>`
 * is provided, the watcher writes a substrate-typed heartbeat JSON every
 * `--heartbeat-interval-ms` milliseconds (default 30000) with
 * `last_drain_at`, `last_emit_at`, `last_error_at`, `emitted_count`, and the
 * `pid`. Absence of mtime updates beyond 3x the interval is the stale
 * signal external liveness checks should use.
 */
export async function watchComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  const commsDir = required(options, 'comms-dir');
  const seenFile = required(options, 'seen-file');
  const self = resolveSelfIdentity(options, env);
  const pollMs = optionalPositiveInteger(options, 'poll-ms') ?? DEFAULT_POLL_MS;
  const maxEvents = optionalPositiveInteger(options, 'max-events');
  const heartbeatFile = optional(options, 'heartbeat-file');
  const heartbeatIntervalMs =
    optionalPositiveInteger(options, 'heartbeat-interval-ms') ?? DEFAULT_HEARTBEAT_INTERVAL_MS;

  await io.ensureDirectory(commsDir);

  const tick = composeHeartbeatTick({
    heartbeatFile,
    heartbeatIntervalMs,
    self,
    io,
  });

  const output = await watchCommsLoop({
    maxEvents,
    drain: (remainingEvents) => drainComms({ commsDir, seenFile, self, remainingEvents, io }),
    waitForChange: () => waitForCommsChange(runtime, { directory: commsDir, pollMs }),
    emit: async (text) => {
      runtime.stdout?.write(text);
    },
    markSeen: (eventIds) => io.appendSeenMessageIds(seenFile, eventIds),
    tick,
  });

  return runtime.stdout === undefined ? output : '';
}

function composeHeartbeatTick(input: {
  readonly heartbeatFile: string | undefined;
  readonly heartbeatIntervalMs: number;
  readonly self: CollaborationAgentId;
  readonly io: CollaborationStateCliIo;
}): ((status: WatcherTickStatus) => Promise<void>) | undefined {
  const heartbeatFile = input.heartbeatFile;
  if (heartbeatFile === undefined) {
    return undefined;
  }
  const startedAt = new Date().toISOString();
  let lastHeartbeatAtMs = 0;
  return async (status): Promise<void> => {
    const nowMs = Date.now();
    if (nowMs - lastHeartbeatAtMs < input.heartbeatIntervalMs) {
      return;
    }
    lastHeartbeatAtMs = nowMs;
    await writeWatcherHeartbeat({
      io: input.io,
      heartbeatFile,
      heartbeat: {
        schema_version: WATCHER_HEARTBEAT_SCHEMA_VERSION,
        pid: process.pid,
        started_at: startedAt,
        last_drain_at: status.lastDrainAt,
        last_emit_at: status.lastEmitAt,
        last_error_at: status.lastErrorAt,
        emitted_count: status.emittedCount,
        heartbeat_interval_ms: input.heartbeatIntervalMs,
        watcher_identity: input.self,
      },
    });
  };
}

async function drainComms(input: {
  readonly commsDir: string;
  readonly seenFile: string;
  readonly self: CollaborationAgentId;
  readonly remainingEvents?: number;
  readonly io: CollaborationStateCliIo;
}): ReturnType<typeof drainRelevantEvents> {
  const seenIds = await input.io.readSeenIds(input.seenFile);
  const messages = await input.io.readCommsEvents(input.commsDir);
  return drainRelevantEvents({
    messages,
    seenIds,
    self: input.self,
    remainingEvents: input.remainingEvents,
  });
}
