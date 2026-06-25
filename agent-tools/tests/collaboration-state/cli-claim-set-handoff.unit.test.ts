/**
 * Covers the pure builders behind `claims set-handoff` (PDR-063 step 3 — the
 * retiring agent records a handoff-record pointer on its own claim):
 * `setHandoffPathOnClaims` sets `handoff_record_path` on exactly the matching
 * row without changing the row count, and `assertHandoffPathShape` constrains
 * the pointer to a repo-root-relative path under the handoffs directory
 * (extension-agnostic — live records are `.md`, the schema description says
 * `.json`).
 */
import { describe, expect, it } from 'vitest';

import {
  assertHandoffPathShape,
  setHandoffPathOnClaims,
} from '../../src/collaboration-state/cli-claim-handoff-commands';
import {
  type CollaborationAgentId,
  type CollaborationClaim,
} from '../../src/collaboration-state/types';

const woodland: CollaborationAgentId = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
};

const idOne = '11111111-1111-4111-8111-111111111111';
const idTwo = '22222222-2222-4222-8222-222222222222';
const handoffPath = `.agent/state/collaboration/handoffs/${idOne}.md`;

function claim(overrides: Partial<CollaborationClaim> = {}): CollaborationClaim {
  return {
    claim_id: idOne,
    agent_id: woodland,
    thread: 'agentic-engineering-enhancements',
    areas: [{ kind: 'files', patterns: ['agent-tools/**'] }],
    claimed_at: '2026-06-25T08:00:00Z',
    freshness_seconds: 14400,
    sidebar_open: false,
    intent: 'Test claim.',
    ...overrides,
  };
}

describe('setHandoffPathOnClaims', () => {
  it('sets handoff_record_path on the matching row and leaves the row count unchanged', () => {
    const claims = [claim(), claim({ claim_id: idTwo })];

    const next = setHandoffPathOnClaims(claims, { claimId: idOne, path: handoffPath });

    expect(next).toHaveLength(2);
    expect(next.find((c) => c.claim_id === idOne)?.handoff_record_path).toBe(handoffPath);
    expect(next.find((c) => c.claim_id === idTwo)?.handoff_record_path).toBeUndefined();
  });

  it('overwrites idempotently — double-apply equals single-apply', () => {
    const claims = [claim()];

    const once = setHandoffPathOnClaims(claims, { claimId: idOne, path: handoffPath });
    const twice = setHandoffPathOnClaims(once, { claimId: idOne, path: handoffPath });

    expect(twice).toEqual(once);
  });
});

describe('assertHandoffPathShape', () => {
  it('accepts a repo-root-relative path under the handoffs directory (.md and .json)', () => {
    expect(() =>
      assertHandoffPathShape('.agent/state/collaboration/handoffs/abc.md'),
    ).not.toThrow();
    expect(() =>
      assertHandoffPathShape('.agent/state/collaboration/handoffs/abc.json'),
    ).not.toThrow();
  });

  it('rejects absolute paths, parent traversal, and paths outside the handoffs directory', () => {
    expect(() => assertHandoffPathShape('/etc/passwd')).toThrow();
    expect(() =>
      assertHandoffPathShape('.agent/state/collaboration/handoffs/../escape.md'),
    ).toThrow();
    expect(() => assertHandoffPathShape('.agent/state/collaboration/comms/x.json')).toThrow();
  });

  it('rejects the bare handoffs directory and nested paths (must name a file directly)', () => {
    expect(() => assertHandoffPathShape('.agent/state/collaboration/handoffs/')).toThrow();
    expect(() => assertHandoffPathShape('.agent/state/collaboration/handoffs/sub/x.md')).toThrow();
  });
});
