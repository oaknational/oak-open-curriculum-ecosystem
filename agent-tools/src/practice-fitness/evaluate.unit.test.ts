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

  it('parses fitness_token_target and fitness_token_limit as numbers', () => {
    const content = [
      '---',
      'fitness_token_target: 100',
      'fitness_token_limit: 200',
      '---',
      'alpha',
    ].join('\n');

    const result = evaluateFitnessFile('tokens.md', content);

    expect(result.targetTokens).toBe(100);
    expect(result.limitTokens).toBe(200);
  });

  it('classifies token zone healthy when estimated tokens are at or below target', () => {
    const content = [
      '---',
      'fitness_token_target: 100',
      'fitness_token_limit: 200',
      '---',
      'a',
    ].join('\n');

    const result = evaluateFitnessFile('tokens-healthy.md', content);

    expect(result.tokenZone).toBe('healthy');
    expect(result.configurationFindings).toEqual([]);
  });

  it('classifies token zone soft when estimated tokens are above target but at or below limit', () => {
    // 401 content chars -> 101 estimated tokens (chars/4 ceil).
    const body = 'a'.repeat(401);
    const content = [
      '---',
      'fitness_token_target: 100',
      'fitness_token_limit: 200',
      '---',
      body,
    ].join('\n');

    const result = evaluateFitnessFile('tokens-soft.md', content);

    expect(result.totalChars).toBe(401);
    expect(result.estimatedTokens).toBe(101);
    expect(result.tokenZone).toBe('soft');
  });

  it('classifies token zone hard when estimated tokens exceed limit but within critical ratio', () => {
    // 805 content chars -> 202 estimated tokens; limit 200, critical = 300.
    const body = 'a'.repeat(805);
    const content = [
      '---',
      'fitness_token_target: 100',
      'fitness_token_limit: 200',
      '---',
      body,
    ].join('\n');

    const result = evaluateFitnessFile('tokens-hard.md', content);

    expect(result.tokenZone).toBe('hard');
    expect(result.overallZone).toBe('hard');
  });

  it('classifies token zone critical when estimated tokens exceed limit times critical ratio', () => {
    // 1204 content chars -> 302 estimated tokens; limit 200, critical = 300.
    const body = 'a'.repeat(1204);
    const content = [
      '---',
      'fitness_token_target: 100',
      'fitness_token_limit: 200',
      '---',
      body,
    ].join('\n');

    const result = evaluateFitnessFile('tokens-critical.md', content);

    expect(result.tokenZone).toBe('critical');
    expect(result.overallZone).toBe('critical');
  });

  it('folds token zone into overallZone as the worst zone', () => {
    const body = 'a'.repeat(805);
    const content = [
      '---',
      'fitness_line_target: 100',
      'fitness_line_limit: 200',
      'fitness_token_target: 100',
      'fitness_token_limit: 200',
      '---',
      body,
    ].join('\n');

    const result = evaluateFitnessFile('overall-token.md', content);

    expect(result.lineZone).toBe('healthy');
    expect(result.tokenZone).toBe('hard');
    expect(result.overallZone).toBe('hard');
  });

  it('reports a configuration finding when target is set without limit', () => {
    const content = ['---', 'fitness_token_target: 100', '---', 'short'].join('\n');

    const result = evaluateFitnessFile('target-only.md', content);

    expect(result.tokenZone).toBeNull();
    expect(result.configurationFindings).toHaveLength(1);
    expect(result.configurationFindings[0]).toEqual({
      metric: 'tokens',
      text: 'fitness_token_target declared without fitness_token_limit — declare both or neither',
    });
  });

  it('does not classify target-only as a fitness zone', () => {
    const content = ['---', 'fitness_token_target: 1', '---', 'considerable body of text'].join(
      '\n',
    );

    const result = evaluateFitnessFile('target-only-zone.md', content);

    expect(result.tokenZone).toBeNull();
    expect(result.overallZone).toBe('healthy');
  });

  it('treats empty content as ready only for drainable buffers', () => {
    const drainable = evaluateFitnessFile(
      '.agent/memory/active/distilled.md',
      [
        '---',
        'fitness_line_target: 1',
        'fitness_line_limit: 2',
        'fitness_content_role: drainable-buffer',
        '---',
      ].join('\n'),
    );
    const reference = evaluateFitnessFile(
      '.agent/directives/AGENT.md',
      ['---', 'fitness_line_target: 1', 'fitness_line_limit: 2', '---'].join('\n'),
    );

    expect(drainable.contentRole).toBe('drainable-buffer');
    expect(drainable.configurationFindings).toStrictEqual([]);
    expect(reference.contentRole).toBe('reference');
    expect(reference.configurationFindings).toStrictEqual([
      {
        metric: 'content-role',
        text: 'empty content is only ready for fitness_content_role: drainable-buffer — add content or declare the drainable role',
      },
    ]);
  });

  it('reports unknown content roles as configuration findings', () => {
    const result = evaluateFitnessFile(
      'unknown-role.md',
      [
        '---',
        'fitness_line_target: 1',
        'fitness_line_limit: 2',
        'fitness_content_role: queue',
        '---',
        'body',
      ].join('\n'),
    );

    expect(result.contentRole).toBe('reference');
    expect(result.configurationFindings).toStrictEqual([
      {
        metric: 'content-role',
        text: 'fitness_content_role must be reference or drainable-buffer, got queue',
      },
    ]);
  });

  it('rejects split_strategy on drainable buffers', () => {
    const result = evaluateFitnessFile(
      '.agent/memory/operational/pending-graduations.md',
      [
        '---',
        'fitness_line_target: 10',
        'fitness_line_limit: 20',
        'fitness_content_role: drainable-buffer',
        'split_strategy: "move overflow to a child queue"',
        '---',
        'body',
      ].join('\n'),
    );

    expect(result.configurationFindings).toContainEqual({
      metric: 'lifecycle',
      text: 'drainable buffers must not declare split_strategy — use drain_strategy and process items in place',
    });
  });

  it('rejects active-pending-graduations-shard as a lifecycle state', () => {
    const result = evaluateFitnessFile(
      '.agent/memory/operational/pending-graduations/legacy.md',
      ['---', 'surface_kind: active-pending-graduations-shard', '---', 'body'].join('\n'),
    );

    expect(result.configurationFindings).toStrictEqual([
      {
        metric: 'lifecycle',
        text: 'active-pending-graduations-shard is not a valid lifecycle state — mark legacy files as pending-graduations-recovery-file while draining them',
      },
    ]);
  });

  it('rejects shard lifecycle aliases in merge_class metadata', () => {
    const result = evaluateFitnessFile(
      '.agent/memory/operational/pending-graduations/legacy.md',
      ['---', 'merge_class: active-register-shard', '---', 'body'].join('\n'),
    );

    expect(result.configurationFindings).toStrictEqual([
      {
        metric: 'lifecycle',
        text: 'merge_class must not label live buffers as shards — use drain_strategy and process items in place',
      },
    ]);
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
