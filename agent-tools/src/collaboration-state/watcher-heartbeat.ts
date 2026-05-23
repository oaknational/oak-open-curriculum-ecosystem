import { type CollaborationStateCliIo } from './cli-runtime.js';
import { type CollaborationAgentId } from './types.js';

/**
 * Substrate-typed liveness record written by the `comms watch` CLI.
 *
 * Consumers detect a stale watcher by mtime: when `Date.now() - mtime`
 * exceeds `3 * heartbeat_interval_ms`, the watcher is presumed dead and
 * external recovery (restart, alert, etc.) should fire. The 3x ratio
 * accommodates GC pauses, brief filesystem latency, and the polling cycle
 * jitter inside the watch loop.
 *
 * See FM-2 cure (2026-05-23): Monitor-harness liveness investigation.
 */
export interface WatcherHeartbeat {
  readonly schema_version: '1.0.0';
  readonly pid: number;
  readonly started_at: string;
  readonly last_drain_at: string | null;
  readonly last_emit_at: string | null;
  readonly last_error_at: string | null;
  readonly emitted_count: number;
  readonly heartbeat_interval_ms: number;
  readonly watcher_identity: CollaborationAgentId;
}

export async function writeWatcherHeartbeat(input: {
  readonly io: Pick<CollaborationStateCliIo, 'writeTextFile'>;
  readonly heartbeatFile: string;
  readonly heartbeat: WatcherHeartbeat;
}): Promise<void> {
  const text = `${JSON.stringify(input.heartbeat, null, 2)}\n`;
  await input.io.writeTextFile({ filePath: input.heartbeatFile, text });
}

/**
 * Strict reverse-parse used by liveness consumers. Returns the parsed
 * heartbeat or throws on schema mismatch (caller decides how to handle).
 */
export function parseWatcherHeartbeat(text: string): WatcherHeartbeat {
  const raw: unknown = JSON.parse(text);
  if (raw === null || typeof raw !== 'object') {
    throw new Error('watcher heartbeat: not a JSON object');
  }
  const obj = raw as Record<string, unknown>;
  if (obj['schema_version'] !== '1.0.0') {
    throw new Error(`watcher heartbeat: unsupported schema_version: ${String(obj['schema_version'])}`);
  }
  const pid = obj['pid'];
  const startedAt = obj['started_at'];
  const lastDrainAt = obj['last_drain_at'];
  const lastEmitAt = obj['last_emit_at'];
  const lastErrorAt = obj['last_error_at'];
  const emittedCount = obj['emitted_count'];
  const heartbeatIntervalMs = obj['heartbeat_interval_ms'];
  const watcherIdentity = obj['watcher_identity'];
  if (typeof pid !== 'number') {
    throw new Error('watcher heartbeat: pid must be a number');
  }
  if (typeof startedAt !== 'string') {
    throw new Error('watcher heartbeat: started_at must be a string');
  }
  if (lastDrainAt !== null && typeof lastDrainAt !== 'string') {
    throw new Error('watcher heartbeat: last_drain_at must be string or null');
  }
  if (lastEmitAt !== null && typeof lastEmitAt !== 'string') {
    throw new Error('watcher heartbeat: last_emit_at must be string or null');
  }
  if (lastErrorAt !== null && typeof lastErrorAt !== 'string') {
    throw new Error('watcher heartbeat: last_error_at must be string or null');
  }
  if (typeof emittedCount !== 'number') {
    throw new Error('watcher heartbeat: emitted_count must be a number');
  }
  if (typeof heartbeatIntervalMs !== 'number') {
    throw new Error('watcher heartbeat: heartbeat_interval_ms must be a number');
  }
  if (watcherIdentity === null || typeof watcherIdentity !== 'object') {
    throw new Error('watcher heartbeat: watcher_identity must be an object');
  }
  const identity = watcherIdentity as Record<string, unknown>;
  if (
    typeof identity['agent_name'] !== 'string' ||
    typeof identity['platform'] !== 'string' ||
    typeof identity['model'] !== 'string' ||
    typeof identity['session_id_prefix'] !== 'string'
  ) {
    throw new Error('watcher heartbeat: watcher_identity fields invalid');
  }
  return {
    schema_version: '1.0.0',
    pid,
    started_at: startedAt,
    last_drain_at: lastDrainAt,
    last_emit_at: lastEmitAt,
    last_error_at: lastErrorAt,
    emitted_count: emittedCount,
    heartbeat_interval_ms: heartbeatIntervalMs,
    watcher_identity: {
      agent_name: identity['agent_name'],
      platform: identity['platform'],
      model: identity['model'],
      session_id_prefix: identity['session_id_prefix'],
    },
  };
}
