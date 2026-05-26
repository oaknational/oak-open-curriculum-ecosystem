import { describe, expect, it } from 'vitest';

import { evaluateFitnessFile } from './evaluate.js';
import {
  formatFitnessInventory,
  formatFitnessResponseDiscipline,
  formatFitnessResult,
  formatSummary,
  summariseResults,
} from './format.js';

describe('formatFitnessResult', () => {
  it('includes a token row when no token threshold is declared', () => {
    const content = [
      '---',
      'fitness_line_target: 10',
      'fitness_line_limit: 20',
      '---',
      'abcd',
      'efghi',
    ].join('\n');
    const result = evaluateFitnessFile('test.md', content);

    expect(formatFitnessResult(result)).toContain(
      'Tokens:                3  (content est.; no threshold)',
    );
  });

  it('formats through the pure formatter seam instead of console output', () => {
    const content = [
      '---',
      'fitness_line_target: 1',
      'fitness_line_limit: 2',
      '---',
      'alpha',
      'beta',
    ].join('\n');
    const output = formatFitnessResult(evaluateFitnessFile('pure.md', content));

    expect(output).toContain('pure.md');
    expect(output).toContain('Lines:                 2 / target 1 / limit 2');
    expect(output).toContain('Tokens:                3  (content est.; no threshold)');
  });
});

describe('formatFitnessResult with token thresholds', () => {
  it('renders token row with target and limit when both are declared', () => {
    const content = [
      '---',
      'fitness_token_target: 100',
      'fitness_token_limit: 200',
      '---',
      'short body',
    ].join('\n');
    const result = evaluateFitnessFile('with-thresholds.md', content);

    const output = formatFitnessResult(result);
    expect(output).toContain('Tokens:');
    expect(output).toContain('target 100');
    expect(output).toContain('limit 200');
    expect(output).not.toMatch(/Tokens:.*\(no threshold\)/);
  });

  it('renders configuration findings when target is declared without limit', () => {
    const content = ['---', 'fitness_token_target: 100', '---', 'short'].join('\n');
    const result = evaluateFitnessFile('target-only.md', content);

    const output = formatFitnessResult(result);
    expect(output).toContain('Configuration findings:');
    expect(output).toContain('fitness_token_target declared without fitness_token_limit');
  });

  it('does not render configuration findings section when none exist', () => {
    const content = ['---', 'fitness_line_target: 1', 'fitness_line_limit: 2', '---', 'a'].join(
      '\n',
    );
    const result = evaluateFitnessFile('clean.md', content);

    const output = formatFitnessResult(result);
    expect(output).not.toContain('Configuration findings:');
  });
});

describe('formatFitnessInventory', () => {
  it('lists ready empty, healthy, and non-healthy cases together', () => {
    const ready = evaluateFitnessFile(
      'ready.md',
      [
        '---',
        'fitness_line_target: 1',
        'fitness_line_limit: 2',
        'fitness_content_role: drainable-buffer',
        '---',
      ].join('\n'),
    );
    const healthy = evaluateFitnessFile(
      'healthy.md',
      ['---', 'fitness_line_target: 2', 'fitness_line_limit: 4', '---', 'content'].join('\n'),
    );
    const soft = evaluateFitnessFile(
      'soft.md',
      ['---', 'fitness_line_target: 1', 'fitness_line_limit: 4', '---', 'one', 'two'].join('\n'),
    );

    const output = formatFitnessInventory([ready, healthy, soft]);

    expect(output).toContain('Fitness zone inventory:');
    expect(output).toContain('ready (empty) (1):');
    expect(output).toContain('ready.md: no content after frontmatter');
    expect(output).toContain('healthy (1):');
    expect(output).toContain('healthy.md: within thresholds');
    expect(output).toContain('soft (1):');
    expect(output).toContain('soft.md: Lines: 2 above target 1 (limit 4)');
    expect(output).toContain('hard (0): none');
    expect(output).toContain('critical (0): none');
  });

  it('does not list empty reference files as ready', () => {
    const reference = evaluateFitnessFile(
      'directive.md',
      ['---', 'fitness_line_target: 1', 'fitness_line_limit: 2', '---'].join('\n'),
    );

    const output = formatFitnessInventory([reference]);

    expect(output).toContain('ready (empty) (0): none');
    expect(output).toContain('healthy (1):');
    expect(output).toContain('directive.md: within thresholds');
  });
});

describe('formatSummary', () => {
  it('counts ready empty files separately from healthy files', () => {
    const ready = evaluateFitnessFile(
      'ready.md',
      [
        '---',
        'fitness_line_target: 1',
        'fitness_line_limit: 2',
        'fitness_content_role: drainable-buffer',
        '---',
      ].join('\n'),
    );
    const healthy = evaluateFitnessFile(
      'healthy.md',
      ['---', 'fitness_line_target: 2', 'fitness_line_limit: 4', '---', 'content'].join('\n'),
    );

    const summary = formatSummary('strict', summariseResults([ready, healthy]));

    expect(summary).toContain('Result: PASS');
    expect(summary).toContain('all files healthy; 1 ready empty');
  });
});

describe('formatFitnessResponseDiscipline', () => {
  it('reminds agents to preserve substance and route fitness structurally', () => {
    const guidance = formatFitnessResponseDiscipline();

    expect(guidance).toContain('Preserve substance first');
    expect(guidance).toContain('Do not delete, trim, compress, or weaken memory');
    expect(guidance).toContain('Practice Core content');
    expect(guidance).toContain('Treat fitness as a routing signal');
    expect(guidance).toContain('do not make');
    expect(guidance).toContain('reactive budget-shaped prose edits');
  });
});
