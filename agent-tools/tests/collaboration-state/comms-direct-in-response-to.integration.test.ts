import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

// MCP-393 slice-B closure — `comms direct` accepts `--in-response-to
// <event-id>`, setting the `in_response_to` threading edge on the directed
// event (parity with `comms send`/`comms append`). Without it, a directed
// acknowledgement can only name its antecedent in prose, which no
// threading-reader can see — the drift class the 2026-07-30 live instances
// demonstrated three times in one hour.

const sender = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
} as const;

const recipient = {
  agent_name: 'Sylvan Curving Brook',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '9d2e1a',
} as const;

const senderWithId = deriveCollaborationIdentity({
  platform: sender.platform,
  model: sender.model,
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
    PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
  },
}).agentId;

const recipientWithId = deriveCollaborationIdentity({
  platform: recipient.platform,
  model: recipient.model,
  env: {
    OAK_AGENT_IDENTITY_OVERRIDE: recipient.agent_name,
    PRACTICE_AGENT_SESSION_ID_CLAUDE: recipient.session_id_prefix,
  },
}).agentId;

const senderEnv = {
  OAK_AGENT_IDENTITY_OVERRIDE: sender.agent_name,
  PRACTICE_AGENT_SESSION_ID_CLAUDE: sender.session_id_prefix,
};

// The CLI's recipient surface is exactly the five --to-* flags, so the
// written tuple carries no naming_schema_version (unlike the sender, which
// the CLI derives itself).
const recipientWritten = {
  agent_name: recipientWithId.agent_name,
  platform: recipientWithId.platform,
  model: recipientWithId.model,
  session_id_prefix: recipientWithId.session_id_prefix,
  id: recipientWithId.id,
};

describe('collaboration-state comms direct --in-response-to (MCP-393)', () => {
  it('threads a directed message to an antecedent event via --in-response-to', async () => {
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
        'Routed ask acknowledgement',
        '--body',
        'Directed absorption ack threading its antecedent mechanically.',
        '--in-response-to',
        'routed-ask-1',
        '--event-id',
        'directed-ack',
        '--now',
        '2026-07-30T10:18:00Z',
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
        event_id: 'directed-ack',
        created_at: '2026-07-30T10:18:00Z',
        kind: 'directed',
        message_kind: 'coordination-request',
        from: senderWithId,
        to: recipientWritten,
        subject: 'Routed ask acknowledgement',
        body: 'Directed absorption ack threading its antecedent mechanically.',
        in_response_to: 'routed-ask-1',
      },
    ]);
  });
});
