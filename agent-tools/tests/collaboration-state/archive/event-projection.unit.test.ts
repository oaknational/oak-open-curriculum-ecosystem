import { describe, expect, it } from 'vitest';

import { toClassifiableEvent } from '../../../src/collaboration-state/archive/event-projection';
import type {
  DirectedCommsMessage,
  NarrativeCommsEvent,
} from '../../../src/collaboration-state/types';

const agent = {
  agent_name: 'Anvil spins Bronze',
  platform: 'claude-code',
  model: 'Opus 4.8',
  session_id_prefix: '9cd858',
} as const;

describe('toClassifiableEvent', () => {
  it('projects a narrative event, using title and defaulting absent tags to empty', () => {
    const event: NarrativeCommsEvent = {
      schema_version: '2.0.0',
      event_id: 'aaaaaaaa-1111-4111-8111-111111111111',
      created_at: '2026-06-01T00:00:00Z',
      kind: 'narrative',
      author: agent,
      title: 'Team start: Anvil spins Bronze',
      body: 'hello team',
    };
    expect(toClassifiableEvent(event)).toEqual({
      eventId: 'aaaaaaaa-1111-4111-8111-111111111111',
      kind: 'narrative',
      createdAt: '2026-06-01T00:00:00Z',
      tags: [],
      titleOrSubject: 'Team start: Anvil spins Bronze',
      bodyLength: 'hello team'.length,
    });
  });

  it('projects a directed message using subject (not title) and carries its tags', () => {
    const event: DirectedCommsMessage = {
      schema_version: '2.0.0',
      event_id: 'bbbbbbbb-2222-4222-8222-222222222222',
      created_at: '2026-06-02T00:00:00Z',
      kind: 'directed',
      message_kind: 'coordination-notice',
      from: agent,
      to: agent,
      subject: 'ArcAngel channel open',
      body: 'tail it',
      tags: ['behaviour-note'],
    };
    const projected = toClassifiableEvent(event);
    expect(projected.titleOrSubject).toBe('ArcAngel channel open');
    expect(projected.tags).toEqual(['behaviour-note']);
    expect(projected.kind).toBe('directed');
  });
});
