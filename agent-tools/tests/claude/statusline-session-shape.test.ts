/**
 * Fixture-matrix coverage for the pure session-shape resolver: team shape
 * (solo / peer / directed), claim freshness (fresh vs stale vs heartbeat-
 * refreshed), own-role resolution, ARC liveness (present-fresh /
 * present-stale / absent / participant mismatch), soft degradation on
 * missing inputs, and the primary-worktree-root porcelain contract.
 *
 * All inputs are explicit literals — no filesystem, no clock, no env.
 */
import { describe, expect, it } from 'vitest';

import {
  resolveSessionShape,
  type ExperimentsEntry,
} from '../../src/claude/statusline-session-shape';
import {
  type CollaborationClaim,
  type CollaborationRegistry,
} from '../../src/collaboration-state/types';

const NOW = '2026-06-12T12:00:00Z';
const FRESH = '2026-06-12T11:30:00Z'; // 30 min before NOW, inside the 4h default TTL
const STALE = '2026-06-12T06:00:00Z'; // 6h before NOW, outside the 4h default TTL

function claim(
  overrides: Partial<CollaborationClaim> & { agent_name: string },
): CollaborationClaim {
  const { agent_name, ...claimOverrides } = overrides;
  return {
    claim_id: '11111111-1111-4111-8111-111111111111',
    agent_id: {
      agent_name,
      platform: 'claude-code',
      model: 'Fable 5',
      session_id_prefix: agent_name.slice(0, 6).toLowerCase(),
    },
    thread: 'agentic-engineering-enhancements',
    areas: [{ kind: 'files', patterns: ['agent-tools/src/claude/statusline-render.ts'] }],
    claimed_at: FRESH,
    intent: 'Fixture claim for session-shape resolution.',
    ...claimOverrides,
  };
}

function registry(claims: readonly CollaborationClaim[]): CollaborationRegistry {
  return { schema_version: '1.3.0', commit_queue: [], claims };
}

function arc(name: string, mtimeIso: string): ExperimentsEntry {
  return { name, mtimeIso };
}

describe('resolveSessionShape — team shape', () => {
  it('resolves solo for an empty registry', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape).toStrictEqual({ ownRole: undefined, teamShape: 'solo', arcActive: false });
  });

  it('resolves solo when the only fresh claims are my own', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus' }),
        claim({
          agent_name: 'Monsoon guards Cirrus',
          claim_id: '22222222-2222-4222-8222-222222222222',
        }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('solo');
  });

  it('resolves peer for two distinct fresh identities with no director', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus' }),
        claim({ agent_name: 'Fern lifts Mulch' }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('peer');
  });

  it('resolves directed when any fresh claim carries the director role', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus' }),
        claim({ agent_name: 'Tempest spins Stratosphere', role: 'director' }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('directed');
  });

  it('ignores a stale director claim — staleness wins over role', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus' }),
        claim({ agent_name: 'Tempest spins Stratosphere', role: 'director', claimed_at: STALE }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('solo');
  });

  it('counts a stale-claimed_at but heartbeat-refreshed peer as live', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus' }),
        claim({ agent_name: 'Fern lifts Mulch', claimed_at: STALE, heartbeat_at: FRESH }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('peer');
  });

  it('counts a claim exactly at its freshness TTL as still live', () => {
    // Default TTL 14400s; claimed_at + TTL === NOW is not yet expired.
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus' }),
        claim({ agent_name: 'Fern lifts Mulch', claimed_at: '2026-06-12T08:00:00Z' }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('peer');
  });

  it('treats a claim one second past its freshness TTL as stale', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus' }),
        claim({ agent_name: 'Fern lifts Mulch', claimed_at: '2026-06-12T07:59:59Z' }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('solo');
  });

  it('drops to observing when my own claim expires past its TTL but a peer stays fresh', () => {
    // The membership gate pivots on my own claim's freshness: once mine is
    // stale I am no longer a member, so a still-fresh peer reads as observing,
    // not peer.
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus', claimed_at: '2026-06-12T07:59:59Z' }),
        claim({ agent_name: 'Fern lifts Mulch' }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('observing');
  });

  it('resolves observing when others are fresh but I hold no claim', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([claim({ agent_name: 'Fern lifts Mulch' })]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('observing');
  });

  it('reports observing — not directed — when a director is active but I am not a member', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Fern lifts Mulch' }),
        claim({ agent_name: 'Tempest spins Stratosphere', role: 'director' }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('observing');
  });

  it('resolves solo — not observing — when the only other claims are stale', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([claim({ agent_name: 'Fern lifts Mulch', claimed_at: STALE })]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('solo');
  });

  it('resolves the same shape regardless of commit_queue content', () => {
    const queued: CollaborationRegistry = {
      schema_version: '1.3.0',
      commit_queue: [
        {
          intent_id: '99999999-9999-4999-8999-999999999999',
          claim_id: '11111111-1111-4111-8111-111111111111',
          agent_id: {
            agent_name: 'Fern lifts Mulch',
            platform: 'claude-code',
            model: 'Fable 5',
            session_id_prefix: 'fernli',
          },
          files: ['agent-tools/src/claude/statusline-render.ts'],
          commit_subject: 'feat: fixture queue entry',
          queued_at: FRESH,
          updated_at: FRESH,
          expires_at: '2026-06-12T12:30:00Z',
          phase: 'queued',
        },
      ],
      claims: [
        claim({ agent_name: 'Monsoon guards Cirrus' }),
        claim({ agent_name: 'Fern lifts Mulch' }),
      ],
    };

    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: queued,
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.teamShape).toBe('peer');
  });
});

describe('resolveSessionShape — own role', () => {
  it('resolves my role from my fresh role-bearing claim', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([claim({ agent_name: 'Monsoon guards Cirrus', role: 'director' })]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.ownRole).toBe('director');
  });

  it('leaves ownRole undefined when my claims carry no role', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus' }),
        claim({ agent_name: 'Fern lifts Mulch', role: 'curator' }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.ownRole).toBeUndefined();
  });

  it('does not take a role from my stale claim', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([
        claim({ agent_name: 'Monsoon guards Cirrus', role: 'marshal', claimed_at: STALE }),
      ]),
      experimentsListing: [],
      nowIso: NOW,
    });

    expect(shape.ownRole).toBeUndefined();
  });
});

describe('resolveSessionShape — ARC liveness', () => {
  it('raises the wing for a fresh channel naming this agent', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([]),
      experimentsListing: [
        arc('arc-monsoon-guards-cirrus-and-fern/README.md', '2026-06-12T11:50:00Z'),
      ],
      nowIso: NOW,
    });

    expect(shape.arcActive).toBe(true);
  });

  it('keeps the wing down for a stale channel naming this agent', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([]),
      experimentsListing: [
        arc('arc-monsoon-guards-cirrus-and-fern/README.md', '2026-06-12T10:00:00Z'),
      ],
      nowIso: NOW,
    });

    expect(shape.arcActive).toBe(false);
  });

  it('raises the wing for a channel written exactly at the window edge', () => {
    // 1800s window, inclusive: NOW minus exactly 1800s still counts.
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([]),
      experimentsListing: [
        arc('arc-monsoon-guards-cirrus-and-fern/README.md', '2026-06-12T11:30:00Z'),
      ],
      nowIso: NOW,
    });

    expect(shape.arcActive).toBe(true);
  });

  it('keeps the wing down one second outside the window', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([]),
      experimentsListing: [
        arc('arc-monsoon-guards-cirrus-and-fern/README.md', '2026-06-12T11:29:59Z'),
      ],
      nowIso: NOW,
    });

    expect(shape.arcActive).toBe(false);
  });

  it('keeps the wing down for a fresh channel naming other participants', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([]),
      experimentsListing: [
        arc('arc-fern-lifts-mulch-and-tempest/README.md', '2026-06-12T11:59:00Z'),
      ],
      nowIso: NOW,
    });

    expect(shape.arcActive).toBe(false);
  });

  it('matches participant names across separator conventions', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([]),
      experimentsListing: [arc('Monsoon_Guards_Cirrus.gelling.md', '2026-06-12T11:59:00Z')],
      nowIso: NOW,
    });

    expect(shape.arcActive).toBe(true);
  });

  it('keeps the wing down for a future-dated channel (clock skew yields a negative age)', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: registry([]),
      experimentsListing: [
        arc('arc-monsoon-guards-cirrus-and-fern/README.md', '2026-06-12T12:05:00Z'),
      ],
      nowIso: NOW,
    });

    expect(shape.arcActive).toBe(false);
  });
});

describe('resolveSessionShape — soft degradation', () => {
  it('reads an unreadable registry as unknown, not a false solo', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: undefined,
      experimentsListing: undefined,
      nowIso: NOW,
    });

    expect(shape).toStrictEqual({ ownRole: undefined, teamShape: 'unknown', arcActive: false });
  });

  it('still raises the wing when the registry is unreadable but a channel is live', () => {
    const shape = resolveSessionShape({
      ownAgentName: 'Monsoon guards Cirrus',
      registry: undefined,
      experimentsListing: [
        arc('arc-monsoon-guards-cirrus-and-fern/README.md', '2026-06-12T11:50:00Z'),
      ],
      nowIso: NOW,
    });

    expect(shape).toStrictEqual({ ownRole: undefined, teamShape: 'unknown', arcActive: true });
  });

  it('reads others as observing — never a team this session joined — without an identity', () => {
    // No resolved identity cannot be matched to any claim, so the session is a
    // non-member: other live claims read as observing, not directed/peer, and
    // there is no own-role or participant-matched wing.
    const shape = resolveSessionShape({
      ownAgentName: undefined,
      registry: registry([
        claim({ agent_name: 'Fern lifts Mulch' }),
        claim({ agent_name: 'Tempest spins Stratosphere', role: 'director' }),
      ]),
      experimentsListing: [arc('arc-fern-and-tempest/README.md', '2026-06-12T11:59:00Z')],
      nowIso: NOW,
    });

    expect(shape).toStrictEqual({ ownRole: undefined, teamShape: 'observing', arcActive: false });
  });
});
