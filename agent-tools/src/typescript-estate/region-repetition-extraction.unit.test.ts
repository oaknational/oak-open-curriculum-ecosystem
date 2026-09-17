import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';
import { ScriptKind, ScriptTarget, createSourceFile } from 'typescript';

import {
  extractRegionObservations,
  type ExecutableRepetitionConfig,
  type RepetitionSource,
} from './region-repetition-extraction.js';

const sourceText = 'const first = () => 1; const second = () => 1;';

const source: RepetitionSource = {
  path: 'src/same-line.ts',
  extension: '.ts',
  sourceFile: createSourceFile(
    'src/same-line.ts',
    sourceText,
    ScriptTarget.Latest,
    true,
    ScriptKind.TS,
  ),
  verificationOnly: 'absent',
};

const config: ExecutableRepetitionConfig = {
  minimumAstNodes: 1,
  minimumTokens: 1,
  minimumFiles: 2,
  maxAnalysedRegions: 10,
  regionAstKinds: ['ArrowFunction'],
  exactEncodingVersion: 'typescript-printer-trivia-free-v1',
  structuralEncodingVersion: 'typescript-getchildren-kinds-v1',
};

const SIMPLE_STRUCTURAL_ENCODING = [
  'ArrowFunction',
  'OpenParenToken',
  'SyntaxList',
  'CloseParenToken',
  'EqualsGreaterThanToken',
  'FirstLiteralToken',
];

const OBJECT_ARROW_STRUCTURAL_ENCODING = [
  'ArrowFunction',
  'OpenParenToken',
  'SyntaxList',
  'Parameter',
  'Identifier',
  'ColonToken',
  'NumberKeyword',
  'CloseParenToken',
  'EqualsGreaterThanToken',
  'ParenthesizedExpression',
  'OpenParenToken',
  'ObjectLiteralExpression',
  'FirstPunctuation',
  'SyntaxList',
  'PropertyAssignment',
  'Identifier',
  'ColonToken',
  'BinaryExpression',
  'Identifier',
  'PlusToken',
  'FirstLiteralToken',
  'CloseBraceToken',
  'CloseParenToken',
];

describe('extractRegionObservations', () => {
  it('retains distinct UTF-16 offsets for identical anonymous regions on one line', () => {
    expect(unwrapOrThrow(extractRegionObservations([source], config))).toEqual([
      {
        member: {
          path: 'src/same-line.ts',
          kind: 'ArrowFunction',
          startOffset: 14,
          endOffset: 21,
          startLine: 1,
          endLine: 1,
          name: null,
          nodeCount: 1,
          tokenCount: 4,
        },
        verificationOnly: 'absent',
        exactFingerprint: 'fbad00908dc3d60c2b2b008c125705f74e4cee25239db0f3954332cfd7321581',
        exactEncoding: '() => 1',
        structuralFingerprint: '3ce002f3b9580e57cbfa72df01444a8f95153adb96dac4ab73b959eec79ef205',
        structuralEncoding: SIMPLE_STRUCTURAL_ENCODING,
      },
      {
        member: {
          path: 'src/same-line.ts',
          kind: 'ArrowFunction',
          startOffset: 38,
          endOffset: 45,
          startLine: 1,
          endLine: 1,
          name: null,
          nodeCount: 1,
          tokenCount: 4,
        },
        verificationOnly: 'absent',
        exactFingerprint: 'fbad00908dc3d60c2b2b008c125705f74e4cee25239db0f3954332cfd7321581',
        exactEncoding: '() => 1',
        structuralFingerprint: '3ce002f3b9580e57cbfa72df01444a8f95153adb96dac4ab73b959eec79ef205',
        structuralEncoding: SIMPLE_STRUCTURAL_ENCODING,
      },
    ]);
  });

  it('counts configured regions before floors and fails instead of truncating', () => {
    const error = unwrapErr(
      extractRegionObservations([source], {
        ...config,
        minimumAstNodes: 1_000,
        minimumTokens: 1_000,
        maxAnalysedRegions: 1,
      }),
    );

    expect(error.code).toBe('RESOURCE_LIMIT');
    expect(error.message).toContain('maxAnalysedRegions');
  });

  it.each([
    {
      name: 'trivia-free base',
      path: 'src/base.ts',
      text: 'const f = (value: number) => ({ result: value + 1 });',
      exactFingerprint: '2be274ae1dcc6a8c85e2c2674523f558b9b37f7f6d45c0beb0829613c19eeef7',
      exactEncoding: '(value: number) => ({ result: value + 1 })',
      structuralFingerprint: '629aa7d5235dfdb0bad4c042f671c4fef5818914cacc86d9292cd55095db59fb',
      structuralEncoding: OBJECT_ARROW_STRUCTURAL_ENCODING,
    },
    {
      name: 'comment and whitespace variation',
      path: 'src/trivia.ts',
      text: 'const f=(value:number)=>({ result: value /* removed */ + 1 });',
      exactFingerprint: '2be274ae1dcc6a8c85e2c2674523f558b9b37f7f6d45c0beb0829613c19eeef7',
      exactEncoding: '(value: number) => ({ result: value + 1 })',
      structuralFingerprint: '629aa7d5235dfdb0bad4c042f671c4fef5818914cacc86d9292cd55095db59fb',
      structuralEncoding: OBJECT_ARROW_STRUCTURAL_ENCODING,
    },
    {
      name: 'renamed identifiers and literals',
      path: 'src/renamed.ts',
      text: 'const f = (item: number) => ({ output: item + 2 });',
      exactFingerprint: '37003d3d7bff7eac92db25a2517ec05fbf0c49b76a979858dacf7f203206e830',
      exactEncoding: '(item: number) => ({ output: item + 2 })',
      structuralFingerprint: '629aa7d5235dfdb0bad4c042f671c4fef5818914cacc86d9292cd55095db59fb',
      structuralEncoding: OBJECT_ARROW_STRUCTURAL_ENCODING,
    },
    {
      name: 'changed operator',
      path: 'src/operator.ts',
      text: 'const f = (value: number) => ({ result: value - 1 });',
      exactFingerprint: '58d83cb2be27d8094966da3dab8b4d30cc1602a4e1db99ef1d0fa95a8c585c2e',
      exactEncoding: '(value: number) => ({ result: value - 1 })',
      structuralFingerprint: '8464c9a6da7fd8b452c0c56a68f7b55542ba4ba0ed40049575e18ce1bfa6e588',
      structuralEncoding: [
        'ArrowFunction',
        'OpenParenToken',
        'SyntaxList',
        'Parameter',
        'Identifier',
        'ColonToken',
        'NumberKeyword',
        'CloseParenToken',
        'EqualsGreaterThanToken',
        'ParenthesizedExpression',
        'OpenParenToken',
        'ObjectLiteralExpression',
        'FirstPunctuation',
        'SyntaxList',
        'PropertyAssignment',
        'Identifier',
        'ColonToken',
        'BinaryExpression',
        'Identifier',
        'MinusToken',
        'FirstLiteralToken',
        'CloseBraceToken',
        'CloseParenToken',
      ],
    },
  ] as const)(
    'emits independently pinned exact and structural encodings for $name',
    ({
      path,
      text,
      exactFingerprint,
      exactEncoding,
      structuralFingerprint,
      structuralEncoding,
    }) => {
      const repetitionSource: RepetitionSource = {
        path,
        extension: '.ts',
        sourceFile: createSourceFile(path, text, ScriptTarget.Latest, true, ScriptKind.TS),
        verificationOnly: 'absent',
      };

      expect(unwrapOrThrow(extractRegionObservations([repetitionSource], config))).toMatchObject([
        {
          member: { kind: 'ArrowFunction', nodeCount: 6, tokenCount: 15 },
          exactFingerprint,
          exactEncoding,
          structuralFingerprint,
          structuralEncoding,
        },
      ]);
    },
  );
});
