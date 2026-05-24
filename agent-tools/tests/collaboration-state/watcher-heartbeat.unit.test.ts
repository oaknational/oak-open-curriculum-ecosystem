import { describe, expect, it } from 'vitest';

import {
  parseWatcherHeartbeat,
  WATCHER_HEARTBEAT_SCHEMA_VERSION,
  writeWatcherHeartbeat,
  type WatcherHeartbeat,
} from '../../src/collaboration-state/watcher-heartbeat';
import { type CollaborationAgentId } from '../../src/collaboration-state/types';

const watcherIdentity: CollaborationAgentId = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
};

function validHeartbeat(): WatcherHeartbeat {
  return {
    schema_version: WATCHER_HEARTBEAT_SCHEMA_VERSION,
    pid: 4242,
    started_at: '2026-05-23T12:00:00.000Z',
    last_drain_at: '2026-05-23T12:01:00.000Z',
    last_emit_at: '2026-05-23T12:01:00.500Z',
    last_error_at: null,
    emitted_count: 17,
    heartbeat_interval_ms: 30000,
    watcher_identity: watcherIdentity,
  };
}

describe('parseWatcherHeartbeat — strict reverse-parse', () => {
  it('round-trips a valid heartbeat object through JSON.stringify and parseWatcherHeartbeat', () => {
    const heartbeat = validHeartbeat();
    expect(parseWatcherHeartbeat(JSON.stringify(heartbeat))).toStrictEqual(heartbeat);
  });

  it('throws TypeError when the JSON parses to a non-object value', () => {
    expect(() => parseWatcherHeartbeat('42')).toThrow(TypeError);
    expect(() => parseWatcherHeartbeat('"a string"')).toThrow(TypeError);
    expect(() => parseWatcherHeartbeat('null')).toThrow(TypeError);
  });

  it('throws TypeError when the input is not valid JSON (wraps native SyntaxError)', () => {
    expect(() => parseWatcherHeartbeat('{not valid json')).toThrow(TypeError);
    expect(() => parseWatcherHeartbeat('')).toThrow(TypeError);
    expect(() => parseWatcherHeartbeat('undefined')).toThrow(TypeError);
  });

  it('throws TypeError when schema_version does not match the supported version', () => {
    const text = JSON.stringify({ ...validHeartbeat(), schema_version: '99.99.99' });
    expect(() => parseWatcherHeartbeat(text)).toThrow(TypeError);
  });

  it('throws TypeError when pid is missing or not a number', () => {
    const noPid: Record<string, unknown> = { ...validHeartbeat() };
    delete noPid['pid'];
    expect(() => parseWatcherHeartbeat(JSON.stringify(noPid))).toThrow(TypeError);
    expect(() =>
      parseWatcherHeartbeat(JSON.stringify({ ...validHeartbeat(), pid: 'not-a-number' })),
    ).toThrow(TypeError);
  });

  it('throws TypeError when started_at is not a string', () => {
    expect(() =>
      parseWatcherHeartbeat(JSON.stringify({ ...validHeartbeat(), started_at: 12345 })),
    ).toThrow(TypeError);
  });

  it('accepts last_drain_at / last_emit_at / last_error_at as either ISO strings or null', () => {
    const allNull = JSON.stringify({
      ...validHeartbeat(),
      last_drain_at: null,
      last_emit_at: null,
      last_error_at: null,
    });
    expect(parseWatcherHeartbeat(allNull).last_drain_at).toBeNull();

    const allStrings = JSON.stringify({
      ...validHeartbeat(),
      last_drain_at: '2026-05-23T12:01:00.000Z',
      last_emit_at: '2026-05-23T12:01:00.500Z',
      last_error_at: '2026-05-23T12:00:30.000Z',
    });
    expect(parseWatcherHeartbeat(allStrings).last_error_at).toBe('2026-05-23T12:00:30.000Z');
  });

  it('throws TypeError when a nullable time field is the wrong type (number, object)', () => {
    expect(() =>
      parseWatcherHeartbeat(JSON.stringify({ ...validHeartbeat(), last_drain_at: 12345 })),
    ).toThrow(TypeError);
    expect(() =>
      parseWatcherHeartbeat(JSON.stringify({ ...validHeartbeat(), last_emit_at: {} })),
    ).toThrow(TypeError);
    expect(() =>
      parseWatcherHeartbeat(JSON.stringify({ ...validHeartbeat(), last_error_at: true })),
    ).toThrow(TypeError);
  });

  it('throws TypeError when emitted_count or heartbeat_interval_ms is not a number', () => {
    expect(() =>
      parseWatcherHeartbeat(JSON.stringify({ ...validHeartbeat(), emitted_count: 'lots' })),
    ).toThrow(TypeError);
    expect(() =>
      parseWatcherHeartbeat(JSON.stringify({ ...validHeartbeat(), heartbeat_interval_ms: null })),
    ).toThrow(TypeError);
  });

  it('throws TypeError when watcher_identity is missing or not an object', () => {
    const noIdentity: Record<string, unknown> = { ...validHeartbeat() };
    delete noIdentity['watcher_identity'];
    expect(() => parseWatcherHeartbeat(JSON.stringify(noIdentity))).toThrow(TypeError);
    expect(() =>
      parseWatcherHeartbeat(JSON.stringify({ ...validHeartbeat(), watcher_identity: 'identity' })),
    ).toThrow(TypeError);
  });

  it('throws TypeError when any required watcher_identity field is missing or wrong type', () => {
    const missingAgentName = JSON.stringify({
      ...validHeartbeat(),
      watcher_identity: { ...watcherIdentity, agent_name: undefined },
    });
    expect(() => parseWatcherHeartbeat(missingAgentName)).toThrow(TypeError);

    const wrongTypePlatform = JSON.stringify({
      ...validHeartbeat(),
      watcher_identity: { ...watcherIdentity, platform: 42 },
    });
    expect(() => parseWatcherHeartbeat(wrongTypePlatform)).toThrow(TypeError);
  });
});

describe('writeWatcherHeartbeat — substrate writer', () => {
  it('writes the heartbeat as pretty-printed JSON with a trailing newline to the named path', async () => {
    const writes: { filePath: string; text: string }[] = [];
    const heartbeat = validHeartbeat();

    await writeWatcherHeartbeat({
      io: {
        writeTextFile: async ({ filePath, text }) => {
          writes.push({ filePath, text });
        },
      },
      heartbeatFile: 'mem://twilit-test-heartbeat.json',
      heartbeat,
    });

    expect(writes).toHaveLength(1);
    expect(writes[0]?.filePath).toBe('mem://twilit-test-heartbeat.json');
    expect(writes[0]?.text.endsWith('\n')).toBe(true);
    // Round-trip via parseWatcherHeartbeat confirms the written text is the
    // exact heartbeat — schema-driven verification rather than string
    // diffing.
    expect(parseWatcherHeartbeat(writes[0]?.text ?? '')).toStrictEqual(heartbeat);
  });

  it('overwrites the file each call so consumers reading mtime see fresh writes', async () => {
    const writes: { filePath: string; text: string }[] = [];
    const first: WatcherHeartbeat = { ...validHeartbeat(), emitted_count: 1 };
    const second: WatcherHeartbeat = { ...validHeartbeat(), emitted_count: 2 };

    const io = {
      writeTextFile: async ({ filePath, text }: { filePath: string; text: string }) => {
        writes.push({ filePath, text });
      },
    };

    await writeWatcherHeartbeat({ io, heartbeatFile: 'mem://x.json', heartbeat: first });
    await writeWatcherHeartbeat({ io, heartbeatFile: 'mem://x.json', heartbeat: second });

    expect(writes).toHaveLength(2);
    expect(parseWatcherHeartbeat(writes[0]?.text ?? '').emitted_count).toBe(1);
    expect(parseWatcherHeartbeat(writes[1]?.text ?? '').emitted_count).toBe(2);
  });
});
