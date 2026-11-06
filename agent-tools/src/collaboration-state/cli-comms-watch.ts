import { dirname } from 'node:path';

import { err, ok, unwrapOrThrow, type Result } from '@oaknational/result';

import { seedSeenStateIfNeeded } from './comms-watch-auto-seed.js';
import { validateCommsEventTags, type CommsEventTag } from './comms-tag-namespace.js';
import { drainRelevantEvents, watchCommsLoop, type WatcherTickStatus } from './comms-use-cases.js';
import {
  HEARTBEAT_FILE_SUFFIX,
  writeWatcherHeartbeat,
  WATCHER_HEARTBEAT_SCHEMA_VERSION,
} from './watcher-heartbeat.js';
import { resolveCommsWatchPaths, resolveWatchedCommsDir } from './comms-watch-paths.js';
import { optional, optionalPositiveInteger, type Options } from './cli-options.js';
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
function resolveHeartbeatFile(options: Options, seenFile: string): string | undefined {
  if (optional(options, 'no-heartbeat') !== undefined) {
    return undefined;
  }
  return optional(options, 'heartbeat-file') ?? `${seenFile}${HEARTBEAT_FILE_SUFFIX}`;
}

/**
 * Watch the comms stream. Emits every non-self event under the current
 * view-token set: broadcast, group, directed, observed, and lifecycle.
 * Output is STREAM-ONLY (`runtime.stdout`); the CLI result string is always
 * empty. `--max-events-per-drain` bounds each drain pass, never the
 * watcher's lifetime — the process runs until its `--supervisor-pid` dies
 * (the only orderly exit a production invocation can reach, announced by
 * the final `--- WATCHER EXIT --- reason=supervisor-gone` line), a step
 * deadline fires (kind=timeout, non-zero exit, no EXIT line), or the
 * composing `timeout` backstop kills it (also no EXIT line). Without
 * `--supervisor-pid` AND without a `timeout` wrapper the watcher has no
 * exit path at all — the watcher rule mandates the supervisor pid.
 *
 * Liveness surface (FM-2 cure, 2026-05-23; default-on 2026-06-10): the watcher
 * writes a substrate-typed heartbeat JSON after its first pass, then on the
 * first pass ending one `--heartbeat-interval-ms` (default 30000) after the
 * previous write, with `last_drain_at`, `last_emit_at`,
 * `last_error_at`, `emitted_count`, the `pid`, and the lexically absolute
 * comms directory actually drained. The path is the seen-file's derived
 * default (`<seen-file>.heartbeat.json`) unless `--heartbeat-file` overrides
 * it; `--no-heartbeat` disables the surface. Absence of mtime updates beyond
 * 3x the interval is the stale signal external liveness checks (e.g.
 * `detectStaleWatcher`) should use — a hung process cannot self-report, so
 * this consumer check is the detection path c1's loud death cannot cover.
 */
export async function watchComms(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
): Promise<string> {
  const io = cliIo(runtime);
  unwrapOrThrow(requireStreamingStdout(runtime));
  const { self, commsDir, seenFile, watchedCommsDir } = resolveWatchIdentityAndPaths(
    options,
    env,
    runtime,
  );
  const { pollMs, maxEventsPerDrain, stepTimeoutMs, heartbeatIntervalMs } =
    resolveWatchTunables(options);
  const heartbeatFile = resolveHeartbeatFile(options, seenFile);
  const seedFromNow = optional(options, 'seed-from-now') !== undefined;
  const noAutoSeed = optional(options, 'no-auto-seed') !== undefined;
  const supervisorAlive = resolveSupervisorAlive(options, runtime);
  const excludeTags = resolveExcludeTags(options);

  await io.ensureDirectory(commsDir);
  await io.ensureDirectory(dirname(seenFile));
  await seedSeenStateIfNeeded({ io, commsDir, seenFile, seedFromNow, noAutoSeed });

  const tick = composeHeartbeatTick({
    heartbeatFile,
    heartbeatIntervalMs,
    self,
    watchedCommsDir,
    io,
    supervisorAlive,
  });

  await watchCommsLoop({
    maxEventsPerDrain,
    stepTimeoutMs,
    drain: (batchLimit) => drainComms({ commsDir, seenFile, self, batchLimit, io, excludeTags }),
    waitForChange: () => waitForCommsChange(runtime, { directory: commsDir, pollMs }),
    emit: async (text) => {
      runtime.stdout?.write(text);
    },
    markSeen: (eventIds) => io.appendSeenMessageIds(seenFile, eventIds),
    tick,
    supervisorAlive,
  });

  // Stream-only output: the return-value accumulation mode was removed —
  // under an unbounded lifetime it was an unbounded memory leak.
  return '';
}

/**
 * Boundary guard: with no stream the emit step is a no-op, so drained events
 * would be consumed (marked seen) but delivered NOWHERE — the silent-eater
 * shape recorded 2026-07-25. Refuse before any comms IO instead.
 */
function requireStreamingStdout(runtime: CliRuntime): Result<void, Error> {
  return runtime.stdout === undefined
    ? err(
        new Error(
          'comms watch requires a streaming stdout surface: without one, drained events are marked seen but delivered nowhere',
        ),
      )
    : ok(undefined);
}

function resolveWatchIdentityAndPaths(
  options: Options,
  env: CollaborationStateEnvironment,
  runtime: CliRuntime,
) {
  const self = resolveSelfIdentity(options, env);
  const paths = unwrapOrThrow(resolveCommsWatchPaths(options, self.agent_name, runtime));
  return {
    self,
    ...paths,
    watchedCommsDir: unwrapOrThrow(resolveWatchedCommsDir(paths.commsDir, runtime)),
  };
}

/** The four numeric watch tunables, each defaulting per the constants above. */
function resolveWatchTunables(options: Options): {
  readonly pollMs: number;
  readonly maxEventsPerDrain: number | undefined;
  readonly stepTimeoutMs: number;
  readonly heartbeatIntervalMs: number;
} {
  return {
    pollMs: optionalPositiveInteger(options, 'poll-ms') ?? DEFAULT_POLL_MS,
    maxEventsPerDrain: optionalPositiveInteger(options, 'max-events-per-drain'),
    stepTimeoutMs: optionalPositiveInteger(options, 'step-timeout-ms') ?? DEFAULT_STEP_TIMEOUT_MS,
    heartbeatIntervalMs:
      optionalPositiveInteger(options, 'heartbeat-interval-ms') ?? DEFAULT_HEARTBEAT_INTERVAL_MS,
  };
}

/**
 * F-146: boundary-validate the exclusion set (canonical ADR-183 tags, no
 * duplicates) BEFORE the watcher arms — a typo must fail loud here, never
 * silently exclude nothing.
 */
function resolveExcludeTags(options: Options): ReadonlySet<CommsEventTag> | undefined {
  return options.excludeTags.length === 0
    ? undefined
    : new Set(validateCommsEventTags(options.excludeTags));
}

function composeHeartbeatTick(input: {
  readonly heartbeatFile: string | undefined;
  readonly heartbeatIntervalMs: number;
  readonly self: CollaborationAgentId;
  readonly watchedCommsDir: string;
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
        watched_comms_dir: input.watchedCommsDir,
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
  readonly batchLimit?: number;
  readonly io: CollaborationStateCliIo;
  readonly excludeTags?: ReadonlySet<CommsEventTag>;
}): ReturnType<typeof drainRelevantEvents> {
  const seenIds = await input.io.readSeenIds(input.seenFile);
  // MCP-198: read only the UNSEEN files. `drainRelevantEvents` filters by the
  // same seen-set, so this is behaviour-preserving — it moves the filter ahead
  // of the file reads so drain cost tracks new events, not directory size.
  const messages = await input.io.readCommsEventsExcluding(input.commsDir, seenIds);
  return drainRelevantEvents({
    messages,
    seenIds,
    self: input.self,
    batchLimit: input.batchLimit,
    excludeTags: input.excludeTags,
  });
}
