import { describe, expect, it } from 'vitest';

import { selectWakeEvents } from '../../src/collaboration-state/comms-wake-select';
import {
  type CollaborationAgentId,
  type CommsEvent,
  type DirectedCommsMessage,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
  uuidV5Schema,
} from '../../src/collaboration-state/types';

const seat: CollaborationAgentId = {
  agent_name: 'Gale turns Cloud',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '01a0d9',
  id: uuidV5Schema.parse('aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaaa'),
};

const peer: CollaborationAgentId = {
  agent_name: 'Swallow holds Drift',
  platform: 'claude',
  model: 'claude-opus-5-5',
  session_id_prefix: '516619',
  id: uuidV5Schema.parse('bbbbbbbb-bbbb-5bbb-9bbb-bbbbbbbbbbbb'),
};

const otherSeat: CollaborationAgentId = {
  agent_name: 'Luna stirs Radiance',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '01a0d3',
  id: uuidV5Schema.parse('cccccccc-cccc-5ccc-9ccc-cccccccccccc'),
};

function directed(
  eventId: string,
  from: CollaborationAgentId,
  to: CollaborationAgentId,
  tags?: readonly string[],
): DirectedCommsMessage {
  return {
    schema_version: '2.0.0',
    event_id: eventId,
    created_at: '2026-09-25T18:00:00Z',
    kind: 'directed',
    message_kind: 'status-update',
    from,
    to,
    subject: 'a subject',
    body: 'a body',
    ...(tags === undefined ? {} : { tags }),
  };
}

function narrative(
  eventId: string,
  author: CollaborationAgentId,
  addressing: {
    readonly addressedTo?: CollaborationAgentId;
    readonly audience?: readonly CollaborationAgentId[];
    readonly tags?: readonly string[];
  } = {},
): NarrativeCommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: eventId,
    created_at: '2026-09-25T18:00:00Z',
    kind: 'narrative',
    author,
    title: 'a title',
    body: 'a body',
    ...(addressing.addressedTo === undefined ? {} : { addressed_to: addressing.addressedTo }),
    ...(addressing.audience === undefined ? {} : { audience: addressing.audience }),
    ...(addressing.tags === undefined ? {} : { tags: addressing.tags }),
  };
}

function lifecycle(eventId: string, author: CollaborationAgentId): LifecycleCommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: eventId,
    created_at: '2026-09-25T18:00:00Z',
    kind: 'lifecycle',
    event_type: 'heartbeat',
    occurred_at: '2026-09-25T18:00:00Z',
    author,
    agent_id: author,
    thread: 'a-thread',
    claim_id: 'a-claim',
    title: 'Heartbeat',
    subject: 'Heartbeat',
    body: 'alive',
    tags: ['heartbeat'],
  };
}

describe('selectWakeEvents', () => {
  it.each<readonly [string, CommsEvent]>([
    ['a directed event to the seat', directed('e-directed', peer, seat)],
    ['a narrative addressed to the seat', narrative('e-addressed', peer, { addressedTo: seat })],
    [
      'a narrative whose audience includes the seat',
      narrative('e-group', peer, { audience: [otherSeat, seat] }),
    ],
  ])('wakes the seat for %s', (_name, event) => {
    expect(selectWakeEvents([event], seat)).toStrictEqual({
      wake: [event.event_id],
      never: [],
    });
  });

  it.each<readonly [string, CommsEvent]>([
    ['a broadcast', narrative('e-broadcast', peer)],
    ['a directed event to another seat', directed('e-observed', peer, otherSeat)],
    [
      'a narrative addressed to another seat',
      narrative('e-addressed-other', peer, { addressedTo: otherSeat }),
    ],
    [
      'a narrative whose audience leaves the seat out',
      narrative('e-group-other', peer, { audience: [otherSeat] }),
    ],
    ['a lifecycle event', lifecycle('e-lifecycle', peer)],
    ['an event the seat sent itself', directed('e-self', seat, seat)],
    ['a directed heartbeat', directed('e-heartbeat', peer, seat, ['heartbeat'])],
    [
      'a heartbeat to an audience that includes the seat',
      narrative('e-group-heartbeat', peer, { audience: [seat], tags: ['heartbeat'] }),
    ],
  ])('never wakes the seat for %s', (_name, event) => {
    expect(selectWakeEvents([event], seat)).toStrictEqual({
      wake: [],
      never: [event.event_id],
    });
  });

  it('parts a mixed batch into the events that wake and the events that never will', () => {
    const events: readonly CommsEvent[] = [
      narrative('e-1', peer),
      directed('e-2', peer, seat),
      lifecycle('e-3', peer),
      narrative('e-4', peer, { audience: [seat] }),
    ];
    expect(selectWakeEvents(events, seat)).toStrictEqual({
      wake: ['e-2', 'e-4'],
      never: ['e-1', 'e-3'],
    });
  });

  it('keeps a wake when another event borrows its id, so the borrowed id cannot cancel it', () => {
    const events: readonly CommsEvent[] = [
      directed('e-shared', peer, seat),
      narrative('e-shared', peer),
    ];
    expect(selectWakeEvents(events, seat)).toStrictEqual({ wake: ['e-shared'], never: [] });
  });

  it('wakes for nothing in an empty batch', () => {
    expect(selectWakeEvents([], seat)).toStrictEqual({ wake: [], never: [] });
  });
});
