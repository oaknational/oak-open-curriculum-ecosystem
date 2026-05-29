import { describe, expect, it } from 'vitest';

import {
  formatRoutingKey,
  routingKeyFor,
  sameAgentRoutingKey,
  sameIdentity,
} from '../../src/collaboration-state/active-agent-routing';
import { deriveOverrideCollaborationIdentity } from '../../src/collaboration-state/identity';
import { type CollaborationAgentId } from '../../src/collaboration-state/types';

// Two distinct id-bearing identities, derived through the production override
// path so each id is a valid UUID v5 without coupling the test to the v5
// namespace constant. The id seeds from `${agent_name}|${session_id_prefix}`,
// so distinct name/prefix pairs yield distinct ids.
const galactic: CollaborationAgentId = deriveOverrideCollaborationIdentity({
  agent_name: 'Galactic Transiting Orbit',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e18',
});

const verdant: CollaborationAgentId = deriveOverrideCollaborationIdentity({
  agent_name: 'Verdant Climbing Vine',
  platform: 'claude',
  model: 'claude-opus-4-8',
  session_id_prefix: 'f9d588',
});

// An id-less identity stands in for the pre-PDR-076a historical comms rows
// (~90% of the preserved comms archive). Strict routing never lifts these into
// a routing key and never treats them as the same live target as an id-bearing
// identity — the cure for the 2026-05-28 watcher runaway, where every
// historical id-less author emitted a diagnostic on every poll.
const idLess: CollaborationAgentId = {
  agent_name: 'Foamy Charting Fjord',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019e1f',
};

describe('routingKeyFor — strict id-keyed routing (PDR-076a sunset)', () => {
  it('lifts an id-bearing identity to its (agent_name, id) routing key', () => {
    expect(routingKeyFor(galactic)).toStrictEqual({
      agent_name: galactic.agent_name,
      id: galactic.id,
    });
  });

  it('fails fast on an id-less identity rather than falling back', () => {
    expect(() => routingKeyFor(idLess)).toThrow(/id-bearing/);
  });
});

describe('sameAgentRoutingKey — id equality with id-less short-circuit', () => {
  it('is true for two identities sharing the same id', () => {
    const sameSeed = deriveOverrideCollaborationIdentity({
      agent_name: 'Galactic Transiting Orbit',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e18',
    });

    expect(sameAgentRoutingKey(galactic, sameSeed)).toBe(true);
  });

  it('is false for two distinct id-bearing identities', () => {
    expect(sameAgentRoutingKey(galactic, verdant)).toBe(false);
  });

  it('is false when either side is id-less, without throwing (runaway cure)', () => {
    expect(sameAgentRoutingKey(idLess, galactic)).toBe(false);
    expect(sameAgentRoutingKey(galactic, idLess)).toBe(false);
    expect(sameAgentRoutingKey(idLess, idLess)).toBe(false);
  });
});

describe('sameIdentity — routing key plus model', () => {
  it('is true when routing key and model both match', () => {
    const sameSeed = deriveOverrideCollaborationIdentity({
      agent_name: 'Galactic Transiting Orbit',
      platform: 'codex',
      model: 'GPT-5',
      session_id_prefix: '019e18',
    });

    expect(sameIdentity(galactic, sameSeed)).toBe(true);
  });

  it('is false when the routing key matches but the model differs', () => {
    const sameKeyDifferentModel = deriveOverrideCollaborationIdentity({
      agent_name: 'Galactic Transiting Orbit',
      platform: 'codex',
      model: 'GPT-5-Codex',
      session_id_prefix: '019e18',
    });

    expect(sameIdentity(galactic, sameKeyDifferentModel)).toBe(false);
  });
});

describe('formatRoutingKey — human-readable id-keyed form', () => {
  it('renders agent_name and id', () => {
    expect(formatRoutingKey(routingKeyFor(galactic))).toBe(
      `${galactic.agent_name} / id:${galactic.id}`,
    );
  });
});
