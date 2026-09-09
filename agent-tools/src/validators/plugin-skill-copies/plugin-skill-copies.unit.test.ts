/**
 * Unit tests for skill-copy drift detection.
 *
 * @remarks
 * Each test describes one state the two skill roots can be in and the report
 * that state must produce. Trees are in-memory maps handed to the comparison
 * through its reader seam, so no test touches the filesystem or the
 * repository's real plugins.
 */

import { describe, expect, it } from 'vitest';

import {
  findSkillCopyDrift,
  type SkillCopyCheck,
  type SkillCopyFinding,
  type SkillCopyReport,
  type SkillEntry,
  type SkillTreeReader,
} from './plugin-skill-copies.js';

/** Directory path → (relative file path → text content). */
type Trees = Readonly<Record<string, Readonly<Record<string, string>>>>;

const encoder = new TextEncoder();
const file = (text: string): SkillEntry => ({ kind: 'file', bytes: encoder.encode(text) });

/**
 * A reader over in-memory trees. A skill is listed under a root when a tree
 * exists at `<root>/<skill>` and holds a `SKILL.md`; no root ever holds a
 * symlink; a directory absent from `trees` reads as missing.
 */
function memoryReader(trees: Trees): SkillTreeReader {
  return {
    listRoot: (root) => ({
      skills: Object.keys(trees)
        .filter((dir) => dir.startsWith(`${root}/`))
        .map((dir) => dir.slice(root.length + 1))
        .filter((name) => !name.includes('/') && 'SKILL.md' in (trees[`${root}/${name}`] ?? {})),
      invalid: Object.keys(trees)
        .filter((dir) => dir.startsWith(`${root}/`))
        .map((dir) => dir.slice(root.length + 1))
        .filter((name) => !name.includes('/') && !('SKILL.md' in (trees[`${root}/${name}`] ?? {}))),
      symlinks: [],
    }),
    read: (skillDir) => {
      const files = trees[skillDir];
      return files === undefined
        ? undefined
        : new Map(Object.entries(files).map(([relativePath, text]) => [relativePath, file(text)]));
    },
  };
}

const CHECK: SkillCopyCheck = { sourceRoot: 'source', copyRoot: 'copy' };

describe('findSkillCopyDrift', () => {
  it('discovers the skills present under both roots and compares only those', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': '# alpha\n' },
      'source/beta': { 'SKILL.md': '# beta\n' },
      'copy/alpha': { 'SKILL.md': '# alpha\n' },
      'copy/merged': { 'SKILL.md': '# merged\n' },
    });

    expect(findSkillCopyDrift(CHECK, reader)).toStrictEqual<SkillCopyReport>({
      sharedSkills: ['alpha'],
      sourceOnly: ['beta'],
      copyOnly: ['merged'],
      findings: [{ skill: 'beta', relativePath: '.', kind: 'missing-in-copy' }],
      filesCompared: 1,
    });
  });

  it('reports a source skill absent from the copy as missing-in-copy, so a deleted copy cannot pass', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n' },
      'source/accessibility': { 'SKILL.md': 'a\n', 'references/wcag.md': 'w\n' },
      'copy/alpha': { 'SKILL.md': 'x\n' },
    });

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.sharedSkills).toStrictEqual(['alpha']);
    expect(report.findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'accessibility', relativePath: '.', kind: 'missing-in-copy' },
    ]);
  });

  it('does not treat a skill the copy adds on its own as a finding', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n' },
      'copy/alpha': { 'SKILL.md': 'x\n' },
      'copy/merged': { 'SKILL.md': 'm\n' },
    });

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.copyOnly).toStrictEqual(['merged']);
    expect(report.findings).toStrictEqual([]);
  });

  it('covers a newly added shared skill without any list being edited', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n' },
      'source/delta': { 'SKILL.md': 'source text\n' },
      'copy/alpha': { 'SKILL.md': 'x\n' },
      'copy/delta': { 'SKILL.md': 'edited copy\n' },
    });

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.sharedSkills).toStrictEqual(['alpha', 'delta']);
    expect(report.findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'delta', relativePath: 'SKILL.md', kind: 'content-differs' },
    ]);
  });

  it('reports a directory without a SKILL.md as a finding on its manifest, on whichever side it sits', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n' },
      'source/notes': { 'README.md': 'not a skill\n' },
      'copy/alpha': { 'SKILL.md': 'x\n' },
      'copy/notes': { 'README.md': 'different\n' },
    });

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.sharedSkills).toStrictEqual(['alpha']);
    expect(report.findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'notes', relativePath: 'SKILL.md', kind: 'missing-in-source' },
      { skill: 'notes', relativePath: 'SKILL.md', kind: 'missing-in-copy' },
    ]);
  });

  it('does not let a stale copy pass when the source skill has lost its SKILL.md', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n' },
      'source/accessibility': { 'references/wcag.md': 'w\n' },
      'copy/alpha': { 'SKILL.md': 'x\n' },
      'copy/accessibility': { 'SKILL.md': 'stale\n', 'references/wcag.md': 'w\n' },
    });

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.copyOnly).toStrictEqual(['accessibility']);
    expect(report.findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'accessibility', relativePath: 'SKILL.md', kind: 'missing-in-source' },
    ]);
  });

  it('names the file whose bytes differ and still counts it as compared', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': '# alpha\n' },
      'copy/alpha': { 'SKILL.md': '# alpha edited\n' },
    });

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'alpha', relativePath: 'SKILL.md', kind: 'content-differs' },
    ]);
    expect(report.filesCompared).toBe(1);
  });

  it('reports a source file the copy lacks, and a copy file the source lacks', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n', 'references/only-in-source.md': 'x\n' },
      'copy/alpha': { 'SKILL.md': 'x\n', 'assets/only-in-copy.md': 'x\n' },
    });

    expect(findSkillCopyDrift(CHECK, reader).findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'alpha', relativePath: 'assets/only-in-copy.md', kind: 'missing-in-source' },
      { skill: 'alpha', relativePath: 'references/only-in-source.md', kind: 'missing-in-copy' },
    ]);
  });

  it('reports an empty intersection rather than comparing nothing quietly', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n' },
      'copy/merged': { 'SKILL.md': 'y\n' },
    });

    expect(findSkillCopyDrift(CHECK, reader)).toStrictEqual<SkillCopyReport>({
      sharedSkills: [],
      sourceOnly: ['alpha'],
      copyOnly: ['merged'],
      findings: [{ skill: 'alpha', relativePath: '.', kind: 'missing-in-copy' }],
      filesCompared: 0,
    });
  });

  it('treats a root that cannot be listed as holding no skills', () => {
    const reader: SkillTreeReader = {
      listRoot: (root) =>
        root === 'source' ? { skills: ['alpha'], invalid: [], symlinks: [] } : undefined,
      read: () => new Map([['SKILL.md', file('x\n')]]),
    };

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.sharedSkills).toStrictEqual([]);
    expect(report.sourceOnly).toStrictEqual(['alpha']);
    expect(report.copyOnly).toStrictEqual([]);
    expect(report.findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'alpha', relativePath: '.', kind: 'missing-in-copy' },
    ]);
  });

  it('reports a shared skill whose tree cannot be read as a finding on the skill itself', () => {
    const reader: SkillTreeReader = {
      listRoot: () => ({ skills: ['alpha'], invalid: [], symlinks: [] }),
      read: (skillDir) =>
        skillDir === 'source/alpha' ? new Map([['SKILL.md', file('x\n')]]) : undefined,
    };

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'alpha', relativePath: '.', kind: 'missing-in-copy' },
    ]);
    expect(report.filesCompared).toBe(0);
  });

  it('reports a symlink inside a shared skill as a finding and does not count it as compared', () => {
    const reader: SkillTreeReader = {
      listRoot: () => ({ skills: ['alpha'], invalid: [], symlinks: [] }),
      read: (skillDir) =>
        new Map<string, SkillEntry>([
          ['SKILL.md', file('x\n')],
          ['references/link.md', skillDir === 'copy/alpha' ? { kind: 'symlink' } : file('real\n')],
        ]),
    };

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'alpha', relativePath: 'references/link.md', kind: 'symlink' },
    ]);
    expect(report.filesCompared).toBe(1);
  });

  it('reports a symlinked entry under either root as a finding on that name', () => {
    const reader: SkillTreeReader = {
      listRoot: (root) => ({
        skills: ['alpha'],
        invalid: [],
        symlinks: root === 'copy' ? ['linked-skill'] : [],
      }),
      read: () => new Map([['SKILL.md', file('x\n')]]),
    };

    expect(findSkillCopyDrift(CHECK, reader).findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'linked-skill', relativePath: '.', kind: 'symlink' },
    ]);
  });

  it('orders shared skills and findings by name, so output is stable across runs', () => {
    const reader = memoryReader({
      'source/beta': { 'SKILL.md': 'x\n' },
      'source/alpha': { 'SKILL.md': 'x\n' },
      'copy/beta': { 'SKILL.md': 'changed\n' },
      'copy/alpha': { 'SKILL.md': 'changed\n' },
    });

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.sharedSkills).toStrictEqual(['alpha', 'beta']);
    expect(report.findings.map((finding) => finding.skill)).toStrictEqual(['alpha', 'beta']);
  });
});
