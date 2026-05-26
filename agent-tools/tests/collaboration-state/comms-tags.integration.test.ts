import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import { type CommsEvent } from '../../src/collaboration-state/types';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

const recipient = {
  agent_name: 'Galactic Transiting Orbit',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e18',
} as const;

const sender = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
} as const;

// Identity emitted by the CLI under the env wiring used in the tests below
// (PRACTICE_AGENT_SESSION_ID_CLAUDE seed + OAK_AGENT_IDENTITY_OVERRIDE name).
// Deriving via the same code path the CLI uses keeps the strict-equal
// assertion honest without coupling the test to the v5 namespace constant.
const senderWithId = deriveCollaborationIdentity({
  platform: sender.platform,
  model: sender.model,
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
    PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
  },
}).agentId;

const recipientCodexThreadId = '019e1867-a0a8-7c11-aae3-1bc48533a585';
const recipientWithId = deriveCollaborationIdentity({
  platform: recipient.platform,
  model: recipient.model,
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: recipient.agent_name,
    CODEX_THREAD_ID: recipientCodexThreadId,
  },
}).agentId;

describe('collaboration-state comms --tag flag (ADR-183)', () => {
  it('attaches ADR-183 tags to a directed event via repeated --tag flags', async () => {
    const commsDir = 'state/comms';
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'direct',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        commsDir,
        '--to-agent-name',
        recipientWithId.agent_name,
        '--to-id',
        recipientWithId.id,
        '--to-platform',
        recipientWithId.platform,
        '--to-model',
        recipientWithId.model,
        '--to-session-prefix',
        recipientWithId.session_id_prefix,
        '--kind',
        'coordination-request',
        '--subject',
        'Tag bearing message',
        '--body',
        'Important behaviour-note attached.',
        '--tag',
        'behaviour-note',
        '--event-id',
        'message-tagged',
        '--now',
        '2026-05-24T10:18:00Z',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      directedMessage({
        event_id: 'message-tagged',
        created_at: '2026-05-24T10:18:00Z',
        from: senderWithId,
        to: recipientWithId,
        subject: 'Tag bearing message',
        body: 'Important behaviour-note attached.',
        tags: ['behaviour-note'],
      }),
    ]);
  });

  it('rejects --tag values outside the ADR-183 namespace with a precise error', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'direct',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        'state/comms',
        '--to-agent-name',
        recipientWithId.agent_name,
        '--to-id',
        recipientWithId.id,
        '--to-platform',
        recipientWithId.platform,
        '--to-model',
        recipientWithId.model,
        '--to-session-prefix',
        recipientWithId.session_id_prefix,
        '--kind',
        'coordination-request',
        '--subject',
        'Mystery tag',
        '--body',
        'will not land',
        '--tag',
        'mystery-tag',
        '--event-id',
        'message-mystery',
        '--now',
        '2026-05-24T10:18:00Z',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/unknown comms event tag.*mystery-tag/);
  });

  it('rejects --body argv on a heartbeat-tagged append (Lane A — PDR-078 §5 typed-origin)', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        'state/comms',
        '--now',
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--body',
        'active; free-form prose, not allowed for heartbeat',
        '--tag',
        'heartbeat',
        '--event-id',
        'message-heartbeat-rejected',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/heartbeat.*--body.*rejected/);
    expect(result.stderr).toMatch(/--claim-id.*--intent-id.*--branch.*--current-cycle-label/);
  });

  it('rejects --body-file argv on a heartbeat-tagged append (typed-origin guard)', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        'state/comms',
        '--now',
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--body-file',
        'state/never-read.txt',
        '--tag',
        'heartbeat',
        '--event-id',
        'message-heartbeat-rejected-file',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/heartbeat.*--body-file.*rejected/);
  });

  it('rejects a heartbeat-tagged append with no typed state args (cure-naming error)', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        'state/comms',
        '--now',
        '2026-05-24T10:18:00Z',
        '--created-at',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--event-id',
        'message-heartbeat-missing-state',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toMatch(/heartbeat.*typed state args/);
    expect(result.stderr).toMatch(/--claim-id/);
    expect(result.stderr).toMatch(/--intent-id/);
    expect(result.stderr).toMatch(/--branch/);
    expect(result.stderr).toMatch(/--current-cycle-label/);
  });

  it('composes the heartbeat body from typed state args via comms append --tag heartbeat', async () => {
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
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-7c3f',
        '--intent-id',
        'lane-test',
        '--branch',
        'docs/test-branch',
        '--current-cycle-label',
        'test-cycle',
        '--event-id',
        'message-heartbeat-composed',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'message-heartbeat-composed',
        created_at: '2026-05-24T10:18:00Z',
        kind: 'narrative',
        author: senderWithId,
        title: 'Heartbeat: Test Agent — Test lane',
        body: 'active; claim=claim-7c3f; intent=lane-test; branch=docs/test-branch; cycle=test-cycle',
        tags: ['heartbeat'],
      },
    ]);
  });

  it('composes the heartbeat body via comms send --tag heartbeat (mirrors append path)', async () => {
    const commsDir = 'state/comms';
    const sharedLogPath = 'state/shared-log.md';
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
        '--output',
        sharedLogPath,
        '--now',
        '2026-05-24T10:18:00Z',
        '--title',
        'Heartbeat: Test Agent — Test lane',
        '--tag',
        'heartbeat',
        '--claim-id',
        'claim-send',
        '--intent-id',
        'lane-send',
        '--branch',
        'docs/send-branch',
        '--current-cycle-label',
        'send-cycle',
        '--event-id',
        'message-heartbeat-send',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'message-heartbeat-send',
        created_at: '2026-05-24T10:18:00Z',
        kind: 'narrative',
        author: senderWithId,
        title: 'Heartbeat: Test Agent — Test lane',
        body: 'active; claim=claim-send; intent=lane-send; branch=docs/send-branch; cycle=send-cycle',
        tags: ['heartbeat'],
      },
    ]);
  });

  it('attaches ADR-183 tags to a narrative event via comms send --tag', async () => {
    const commsDir = 'state/comms';
    const sharedLogPath = 'state/shared-log.md';
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
        '--output',
        sharedLogPath,
        '--now',
        '2026-05-24T10:18:00Z',
        '--title',
        'Failure mode observed',
        '--body',
        'Concrete failure-mode narrative body.',
        '--tag',
        'failure-mode',
        '--event-id',
        'message-failure',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'message-failure',
        created_at: '2026-05-24T10:18:00Z',
        kind: 'narrative',
        author: senderWithId,
        title: 'Failure mode observed',
        body: 'Concrete failure-mode narrative body.',
        tags: ['failure-mode'],
      },
    ]);
  });
});

describe('collaboration-state comms --body length gate (B2 / plan §B2)', () => {
  const longBody = 'a'.repeat(1501);

  it('rejects `comms append --body` over 1500 chars with a non-zero exit and cure-naming error', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'append',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        'state/comms',
        '--now',
        '2026-05-26T07:00:00Z',
        '--created-at',
        '2026-05-26T07:00:00Z',
        '--title',
        'Append over limit',
        '--body',
        longBody,
        '--event-id',
        'append-over-limit',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('1501');
    expect(result.stderr).toContain('1500');
    expect(result.stderr).toContain('--body-file');
  });

  it('rejects `comms send --body` over 1500 chars with a non-zero exit', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'send',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        'state/comms',
        '--output',
        'state/shared-log.md',
        '--now',
        '2026-05-26T07:00:00Z',
        '--title',
        'Send over limit',
        '--body',
        longBody,
        '--event-id',
        'send-over-limit',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('1501');
    expect(result.stderr).toContain('1500');
  });

  it('rejects `comms direct --body` over 1500 chars with a non-zero exit', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'direct',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        'state/comms',
        '--to-agent-name',
        recipientWithId.agent_name,
        '--to-id',
        recipientWithId.id,
        '--to-platform',
        recipientWithId.platform,
        '--to-model',
        recipientWithId.model,
        '--to-session-prefix',
        recipientWithId.session_id_prefix,
        '--kind',
        'coordination-request',
        '--subject',
        'Direct over limit',
        '--body',
        longBody,
        '--event-id',
        'direct-over-limit',
        '--now',
        '2026-05-26T07:00:00Z',
        '--platform',
        'claude-code',
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('1501');
    expect(result.stderr).toContain('--body-file');
  });

  it('rejects `comms reply --body` over 1500 chars with a non-zero exit', async () => {
    const commsDir = 'state/comms';
    const fake = createFakeCollaborationRuntime({
      comms: {
        [commsDir]: [
          directedMessage({
            event_id: 'reply-source',
            created_at: '2026-05-26T06:59:00Z',
            from: senderWithId,
            to: recipient,
            subject: 'Source message',
            body: 'Short source body.',
          }),
        ],
      },
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'reply',
        '--active',
        'state/active-claims.json',
        '--comms-dir',
        commsDir,
        '--to-event-id',
        'reply-source',
        '--kind',
        'coordination-ack',
        '--body',
        longBody,
        '--event-id',
        'reply-over-limit',
        '--now',
        '2026-05-26T07:00:00Z',
        '--platform',
        recipient.platform,
        '--model',
        recipient.model,
      ],
      env: {
        CODEX_THREAD_ID: '019e1867-a0a8-7c11-aae3-1bc48533a585',
        OAK_AGENT_IDENTITY_OVERRIDE: recipient.agent_name,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain('1501');
  });
});

function directedMessage(
  message: Omit<
    Extract<CommsEvent, { readonly kind: 'directed' }>,
    'kind' | 'message_kind' | 'schema_version'
  > & { readonly message_kind?: string },
): CommsEvent {
  return {
    schema_version: '2.0.0',
    kind: 'directed',
    message_kind: 'coordination-request',
    ...message,
  };
}
