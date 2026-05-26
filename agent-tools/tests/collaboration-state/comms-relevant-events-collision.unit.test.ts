import { describe, expect, it } from 'vitest';

import { classifyEventForAgent } from '../../src/collaboration-state/comms-use-cases';
import { migrateLegacyCommsRecordCollections } from '../../src/collaboration-state/comms-migration-records';
import {
  type CollaborationAgentId,
  type NarrativeCommsEvent,
} from '../../src/collaboration-state/types';

/**
 * WS1 collision regression test: comms routing for narrative events must
 * disambiguate by `session_id_prefix`, not by `agent_name`. Two agents
 * sharing the same display name across different sessions (e.g. Mistbound
 * Slipping Night / Mistbound Passing Candle) MUST classify to their own
 * session_id_prefix as the addressee.
 *
 * The substantive change versus pre-WS1 is in `classifyNarrative` —
 * comparators moved from `agent_name` string equality to
 * `session_id_prefix` tuple-field equality. `classifyDirected` was already
 * tuple-correct on DirectedCommsMessage.to.
 *
 * The migration test covers legacy string-form `addressed_to`/`audience`
 * being projected to tuples with `'unknown'` placeholders by
 * `migrateLegacyCommsRecordCollections`.
 */

const aliceSessionOne: CollaborationAgentId = {
  agent_name: 'Mistbound Drifting Vow',
  platform: 'claude',
  model: 'claude-opus-4-7',
  session_id_prefix: 'aaaaaa',
};

const aliceSessionTwo: CollaborationAgentId = {
  agent_name: 'Mistbound Drifting Vow',
  platform: 'claude',
  model: 'claude-opus-4-7',
  session_id_prefix: 'bbbbbb',
};

const sender: CollaborationAgentId = {
  agent_name: 'Foamy Charting Fjord',
  platform: 'claude',
  model: 'claude-opus-4-7',
  session_id_prefix: '86dbd1',
};

function narrative(input: {
  readonly eventId: string;
  readonly addressedTo?: CollaborationAgentId;
  readonly audience?: readonly CollaborationAgentId[];
}): NarrativeCommsEvent {
  return {
    schema_version: '2.0.0',
    event_id: input.eventId,
    created_at: '2026-05-26T10:00:00Z',
    kind: 'narrative',
    author: sender,
    title: 'collision regression fixture',
    body: 'body',
    ...(input.addressedTo === undefined ? {} : { addressed_to: input.addressedTo }),
    ...(input.audience === undefined ? {} : { audience: input.audience }),
  };
}

describe('classifyNarrative — session_id_prefix collision disambiguation', () => {
  it('routes a directed narrative to the session_id_prefix recipient, not the agent_name', () => {
    const event = narrative({ eventId: 'directed-to-session-one', addressedTo: aliceSessionOne });

    expect(classifyEventForAgent({ event, self: aliceSessionOne })).toBe('directed');
    expect(classifyEventForAgent({ event, self: aliceSessionTwo })).toBe('observed');
  });

  it('routes a group narrative by session_id_prefix membership', () => {
    const event = narrative({
      eventId: 'audience-includes-session-one',
      audience: [aliceSessionOne],
    });

    expect(classifyEventForAgent({ event, self: aliceSessionOne })).toBe('group');
    expect(classifyEventForAgent({ event, self: aliceSessionTwo })).toBe('observed');
  });

  it('keeps broadcast classification independent of addressee shape', () => {
    const event = narrative({ eventId: 'broadcast-no-routing' });

    expect(classifyEventForAgent({ event, self: aliceSessionOne })).toBe('broadcast');
    expect(classifyEventForAgent({ event, self: aliceSessionTwo })).toBe('broadcast');
  });
});

describe('migrateLegacyCommsRecordCollections — legacy string-form addressed_to', () => {
  it('projects legacy string-form addressed_to to a tuple with unknown session_id_prefix placeholder', () => {
    const legacyNarrative = {
      event_id: 'legacy-001',
      created_at: '2026-04-01T00:00:00Z',
      author: sender,
      title: 'legacy fixture',
      body: 'legacy body',
      addressed_to: 'Mistbound Drifting Vow',
    };

    const result = migrateLegacyCommsRecordCollections({
      narratives: [legacyNarrative],
      lifecycles: [],
      directed: [],
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      kind: 'narrative',
      addressed_to: {
        agent_name: 'Mistbound Drifting Vow',
        session_id_prefix: 'unknown',
      },
    });
  });

  it('projects legacy string-form audience entries to tuples with unknown session_id_prefix placeholders', () => {
    const legacyNarrative = {
      event_id: 'legacy-002',
      created_at: '2026-04-01T00:00:00Z',
      author: sender,
      title: 'legacy fixture with audience',
      body: 'legacy body',
      audience: ['Mistbound Drifting Vow', 'Foamy Charting Fjord'],
    };

    const result = migrateLegacyCommsRecordCollections({
      narratives: [legacyNarrative],
      lifecycles: [],
      directed: [],
    });

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      kind: 'narrative',
      audience: [
        { agent_name: 'Mistbound Drifting Vow', session_id_prefix: 'unknown' },
        { agent_name: 'Foamy Charting Fjord', session_id_prefix: 'unknown' },
      ],
    });
  });
});
