import { describe, expect, it } from 'vitest';

import { classifyEventForAgent } from '../../src/collaboration-state/comms-use-cases';
import { migrateLegacyCommsRecordCollections } from '../../src/collaboration-state/comms-migration-records';
import {
  type CollaborationAgentId,
  type DirectedCommsMessage,
  type NarrativeCommsEvent,
  uuidV5Schema,
} from '../../src/collaboration-state/types';

/**
 * Identity-collision regression test: comms routing for narrative and
 * directed events disambiguates by the PDR-076a `id` (UUID v5), not by
 * `agent_name` or `session_id_prefix`. Two agents sharing the same display
 * name AND session_id_prefix but running distinct sessions (distinct ids)
 * MUST each classify only their own id-matched events.
 *
 * The PDR-076a Phase 3 sunset (2026-05-29) removed the legacy
 * `(agent_name, session_id_prefix)` routing fallback, so disambiguation is
 * by `id` alone — see the falsifiability block below.
 *
 * The migration test covers legacy string-form `addressed_to`/`audience`
 * being projected to tuples with `'unknown'` placeholders by
 * `migrateLegacyCommsRecordCollections`.
 */

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

describe('PDR-076a §Falsifiability — same name + same prefix + different id', () => {
  // The exact failure mode that motivated PDR-076a + this plan: two agents
  // sharing the same display name AND session_id_prefix word-for-word but
  // running distinct sessions. Before id-aware routing, every comparator
  // collapses them into one routing identity and the second agent receives
  // messages addressed to the first. With id-aware routing, the directed
  // event reaches only the id-matched agent.
  const sharedName = 'Mistbound Drifting Vow';
  const sharedPrefix = 'cccccc';
  // Parse through the brand schema so the UuidV5 nominal type is satisfied at
  // compile time. Plain string literals can't be assigned to the brand.
  const idAlpha = uuidV5Schema.parse('aaaaaaaa-aaaa-5aaa-9aaa-aaaaaaaaaaaa');
  const idBeta = uuidV5Schema.parse('bbbbbbbb-bbbb-5bbb-9bbb-bbbbbbbbbbbb');

  const agentAlpha: CollaborationAgentId = {
    agent_name: sharedName,
    platform: 'claude',
    model: 'claude-opus-4-7',
    session_id_prefix: sharedPrefix,
    id: idAlpha,
  };

  const agentBeta: CollaborationAgentId = {
    agent_name: sharedName,
    platform: 'claude',
    model: 'claude-opus-4-7',
    session_id_prefix: sharedPrefix,
    id: idBeta,
  };

  function directedTo(recipient: CollaborationAgentId): DirectedCommsMessage {
    return {
      schema_version: '2.0.0',
      event_id: 'directed-to-alpha',
      created_at: '2026-05-26T18:00:00Z',
      kind: 'directed',
      message_kind: 'coordination-request',
      from: sender,
      to: recipient,
      subject: 'PDR-076a falsifiability fixture',
      body: 'addressed by id',
    };
  }

  it('classifyDirected: a directed event addressed to agentAlpha reaches only the id-matched agent', () => {
    const event = directedTo(agentAlpha);

    expect(classifyEventForAgent({ event, self: agentAlpha })).toBe('directed');
    // The pre-cure failure mode: routing by (name, prefix) alone would
    // return 'directed' here and the message would silently land in
    // Beta's inbox. Id-aware routing must keep it at 'observed'.
    expect(classifyEventForAgent({ event, self: agentBeta })).toBe('observed');
  });

  it('classifyNarrative: a narrative addressed_to agentAlpha reaches only the id-matched agent', () => {
    const event = narrative({ eventId: 'narrative-to-alpha', addressedTo: agentAlpha });

    expect(classifyEventForAgent({ event, self: agentAlpha })).toBe('directed');
    expect(classifyEventForAgent({ event, self: agentBeta })).toBe('observed');
  });

  it('classifyNarrative: a group narrative whose audience names agentAlpha excludes agentBeta', () => {
    const event = narrative({
      eventId: 'group-includes-alpha',
      audience: [agentAlpha],
    });

    expect(classifyEventForAgent({ event, self: agentAlpha })).toBe('group');
    expect(classifyEventForAgent({ event, self: agentBeta })).toBe('observed');
  });

  it('isSelfAuthored: an event authored by agentAlpha is self-only-for-Alpha (Beta sees it as not-self)', () => {
    const event: DirectedCommsMessage = {
      schema_version: '2.0.0',
      event_id: 'self-alpha',
      created_at: '2026-05-26T18:00:00Z',
      kind: 'directed',
      message_kind: 'coordination-request',
      from: agentAlpha,
      to: agentBeta,
      subject: 'self-authored by alpha',
      body: 'alpha to beta',
    };

    // Alpha sees their own event as self (returns undefined per classifyEventForAgent contract)
    expect(classifyEventForAgent({ event, self: agentAlpha })).toBeUndefined();
    // Beta sees it as a directed event to themselves (id-matched recipient)
    expect(classifyEventForAgent({ event, self: agentBeta })).toBe('directed');
  });

  it('classifyNarrative: an id-less audience member is never a group member (sunset short-circuit)', () => {
    // A legacy/un-migrated identity carries no `id`. The sunset makes
    // sameAgentRoutingKey short-circuit to false for any id-less entry, so an
    // audience composed only of id-less members resolves to 'observed' for
    // every id-bearing agent — never 'group'. This is the live sunset contract:
    // un-migrated identities do not route.
    const idLessMember: CollaborationAgentId = {
      agent_name: sharedName,
      platform: 'claude',
      model: 'claude-opus-4-7',
      session_id_prefix: sharedPrefix,
    };
    const event = narrative({ eventId: 'idless-audience', audience: [idLessMember] });

    expect(classifyEventForAgent({ event, self: agentAlpha })).toBe('observed');
    expect(classifyEventForAgent({ event, self: agentBeta })).toBe('observed');
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
