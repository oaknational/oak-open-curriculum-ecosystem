import { unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';
import { ScriptKind, ScriptTarget, createSourceFile } from 'typescript';

import { extractSchemaShapes } from './schema-shape.js';

describe('extractSchemaShapes', () => {
  it('extracts interface, type-literal, and z.object static key sets with frozen UTF-8 framing', () => {
    const sourceFile = createSourceFile(
      'shapes.ts',
      [
        'interface UnicodeShape {',
        "  '𐀀': string;",
        "  '': string;",
        '  a: string;',
        '}',
        'type Alias = { gamma: string; alpha?: number; beta(): void };',
        'const UserSchema = z.object({',
        '  name: z.string(),',
        '  active: z.boolean(),',
        '  id: z.string(),',
        '});',
      ].join('\n'),
      ScriptTarget.Latest,
      true,
      ScriptKind.TS,
    );

    const shapes = unwrapOrThrow(extractSchemaShapes(sourceFile));

    expect(shapes).toHaveLength(3);
    expect(shapes[0]).toEqual({
      kind: 'interface',
      startLine: 1,
      endLine: 5,
      name: 'UnicodeShape',
      propertyNames: ['a', '', '𐀀'],
      fingerprint: '56b80040dff83c57ee745b307375cf77a57c829589276b067b5249ac5f8c5b83',
      completeness: 'complete-static-key-set',
      unsupportedReasons: [],
    });
    expect(shapes[1]).toMatchObject({
      kind: 'type-literal',
      name: 'Alias',
      propertyNames: ['alpha', 'beta', 'gamma'],
      completeness: 'complete-static-key-set',
      unsupportedReasons: [],
    });
    expect(shapes[2]).toMatchObject({
      kind: 'zod-object',
      name: 'UserSchema',
      propertyNames: ['active', 'id', 'name'],
      completeness: 'complete-static-key-set',
      unsupportedReasons: [],
    });
  });

  it('omits below-floor static shapes and preserves every frozen unsupported reason', () => {
    const sourceFile = createSourceFile(
      'unsupported.ts',
      [
        'interface Computed { a: string; b: string; c: string; [dynamic]: string }',
        'type Pair = { a: string; b: string };',
        'const SpreadSchema = z.object({ a: z.string(), b: z.string(), c: z.string(), ...base });',
        'const DynamicSchema = z.object(shape);',
        'const WrongAritySchema = z.object({}, {});',
      ].join('\n'),
      ScriptTarget.Latest,
      true,
      ScriptKind.TS,
    );

    const shapes = unwrapOrThrow(extractSchemaShapes(sourceFile));

    expect(shapes).toHaveLength(4);
    expect(shapes[0]).toMatchObject({
      propertyNames: ['a', 'b', 'c'],
      fingerprint: null,
      completeness: 'unsupported-computed-spread-or-complex',
      unsupportedReasons: ['computed-property-name'],
    });
    expect(shapes[1]).toMatchObject({
      kind: 'zod-object',
      name: 'SpreadSchema',
      propertyNames: ['a', 'b', 'c'],
      fingerprint: null,
      completeness: 'unsupported-computed-spread-or-complex',
      unsupportedReasons: ['spread-assignment'],
    });
    expect(shapes[2]).toMatchObject({
      kind: 'zod-object',
      name: 'DynamicSchema',
      propertyNames: [],
      fingerprint: null,
      completeness: 'unsupported-computed-spread-or-complex',
      unsupportedReasons: ['zod-non-object-argument'],
    });
    expect(shapes[3]).toMatchObject({
      kind: 'zod-object',
      name: 'WrongAritySchema',
      propertyNames: [],
      fingerprint: null,
      completeness: 'unsupported-computed-spread-or-complex',
      unsupportedReasons: ['zod-argument-count'],
    });
  });

  it('canonicalises supported member names, orders reasons, and excludes optional z.object forms', () => {
    const sourceFile = createSourceFile(
      'member-shapes.ts',
      [
        'interface Parent { parent: string }',
        'interface Complex extends Parent {',
        '  decoded: string;',
        "  'decoded': number;",
        '  1_000: string;',
        "  ['static']: string;",
        '  [`templated`]: string;',
        '  [2_000]: string;',
        '  [dynamic]: string;',
        '  [key: string]: unknown;',
        '  (): void;',
        '  new (): Complex;',
        '}',
        'const shorthand = z.string();',
        'const Rich = z.object({',
        '  shorthand,',
        '  method() {},',
        '  get value() { return 1; },',
        '  set value(next: number) {},',
        '  2_000: z.number(),',
        '});',
        'z?.object({ a: 1, b: 2, c: 3 });',
        'z.object?.({ a: 1, b: 2, c: 3 });',
        'other.z.object({ a: 1, b: 2, c: 3 });',
        "z['object']({ a: 1, b: 2, c: 3 });",
        'const Indirect = wrap(z.object({ a: 1, b: 2, c: 3 }));',
      ].join('\n'),
      ScriptTarget.Latest,
      true,
      ScriptKind.TS,
    );

    const shapes = unwrapOrThrow(extractSchemaShapes(sourceFile));

    expect(shapes).toHaveLength(3);
    expect(shapes[0]).toMatchObject({
      kind: 'interface',
      name: 'Complex',
      propertyNames: ['1_000', '2_000', 'decoded', 'static', 'templated'],
      unsupportedReasons: [
        'computed-property-name',
        'interface-heritage',
        'index-signature',
        'call-signature',
        'construct-signature',
      ],
    });
    expect(shapes[1]).toMatchObject({
      kind: 'zod-object',
      name: 'Rich',
      propertyNames: ['2_000', 'method', 'shorthand', 'value'],
      completeness: 'complete-static-key-set',
    });
    expect(shapes[2]).toMatchObject({
      kind: 'zod-object',
      name: null,
      propertyNames: ['a', 'b', 'c'],
      completeness: 'complete-static-key-set',
    });
  });
});
