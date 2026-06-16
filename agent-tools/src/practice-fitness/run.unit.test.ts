import { describe, expect, it } from 'vitest';

import { evaluateFitnessFile } from './evaluate.js';
import {
  FITNESS_MODE_INFORMATIONAL,
  FITNESS_MODE_STRICT,
  FITNESS_MODE_STRICT_HARD,
} from './model.js';
import { getMode, writePracticeFitnessReport } from './run.js';

describe('getMode', () => {
  it('parses informational and strict-hard flags', () => {
    expect(getMode(['--informational'])).toBe(FITNESS_MODE_INFORMATIONAL);
    expect(getMode(['--strict-hard'])).toBe(FITNESS_MODE_STRICT_HARD);
    expect(getMode([])).toBe(FITNESS_MODE_STRICT);
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
