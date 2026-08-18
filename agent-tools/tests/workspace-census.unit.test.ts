import { describe, expect, it } from 'vitest';

import {
  CODE_EXTENSIONS,
  computeDelta,
  deriveSubjects,
  parseLegacyMatrix,
  validateRows,
  type CensusRow,
  type CensusSubject,
} from '../src/workspace-census/index.js';

const MEMBERS = [
  { name: '@oaknational/agent-tools', path: 'agent-tools' },
  { name: '@oaknational/curriculum-mcp', path: 'apps/oak-curriculum-mcp-streamable-http' },
  { name: '@oaknational/design-tokens-core', path: 'packages/design/design-tokens-core' },
] as const;

function subjectByDir(
  subjects: readonly CensusSubject[],
  dirPath: string,
): CensusSubject | undefined {
  return subjects.find((subject) => subject.dirPath === dirPath);
}

describe('deriveSubjects — the mechanical subject predicate', () => {
  it('includes every pnpm member with its published name (source i)', () => {
    const subjects = deriveSubjects({
      members: [...MEMBERS],
      trackedFiles: ['agent-tools/package.json', 'agent-tools/src/a.ts'],
    });
    const agentTools = subjectByDir(subjects, 'agent-tools');
    expect(agentTools).toBeDefined();
    expect(agentTools?.publishedName).toBe('@oaknational/agent-tools');
    expect(agentTools?.sources).toContain('pnpm-member');
  });

  it('includes the parent of a tracked .claude-plugin/plugin.json manifest (source ii-b, owner-approved 2026-08-14)', () => {
    const subjects = deriveSubjects({
      members: [...MEMBERS],
      trackedFiles: ['plugins/oak-open-curriculum/.claude-plugin/plugin.json'],
    });
    const plugin = subjectByDir(subjects, 'plugins/oak-open-curriculum');
    expect(plugin).toBeDefined();
    expect(plugin?.sources).toContain('plugin-manifest-parent');
  });

  it('includes the parent of a tracked package.json outside the member set (source ii)', () => {
    const subjects = deriveSubjects({
      members: [...MEMBERS],
      trackedFiles: ['plugins/oak-open-curriculum/package.json'],
    });
    const plugin = subjectByDir(subjects, 'plugins/oak-open-curriculum');
    expect(plugin).toBeDefined();
    expect(plugin?.sources).toContain('package-json-parent');
  });

  it('does NOT surface a package.json nested under a member directory as its own subject', () => {
    const subjects = deriveSubjects({
      members: [...MEMBERS],
      trackedFiles: ['agent-tools/tests/fixtures/sample/package.json'],
    });
    expect(subjectByDir(subjects, 'agent-tools/tests/fixtures/sample')).toBeUndefined();
  });

  it('includes a top-level segment holding code files not covered by (i) or (ii) (source iii)', () => {
    const subjects = deriveSubjects({
      members: [...MEMBERS],
      trackedFiles: ['scripts/do-thing.sh', 'scripts/lib/helper.mjs'],
    });
    const scripts = subjectByDir(subjects, 'scripts');
    expect(scripts).toBeDefined();
    expect(scripts?.publishedName).toBeNull();
    expect(scripts?.sources).toContain('code-root');
  });

  it('does not duplicate a top-level segment already covered by members beneath it', () => {
    const subjects = deriveSubjects({
      members: [...MEMBERS],
      trackedFiles: ['packages/design/design-tokens-core/src/index.ts'],
    });
    expect(subjectByDir(subjects, 'packages')).toBeUndefined();
  });

  it('treats root-level tracked code files as the root code segment subject', () => {
    const subjects = deriveSubjects({
      members: [...MEMBERS],
      trackedFiles: ['eslint.config.mjs'],
    });
    const root = subjectByDir(subjects, '.');
    expect(root).toBeDefined();
    expect(root?.sources).toContain('code-root');
  });

  it('ignores non-code top segments for source iii', () => {
    const subjects = deriveSubjects({
      members: [...MEMBERS],
      trackedFiles: ['docs/architecture/README.md'],
    });
    expect(subjectByDir(subjects, 'docs')).toBeUndefined();
  });

  it('merges sources when one directory qualifies via several arms', () => {
    // The root manifest (source ii) plus a root code file (source iii)
    // exercise the actual merge path; a manifest inside a member is
    // deliberately excluded from source (ii) and proves nothing.
    const subjects = deriveSubjects({
      members: [...MEMBERS],
      trackedFiles: ['package.json', 'eslint.config.mjs'],
    });
    const root = subjectByDir(subjects, '.');
    expect(root?.sources).toEqual(['code-root', 'package-json-parent']);
  });

  it('declares the code-extension set used by source iii', () => {
    for (const required of ['.ts', '.tsx', '.js', '.mjs', '.cts', '.mts', '.sh']) {
      expect(CODE_EXTENSIONS).toContain(required);
    }
  });
});

function classifiedRow(overrides: Partial<CensusRow> = {}): CensusRow {
  return {
    dirPath: 'agent-tools',
    publishedName: '@oaknational/agent-tools',
    disposition: 'classified',
    classification: 'generic-foundation',
    leakage: [{ type: 'names', depth: 'docs-level', note: 'README examples name Oak paths' }],
    evidence: [
      { kind: 'static-structure', pointer: 'dependency graph: no Oak-leaf imports' },
      { kind: 'doctrine-record', pointer: 'ADR-154 layer assignment' },
    ],
    targetState: 'keep generic; scrub Oak-only examples',
    tranche: '3',
    licence: ['code-mit'],
    ...overrides,
  };
}

describe('validateRows — coverage and closed vocabularies', () => {
  const AGENT_TOOLS_SUBJECT: CensusSubject = {
    dirPath: 'agent-tools',
    publishedName: '@oaknational/agent-tools',
    sources: ['pnpm-member'],
  };
  const SCRIPTS_SUBJECT: CensusSubject = {
    dirPath: 'scripts',
    publishedName: null,
    sources: ['code-root'],
  };
  const SUBJECTS: CensusSubject[] = [AGENT_TOOLS_SUBJECT, SCRIPTS_SUBJECT];

  it('passes when every subject has a row and every row is valid', () => {
    const result = validateRows({
      subjects: SUBJECTS,
      rows: [
        classifiedRow(),
        {
          dirPath: 'scripts',
          publishedName: null,
          disposition: 'excluded',
          exclusionReason: 'runtime-only operational scripts; no published surface',
        },
      ],
    });
    expect(result.ok).toBe(true);
    expect(result.problems).toEqual([]);
  });

  it('fails a subject with no row (coverage hole, never silence)', () => {
    const result = validateRows({ subjects: SUBJECTS, rows: [classifiedRow()] });
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toContain('scripts');
  });

  it('fails a row whose subject the predicate cannot derive', () => {
    const result = validateRows({
      subjects: SUBJECTS,
      rows: [
        classifiedRow(),
        {
          dirPath: 'scripts',
          publishedName: null,
          disposition: 'excluded',
          exclusionReason: 'ok',
        },
        classifiedRow({ dirPath: 'ghost-dir', publishedName: null }),
      ],
    });
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toContain('ghost-dir');
  });

  it('fails a judged row with fewer than two DISTINCT evidence kinds', () => {
    const result = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [
        classifiedRow({
          evidence: [
            { kind: 'static-structure', pointer: 'a' },
            { kind: 'static-structure', pointer: 'b' },
          ],
        }),
      ],
    });
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toContain('evidence kinds');
  });

  it('fails an out-of-vocabulary classification, tranche, licence, or leakage depth', () => {
    const bad = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [
        classifiedRow({
          // @ts-expect-error — deliberately out of vocabulary to prove the boundary rejects it
          classification: 'sort-of-generic',
        }),
      ],
    });
    expect(bad.ok).toBe(false);

    const badTranche = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      // @ts-expect-error — deliberately out of vocabulary
      rows: [classifiedRow({ tranche: '9' })],
    });
    expect(badTranche.ok).toBe(false);

    const badLicence = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      // @ts-expect-error — deliberately out of vocabulary
      rows: [classifiedRow({ licence: ['gpl'] })],
    });
    expect(badLicence.ok).toBe(false);

    const badDepth = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [
        classifiedRow({
          // @ts-expect-error — deliberately out of vocabulary
          leakage: [{ type: 'names', depth: 'vibes', note: 'x' }],
        }),
      ],
    });
    expect(badDepth.ok).toBe(false);
  });

  it('requires a thinnest-slice disposition on mixed rows and forbids it elsewhere', () => {
    const mixedWithout = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [classifiedRow({ classification: 'mixed' })],
    });
    expect(mixedWithout.ok).toBe(false);
    expect(mixedWithout.problems.join('\n')).toContain('thinnest');

    const genericWith = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [classifiedRow({ thinnestSlice: 'split x from y' })],
    });
    expect(genericWith.ok).toBe(false);
  });

  it('accepts needs-construct-evidence rows (the recorded falsifier) with a reason', () => {
    const result = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [
        {
          dirPath: 'agent-tools',
          publishedName: '@oaknational/agent-tools',
          disposition: 'needs-construct-evidence',
          falsifierReason: 'leakage claim requires reading construct-level semantics',
        },
      ],
    });
    expect(result.ok).toBe(true);
  });

  it('flags pending rows as incomplete (skeleton state fails the final gate)', () => {
    const result = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [
        {
          dirPath: 'agent-tools',
          publishedName: '@oaknational/agent-tools',
          disposition: 'pending',
        },
      ],
    });
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toContain('pending');
  });
});

describe('parseLegacyMatrix — the 2026-04-28 baseline', () => {
  const SNIPPET = [
    '| Workspace | Classification | Oak-specific elements today | Target state | Tranche |',
    '|---|---|---|---|---|',
    '| `agent-tools` | `generic` | README examples | Keep generic | 3 |',
    '| `packages/core/env` | `mixed` | OakApiKeyEnvSchema | Split | 1 |',
    '| `apps/oak-search-cli` | `oak-leaf` | Oak ingestion | Keep as leaf | 5 / 6 |',
  ].join('\n');

  it('extracts dir path and maps the legacy classification vocabulary', () => {
    expect(parseLegacyMatrix(SNIPPET)).toMatchObject({
      ok: true,
      value: [
        { dirPath: 'agent-tools', classification: 'generic-foundation' },
        { dirPath: 'packages/core/env', classification: 'mixed' },
        { dirPath: 'apps/oak-search-cli', classification: 'oak-leaf' },
      ],
    });
  });
});

describe('computeDelta — keyed on directory path, renames read as renames', () => {
  const LEGACY = [
    { dirPath: 'agent-tools', classification: 'generic-foundation' as const },
    { dirPath: 'apps/oak-curriculum-mcp-stdio', classification: 'oak-leaf' as const },
    { dirPath: 'packages/core/env', classification: 'mixed' as const },
  ];

  it('reports appeared, disappeared, and changed classifications', () => {
    const delta = computeDelta({
      legacyRows: LEGACY,
      rows: [
        classifiedRow(),
        classifiedRow({
          dirPath: 'packages/core/env',
          publishedName: '@oaknational/env',
          classification: 'oak-leaf',
        }),
        classifiedRow({ dirPath: 'demos/oak-design-showcase', publishedName: null }),
      ],
    });
    expect(delta.appeared.map((r) => r.dirPath)).toEqual(['demos/oak-design-showcase']);
    expect(delta.disappeared.map((r) => r.dirPath)).toEqual(['apps/oak-curriculum-mcp-stdio']);
    expect(delta.changed).toEqual([
      { dirPath: 'packages/core/env', from: 'mixed', to: 'oak-leaf' },
    ]);
  });

  it('pairs a declared rename instead of reporting appear-plus-disappear', () => {
    const delta = computeDelta({
      legacyRows: LEGACY,
      rows: [
        classifiedRow(),
        classifiedRow({ dirPath: 'packages/core/env', classification: 'mixed' }),
        classifiedRow({
          dirPath: 'apps/oak-curriculum-mcp',
          renamedFrom: 'apps/oak-curriculum-mcp-stdio',
          classification: 'oak-leaf',
        }),
      ],
    });
    expect(delta.renamed).toEqual([
      { fromDirPath: 'apps/oak-curriculum-mcp-stdio', toDirPath: 'apps/oak-curriculum-mcp' },
    ]);
    expect(delta.appeared).toEqual([]);
    expect(delta.disappeared).toEqual([]);
  });
});
