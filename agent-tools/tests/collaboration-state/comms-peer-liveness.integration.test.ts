import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import { uuidV5Schema } from '../../src/collaboration-state/agent-id';
import { type CollaborationAgentId, type CommsEvent } from '../../src/collaboration-state/types';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

// Live peers carry an id (the write schema requires it); peer-liveness routes
// by id, so the fixtures must too (branded via the schema).
const pangolin: CollaborationAgentId = {
  agent_name: 'Pangolin weaves Nightfall',
  platform: 'claude',
  model: 'claude-opus-4-8',
  session_id_prefix: 'c680e4',
  id: uuidV5Schema.parse('11111111-1111-5111-9111-111111111111'),
};

const avocet: CollaborationAgentId = {
  agent_name: 'Avocet tracks Crag',
  platform: 'claude',
  model: 'claude-opus-4-8',
  session_id_prefix: '30fe5b',
  id: uuidV5Schema.parse('22222222-2222-5222-9222-222222222222'),
};

// A historical pre-PDR-076a row: id-less. Must be skipped, never throw.
const legacyIdless: CollaborationAgentId = {
  agent_name: 'Ancient Drifting Relic',
  platform: 'claude',
  model: 'claude-opus-4-7',
  session_id_prefix: 'aa0000',
};

const commsDir = 'state/comms';
const NOW = '2026-06-28T12:00:00Z';

function heartbeat(author: CollaborationAgentId, eventId: string, createdAt: string): CommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: eventId,
    created_at: createdAt,
    kind: 'narrative',
    author,
    title: `Heartbeat: ${author.agent_name}`,
    body: 'active; claim=x; intent=x; branch=b; cycle=c',
    tags: ['heartbeat'],
  };
}

describe('comms peer-liveness', () => {
  it('classifies peers from the heartbeat event stream, most-stale-first', async () => {
    const events: readonly CommsEvent[] = [
      // Pangolin: latest heartbeat 11 min before NOW → retired (the F-75 "fires" case).
      heartbeat(pangolin, 'pangolin-old', '2026-06-28T11:30:00Z'),
      heartbeat(pangolin, 'pangolin-latest', '2026-06-28T11:49:00Z'),
      // Avocet: 1 min before NOW → active.
      heartbeat(avocet, 'avocet-latest', '2026-06-28T11:59:00Z'),
      // A historical id-less heartbeat must be skipped, never throw or appear.
      heartbeat(legacyIdless, 'legacy-idless', '2026-06-28T11:55:00Z'),
      // A non-heartbeat narrative from a third agent must be ignored.
      {
        schema_version: '2.0.0',
        event_id: 'noise',
        created_at: '2026-06-28T11:58:00Z',
        kind: 'narrative',
        author: avocet,
        title: 'not a heartbeat',
        body: 'prose',
      },
    ];
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: events } });

    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'peer-liveness', '--comms-dir', commsDir, '--now', NOW],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    const lines = result.stdout.trimEnd().split('\n');
    expect(lines[0]).toBe(
      'comms peer-liveness — 2 peer(s) with heartbeats, most stale first ' +
        '(PDR-078: active <4m / offline 4-10m / retired >=10m)',
    );
    // Most-stale-first: Pangolin (retired) leads, classified off its LATEST heartbeat.
    expect(lines[1]).toContain('retired');
    expect(lines[1]).toContain('Pangolin weaves Nightfall/c680e4');
    expect(lines[1]).toContain('last_heartbeat=2026-06-28T11:49:00Z');
    expect(lines[2]).toContain('active');
    expect(lines[2]).toContain('Avocet tracks Crag/30fe5b');
    // The id-less historical row is skipped (PDR-076a: not a live peer).
    expect(result.stdout).not.toContain('Ancient Drifting Relic');
  });

  it('reports no peer heartbeats when the stream has none', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: [] } });

    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'peer-liveness', '--comms-dir', commsDir, '--now', NOW],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('no peer heartbeats found\n');
  });

  it('rejects a malformed --now with a clear error', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: [] } });

    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'peer-liveness', '--comms-dir', commsDir, '--now', 'not-a-date'],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('--now must be an ISO-8601 timestamp (got: not-a-date)');
  });
});
