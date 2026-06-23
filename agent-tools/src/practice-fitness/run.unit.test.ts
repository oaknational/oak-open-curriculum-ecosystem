import { describe, expect, it } from 'vitest';

import { evaluateFitnessFile } from './evaluate.js';
import {
  FITNESS_MODE_INFORMATIONAL,
  FITNESS_MODE_STRICT,
  FITNESS_MODE_STRICT_HARD,
} from './model.js';
import { getMode, readFitnessFiles, writePracticeFitnessReport } from './run.js';

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

describe('readFitnessFiles', () => {
  it('reads each fitness file from disk exactly once and threads its content', async () => {
    // The fitness report and the decision-debt reading both derive from this one
    // pass, so a file is never read twice (the doubled-IO regression guard).
    const reads: string[] = [];
    const reader = (absPath: string): Promise<string> => {
      reads.push(absPath);
      return Promise.resolve(`content of ${absPath}`);
    };

    const files = await readFitnessFiles('/repo', ['.agent/a.md', '.agent/b.md'], reader);

    expect(reads).toEqual(['/repo/.agent/a.md', '/repo/.agent/b.md']);
    expect(files).toEqual([
      { relPath: '.agent/a.md', content: 'content of /repo/.agent/a.md' },
      { relPath: '.agent/b.md', content: 'content of /repo/.agent/b.md' },
    ]);
  });
});
