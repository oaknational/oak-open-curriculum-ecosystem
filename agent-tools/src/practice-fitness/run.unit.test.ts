import { describe, expect, it } from 'vitest';

import { evaluateFitnessFile } from './evaluate.js';
import {
  FITNESS_MODE_INFORMATIONAL,
  FITNESS_MODE_STRICT,
  FITNESS_MODE_STRICT_HARD,
  getExitCode,
} from './model.js';
import { getMode, writePracticeFitnessReport } from './run.js';

describe('getMode', () => {
  it('parses informational and strict-hard flags', () => {
    expect(getMode(['--informational'])).toBe(FITNESS_MODE_INFORMATIONAL);
    expect(getMode(['--strict-hard'])).toBe(FITNESS_MODE_STRICT_HARD);
    expect(getMode([])).toBe(FITNESS_MODE_STRICT);
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

  it('exits 1 in strict mode when configuration findings exist regardless of zones', () => {
    expect(getExitCode('strict', ['healthy'], true)).toBe(1);
    expect(getExitCode('strict', [], true)).toBe(1);
  });

  it('exits 1 in strict-hard mode when configuration findings exist regardless of zones', () => {
    expect(getExitCode('strict-hard', ['healthy'], true)).toBe(1);
    expect(getExitCode('strict-hard', ['soft'], true)).toBe(1);
  });

  it('exits 0 in informational mode even when configuration findings exist', () => {
    expect(getExitCode('informational', ['healthy'], true)).toBe(0);
    expect(getExitCode('informational', ['critical'], true)).toBe(0);
  });
});

describe('writePracticeFitnessReport', () => {
  it('prints ready empty and healthy cases in the actionable zone inventory', () => {
    const results = [
      evaluateFitnessFile(
        '.agent/ready.md',
        [
          '---',
          'fitness_line_target: 1',
          'fitness_line_limit: 2',
          'fitness_content_role: drainable-buffer',
          '---',
        ].join('\n'),
      ),
      evaluateFitnessFile(
        '.agent/healthy.md',
        ['---', 'fitness_line_target: 2', 'fitness_line_limit: 4', '---', 'content'].join('\n'),
      ),
      evaluateFitnessFile(
        '.agent/soft.md',
        ['---', 'fitness_line_target: 1', 'fitness_line_limit: 4', '---', 'one', 'two'].join('\n'),
      ),
    ];
    const output: string[] = [];
    writePracticeFitnessReport(
      { log: (message = '') => output.push(message) },
      'informational',
      results,
    );

    const report = output.join('\n');
    expect(report).toContain('Fitness zone inventory:');
    expect(report).toContain('ready (empty) (1):');
    expect(report).toContain('.agent/ready.md: no content after frontmatter');
    expect(report).toContain('healthy (1):');
    expect(report).toContain('.agent/healthy.md: within thresholds');
    expect(report).toContain('soft (1):');
    expect(report).toContain('.agent/soft.md: Lines: 2 above target 1 (limit 4)');
  });
});
