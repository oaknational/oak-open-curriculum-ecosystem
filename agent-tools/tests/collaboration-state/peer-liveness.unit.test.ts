import { describe, expect, it } from 'vitest';

import {
  ACTIVE_BELOW_MS,
  RETIRED_AT_OR_ABOVE_MS,
  peerHeartbeatLiveness,
} from '../../src/collaboration-state/peer-liveness';
import { uuidV5Schema } from '../../src/collaboration-state/agent-id';
import { type CollaborationAgentId, type CommsEvent } from '../../src/collaboration-state/types';

const NOW_MS = 1_000_000_000_000;

// Branded UuidV5 via the schema (the established test idiom) — `id` is the
// PDR-076a routing weight peer-liveness groups by.
const peerA: CollaborationAgentId = {
  agent_name: 'Pangolin weaves Nightfall',
  platform: 'claude',
  model: 'claude-opus-4-8',
  session_id_prefix: 'c680e4',
  id: uuidV5Schema.parse('11111111-1111-5111-9111-111111111111'),
};

const peerB: CollaborationAgentId = {
  agent_name: 'Avocet tracks Crag',
  platform: 'claude',
  model: 'claude-opus-4-8',
  session_id_prefix: '30fe5b',
  id: uuidV5Schema.parse('22222222-2222-5222-9222-222222222222'),
};

const self: CollaborationAgentId = {
  agent_name: 'Ingot tracks Brilliance',
  platform: 'claude',
  model: 'claude-opus-4-8',
  session_id_prefix: 'fe57ce',
  id: uuidV5Schema.parse('33333333-3333-5333-9333-333333333333'),
};

let eventCounter = 0;

function heartbeatAt(author: CollaborationAgentId, ageMs: number): CommsEvent {
  eventCounter += 1;
  return {
    schema_version: '2.0.0',
    event_id: `evt-${eventCounter}`,
    created_at: new Date(NOW_MS - ageMs).toISOString(),
    kind: 'narrative',
    author,
    title: `Heartbeat: ${author.agent_name}`,
    body: 'active; claim=x; intent=x; branch=b; cycle=c',
    tags: ['heartbeat'],
  };
}

function narrativeAt(
  author: CollaborationAgentId,
  ageMs: number,
  tags?: readonly string[],
): CommsEvent {
  eventCounter += 1;
  return {
    schema_version: '2.0.0',
    event_id: `evt-${eventCounter}`,
    created_at: new Date(NOW_MS - ageMs).toISOString(),
    kind: 'narrative',
    author,
    title: 'Some narrative',
    body: 'prose',
    ...(tags === undefined ? {} : { tags }),
  };
}

describe('peerHeartbeatLiveness — peer heartbeat-silence classification over the comms event stream', () => {
  it('classifies a peer whose latest heartbeat is younger than 4 minutes as active', () => {
    const reports = peerHeartbeatLiveness({
      events: [heartbeatAt(peerA, 60_000)],
      nowMs: NOW_MS,
    });

    expect(reports).toHaveLength(1);
    expect(reports[0].state).toBe('active');
    expect(reports[0].identity).toStrictEqual(peerA);
    expect(reports[0].ageMs).toBe(60_000);
  });

  it('classifies a peer 4–10 minutes silent as offline (transient)', () => {
    const reports = peerHeartbeatLiveness({
      events: [heartbeatAt(peerA, 5 * 60_000)],
      nowMs: NOW_MS,
    });

    expect(reports[0].state).toBe('offline');
  });

  it('classifies a peer silent for 10 minutes or more as retired — this is the F-75 "fires" case', () => {
    const reports = peerHeartbeatLiveness({
      events: [heartbeatAt(peerA, 10 * 60_000)],
      nowMs: NOW_MS,
    });

    expect(reports[0].state).toBe('retired');
    expect(reports[0].ageMs).toBe(10 * 60_000);
  });

  it('exposes the PDR-078 thresholds as 4 and 10 minutes', () => {
    // Pin the constants to the doctrine values so the literal-driven boundary
    // tests below cannot silently drift if a constant is mis-set.
    expect(ACTIVE_BELOW_MS).toBe(4 * 60_000);
    expect(RETIRED_AT_OR_ABOVE_MS).toBe(10 * 60_000);
  });

  it('treats exactly 4 minutes as offline (active is strictly under 4 min)', () => {
    const reports = peerHeartbeatLiveness({
      events: [heartbeatAt(peerA, 4 * 60_000)],
      nowMs: NOW_MS,
    });

    expect(reports[0].state).toBe('offline');
  });

  it('treats one millisecond before 10 minutes as offline, not retired (boundary)', () => {
    const reports = peerHeartbeatLiveness({
      events: [heartbeatAt(peerA, 10 * 60_000 - 1)],
      nowMs: NOW_MS,
    });

    expect(reports[0].state).toBe('offline');
  });

  it('uses the LATEST heartbeat per peer (older heartbeats do not mask current silence)', () => {
    const reports = peerHeartbeatLiveness({
      // a fresh one earlier in the array, a stale latest — latest wins
      events: [heartbeatAt(peerA, 30 * 60_000), heartbeatAt(peerA, 12 * 60_000)],
      nowMs: NOW_MS,
    });

    expect(reports).toHaveLength(1);
    expect(reports[0].state).toBe('retired');
    expect(reports[0].ageMs).toBe(12 * 60_000);
  });

  it('reports one entry per peer, grouped by identity routing key', () => {
    const reports = peerHeartbeatLiveness({
      events: [heartbeatAt(peerA, 30_000), heartbeatAt(peerB, 11 * 60_000)],
      nowMs: NOW_MS,
    });

    expect(reports).toHaveLength(2);
    const byName = Object.fromEntries(reports.map((r) => [r.identity.agent_name, r.state]));
    expect(byName['Pangolin weaves Nightfall']).toBe('active');
    expect(byName['Avocet tracks Crag']).toBe('retired');
  });

  it('excludes the calling agent when self is provided', () => {
    const reports = peerHeartbeatLiveness({
      events: [heartbeatAt(self, 60_000), heartbeatAt(peerA, 60_000)],
      nowMs: NOW_MS,
      self,
    });

    expect(reports).toHaveLength(1);
    expect(reports[0].identity.agent_name).toBe('Pangolin weaves Nightfall');
  });

  it('ignores non-heartbeat events (untagged narrative, other tags)', () => {
    const reports = peerHeartbeatLiveness({
      events: [narrativeAt(peerA, 60_000), narrativeAt(peerA, 60_000, ['behaviour-note'])],
      nowMs: NOW_MS,
    });

    expect(reports).toHaveLength(0);
  });

  it('returns an empty list when there are no heartbeat events', () => {
    expect(peerHeartbeatLiveness({ events: [], nowMs: NOW_MS })).toStrictEqual([]);
  });

  it('skips id-less historical heartbeats without throwing (PDR-076a: not a live peer)', () => {
    const idless: CollaborationAgentId = {
      agent_name: 'Ancient Drifting Relic',
      platform: 'claude',
      model: 'claude-opus-4-7',
      session_id_prefix: 'aa0000',
    };

    const reports = peerHeartbeatLiveness({
      events: [heartbeatAt(idless, 60_000), heartbeatAt(peerA, 60_000)],
      nowMs: NOW_MS,
    });

    expect(reports).toHaveLength(1);
    expect(reports[0].identity.agent_name).toBe('Pangolin weaves Nightfall');
  });

  it('attributes a directed-kind heartbeat to its author (from), not the recipient', () => {
    const directedHeartbeat: CommsEvent = {
      schema_version: '2.0.0',
      event_id: 'directed-hb',
      created_at: new Date(NOW_MS - 60_000).toISOString(),
      kind: 'directed',
      message_kind: 'status',
      from: peerA,
      to: peerB,
      subject: 'Heartbeat',
      body: 'active; claim=x; intent=x; branch=b; cycle=c',
      tags: ['heartbeat'],
    };

    const reports = peerHeartbeatLiveness({ events: [directedHeartbeat], nowMs: NOW_MS });

    expect(reports).toHaveLength(1);
    expect(reports[0].identity.agent_name).toBe('Pangolin weaves Nightfall');
  });

  it('orders two retired peers most-stale-first by heartbeat age', () => {
    const reports = peerHeartbeatLiveness({
      events: [heartbeatAt(peerA, 12 * 60_000), heartbeatAt(peerB, 25 * 60_000)],
      nowMs: NOW_MS,
    });

    expect(reports.map((r) => r.identity.agent_name)).toStrictEqual([
      'Avocet tracks Crag', // 25 min — more stale, leads
      'Pangolin weaves Nightfall', // 12 min
    ]);
    expect(reports.every((r) => r.state === 'retired')).toBe(true);
  });

  it('skips a heartbeat with an unparseable created_at, never manufacturing a retired verdict', () => {
    const malformed: CommsEvent = {
      schema_version: '2.0.0',
      event_id: 'bad-ts',
      created_at: 'not-a-date',
      kind: 'narrative',
      author: peerA,
      title: 'Heartbeat',
      body: 'active; claim=x; intent=x; branch=b; cycle=c',
      tags: ['heartbeat'],
    };

    const reports = peerHeartbeatLiveness({
      events: [malformed, heartbeatAt(peerB, 60_000)],
      nowMs: NOW_MS,
    });

    // peerA (only a malformed heartbeat) is absent — NOT reported as retired;
    // the corrupt event does not hide the live peerB.
    expect(reports).toHaveLength(1);
    expect(reports[0].identity.agent_name).toBe('Avocet tracks Crag');
  });
});
