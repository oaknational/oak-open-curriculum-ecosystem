import { describe, expect, it } from 'vitest';

import {
  classifyEventForAgent,
  createDirectedCommsMessage,
  drainRelevantEvents,
} from '../../src/collaboration-state/comms-use-cases';
import {
  type CollaborationAgentId,
  type CommsEvent,
  type LifecycleCommsEvent,
  type NarrativeCommsEvent,
} from '../../src/collaboration-state/types';

const self: CollaborationAgentId = {
  agent_name: 'Wooded Spreading Thicket',
  platform: 'claude-code',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '5c8f3c',
};

const peer: CollaborationAgentId = {
  agent_name: 'Uplifted Wheeling Sky',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e20',
};

const stranger: CollaborationAgentId = {
  agent_name: 'Foamy Charting Fjord',
  platform: 'claude',
  model: 'claude-opus-4-7-1m',
  session_id_prefix: '86dbd1',
};

function narrative(input: {
  readonly eventId: string;
  readonly author: CollaborationAgentId;
  readonly title: string;
  readonly body?: string;
  readonly createdAt?: string;
  readonly audience?: readonly CollaborationAgentId[];
  readonly addressedTo?: CollaborationAgentId;
}): NarrativeCommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: input.eventId,
    created_at: input.createdAt ?? '2026-05-21T08:00:00Z',
    kind: 'narrative',
    author: input.author,
    title: input.title,
    body: input.body ?? '',
    ...(input.audience === undefined ? {} : { audience: input.audience }),
    ...(input.addressedTo === undefined ? {} : { addressed_to: input.addressedTo }),
  };
}

function lifecycle(input: {
  readonly eventId: string;
  readonly author: CollaborationAgentId;
  readonly title: string;
  readonly createdAt?: string;
}): LifecycleCommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: input.eventId,
    created_at: input.createdAt ?? '2026-05-21T08:00:00Z',
    kind: 'lifecycle',
    event_type: 'session-open',
    occurred_at: input.createdAt ?? '2026-05-21T08:00:00Z',
    author: input.author,
    agent_id: input.author,
    thread: 'agentic-engineering-enhancements',
    claim_id: '',
    title: input.title,
    subject: input.title,
    body: '',
  };
}

describe('classifyEventForAgent — view classification per the all-channels-matter principle', () => {
  it('classifies a narrative with no addressing as a broadcast view', () => {
    expect(
      classifyEventForAgent({
        event: narrative({
          eventId: 'broadcast-one',
          author: peer,
          title: 'Heads-up to the team',
        }),
        self,
      }),
    ).toBe('broadcast');
  });

  it('classifies a narrative whose audience includes the agent as a group view', () => {
    expect(
      classifyEventForAgent({
        event: narrative({
          eventId: 'group-one',
          author: peer,
          title: 'Sync needed',
          audience: [self, stranger],
        }),
        self,
      }),
    ).toBe('group');
  });

  it('classifies a narrative whose addressed_to names the agent as a directed view', () => {
    expect(
      classifyEventForAgent({
        event: narrative({
          eventId: 'narrative-direct-one',
          author: peer,
          title: 'Just for you',
          addressedTo: self,
        }),
        self,
      }),
    ).toBe('directed');
  });

  it('classifies a directed-kind message addressed to the agent as a directed view', () => {
    expect(
      classifyEventForAgent({
        event: createDirectedCommsMessage({
          eventId: 'directed-one',
          createdAt: '2026-05-21T08:00:00Z',
          messageKind: 'coordination-request',
          from: peer,
          to: self,
          subject: 'Please check this',
          body: 'Body.',
        }),
        self,
      }),
    ).toBe('directed');
  });

  it('classifies a lifecycle event as a lifecycle view (all-channels principle)', () => {
    expect(
      classifyEventForAgent({
        event: lifecycle({
          eventId: 'lifecycle-one',
          author: peer,
          title: 'Session open',
        }),
        self,
      }),
    ).toBe('lifecycle');
  });

  it('returns undefined for events authored by the agent (self-exclusion is non-negotiable)', () => {
    const selfNarrative = narrative({
      eventId: 'self-narrative',
      author: self,
      title: 'My own broadcast',
    });
    const selfDirected = createDirectedCommsMessage({
      eventId: 'self-directed',
      createdAt: '2026-05-21T08:00:00Z',
      messageKind: 'coordination-request',
      from: self,
      to: peer,
      subject: 'I sent this',
      body: 'Body.',
    });
    const selfLifecycle = lifecycle({
      eventId: 'self-lifecycle',
      author: self,
      title: 'My own lifecycle',
    });

    expect(classifyEventForAgent({ event: selfNarrative, self })).toBeUndefined();
    expect(classifyEventForAgent({ event: selfDirected, self })).toBeUndefined();
    expect(classifyEventForAgent({ event: selfLifecycle, self })).toBeUndefined();
  });

  it("classifies directed events addressed to a different agent as an 'observed' view", () => {
    const directedToStranger = createDirectedCommsMessage({
      eventId: 'directed-to-stranger',
      createdAt: '2026-05-21T08:00:00Z',
      messageKind: 'coordination-request',
      from: peer,
      to: stranger,
      subject: 'For stranger',
      body: 'Body.',
    });

    expect(classifyEventForAgent({ event: directedToStranger, self })).toBe('observed');
  });

  it("classifies narratives addressed_to a different agent as an 'observed' view", () => {
    const narrativeToStranger = narrative({
      eventId: 'narrative-to-stranger',
      author: peer,
      title: 'For stranger',
      addressedTo: stranger,
    });

    expect(classifyEventForAgent({ event: narrativeToStranger, self })).toBe('observed');
  });

  it("classifies narratives whose audience excludes the agent as an 'observed' view", () => {
    const narrativeExcludingSelf = narrative({
      eventId: 'narrative-excludes-self',
      author: peer,
      title: 'For others',
      audience: [stranger],
    });

    expect(classifyEventForAgent({ event: narrativeExcludingSelf, self })).toBe('observed');
  });
});

describe('drainRelevantEvents — full event stream surfacing with self-exclusion only', () => {
  it('emits one entry per relevant event covering broadcast, group, directed-narrative, directed-kind, and lifecycle', async () => {
    const events: readonly CommsEvent[] = [
      narrative({
        eventId: 'broadcast-one',
        author: peer,
        title: 'Broadcast title',
        createdAt: '2026-05-21T08:00:00Z',
        body: 'Broadcast body.',
      }),
      narrative({
        eventId: 'group-one',
        author: peer,
        title: 'Group title',
        createdAt: '2026-05-21T08:01:00Z',
        body: 'Group body.',
        audience: [self, stranger],
      }),
      narrative({
        eventId: 'narrative-direct-one',
        author: peer,
        title: 'Narrative-direct title',
        createdAt: '2026-05-21T08:02:00Z',
        body: 'Narrative-direct body.',
        addressedTo: self,
      }),
      createDirectedCommsMessage({
        eventId: 'directed-one',
        createdAt: '2026-05-21T08:03:00Z',
        messageKind: 'coordination-request',
        from: peer,
        to: self,
        subject: 'Directed subject',
        body: 'Directed body.',
      }),
      lifecycle({
        eventId: 'lifecycle-one',
        author: peer,
        title: 'Lifecycle title',
        createdAt: '2026-05-21T08:04:00Z',
      }),
    ];
    const drained = await drainRelevantEvents({
      messages: events,
      seenIds: new Set(),
      self,
    });

    expect(drained.eventCount).toBe(5);
    expect(drained.eventIds).toStrictEqual([
      'broadcast-one',
      'group-one',
      'narrative-direct-one',
      'directed-one',
      'lifecycle-one',
    ]);
    expect(drained.output).toContain('[BROADCAST]');
    expect(drained.output).toContain('[GROUP]');
    expect(drained.output).toContain('[DIRECTED]');
    expect(drained.output).toContain('[LIFECYCLE]');
    expect(drained.output).toContain('Broadcast title');
    expect(drained.output).toContain('Group title');
    expect(drained.output).toContain('Narrative-direct title');
    expect(drained.output).toContain('Directed subject');
    expect(drained.output).toContain('Lifecycle title');
  });

  it("emits directed-kind events whose 'to' names a different agent under the [OBSERVED] tag", async () => {
    const directedToStranger = createDirectedCommsMessage({
      eventId: 'directed-to-stranger',
      createdAt: '2026-05-21T08:00:00Z',
      messageKind: 'coordination-request',
      from: peer,
      to: stranger,
      subject: 'Cross-traffic to stranger',
      body: 'Cross-traffic body.',
    });
    const drained = await drainRelevantEvents({
      messages: [directedToStranger],
      seenIds: new Set(),
      self,
    });

    expect(drained.eventCount).toBe(1);
    expect(drained.eventIds).toStrictEqual(['directed-to-stranger']);
    expect(drained.output).toContain('[OBSERVED]');
    expect(drained.output).toContain('Cross-traffic to stranger');
  });

  it('emits narratives whose addressed_to names a different agent under the [OBSERVED] tag', async () => {
    const narrativeToStranger = narrative({
      eventId: 'narrative-to-stranger',
      author: peer,
      title: 'Cross-traffic narrative',
      addressedTo: stranger,
      createdAt: '2026-05-21T08:00:00Z',
    });
    const drained = await drainRelevantEvents({
      messages: [narrativeToStranger],
      seenIds: new Set(),
      self,
    });

    expect(drained.eventCount).toBe(1);
    expect(drained.eventIds).toStrictEqual(['narrative-to-stranger']);
    expect(drained.output).toContain('[OBSERVED]');
    expect(drained.output).toContain('Cross-traffic narrative');
  });

  it('emits narratives whose audience excludes the agent under the [OBSERVED] tag', async () => {
    const narrativeExcludingSelf = narrative({
      eventId: 'narrative-excludes-self',
      author: peer,
      title: 'Group narrative for others',
      audience: [stranger],
      createdAt: '2026-05-21T08:00:00Z',
    });
    const drained = await drainRelevantEvents({
      messages: [narrativeExcludingSelf],
      seenIds: new Set(),
      self,
    });

    expect(drained.eventCount).toBe(1);
    expect(drained.eventIds).toStrictEqual(['narrative-excludes-self']);
    expect(drained.output).toContain('[OBSERVED]');
    expect(drained.output).toContain('Group narrative for others');
  });

  it('excludes self-authored events across every kind', async () => {
    const events: readonly CommsEvent[] = [
      narrative({
        eventId: 'self-narrative',
        author: self,
        title: 'I broadcast this',
      }),
      createDirectedCommsMessage({
        eventId: 'self-directed',
        createdAt: '2026-05-21T08:00:00Z',
        messageKind: 'coordination-request',
        from: self,
        to: peer,
        subject: 'I sent this',
        body: 'Body.',
      }),
      lifecycle({
        eventId: 'self-lifecycle',
        author: self,
        title: 'My own lifecycle',
      }),
    ];
    const drained = await drainRelevantEvents({
      messages: events,
      seenIds: new Set(),
      self,
    });

    expect(drained.eventCount).toBe(0);
    expect(drained.output).toBe('');
    expect(drained.eventIds).toStrictEqual([]);
  });

  it('excludes events that have already been seen', async () => {
    const event = narrative({
      eventId: 'already-seen',
      author: peer,
      title: 'Already seen',
    });
    const drained = await drainRelevantEvents({
      messages: [event],
      seenIds: new Set(['already-seen']),
      self,
    });

    expect(drained.eventCount).toBe(0);
    expect(drained.eventIds).toStrictEqual([]);
  });

  it('orders emitted events by created_at then event_id', async () => {
    const events: readonly CommsEvent[] = [
      narrative({
        eventId: 'second',
        author: peer,
        title: 'Second in time',
        createdAt: '2026-05-21T08:02:00Z',
      }),
      narrative({
        eventId: 'first',
        author: peer,
        title: 'First in time',
        createdAt: '2026-05-21T08:01:00Z',
      }),
    ];
    const drained = await drainRelevantEvents({
      messages: events,
      seenIds: new Set(),
      self,
    });

    expect(drained.eventIds).toStrictEqual(['first', 'second']);
    expect(drained.output.indexOf('First in time')).toBeLessThan(
      drained.output.indexOf('Second in time'),
    );
  });

  it('respects remainingEvents to bound the number emitted in one drain call', async () => {
    const events: readonly CommsEvent[] = [
      narrative({
        eventId: 'one',
        author: peer,
        title: 'One',
        createdAt: '2026-05-21T08:01:00Z',
      }),
      narrative({
        eventId: 'two',
        author: peer,
        title: 'Two',
        createdAt: '2026-05-21T08:02:00Z',
      }),
      narrative({
        eventId: 'three',
        author: peer,
        title: 'Three',
        createdAt: '2026-05-21T08:03:00Z',
      }),
    ];
    const drained = await drainRelevantEvents({
      messages: events,
      seenIds: new Set(),
      self,
      remainingEvents: 2,
    });

    expect(drained.eventCount).toBe(2);
    expect(drained.eventIds).toStrictEqual(['one', 'two']);
  });
});
