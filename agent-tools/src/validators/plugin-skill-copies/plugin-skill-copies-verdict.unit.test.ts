/**
 * Unit tests for the skill-copy exit decision.
 *
 * @remarks
 * Each test describes one report shape and the exit code and output it must
 * produce. Assertions are on relations (which lines appear, how many
 * remediation lines) rather than full prose, so wording edits do not churn
 * them.
 */

import { describe, expect, it } from 'vitest';

import {
  decideSkillCopyVerdict,
  type SkillCopyCheckLabels,
} from './plugin-skill-copies-verdict.js';
import type { SkillCopyReport } from './plugin-skill-copies.js';

const LABELS: SkillCopyCheckLabels = {
  sourceRoot: 'plugins/a/skills',
  copyRoot: 'plugins/b/skills',
  ignoredDirs: ['evals'],
};

const clean: SkillCopyReport = {
  sharedSkills: ['alpha', 'beta'],
  sourceOnly: [],
  copyOnly: ['merged'],
  findings: [],
  filesCompared: 7,
};

const fixLines = (lines: readonly string[]): readonly string[] =>
  lines.filter((line) => line.startsWith('Fix ('));

describe('decideSkillCopyVerdict', () => {
  it('passes an identical set, naming each shared skill, the file count, and what it did not compare', () => {
    const verdict = decideSkillCopyVerdict(clean, LABELS);

    expect(verdict.code).toBe(0);
    expect(verdict.lines).toHaveLength(2);
    expect(verdict.lines[0]).toContain('2 shared skill(s) identical (7 files compared)');
    expect(verdict.lines[0]).toContain('alpha, beta');
    expect(verdict.lines[1]).toContain('copy-only (not compared): merged');
  });

  it('refuses when no skill is shared, naming both roots, the copy-only skills and each finding', () => {
    const verdict = decideSkillCopyVerdict(
      {
        sharedSkills: [],
        sourceOnly: ['alpha'],
        copyOnly: ['merged'],
        findings: [{ skill: 'alpha', relativePath: '.', kind: 'missing-in-copy' }],
        filesCompared: 0,
      },
      LABELS,
    );

    expect(verdict.code).toBe(2);
    expect(verdict.lines[0]).toContain('refusing to report clean');
    expect(verdict.lines[0]).toContain(LABELS.sourceRoot);
    expect(verdict.lines[0]).toContain(LABELS.copyRoot);
    expect(verdict.lines.slice(1)).toStrictEqual([
      '  copy-only (not compared): merged',
      '  missing-in-copy  alpha/.',
    ]);
  });

  it('refuses when shared skills exist but nothing was compared', () => {
    const verdict = decideSkillCopyVerdict({ ...clean, filesCompared: 0 }, LABELS);

    expect(verdict.code).toBe(2);
  });

  it('fails, not refuses, when a shared skill could not be read and nothing else compared', () => {
    const verdict = decideSkillCopyVerdict(
      {
        ...clean,
        filesCompared: 0,
        findings: [{ skill: 'alpha', relativePath: '.', kind: 'missing-in-copy' }],
      },
      LABELS,
    );

    expect(verdict.code).toBe(1);
  });

  it('fails drift listing every finding and one remediation line per finding kind present', () => {
    const verdict = decideSkillCopyVerdict(
      {
        ...clean,
        findings: [
          { skill: 'alpha', relativePath: 'SKILL.md', kind: 'content-differs' },
          { skill: 'beta', relativePath: 'assets/x.md', kind: 'missing-in-source' },
          { skill: 'beta', relativePath: 'references/l.md', kind: 'symlink' },
        ],
      },
      LABELS,
    );

    expect(verdict.code).toBe(1);
    expect(verdict.lines[0]).toContain('3 difference(s)');
    expect(verdict.lines.slice(1, 4)).toStrictEqual([
      '  content-differs  alpha/SKILL.md',
      '  missing-in-source  beta/assets/x.md',
      '  symlink  beta/references/l.md',
    ]);
    expect(fixLines(verdict.lines).map((line) => line.slice(0, line.indexOf(':')))).toStrictEqual([
      'Fix (symlink)',
      'Fix (missing-in-source)',
      'Fix (missing-in-copy / content-differs)',
    ]);
  });

  it('prints only the re-copy remediation when every finding is copy-side, naming the ignored directories', () => {
    const verdict = decideSkillCopyVerdict(
      {
        ...clean,
        findings: [{ skill: 'alpha', relativePath: 'SKILL.md', kind: 'missing-in-copy' }],
      },
      LABELS,
    );

    const fixes = fixLines(verdict.lines);
    expect(fixes).toHaveLength(1);
    expect(fixes[0]).toContain(`from ${LABELS.sourceRoot} to ${LABELS.copyRoot}`);
    expect(fixes[0]).toContain('(omit evals/)');
  });

  it('omits the ignored-directory note when nothing is ignored', () => {
    const verdict = decideSkillCopyVerdict(
      {
        ...clean,
        findings: [{ skill: 'alpha', relativePath: 'SKILL.md', kind: 'content-differs' }],
      },
      { ...LABELS, ignoredDirs: [] },
    );

    expect(fixLines(verdict.lines)[0]).not.toContain('omit');
  });

  it('points the symlink remediation at the repository rule', () => {
    const verdict = decideSkillCopyVerdict(
      { ...clean, findings: [{ skill: 'linked', relativePath: '.', kind: 'symlink' }] },
      LABELS,
    );

    expect(verdict.code).toBe(1);
    expect(fixLines(verdict.lines)).toHaveLength(1);
    expect(fixLines(verdict.lines)[0]).toContain('No symlinks');
  });
});
