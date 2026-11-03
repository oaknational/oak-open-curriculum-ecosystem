/**
 * Unit proof for the MCP content current-source projection.
 *
 * The real-repository validator owns filesystem and registration walks.
 * This test keeps the transformation itself IO-free and proves the three
 * independent axes: authority, source lifecycle, and registration state.
 */

import { buildCurrentSourceTruthSet } from './build-current-source-truth-set.js';

/** Current-source evidence for one file at the given revision, anchored once. */
const evidence = (file: string, revision: 'unchanged' | 'modified' | 'relocated') => ({
  revision,
  targets: [
    {
      file,
      anchors: [
        {
          tokenCount: 1,
          tokenSha256: 'fixture-anchor',
          indexToken: 'fixture',
          indexOffset: 0,
        },
      ],
    },
  ],
});

describe('buildCurrentSourceTruthSet', () => {
  it('accounts for every audit row without conflating custody, lifecycle, or registration', () => {
    const truthSet = buildCurrentSourceTruthSet({
      provenance: {
        title: 'Fixture current-source truth set',
        baselineCommit: 'fixture-baseline',
        baselineArtifact: 'fixture/registry.json',
        baselineSha256: 'fixture-sha',
        currentEvidence: ['fixture/app/core.ts'],
        evidenceCeiling: ['Fixture only'],
      },
      baseline: [
        {
          id: 'C001',
          file: 'legacy/moved.ts',
          workspaceScope: 'in',
          sourceLocus: 'this-repo',
        },
        {
          id: 'C002',
          file: 'legacy/removed.ts',
          workspaceScope: 'in',
          sourceLocus: 'upstream-in-house-skills',
        },
        {
          id: 'C003',
          file: 'current/available.ts',
          workspaceScope: 'in',
          sourceLocus: 'this-repo',
        },
        {
          id: 'C004',
          file: 'current/dormant.ts',
          workspaceScope: 'in',
          sourceLocus: 'external-third-party',
        },
        {
          id: 'C005',
          file: 'generated/upstream.ts',
          workspaceScope: 'out-upstream-api',
          sourceLocus: 'upstream-in-house-api',
        },
      ],
      current: [
        {
          auditId: 'C001',
          files: ['current/moved.ts'],
          evidence: evidence('current/moved.ts', 'relocated'),
          registrations: [
            {
              rootId: 'http',
              state: 'live',
              primitive: 'resource',
              selector: 'docs://example/moved.md',
              anchorSurfaces: [{ locus: 'resource-metadata', field: 'title', anchorCount: 1 }],
              channels: ['resources/list.resources[]', 'resources/read.contents[]'],
            },
          ],
        },
        {
          auditId: 'C003',
          files: ['current/available.ts'],
          evidence: evidence('current/available.ts', 'unchanged'),
          registrations: [],
        },
        {
          auditId: 'C004',
          files: ['current/dormant.ts'],
          evidence: evidence('current/dormant.ts', 'modified'),
          registrations: [
            {
              rootId: 'http',
              state: 'dormant',
              primitive: 'resource',
              selector: 'docs://example/dormant.md',
              anchorSurfaces: [],
              channels: [],
            },
          ],
        },
        {
          auditId: 'C005',
          files: ['generated/upstream.ts'],
          evidence: evidence('generated/upstream.ts', 'unchanged'),
          registrations: [
            {
              rootId: 'http',
              state: 'live',
              primitive: 'tool',
              selector: 'upstream-tool',
              anchorSurfaces: [],
              channels: ['tools/list.tools[]'],
            },
          ],
        },
      ],
      additions: [
        {
          id: 'A001',
          title: 'Fixture addition',
          reviewDomain: 'engineering-structural',
          impactTier: 'high-impact',
          behaviouralIntent: 'Fixture added content.',
          workspaceScope: 'in',
          sourceLocus: 'this-repo',
          file: 'current/added.ts',
          evidence: {
            revision: 'added',
            targets: [
              {
                file: 'current/added.ts',
                anchors: [
                  {
                    tokenCount: 1,
                    tokenSha256: 'fixture-anchor',
                    indexToken: 'fixture',
                    indexOffset: 0,
                  },
                ],
              },
            ],
          },
          registrations: [],
        },
      ],
      retiredAuditIds: ['C002'],
      registrationRoots: [
        {
          id: 'http',
          rootRef: 'app/core.ts',
          transport: 'streamable-http',
          registrationRef: 'app/register.ts',
          proof: 'in-memory-protocol-walk',
          observation: {
            initialize: { instructions: 'present' },
            tools: { live: ['upstream-tool'], dormant: [] },
            resources: {
              live: ['docs://example/moved.md'],
              dormant: ['docs://example/dormant.md'],
            },
            prompts: { capability: 'absent', list: 'method-not-found' },
          },
        },
      ],
    });

    expect(truthSet.items).toHaveLength(6);
    expect(truthSet.items.map((item) => item.id)).toEqual([
      'C001',
      'C002',
      'C003',
      'C004',
      'C005',
      'A001',
    ]);

    expect(truthSet.items[0]).toMatchObject({
      id: 'C001',
      authority: 'workspace',
      workspaceScope: 'in',
      source: {
        state: 'available',
        files: ['current/moved.ts'],
        evidence: { revision: 'relocated' },
      },
      lineage: { disposition: 'relocated', baselineFile: 'legacy/moved.ts' },
      registrations: [{ state: 'live' }],
    });
    expect(truthSet.items[1]).toMatchObject({
      id: 'C002',
      authority: 'upstream-skills',
      workspaceScope: 'in',
      source: { state: 'retired', files: [] },
      lineage: { disposition: 'retired', baselineFile: 'legacy/removed.ts' },
      registrations: [],
    });
    expect(truthSet.items[2]).toMatchObject({
      id: 'C003',
      source: { state: 'available' },
      registrations: [],
    });
    expect(truthSet.items[3]).toMatchObject({
      id: 'C004',
      authority: 'external-third-party',
      workspaceScope: 'in',
      source: { state: 'available', evidence: { revision: 'modified' } },
      registrations: [{ state: 'dormant' }],
    });
    expect(truthSet.items[4]).toMatchObject({
      id: 'C005',
      authority: 'upstream-api',
      workspaceScope: 'out-upstream-api',
      source: { state: 'available' },
      registrations: [{ state: 'live' }],
    });
    expect(truthSet.items[5]).toMatchObject({
      id: 'A001',
      authority: 'workspace',
      source: { state: 'available', evidence: { revision: 'added' } },
      lineage: { disposition: 'added', addedAfterBaselineCommit: 'fixture-baseline' },
      reviewContext: { title: 'Fixture addition' },
    });
    expect(truthSet.summary).toMatchObject({
      itemCount: 6,
      baselineItemCount: 5,
      additionCount: 1,
      unchangedCount: 2,
      expandedCount: 0,
      modifiedCount: 1,
      relocatedCount: 1,
      addedCount: 1,
      workspaceScopeInCount: 5,
      workspaceScopeOutUpstreamApiCount: 1,
      workspaceAuthorityCount: 3,
      upstreamApiAuthorityCount: 1,
      upstreamSkillsAuthorityCount: 1,
      externalThirdPartyAuthorityCount: 1,
    });
  });

  it('rejects an unaccounted audit row', () => {
    expect(() =>
      buildCurrentSourceTruthSet({
        provenance: {
          title: 'Fixture current-source truth set',
          baselineCommit: 'fixture-baseline',
          baselineArtifact: 'fixture/registry.json',
          baselineSha256: 'fixture-sha',
          currentEvidence: [],
          evidenceCeiling: ['Fixture only'],
        },
        baseline: [
          {
            id: 'C001',
            file: 'current/accounted.ts',
            workspaceScope: 'in',
            sourceLocus: 'this-repo',
          },
          {
            id: 'C002',
            file: 'current/missing.ts',
            workspaceScope: 'in',
            sourceLocus: 'this-repo',
          },
        ],
        current: [
          {
            auditId: 'C001',
            files: ['current/accounted.ts'],
            evidence: evidence('current/accounted.ts', 'unchanged'),
            registrations: [],
          },
        ],
        additions: [],
        retiredAuditIds: [],
        registrationRoots: [],
      }),
    ).toThrow('Unaccounted baseline audit ids: C002');
  });

  it('keeps item-level word authority when one source file mixes authorship loci', () => {
    const file = 'current/mixed-source.ts';
    const truthSet = buildCurrentSourceTruthSet({
      provenance: {
        title: 'Mixed-source fixture',
        baselineCommit: 'fixture-baseline',
        baselineArtifact: 'fixture/registry.json',
        baselineSha256: 'fixture-sha',
        currentEvidence: [],
        evidenceCeiling: ['Fixture only'],
      },
      baseline: [
        {
          id: 'C001',
          file,
          workspaceScope: 'in',
          sourceLocus: 'this-repo',
        },
        {
          id: 'C002',
          file,
          workspaceScope: 'in',
          sourceLocus: 'external-third-party',
        },
      ],
      current: [
        {
          auditId: 'C001',
          files: [file],
          evidence: evidence(file, 'unchanged'),
          registrations: [],
        },
        {
          auditId: 'C002',
          files: [file],
          evidence: evidence(file, 'unchanged'),
          registrations: [],
        },
      ],
      additions: [],
      retiredAuditIds: [],
      registrationRoots: [],
    });

    expect(
      truthSet.items.map(({ id, authority, workspaceScope }) => ({
        id,
        authority,
        workspaceScope,
      })),
    ).toEqual([
      { id: 'C001', authority: 'workspace', workspaceScope: 'in' },
      { id: 'C002', authority: 'external-third-party', workspaceScope: 'in' },
    ]);
  });
});
