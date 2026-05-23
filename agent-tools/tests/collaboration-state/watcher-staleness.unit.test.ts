import { describe, expect, it } from 'vitest';

import { type CollaborationAgentId } from '../../src/collaboration-state/types';
import { type WatcherHeartbeat } from '../../src/collaboration-state/watcher-heartbeat';
import {
  detectStaleWatcher,
  type WatcherStalenessIo,
} from '../../src/collaboration-state/watcher-staleness';

const identity: CollaborationAgentId = {
  agent_name: 'Twilit Scattering Twilight',
  platform: 'claude',
  model: 'claude-opus-4-7',
  session_id_prefix: '8d8d93',
};

const HEARTBEAT_INTERVAL_MS = 5000;
const STALENESS_THRESHOLD_MS = HEARTBEAT_INTERVAL_MS * 3;

function validHeartbeat(overrides: Partial<WatcherHeartbeat> = {}): WatcherHeartbeat {
  return {
    schema_version: '0.1.0',
    pid: 4242,
    started_at: '2026-05-23T15:00:00.000Z',
    last_drain_at: '2026-05-23T15:00:05.000Z',
    last_emit_at: '2026-05-23T15:00:05.500Z',
    last_error_at: null,
    emitted_count: 17,
    heartbeat_interval_ms: HEARTBEAT_INTERVAL_MS,
    watcher_identity: identity,
    ...overrides,
  };
}

function ioWithText(mtime: number | 'missing', text: string): WatcherStalenessIo {
  return {
    readTextFile: async () => text,
    statMtimeMs: async () => mtime,
  };
}

function ioWithReadFailure(
  mtime: number | 'missing',
  readFailure: () => Promise<string>,
): WatcherStalenessIo {
  return {
    readTextFile: readFailure,
    statMtimeMs: async () => mtime,
  };
}

describe('detectStaleWatcher — discriminated-union liveness result', () => {
  it('returns kind "live" when the heartbeat parses cleanly and is younger than 3 × interval', async () => {
    const heartbeat = validHeartbeat();
    const nowMs = 1_000_000_000_000;
    const mtimeMs = nowMs - HEARTBEAT_INTERVAL_MS; // 1 × interval — well under threshold

    const result = await detectStaleWatcher({
      heartbeatFile: '/tmp/heartbeat.json',
      nowMs,
      io: ioWithText(mtimeMs, JSON.stringify(heartbeat)),
    });

    expect(result.kind).toBe('live');
    if (result.kind === 'live') {
      expect(result.identity).toStrictEqual(identity);
      expect(result.lastEmitAt).toBe('2026-05-23T15:00:05.500Z');
      expect(result.agedMs).toBe(HEARTBEAT_INTERVAL_MS);
    }
  });

  it('returns kind "live" when aged exactly equals threshold (boundary check)', async () => {
    const heartbeat = validHeartbeat();
    const nowMs = 1_000_000_000_000;
    const mtimeMs = nowMs - STALENESS_THRESHOLD_MS; // exactly at threshold — NOT stale (uses strict >)

    const result = await detectStaleWatcher({
      heartbeatFile: '/tmp/heartbeat.json',
      nowMs,
      io: ioWithText(mtimeMs, JSON.stringify(heartbeat)),
    });

    expect(result.kind).toBe('live');
  });

  it('returns kind "stale-aged" when aged exceeds 3 × interval', async () => {
    const heartbeat = validHeartbeat();
    const nowMs = 1_000_000_000_000;
    const mtimeMs = nowMs - STALENESS_THRESHOLD_MS - 1; // one ms past threshold

    const result = await detectStaleWatcher({
      heartbeatFile: '/tmp/heartbeat.json',
      nowMs,
      io: ioWithText(mtimeMs, JSON.stringify(heartbeat)),
    });

    expect(result.kind).toBe('stale-aged');
    if (result.kind === 'stale-aged') {
      expect(result.identity).toStrictEqual(identity);
      expect(result.lastEmitAt).toBe('2026-05-23T15:00:05.500Z');
      expect(result.thresholdMs).toBe(STALENESS_THRESHOLD_MS);
      expect(result.agedMs).toBe(STALENESS_THRESHOLD_MS + 1);
    }
  });

  it('returns kind "stale-no-emit" when last_emit_at is null even if aged is below threshold', async () => {
    const heartbeat = validHeartbeat({ last_emit_at: null, emitted_count: 0 });
    const nowMs = 1_000_000_000_000;
    const mtimeMs = nowMs - 100; // very fresh

    const result = await detectStaleWatcher({
      heartbeatFile: '/tmp/heartbeat.json',
      nowMs,
      io: ioWithText(mtimeMs, JSON.stringify(heartbeat)),
    });

    expect(result.kind).toBe('stale-no-emit');
    if (result.kind === 'stale-no-emit') {
      expect(result.identity).toStrictEqual(identity);
      expect(result.emittedCount).toBe(0);
    }
  });

  it('returns kind "absent" when statMtimeMs reports the heartbeat file missing', async () => {
    const result = await detectStaleWatcher({
      heartbeatFile: '/tmp/no-such-heartbeat.json',
      nowMs: 1_000_000_000_000,
      io: ioWithText('missing', ''),
    });

    expect(result.kind).toBe('absent');
    if (result.kind === 'absent') {
      expect(result.heartbeatFile).toBe('/tmp/no-such-heartbeat.json');
    }
  });

  it('returns kind "malformed" when the heartbeat text is not valid JSON', async () => {
    const result = await detectStaleWatcher({
      heartbeatFile: '/tmp/heartbeat.json',
      nowMs: 1_000_000_000_000,
      io: ioWithText(999, '{not valid json'),
    });

    expect(result.kind).toBe('malformed');
    if (result.kind === 'malformed') {
      expect(result.heartbeatFile).toBe('/tmp/heartbeat.json');
      expect(result.reason).toContain('JSON parse failed');
    }
  });

  it('returns kind "malformed" when the heartbeat JSON does not match the schema', async () => {
    const result = await detectStaleWatcher({
      heartbeatFile: '/tmp/heartbeat.json',
      nowMs: 1_000_000_000_000,
      io: ioWithText(999, JSON.stringify({ wrong: 'shape' })),
    });

    expect(result.kind).toBe('malformed');
    if (result.kind === 'malformed') {
      expect(result.reason).toContain('schema mismatch');
    }
  });

  it('returns kind "malformed" when readTextFile rejects (post-existence read failure)', async () => {
    const result = await detectStaleWatcher({
      heartbeatFile: '/tmp/heartbeat.json',
      nowMs: 1_000_000_000_000,
      io: ioWithReadFailure(999, async () => {
        throw new Error('EACCES: permission denied');
      }),
    });

    expect(result.kind).toBe('malformed');
    if (result.kind === 'malformed') {
      expect(result.reason).toContain('read failed');
      expect(result.reason).toContain('EACCES');
    }
  });
});
