import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

const sender = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
} as const;

const recipient = {
  agent_name: 'Uplifted Wheeling Sky',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e20',
} as const;

// Identity emitted by the CLI under the env wiring used in the tests below
// (PRACTICE_AGENT_SESSION_ID_CLAUDE seed + OAK_AGENT_IDENTITY_OVERRIDE name).
// Derived via the same path as production so the assertion remains honest
// without coupling the test to the v5 namespace constant.
const senderWithId = deriveCollaborationIdentity({
  platform: sender.platform,
  model: sender.model,
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
    PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
  },
}).agentId;

const recipientCodexThreadId = '019e2067-a0a8-7c11-aae3-1bc48533a585';
const recipientWithId = deriveCollaborationIdentity({
  platform: recipient.platform,
  model: recipient.model,
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: recipient.agent_name,
    CODEX_THREAD_ID: recipientCodexThreadId,
  },
}).agentId;

describe('unified comms format CLI behaviour', () => {
  it('writes, reads, and renders directed messages from the single comms directory', async () => {
    const activePath = 'state/active-claims.json';
    const commsDir = 'state/comms';
    const seenFile = 'state/seen.txt';
    const outputPath = 'state/shared-comms-log.md';
    const fake = createFakeCollaborationRuntime();

    const direct = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'direct',
        '--active',
        activePath,
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
        'Please check this',
        '--body',
        'There is useful coordination here.',
        '--event-id',
        'message-one',
        '--now',
        '2026-05-13T09:46:00Z',
        '--platform',
        sender.platform,
        '--model',
        sender.model,
      ],
      env: {
        OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
        PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
      },
      io: fake.runtime.io,
    });

    expect(direct.exitCode).toBe(0);
    expect(direct.stdout).toBe('wrote comms event message-one to state/comms/message-one.json\n');
    expect(fake.readCommsEvents(commsDir)).toContainEqual({
      schema_version: '2.0.0',
      event_id: 'message-one',
      created_at: '2026-05-13T09:46:00Z',
      kind: 'directed',
      message_kind: 'coordination-request',
      from: senderWithId,
      to: recipientWithId,
      subject: 'Please check this',
      body: 'There is useful coordination here.',
    });

    const inbox = await runCollaborationStateCli({
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

    expect(inbox.exitCode).toBe(0);
    expect(inbox.stdout).toContain('subject: Please check this');
    expect(fake.readSeenIds(seenFile)).toStrictEqual(['message-one']);

    const render = await runCollaborationStateCli({
      argv: ['--', 'comms', 'render', '--comms-dir', commsDir, '--output', outputPath],
      env: {},
      io: fake.runtime.io,
    });

    expect(render.exitCode).toBe(0);
    expect(fake.readTextFile(outputPath)).toContain(
      'Generated from `.agent/state/collaboration/comms/`.',
    );
  });

  it('migrates historical events into one canonical directory', async () => {
    const eventsDir = 'state/comms-events';
    const lifecycleDir = 'state/comms-lifecycle';
    const messagesDir = 'state/comms-messages';
    const commsDir = 'state/comms';
    const fake = createFakeCollaborationRuntime({
      legacyComms: {
        // Legacy fixtures pre-date the PDR-076a id field; the migrator must
        // accept and round-trip these legacy-shape identities verbatim.
        [eventsDir]: [
          {
            event_id: 'narrative-one',
            created_at: '2026-05-13T09:40:00Z',
            author: sender,
            title: 'Narrative one',
            body: 'Narrative body.',
          },
        ],
        [lifecycleDir]: [
          {
            schema_version: '1.3.0',
            event_id: 'lifecycle-one',
            created_at: '2026-05-13T09:41:00Z',
            event_type: 'claim_lifecycle',
            occurred_at: '2026-05-13T09:41:00Z',
            author: sender,
            agent_id: sender,
            thread: 'agentic-engineering-enhancements',
            claim_id: '',
            title: 'Lifecycle one',
            subject: 'Lifecycle subject',
            body: 'Lifecycle body.',
          },
        ],
        [messagesDir]: [
          {
            schema_version: '1.0.0',
            event_id: 'directed-one',
            created_at: '2026-05-13T09:42:00Z',
            kind: 'coordination-update',
            from: sender,
            to: recipient,
            subject: 'Directed one',
            body: 'Directed body.',
          },
        ],
      },
    });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'comms',
        'migrate',
        '--events-dir',
        eventsDir,
        '--lifecycle-dir',
        lifecycleDir,
        '--messages-dir',
        messagesDir,
        '--comms-dir',
        commsDir,
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(result).toStrictEqual({
      exitCode: 0,
      stdout: 'migrated 3 comms events\n',
      stderr: '',
    });
    expect(fake.readCommsEvents(commsDir)).toStrictEqual([
      {
        schema_version: '2.0.0',
        event_id: 'directed-one',
        created_at: '2026-05-13T09:42:00Z',
        kind: 'directed',
        message_kind: 'coordination-update',
        from: sender,
        to: recipient,
        subject: 'Directed one',
        body: 'Directed body.',
      },
      {
        schema_version: '2.0.0',
        event_id: 'lifecycle-one',
        created_at: '2026-05-13T09:41:00Z',
        kind: 'lifecycle',
        event_type: 'claim_lifecycle',
        occurred_at: '2026-05-13T09:41:00Z',
        author: sender,
        agent_id: sender,
        thread: 'agentic-engineering-enhancements',
        claim_id: '',
        title: 'Lifecycle one',
        subject: 'Lifecycle subject',
        body: 'Lifecycle body.',
      },
      {
        schema_version: '2.0.0',
        event_id: 'narrative-one',
        created_at: '2026-05-13T09:40:00Z',
        kind: 'narrative',
        author: sender,
        title: 'Narrative one',
        body: 'Narrative body.',
      },
    ]);
  });
});
