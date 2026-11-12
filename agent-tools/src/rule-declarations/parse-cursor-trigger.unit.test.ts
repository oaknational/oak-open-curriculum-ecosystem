import { describe, expect, it } from 'vitest';

import { parseCursorTrigger } from './parse-cursor-trigger.js';

function trigger(frontmatterLines: readonly string[]): string {
  return ['---', ...frontmatterLines, '---', '', 'Read and follow `.agent/rules/x.md`.', ''].join(
    '\n',
  );
}

describe('parseCursorTrigger', () => {
  it('reads a plain description and alwaysApply', () => {
    const result = parseCursorTrigger(
      trigger(['description: Never keep a list by hand.', 'alwaysApply: true']),
    );
    expect(result).toEqual({
      ok: true,
      value: { description: 'Never keep a list by hand.', alwaysApply: true, globs: [] },
    });
  });

  it('drops the wrapping quotes of a hand-quoted description, as YAML does', () => {
    expect(
      parseCursorTrigger(
        trigger(['description: "Bot identity on third-party systems."', 'alwaysApply: true']),
      ),
    ).toEqual({
      ok: true,
      value: { description: 'Bot identity on third-party systems.', alwaysApply: true, globs: [] },
    });
  });

  it('keeps a description Cursor tolerates but strict YAML would refuse (a colon-space inside it)', () => {
    const result = parseCursorTrigger(
      trigger(['description: Apply the lens: usable first time.', 'alwaysApply: false']),
    );
    expect(result).toEqual({
      ok: true,
      value: { description: 'Apply the lens: usable first time.', alwaysApply: false, globs: [] },
    });
  });

  it('folds a `>` block description into one line, as YAML does', () => {
    const result = parseCursorTrigger(
      trigger([
        'description: >',
        '  When consolidation homes knowledge, the permanent doc',
        '  is the record.',
        'alwaysApply: true',
      ]),
    );
    expect(result).toEqual({
      ok: true,
      value: {
        description: 'When consolidation homes knowledge, the permanent doc is the record.',
        alwaysApply: true,
        globs: [],
      },
    });
  });

  it('splits a quoted comma-joined globs value into a list, either quote style', () => {
    const single = parseCursorTrigger(
      trigger(['description: d', "globs: 'agent-tools/**,.agent/hooks/**'"]),
    );
    const double = parseCursorTrigger(trigger(['description: d', 'globs: "**/*.ts,**/*.tsx"']));
    expect(single).toEqual({
      ok: true,
      value: {
        description: 'd',
        alwaysApply: undefined,
        globs: ['agent-tools/**', '.agent/hooks/**'],
      },
    });
    expect(double).toEqual({
      ok: true,
      value: { description: 'd', alwaysApply: undefined, globs: ['**/*.ts', '**/*.tsx'] },
    });
  });

  it('keeps a brace group whole when splitting globs, since its commas are not separators', () => {
    const result = parseCursorTrigger(trigger(['description: d', "globs: '**/*.{ts,tsx,mts}'"]));
    expect(result.ok && result.value.globs).toEqual(['**/*.{ts,tsx,mts}']);
    const mixed = parseCursorTrigger(
      trigger(['description: d', 'globs: "apps/**/*.{ts,tsx},packages/design/**"']),
    );
    expect(mixed.ok && mixed.value.globs).toEqual(['apps/**/*.{ts,tsx}', 'packages/design/**']);
  });

  it.each([
    ['**/*.{ts,tsx', 'a "{" is never closed'],
    ['**/*.ts}', 'a "}" has no "{"'],
    ['**/*.{a,{b,c}', 'a "{" is never closed'],
  ])(
    'refuses the globs value %s whose braces do not balance, never splitting on a guess',
    (value, reason) => {
      expect(parseCursorTrigger(trigger(['description: d', `globs: '${value}'`]))).toEqual({
        ok: false,
        error: `unbalanced braces in "${value}": ${reason}`,
      });
    },
  );

  it('keeps a nested brace group whole, since balanced braces of any depth are one glob', () => {
    const result = parseCursorTrigger(
      trigger(['description: d', "globs: '**/*.{a,{b,c}},docs/**'"]),
    );
    expect(result).toEqual({
      ok: true,
      value: { description: 'd', alwaysApply: undefined, globs: ['**/*.{a,{b,c}}', 'docs/**'] },
    });
  });

  it('accepts a folded block written as >- and hands a trailing blank line back to the block', () => {
    const result = parseCursorTrigger(
      trigger(['description: >-', '  Folded', '  text.', '', 'alwaysApply: true']),
    );
    expect(result).toEqual({
      ok: true,
      value: { description: 'Folded text.', alwaysApply: true, globs: [] },
    });
  });

  it('refuses a folded block with a paragraph break (a blank line, then indented text), naming the shape', () => {
    const result = parseCursorTrigger(
      trigger([
        'description: >-',
        '  First paragraph.',
        '',
        '  Second paragraph.',
        '',
        'alwaysApply: true',
      ]),
    );
    expect(result).toEqual({
      ok: false,
      error:
        'description has a paragraph break inside a folded block; only a single-paragraph fold is read',
    });
  });

  it('refuses a block that never closes', () => {
    expect(parseCursorTrigger('---\ndescription: d\n')).toEqual({
      ok: false,
      error: 'frontmatter block never closes',
    });
  });

  it('names the line it cannot read', () => {
    expect(parseCursorTrigger(trigger(['description: d', 'not a key line']))).toEqual({
      ok: false,
      error: 'unparseable frontmatter line 3: not a key line',
    });
  });

  it('reports an absent alwaysApply as undefined, never as false', () => {
    const result = parseCursorTrigger(trigger(['description: d', 'globs: "a/**"']));
    expect(result.ok && result.value.alwaysApply).toBeUndefined();
  });

  it('refuses a trigger with no frontmatter block', () => {
    expect(parseCursorTrigger('Read and follow `.agent/rules/x.md`.\n')).toEqual({
      ok: false,
      error: 'no frontmatter block',
    });
  });

  it('refuses a trigger with no description', () => {
    expect(parseCursorTrigger(trigger(['alwaysApply: true']))).toEqual({
      ok: false,
      error: 'no description',
    });
  });

  it('refuses an empty description, which would declare nothing', () => {
    expect(parseCursorTrigger(trigger(['description:', 'alwaysApply: true']))).toEqual({
      ok: false,
      error: 'description is empty',
    });
  });

  it('refuses a key outside the three Cursor keys', () => {
    expect(parseCursorTrigger(trigger(['description: d', 'paths: "a/**"']))).toEqual({
      ok: false,
      error: 'unknown frontmatter key "paths"',
    });
  });

  it('refuses an alwaysApply value that is not a boolean', () => {
    expect(parseCursorTrigger(trigger(['description: d', 'alwaysApply: yes']))).toEqual({
      ok: false,
      error: 'alwaysApply must be true or false, got "yes"',
    });
  });

  it('refuses a literal block description, which no trigger uses and which would keep newlines', () => {
    expect(parseCursorTrigger(trigger(['description: |', '  two', '  lines']))).toEqual({
      ok: false,
      error: 'description uses a literal block; only plain and folded (>) scalars are read',
    });
  });

  it('refuses a duplicated key', () => {
    expect(parseCursorTrigger(trigger(['description: a', 'description: b']))).toEqual({
      ok: false,
      error: 'frontmatter key "description" appears twice',
    });
  });
});
