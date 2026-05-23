import { describe, expect, it } from 'vitest';

import {
  createDirectedCommsMessage,
  migrateLegacyCommsRecordCollections,
  renderCommsLog,
  replyToDirectedCommsMessage,
  writeCommsEventWithReadback,
} from '../../src/collaboration-state/comms-use-cases';
import { type CollaborationAgentId, type CommsEvent } from '../../src/collaboration-state/types';

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

describe('comms use cases', () => {
  it('writes a directed event through an explicit event store', async () => {
    const store = createMemoryEventStore();
    const event = createDirectedCommsMessage({
      eventId: 'message-one',
      createdAt: '2026-05-13T09:46:00Z',
      messageKind: 'coordination-request',
      from: sender,
      to: recipient,
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

  it('builds a reply by reading source messages and swapping sender and recipient', () => {
    const source = createDirectedCommsMessage({
      eventId: 'message-one',
      createdAt: '2026-05-13T09:46:00Z',
      messageKind: 'coordination-request',
      from: sender,
      to: recipient,
      subject: 'Please check this',
      body: 'There is useful coordination here.',
    });

    expect(
      replyToDirectedCommsMessage({
        sourceMessages: [source],
        sourceEventId: 'message-one',
        from: recipient,
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
        from: recipient,
        to: sender,
        subject: 're: Please check this',
        body: 'Looks good.',
      }),
    );
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

    expect(migrated).toStrictEqual([
      createDirectedCommsMessage({
        eventId: 'directed-one',
        createdAt: '2026-05-13T09:42:00Z',
        messageKind: 'coordination-update',
        from: sender,
        to: recipient,
        subject: 'Directed one',
        body: 'Directed body.',
      }),
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
