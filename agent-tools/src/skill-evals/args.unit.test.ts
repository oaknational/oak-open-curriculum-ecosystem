/**
 * Unit tests for the skill-evals argument grammar.
 *
 * @remarks
 * Each test describes one invocation and the parse it must produce: the
 * command and its required options, the defaults, a malformed value named
 * as a usage error, and help. Literal argv, no IO.
 */

import { describe, expect, it } from 'vitest';

import { parseSkillEvalsArgs, SKILL_EVALS_DEFAULTS } from './args.js';

describe('parseSkillEvalsArgs', () => {
  it('parses a run, starting from the declared defaults and no cost ceiling', () => {
    const parsed = parseSkillEvalsArgs([
      'run',
      '--skill',
      '.agent/skills/planning/user-value',
      '--host-skill',
      'oak-user-value',
    ]);
    expect(parsed.error).toBeUndefined();
    expect(parsed.command).toBe('run');
    expect(parsed).toMatchObject(SKILL_EVALS_DEFAULTS);
    expect(parsed.maxCostUsd).toBeUndefined();
    expect(parsed.caseGlob).toBeUndefined();
    expect(parsed.also).toEqual([]);
  });

  it('parses every run option', () => {
    const parsed = parseSkillEvalsArgs([
      'run',
      '--skill',
      'a',
      '--host-skill',
      'b',
      '--suite',
      'triggers',
      '--ablation',
      'none',
      '--runs',
      '2',
      '--max-cost-usd',
      '40',
      '--judge-model',
      'sonnet',
      '--model',
      'opus',
      '--case',
      'case-0*',
      '--max-turns',
      '9',
      '--trigger-max-turns',
      '3',
      '--timeout-seconds',
      '300',
      '--keep-plugin',
      '--json',
    ]);
    expect(parsed.error).toBeUndefined();
    expect(parsed).toMatchObject({
      suite: 'triggers',
      ablation: 'none',
      runs: 2,
      maxCostUsd: 40,
      judgeModel: 'sonnet',
      model: 'opus',
      caseGlob: 'case-0*',
      maxTurns: 9,
      triggerMaxTurns: 3,
      timeoutSeconds: 300,
      keepPlugin: true,
      json: true,
    });
  });

  it('collects each --also as a carried skill, and names a malformed one', () => {
    const parsed = parseSkillEvalsArgs([
      'run',
      '--skill',
      'a',
      '--host-skill',
      'b',
      '--also',
      '.agent/skills/planning/plan=oak-plan',
      '--also',
      '.agent/skills/specification/specify=oak-specify',
    ]);
    expect(parsed.error).toBeUndefined();
    expect(parsed.also).toEqual([
      { skill: '.agent/skills/planning/plan', hostSkill: 'oak-plan' },
      { skill: '.agent/skills/specification/specify', hostSkill: 'oak-specify' },
    ]);
    for (const malformed of ['plan', '=oak-plan', 'plan=']) {
      expect(
        parseSkillEvalsArgs(['run', '--skill', 'a', '--host-skill', 'b', '--also', malformed])
          .error,
      ).toContain('--also');
    }
  });

  it('requires --skill and --host-skill', () => {
    const parsed = parseSkillEvalsArgs(['run', '--skill', 'a']);
    expect(parsed.error).toContain('--host-skill');
  });

  it('requires --out for project', () => {
    const parsed = parseSkillEvalsArgs(['project', '--skill', 'a', '--host-skill', 'b']);
    expect(parsed.error).toContain('--out');
  });

  it('names a malformed value', () => {
    expect(
      parseSkillEvalsArgs(['run', '--skill', 'a', '--host-skill', 'b', '--runs', '0']).error,
    ).toContain('--runs');
    expect(
      parseSkillEvalsArgs(['run', '--skill', 'a', '--host-skill', 'b', '--suite', 'x']).error,
    ).toContain('--suite');
    expect(
      parseSkillEvalsArgs(['run', '--skill', 'a', '--host-skill', 'b', '--ablation', 'both']).error,
    ).toContain('--ablation');
  });

  it('refuses an unknown command and an unknown option', () => {
    expect(parseSkillEvalsArgs(['audit']).error).toContain('unexpected positional argument');
    expect(
      parseSkillEvalsArgs(['run', '--skill', 'a', '--host-skill', 'b', '--bogus']).error,
    ).toContain('unknown option');
  });

  it('answers help without a command', () => {
    expect(parseSkillEvalsArgs([]).help).toBe(true);
    expect(parseSkillEvalsArgs(['--help']).help).toBe(true);
    expect(parseSkillEvalsArgs(['run', '-h']).help).toBe(true);
  });
});
