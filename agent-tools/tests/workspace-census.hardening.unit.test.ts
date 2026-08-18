import { describe, expect, it } from 'vitest';

import {
  computeDelta,
  deriveSubjects,
  parseLegacyMatrix,
  parseMemberList,
  parseRowsArtefactJson,
  renderMatrixString,
  validateRows,
  type CensusRow,
  type CensusSubject,
} from '../src/workspace-census/index.js';

const RESEARCH_MEMBER = {
  name: '@oaknational/research-evidence',
  path: 'research/web-app-deconstruction/packages/research-evidence',
} as const;

function judgedRow(overrides: Partial<CensusRow> = {}): CensusRow {
  return {
    dirPath: 'agent-tools',
    publishedName: '@oaknational/agent-tools',
    disposition: 'classified',
    classification: 'generic-foundation',
    evidence: [
      { kind: 'static-structure', pointer: 'dependency graph: no Oak-leaf imports' },
      { kind: 'doctrine-record', pointer: 'ADR-154 layer assignment' },
    ],
    targetState: 'keep generic',
    tranche: '3',
    licence: ['code-mit'],
    ...overrides,
  };
}

const AGENT_TOOLS_SUBJECT: CensusSubject = {
  dirPath: 'agent-tools',
  publishedName: '@oaknational/agent-tools',
  sources: ['pnpm-member'],
};

describe('deriveSubjects — partially covered top segments keep their code root', () => {
  it('mints a code-root for a segment holding code outside its nested subject', () => {
    const subjects = deriveSubjects({
      members: [RESEARCH_MEMBER],
      trackedFiles: [
        'research/web-app-deconstruction/packages/research-evidence/src/probe.ts',
        'research/other-study/tool.ts',
      ],
    });
    const research = subjects.find((subject) => subject.dirPath === 'research');
    expect(research).toBeDefined();
    expect(research?.sources).toContain('code-root');
  });

  it('still skips a segment whose code files all sit inside covering subjects', () => {
    const subjects = deriveSubjects({
      members: [RESEARCH_MEMBER],
      trackedFiles: ['research/web-app-deconstruction/packages/research-evidence/src/probe.ts'],
    });
    expect(subjects.find((subject) => subject.dirPath === 'research')).toBeUndefined();
  });
});

describe('validateRows — evidence pointers and published-name identity', () => {
  it('rejects a judged row whose evidence pointer is blank', () => {
    const result = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [
        judgedRow({
          evidence: [
            { kind: 'static-structure', pointer: '   ' },
            { kind: 'doctrine-record', pointer: 'ADR-154' },
          ],
        }),
      ],
    });
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toContain('blank evidence pointer');
  });

  it('does not let a blank-pointer entry count toward the two-distinct-kinds gate', () => {
    const result = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [
        judgedRow({
          evidence: [
            { kind: 'static-structure', pointer: '' },
            { kind: 'doctrine-record', pointer: 'ADR-154' },
          ],
        }),
      ],
    });
    expect(result.problems.join('\n')).toContain('DISTINCT evidence kinds');
  });

  it('rejects a row whose published name disagrees with the derived subject', () => {
    const result = validateRows({
      subjects: [AGENT_TOOLS_SUBJECT],
      rows: [judgedRow({ publishedName: '@oaknational/renamed-tools' })],
    });
    expect(result.ok).toBe(false);
    expect(result.problems.join('\n')).toContain('published name');
  });
});

describe('parseLegacyMatrix — unknown labels are parse errors, never silent drops', () => {
  it('returns an error naming an unrecognised classification label', () => {
    const result = parseLegacyMatrix(
      ['| `agent-tools` | `generic` |', '| `packages/core/env` | `sorta-mixed` |'].join('\n'),
    );
    expect(result).toMatchObject({ ok: false });
    expect(JSON.stringify(result)).toContain('sorta-mixed');
  });

  it('parses known labels into the current vocabulary', () => {
    expect(parseLegacyMatrix('| `agent-tools` | `generic` |')).toMatchObject({
      ok: true,
      value: [{ dirPath: 'agent-tools', classification: 'generic-foundation' }],
    });
  });
});

describe('computeDelta — presence spans every subject row; dangling renames surface', () => {
  it('counts excluded and falsifier rows in appeared/disappeared', () => {
    const delta = computeDelta({
      legacyRows: [{ dirPath: 'scripts', classification: 'generic-foundation' }],
      rows: [
        {
          dirPath: 'scripts',
          publishedName: null,
          disposition: 'excluded',
          exclusionReason: 'runtime-only scripts',
        },
        {
          dirPath: 'plugins/oak-open-curriculum',
          publishedName: null,
          disposition: 'excluded',
          exclusionReason: 'manifest-only surface',
        },
      ],
    });
    expect(delta.disappeared).toEqual([]);
    expect(delta.appeared.map((row) => row.dirPath)).toEqual(['plugins/oak-open-curriculum']);
  });

  it('surfaces a renamedFrom that matches no baseline row instead of hiding the subject', () => {
    const delta = computeDelta({
      legacyRows: [{ dirPath: 'agent-tools', classification: 'generic-foundation' }],
      rows: [judgedRow(), judgedRow({ dirPath: 'tools/next', renamedFrom: 'tools/previous' })],
    });
    expect(delta.danglingRenames).toEqual([
      { dirPath: 'tools/next', renamedFrom: 'tools/previous' },
    ]);
    expect(delta.appeared.map((row) => row.dirPath)).toContain('tools/next');
  });
});

describe('parseMemberList — resolver output stays inside the Result contract', () => {
  it('returns err on malformed JSON instead of throwing', () => {
    const result = parseMemberList('not json at all', '/repo');
    expect(result.ok).toBe(false);
  });

  it('returns err on an entry missing name/path', () => {
    const result = parseMemberList(JSON.stringify([{ name: 'only-name' }]), '/repo');
    expect(result.ok).toBe(false);
  });

  it('parses members and drops the root project', () => {
    const result = parseMemberList(
      JSON.stringify([
        { name: 'root', path: '/repo' },
        { name: '@oaknational/agent-tools', path: '/repo/agent-tools' },
      ]),
      '/repo',
    );
    expect(result).toMatchObject({
      ok: true,
      value: [{ name: '@oaknational/agent-tools', path: 'agent-tools' }],
    });
  });
});

describe('parseRowsArtefactJson — the full row shape is validated at parse time', () => {
  const envelope = (rows: unknown): string =>
    JSON.stringify({ schema_version: '1.0.0', plan: 'plan.md', rows });

  it('rejects a row whose evidence array holds a null entry', () => {
    const result = parseRowsArtefactJson(
      envelope([
        {
          dirPath: 'agent-tools',
          publishedName: null,
          disposition: 'classified',
          evidence: [null],
        },
      ]),
      'rows.json',
    );
    expect(result.ok).toBe(false);
  });

  it('rejects a row whose targetState is not a string', () => {
    const result = parseRowsArtefactJson(
      envelope([
        { dirPath: 'agent-tools', publishedName: null, disposition: 'classified', targetState: 7 },
      ]),
      'rows.json',
    );
    expect(result.ok).toBe(false);
  });

  it('accepts a fully shaped judged row', () => {
    const result = parseRowsArtefactJson(envelope([judgedRow()]), 'rows.json');
    expect(result.ok).toBe(true);
  });
});

describe('renderMatrixString — falsifier rows render their own reason', () => {
  it('shows falsifierReason for needs-construct-evidence rows', () => {
    const output = renderMatrixString({
      rows: [
        judgedRow(),
        {
          dirPath: 'scripts',
          publishedName: null,
          disposition: 'needs-construct-evidence',
          falsifierReason: 'construct-level semantics unreachable from the named instrument set',
        },
      ],
      legacyCount: 0,
      delta: { appeared: [], disappeared: [], changed: [], renamed: [], danglingRenames: [] },
    });
    expect(output).toContain('construct-level semantics unreachable');
  });
});
