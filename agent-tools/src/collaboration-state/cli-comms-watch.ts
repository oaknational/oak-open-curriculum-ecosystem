import { drainDirectedInbox, drainRelevantEvents, watchDirectedInbox } from './comms-use-cases.js';
import { writeWatcherHeartbeat } from './watcher-heartbeat.js';
import { resolveIdentity } from './cli-identity.js';
import { optional, optionalPositiveInteger, required, type Options } from './cli-options.js';
import {
  cliIo,
  type CollaborationStateCliIo,
  type CliRuntime,
  waitForCommsChange,
} from './cli-runtime.js';
import { type CollaborationAgentId, type CollaborationStateEnvironment } from './types.js';

const DEFAULT_POLL_MS = 500;
const DEFAULT_HEARTBEAT_INTERVAL_MS = 30000;

/**
 * Watch the comms stream. The default all-channels mode emits every non-self
 * event under the current view-token set: broadcast, group, directed,
 * observed, and lifecycle. `--only-directed` deliberately preserves the
 * legacy narrow inbox path for callers that want only directed-to-me events.
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
  const onlyDirected = optional(options, 'only-directed') !== undefined;
  const pollMs = optionalPositiveInteger(options, 'poll-ms') ?? DEFAULT_POLL_MS;
  const maxEvents = optionalPositiveInteger(options, 'max-events');
  const heartbeatFile = optional(options, 'heartbeat-file');
  const heartbeatIntervalMs =
    optionalPositiveInteger(options, 'heartbeat-interval-ms') ?? DEFAULT_HEARTBEAT_INTERVAL_MS;

  await io.ensureDirectory(commsDir);

  const startedAt = new Date().toISOString();
  let lastHeartbeatAtMs = 0;

  const output = await watchDirectedInbox({
    maxEvents,
    drain: (remainingEvents) =>
      drainAccordingToView({
        commsDir,
        seenFile,
        self,
        onlyDirected,
        remainingEvents,
        io,
      }),
    waitForChange: () => waitForCommsChange(runtime, { directory: commsDir, pollMs }),
    emit: async (text) => {
      runtime.stdout?.write(text);
    },
    markSeen: (eventIds) => io.appendSeenMessageIds(seenFile, eventIds),
    tick:
      heartbeatFile === undefined
        ? undefined
        : async (status) => {
            const nowMs = Date.now();
            if (nowMs - lastHeartbeatAtMs < heartbeatIntervalMs) {
              return;
            }
            lastHeartbeatAtMs = nowMs;
            await writeWatcherHeartbeat({
              io,
              heartbeatFile,
              heartbeat: {
                schema_version: '1.0.0',
                pid: process.pid,
                started_at: startedAt,
                last_drain_at: status.lastDrainAt,
                last_emit_at: status.lastEmitAt,
                last_error_at: status.lastErrorAt,
                emitted_count: status.emittedCount,
                heartbeat_interval_ms: heartbeatIntervalMs,
                watcher_identity: self,
              },
            });
          },
  });

  return runtime.stdout === undefined ? output : '';
}

async function drainAccordingToView(input: {
  readonly commsDir: string;
  readonly seenFile: string;
  readonly self: CollaborationAgentId;
  readonly onlyDirected: boolean;
  readonly remainingEvents?: number;
  readonly io: CollaborationStateCliIo;
}): ReturnType<typeof drainRelevantEvents> {
  const seenIds = await input.io.readSeenIds(input.seenFile);
  const messages = await input.io.readCommsEvents(input.commsDir);

  if (input.onlyDirected) {
    return drainDirectedInbox({
      messages,
      seenIds,
      agentName: input.self.agent_name,
      sessionPrefix: input.self.session_id_prefix === '' ? undefined : input.self.session_id_prefix,
      remainingEvents: input.remainingEvents,
    });
  }
  return drainRelevantEvents({
    messages,
    seenIds,
    self: input.self,
    remainingEvents: input.remainingEvents,
  });
}

/**
 * Resolve the watcher's identity tuple. Two routes:
 * - Override (admin/test): when `--agent-name` is provided, the explicit
 *   `--agent-name` + `--session-prefix` + `--platform` + `--model` tuple is
 *   used directly. The wildcard `*` for `--agent-name` is supported in
 *   `--only-directed` mode (matches every recipient) and is rejected in the
 *   default all-channels mode because it has no meaning there.
 * - Derived (canonical agent path): otherwise, identity is derived from the
 *   Practice session-id env vars via `resolveIdentity`, matching the rest
 *   of the comms commands (`send`, `direct`, `reply`).
 */
function resolveSelfIdentity(
  options: Options,
  env: CollaborationStateEnvironment,
): CollaborationAgentId {
  const explicitAgentName = optional(options, 'agent-name');
  if (explicitAgentName !== undefined) {
    return {
      agent_name: explicitAgentName,
      platform: optional(options, 'platform') ?? 'override',
      model: optional(options, 'model') ?? 'override',
      session_id_prefix: optional(options, 'session-prefix') ?? '',
    };
  }
  const identity = resolveIdentity(options, env);
  const overridePrefix = optional(options, 'session-prefix');
  return overridePrefix === undefined
    ? identity.agent_id
    : { ...identity.agent_id, session_id_prefix: overridePrefix };
}
