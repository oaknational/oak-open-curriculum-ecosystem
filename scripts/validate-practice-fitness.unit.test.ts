import { describe, expect, it } from 'vitest';

import {
  evaluateFitnessFile,
  getExitCode,
  shouldInspectFitnessPath,
} from './validate-practice-fitness.mjs';

describe('evaluateFitnessFile', () => {
  it('measures content lines and characters without counting frontmatter', () => {
    const content = [
      '---',
      'fitness_line_target: 3',
      'fitness_line_limit: 5',
      'fitness_char_limit: 30',
      'fitness_line_length: 10',
      '---',
      '',
      'short',
      'tiny',
      'words',
    ].join('\n');

    const result = evaluateFitnessFile('.agent/practice-core/practice.md', content);

    expect(result.totalLines).toBe(4);
    expect(result.totalChars).toBe('\nshort\ntiny\nwords'.length);
    expect(result.targetOk).toBe(false);
    expect(result.limitOk).toBe(true);
    expect(result.charsOk).toBe(true);
    expect(result.proseOk).toBe(true);
    expect(result.violations).toStrictEqual([]);
  });

  it('checks only the dimensions declared in frontmatter', () => {
    const content = [
      '---',
      'fitness_line_target: 5',
      'fitness_line_limit: 10',
      '---',
      'alpha',
      'beta',
    ].join('\n');

    const result = evaluateFitnessFile('docs/governance/development-practice.md', content);

    expect(result.targetLines).toBe(5);
    expect(result.limitLines).toBe(10);
    expect(result.limitChars).toBeNull();
    expect(result.maxProseLineWidth).toBeNull();
    expect(result.targetOk).toBe(true);
    expect(result.limitOk).toBe(true);
    expect(result.charsOk).toBe(true);
    expect(result.proseOk).toBe(true);
  });

  it('reports below target and below limit as fully healthy', () => {
    const content = [
      '---',
      'fitness_line_target: 10',
      'fitness_line_limit: 15',
      'fitness_char_limit: 500',
      'fitness_line_length: 100',
      '---',
      'line one',
      'line two',
    ].join('\n');

    const result = evaluateFitnessFile('test.md', content);

    expect(result.targetOk).toBe(true);
    expect(result.limitOk).toBe(true);
    expect(result.charsOk).toBe(true);
    expect(result.proseOk).toBe(true);
    expect(result.violations).toStrictEqual([]);
    expect(result.warnings).toStrictEqual([]);
  });

  it('reports above target but below limit as a warning without violations', () => {
    const content = [
      '---',
      'fitness_line_target: 2',
      'fitness_line_limit: 10',
      '---',
      'alpha',
      'beta',
      'gamma',
      'delta',
    ].join('\n');

    const result = evaluateFitnessFile('test.md', content);

    expect(result.targetOk).toBe(false);
    expect(result.limitOk).toBe(true);
    expect(result.violations).toStrictEqual([]);
    expect(result.warnings.length).toBeGreaterThan(0);
  });

  it('reports above limit as a violation', () => {
    const content = [
      '---',
      'fitness_line_target: 2',
      'fitness_line_limit: 3',
      '---',
      'alpha',
      'beta',
      'gamma',
      'delta',
      'epsilon',
    ].join('\n');

    const result = evaluateFitnessFile('test.md', content);

    expect(result.targetOk).toBe(false);
    expect(result.limitOk).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
  });
});

describe('shouldInspectFitnessPath', () => {
  it('keeps live markdown files and excludes backups and archives', () => {
    expect(shouldInspectFitnessPath('.agent/practice-core/practice.md')).toBe(true);
    expect(shouldInspectFitnessPath('.agent/practice-core-backup-2026-03-23/practice.md')).toBe(
      false,
    );
    expect(shouldInspectFitnessPath('.agent/memory/archive/napkin-2026-03-21.md')).toBe(false);
    expect(shouldInspectFitnessPath('.agent/practice-core/incoming/practice.md')).toBe(false);
  });
});

describe('getExitCode', () => {
  it('keeps strict mode blocking on hard-limit violations and informational mode non-blocking', () => {
    expect(getExitCode('strict', 2)).toBe(1);
    expect(getExitCode('strict', 0)).toBe(0);
    expect(getExitCode('informational', 2)).toBe(0);
  });

  it('does not count target-only exceedance as a violation for exit code purposes', () => {
    expect(getExitCode('strict', 0)).toBe(0);
  });
});
