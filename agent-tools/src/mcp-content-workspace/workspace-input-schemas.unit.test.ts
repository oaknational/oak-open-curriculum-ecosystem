import { describe, expect, it } from 'vitest';
import { parseBaselineRegistry, parseCurrentSourceProjection } from './workspace-input-schemas.js';

const observation = {
  initialize: { instructions: 'present' },
  tools: { live: ['search'], dormant: [] },
  resources: { live: [], dormant: ['docs://old'] },
  prompts: { capability: 'absent', list: 'method-not-found' },
};

const summary = Object.fromEntries(
  [
    'itemCount',
    'baselineItemCount',
    'additionCount',
    'availableCount',
    'retiredCount',
    'unchangedCount',
    'expandedCount',
    'modifiedCount',
    'relocatedCount',
    'addedCount',
    'workspaceScopeInCount',
    'workspaceScopeOutUpstreamApiCount',
    'workspaceAuthorityCount',
    'upstreamApiAuthorityCount',
    'upstreamSkillsAuthorityCount',
    'externalThirdPartyAuthorityCount',
    'itemLiveBindingCount',
    'itemDormantBindingCount',
  ].map((key) => [key, 0]),
);

function projection(item: Record<string, unknown>, extra: Record<string, unknown> = {}): string {
  return JSON.stringify({
    schemaVersion: 2,
    provenance: {
      title: 'Current source',
      baselineCommit: 'abc123',
      baselineArtifact: 'registry.json',
      baselineSha256: 'deadbeef',
      currentEvidence: [],
      evidenceCeiling: [],
    },
    summary,
    registrationRoots: [
      {
        id: 'oak-curriculum-http',
        rootRef: 'apps/http',
        transport: 'in-memory',
        registrationRef: 'src/server.ts',
        proof: 'walked',
        observation,
      },
    ],
    items: [item],
    hostEvidence: [],
    ...extra,
  });
}

const registryItem = {
  id: 'C001',
  file: 'src/a.ts',
  lines: '1',
  identifier: 'GREETING',
  surface_type: 'tool-guidance',
  impact_tier: 'high-impact',
  review_domain: 'pedagogy',
  extraction_kind: 'leaf-authored',
  source_locus: 'this-repo',
  upstream_source: null,
  provenance: 'authored',
  audience: 'agent',
  exemption: 'in-scope-repo-controlled',
  behavioural_intent: 'Point the agent at the orientation tool.',
  reasoning: 'r',
  snippet: 's',
  measurability: 'm',
  flags: [],
  source_pass: 1,
  workspace_scope: 'in',
};

function registry(item: Record<string, unknown>): string {
  const counts = { a: 1 };
  return JSON.stringify({
    meta: {
      title: 't',
      generated_from: 'g',
      note: 'n',
      item_count: 1,
      impact_tiers: counts,
      protocol_note: 'p',
      source_loci: counts,
      upstream_pointers: { 'this-repo': null },
      review_domains: counts,
      extraction_kinds: counts,
      surface_types: counts,
      audiences: counts,
      exemption: counts,
      flags: counts,
      workspace_scope: counts,
      refresh_2026_07_22: {
        ticket: 'MCP-103',
        summary: 's',
        deltas: [],
        code_state_at_refresh: 'c',
      },
    },
    items: [item],
  });
}

const addition = {
  id: 'A001',
  authority: 'workspace',
  workspaceScope: 'in',
  source: {
    state: 'available',
    files: ['src/allowlist.ts'],
    evidence: { revision: 'added', anchorTargetCount: 1, anchorCount: 1 },
  },
  lineage: { disposition: 'added', addedAfterBaselineCommit: 'abc123' },
  registrations: [],
};

describe('parseCurrentSourceProjection', () => {
  it('refuses a post-baseline addition that carries no review context', () => {
    expect(() => parseCurrentSourceProjection(projection(addition))).toThrow();
  });

  it('accepts a post-baseline addition that classifies itself', () => {
    const parsed = parseCurrentSourceProjection(
      projection({
        ...addition,
        reviewContext: {
          title: 'Served-surface allowlist',
          reviewDomain: 'engineering-structural',
          impactTier: 'high-impact',
          behaviouralIntent: 'Classify every surface.',
        },
      }),
    );

    expect(parsed.items[0]?.reviewContext?.reviewDomain).toBe('engineering-structural');
  });

  it('carries every primitive the projection observed at a registration root', () => {
    const parsed = parseCurrentSourceProjection(
      projection({
        ...addition,
        reviewContext: {
          title: 't',
          reviewDomain: 'other',
          impactTier: 'simple-config',
          behaviouralIntent: '',
        },
      }),
    );

    expect(parsed.registrationRoots[0]?.observation.initialize.instructions).toBe('present');
    expect(parsed.registrationRoots[0]?.observation.prompts.list).toBe('method-not-found');
  });

  it('refuses a field the renderer does not know, at any level', () => {
    const classified = {
      ...addition,
      reviewContext: {
        title: 't',
        reviewDomain: 'other',
        impactTier: 'simple-config',
        behaviouralIntent: '',
      },
    };

    expect(() => parseCurrentSourceProjection(projection(classified, { extra: true }))).toThrow();
    expect(() =>
      parseCurrentSourceProjection(projection({ ...classified, extra: true })),
    ).toThrow();
  });
});

describe('parseBaselineRegistry', () => {
  it('accepts a complete registry row', () => {
    expect(parseBaselineRegistry(registry(registryItem)).items[0]?.review_domain).toBe('pedagogy');
  });

  it('refuses a registry row carrying a field outside the contract', () => {
    expect(() => parseBaselineRegistry(registry({ ...registryItem, lens: 'x' }))).toThrow();
  });
});
