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
  type SkillTree,
  type SkillTreeReader,
} from './plugin-skill-copies.js';

/** Directory path → (relative file path → text content). */
type Trees = Readonly<Record<string, Readonly<Record<string, string>>>>;

const encoder = new TextEncoder();

/** A reader over in-memory trees; a directory absent from `trees` reads as missing. */
function memoryReader(trees: Trees): SkillTreeReader {
  return {
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

function check(overrides: Partial<SkillCopyCheck> = {}): SkillCopyCheck {
  return { sourceRoot: 'source', copyRoot: 'copy', skills: ['alpha'], ...overrides };
}

describe('findSkillCopyDrift', () => {
  it('reports nothing when every file in the shared skill is byte-identical', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': '# alpha\n', 'references/a.md': 'ref\n' },
      'copy/alpha': { 'SKILL.md': '# alpha\n', 'references/a.md': 'ref\n' },
    });

    expect(findSkillCopyDrift(check(), reader)).toStrictEqual({ findings: [], filesCompared: 2 });
  });

  it('names the file whose bytes differ', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': '# alpha\n' },
      'copy/alpha': { 'SKILL.md': '# alpha edited\n' },
    });

    const expected: SkillCopyFinding[] = [
      { skill: 'alpha', relativePath: 'SKILL.md', kind: 'content-differs' },
    ];
    expect(findSkillCopyDrift(check(), reader).findings).toStrictEqual(expected);
  });

  it('reports a source file the copy lacks, and a copy file the source lacks', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n', 'references/only-in-source.md': 'x\n' },
      'copy/alpha': { 'SKILL.md': 'x\n', 'assets/only-in-copy.md': 'x\n' },
    });

    expect(findSkillCopyDrift(check(), reader).findings).toStrictEqual([
      { skill: 'alpha', relativePath: 'assets/only-in-copy.md', kind: 'missing-in-source' },
      { skill: 'alpha', relativePath: 'references/only-in-source.md', kind: 'missing-in-copy' },
    ]);
  });

  it('treats a whole skill absent from the copy as every source file missing', () => {
    const reader = memoryReader({
      'source/alpha': { 'SKILL.md': 'x\n', 'references/a.md': 'x\n' },
    });

    const report = findSkillCopyDrift(check(), reader);

    expect(report.filesCompared).toBe(0);
    expect(report.findings.map((f) => f.kind)).toStrictEqual([
      'missing-in-copy',
      'missing-in-copy',
    ]);
  });

  it('compares nothing and finds nothing when both sides are absent, so the caller can refuse', () => {
    expect(findSkillCopyDrift(check(), memoryReader({}))).toStrictEqual({
      findings: [],
      filesCompared: 0,
    });
  });

  it('orders findings by skill then path, so output is stable across runs', () => {
    const reader = memoryReader({
      'source/beta': { 'SKILL.md': 'x\n' },
      'source/alpha': { 'SKILL.md': 'x\n' },
    });

    const skills = findSkillCopyDrift(check({ skills: ['beta', 'alpha'] }), reader).findings.map(
      (f) => f.skill,
    );

    expect(skills).toStrictEqual(['alpha', 'beta']);
  });
});
