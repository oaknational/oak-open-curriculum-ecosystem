import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { classifyPreparedSnapshotFiles } from './file-classification-engine.js';
import type { FileClassification } from './file-classification-model.js';
import {
  compareClassificationSemantics,
  type ClassificationSemanticFile,
} from './semantic-classification-validation.js';
import {
  CLASSIFICATION_FILES,
  classificationProgramFixture,
} from './test-helpers/classification-fixture.js';

const GENERATED_SIGNALS = [
  {
    kind: 'generated-header',
    matcherId: 'leading-generated-banner',
    evidencePath: 'apps/a/src/generated/model.generated.ts',
    startOffset: 3,
    endOffset: 14,
  },
  {
    kind: 'generated-path',
    matcherId: 'generated-directory-segment',
    evidencePath: 'apps/a/src/generated/model.generated.ts',
  },
  {
    kind: 'generated-path',
    matcherId: 'generated-ts-basename-suffix',
    evidencePath: 'apps/a/src/generated/model.generated.ts',
  },
  {
    kind: 'producer-output-rule',
    ruleId: 'generated-models',
    producerEvidencePaths: ['tools/producer.ts'],
  },
] as const;

const GENERATED_CLASSIFICATION: FileClassification = {
  workspace: { root: 'apps/a', name: '@scope/a', manifestPath: 'apps/a/package.json' },
  provenance: 'generated-confirmed',
  provenanceSignals: GENERATED_SIGNALS,
  roles: ['generated-contract-data-carrier'],
};

const ASSERTED_FILES = [
  {
    path: 'apps/a/src/generated/model.generated.ts',
    classification: GENERATED_CLASSIFICATION,
  },
  {
    path: 'apps/a/src/index.ts',
    classification: {
      workspace: { root: 'apps/a', name: '@scope/a', manifestPath: 'apps/a/package.json' },
      provenance: 'authored',
      provenanceSignals: [],
      roles: ['api-facade'],
    },
  },
  {
    path: 'tools/free.ts',
    classification: {
      workspace: null,
      provenance: 'authored',
      provenanceSignals: [],
      roles: ['implementation-source'],
    },
  },
  {
    path: 'tools/producer.ts',
    classification: {
      workspace: null,
      provenance: 'authored',
      provenanceSignals: [],
      roles: ['implementation-source'],
    },
  },
] as const satisfies readonly ClassificationSemanticFile[];

const REMAINING_ASSERTED_FILES = ASSERTED_FILES.slice(1);

const MUTATED_CASES: readonly {
  readonly label: string;
  readonly assertedFiles: readonly ClassificationSemanticFile[];
}[] = [
  {
    label: 'workspace identity',
    assertedFiles: [
      {
        ...ASSERTED_FILES[0],
        classification: {
          ...GENERATED_CLASSIFICATION,
          workspace: { root: 'apps/a', name: '@scope/wrong', manifestPath: 'apps/a/package.json' },
        },
      },
      ...REMAINING_ASSERTED_FILES,
    ],
  },
  {
    label: 'complete provenance signals',
    assertedFiles: [
      {
        ...ASSERTED_FILES[0],
        classification: { ...GENERATED_CLASSIFICATION, provenanceSignals: [] },
      },
      ...REMAINING_ASSERTED_FILES,
    ],
  },
  {
    label: 'exact header offsets',
    assertedFiles: [
      {
        ...ASSERTED_FILES[0],
        classification: {
          ...GENERATED_CLASSIFICATION,
          provenanceSignals: [
            { ...GENERATED_SIGNALS[0], endOffset: 15 },
            ...GENERATED_SIGNALS.slice(1),
          ],
        },
      },
      ...REMAINING_ASSERTED_FILES,
    ],
  },
  {
    label: 'final provenance',
    assertedFiles: [
      {
        ...ASSERTED_FILES[0],
        classification: { ...GENERATED_CLASSIFICATION, provenance: 'authored' },
      },
      ...REMAINING_ASSERTED_FILES,
    ],
  },
  {
    label: 'ordered earned roles',
    assertedFiles: [
      {
        ...ASSERTED_FILES[0],
        classification: { ...GENERATED_CLASSIFICATION, roles: ['implementation-source'] },
      },
      ...REMAINING_ASSERTED_FILES,
    ],
  },
];

describe('classification semantic validation', () => {
  it('accepts an independently authored exact fragment derived from the frozen contract', () => {
    expect(
      unwrapOrThrow(compareClassificationSemantics(recompute(), ASSERTED_FILES)),
    ).toBeUndefined();
  });

  it.each(MUTATED_CASES)('rejects a mutated $label', ({ assertedFiles }) => {
    const failure = unwrapErr(compareClassificationSemantics(recompute(), assertedFiles));

    expect(failure.code).toBe('VALIDATION_FAILED');
    expect(failure.message).toContain('classification does not match pinned recomputation');
  });
});

function recompute() {
  return unwrapOrThrow(
    classifyPreparedSnapshotFiles({
      files: CLASSIFICATION_FILES,
      program: classificationProgramFixture(),
    }),
  );
}
