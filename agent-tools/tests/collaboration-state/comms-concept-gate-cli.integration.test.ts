import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

/**
 * CLI-level behaviour of the comms concept gate (owner-ratified 2026-07-02)
 * across all three write surfaces: a PDR-044 trip-list phrase in a title,
 * subject, or body refuses the write with a non-zero exit and the teaching
 * payload, and NO event file is written; tagged capture events are exempt
 * (recursive exclusion); heartbeat-composed bodies are gated uniformly.
 * The gate blocks arrive through the injected runtime io (fixture blocks:
 * one literal hedging pattern, one word-bounded deferral regex), so these
 * tests never couple to the live `.agent/hooks/policy.json` content.
 */

const sender = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
} as const;

const senderWithId = deriveCollaborationIdentity({
  platform: sender.platform,
  model: sender.model,
  env: {
    PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
    PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
  },
}).agentId;

const senderEnv = {
  PRACTICE_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
  PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
};

const COMMS_DIR = 'state/comms';

function appendArgv(input: { title: string; body: string; tags?: readonly string[] }): string[] {
  const tagArgs = (input.tags ?? []).flatMap((tag) => ['--tag', tag]);
  return [
    '--',
    'comms',
    'append',
    '--active',
    'state/active-claims.json',
    '--comms-dir',
    COMMS_DIR,
    '--now',
    '2026-07-02T08:00:00Z',
    '--created-at',
    '2026-07-02T08:00:00Z',
    '--title',
    input.title,
    '--body',
    input.body,
    ...tagArgs,
    '--platform',
    sender.platform,
    '--model',
    sender.model,
  ];
}

describe('comms concept gate at the CLI write surfaces', () => {
  it('refuses `comms append` whose body trips a gated concept — teaching payload, no event written', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: appendArgv({ title: 'coordination', body: 'proposing a carve-out for the trio' }),
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('fires the expediency-hedging block');
    expect(result.stderr).toContain('Citation:');
    expect(result.stderr).toContain('Reappraisal:');
    expect(fake.readCommsEvents(COMMS_DIR)).toStrictEqual([]);
  });

  it('writes `comms append` for the same body under a capture tag (recursive exclusion)', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: appendArgv({
        title: 'correction capture',
        body: 'stop writing carve-out in coordination events',
        tags: ['failure-mode'],
      }),
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(COMMS_DIR)).toHaveLength(1);
  });

  it('refuses a heartbeat-composed append whose cycle label trips the deferral family', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        COMMS_DIR,
        '--now',
        '2026-07-02T08:00:00Z',
        '--created-at',
        '2026-07-02T08:00:00Z',
        '--title',
        'Heartbeat: Wooded Spreading Thicket (5c8f3c) — lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-1',
        '--intent-id',
        'intent-1',
        '--branch',
        'feat/x',
        '--current-cycle-label',
        'parked until next week',
        '--platform',
        sender.platform,
        '--model',
        sender.model,
      ],
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('fires the indefinite-deferral block');
    expect(fake.readCommsEvents(COMMS_DIR)).toStrictEqual([]);
  });

  it('refuses `comms direct` whose subject trips a gated concept — no event written', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'direct',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        COMMS_DIR,
        '--now',
        '2026-07-02T08:00:00Z',
        '--kind',
        'coordination',
        '--to-agent-name',
        sender.agent_name,
        '--to-id',
        senderWithId.id,
        '--to-platform',
        sender.platform,
        '--to-model',
        sender.model,
        '--to-session-prefix',
        sender.session_id_prefix,
        '--subject',
        'carve-out granted',
        '--body',
        'clean body',
        '--platform',
        sender.platform,
        '--model',
        sender.model,
      ],
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('fires the expediency-hedging block');
    expect(fake.readCommsEvents(COMMS_DIR)).toStrictEqual([]);
  });

  it('refuses an untagged `comms reply` inheriting a pathogen-quoting subject, and writes it under a capture tag (--tag on reply)', async () => {
    const sourceEvent = {
      schema_version: '2.0.0',
      event_id: 'capture-1',
      created_at: '2026-07-02T07:59:00Z',
      kind: 'directed',
      message_kind: 'failure-mode-capture',
      from: senderWithId,
      to: senderWithId,
      subject: 'stop writing carve-out in coordination events',
      body: 'capture body',
      tags: ['failure-mode'],
    } as const;

    const replyArgv = (tags: readonly string[]): string[] => [
      '--',
      'comms',
      'reply',
      '--active',
      'state/active-claims.json',
      '--comms-dir',
      COMMS_DIR,
      '--now',
      '2026-07-02T08:00:00Z',
      '--to-event-id',
      'capture-1',
      '--kind',
      'ack',
      '--body',
      'acknowledged, vocabulary corrected on my side',
      ...tags.flatMap((tag) => ['--tag', tag]),
      '--platform',
      sender.platform,
      '--model',
      sender.model,
    ];

    const refusedFake = createFakeCollaborationRuntime();
    refusedFake.writeCommsEvent(COMMS_DIR, sourceEvent);
    const refused = await runCollaborationStateCli({
      argv: replyArgv([]),
      env: senderEnv,
      io: refusedFake.runtime.io,
    });

    // The inherited "re: <subject>" quotes the pathogen; untagged, the gate
    // refuses — and the cure it names (tag the event) is executable because
    // reply accepts --tag.
    expect(refused.exitCode).toBe(2);
    expect(refused.stderr).toContain('fires the expediency-hedging block');
    expect(refusedFake.readCommsEvents(COMMS_DIR)).toHaveLength(1);

    const taggedFake = createFakeCollaborationRuntime();
    taggedFake.writeCommsEvent(COMMS_DIR, sourceEvent);
    const written = await runCollaborationStateCli({
      argv: replyArgv(['behaviour-note']),
      env: senderEnv,
      io: taggedFake.runtime.io,
    });

    expect(written.exitCode).toBe(0);
    expect(taggedFake.readCommsEvents(COMMS_DIR)).toHaveLength(2);
  });
});
