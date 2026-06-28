import { seedSeenStateIfNeeded } from './comms-watch-auto-seed.js';
import { drainRelevantEvents, watchCommsLoop, type WatcherTickStatus } from './comms-use-cases.js';
import {
  HEARTBEAT_FILE_SUFFIX,
  writeWatcherHeartbeat,
  WATCHER_HEARTBEAT_SCHEMA_VERSION,
} from './watcher-heartbeat.js';
import { optional, optionalPositiveInteger, required, type Options } from './cli-options.js';
import {
  cliIo,
  type CollaborationStateCliIo,
  type CliRuntime,
  waitForCommsChange,
} from './cli-runtime.js';
import { resolveSupervisorAlive, supervisorIsGone } from './watcher-supervisor.js';
import { resolveSelfIdentity } from './cli-self-identity.js';
import { type CollaborationAgentId, type CollaborationStateEnvironment } from './types.js';

const DEFAULT_POLL_MS = 500;
const DEFAULT_HEARTBEAT_INTERVAL_MS = 30000;
/**
 * Generous per-step deadline (drain/emit/markSeen). 120x the default poll
 * interval — wide enough that a slow filesystem never false-positives, tight
 * enough that a genuinely hung step dies loud rather than muting the watcher
 * silently for minutes (the 2026-06-10 hang-but-run incident).
 */
const DEFAULT_STEP_TIMEOUT_MS = 60000;

/**
 * Resolve the watcher heartbeat path. Liveness is ON BY DEFAULT: with no
 * `--heartbeat-file`, the path is derived from the seen-file
 * (`<seen-file>.heartbeat.json`) so the always-armed surface is consumable by
 * a staleness check; an explicit `--heartbeat-file` overrides the derived
 * default (but NOT `--no-heartbeat`, which opts out entirely and takes
 * precedence over both).
 */
function resolveHeartbeatFile(input: {
  readonly explicit: string | undefined;
  readonly seenFile: string;
  readonly noHeartbeat: boolean;
}): string | undefined {
  if (input.noHeartbeat) {
    return undefined;
  }
  return input.explicit ?? `${input.seenFile}${HEARTBEAT_FILE_SUFFIX}`;
}

/**
 * Watch the comms stream. Emits every non-self event under the current
 * view-token set: broadcast, group, directed, observed, and lifecycle.
 *
 * Liveness surface (FM-2 cure, 2026-05-23; default-on 2026-06-10): the watcher
 * writes a substrate-typed heartbeat JSON every `--heartbeat-interval-ms`
 * milliseconds (default 30000) with `last_drain_at`, `last_emit_at`,
 * `last_error_at`, `emitted_count`, and the `pid`. The path is the seen-file's
 * derived default (`<seen-file>.heartbeat.json`) unless `--heartbeat-file`
 * overrides it; `--no-heartbeat` disables the surface. Absence of mtime
 * updates beyond 3x the interval is the stale signal external liveness checks
 * (e.g. `detectStaleWatcher`) should use — a hung process cannot self-report,
 * so this consumer check is the detection path c1's loud death cannot cover.
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
  const stepTimeoutMs =
    optionalPositiveInteger(options, 'step-timeout-ms') ?? DEFAULT_STEP_TIMEOUT_MS;
  const heartbeatFile = resolveHeartbeatFile({
    explicit: optional(options, 'heartbeat-file'),
    seenFile,
    noHeartbeat: optional(options, 'no-heartbeat') !== undefined,
  });
  const heartbeatIntervalMs =
    optionalPositiveInteger(options, 'heartbeat-interval-ms') ?? DEFAULT_HEARTBEAT_INTERVAL_MS;
  const seedFromNow = optional(options, 'seed-from-now') !== undefined;
  const noAutoSeed = optional(options, 'no-auto-seed') !== undefined;
  const supervisorAlive = resolveSupervisorAlive(options, runtime);

  await io.ensureDirectory(commsDir);
  await seedSeenStateIfNeeded({ io, commsDir, seenFile, seedFromNow, noAutoSeed });

  const tick = composeHeartbeatTick({
    heartbeatFile,
    heartbeatIntervalMs,
    self,
    io,
    supervisorAlive,
  });

  const output = await watchCommsLoop({
    maxEvents,
    stepTimeoutMs,
    drain: (remainingEvents) => drainComms({ commsDir, seenFile, self, remainingEvents, io }),
    waitForChange: () => waitForCommsChange(runtime, { directory: commsDir, pollMs }),
    emit: async (text) => {
      runtime.stdout?.write(text);
    },
    markSeen: (eventIds) => io.appendSeenMessageIds(seenFile, eventIds),
    tick,
    supervisorAlive,
  });

  return runtime.stdout === undefined ? output : '';
}

function composeHeartbeatTick(input: {
  readonly heartbeatFile: string | undefined;
  readonly heartbeatIntervalMs: number;
  readonly self: CollaborationAgentId;
  readonly io: CollaborationStateCliIo;
  readonly supervisorAlive: (() => boolean | Promise<boolean>) | undefined;
}): ((status: WatcherTickStatus) => Promise<void>) | undefined {
  const heartbeatFile = input.heartbeatFile;
  if (heartbeatFile === undefined) {
    return undefined;
  }
  const startedAt = new Date().toISOString();
  let lastHeartbeatAtMs = 0;
  return async (status): Promise<void> => {
    // F-101: never refresh the liveness heartbeat once the supervising agent is
    // gone — a post-death heartbeat is the exact false-liveness signal the cure
    // prevents. The loop's top-of-iteration check exits within one poll cycle;
    // this guards the tick that can otherwise fire mid-iteration, after a step
    // during which the supervisor died.
    if (await supervisorIsGone(input.supervisorAlive)) {
      return;
    }
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
