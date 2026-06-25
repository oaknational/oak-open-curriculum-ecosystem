/**
 * Integration coverage for `comms assert-watcher-live` (F-95 Option A) through
 * the real CLI dispatcher and real filesystem: a fresh heartbeat at the
 * session-derived path passes (exit 0); an absent heartbeat fails loud (exit 2
 * with a move-1 fix instruction); a `--now` far in the future makes a present
 * heartbeat read as stale (exit 2); and `--heartbeat-file` relocates the check.
 */
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';

const codename = 'Seal hunts Offing';

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
    watcher_identity: {
      agent_name: codename,
      platform: 'claude',
      model: 'Opus 4.8',
      session_id_prefix: '8210d6',
      id: 'd9d4eec5-06e9-5088-83de-5b129874810a',
      naming_schema_version: 'override',
    },
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
        '--comms-seen-dir',
        dir,
      ],
      env: {},
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('no comms watcher heartbeat');
    expect(result.stderr).toContain('start-right-team move 1');
  });

  it('exits non-zero when the heartbeat has aged out (a future --now)', async () => {
    await writeHeartbeat('2026-06-25T08:00:00.000Z');

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'assert-watcher-live',
        '--agent-name',
        codename,
        '--comms-seen-dir',
        dir,
        '--now',
        '2099-01-01T00:00:00.000Z',
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
        '--heartbeat-file',
        explicit,
      ],
      env: {},
    });

    expect(result.exitCode).toBe(0);
  });

  it('fails loud on a malformed --now rather than silently weakening the check', async () => {
    await writeHeartbeat('2026-06-25T08:00:00.000Z');

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'assert-watcher-live',
        '--agent-name',
        codename,
        '--comms-seen-dir',
        dir,
        '--now',
        'not-a-date',
      ],
      env: {},
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('valid ISO-8601');
  });
});
