import { type CollaborationAgentId } from './types.js';
import { type WatcherHeartbeat, watcherHeartbeatSchema } from './watcher-heartbeat.js';

/**
 * Multiplier applied to a watcher's `heartbeat_interval_ms` to derive the
 * staleness threshold. Set to 3 to accommodate GC pauses, brief filesystem
 * latency, and the polling cycle jitter inside the watch loop — matches the
 * documented contract in `watcher-heartbeat.ts`.
 */
const STALENESS_THRESHOLD_INTERVAL_MULTIPLIER = 3;

/**
 * IO contract for the staleness detector. Kept minimal and consumer-specific
 * so that the broader `CollaborationStateCliIo` interface does not have to
 * widen to add filesystem `stat`. `statMtimeMs` returns the literal
 * `'missing'` for an absent file rather than throwing — the result type IS
 * the contract for absence vs read failure.
 */
export interface WatcherStalenessIo {
  readonly readTextFile: (filePath: string) => Promise<string>;
  readonly statMtimeMs: (filePath: string) => Promise<number | 'missing'>;
}

/**
 * Discriminated-union result of staleness detection. Five kinds covering the
 * full state space:
 *
 * - `live`: heartbeat present, emitted at least once, written within
 *   `3 * heartbeat_interval_ms` of `nowMs`.
 * - `stale-aged`: heartbeat present, emitted at least once, but written more
 *   than `3 * heartbeat_interval_ms` ago. The watcher is presumed dead.
 * - `stale-no-emit`: heartbeat present but `last_emit_at` is null. The
 *   watcher started but has not yet processed any events — caller decides
 *   whether to treat this as live (just started) or stale (long since
 *   started but inert) based on `emittedCount` and the surrounding context.
 * - `absent`: heartbeat file does not exist. Either the watcher never
 *   started OR the heartbeat file was cleaned up post-shutdown.
 * - `malformed`: heartbeat file exists but read failed OR contents failed
 *   schema validation. The caller should treat this as a hard failure to
 *   classify.
 *
 * The result is the FIRST consumer of the canonical `watcherHeartbeatSchema`
 * export — the export's documented intent (per its JSDoc in
 * `watcher-heartbeat.ts`) is composed validation by liveness consumers,
 * integration tests, and derivative tooling.
 */
export type WatcherStalenessResult =
  | {
      readonly kind: 'live';
      readonly identity: CollaborationAgentId;
      readonly lastEmitAt: string;
      readonly agedMs: number;
    }
  | {
      readonly kind: 'stale-aged';
      readonly identity: CollaborationAgentId;
      readonly lastEmitAt: string;
      readonly agedMs: number;
      readonly thresholdMs: number;
    }
  | {
      readonly kind: 'stale-no-emit';
      readonly identity: CollaborationAgentId;
      readonly emittedCount: number;
    }
  | {
      readonly kind: 'absent';
      readonly heartbeatFile: string;
    }
  | {
      readonly kind: 'malformed';
      readonly heartbeatFile: string;
      readonly reason: string;
    };

type ReadOutcome =
  | { readonly kind: 'ok'; readonly heartbeat: WatcherHeartbeat }
  | { readonly kind: 'malformed'; readonly reason: string };

async function readAndParseHeartbeat(
  io: WatcherStalenessIo,
  heartbeatFile: string,
): Promise<ReadOutcome> {
  let text: string;
  try {
    text = await io.readTextFile(heartbeatFile);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { kind: 'malformed', reason: `read failed — ${reason}` };
  }

  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { kind: 'malformed', reason: `JSON parse failed — ${reason}` };
  }

  const parseResult = watcherHeartbeatSchema.safeParse(raw);
  if (!parseResult.success) {
    return { kind: 'malformed', reason: `schema mismatch — ${parseResult.error.message}` };
  }

  return { kind: 'ok', heartbeat: parseResult.data };
}

function classifyLiveness(
  heartbeat: WatcherHeartbeat,
  mtimeMs: number,
  nowMs: number,
): WatcherStalenessResult {
  if (heartbeat.last_emit_at === null) {
    return {
      kind: 'stale-no-emit',
      identity: heartbeat.watcher_identity,
      emittedCount: heartbeat.emitted_count,
    };
  }

  const thresholdMs = heartbeat.heartbeat_interval_ms * STALENESS_THRESHOLD_INTERVAL_MULTIPLIER;
  const agedMs = nowMs - mtimeMs;
  const lastEmitAt = heartbeat.last_emit_at;

  if (agedMs > thresholdMs) {
    return {
      kind: 'stale-aged',
      identity: heartbeat.watcher_identity,
      lastEmitAt,
      agedMs,
      thresholdMs,
    };
  }

  return { kind: 'live', identity: heartbeat.watcher_identity, lastEmitAt, agedMs };
}

export async function detectStaleWatcher(input: {
  readonly heartbeatFile: string;
  readonly nowMs: number;
  readonly io: WatcherStalenessIo;
}): Promise<WatcherStalenessResult> {
  const mtimeMs = await input.io.statMtimeMs(input.heartbeatFile);
  if (mtimeMs === 'missing') {
    return { kind: 'absent', heartbeatFile: input.heartbeatFile };
  }

  const readOutcome = await readAndParseHeartbeat(input.io, input.heartbeatFile);
  if (readOutcome.kind === 'malformed') {
    return { kind: 'malformed', heartbeatFile: input.heartbeatFile, reason: readOutcome.reason };
  }

  return classifyLiveness(readOutcome.heartbeat, mtimeMs, input.nowMs);
}
