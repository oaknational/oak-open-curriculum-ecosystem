import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { buildCloneAnalyses } from './region-repetition-grouping.js';
import type {
  EncodedRegionObservation,
  ExecutableRepetitionConfig,
} from './region-repetition-model.js';

const EXACT_FINGERPRINT = '1111111111111111111111111111111111111111111111111111111111111111';
const STRUCTURAL_FINGERPRINT = '2222222222222222222222222222222222222222222222222222222222222222';

const config: ExecutableRepetitionConfig = {
  minimumAstNodes: 24,
  minimumTokens: 40,
  minimumFiles: 2,
  maxAnalysedRegions: 20,
  regionAstKinds: ['ArrowFunction'],
  exactEncodingVersion: 'typescript-printer-trivia-free-v1',
  structuralEncodingVersion: 'typescript-getchildren-kinds-v1',
};

const FIRST: EncodedRegionObservation = {
  member: {
    path: 'src/a.ts',
    kind: 'ArrowFunction',
    startOffset: 10,
    endOffset: 20,
    startLine: 1,
    endLine: 1,
    name: null,
    nodeCount: 30,
    tokenCount: 50,
  },
  verificationOnly: 'absent',
  exactFingerprint: EXACT_FINGERPRINT,
  exactEncoding: '() => ({ alpha: 1 })',
  structuralFingerprint: STRUCTURAL_FINGERPRINT,
  structuralEncoding: ['ArrowFunction', 'ObjectLiteralExpression'],
};

const SECOND: EncodedRegionObservation = {
  member: {
    path: 'src/a.ts',
    kind: 'ArrowFunction',
    startOffset: 30,
    endOffset: 40,
    startLine: 1,
    endLine: 1,
    name: null,
    nodeCount: 30,
    tokenCount: 50,
  },
  verificationOnly: 'absent',
  exactFingerprint: EXACT_FINGERPRINT,
  exactEncoding: '() => ({ alpha: 1 })',
  structuralFingerprint: STRUCTURAL_FINGERPRINT,
  structuralEncoding: ['ArrowFunction', 'ObjectLiteralExpression'],
};

const THIRD: EncodedRegionObservation = {
  member: {
    path: 'src/b.ts',
    kind: 'ArrowFunction',
    startOffset: 5,
    endOffset: 15,
    startLine: 2,
    endLine: 2,
    name: null,
    nodeCount: 30,
    tokenCount: 50,
  },
  verificationOnly: 'absent',
  exactFingerprint: EXACT_FINGERPRINT,
  exactEncoding: '() => ({ alpha: 1 })',
  structuralFingerprint: STRUCTURAL_FINGERPRINT,
  structuralEncoding: ['ArrowFunction', 'ObjectLiteralExpression'],
};

const OBSERVATIONS: readonly EncodedRegionObservation[] = [FIRST, SECOND, THIRD];

describe('buildCloneAnalyses', () => {
  it('emits exact then structural and retains same-line occurrences across a second path', () => {
    expect(unwrapOrThrow(buildCloneAnalyses(OBSERVATIONS, config))).toEqual([
      {
        detectorId: 'exact-region-clone',
        encodingVersion: 'typescript-printer-trivia-free-v1',
        groups: [
          {
            fingerprint: EXACT_FINGERPRINT,
            candidateEligibility: 'candidate-eligible',
            members: [
              {
                path: 'src/a.ts',
                kind: 'ArrowFunction',
                startOffset: 10,
                endOffset: 20,
                startLine: 1,
                endLine: 1,
                name: null,
                nodeCount: 30,
                tokenCount: 50,
              },
              {
                path: 'src/a.ts',
                kind: 'ArrowFunction',
                startOffset: 30,
                endOffset: 40,
                startLine: 1,
                endLine: 1,
                name: null,
                nodeCount: 30,
                tokenCount: 50,
              },
              {
                path: 'src/b.ts',
                kind: 'ArrowFunction',
                startOffset: 5,
                endOffset: 15,
                startLine: 2,
                endLine: 2,
                name: null,
                nodeCount: 30,
                tokenCount: 50,
              },
            ],
          },
        ],
      },
      {
        detectorId: 'structural-region-similarity',
        encodingVersion: 'typescript-getchildren-kinds-v1',
        groups: [
          {
            fingerprint: STRUCTURAL_FINGERPRINT,
            candidateEligibility: 'candidate-eligible',
            members: [
              {
                path: 'src/a.ts',
                kind: 'ArrowFunction',
                startOffset: 10,
                endOffset: 20,
                startLine: 1,
                endLine: 1,
                name: null,
                nodeCount: 30,
                tokenCount: 50,
              },
              {
                path: 'src/a.ts',
                kind: 'ArrowFunction',
                startOffset: 30,
                endOffset: 40,
                startLine: 1,
                endLine: 1,
                name: null,
                nodeCount: 30,
                tokenCount: 50,
              },
              {
                path: 'src/b.ts',
                kind: 'ArrowFunction',
                startOffset: 5,
                endOffset: 15,
                startLine: 2,
                endLine: 2,
                name: null,
                nodeCount: 30,
                tokenCount: 50,
              },
            ],
          },
        ],
      },
    ]);

    expect(unwrapOrThrow(buildCloneAnalyses([FIRST, SECOND], config))).toEqual([
      {
        detectorId: 'exact-region-clone',
        encodingVersion: 'typescript-printer-trivia-free-v1',
        groups: [],
      },
      {
        detectorId: 'structural-region-similarity',
        encodingVersion: 'typescript-getchildren-kinds-v1',
        groups: [],
      },
    ]);
  });

  it.each([
    { verificationOnly: 'present' },
    { verificationOnly: 'ambiguous' },
    { verificationOnly: 'not-probed' },
  ] as const)(
    'marks a group containing $verificationOnly evidence as observation-only',
    ({ verificationOnly }) => {
      const analyses = unwrapOrThrow(
        buildCloneAnalyses([{ ...FIRST, verificationOnly }, SECOND, THIRD], config),
      );

      expect(analyses).toMatchObject([
        { groups: [{ candidateEligibility: 'verification-observation-only' }] },
        { groups: [{ candidateEligibility: 'verification-observation-only' }] },
      ]);
    },
  );

  it.each([
    {
      name: 'occurrence identity',
      observations: [FIRST, { ...SECOND, member: FIRST.member }],
    },
    {
      name: 'exact fingerprint encoding',
      observations: [FIRST, { ...SECOND, exactEncoding: '() => ({ beta: 2 })' }],
    },
    {
      name: 'structural fingerprint encoding',
      observations: [FIRST, { ...SECOND, structuralEncoding: ['ArrowFunction', 'Block'] }],
    },
  ] satisfies readonly {
    readonly name: string;
    readonly observations: readonly EncodedRegionObservation[];
  }[])('refuses a $name collision instead of deduplicating', ({ observations }) => {
    expect(unwrapErr(buildCloneAnalyses(observations, config)).code).toBe('VALIDATION_FAILED');
  });
});
