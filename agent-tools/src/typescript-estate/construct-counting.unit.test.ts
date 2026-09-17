import { unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';
import { ScriptKind, ScriptTarget, createSourceFile } from 'typescript';

import { countConstructs, type ConstructCountingConfig } from './construct-counting.js';

const config: ConstructCountingConfig = {
  runtimeValueStructures: [
    { id: 'object-literal', astKinds: ['ObjectLiteralExpression'], namedReferences: [] },
    { id: 'map-construction', astKinds: ['NewExpression'], namedReferences: ['Map'] },
    {
      id: 'buffer-construction',
      astKinds: ['CallExpression'],
      namedReferences: ['Buffer.from'],
    },
  ],
  typeModelStructures: [
    { id: 'interface-declaration', astKinds: ['InterfaceDeclaration'], namedReferences: [] },
    { id: 'record-type', astKinds: ['TypeReference'], namedReferences: ['Record'] },
    { id: 'map-type', astKinds: ['TypeReference'], namedReferences: ['Map'] },
  ],
  algorithms: [
    {
      id: 'iteration',
      astKinds: ['ForOfStatement'],
      callNames: ['forEach'],
    },
    { id: 'map-transform', astKinds: [], callNames: ['map'] },
  ],
};

describe('countConstructs', () => {
  it('counts configured AST occurrences in separate runtime, type, and operation families', () => {
    const sourceFile = createSourceFile(
      'fixture.ts',
      [
        'interface Model { value: string }',
        'type Index = Record<string, unknown>;',
        'type Lookup = Map<string, Model>;',
        'const value = { items: [1, 2, 3] };',
        'const lookup = new Map<string, Model>();',
        "const bytes = Buffer.from('value');",
        'for (const item of value.items) consume(item);',
        'value.items.forEach(consume);',
        'value.items.map(transform);',
      ].join('\n'),
      ScriptTarget.Latest,
      true,
      ScriptKind.TS,
    );

    expect(unwrapOrThrow(countConstructs(sourceFile, config))).toEqual([
      { id: 'iteration', count: 2 },
      { id: 'map-transform', count: 1 },
      { id: 'buffer-construction', count: 1 },
      { id: 'map-construction', count: 1 },
      { id: 'object-literal', count: 1 },
      { id: 'interface-declaration', count: 1 },
      { id: 'map-type', count: 1 },
      { id: 'record-type', count: 1 },
    ]);
  });

  it('uses exact identifier and property-access names without treating qualified lookalikes as matches', () => {
    const sourceFile = createSourceFile(
      'lookalikes.ts',
      [
        'new globalThis.Map();',
        'new Map();',
        "Other.Buffer.from('x');",
        "Buffer?.from('x');",
        "Buffer.from?.('x');",
        "Buffer.from('x');",
        'const qualified: Other.Map<string, string> = value;',
        'const direct: Map<string, string> = value;',
        'collection.deep.map(transform);',
        'collection?.map(transform);',
      ].join('\n'),
      ScriptTarget.Latest,
      true,
      ScriptKind.TS,
    );

    const counts = unwrapOrThrow(countConstructs(sourceFile, config));

    expect(counts.find(({ id }) => id === 'map-construction')?.count).toBe(1);
    expect(counts.find(({ id }) => id === 'buffer-construction')?.count).toBe(1);
    expect(counts.find(({ id }) => id === 'map-type')?.count).toBe(1);
    expect(counts.find(({ id }) => id === 'map-transform')?.count).toBe(2);
  });
});
