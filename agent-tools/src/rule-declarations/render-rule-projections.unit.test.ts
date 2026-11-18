import { describe, expect, it } from 'vitest';

import {
  renderAgentsRuleAdapter,
  renderClaudeRuleAdapter,
  renderCursorTrigger,
  renderRuleProjections,
  renderRulesIndex,
  RULES_INDEX_HEADING,
} from './render-rule-projections.js';
import type { RuleDeclaration } from './rule-declaration.js';

const core: RuleDeclaration = {
  name: 'compute-dont-hope',
  classification: 'core',
  description: 'Never keep a list by hand.',
};
const scoped: RuleDeclaration = {
  name: 'no-type-shortcuts',
  classification: 'situational',
  description: 'Avoid type assertions, any, and non-null shortcuts except as const',
  trigger: 'surface:**/*.ts,**/*.tsx',
  globs: ['**/*.ts', '**/*.tsx'],
};
const unscoped: RuleDeclaration = {
  name: 'ping-before-escalate',
  classification: 'situational',
  description: 'Ping before escalating.',
  trigger: 'session:team',
  globs: [],
};
const colon: RuleDeclaration = {
  name: 'agent-experience-review-lens',
  classification: 'situational',
  description: 'Apply the lens: usable first time.',
  trigger: 'surface:agent-substrate',
  globs: ['agent-tools/**', '.agent/hooks/**'],
};
const apostropheAndColon: RuleDeclaration = {
  name: 'stage-by-explicit-pathspec',
  classification: 'core',
  description: "Stage by pathspec: never `git add .`, it's a sweep",
};
const braced: RuleDeclaration = {
  name: 'use-result-pattern',
  classification: 'situational',
  description: 'Return Result, never throw for expected failures.',
  trigger: 'surface:**/*.{ts,tsx,mts}',
  globs: ['**/*.{ts,tsx,mts}', 'e2e/**/*'],
};

describe('renderCursorTrigger', () => {
  it('renders a core rule as always applied with the pointer body', () => {
    expect(renderCursorTrigger(core)).toBe(
      [
        '---',
        'description: Never keep a list by hand.',
        'alwaysApply: true',
        '---',
        '',
        'Read and follow `.agent/rules/compute-dont-hope.md`.',
        '',
      ].join('\n'),
    );
  });

  it('renders a scoped rule with a single-quoted comma-joined globs string before alwaysApply', () => {
    expect(renderCursorTrigger(scoped)).toBe(
      [
        '---',
        'description: Avoid type assertions, any, and non-null shortcuts except as const',
        "globs: '**/*.ts,**/*.tsx'",
        'alwaysApply: false',
        '---',
        '',
        'Read and follow `.agent/rules/no-type-shortcuts.md`.',
        '',
      ].join('\n'),
    );
  });

  it('renders a glob-less situational rule as agent-requested (no globs, alwaysApply false)', () => {
    expect(renderCursorTrigger(unscoped)).toContain('alwaysApply: false');
    expect(renderCursorTrigger(unscoped)).not.toContain('globs:');
  });

  it('quotes a description plain YAML could not carry', () => {
    expect(renderCursorTrigger(colon)).toContain(
      "description: 'Apply the lens: usable first time.'",
    );
  });

  it('falls back to double quotes when the description holds an apostrophe and a colon', () => {
    expect(renderCursorTrigger(apostropheAndColon)).toContain(
      'description: "Stage by pathspec: never `git add .`, it\'s a sweep"',
    );
  });

  it('keeps a brace group inside one comma-joined globs string', () => {
    expect(renderCursorTrigger(braced)).toContain("globs: '**/*.{ts,tsx,mts},e2e/**/*'");
  });
});

describe('renderClaudeRuleAdapter', () => {
  it('renders a core rule as a plain pointer', () => {
    expect(renderClaudeRuleAdapter(core)).toBe(
      'Read and follow `.agent/rules/compute-dont-hope.md`.\n',
    );
  });

  it('renders a scoped rule with a paths list above the plain pointer', () => {
    expect(renderClaudeRuleAdapter(scoped)).toBe(
      [
        '---',
        'paths:',
        '  - "**/*.ts"',
        '  - "**/*.tsx"',
        '---',
        '',
        'Read and follow `.agent/rules/no-type-shortcuts.md`.',
        '',
      ].join('\n'),
    );
  });

  it('never renders an @ import: a scoped rule points in a code span like every other rule', () => {
    expect(renderClaudeRuleAdapter(braced)).toBe(
      [
        '---',
        'paths:',
        '  - "**/*.{ts,tsx,mts}"',
        '  - e2e/**/*',
        '---',
        '',
        'Read and follow `.agent/rules/use-result-pattern.md`.',
        '',
      ].join('\n'),
    );
  });

  it('renders a glob-less situational rule as a plain pointer', () => {
    expect(renderClaudeRuleAdapter(unscoped)).toBe(
      'Read and follow `.agent/rules/ping-before-escalate.md`.\n',
    );
  });
});

describe('renderAgentsRuleAdapter', () => {
  it('renders every rule as a plain pointer', () => {
    expect(renderAgentsRuleAdapter(scoped)).toBe(
      'Read and follow `.agent/rules/no-type-shortcuts.md`.\n',
    );
  });
});

describe('renderRulesIndex', () => {
  it('renders the heading, the prose, and one compact row per rule in name order', () => {
    const text = renderRulesIndex([scoped, core, unscoped]);
    expect(text.startsWith(`${RULES_INDEX_HEADING}\n`)).toBe(true);
    expect(text.endsWith('\n')).toBe(true);
    const rows = text.split('\n').filter((line) => line.startsWith('| `.agent/rules/'));
    expect(rows).toEqual([
      '| `.agent/rules/compute-dont-hope.md` | core | — |',
      '| `.agent/rules/no-type-shortcuts.md` | situational | `surface:**/*.ts,**/*.tsx` |',
      '| `.agent/rules/ping-before-escalate.md` | situational | `session:team` |',
    ]);
  });
});

describe('renderRuleProjections', () => {
  it('projects every declaration onto the four surfaces plus the index, path-keyed', () => {
    const projections = renderRuleProjections([core]);
    expect(projections.map((projection) => projection.path)).toEqual([
      'RULES_INDEX.md',
      '.cursor/rules/compute-dont-hope.mdc',
      '.claude/rules/compute-dont-hope.md',
      '.agents/rules/compute-dont-hope.md',
    ]);
    expect(projections.every((projection) => projection.text.endsWith('\n'))).toBe(true);
  });

  it('renders no @ import on any surface, scoped or not: the platform expands one at launch', () => {
    const projections = renderRuleProjections([core, scoped, braced, unscoped]);
    expect(projections.filter((projection) => projection.text.includes('@'))).toStrictEqual([]);
  });
});
