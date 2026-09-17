import { unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { classifyPreparedSnapshotFiles } from './file-classification-engine.js';
import {
  CLASSIFICATION_FILES,
  classificationProgramFixture,
} from './test-helpers/classification-fixture.js';

describe('file classification fragment', () => {
  it('composes workspace, complete provenance signals, and roles without delivery fields', () => {
    const classified = unwrapOrThrow(
      classifyPreparedSnapshotFiles({
        files: CLASSIFICATION_FILES,
        program: classificationProgramFixture(),
      }),
    );

    expect(classified.map(({ source, classification }) => [source.path, classification])).toEqual([
      [
        'apps/a/src/generated/model.generated.ts',
        {
          workspace: { root: 'apps/a', name: '@scope/a', manifestPath: 'apps/a/package.json' },
          provenance: 'generated-confirmed',
          provenanceSignals: [
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
          ],
          roles: ['generated-contract-data-carrier'],
        },
      ],
      [
        'apps/a/src/index.ts',
        {
          workspace: { root: 'apps/a', name: '@scope/a', manifestPath: 'apps/a/package.json' },
          provenance: 'authored',
          provenanceSignals: [],
          roles: ['api-facade'],
        },
      ],
      [
        'tools/free.ts',
        {
          workspace: null,
          provenance: 'authored',
          provenanceSignals: [],
          roles: ['implementation-source'],
        },
      ],
      [
        'tools/producer.ts',
        {
          workspace: null,
          provenance: 'authored',
          provenanceSignals: [],
          roles: ['implementation-source'],
        },
      ],
    ]);
    expect('delivery' in (classified[0]?.classification ?? {})).toBe(false);
  });
});
