import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

// F-77 — `comms append` / `comms send` accept `--in-response-to <event-id>`,
// setting the `in_response_to` threading edge on the narrative event (the
// machine-readable edge a PDR-064 Moment-2 broadcast acknowledgement needs;
// `comms reply` only resolves directed events).

const sender = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
} as const;

// Derived via the same code path the CLI uses, so the strict-equal assertion
// stays honest without coupling the test to the namespace-version constant.
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

describe('collaboration-state comms append --in-response-to (F-77)', () => {
  it('threads a narrative append to an antecedent event via --in-response-to', async () => {
    const commsDir = 'state/comms';
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        commsDir,
        '--now',
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Coordinator role acknowledgement',
        '--body',
        'Moment 2 ack referencing the Moment 1 pre-position.',
        '--in-response-to',
        'prepos-event-1',
        '--event-id',
        'ack-event',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'ack-event',
        created_at: '2026-05-24T10:18:00Z',
        kind: 'narrative',
        author: senderWithId,
        title: 'Coordinator role acknowledgement',
        body: 'Moment 2 ack referencing the Moment 1 pre-position.',
        in_response_to: 'prepos-event-1',
      },
    ]);
  });

  it('composes --in-response-to with an ADR-183 --tag on the same append', async () => {
    const commsDir = 'state/comms';
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        commsDir,
        '--now',
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Behaviour note replying to a broadcast',
        '--body',
        'Threaded behaviour note.',
        '--in-response-to',
        'broadcast-1',
        '--tag',
        'behaviour-note',
        '--event-id',
        'threaded-tagged',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'threaded-tagged',
        created_at: '2026-05-24T10:18:00Z',
        kind: 'narrative',
        author: senderWithId,
        title: 'Behaviour note replying to a broadcast',
        body: 'Threaded behaviour note.',
        in_response_to: 'broadcast-1',
        tags: ['behaviour-note'],
      },
    ]);
  });

  it('threads via the comms send wrapper too (--in-response-to mirrors append)', async () => {
    const commsDir = 'state/comms';
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'send',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        commsDir,
        '--now',
        '2026-05-24T10:18:00Z',
        '--title',
        'Acknowledgement via send',
        '--body',
        'Send-path threaded ack.',
        '--in-response-to',
        'antecedent-2',
        '--event-id',
        'send-ack',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: senderEnv,
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'send-ack',
        created_at: '2026-05-24T10:18:00Z',
        kind: 'narrative',
        author: senderWithId,
        title: 'Acknowledgement via send',
        body: 'Send-path threaded ack.',
        in_response_to: 'antecedent-2',
      },
    ]);
  });
});
