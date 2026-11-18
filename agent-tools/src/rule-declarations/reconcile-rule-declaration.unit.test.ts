import { describe, expect, it } from 'vitest';

import { reconcileRuleDeclaration, type RuleSources } from './reconcile-rule-declaration.js';

function sources(overrides: Partial<RuleSources>): RuleSources {
  return {
    name: 'r',
    index: { classification: 'core' },
    cursor: { description: 'd', alwaysApply: true, globs: [] },
    claudePaths: [],
    ...overrides,
  };
}

describe('reconcileRuleDeclaration', () => {
  it('declares a core rule from an agreeing index row and trigger with no reconciliation', () => {
    expect(reconcileRuleDeclaration(sources({}))).toEqual({
      declaration: { name: 'r', classification: 'core', description: 'd' },
      reconciliations: [],
    });
  });

  it('declares a situational rule with the index trigger and the Cursor globs', () => {
    const result = reconcileRuleDeclaration(
      sources({
        index: { classification: 'situational', trigger: 'surface:test-authoring' },
        cursor: { description: 'd', alwaysApply: false, globs: ['**/*.test.*'] },
      }),
    );
    expect(result).toEqual({
      declaration: {
        name: 'r',
        classification: 'situational',
        description: 'd',
        trigger: 'surface:test-authoring',
        globs: ['**/*.test.*'],
      },
      reconciliations: [],
    });
  });

  it('lets the index win over a bare alwaysApply true on a situational rule, and lists it', () => {
    const result = reconcileRuleDeclaration(
      sources({
        index: { classification: 'situational', trigger: 'surface:types' },
        cursor: { description: 'd', alwaysApply: true, globs: [] },
      }),
    );
    expect(result.declaration.classification).toBe('situational');
    expect(result.reconciliations).toEqual([
      {
        rule: 'r',
        kind: 'always-apply-true-on-situational',
        indexClassification: 'situational',
        indexTrigger: 'surface:types',
        cursorAlwaysApply: true,
        cursorGlobs: [],
        claudePaths: [],
        outcome: 'situational; the Cursor trigger becomes alwaysApply false',
      },
    ]);
  });

  it('lets hand-kept path scoping win over a bare core row: situational, trigger from the globs', () => {
    const result = reconcileRuleDeclaration(
      sources({
        index: { classification: 'core' },
        cursor: { description: 'd', alwaysApply: undefined, globs: ['**/*.ts', '**/*.tsx'] },
        claudePaths: ['**/*.ts', '**/*.tsx'],
      }),
    );
    expect(result.declaration).toEqual({
      name: 'r',
      classification: 'situational',
      description: 'd',
      trigger: 'surface:**/*.ts,**/*.tsx',
      globs: ['**/*.ts', '**/*.tsx'],
    });
    expect(result.reconciliations.map((entry) => entry.kind)).toEqual([
      'core-with-scope-becomes-situational',
      'always-apply-absent',
    ]);
  });

  it('reads a Claude paths value of every file as no scoping at all', () => {
    const result = reconcileRuleDeclaration(sources({ claudePaths: ['**/*'] }));
    expect(result.declaration.classification).toBe('core');
    expect(result.reconciliations).toEqual([]);
  });

  it('unions Cursor globs and Claude paths that disagree, in Cursor-then-Claude order, and lists it', () => {
    const result = reconcileRuleDeclaration(
      sources({
        index: { classification: 'situational', trigger: 'surface:x' },
        cursor: { description: 'd', alwaysApply: false, globs: ['a/**', 'b/**'] },
        claudePaths: ['b/**', 'c/**'],
      }),
    );
    expect(result.declaration).toEqual({
      name: 'r',
      classification: 'situational',
      description: 'd',
      trigger: 'surface:x',
      globs: ['a/**', 'b/**', 'c/**'],
    });
    expect(result.reconciliations.map((entry) => entry.kind)).toEqual([
      'claude-paths-and-cursor-globs-unioned',
    ]);
  });

  it('lists alwaysApply false on a core rule as the index winning', () => {
    const result = reconcileRuleDeclaration(
      sources({ cursor: { description: 'd', alwaysApply: false, globs: [] } }),
    );
    expect(result.declaration.classification).toBe('core');
    expect(result.reconciliations.map((entry) => entry.kind)).toEqual([
      'always-apply-false-on-core',
    ]);
  });
});
