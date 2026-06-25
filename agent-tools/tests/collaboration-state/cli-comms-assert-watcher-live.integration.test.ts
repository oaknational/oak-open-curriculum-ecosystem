/**
 * Integration coverage for `comms assert-watcher-live` (F-95 Option A) through
 * the real CLI dispatcher and real filesystem: a fresh heartbeat at the
 * session-derived path passes (exit 0); an absent heartbeat fails loud (exit 2
 * with a move-1 fix instruction); a heartbeat whose file mtime has aged past
 * the threshold (forced with `utimes`, judged against the real wall clock)
 * fails (exit 2); and `--heartbeat-file` relocates the check. Freshness is never
 * controlled by a `--now` flag — the command has none.
 */
import { mkdtemp, rm, utimes, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import { deriveOverrideCollaborationIdentity } from '../../src/collaboration-state/identity';

const codename = 'Seal hunts Offing';
const sessionPrefix = '8210d6';

// The session is invoked with `--agent-name <codename> --session-prefix <p>`, so
// the handler resolves THIS identity. The heartbeat's watcher_identity must equal
// it or the F-95 gate (now identity-bound) treats a fresh heartbeat as a foreign
// watcher and blinds. A non-empty prefix is required — the heartbeat schema
// rejects an empty session_id_prefix.
const sessionIdentity = deriveOverrideCollaborationIdentity({
  agent_name: codename,
  platform: 'override',
  model: 'override',
  session_id_prefix: sessionPrefix,
});

function heartbeatJson(lastEmitAt: string | null): string {
  return JSON.stringify({
    schema_version: '0.1.0',
    pid: 4242,
    started_at: '2026-06-25T08:00:00.000Z',
    last_drain_at: lastEmitAt,
    last_emit_at: lastEmitAt,
    last_error_at: null,
    emitted_count: lastEmitAt === null ? 0 : 3,
    heartbeat_interval_ms: 30000,
    watcher_identity: sessionIdentity,
  });
}

describe('comms assert-watcher-live', () => {
  let dir = '';

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'assert-watcher-live-'));
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  async function writeHeartbeat(lastEmitAt: string | null): Promise<void> {
    await writeFile(
      join(dir, `${codename}.json.heartbeat.json`),
      heartbeatJson(lastEmitAt),
      'utf8',
    );
  }

  it('exits 0 when a fresh heartbeat exists at the session-derived path', async () => {
    await writeHeartbeat('2026-06-25T08:00:00.000Z');

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'assert-watcher-live',
        '--agent-name',
        codename,
        '--session-prefix',
        sessionPrefix,
        '--comms-seen-dir',
        dir,
      ],
      env: {},
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain(`comms watcher live for ${codename}`);
  });

  it('exits non-zero with a move-1 fix instruction when no heartbeat exists', async () => {
    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'assert-watcher-live',
        '--agent-name',
        codename,
        '--session-prefix',
        sessionPrefix,
        '--comms-seen-dir',
        dir,
      ],
      env: {},
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('no comms watcher heartbeat');
    expect(result.stderr).toContain('start-right-team move 1');
  });

  it('exits non-zero when the heartbeat file mtime has aged out (real wall clock)', async () => {
    await writeHeartbeat('2026-06-25T08:00:00.000Z');
    // Age the file far past 3x the interval against the real clock — no --now to
    // fake: freshness is judged on the wall clock, so a genuinely old mtime is
    // the only way to be stale.
    const longAgo = new Date('2020-01-01T00:00:00.000Z');
    await utimes(join(dir, `${codename}.json.heartbeat.json`), longAgo, longAgo);

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'assert-watcher-live',
        '--agent-name',
        codename,
        '--session-prefix',
        sessionPrefix,
        '--comms-seen-dir',
        dir,
      ],
      env: {},
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('aged out');
  });

  it('honours an explicit --heartbeat-file override', async () => {
    const explicit = join(dir, 'relocated.heartbeat.json');
    await writeFile(explicit, heartbeatJson('2026-06-25T08:00:00.000Z'), 'utf8');

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'assert-watcher-live',
        '--agent-name',
        codename,
        '--session-prefix',
        sessionPrefix,
        '--heartbeat-file',
        explicit,
      ],
      env: {},
    });

    expect(result.exitCode).toBe(0);
  });
});
