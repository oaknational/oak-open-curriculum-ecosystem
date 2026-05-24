import { z } from 'zod';

import { type CollaborationStateCliIo } from './cli-runtime.js';
import { collaborationAgentIdSchema } from './types.js';

/**
 * Pre-stable schema version. The `0.x.y` prefix signals that the schema may
 * evolve before a 1.0 release (per semver convention); consumers MUST be
 * tolerant of additive field changes. The version moves to `1.0.0` only
 * when the team commits to the field set being stable across consumers.
 */
const WATCHER_HEARTBEAT_SCHEMA_VERSION = '0.1.0';

const watcherHeartbeatSchema = z
  .object({
    schema_version: z.literal(WATCHER_HEARTBEAT_SCHEMA_VERSION),
    pid: z.number(),
    started_at: z.string(),
    last_drain_at: z.string().nullable(),
    last_emit_at: z.string().nullable(),
    last_error_at: z.string().nullable(),
    emitted_count: z.number(),
    heartbeat_interval_ms: z.number(),
    watcher_identity: collaborationAgentIdSchema,
  })
  .strict();

/**
 * Substrate-typed liveness record written by the `comms watch` CLI.
 *
 * Consumers detect a stale watcher by mtime: when `Date.now() - mtime`
 * exceeds `3 * heartbeat_interval_ms`, the watcher is presumed dead and
 * external recovery (restart, alert, etc.) should fire. The 3x ratio
 * accommodates GC pauses, brief filesystem latency, and the polling cycle
 * jitter inside the watch loop.
 *
 * Schema-driven (per `schema-first-execution.md`) — the runtime shape is the
 * Zod schema `watcherHeartbeatSchema`; this exported interface is the
 * compile-time projection. Both are kept in lockstep by `z.infer` ensuring
 * the type IS the schema's parse output.
 *
 * See FM-2 cure (2026-05-23): Monitor-harness liveness investigation.
 */
export type WatcherHeartbeat = z.infer<typeof watcherHeartbeatSchema>;

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
 * heartbeat or throws a `TypeError` on schema mismatch OR malformed JSON
 * (caller decides how to handle). Both failure modes throw the same
 * specific exception type — consumers narrowing on `TypeError` cover both.
 * The wrap satisfies SonarQube rule S7786 (specific exception types over
 * bare `Error`) and prevents the native `SyntaxError` from `JSON.parse`
 * leaking past the contract boundary.
 */
export function parseWatcherHeartbeat(text: string): WatcherHeartbeat {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new TypeError(`watcher heartbeat: malformed JSON — ${message}`, { cause: error });
  }
  const result = watcherHeartbeatSchema.safeParse(raw);
  if (!result.success) {
    throw new TypeError(`watcher heartbeat: schema mismatch — ${result.error.message}`);
  }
  return result.data;
}

/**
 * Zod schema for the watcher heartbeat — exported for callers (liveness
 * consumers, integration tests, derivative tooling) that want to compose
 * additional validation on top of the canonical parse.
 */
export { watcherHeartbeatSchema, WATCHER_HEARTBEAT_SCHEMA_VERSION };
