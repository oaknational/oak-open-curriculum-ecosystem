import { describe, expect, it } from 'vitest';

import { charsOverFourTokenizer } from '../context-cost/tokenizer.js';
import { evaluateFitnessFile } from './evaluate.js';
import { extractFitnessContentText } from './markdown.js';
import { classifyFitnessZone, estimateTokensFromContentChars, worstZone } from './model.js';

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
    expect(classifyFitnessZone(22, 10, 15)).toBe('hard');
  });

  it('returns critical when the count exceeds the hard limit times the critical ratio', () => {
    expect(classifyFitnessZone(23, 10, 15)).toBe('critical');
    expect(classifyFitnessZone(100, 10, 15)).toBe('critical');
  });

  it('accepts an explicit critical ratio override for testing', () => {
    expect(classifyFitnessZone(22, 10, 15, 1.4)).toBe('critical');
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

    expect(result.contentText).toBe('\nshort\ntiny\nwords');
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

describe('content-only token measurement', () => {
  it('estimates empty content as zero tokens', () => {
    expect(estimateTokensFromContentChars(0)).toBe(0);
  });

  it('uses the chars-over-four rule', () => {
    expect(estimateTokensFromContentChars(4)).toBe(1);
    expect(estimateTokensFromContentChars(5)).toBe(2);
  });

  it('matches context-cost raw-file estimates when no frontmatter is present', () => {
    const raw = 'abcd\nefgh';
    const contentText = extractFitnessContentText(raw);
    const result = evaluateFitnessFile('plain.md', raw);

    expect(raw).toBe('abcd\nefgh');
    expect(contentText).toBe('abcd\nefgh');
    expect(result.contentText).toBe('abcd\nefgh');
    expect(result.totalChars).toBe(9);
    expect(result.estimatedTokens).toBe(3);
    expect(charsOverFourTokenizer.estimate(raw)).toBe(3);
  });

  it('differs from context-cost raw-file estimates when frontmatter is present', () => {
    const raw = [
      '---',
      'fitness_line_target: 10',
      'fitness_line_limit: 20',
      '---',
      '',
      'abcde',
    ].join('\n');
    const contentText = extractFitnessContentText(raw);
    const result = evaluateFitnessFile('frontmatter.md', raw);

    expect(raw).toBe('---\nfitness_line_target: 10\nfitness_line_limit: 20\n---\n\nabcde');
    expect(raw.length).toBe(61);
    expect(contentText).toBe('\nabcde');
    expect(result.contentText).toBe('\nabcde');
    expect(result.totalChars).toBe(6);
    expect(result.estimatedTokens).toBe(2);
    expect(charsOverFourTokenizer.estimate(raw)).toBe(16);
  });
});
