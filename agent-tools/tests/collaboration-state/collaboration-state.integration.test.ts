import { randomUUID } from 'node:crypto';
import { join as pathJoin } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import { type CommsEvent } from '../../src/collaboration-state/types';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

// These paths are virtual keys in the in-memory fake runtime, not real
// filesystem locations. The synthetic `__transient__` prefix is never
// touched on disk; using a non-public namespace satisfies SonarCloud
// S5443 (publicly-writable directories) and signals intent at the call
// site that no filesystem is ever read or written through these strings.
function transientPath(name: string): string {
  return pathJoin('__transient__', `${name}-${randomUUID()}.txt`);
}

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

// Identities emitted by the CLI under the env wiring used in the tests below.
// Derived via the same path as production so strict-equal assertions remain
// honest without coupling the test to the v5 namespace constant.
const senderWithId = deriveCollaborationIdentity({
  platform: sender.platform,
  model: sender.model,
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
    PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
  },
}).agentId;

const replyRecipientCodexThreadId = '019e1867-a0a8-7c11-aae3-1bc48533a585';

const recipientWithId = deriveCollaborationIdentity({
  platform: recipient.platform,
  model: recipient.model,
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: recipient.agent_name,
    CODEX_THREAD_ID: replyRecipientCodexThreadId,
  },
}).agentId;

describe('collaboration-state comms integration', () => {
  it('writes a directed message from the current identity', async () => {
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
        recipient.agent_name,
        '--to-platform',
        recipient.platform,
        '--to-model',
        recipient.model,
        '--to-session-prefix',
        recipient.session_id_prefix,
        '--kind',
        'coordination-request',
        '--subject',
        'Please check this',
        '--body',
        'There is useful coordination here.',
        '--event-id',
        'message-one',
        '--now',
        '2026-05-11T19:45:35Z',
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
    expect(result.stdout).toBe('wrote comms event message-one to state/comms/message-one.json\n');
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      directedMessage({
        event_id: 'message-one',
        created_at: '2026-05-11T19:45:35Z',
        from: senderWithId,
        to: recipient,
        subject: 'Please check this',
        body: 'There is useful coordination here.',
      }),
    ]);
  });

  it('writes a directed message whose body was supplied via --body-file (literal contents, no shell interpretation)', async () => {
    const commsDir = 'state/comms';
    const bodyPath = transientPath('test-body');
    const bodyText =
      'Body with backticks like `--body-file` and dollars like $HOME that would normally be shell-evaluated.';
    const fake = createFakeCollaborationRuntime();
    fake.seedTextFile(bodyPath, bodyText);

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
        recipient.agent_name,
        '--to-platform',
        recipient.platform,
        '--to-model',
        recipient.model,
        '--to-session-prefix',
        recipient.session_id_prefix,
        '--kind',
        'coordination-request',
        '--subject',
        'Body file path',
        '--body-file',
        bodyPath,
        '--event-id',
        'message-bf',
        '--now',
        '2026-05-22T10:00:00Z',
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
        event_id: 'message-bf',
        created_at: '2026-05-22T10:00:00Z',
        from: senderWithId,
        to: recipient,
        subject: 'Body file path',
        body: bodyText,
      }),
    ]);
  });

  it('rejects --body and --body-file together as mutually exclusive', async () => {
    const fake = createFakeCollaborationRuntime();
    const bodyPath = transientPath('body');
    fake.seedTextFile(bodyPath, 'file body');

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
        recipient.agent_name,
        '--to-platform',
        recipient.platform,
        '--to-model',
        recipient.model,
        '--to-session-prefix',
        recipient.session_id_prefix,
        '--kind',
        'coordination-request',
        '--subject',
        'Both flags',
        '--body',
        'inline body',
        '--body-file',
        bodyPath,
        '--event-id',
        'message-conflict',
        '--now',
        '2026-05-22T10:00:00Z',
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
    expect(result.stderr).toContain('mutually exclusive');
  });

  it('rejects missing --body and --body-file as missing required option', async () => {
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
        recipient.agent_name,
        '--to-platform',
        recipient.platform,
        '--to-model',
        recipient.model,
        '--to-session-prefix',
        recipient.session_id_prefix,
        '--kind',
        'coordination-request',
        '--subject',
        'Neither flag',
        '--event-id',
        'message-missing',
        '--now',
        '2026-05-22T10:00:00Z',
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
    expect(result.stderr).toContain('--body');
  });

  it('rejects --body-file pointing at an empty file because directed messages require a non-empty body', async () => {
    const fake = createFakeCollaborationRuntime();
    const emptyBodyPath = transientPath('empty');
    fake.seedTextFile(emptyBodyPath, '   \n  \n');

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
        recipient.agent_name,
        '--to-platform',
        recipient.platform,
        '--to-model',
        recipient.model,
        '--to-session-prefix',
        recipient.session_id_prefix,
        '--kind',
        'coordination-request',
        '--subject',
        'Empty body file',
        '--body-file',
        emptyBodyPath,
        '--event-id',
        'message-empty',
        '--now',
        '2026-05-22T10:00:00Z',
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
    expect(result.stderr).toContain('must not be empty');
  });

  it('replies to a directed message by swapping sender and recipient', async () => {
    const commsDir = 'state/comms';
    const fake = createFakeCollaborationRuntime({
      comms: {
        [commsDir]: [
          directedMessage({
            event_id: 'message-one',
            created_at: '2026-05-11T19:45:35Z',
            from: senderWithId,
            to: recipient,
            subject: 'Please check this',
            body: 'There is useful coordination here.',
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
        'message-one',
        '--kind',
        'coordination-ack',
        '--body',
        'Looks good.',
        '--event-id',
        'message-two',
        '--now',
        '2026-05-11T19:46:35Z',
        '--platform',
        recipient.platform,
        '--model',
        recipient.model,
      ],
      env: {
        CODEX_THREAD_ID: replyRecipientCodexThreadId,
        OAK_AGENT_IDENTITY_OVERRIDE: recipient.agent_name,
      },
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('wrote comms event message-two to state/comms/message-two.json\n');
    expect(fake.readCommsEvents(commsDir)).toContainEqual(
      directedMessage({
        event_id: 'message-two',
        created_at: '2026-05-11T19:46:35Z',
        message_kind: 'coordination-ack',
        from: recipientWithId,
        to: senderWithId,
        subject: 're: Please check this',
        body: 'Looks good.',
      }),
    );
  });

  it('renders the shared log from the canonical comms directory', async () => {
    const outputPath = 'state/shared-comms-log.md';
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: ['--', 'comms', 'render', '--comms-dir', 'state/comms', '--output', outputPath],
      env: {},
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(0);
    expect(fake.readTextFile(outputPath)).toContain('# Agent-to-Agent Shared Communication Log');
  });

  it('prints and marks unseen directed messages for one agent', async () => {
    const commsDir = 'state/comms';
    const seenFile = 'state/seen.txt';
    const fake = createFakeCollaborationRuntime({
      comms: {
        [commsDir]: [
          directedMessage({
            event_id: 'message-one',
            created_at: '2026-05-11T19:46:35Z',
            from: senderWithId,
            to: recipient,
            subject: 'Please check this',
            body: 'There is useful coordination here.',
          }),
        ],
      },
    });

    const first = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'inbox',
        '--comms-dir',
        commsDir,
        '--agent-name',
        recipient.agent_name,
        '--session-prefix',
        recipient.session_id_prefix,
        '--platform',
        recipient.platform,
        '--model',
        recipient.model,
        '--seen-file',
        seenFile,
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(first.exitCode).toBe(0);
    expect(first.stdout).toContain('subject: Please check this');
    expect(first.stdout).toContain('There is useful coordination here.');
    expect(fake.readSeenIds(seenFile)).toStrictEqual(['message-one']);

    const second = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'inbox',
        '--comms-dir',
        commsDir,
        '--agent-name',
        recipient.agent_name,
        '--session-prefix',
        recipient.session_id_prefix,
        '--platform',
        recipient.platform,
        '--model',
        recipient.model,
        '--seen-file',
        seenFile,
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(second.exitCode).toBe(0);
    expect(second.stdout).toBe('no new comms events\n');
  });

  it('watches for a new directed message and marks it seen', async () => {
    const commsDir = 'state/comms';
    const seenFile = 'state/seen.txt';
    const streamed: string[] = [];
    const fake = createFakeCollaborationRuntime({
      onWaitForCommsChange: () => {
        fake.writeCommsEvent(
          commsDir,
          directedMessage({
            event_id: 'message-one',
            created_at: '2026-05-11T19:46:35Z',
            from: senderWithId,
            to: recipient,
            subject: 'Please check this',
            body: 'There is useful coordination here.',
          }),
        );
      },
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'watch',
        '--comms-dir',
        commsDir,
        '--agent-name',
        recipient.agent_name,
        '--session-prefix',
        recipient.session_id_prefix,
        '--platform',
        recipient.platform,
        '--model',
        recipient.model,
        '--seen-file',
        seenFile,
        '--poll-ms',
        '20',
        '--max-events',
        '1',
      ],
      env: {},
      stdout: {
        write(chunk: string | Uint8Array): boolean {
          streamed.push(String(chunk));
          return true;
        },
      },
      io: fake.runtime.io,
      waitForCommsChange: fake.runtime.waitForCommsChange,
    });

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe('');
    expect(streamed.join('')).toContain('subject: Please check this');
    expect(streamed.join('')).toContain('There is useful coordination here.');
    expect(fake.readSeenIds(seenFile)).toStrictEqual(['message-one']);
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
