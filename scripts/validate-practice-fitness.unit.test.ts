import { describe, expect, it } from 'vitest';

import {
  classifyFitnessZone,
  evaluateFitnessFile,
  getExitCode,
  shouldInspectFitnessPath,
  worstZone,
} from './validate-practice-fitness.js';

describe('classifyFitnessZone', () => {
  it('returns null when neither a target nor a hard limit is declared', () => {
    expect(classifyFitnessZone(42, null, null)).toBeNull();
  });

  it('returns healthy when the count is at or below the target', () => {
    expect(classifyFitnessZone(10, 10, 15)).toBe('healthy');
    expect(classifyFitnessZone(5, 10, 15)).toBe('healthy');
  });

  it('returns healthy when no target is declared but count is at or below the hard limit', () => {
    expect(classifyFitnessZone(15, null, 15)).toBe('healthy');
    expect(classifyFitnessZone(0, null, 100)).toBe('healthy');
  });

  it('returns soft when the count is above the target but at or below the hard limit', () => {
    expect(classifyFitnessZone(11, 10, 15)).toBe('soft');
    expect(classifyFitnessZone(15, 10, 15)).toBe('soft');
  });

  it('returns hard when the count is above the hard limit but within the critical ratio', () => {
    expect(classifyFitnessZone(16, 10, 15)).toBe('hard');
    // critical threshold = 15 × 1.5 = 22.5; the largest integer count
    // still in the hard zone is 22 (22.5 is unreachable for integer counts).
    expect(classifyFitnessZone(22, 10, 15)).toBe('hard');
  });

  it('returns critical when the count exceeds the hard limit times the critical ratio', () => {
    expect(classifyFitnessZone(23, 10, 15)).toBe('critical');
    expect(classifyFitnessZone(100, 10, 15)).toBe('critical');
  });

  it('accepts an explicit critical ratio override for testing', () => {
    // ratio 1.4: critical threshold = 15 * 1.4 = 21; count 22 exceeds -> critical
    expect(classifyFitnessZone(22, 10, 15, 1.4)).toBe('critical');
    // ratio 1.5: critical threshold = 15 * 1.5 = 22.5; count 20 is within -> hard
    expect(classifyFitnessZone(20, 10, 15, 1.5)).toBe('hard');
  });
});

describe('worstZone', () => {
  it('returns healthy for an all-healthy array', () => {
    expect(worstZone(['healthy', 'healthy', 'healthy'])).toBe('healthy');
  });

  it('ignores null entries', () => {
    expect(worstZone(['healthy', null, 'healthy'])).toBe('healthy');
    expect(worstZone([null, null])).toBe('healthy');
  });

  it('returns the worst zone across the array', () => {
    expect(worstZone(['healthy', 'soft'])).toBe('soft');
    expect(worstZone(['soft', 'hard'])).toBe('hard');
    expect(worstZone(['hard', 'critical'])).toBe('critical');
    expect(worstZone(['healthy', 'critical', 'soft'])).toBe('critical');
  });
});

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
    expect(result.lineZone).toBe('soft');
    expect(result.charZone).toBe('healthy');
    expect(result.proseZone).toBe('healthy');
    expect(result.overallZone).toBe('soft');
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
    expect(result.lineZone).toBe('healthy');
    expect(result.charZone).toBeNull();
    expect(result.proseZone).toBeNull();
    expect(result.overallZone).toBe('healthy');
  });

  it('reports all-metrics-below-target as healthy', () => {
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

    expect(result.lineZone).toBe('healthy');
    expect(result.charZone).toBe('healthy');
    expect(result.proseZone).toBe('healthy');
    expect(result.overallZone).toBe('healthy');
  });

  it('reports above target but below hard limit as soft', () => {
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

    expect(result.lineZone).toBe('soft');
    expect(result.overallZone).toBe('soft');
  });

  it('reports above hard limit but below critical as hard', () => {
    // target 2, limit 3, critical = 3 * 1.5 = 4.5 → 4 lines is hard
    const content = [
      '---',
      'fitness_line_target: 2',
      'fitness_line_limit: 3',
      '---',
      'alpha',
      'beta',
      'gamma',
      'delta',
    ].join('\n');

    const result = evaluateFitnessFile('test.md', content);

    expect(result.lineZone).toBe('hard');
    expect(result.overallZone).toBe('hard');
  });

  it('reports above critical as critical', () => {
    // target 2, limit 3, critical = 3 * 1.5 = 4.5 → 10 lines is critical
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
      'zeta',
      'eta',
      'theta',
      'iota',
      'kappa',
    ].join('\n');

    const result = evaluateFitnessFile('test.md', content);

    expect(result.lineZone).toBe('critical');
    expect(result.overallZone).toBe('critical');
  });

  it('classifies char limit exceedance as hard or critical', () => {
    // char_limit 10, critical = 15. "abcdefghijklm" is 13 chars → hard
    const hardContent = [
      '---',
      'fitness_line_target: 10',
      'fitness_line_limit: 20',
      'fitness_char_limit: 10',
      '---',
      'abcdefghijklm',
    ].join('\n');
    const hardResult = evaluateFitnessFile('test.md', hardContent);
    expect(hardResult.charZone).toBe('hard');
    expect(hardResult.overallZone).toBe('hard');

    // char_limit 10, critical = 15. "abcdefghijklmnopqrst" is 20 chars → critical
    const criticalContent = [
      '---',
      'fitness_line_target: 10',
      'fitness_line_limit: 20',
      'fitness_char_limit: 10',
      '---',
      'abcdefghijklmnopqrst',
    ].join('\n');
    const criticalResult = evaluateFitnessFile('test.md', criticalContent);
    expect(criticalResult.charZone).toBe('critical');
    expect(criticalResult.overallZone).toBe('critical');
  });

  it('takes the worst zone across all declared metrics as the overall zone', () => {
    // line_limit 20 (healthy for 2 content lines); char_limit 10 → critical
    // threshold 15; fixture totals 30 chars ⇒ char zone is critical, so the
    // overall zone must be critical.
    const content = [
      '---',
      'fitness_line_target: 10',
      'fitness_line_limit: 20',
      'fitness_char_limit: 10',
      '---',
      'the quick brown fox',
      'jumps over',
    ].join('\n');

    const result = evaluateFitnessFile('test.md', content);

    expect(result.lineZone).toBe('healthy');
    expect(result.charZone).toBe('critical');
    expect(result.overallZone).toBe('critical');
  });
});

describe('shouldInspectFitnessPath', () => {
  it('keeps live markdown files and excludes backups and archives', () => {
    expect(shouldInspectFitnessPath('.agent/practice-core/practice.md')).toBe(true);
    expect(shouldInspectFitnessPath('.agent/practice-core-backup-2026-03-23/practice.md')).toBe(
      false,
    );
    expect(shouldInspectFitnessPath('.agent/memory/active/archive/napkin-2026-03-21.md')).toBe(
      false,
    );
    expect(shouldInspectFitnessPath('.agent/practice-core/incoming/practice.md')).toBe(false);
  });
});

describe('getExitCode', () => {
  it('always exits 0 in informational mode regardless of zones', () => {
    expect(getExitCode('informational', ['healthy'])).toBe(0);
    expect(getExitCode('informational', ['soft', 'hard', 'critical'])).toBe(0);
    expect(getExitCode('informational', [])).toBe(0);
  });

  it('exits 0 in strict mode for healthy, soft, hard, and empty inputs', () => {
    expect(getExitCode('strict', ['healthy'])).toBe(0);
    expect(getExitCode('strict', ['soft'])).toBe(0);
    expect(getExitCode('strict', ['hard'])).toBe(0);
    expect(getExitCode('strict', ['healthy', 'soft', 'hard'])).toBe(0);
    expect(getExitCode('strict', [])).toBe(0);
  });

  it('exits 1 in strict mode only when any file reaches critical', () => {
    expect(getExitCode('strict', ['critical'])).toBe(1);
    expect(getExitCode('strict', ['healthy', 'soft', 'critical'])).toBe(1);
  });

  it('exits 1 in strict-hard mode when any file reaches hard or critical', () => {
    expect(getExitCode('strict-hard', ['hard'])).toBe(1);
    expect(getExitCode('strict-hard', ['critical'])).toBe(1);
    expect(getExitCode('strict-hard', ['healthy', 'soft'])).toBe(0);
    expect(getExitCode('strict-hard', [])).toBe(0);
  });
});
