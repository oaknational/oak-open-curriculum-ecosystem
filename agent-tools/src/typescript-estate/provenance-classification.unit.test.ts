import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type {
  GeneratedOutputRule,
  ProvenanceClassificationConfig,
} from './config-classification-model.js';
import {
  createProvenanceClassifier,
  type ProvenanceClassificationResult,
} from './provenance-classification.js';

const config: ProvenanceClassificationConfig = {
  generatedPathMatchers: [
    {
      id: 'generated-directory-segment',
      kind: 'complete-path-segment',
      values: ['generated', '__generated__'],
    },
    {
      id: 'generated-ts-basename-suffix',
      kind: 'basename-suffix',
      values: ['.generated.ts', '.generated.tsx'],
    },
  ],
  generatedHeaderMatchers: [
    {
      id: 'leading-generated-banner',
      source: '(?:auto[- ]?generated|generated file|do not edit)',
      flags: 'iu',
      commentRangeSelection: 'leading comments only',
      matchSelection: 'earliest match',
      offsetRule: 'UTF-16 half-open offsets',
    },
  ],
  importedReferencePathRules: [],
  pathMatcherSemantics: 'exact case-sensitive paths',
  signalCollection: 'all matchers and rules independently',
  signalDeduplication: 'structurally identical signals only',
  signalOrdering: 'frozen UTF-16 ordering',
  generatedConfirmed: 'confirmed producer-output rule',
  generatedDeclaredUnconfirmed: 'declared generated signal',
  imported: 'configured imported rule only',
  authored: 'readable with no generated or imported signal',
  unknown: 'unreadable with no generated or imported signal',
  precedence: [
    'generated-confirmed',
    'generated-declared-unconfirmed',
    'imported',
    'authored',
    'unknown',
  ],
};

const generatedRules = [
  {
    id: 'api-output',
    pathPrefix: 'packages/api/generated/',
    producerEvidence: ['generators/a.ts', 'generators/z.ts'],
  },
] as const satisfies readonly GeneratedOutputRule[];

function classify(path: string, sourceText: string | null): ProvenanceClassificationResult {
  return unwrapOrThrow(createProvenanceClassifier(config, generatedRules)).classify({
    path,
    sourceText,
  });
}

describe('provenance classification', () => {
  it('retains every losing generated signal while confirmed lineage wins', () => {
    const sourceText = '// AUTO-GENERATED output\nexport const value = 1;';
    const startOffset = sourceText.indexOf('AUTO-GENERATED');

    expect(classify('packages/api/generated/model.generated.ts', sourceText)).toEqual({
      provenance: 'generated-confirmed',
      signals: [
        {
          kind: 'generated-header',
          matcherId: 'leading-generated-banner',
          evidencePath: 'packages/api/generated/model.generated.ts',
          startOffset,
          endOffset: startOffset + 'AUTO-GENERATED'.length,
        },
        {
          kind: 'generated-path',
          matcherId: 'generated-directory-segment',
          evidencePath: 'packages/api/generated/model.generated.ts',
        },
        {
          kind: 'generated-path',
          matcherId: 'generated-ts-basename-suffix',
          evidencePath: 'packages/api/generated/model.generated.ts',
        },
        {
          kind: 'producer-output-rule',
          ruleId: 'api-output',
          producerEvidencePaths: ['generators/a.ts', 'generators/z.ts'],
        },
      ],
    });
  });

  it('searches only leading comments and records the earliest exact UTF-16 match', () => {
    const sourceText = [
      '/* harmless */',
      '// Do Not Edit: generated file',
      'const text = "auto-generated";',
      '// auto-generated after code',
    ].join('\n');
    const startOffset = sourceText.indexOf('Do Not Edit');

    expect(classify('src/value.ts', sourceText)).toEqual({
      provenance: 'generated-declared-unconfirmed',
      signals: [
        {
          kind: 'generated-header',
          matcherId: 'leading-generated-banner',
          evidencePath: 'src/value.ts',
          startOffset,
          endOffset: startOffset + 'Do Not Edit'.length,
        },
      ],
    });
  });

  it('emits one signal per path matcher and applies readable and unreadable fallbacks', () => {
    expect(classify('generated/__generated__/value.generated.ts', null)).toEqual({
      provenance: 'generated-declared-unconfirmed',
      signals: [
        {
          kind: 'generated-path',
          matcherId: 'generated-directory-segment',
          evidencePath: 'generated/__generated__/value.generated.ts',
        },
        {
          kind: 'generated-path',
          matcherId: 'generated-ts-basename-suffix',
          evidencePath: 'generated/__generated__/value.generated.ts',
        },
      ],
    });
    expect(classify('src/authored.ts', 'const value = 1;')).toEqual({
      provenance: 'authored',
      signals: [],
    });
    expect(classify('src/unreadable.ts', null)).toEqual({
      provenance: 'unknown',
      signals: [],
    });
  });

  it('does not treat generated-looking text after the first token as a header signal', () => {
    expect(classify('src/authored.ts', 'const value = "do not edit";\n// AUTO-GENERATED')).toEqual({
      provenance: 'authored',
      signals: [],
    });
  });

  it('captures path-matcher values defensively when the classifier is created', () => {
    const mutableConfig = structuredClone(config);
    const classifier = unwrapOrThrow(createProvenanceClassifier(mutableConfig, generatedRules));
    const input = { path: 'src/generated/value.ts', sourceText: 'const value = 1;' } as const;

    expect(classifier.classify(input).provenance).toBe('generated-declared-unconfirmed');
    Reflect.set(mutableConfig.generatedPathMatchers[0].values, 0, 'changed-after-construction');

    expect(classifier.classify(input).provenance).toBe('generated-declared-unconfirmed');
  });

  it('rejects a header matcher that cannot be compiled', () => {
    const invalidConfig = structuredClone(config);
    Reflect.set(invalidConfig.generatedHeaderMatchers[0], 'source', '[');

    const result = createProvenanceClassifier(invalidConfig, generatedRules);

    expect(unwrapErr(result).code).toBe('CONFIG_INVALID');
  });
});
