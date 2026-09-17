import { unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';
import { ScriptKind, ScriptTarget, createSourceFile } from 'typescript';

import { extractRegionObservations } from './region-repetition-extraction.js';
import type {
  EncodedRegionObservation,
  ExecutableRepetitionConfig,
  RepetitionSource,
} from './region-repetition-model.js';

const baseConfig: ExecutableRepetitionConfig = {
  minimumAstNodes: 1,
  minimumTokens: 1,
  minimumFiles: 2,
  maxAnalysedRegions: 100,
  regionAstKinds: [
    'FunctionDeclaration',
    'FunctionExpression',
    'ArrowFunction',
    'MethodDeclaration',
    'GetAccessor',
    'SetAccessor',
    'Constructor',
    'ClassDeclaration',
    'InterfaceDeclaration',
    'TypeAliasDeclaration',
    'TypeLiteral',
    'ObjectLiteralExpression',
  ],
  exactEncodingVersion: 'typescript-printer-trivia-free-v1',
  structuralEncodingVersion: 'typescript-getchildren-kinds-v1',
};

const arrowConfig: ExecutableRepetitionConfig = {
  ...baseConfig,
  regionAstKinds: ['ArrowFunction'],
};

describe('region repetition extraction boundaries', () => {
  it('enumerates all frozen roots with own names and exact UTF-16 positions', () => {
    const functionText = ['function declared() {', '  return 1;', '}'].join('\n');
    const text = [
      'const marker = "𐀀";',
      `${functionText} // trailing`,
      'const expression = function own() {};',
      'const arrow = () => 1;',
      'class Klass {',
      '  constructor() {}',
      '  method() {}',
      '  get value() { return 1; }',
      '  set value(next: number) {}',
      '}',
      'interface Shape { a: string }',
      'type Alias = { b: string };',
      'const object = { c: 1 };',
    ].join('\n');

    const observations = extract(tsSource('src/roots.ts', text), baseConfig);

    expect(observations).toHaveLength(12);
    expect(observations).toMatchObject([
      {
        member: {
          kind: 'FunctionDeclaration',
          startOffset: 21,
          endOffset: 56,
          startLine: 2,
          endLine: 4,
          name: 'declared',
          nodeCount: 3,
          tokenCount: 9,
        },
      },
      {
        member: {
          kind: 'FunctionExpression',
          startOffset: 88,
          endOffset: 105,
          startLine: 5,
          endLine: 5,
          name: 'own',
          nodeCount: 2,
          tokenCount: 6,
        },
      },
      {
        member: {
          kind: 'ArrowFunction',
          startOffset: 121,
          endOffset: 128,
          startLine: 6,
          endLine: 6,
          name: null,
          nodeCount: 1,
          tokenCount: 4,
        },
      },
      {
        member: {
          kind: 'ClassDeclaration',
          startOffset: 130,
          endOffset: 235,
          startLine: 7,
          endLine: 12,
          name: 'Klass',
          nodeCount: 11,
          tokenCount: 32,
        },
      },
      {
        member: {
          kind: 'Constructor',
          startOffset: 146,
          endOffset: 162,
          startLine: 8,
          endLine: 8,
          name: 'constructor',
          nodeCount: 2,
          tokenCount: 5,
        },
      },
      {
        member: {
          kind: 'MethodDeclaration',
          startOffset: 165,
          endOffset: 176,
          startLine: 9,
          endLine: 9,
          name: 'method',
          nodeCount: 2,
          tokenCount: 5,
        },
      },
      {
        member: {
          kind: 'GetAccessor',
          startOffset: 179,
          endOffset: 204,
          startLine: 10,
          endLine: 10,
          name: 'value',
          nodeCount: 3,
          tokenCount: 9,
        },
      },
      {
        member: {
          kind: 'SetAccessor',
          startOffset: 207,
          endOffset: 233,
          startLine: 11,
          endLine: 11,
          name: 'value',
          nodeCount: 3,
          tokenCount: 9,
        },
      },
      {
        member: {
          kind: 'InterfaceDeclaration',
          startOffset: 236,
          endOffset: 265,
          startLine: 13,
          endLine: 13,
          name: 'Shape',
          nodeCount: 2,
          tokenCount: 7,
        },
      },
      {
        member: {
          kind: 'TypeAliasDeclaration',
          startOffset: 266,
          endOffset: 293,
          startLine: 14,
          endLine: 14,
          name: 'Alias',
          nodeCount: 3,
          tokenCount: 9,
        },
      },
      {
        member: {
          kind: 'TypeLiteral',
          startOffset: 279,
          endOffset: 292,
          startLine: 14,
          endLine: 14,
          name: null,
          nodeCount: 2,
          tokenCount: 5,
        },
      },
      {
        member: {
          kind: 'ObjectLiteralExpression',
          startOffset: 309,
          endOffset: 317,
          startLine: 15,
          endLine: 15,
          name: null,
          nodeCount: 2,
          tokenCount: 5,
        },
      },
    ]);
  });

  it('honours both floors exactly, scans TSX, and includes recovered AST regions', () => {
    const arrowSource = tsSource('src/floor.ts', 'const value = (input: number) => input + 1;');

    expect(
      extract(arrowSource, { ...arrowConfig, minimumAstNodes: 3, minimumTokens: 9 }),
    ).toMatchObject([{ member: { kind: 'ArrowFunction', nodeCount: 3, tokenCount: 9 } }]);
    expect(extract(arrowSource, { ...arrowConfig, minimumAstNodes: 4, minimumTokens: 9 })).toEqual(
      [],
    );
    expect(extract(arrowSource, { ...arrowConfig, minimumAstNodes: 3, minimumTokens: 10 })).toEqual(
      [],
    );

    expect(
      extract(tsxSource('src/view.tsx', 'const View = () => <div>{value}</div>;'), arrowConfig),
    ).toMatchObject([{ member: { kind: 'ArrowFunction', tokenCount: 12 } }]);
    expect(
      extract(tsSource('src/recovered.ts', 'const broken = () => ({ a: 1,'), arrowConfig),
    ).toMatchObject([{ member: { kind: 'ArrowFunction' } }]);
  });
});

function tsSource(path: string, text: string): RepetitionSource {
  return {
    path,
    extension: '.ts',
    sourceFile: createSourceFile(path, text, ScriptTarget.Latest, true, ScriptKind.TS),
    verificationOnly: 'absent',
  };
}

function tsxSource(path: string, text: string): RepetitionSource {
  return {
    path,
    extension: '.tsx',
    sourceFile: createSourceFile(path, text, ScriptTarget.Latest, true, ScriptKind.TSX),
    verificationOnly: 'absent',
  };
}

function extract(
  repetitionSource: RepetitionSource,
  config: ExecutableRepetitionConfig,
): readonly EncodedRegionObservation[] {
  return unwrapOrThrow(extractRegionObservations([repetitionSource], config));
}
