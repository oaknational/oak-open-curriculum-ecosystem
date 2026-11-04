/**
 * Covers the pure presence classifier and path derivers behind the F-95
 * comms-watcher-presence gate: `live`/fresh-`stale-no-emit` are present ONLY
 * when the heartbeat identity matches this session (a foreign or copied
 * heartbeat does not count); `absent`/`stale-aged`/`malformed` and an aged
 * `stale-no-emit` are blind. Derivers compose codename, seen-file, and
 * heartbeat path and reject unsafe segments / a root dir.
 */
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  classifyWatcherPresence,
  commsSeenFileForCodename,
  heartbeatFileForSeen,
} from '../../src/collaboration-state/watcher-presence';
import { deriveOverrideCollaborationIdentity } from '../../src/collaboration-state/identity';
import { uuidV5Schema } from '../../src/collaboration-state/agent-id';
import { type CollaborationAgentId } from '../../src/collaboration-state/types';

// Derived identities carry valid branded ids without hand-picked literals;
// distinct names give distinct routing keys so the identity-match path is
// exercised both ways. Tests needing a VISIBLE id tail parse literals inline.
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

const EXPECTED_COMMS_DIR = '/coordination/.agent/state/collaboration/comms';

describe('classifyWatcherPresence', () => {
  it('treats a live watcher whose identity matches this session as present', () => {
    expect(
      classifyWatcherPresence(
        {
          kind: 'live',
          identity,
          watchedCommsDir: EXPECTED_COMMS_DIR,
          lastEmitAt: 'x',
          agedMs: 10,
        },
        identity,
        EXPECTED_COMMS_DIR,
      ),
    ).toEqual({ kind: 'present' });
  });

  it('treats a matching live identity that watches a different comms source as blind', () => {
    const verdict = classifyWatcherPresence(
      {
        kind: 'live',
        identity,
        watchedCommsDir: '/decoy/.agent/state/collaboration/comms',
        lastEmitAt: 'x',
        agedMs: 10,
      },
      identity,
      EXPECTED_COMMS_DIR,
    );
    expect(verdict).toMatchObject({ kind: 'blind' });
    expect(JSON.stringify(verdict)).toContain('different comms source');
  });

  it('treats a trailing separator as the same absolute comms source', () => {
    expect(
      classifyWatcherPresence(
        {
          kind: 'live',
          identity,
          watchedCommsDir: `${EXPECTED_COMMS_DIR}/`,
          lastEmitAt: 'x',
          agedMs: 10,
        },
        identity,
        EXPECTED_COMMS_DIR,
      ),
    ).toEqual({ kind: 'present' });
  });

  it('treats a live watcher whose identity does NOT match this session as blind', () => {
    const verdict = classifyWatcherPresence(
      {
        kind: 'live',
        identity: foreign,
        watchedCommsDir: EXPECTED_COMMS_DIR,
        lastEmitAt: 'x',
        agedMs: 10,
      },
      identity,
      EXPECTED_COMMS_DIR,
    );
    expect(verdict).toMatchObject({ kind: 'blind' });
    expect(JSON.stringify(verdict)).toContain('not this session');
  });

  // A literal branded id (not a derived one) so the expected token tail is
  // visible in the fixture itself: the blind reason names the foreign identity
  // with the MCP-145 display token (prefix-idTail).
  it('names a foreign id-bearing identity with the display token in the blind reason', () => {
    const foreignWithId: CollaborationAgentId = {
      agent_name: 'Woodland Creeping Petal',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019dd3',
      id: uuidV5Schema.parse('88888888-8888-5888-9888-888888888abc'),
    };
    const verdict = classifyWatcherPresence(
      {
        kind: 'live',
        identity: foreignWithId,
        watchedCommsDir: EXPECTED_COMMS_DIR,
        lastEmitAt: 'x',
        agedMs: 10,
      },
      identity,
      EXPECTED_COMMS_DIR,
    );
    expect(verdict).toMatchObject({ kind: 'blind' });
    expect(JSON.stringify(verdict)).toContain('(Woodland Creeping Petal / 019dd3-abc)');
  });

  // An id-less heartbeat identity still reaches the blind branch (the routing
  // key cannot match without an id) and its reason renders the bare prefix —
  // the display token's structural fallback.
  it('names an id-less foreign identity with the bare prefix in the blind reason', () => {
    const foreignIdless: CollaborationAgentId = {
      agent_name: 'Ancient Drifting Relic',
      platform: 'claude',
      model: 'claude-opus-4-7',
      session_id_prefix: 'aa0000',
    };
    const verdict = classifyWatcherPresence(
      {
        kind: 'live',
        identity: foreignIdless,
        watchedCommsDir: EXPECTED_COMMS_DIR,
        lastEmitAt: 'x',
        agedMs: 10,
      },
      identity,
      EXPECTED_COMMS_DIR,
    );
    expect(verdict).toMatchObject({ kind: 'blind' });
    expect(JSON.stringify(verdict)).toContain('(Ancient Drifting Relic / aa0000)');
    expect(JSON.stringify(verdict)).not.toContain('aa0000-');
  });

  it('treats an absent heartbeat as blind and names the missing path', () => {
    const verdict = classifyWatcherPresence(
      { kind: 'absent', heartbeatFile: 'seen.json.heartbeat.json' },
      identity,
      EXPECTED_COMMS_DIR,
    );
    expect(verdict).toMatchObject({ kind: 'blind' });
    expect(JSON.stringify(verdict)).toContain('seen.json.heartbeat.json');
  });

  it('treats an aged heartbeat as blind', () => {
    expect(
      classifyWatcherPresence(
        {
          kind: 'stale-aged',
          identity,
          watchedCommsDir: EXPECTED_COMMS_DIR,
          lastEmitAt: 'x',
          agedMs: 200000,
          thresholdMs: 90000,
        },
        identity,
        EXPECTED_COMMS_DIR,
      ).kind,
    ).toBe('blind');
  });

  it('treats a malformed heartbeat as blind (never silently passes)', () => {
    expect(
      classifyWatcherPresence(
        { kind: 'malformed', heartbeatFile: 'h.json', reason: 'bad json' },
        identity,
        EXPECTED_COMMS_DIR,
      ).kind,
    ).toBe('blind');
  });

  it('treats a just-armed (fresh mtime) matching not-yet-emitted watcher as present', () => {
    expect(
      classifyWatcherPresence(
        {
          kind: 'stale-no-emit',
          identity,
          watchedCommsDir: EXPECTED_COMMS_DIR,
          emittedCount: 0,
          agedMs: 1000,
          thresholdMs: 90000,
        },
        identity,
        EXPECTED_COMMS_DIR,
      ),
    ).toEqual({ kind: 'present' });
  });

  it('treats a fresh not-yet-emitted watcher with a foreign identity as blind', () => {
    expect(
      classifyWatcherPresence(
        {
          kind: 'stale-no-emit',
          identity: foreign,
          watchedCommsDir: EXPECTED_COMMS_DIR,
          emittedCount: 0,
          agedMs: 1000,
          thresholdMs: 90000,
        },
        identity,
        EXPECTED_COMMS_DIR,
      ).kind,
    ).toBe('blind');
  });

  it('treats a fresh matching not-yet-emitted watcher on a decoy source as blind', () => {
    const verdict = classifyWatcherPresence(
      {
        kind: 'stale-no-emit',
        identity,
        watchedCommsDir: '/decoy/.agent/state/collaboration/comms',
        emittedCount: 0,
        agedMs: 1000,
        thresholdMs: 90000,
      },
      identity,
      EXPECTED_COMMS_DIR,
    );
    expect(verdict).toMatchObject({ kind: 'blind' });
    expect(JSON.stringify(verdict)).toContain('different comms source');
  });

  it('treats a started-then-frozen (aged mtime) not-yet-emitted watcher as blind', () => {
    expect(
      classifyWatcherPresence(
        {
          kind: 'stale-no-emit',
          identity,
          watchedCommsDir: EXPECTED_COMMS_DIR,
          emittedCount: 0,
          agedMs: 120000,
          thresholdMs: 90000,
        },
        identity,
        EXPECTED_COMMS_DIR,
      ).kind,
    ).toBe('blind');
  });

  it('treats the exact threshold (matching identity) as still present (boundary)', () => {
    expect(
      classifyWatcherPresence(
        {
          kind: 'stale-no-emit',
          identity,
          watchedCommsDir: EXPECTED_COMMS_DIR,
          emittedCount: 0,
          agedMs: 90000,
          thresholdMs: 90000,
        },
        identity,
        EXPECTED_COMMS_DIR,
      ),
    ).toEqual({ kind: 'present' });
  });
});

describe('watcher path derivers', () => {
  it('composes a host-joined seen-file path from a codename and dir, tolerating a trailing separator of either flavour', () => {
    const expected = join('.agent/state/collaboration/comms-seen', 'Seal hunts Offing.json');
    expect(
      commsSeenFileForCodename('Seal hunts Offing', '.agent/state/collaboration/comms-seen'),
    ).toBe(expected);
    expect(
      commsSeenFileForCodename('Seal hunts Offing', '.agent/state/collaboration/comms-seen/'),
    ).toBe(expected);
    expect(
      commsSeenFileForCodename('Seal hunts Offing', '.agent/state/collaboration/comms-seen\\'),
    ).toBe(expected);
  });

  it('rejects a codename that is not a safe path segment (separators / traversal / empty)', () => {
    const dir = '.agent/state/collaboration/comms-seen';
    expect(() => commsSeenFileForCodename('../escape', dir)).toThrow();
    expect(() => commsSeenFileForCodename('a/b', dir)).toThrow();
    expect(() => commsSeenFileForCodename(String.raw`a\b`, dir)).toThrow();
    expect(() => commsSeenFileForCodename('', dir)).toThrow();
  });

  // The win32 rows are the regression: the guard used to trim first and then
  // test for emptiness, which catches `/` but leaves `C:\` as `C:` — a
  // drive-RELATIVE prefix that `join` resolves against the current directory
  // on that drive. The heartbeat then landed somewhere unpredictable while
  // the error message claimed roots were refused.
  it.each([
    { label: 'empty', dir: '' },
    { label: 'the posix root', dir: '/' },
    { label: 'repeated posix separators', dir: '///' },
    // Quoted escapes, not String.raw: a raw template cannot end in a single
    // backslash — it escapes the closing backtick.
    { label: 'a windows drive root', dir: 'C:\\' },
    { label: 'a windows drive root in forward-slash form', dir: 'C:/' },
    { label: 'a lower-case drive root', dir: 'c:\\' },
    { label: 'a bare drive designator', dir: 'C:' },
    { label: 'a UNC share root', dir: '\\\\server\\share\\' },
    { label: 'an extended-length UNC share root', dir: '\\\\?\\UNC\\server\\share\\' },
  ])('rejects $label as a comms-seen dir (would derive a root-absolute path)', ({ dir }) => {
    expect(() => commsSeenFileForCodename('Seal hunts Offing', dir)).toThrow(
      /not the filesystem root/u,
    );
  });

  it('appends a single .heartbeat.json suffix to a seen-file', () => {
    expect(
      heartbeatFileForSeen('.agent/state/collaboration/comms-seen/Seal hunts Offing.json'),
    ).toBe('.agent/state/collaboration/comms-seen/Seal hunts Offing.json.heartbeat.json');
  });
});
