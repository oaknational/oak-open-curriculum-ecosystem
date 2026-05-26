/**
 * Indirect tests for the private `parseAgentId` parser via
 * `parseCollaborationRegistry` (Phase 0B Cycle 4). The parser is now
 * schema-driven (Commandment 12 fix): instead of hand-building the object
 * field-by-field, it parses through `collaborationAgentIdSchema`. This
 * test asserts behaviour the schema-driven parser must preserve:
 *
 * - Legacy registries written before PDR-076a still parse (id optional on
 *   read-side).
 * - Registries authored post-PDR-076a parse and round-trip the v5 id.
 * - Malformed id values are rejected at the boundary (Zod parse error
 *   surfaces; the hand-built parser would have silently let any string
 *   through).
 * - Required identity fields remain required.
 */
import { describe, expect, it } from 'vitest';

import { parseCollaborationRegistry } from '../../src/collaboration-state/state-parsers.js';

function registryWithClaim(agentId: unknown): string {
  return JSON.stringify({
    schema_version: '1.3.0',
    commit_queue: [],
    claims: [
      {
        claim_id: 'claim-one',
        agent_id: agentId,
        thread: 'agentic-engineering-enhancements',
        areas: [{ kind: 'files', patterns: ['src/x.ts'] }],
        claimed_at: '2026-05-26T18:00:00Z',
        intent: 'Test parseAgentId via registry.',
      },
    ],
  });
}

const legacyAgentId = {
  agent_name: 'Legacy Agent',
  platform: 'claude',
  model: 'opus-4-7',
  session_id_prefix: 'abc123',
};

const v5AgentId = {
  ...legacyAgentId,
  id: '886313e1-3b8a-5372-9b90-0c9aee199e5d',
};

function firstClaim(registry: ReturnType<typeof parseCollaborationRegistry>) {
  const claim = registry.claims[0];
  if (claim === undefined) {
    throw new Error('expected at least one claim in the registry');
  }
  return claim;
}

describe('parseAgentId (via parseCollaborationRegistry) — schema-driven (Cycle 4)', () => {
  it('parses a legacy registry entry without id (additive migration path)', () => {
    const registry = parseCollaborationRegistry(registryWithClaim(legacyAgentId));
    expect(firstClaim(registry).agent_id).toStrictEqual(legacyAgentId);
  });

  it('parses a post-PDR-076a registry entry carrying a v5 id and preserves it', () => {
    const registry = parseCollaborationRegistry(registryWithClaim(v5AgentId));
    const agentId = firstClaim(registry).agent_id;
    expect(agentId.id).toBe(v5AgentId.id);
    expect(agentId.agent_name).toBe(v5AgentId.agent_name);
  });

  it('rejects an agent_id whose id is malformed (non-UUID-v5 string)', () => {
    expect(() =>
      parseCollaborationRegistry(registryWithClaim({ ...legacyAgentId, id: 'not-a-uuid' })),
    ).toThrow();
  });

  it('rejects an agent_id whose id is a UUID v4 (version nibble != 5)', () => {
    expect(() =>
      parseCollaborationRegistry(
        registryWithClaim({ ...legacyAgentId, id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' }),
      ),
    ).toThrow();
  });

  it('rejects an agent_id missing a required identity field', () => {
    const withoutName = {
      platform: legacyAgentId.platform,
      model: legacyAgentId.model,
      session_id_prefix: legacyAgentId.session_id_prefix,
    };
    expect(() => parseCollaborationRegistry(registryWithClaim(withoutName))).toThrow();
  });
});
