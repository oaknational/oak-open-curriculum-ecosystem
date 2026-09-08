/**
 * Unit tests for skill-copy drift detection.
 *
 * @remarks
 * Each test describes one state the two skill roots can be in and the report
 * or verdict that state must produce. Trees are in-memory maps handed to the
 * comparison through its reader seam, so no test touches the filesystem or
 * the repository's real plugins.
 */

import { describe, expect, it } from 'vitest';

import {
  decideSkillCopyVerdict,
  findSkillCopyDrift,
  type SkillCopyCheck,
  type SkillCopyFinding,
  type SkillCopyReport,
  type SkillTree,
  type SkillTreeReader,
} from './plugin-skill-copies.js';

/** Directory path → (relative file path → text content). */
type Trees = Readonly<Record<string, Readonly<Record<string, string>>>>;

const encoder = new TextEncoder();

/**
 * A reader over in-memory trees. A skill is listed under a root when a tree
 * exists at `<root>/<skill>` and holds a `SKILL.md`; a directory absent from
 * `trees` reads as missing.
 */
function memoryReader(trees: Trees): SkillTreeReader {
  return {
    listSkills: (root) => {
      const names = Object.keys(trees)
        .filter((dir) => dir.startsWith(`${root}/`))
        .map((dir) => dir.slice(root.length + 1))
        .filter((name) => !name.includes('/') && 'SKILL.md' in (trees[`${root}/${name}`] ?? {}));
      return names.length === 0 && !Object.keys(trees).some((dir) => dir.startsWith(`${root}/`))
        ? undefined
        : names;
    },
    read: (skillDir) => {
      const files = trees[skillDir];
      if (files === undefined) {
        return undefined;
      }
      const tree: SkillTree = new Map(
        Object.entries(files).map(([relativePath, text]) => [relativePath, encoder.encode(text)]),
      );
      return tree;
    },
  };
}

const CHECK: SkillCopyCheck = { sourceRoot: 'source', copyRoot: 'copy' };
const LABELS = { sourceRoot: 'plugins/a/skills', copyRoot: 'plugins/b/skills' };

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
      findings: [],
      filesCompared: 1,
    });
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

  it('does not treat a directory without SKILL.md as a skill on either side', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n' },
      'source/notes': { 'README.md': 'not a skill\n' },
      'copy/alpha': { 'SKILL.md': 'x\n' },
      'copy/notes': { 'README.md': 'different\n' },
    });

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.sharedSkills).toStrictEqual(['alpha']);
    expect(report.findings).toStrictEqual([]);
  });

  it('names the file whose bytes differ', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': '# alpha\n' },
      'copy/alpha': { 'SKILL.md': '# alpha edited\n' },
    });

    expect(findSkillCopyDrift(CHECK, reader).findings).toStrictEqual<SkillCopyFinding[]>([
      { skill: 'alpha', relativePath: 'SKILL.md', kind: 'content-differs' },
    ]);
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
      findings: [],
      filesCompared: 0,
    });
  });

  it('treats a missing root as holding no skills', () => {
    const reader = memoryReader({ 'source/alpha': { 'SKILL.md': 'x\n' } });

    const report = findSkillCopyDrift(CHECK, reader);

    expect(report.sharedSkills).toStrictEqual([]);
    expect(report.sourceOnly).toStrictEqual(['alpha']);
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

describe('decideSkillCopyVerdict', () => {
  const clean: SkillCopyReport = {
    sharedSkills: ['alpha', 'beta'],
    sourceOnly: [],
    copyOnly: ['merged'],
    findings: [],
    filesCompared: 7,
  };

  it('passes an identical set and names what it compared and what it did not', () => {
    const verdict = decideSkillCopyVerdict(clean, LABELS);

    expect(verdict.code).toBe(0);
    expect(verdict.lines[0]).toBe(
      'validate-plugin-skill-copies: 2 shared skill(s) identical (7 files compared): alpha, beta',
    );
    expect(verdict.lines[1]).toBe('  copy-only (not compared): merged');
  });

  it('refuses when no skill is shared, listing each side so the cause is visible', () => {
    const verdict = decideSkillCopyVerdict(
      {
        sharedSkills: [],
        sourceOnly: ['alpha'],
        copyOnly: ['merged'],
        findings: [],
        filesCompared: 0,
      },
      LABELS,
    );

    expect(verdict.code).toBe(2);
    expect(verdict.lines).toStrictEqual([
      'validate-plugin-skill-copies: no skill directory is present under both plugins/a/skills and plugins/b/skills — refusing to report clean.',
      '  source-only (not compared): alpha',
      '  copy-only (not compared): merged',
    ]);
  });

  it('refuses when shared skills exist but nothing was compared', () => {
    const verdict = decideSkillCopyVerdict({ ...clean, filesCompared: 0 }, LABELS);

    expect(verdict.code).toBe(2);
  });

  it('fails drift with one remediation line per finding kind present', () => {
    const verdict = decideSkillCopyVerdict(
      {
        ...clean,
        findings: [
          { skill: 'alpha', relativePath: 'SKILL.md', kind: 'content-differs' },
          { skill: 'beta', relativePath: 'assets/x.md', kind: 'missing-in-source' },
        ],
      },
      LABELS,
    );

    expect(verdict.code).toBe(1);
    expect(verdict.lines).toStrictEqual([
      'validate-plugin-skill-copies: 2 difference(s) between plugins/a/skills and plugins/b/skills:',
      '  content-differs  alpha/SKILL.md',
      '  missing-in-source  beta/assets/x.md',
      'Fix (missing-in-source): the Claude plugin is the source and it lacks the listed path(s) — restore them under plugins/a/skills before re-copying.',
      'Fix (missing-in-copy / content-differs): re-copy each listed skill from plugins/a/skills to plugins/b/skills (omit evals/).',
    ]);
  });

  it('prints only the re-copy remediation when every finding is copy-side', () => {
    const verdict = decideSkillCopyVerdict(
      {
        ...clean,
        findings: [{ skill: 'alpha', relativePath: 'SKILL.md', kind: 'missing-in-copy' }],
      },
      LABELS,
    );

    expect(verdict.code).toBe(1);
    expect(verdict.lines.filter((line) => line.startsWith('Fix'))).toHaveLength(1);
  });
});
