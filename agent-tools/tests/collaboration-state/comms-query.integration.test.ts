import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import { type CommsEvent } from '../../src/collaboration-state/types';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

// Read-side fixtures: `id` is optional on the read CollaborationAgentId and the
// projection only reads agent_name / session_id_prefix, so it is omitted here.
const alice = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude',
  model: 'claude-opus-4-8',
  session_id_prefix: '5c8f3c',
} as const;

const bob = {
  agent_name: 'Galactic Transiting Orbit',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e18',
} as const;

const commsDir = 'state/comms';

// created_at deliberately out of event_id order so the test proves the command
// sorts by created_at (newest first), not by the directory read order.
const events: readonly CommsEvent[] = [
  {
    schema_version: '2.0.0',
    event_id: 'event-oldest',
    created_at: '2026-06-04T10:00:00Z',
    kind: 'narrative',
    author: alice,
    title: 'Oldest broadcast',
    body: 'first body',
  },
  {
    schema_version: '2.0.0',
    event_id: 'event-middle',
    created_at: '2026-06-04T11:00:00Z',
    kind: 'narrative',
    author: alice,
    title: 'Heartbeat-tagged middle',
    body: 'middle body',
    tags: ['heartbeat'],
  },
  {
    schema_version: '2.0.0',
    event_id: 'event-newest',
    created_at: '2026-06-04T12:00:00Z',
    kind: 'directed',
    message_kind: 'mid-cycle-handoff',
    from: bob,
    to: alice,
    subject: 'Newest directed message',
    body: 'directed body with detail',
  },
];

describe('comms list', () => {
  it('projects newest-first summary lines with event ids, kinds, tags, and titles', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: events } });
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'list', '--comms-dir', commsDir],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    const lines = result.stdout.trimEnd().split('\n');
    expect(lines[0]).toBe('comms list — newest 3 of 3 event(s), most recent first');
    expect(lines[1]).toContain('event-newest');
    expect(lines[1]).toContain('[directed]');
    expect(lines[1]).toContain('Galactic Transiting Orbit/019e18');
    expect(lines[1]).toContain('Newest directed message');
    expect(lines[2]).toContain('event-middle');
    expect(lines[2]).toContain('[narrative] [heartbeat]');
    expect(lines[3]).toContain('event-oldest');
  });

  it('limits output to the requested --tail count, newest first', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: events } });
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'list', '--comms-dir', commsDir, '--tail', '1'],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    const lines = result.stdout.trimEnd().split('\n');
    expect(lines[0]).toBe('comms list — newest 1 of 3 event(s), most recent first');
    expect(lines).toHaveLength(2);
    expect(lines[1]).toContain('event-newest');
    expect(result.stdout).not.toContain('event-oldest');
  });

  it('reports no events when the directory is empty', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: [] } });
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'list', '--comms-dir', commsDir],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('no comms events\n');
  });

  it('rejects a non-positive --tail with a clear error', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: events } });
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'list', '--comms-dir', commsDir, '--tail', '0'],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('--tail must be a positive integer (got: 0)');
  });
});

describe('comms show', () => {
  it('prints the full canonical JSON event including its body', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: events } });
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'show', '--comms-dir', commsDir, '--event-id', 'event-newest'],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain('"event_id": "event-newest"');
    expect(result.stdout).toContain('"body": "directed body with detail"');
    expect(result.stdout).toContain('"subject": "Newest directed message"');
  });

  it('fails non-zero with a clear error for an unknown event id', async () => {
    const fake = createFakeCollaborationRuntime({ comms: { [commsDir]: events } });
    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'show', '--comms-dir', commsDir, '--event-id', 'nope'],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('comms event not found: nope');
  });
});
