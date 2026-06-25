/**
 * Covers the pure builder behind `claims adopt` (PDR-063 pickup item 4 — the
 * successor takes over a retiring agent's claim): `adoptClaims` rewrites the
 * matching row's `agent_id` to the adopting identity IN PLACE — never appending
 * a row (the duplicate-row bug F-94 cured) — and preserves the rest of the row,
 * including `handoff_record_path`, `role`, and `claimed_at` (the successor
 * clears the pointer only on a separate, deliberate act per PDR-063).
 */
import { describe, expect, it } from 'vitest';

import { adoptClaims } from '../../src/collaboration-state/cli-claim-handoff-commands';
import {
  type CollaborationAgentId,
  type CollaborationClaim,
} from '../../src/collaboration-state/types';

const retiree: CollaborationAgentId = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
};

const successor: CollaborationAgentId = {
  agent_name: 'Seal hunts Offing',
  platform: 'claude',
  model: 'Opus 4.8',
  session_id_prefix: '8210d6',
};

const idOne = '11111111-1111-4111-8111-111111111111';
const idTwo = '22222222-2222-4222-8222-222222222222';

function claim(overrides: Partial<CollaborationClaim> = {}): CollaborationClaim {
  return {
    claim_id: idOne,
    agent_id: retiree,
    thread: 'agentic-engineering-enhancements',
    areas: [{ kind: 'files', patterns: ['agent-tools/**'] }],
    claimed_at: '2026-06-25T08:00:00Z',
    freshness_seconds: 14400,
    sidebar_open: false,
    role: 'implementer',
    handoff_record_path: `.agent/state/collaboration/handoffs/${idOne}.md`,
    intent: 'Test claim.',
    ...overrides,
  };
}

describe('adoptClaims', () => {
  it('rewrites agent_id on the matching row in place, leaving the row count unchanged', () => {
    const claims = [claim(), claim({ claim_id: idTwo, agent_id: retiree })];

    const next = adoptClaims(claims, { claimId: idOne, identity: successor });

    expect(next).toHaveLength(2);
    expect(next.find((c) => c.claim_id === idOne)?.agent_id).toEqual(successor);
    expect(next.find((c) => c.claim_id === idTwo)?.agent_id).toEqual(retiree);
  });

  it('preserves handoff_record_path, role, and claimed_at on the adopted row', () => {
    const original = claim();

    const adopted = adoptClaims([original], { claimId: idOne, identity: successor }).find(
      (c) => c.claim_id === idOne,
    );

    expect(adopted).toMatchObject({
      agent_id: successor,
      handoff_record_path: original.handoff_record_path,
      role: original.role,
      claimed_at: original.claimed_at,
    });
  });

  it('rewrites every row when historical duplicate rows share one claim_id, adding none', () => {
    const claims = [claim(), claim()];

    const next = adoptClaims(claims, { claimId: idOne, identity: successor });

    expect(next).toHaveLength(2);
    expect(next.every((c) => c.agent_id.agent_name === successor.agent_name)).toBe(true);
  });
});
