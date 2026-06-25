/**
 * Covers the pure presence classifier and path derivers behind the F-95
 * comms-watcher-presence gate: `live` is present; `absent`/`stale-aged`/
 * `malformed` are blind; `stale-no-emit` is present only while its heartbeat
 * mtime is fresh (a just-armed watcher) and blind once it has aged out (a
 * started-then-frozen watcher). Derivers compose codename, seen-file, and
 * heartbeat path.
 */
import { describe, expect, it } from 'vitest';

import {
  classifyWatcherPresence,
  commsSeenFileForCodename,
  heartbeatFileForSeen,
} from '../../src/collaboration-state/watcher-presence';
import { type CollaborationAgentId } from '../../src/collaboration-state/types';

const identity: CollaborationAgentId = {
  agent_name: 'Seal hunts Offing',
  platform: 'claude',
  model: 'Opus 4.8',
  session_id_prefix: '8210d6',
};

describe('classifyWatcherPresence', () => {
  it('treats a live watcher as present', () => {
    expect(
      classifyWatcherPresence({ kind: 'live', identity, lastEmitAt: 'x', agedMs: 10 }),
    ).toEqual({ kind: 'present' });
  });

  it('treats an absent heartbeat as blind and names the missing path', () => {
    const verdict = classifyWatcherPresence({
      kind: 'absent',
      heartbeatFile: 'seen.json.heartbeat.json',
    });
    expect(verdict).toMatchObject({ kind: 'blind' });
    expect(JSON.stringify(verdict)).toContain('seen.json.heartbeat.json');
  });

  it('treats an aged heartbeat as blind', () => {
    expect(
      classifyWatcherPresence({
        kind: 'stale-aged',
        identity,
        lastEmitAt: 'x',
        agedMs: 200000,
        thresholdMs: 90000,
      }).kind,
    ).toBe('blind');
  });

  it('treats a malformed heartbeat as blind (never silently passes)', () => {
    expect(
      classifyWatcherPresence({ kind: 'malformed', heartbeatFile: 'h.json', reason: 'bad json' })
        .kind,
    ).toBe('blind');
  });

  it('treats a just-armed (fresh mtime) not-yet-emitted watcher as present', () => {
    expect(
      classifyWatcherPresence({
        kind: 'stale-no-emit',
        identity,
        emittedCount: 0,
        agedMs: 1000,
        thresholdMs: 90000,
      }),
    ).toEqual({ kind: 'present' });
  });

  it('treats a started-then-frozen (aged mtime) not-yet-emitted watcher as blind', () => {
    expect(
      classifyWatcherPresence({
        kind: 'stale-no-emit',
        identity,
        emittedCount: 0,
        agedMs: 120000,
        thresholdMs: 90000,
      }).kind,
    ).toBe('blind');
  });

  it('treats the exact threshold as still present (boundary)', () => {
    expect(
      classifyWatcherPresence({
        kind: 'stale-no-emit',
        identity,
        emittedCount: 0,
        agedMs: 90000,
        thresholdMs: 90000,
      }),
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

  it('appends a single .heartbeat.json suffix to a seen-file', () => {
    expect(
      heartbeatFileForSeen('.agent/state/collaboration/comms-seen/Seal hunts Offing.json'),
    ).toBe('.agent/state/collaboration/comms-seen/Seal hunts Offing.json.heartbeat.json');
  });
});
