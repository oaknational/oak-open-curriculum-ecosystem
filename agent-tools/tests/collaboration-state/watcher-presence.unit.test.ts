/**
 * Covers the pure presence classifier and path derivers behind the F-95
 * comms-watcher-presence gate: `live`/fresh-`stale-no-emit` are present ONLY
 * when the heartbeat identity matches this session (a foreign or copied
 * heartbeat does not count); `absent`/`stale-aged`/`malformed` and an aged
 * `stale-no-emit` are blind. Derivers compose codename, seen-file, and
 * heartbeat path and reject unsafe segments / a root dir.
 */
import { describe, expect, it } from 'vitest';

import {
  classifyWatcherPresence,
  commsSeenFileForCodename,
  heartbeatFileForSeen,
} from '../../src/collaboration-state/watcher-presence';
import { deriveOverrideCollaborationIdentity } from '../../src/collaboration-state/identity';

// Derived (not literal) so `id` is a valid branded UuidV5; distinct names give
// distinct routing keys so the identity-match path is exercised both ways.
const identity = deriveOverrideCollaborationIdentity({
  agent_name: 'Seal hunts Offing',
  platform: 'claude',
  model: 'Opus 4.8',
  session_id_prefix: '8210d6',
});

const foreign = deriveOverrideCollaborationIdentity({
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
});

describe('classifyWatcherPresence', () => {
  it('treats a live watcher whose identity matches this session as present', () => {
    expect(
      classifyWatcherPresence({ kind: 'live', identity, lastEmitAt: 'x', agedMs: 10 }, identity),
    ).toEqual({ kind: 'present' });
  });

  it('treats a live watcher whose identity does NOT match this session as blind', () => {
    const verdict = classifyWatcherPresence(
      { kind: 'live', identity: foreign, lastEmitAt: 'x', agedMs: 10 },
      identity,
    );
    expect(verdict).toMatchObject({ kind: 'blind' });
    expect(JSON.stringify(verdict)).toContain('not this session');
  });

  it('treats an absent heartbeat as blind and names the missing path', () => {
    const verdict = classifyWatcherPresence(
      { kind: 'absent', heartbeatFile: 'seen.json.heartbeat.json' },
      identity,
    );
    expect(verdict).toMatchObject({ kind: 'blind' });
    expect(JSON.stringify(verdict)).toContain('seen.json.heartbeat.json');
  });

  it('treats an aged heartbeat as blind', () => {
    expect(
      classifyWatcherPresence(
        { kind: 'stale-aged', identity, lastEmitAt: 'x', agedMs: 200000, thresholdMs: 90000 },
        identity,
      ).kind,
    ).toBe('blind');
  });

  it('treats a malformed heartbeat as blind (never silently passes)', () => {
    expect(
      classifyWatcherPresence(
        { kind: 'malformed', heartbeatFile: 'h.json', reason: 'bad json' },
        identity,
      ).kind,
    ).toBe('blind');
  });

  it('treats a just-armed (fresh mtime) matching not-yet-emitted watcher as present', () => {
    expect(
      classifyWatcherPresence(
        { kind: 'stale-no-emit', identity, emittedCount: 0, agedMs: 1000, thresholdMs: 90000 },
        identity,
      ),
    ).toEqual({ kind: 'present' });
  });

  it('treats a fresh not-yet-emitted watcher with a foreign identity as blind', () => {
    expect(
      classifyWatcherPresence(
        {
          kind: 'stale-no-emit',
          identity: foreign,
          emittedCount: 0,
          agedMs: 1000,
          thresholdMs: 90000,
        },
        identity,
      ).kind,
    ).toBe('blind');
  });

  it('treats a started-then-frozen (aged mtime) not-yet-emitted watcher as blind', () => {
    expect(
      classifyWatcherPresence(
        { kind: 'stale-no-emit', identity, emittedCount: 0, agedMs: 120000, thresholdMs: 90000 },
        identity,
      ).kind,
    ).toBe('blind');
  });

  it('treats the exact threshold (matching identity) as still present (boundary)', () => {
    expect(
      classifyWatcherPresence(
        { kind: 'stale-no-emit', identity, emittedCount: 0, agedMs: 90000, thresholdMs: 90000 },
        identity,
      ),
    ).toEqual({ kind: 'present' });
  });
});

describe('watcher path derivers', () => {
  it('composes a seen-file path from a codename and dir, tolerating a trailing slash', () => {
    expect(
      commsSeenFileForCodename('Seal hunts Offing', '.agent/state/collaboration/comms-seen'),
    ).toBe('.agent/state/collaboration/comms-seen/Seal hunts Offing.json');
    expect(
      commsSeenFileForCodename('Seal hunts Offing', '.agent/state/collaboration/comms-seen/'),
    ).toBe('.agent/state/collaboration/comms-seen/Seal hunts Offing.json');
  });

  it('rejects a codename that is not a safe path segment (separators / traversal / empty)', () => {
    const dir = '.agent/state/collaboration/comms-seen';
    expect(() => commsSeenFileForCodename('../escape', dir)).toThrow();
    expect(() => commsSeenFileForCodename('a/b', dir)).toThrow();
    expect(() => commsSeenFileForCodename('a\\b', dir)).toThrow();
    expect(() => commsSeenFileForCodename('', dir)).toThrow();
  });

  it('rejects an empty or root comms-seen dir (would derive a root-absolute path)', () => {
    expect(() => commsSeenFileForCodename('Seal hunts Offing', '')).toThrow();
    expect(() => commsSeenFileForCodename('Seal hunts Offing', '/')).toThrow();
  });

  it('appends a single .heartbeat.json suffix to a seen-file', () => {
    expect(
      heartbeatFileForSeen('.agent/state/collaboration/comms-seen/Seal hunts Offing.json'),
    ).toBe('.agent/state/collaboration/comms-seen/Seal hunts Offing.json.heartbeat.json');
  });
});
