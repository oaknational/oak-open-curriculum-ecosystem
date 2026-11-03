import { describe, expect, it } from 'vitest';

import { readRuleDeclaration } from './read-rule-declaration.js';

function rule(block: readonly string[]): string {
  return ['---', ...block, '---', '', '# Title', '', 'Body.', ''].join('\n');
}

describe('readRuleDeclaration', () => {
  it('reads a core declaration', () => {
    expect(readRuleDeclaration('r', rule(['classification: core', 'description: d']))).toEqual({
      ok: true,
      value: { name: 'r', classification: 'core', description: 'd' },
    });
  });

  it('reads a situational declaration with trigger and globs', () => {
    expect(
      readRuleDeclaration(
        'r',
        rule([
          'classification: situational',
          'description: d',
          'trigger: surface:test-authoring',
          'globs:',
          '  - "**/*.test.*"',
          '  - e2e/**/*',
        ]),
      ),
    ).toEqual({
      ok: true,
      value: {
        name: 'r',
        classification: 'situational',
        description: 'd',
        trigger: 'surface:test-authoring',
        globs: ['**/*.test.*', 'e2e/**/*'],
      },
    });
  });

  it('reads a situational declaration without globs as an empty list', () => {
    expect(
      readRuleDeclaration(
        'r',
        rule(['classification: situational', 'description: d', 'trigger: session:team']),
      ),
    ).toStrictEqual({
      ok: true,
      value: {
        name: 'r',
        classification: 'situational',
        description: 'd',
        trigger: 'session:team',
        globs: [],
      },
    });
  });

  it('refuses a rule with no frontmatter block', () => {
    expect(readRuleDeclaration('r', '# Title\n')).toEqual({
      ok: false,
      error: '.agent/rules/r.md: no frontmatter block',
    });
  });

  it('refuses a block that is not valid YAML', () => {
    const result = readRuleDeclaration('r', rule(['classification: core', 'description: a: b: c']));
    const yamlRefusal: unknown = expect.stringMatching(
      /^\.agent\/rules\/r\.md: frontmatter is not valid YAML/u,
    );
    expect(result).toEqual({ ok: false, error: yamlRefusal });
  });

  it('refuses a key outside the declaration shape', () => {
    expect(
      readRuleDeclaration(
        'r',
        rule(['classification: core', 'description: d', 'alwaysApply: true']),
      ),
    ).toEqual({ ok: false, error: '.agent/rules/r.md: unknown frontmatter key "alwaysApply"' });
  });

  it('refuses a core rule that carries a trigger or globs', () => {
    expect(
      readRuleDeclaration('r', rule(['classification: core', 'description: d', 'trigger: x'])),
    ).toEqual({ ok: false, error: '.agent/rules/r.md: a core rule carries no trigger or globs' });
  });

  it('refuses a situational rule without a trigger', () => {
    expect(
      readRuleDeclaration('r', rule(['classification: situational', 'description: d'])),
    ).toEqual({ ok: false, error: '.agent/rules/r.md: a situational rule needs a trigger' });
  });

  it('refuses a description that spans more than one line', () => {
    expect(
      readRuleDeclaration('r', rule(['classification: core', 'description: |-', '  one', '  two'])),
    ).toStrictEqual({
      ok: false,
      error: '.agent/rules/r.md: description must be one line',
    });
  });

  it('refuses a trigger the index row cannot carry: a newline, a pipe or a backtick', () => {
    const situational = ['classification: situational', 'description: d'];
    expect(
      readRuleDeclaration('r', rule([...situational, 'trigger: |-', '  one', '  two'])),
    ).toStrictEqual({
      ok: false,
      error: '.agent/rules/r.md: trigger must be one line without "|" or a backtick',
    });
    expect(
      readRuleDeclaration('r', rule([...situational, 'trigger: "surface:a | b"'])),
    ).toStrictEqual({
      ok: false,
      error: '.agent/rules/r.md: trigger must be one line without "|" or a backtick',
    });
    expect(
      readRuleDeclaration('r', rule([...situational, 'trigger: "surface:`a`"'])),
    ).toStrictEqual({
      ok: false,
      error: '.agent/rules/r.md: trigger must be one line without "|" or a backtick',
    });
  });

  it('refuses an empty, multi-line or repeated glob', () => {
    const scoped = ['classification: situational', 'description: d', 'trigger: surface:x'];
    expect(
      readRuleDeclaration('r', rule([...scoped, 'globs:', '  - "**/*.ts"', '  - ""'])),
    ).toStrictEqual({
      ok: false,
      error: '.agent/rules/r.md: globs must be one-line non-empty strings',
    });
    expect(
      readRuleDeclaration('r', rule([...scoped, 'globs:', '  - |-', '    a', '    b'])),
    ).toStrictEqual({
      ok: false,
      error: '.agent/rules/r.md: globs must be one-line non-empty strings',
    });
    expect(
      readRuleDeclaration('r', rule([...scoped, 'globs:', '  - "**/*.ts"', '  - "**/*.ts"'])),
    ).toStrictEqual({
      ok: false,
      error: '.agent/rules/r.md: globs repeat "**/*.ts"',
    });
  });

  it('refuses a glob the Cursor comma-joined globs line would not carry back as itself', () => {
    const scoped = ['classification: situational', 'description: d', 'trigger: surface:x'];
    const refusal = (glob: string): unknown => ({
      ok: false,
      error: `.agent/rules/r.md: glob "${glob}" would not survive the Cursor trigger's comma-joined globs line`,
    });
    expect(
      readRuleDeclaration('r', rule([...scoped, 'globs:', '  - "src/a.ts,src/b.ts"'])),
    ).toStrictEqual(refusal('src/a.ts,src/b.ts'));
    expect(readRuleDeclaration('r', rule([...scoped, 'globs:', '  - "src/{a,b"']))).toStrictEqual(
      refusal('src/{a,b'),
    );
    expect(readRuleDeclaration('r', rule([...scoped, 'globs:', '  - " src/a.ts"']))).toStrictEqual(
      refusal(' src/a.ts'),
    );
    expect(
      readRuleDeclaration('r', rule([...scoped, 'globs:', '  - "src/{a,b}/**/*.ts"'])),
    ).toStrictEqual({
      ok: true,
      value: {
        name: 'r',
        classification: 'situational',
        description: 'd',
        trigger: 'surface:x',
        globs: ['src/{a,b}/**/*.ts'],
      },
    });
  });

  it('refuses a classification outside the closed set and a missing description', () => {
    expect(readRuleDeclaration('r', rule(['classification: optional', 'description: d']))).toEqual({
      ok: false,
      error: '.agent/rules/r.md: classification must be core or situational, got "optional"',
    });
    expect(readRuleDeclaration('r', rule(['classification: core']))).toEqual({
      ok: false,
      error: '.agent/rules/r.md: description must be a non-empty string',
    });
  });
});
