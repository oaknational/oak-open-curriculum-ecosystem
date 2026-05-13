import { describe, expect, it } from 'vitest';

import {
  classifyRepairPreservation,
  evaluateConflictMarkers,
  evaluateGeneratedReadModelDrift,
  evaluateLegacyEventRoot,
  evaluateMergeClassDeclarations,
  evaluateMergeTopology,
  evaluateParseState,
  evaluateRetiredPathReferences,
  evaluateStableIdentityCollisions,
} from '../../src/practice-substrate';

describe('practice substrate contract-path fixtures', () => {
  it('accepts the retired legacy event root only when it is absent from disk', () => {
    expect(
      evaluateLegacyEventRoot({
        surface: 'legacy-collaboration-comms-events',
        legacyRoot: '.agent/state/collaboration/comms-events/',
        rootExists: false,
        entries: [],
      }),
    ).toStrictEqual([]);
  });

  it('blocks a retained .gitkeep under the retired legacy event root', () => {
    expect(
      evaluateLegacyEventRoot({
        surface: 'legacy-collaboration-comms-events',
        legacyRoot: '.agent/state/collaboration/comms-events/',
        rootExists: true,
        entries: [{ path: '.agent/state/collaboration/comms-events/.gitkeep', kind: 'gitkeep' }],
      }),
    ).toStrictEqual([
      {
        id: 'legacy-event-root-present',
        surface: 'legacy-collaboration-comms-events',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: 'Legacy event root .agent/state/collaboration/comms-events/ still exists on disk.',
        evidence: ['.agent/state/collaboration/comms-events/.gitkeep'],
      },
    ]);
  });

  it('blocks an empty retained legacy event root', () => {
    expect(
      evaluateLegacyEventRoot({
        surface: 'legacy-collaboration-comms-events',
        legacyRoot: '.agent/state/collaboration/comms-events/',
        rootExists: true,
        entries: [],
      }),
    ).toStrictEqual([
      {
        id: 'legacy-event-root-present',
        surface: 'legacy-collaboration-comms-events',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: 'Legacy event root .agent/state/collaboration/comms-events/ still exists on disk.',
        evidence: ['.agent/state/collaboration/comms-events/'],
      },
    ]);
  });

  it('blocks live JSON fragments under the retired legacy event root', () => {
    expect(
      evaluateLegacyEventRoot({
        surface: 'legacy-collaboration-comms-events',
        legacyRoot: '.agent/state/collaboration/comms-events/',
        rootExists: true,
        entries: [
          { path: '.agent/state/collaboration/comms-events/.gitkeep', kind: 'gitkeep' },
          { path: '.agent/state/collaboration/comms-events/old.json', kind: 'json' },
        ],
      }),
    ).toStrictEqual([
      {
        id: 'legacy-event-root-live-json',
        surface: 'legacy-collaboration-comms-events',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message:
          'Legacy event root .agent/state/collaboration/comms-events/ contains live JSON fragments.',
        evidence: ['.agent/state/collaboration/comms-events/old.json'],
      },
    ]);
  });

  it('blocks live retired-path prose while preserving archived references', () => {
    expect(
      evaluateRetiredPathReferences([
        {
          surface: 'state-entrypoint',
          path: '.agent/state/README.md',
          lifecycle: 'live',
          text: 'Write communication events to .agent/state/collaboration/comms-events/.',
          retiredPath: '.agent/state/collaboration/comms-events/',
          canonicalPath: '.agent/state/collaboration/comms/',
        },
        {
          surface: 'archived-handoff',
          path: '.agent/memory/active/archive/session.md',
          lifecycle: 'archived',
          text: 'The old evidence mentioned .agent/state/collaboration/comms-events/.',
          retiredPath: '.agent/state/collaboration/comms-events/',
          canonicalPath: '.agent/state/collaboration/comms/',
        },
      ]),
    ).toStrictEqual([
      {
        id: 'retired-path-live-reference',
        surface: 'state-entrypoint',
        severity: 'blocking',
        repair: 'deterministic',
        message:
          'Live surface references retired path .agent/state/collaboration/comms-events/; ' +
          'use .agent/state/collaboration/comms/.',
        evidence: ['.agent/state/README.md'],
      },
      {
        id: 'retired-path-historical-reference',
        surface: 'archived-handoff',
        severity: 'informational',
        repair: 'forbidden',
        message:
          'Historical surface preserves retired path .agent/state/collaboration/comms-events/ as evidence.',
        evidence: ['.agent/memory/active/archive/session.md'],
      },
    ]);
  });
});

describe('practice substrate metadata and identity fixtures', () => {
  it('reports missing merge_class metadata across substrate surface forms', () => {
    expect(
      evaluateMergeClassDeclarations([
        {
          surface: 'napkin',
          path: '.agent/memory/active/napkin.md',
          surfaceKind: 'markdown',
        },
        {
          surface: 'active-claims-schema',
          path: '.agent/state/collaboration/active-claims.schema.json',
          surfaceKind: 'json-schema',
        },
        {
          surface: 'comms-events-directory',
          path: '.agent/state/collaboration/comms-events/README.md',
          surfaceKind: 'directory-readme',
        },
      ]),
    ).toStrictEqual([
      {
        id: 'merge-class-missing',
        surface: 'napkin',
        severity: 'review-required',
        repair: 'manual-with-provenance',
        message: 'markdown surface is missing merge_class metadata.',
        evidence: ['.agent/memory/active/napkin.md'],
      },
      {
        id: 'merge-class-missing',
        surface: 'active-claims-schema',
        severity: 'review-required',
        repair: 'manual-with-provenance',
        message: 'json-schema surface is missing merge_class metadata.',
        evidence: ['.agent/state/collaboration/active-claims.schema.json'],
      },
      {
        id: 'merge-class-missing',
        surface: 'comms-events-directory',
        severity: 'review-required',
        repair: 'manual-with-provenance',
        message: 'directory-readme surface is missing merge_class metadata.',
        evidence: ['.agent/state/collaboration/comms-events/README.md'],
      },
    ]);
  });

  it('accepts declared PDR-049 merge_class tokens', () => {
    expect(
      evaluateMergeClassDeclarations([
        {
          surface: 'closed-claims-schema',
          path: '.agent/state/collaboration/closed-claims.schema.json',
          surfaceKind: 'json-schema',
          mergeClass: 'append-only-structured-by-claim_id',
        },
      ]),
    ).toStrictEqual([]);
  });

  it('blocks structured append merge_class declarations without an identity key', () => {
    expect(
      evaluateMergeClassDeclarations([
        {
          surface: 'closed-claims-schema',
          path: '.agent/state/collaboration/closed-claims.schema.json',
          surfaceKind: 'json-schema',
          mergeClass: 'append-only-structured-by-',
        },
      ]),
    ).toStrictEqual([
      {
        id: 'merge-class-invalid',
        surface: 'closed-claims-schema',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: 'merge_class append-only-structured-by- is not a PDR-049 token.',
        evidence: ['.agent/state/collaboration/closed-claims.schema.json'],
      },
    ]);
  });

  it('blocks duplicate stable IDs with identical content', () => {
    expect(
      evaluateStableIdentityCollisions({
        surface: 'surface-manifest',
        duplicateClass: 'invalid-duplicate',
        entries: [
          { stableId: 'surface-one', contentIdentity: 'sha256:a', context: 'row 1' },
          { stableId: 'surface-one', contentIdentity: 'sha256:a', context: 'row 2' },
        ],
      }),
    ).toStrictEqual([
      {
        id: 'duplicate-stable-id',
        surface: 'surface-manifest',
        severity: 'blocking',
        repair: 'deterministic',
        message: 'Stable identity surface-one is duplicated with identical content.',
        evidence: ['row 1', 'row 2'],
      },
    ]);
  });

  it('routes same-key semantic collisions to review instead of automatic repair', () => {
    expect(
      evaluateStableIdentityCollisions({
        surface: 'closed-claims-archive',
        duplicateClass: 'semantic-collision',
        entries: [
          { stableId: 'claim-one', contentIdentity: 'explicit-close', context: 'branch A' },
          { stableId: 'claim-one', contentIdentity: 'stale-close', context: 'branch B' },
        ],
      }),
    ).toStrictEqual([
      {
        id: 'same-key-semantic-collision',
        surface: 'closed-claims-archive',
        severity: 'review-required',
        repair: 'forbidden',
        message: 'Stable identity claim-one has competing semantic content.',
        evidence: ['branch A', 'branch B'],
      },
    ]);
  });
});

describe('practice substrate derived-output and structural fixtures', () => {
  it('detects generated read-model drift from injected rendered strings', () => {
    expect(
      evaluateGeneratedReadModelDrift({
        surface: 'shared-comms-log',
        outputPath: '.agent/state/collaboration/shared-comms-log.md',
        committedText: '# Shared log\n\nold\n',
        regeneratedText: '# Shared log\n\nnew\n',
      }),
    ).toStrictEqual([
      {
        id: 'generated-read-model-drift',
        surface: 'shared-comms-log',
        severity: 'blocking',
        repair: 'deterministic',
        message: 'Generated read model .agent/state/collaboration/shared-comms-log.md is stale.',
        evidence: ['.agent/state/collaboration/shared-comms-log.md'],
      },
    ]);
  });

  it('classifies invalid JSON before schema incoherence', () => {
    expect(
      evaluateParseState({
        surface: 'active-claims',
        path: '.agent/state/collaboration/active-claims.json',
        json: 'invalid',
        schema: 'invalid',
      }),
    ).toStrictEqual([
      {
        id: 'invalid-json',
        surface: 'active-claims',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: 'JSON surface .agent/state/collaboration/active-claims.json does not parse.',
        evidence: ['.agent/state/collaboration/active-claims.json'],
      },
    ]);
  });

  it('classifies schema incoherence for parseable JSON', () => {
    expect(
      evaluateParseState({
        surface: 'active-claims',
        path: '.agent/state/collaboration/active-claims.json',
        json: 'valid',
        schema: 'invalid',
      }),
    ).toStrictEqual([
      {
        id: 'schema-incoherence',
        surface: 'active-claims',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message:
          'JSON surface .agent/state/collaboration/active-claims.json does not satisfy its schema.',
        evidence: ['.agent/state/collaboration/active-claims.json'],
      },
    ]);
  });

  it('detects conflict markers in injected memory or state text', () => {
    expect(
      evaluateConflictMarkers({
        surface: 'repo-continuity',
        path: '.agent/memory/operational/repo-continuity.md',
        text: [
          '# Repo Continuity',
          '<<<<<<< HEAD',
          'left',
          '=======',
          'right',
          '>>>>>>> main',
        ].join('\n'),
      }),
    ).toStrictEqual([
      {
        id: 'conflict-marker',
        surface: 'repo-continuity',
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message:
          'Surface .agent/memory/operational/repo-continuity.md contains unresolved conflict markers.',
        evidence: ['.agent/memory/operational/repo-continuity.md'],
      },
    ]);
  });
});

describe('practice substrate topology and repair-preservation fixtures', () => {
  it('accepts a completed memory/state merge with two parents and target reachability', () => {
    expect(
      evaluateMergeTopology({
        surface: 'memory-state-merge',
        candidateCommit: 'merge1234',
        targetRef: 'origin/main',
        parentCount: 2,
        targetRefReachable: true,
        touchedMemoryStatePaths: ['.agent/memory/active/napkin.md'],
        claim: 'completed-memory-state-merge',
        workflow: 'merge',
        nonMergeTreatment: 'blocking',
      }),
    ).toStrictEqual([]);
  });

  it('blocks a single-parent snapshot presented as a completed memory/state merge', () => {
    expect(
      evaluateMergeTopology({
        surface: 'memory-state-merge',
        candidateCommit: 'single1234',
        targetRef: 'origin/main',
        parentCount: 1,
        targetRefReachable: false,
        touchedMemoryStatePaths: ['.agent/state/collaboration/closed-claims.archive.json'],
        claim: 'completed-memory-state-merge',
        workflow: 'merge',
        nonMergeTreatment: 'blocking',
      }),
    ).toStrictEqual([
      {
        id: 'memory-state-single-parent-merge-claim',
        surface: 'memory-state-merge',
        severity: 'blocking',
        repair: 'forbidden',
        message: 'Commit single1234 does not prove merge topology.',
        evidence: ['.agent/state/collaboration/closed-claims.archive.json'],
      },
    ]);
  });

  it('can classify squash and cherry-pick workflows as report-only topology evidence', () => {
    expect(
      evaluateMergeTopology({
        surface: 'memory-state-merge',
        candidateCommit: 'squash123',
        targetRef: 'origin/main',
        parentCount: 1,
        targetRefReachable: true,
        touchedMemoryStatePaths: ['.agent/state/collaboration/shared-comms-log.md'],
        claim: 'completed-memory-state-merge',
        workflow: 'squash',
        nonMergeTreatment: 'report-only',
      }),
    ).toStrictEqual([
      {
        id: 'memory-state-non-merge-topology',
        surface: 'memory-state-merge',
        severity: 'informational',
        repair: 'forbidden',
        message: 'squash workflow cannot prove memory/state merge parentage for origin/main.',
        evidence: ['.agent/state/collaboration/shared-comms-log.md'],
      },
    ]);
  });

  it('can classify non-merge topology as blocking for strict merge claims', () => {
    expect(
      evaluateMergeTopology({
        surface: 'memory-state-merge',
        candidateCommit: 'pick1234',
        targetRef: 'origin/main',
        parentCount: 1,
        targetRefReachable: true,
        touchedMemoryStatePaths: ['.agent/memory/operational/repo-continuity.md'],
        claim: 'completed-memory-state-merge',
        workflow: 'cherry-pick',
        nonMergeTreatment: 'blocking',
      }),
    ).toStrictEqual([
      {
        id: 'memory-state-non-merge-topology',
        surface: 'memory-state-merge',
        severity: 'blocking',
        repair: 'forbidden',
        message: 'cherry-pick workflow cannot prove memory/state merge parentage for origin/main.',
        evidence: ['.agent/memory/operational/repo-continuity.md'],
      },
    ]);
  });

  it('classifies repair preservation without erasing historical evidence', () => {
    expect(
      classifyRepairPreservation({
        surface: 'closed-claims-archive',
        path: '.agent/state/collaboration/closed-claims.archive.json',
        kind: 'exact-duplicate',
      }),
    ).toStrictEqual({
      surface: 'closed-claims-archive',
      path: '.agent/state/collaboration/closed-claims.archive.json',
      kind: 'exact-duplicate',
      severity: 'blocking',
      repair: 'deterministic',
      message: 'Exact duplicate identity and content can be deduplicated deterministically.',
    });

    expect(
      classifyRepairPreservation({
        surface: 'archived-napkin',
        path: '.agent/memory/active/archive/session.md',
        kind: 'same-prose-different-context',
      }),
    ).toStrictEqual({
      surface: 'archived-napkin',
      path: '.agent/memory/active/archive/session.md',
      kind: 'same-prose-different-context',
      severity: 'review-required',
      repair: 'forbidden',
      message: 'Same prose in different historical contexts is evidence, not a duplicate.',
    });

    expect(
      classifyRepairPreservation({
        surface: 'archived-handoff',
        path: '.agent/memory/operational/archive/handoff.md',
        kind: 'archived-reference',
      }),
    ).toStrictEqual({
      surface: 'archived-handoff',
      path: '.agent/memory/operational/archive/handoff.md',
      kind: 'archived-reference',
      severity: 'informational',
      repair: 'forbidden',
      message: 'Archived retired-path reference must remain preserved as historical evidence.',
    });
  });
});
