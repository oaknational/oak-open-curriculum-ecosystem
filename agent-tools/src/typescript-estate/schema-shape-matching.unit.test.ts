import { unwrapErr, unwrapOrThrow } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { SchemaShape } from './analysis-model.js';
import { matchSchemaShapes } from './schema-shape-matching.js';
import type { SchemaShapeFile } from './schema-shape-matching.js';
import type { AtLeastThreeReadonly } from './scalar-model.js';

const fingerprint = 'a'.repeat(64);

describe('matchSchemaShapes', () => {
  it('emits the full authored/generated Cartesian product in frozen UTF-16 order', () => {
    const files: readonly SchemaShapeFile[] = [
      schemaFile('generated-confirmed', 'generated/.ts', completeShape('PrivateGenerated', 20)),
      schemaFile('authored', 'src/.ts', completeShape('PrivateAuthored', 10)),
      schemaFile('imported', 'imported/ignored.ts', completeShape('Ignored', 1)),
      schemaFile('generated-confirmed', 'generated/𐀀.ts', completeShape('AstralGenerated', 5)),
      schemaFile('authored', 'src/𐀀.ts', completeShape('AstralAuthored', 2)),
    ];

    const matches = unwrapOrThrow(matchSchemaShapes(files));

    expect(matches).toEqual([
      {
        fingerprint,
        propertyNames: ['alpha', 'beta', 'gamma'],
        authored: {
          path: 'src/𐀀.ts',
          kind: 'interface',
          startLine: 2,
          endLine: 2,
          name: 'AstralAuthored',
          provenance: 'authored',
        },
        generated: {
          path: 'generated/𐀀.ts',
          kind: 'interface',
          startLine: 5,
          endLine: 5,
          name: 'AstralGenerated',
          provenance: 'generated-confirmed',
        },
        interpretation: 'candidate-key-set-match-not-authority-proof',
      },
      {
        fingerprint,
        propertyNames: ['alpha', 'beta', 'gamma'],
        authored: {
          path: 'src/𐀀.ts',
          kind: 'interface',
          startLine: 2,
          endLine: 2,
          name: 'AstralAuthored',
          provenance: 'authored',
        },
        generated: {
          path: 'generated/.ts',
          kind: 'interface',
          startLine: 20,
          endLine: 20,
          name: 'PrivateGenerated',
          provenance: 'generated-confirmed',
        },
        interpretation: 'candidate-key-set-match-not-authority-proof',
      },
      {
        fingerprint,
        propertyNames: ['alpha', 'beta', 'gamma'],
        authored: {
          path: 'src/.ts',
          kind: 'interface',
          startLine: 10,
          endLine: 10,
          name: 'PrivateAuthored',
          provenance: 'authored',
        },
        generated: {
          path: 'generated/𐀀.ts',
          kind: 'interface',
          startLine: 5,
          endLine: 5,
          name: 'AstralGenerated',
          provenance: 'generated-confirmed',
        },
        interpretation: 'candidate-key-set-match-not-authority-proof',
      },
      {
        fingerprint,
        propertyNames: ['alpha', 'beta', 'gamma'],
        authored: {
          path: 'src/.ts',
          kind: 'interface',
          startLine: 10,
          endLine: 10,
          name: 'PrivateAuthored',
          provenance: 'authored',
        },
        generated: {
          path: 'generated/.ts',
          kind: 'interface',
          startLine: 20,
          endLine: 20,
          name: 'PrivateGenerated',
          provenance: 'generated-confirmed',
        },
        interpretation: 'candidate-key-set-match-not-authority-proof',
      },
    ]);
  });

  it('refuses equal fingerprints with unequal ordered property arrays', () => {
    const error = unwrapErr(
      matchSchemaShapes([
        schemaFile('authored', 'src/model.ts', completeShape('Model', 1)),
        schemaFile(
          'generated-confirmed',
          'generated/model.ts',
          completeShape('GeneratedModel', 1, ['alpha', 'beta', 'other']),
        ),
      ]),
    );

    expect(error.code).toBe('VALIDATION_FAILED');
    expect(error.message).toContain('schema-shape fingerprint collision');
  });
});

function schemaFile(
  provenance: SchemaShapeFile['provenance'],
  path: string,
  shape: SchemaShape,
): SchemaShapeFile {
  return { provenance, path, schemaShapes: [shape] };
}

function completeShape(
  name: string,
  startLine: number,
  propertyNames: AtLeastThreeReadonly<string> = ['alpha', 'beta', 'gamma'],
): SchemaShape {
  return {
    kind: 'interface',
    startLine,
    endLine: startLine,
    name,
    propertyNames,
    fingerprint,
    completeness: 'complete-static-key-set',
    unsupportedReasons: [],
  };
}
