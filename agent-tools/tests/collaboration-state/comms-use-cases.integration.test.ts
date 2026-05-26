import { describe, expect, it } from 'vitest';

import { deriveOverrideCollaborationIdentity } from '../../src/collaboration-state/identity';
import {
  createDirectedCommsMessage,
  migrateLegacyCommsRecordCollections,
  renderCommsLog,
  replyToDirectedCommsMessage,
  writeCommsEventWithReadback,
} from '../../src/collaboration-state/comms-use-cases';
import { type CollaborationAgentId, type CommsEvent } from '../../src/collaboration-state/types';

// Legacy-shape constants — used for the migration test that asserts the
// migrator preserves verbatim legacy data on disk (no id by construction).
const sender: CollaborationAgentId = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
};

const recipient: CollaborationAgentId = {
  agent_name: 'Uplifted Wheeling Sky',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e20',
};

// Id-keyed write-shape constants — every Phase 0+ write path requires id
// per PDR-076a, so the factory tests use derived Write identities. Derived
// via the override path so the v5 id is deterministic from name + prefix.
const senderWrite = deriveOverrideCollaborationIdentity({
  agent_name: sender.agent_name,
  platform: sender.platform,
  model: sender.model,
  session_id_prefix: sender.session_id_prefix,
});

const recipientWrite = deriveOverrideCollaborationIdentity({
  agent_name: recipient.agent_name,
  platform: recipient.platform,
  model: recipient.model,
  session_id_prefix: recipient.session_id_prefix,
});

describe('comms use cases', () => {
  it('writes a directed event through an explicit event store', async () => {
    const store = createMemoryEventStore();
    const event = createDirectedCommsMessage({
      eventId: 'message-one',
      createdAt: '2026-05-13T09:46:00Z',
      messageKind: 'coordination-request',
      from: senderWrite,
      to: recipientWrite,
      subject: 'Please check this',
      body: 'There is useful coordination here.',
    });

    await writeCommsEventWithReadback({
      event,
      nowIso: '2026-05-13T09:46:00Z',
      store,
    });

    expect(store.events()).toStrictEqual([event]);
  });

  it('includes tags on a directed event when supplied (ADR-183 tag namespace)', () => {
    const event = createDirectedCommsMessage({
      eventId: 'message-tagged',
      createdAt: '2026-05-24T10:18:00Z',
      messageKind: 'directed',
      from: senderWrite,
      to: recipientWrite,
      subject: 'Tagged surface',
      body: 'tagged body',
      tags: ['failure-mode'],
    });

    expect(event).toStrictEqual({
      schema_version: '2.0.0',
      event_id: 'message-tagged',
      created_at: '2026-05-24T10:18:00Z',
      kind: 'directed',
      message_kind: 'directed',
      from: senderWrite,
      to: recipientWrite,
      subject: 'Tagged surface',
      body: 'tagged body',
      tags: ['failure-mode'],
    });
  });

  it('omits the tags field on a directed event when not supplied (additive-extension discipline)', () => {
    const event = createDirectedCommsMessage({
      eventId: 'message-untagged',
      createdAt: '2026-05-24T10:18:00Z',
      messageKind: 'directed',
      from: senderWrite,
      to: recipientWrite,
      subject: 'Untagged surface',
      body: 'untagged body',
    });

    expect(event).not.toHaveProperty('tags');
  });

  it('omits the tags field on a directed event when supplied as an empty array', () => {
    const event = createDirectedCommsMessage({
      eventId: 'message-empty-tags',
      createdAt: '2026-05-24T10:18:00Z',
      messageKind: 'directed',
      from: senderWrite,
      to: recipientWrite,
      subject: 'Empty-tag surface',
      body: 'empty-tag body',
      tags: [],
    });

    expect(event).not.toHaveProperty('tags');
  });

  it('builds a reply by reading source messages and swapping sender and recipient', () => {
    const source = createDirectedCommsMessage({
      eventId: 'message-one',
      createdAt: '2026-05-13T09:46:00Z',
      messageKind: 'coordination-request',
      from: senderWrite,
      to: recipientWrite,
      subject: 'Please check this',
      body: 'There is useful coordination here.',
    });

    expect(
      replyToDirectedCommsMessage({
        sourceMessages: [source],
        sourceEventId: 'message-one',
        from: recipientWrite,
        eventId: 'message-two',
        createdAt: '2026-05-13T09:47:00Z',
        messageKind: 'coordination-ack',
        body: 'Looks good.',
      }),
    ).toStrictEqual(
      createDirectedCommsMessage({
        eventId: 'message-two',
        createdAt: '2026-05-13T09:47:00Z',
        messageKind: 'coordination-ack',
        from: recipientWrite,
        to: senderWrite,
        subject: 're: Please check this',
        body: 'Looks good.',
      }),
    );
  });

  it('rejects a reply when the source message lacks an id on its from endpoint (PDR-076a write-side enforcement)', () => {
    const legacySource: CommsEvent = {
      schema_version: '2.0.0',
      event_id: 'legacy-source',
      created_at: '2026-05-13T09:40:00Z',
      kind: 'directed',
      message_kind: 'coordination-request',
      from: sender,
      to: recipientWrite,
      subject: 'Legacy source from-endpoint',
      body: 'Source written before Phase 0 — from has no id.',
    };

    expect(() =>
      replyToDirectedCommsMessage({
        sourceMessages: [legacySource],
        sourceEventId: 'legacy-source',
        from: recipientWrite,
        eventId: 'reply-attempt',
        createdAt: '2026-05-13T09:41:00Z',
        messageKind: 'coordination-ack',
        body: 'Reply attempt should be rejected.',
      }),
    ).toThrow(/id/i);
  });

  it('renders canonical comms events through an injected output sink', async () => {
    const store = createMemoryEventStore([
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
    const writes: string[] = [];

    const rendered = await renderCommsLog({
      store,
      output: {
        writeText: async (text) => {
          writes.push(text);
        },
      },
    });

    expect(rendered).toContain('Narrative one');
    expect(writes).toStrictEqual([rendered]);
  });

  it('migrates legacy record collections without directory traversal', () => {
    const migrated = migrateLegacyCommsRecordCollections({
      narratives: [
        {
          event_id: 'narrative-one',
          created_at: '2026-05-13T09:40:00Z',
          author: sender,
          title: 'Narrative one',
          body: 'Narrative body.',
        },
      ],
      lifecycles: [],
      directed: [
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
    });

    // Migration preserves the verbatim legacy shape — directed events on
    // disk pre-Phase 0 lack ids and the migrator MUST NOT synthesise them.
    // The expected output uses a direct DirectedCommsMessage literal rather
    // than createDirectedCommsMessage because the factory now enforces the
    // write-side id contract (PDR-076a) which legacy data does not satisfy.
    expect(migrated).toStrictEqual([
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

function createMemoryEventStore(initialEvents: readonly CommsEvent[] = []) {
  const storedEvents: CommsEvent[] = [...initialEvents];

  return {
    async write(event: CommsEvent): Promise<void> {
      storedEvents.push(event);
    },
    async read(): Promise<readonly CommsEvent[]> {
      return storedEvents;
    },
    events(): readonly CommsEvent[] {
      return storedEvents;
    },
  };
}
