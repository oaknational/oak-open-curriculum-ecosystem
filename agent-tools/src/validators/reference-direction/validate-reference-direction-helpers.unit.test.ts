import { describe, expect, it } from 'vitest';

import {
  classifyLayer,
  extractReferences,
  findReferenceDirectionViolations,
  isStableIndex,
  type ScanFile,
} from './validate-reference-direction-helpers.js';

describe('classifyLayer', () => {
  it('classifies practice-core as portable-core', () => {
    expect(classifyLayer('.agent/practice-core/decision-records/PDR-105-x.md')).toBe(
      'portable-core',
    );
  });

  it('classifies ADRs, rules, directives, governance as repo-doctrine', () => {
    expect(classifyLayer('docs/architecture/architectural-decisions/150-x.md')).toBe(
      'repo-doctrine',
    );
    expect(classifyLayer('.agent/rules/no-moving-targets.md')).toBe('repo-doctrine');
    expect(classifyLayer('.agent/directives/orientation.md')).toBe('repo-doctrine');
    expect(classifyLayer('docs/governance/development-practice.md')).toBe('repo-doctrine');
  });

  it('classifies plans, threads, active memory, and state as ephemeral', () => {
    expect(classifyLayer('.agent/plans/x/current/y.plan.md')).toBe('ephemeral');
    expect(classifyLayer('.agent/memory/operational/threads/eef.next-session.md')).toBe(
      'ephemeral',
    );
    expect(classifyLayer('.agent/memory/operational/threads/paused/eef.next-session.md')).toBe(
      'ephemeral',
    );
    expect(classifyLayer('.agent/memory/active/patterns/x.md')).toBe('ephemeral');
    expect(classifyLayer('.agent/state/collaboration/active-claims.json')).toBe('ephemeral');
  });

  it('classifies code and unknowns as other', () => {
    expect(classifyLayer('agent-tools/src/x.ts')).toBe('other');
    expect(classifyLayer('README.md')).toBe('other');
  });

  it('classifies the stable index path as other, not doctrine (the exemption is by isStableIndex)', () => {
    expect(classifyLayer('.agent/memory/operational/repo-continuity.md')).toBe('other');
  });
});

describe('isStableIndex', () => {
  it('recognises repo-continuity as the sanctioned stable index', () => {
    expect(isStableIndex('.agent/memory/operational/repo-continuity.md')).toBe(true);
    expect(isStableIndex('.agent/memory/operational/threads/eef.next-session.md')).toBe(false);
  });
});

describe('extractReferences', () => {
  const source = '.agent/practice-core/decision-records/PDR-1.md';

  it('extracts inline links resolved relative to the source dir', () => {
    const refs = extractReferences(
      source,
      'see [ADR](../../../docs/architecture/architectural-decisions/9.md).',
    );
    expect(refs).toHaveLength(1);
    expect(refs[0].resolvedRepoPath).toBe('docs/architecture/architectural-decisions/9.md');
  });

  it('extracts reference definitions', () => {
    const refs = extractReferences(source, '[adr]: ./PDR-2.md\n');
    expect(refs).toHaveLength(1);
    expect(refs[0].resolvedRepoPath).toBe('.agent/practice-core/decision-records/PDR-2.md');
  });

  it('ignores external URLs and pure anchors', () => {
    const refs = extractReferences(source, '[x](https://example.com) and [y](#section)');
    expect(refs).toHaveLength(0);
  });

  it('flags lines marked as a historical reference (prose and HTML-comment forms)', () => {
    expect(
      extractReferences(
        source,
        'arose from [the plan](../../plans/x/y.plan.md) (historical reference)',
      )[0].historicalMarked,
    ).toBe(true);
    expect(
      extractReferences(source, '[plan](../../plans/x/y.plan.md) <!-- historical -->')[0]
        .historicalMarked,
    ).toBe(true);
  });

  it('strips anchors and link titles before resolving', () => {
    expect(extractReferences(source, '[x](./PDR-2.md#section)')[0].resolvedRepoPath).toBe(
      '.agent/practice-core/decision-records/PDR-2.md',
    );
    expect(extractReferences(source, '[x](./PDR-2.md "Title")')[0].resolvedRepoPath).toBe(
      '.agent/practice-core/decision-records/PDR-2.md',
    );
  });

  it('extracts multiple links from one line', () => {
    expect(extractReferences(source, 'see [A](./A.md) and [B](./B.md)')).toHaveLength(2);
  });
});

describe('findReferenceDirectionViolations', () => {
  it('flags a portable-core file citing an ADR (portability)', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/practice-core/decision-records/PDR-1.md',
        content: 'see [ADR](../../../docs/architecture/architectural-decisions/9.md)',
      },
    ];
    const violations = findReferenceDirectionViolations(files);
    expect(violations).toHaveLength(1);
    expect(violations[0].axis).toBe('portability');
    expect(violations[0].targetLayer).toBe('repo-doctrine');
  });

  it('flags a rule citing a plan (durability)', () => {
    const files: ScanFile[] = [
      { path: '.agent/rules/x.md', content: 'per [plan](../plans/y/current/z.plan.md)' },
    ];
    const violations = findReferenceDirectionViolations(files);
    expect(violations).toHaveLength(1);
    expect(violations[0].axis).toBe('durability');
  });

  it('flags an ADR citing a thread (durability)', () => {
    const files: ScanFile[] = [
      {
        path: 'docs/architecture/architectural-decisions/9.md',
        content: 'see [thread](../../../.agent/memory/operational/threads/eef.next-session.md)',
      },
    ];
    const violations = findReferenceDirectionViolations(files);
    expect(violations).toHaveLength(1);
    expect(violations[0].axis).toBe('durability');
  });

  it('reports portability (not durability) for a portable-core file citing an ephemeral surface', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/practice-core/decision-records/PDR-1.md',
        content: 'see [plan](../../../plans/x/y.plan.md)',
      },
    ];
    const violations = findReferenceDirectionViolations(files);
    expect(violations).toHaveLength(1);
    expect(violations[0].axis).toBe('portability');
  });

  it('flags a portable-core file citing repo code/docs (portability)', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/practice-core/decision-records/PDR-1.md',
        content: 'see [code](../../../agent-tools/src/x.ts)',
      },
    ];
    expect(findReferenceDirectionViolations(files)[0].axis).toBe('portability');
  });

  it('does NOT let a historical marker suppress a portability violation', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/practice-core/decision-records/PDR-1.md',
        content:
          'see [ADR](../../../docs/architecture/architectural-decisions/9.md) (historical reference)',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(1);
  });

  it('allows a portable-core file citing a sibling Core doc', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/practice-core/decision-records/PDR-1.md',
        content: 'see [PDR-2](./PDR-2.md)',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(0);
  });

  it('allows a historical-marked reference to an ephemeral surface', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/rules/x.md',
        content: 'arose from [plan](../plans/y/z.plan.md) (historical reference)',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(0);
  });

  it('exempts the stable index from referencing ephemeral threads', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/memory/operational/repo-continuity.md',
        content: '[eef]: threads/paused/eef.next-session.md',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(0);
  });

  it('does not police references emitted by ephemeral sources', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/plans/x/current/y.plan.md',
        content: 'see [thread](../../../memory/operational/threads/eef.next-session.md)',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(0);
  });

  // Stable-addressed-state exemption (PDR-105 stable-index corollary, generalised):
  // a doctrine surface may link a singleton registry / log / schema whose ADDRESS is
  // fixed even though its content churns — that is a safe dependency target, the
  // abstraction the corollary's DIP rests on. The exemption is durability-only; the
  // portability axis still refuses a portable-core file citing repo-specific state.
  it('allows a rule citing the active-claims registry (stable-addressed state)', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/rules/register-active-areas.md',
        content: 'register in [claims](../state/collaboration/active-claims.json)',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(0);
  });

  it('allows a rule citing the shared comms log (stable-addressed state)', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/rules/use-agent-comms-log.md',
        content: 'post to [comms](../state/collaboration/shared-comms-log.md)',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(0);
  });

  it('allows a doctrine file citing the closed-claims archive (stable-addressed state)', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/rules/x.md',
        content: 'archived to [closed](../state/collaboration/closed-claims.archive.json)',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(0);
  });

  it('allows a doctrine file citing a JSON schema (stable-addressed contract)', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/rules/register-active-areas.md',
        content: 'shape per [schema](../state/collaboration/active-claims.schema.json)',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(0);
  });

  it('allows a doctrine file citing the patterns index README (stable-addressed)', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/rules/x.md',
        content: 'see [patterns](../memory/active/patterns/README.md)',
      },
    ];
    expect(findReferenceDirectionViolations(files)).toHaveLength(0);
  });

  it('still flags a doctrine file citing an individual pattern file (it graduates/moves)', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/rules/x.md',
        content: 'see [pattern](../memory/active/patterns/fluency-is-a-failure-vector.md)',
      },
    ];
    const violations = findReferenceDirectionViolations(files);
    expect(violations).toHaveLength(1);
    expect(violations[0].axis).toBe('durability');
  });

  it('still flags a portable-core file citing stable-addressed state (portability is strict)', () => {
    const files: ScanFile[] = [
      {
        path: '.agent/practice-core/decision-records/PDR-1.md',
        content: 'see [claims](../../state/collaboration/active-claims.json)',
      },
    ];
    const violations = findReferenceDirectionViolations(files);
    expect(violations).toHaveLength(1);
    expect(violations[0].axis).toBe('portability');
  });
});
