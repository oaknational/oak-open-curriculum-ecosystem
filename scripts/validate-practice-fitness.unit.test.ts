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
      'fitness_line_count: 3',
      'fitness_char_count: 30',
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
    expect(result.linesOk).toBe(false);
    expect(result.charsOk).toBe(true);
    expect(result.proseOk).toBe(true);
    expect(result.violations).toStrictEqual(['Lines: 4 exceeds ceiling 3']);
  });

  it('checks only the dimensions declared in frontmatter', () => {
    const content = ['---', 'fitness_line_count: 2', '---', 'alpha', 'beta'].join('\n');

    const result = evaluateFitnessFile('docs/governance/development-practice.md', content);

    expect(result.ceilingLines).toBe(2);
    expect(result.ceilingChars).toBeNull();
    expect(result.maxProseLineWidth).toBeNull();
    expect(result.linesOk).toBe(true);
    expect(result.charsOk).toBe(true);
    expect(result.proseOk).toBe(true);
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
  it('keeps strict mode blocking and informational mode non-blocking', () => {
    expect(getExitCode('strict', 2)).toBe(1);
    expect(getExitCode('strict', 0)).toBe(0);
    expect(getExitCode('informational', 2)).toBe(0);
  });
});
