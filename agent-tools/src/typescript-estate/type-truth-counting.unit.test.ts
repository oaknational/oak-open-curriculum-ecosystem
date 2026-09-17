import { describe, expect, it } from 'vitest';
import { ScriptKind, ScriptTarget, createSourceFile } from 'typescript';

import { countTypeTruthSignals } from './type-truth-counting.js';

describe('countTypeTruthSignals', () => {
  it('counts every frozen boundary signal while keeping the configured distinctions intact', () => {
    const sourceFile = createSourceFile(
      'signals.ts',
      [
        '// @ts-nocheck',
        'type Unsafe = any;',
        'type Mystery = unknown;',
        'type Bag = Record<string, unknown>;',
        'const asserted = value as Model;',
        'const constant = { value: 1 } as const;',
        'const angled = <Model>value;',
        'const certain = maybe!;',
        '// @ts-expect-error reason',
        'consume(missing);',
        '// @ts-ignore reason',
        'consume(other);',
        '// @ts-nocheck is not leading here',
        'const schema = z.unknown();',
        'function identifiers(any: number, unknown: string) { return any + unknown; }',
      ].join('\n'),
      ScriptTarget.Latest,
      true,
      ScriptKind.TS,
    );

    const counts = countTypeTruthSignals(sourceFile);

    expect(Object.fromEntries(counts.map(({ id, count }) => [id, count]))).toEqual({
      'type-assertion': 2,
      'any-keyword': 1,
      'unknown-keyword': 2,
      'non-null-assertion': 1,
      'typescript-suppression': 3,
      'record-string-unknown': 1,
      'zod-unknown': 1,
    });
  });

  it('does not promote assertion, directive, Record, or zod lookalikes', () => {
    const sourceFile = createSourceFile(
      'lookalikes.ts',
      [
        "const commentText = '// @ts-ignore';",
        'const templateText = `/* @ts-expect-error */`;',
        'const constant = value as const;',
        'type WrongKey = Record<number, unknown>;',
        'type WrongValue = Record<string, any>;',
        'z.unknown(argument);',
        'z.unknown<string>();',
        'other.z.unknown();',
        "z['unknown']();",
      ].join('\n'),
      ScriptTarget.Latest,
      true,
      ScriptKind.TS,
    );

    const counts = countTypeTruthSignals(sourceFile);

    expect(counts.find(({ id }) => id === 'type-assertion')?.count).toBe(0);
    expect(counts.find(({ id }) => id === 'typescript-suppression')?.count).toBe(0);
    expect(counts.find(({ id }) => id === 'record-string-unknown')?.count).toBe(0);
    expect(counts.find(({ id }) => id === 'zod-unknown')?.count).toBe(0);
    expect(counts.find(({ id }) => id === 'unknown-keyword')?.count).toBe(1);
    expect(counts.find(({ id }) => id === 'any-keyword')?.count).toBe(1);
  });

  it('applies the frozen comment-marker, prefix, and leading-nocheck boundaries', () => {
    const sourceFile = createSourceFile(
      'directives.ts',
      [
        '/* @ts-nocheck*/',
        'const first = 1;',
        '/* @ts-ignore*/',
        '// @ts-expect-error: reason',
        '// @ts-ignore-extra',
        '/*',
        ' * @ts-ignore',
        ' */',
        '/* @ts-nocheck */',
      ].join('\n'),
      ScriptTarget.Latest,
      true,
      ScriptKind.TS,
    );

    const suppressions = countTypeTruthSignals(sourceFile).find(
      ({ id }) => id === 'typescript-suppression',
    );

    expect(suppressions?.count).toBe(3);
  });
});
