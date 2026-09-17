import { err, ok, type Result } from '@oaknational/result';

import type { SchemaShape, SchemaShapeEndpoint, SchemaShapeMatch } from './analysis-model.js';
import { EstateReviewError } from './errors.js';
import type { Provenance } from './file-vocabulary.js';
import type { RepoPath } from './scalar-model.js';
import { compareUtf16 } from './utf16-order.js';

type CompleteSchemaShape = Extract<
  SchemaShape,
  { readonly completeness: 'complete-static-key-set' }
>;

export interface SchemaShapeFile {
  readonly path: RepoPath;
  readonly provenance: Provenance;
  readonly schemaShapes: readonly SchemaShape[];
}

interface MatchableShape {
  readonly path: RepoPath;
  readonly provenance: 'authored' | 'generated-confirmed';
  readonly shape: CompleteSchemaShape;
}

/** Match every authored shape to every generated-confirmed shape with the same key fingerprint. */
export function matchSchemaShapes(
  files: readonly SchemaShapeFile[],
): Result<readonly SchemaShapeMatch[], EstateReviewError> {
  const completeShapes = files.flatMap(({ schemaShapes }) =>
    schemaShapes.filter(isCompleteSchemaShape),
  );
  const collision = schemaFingerprintCollision(completeShapes);
  if (collision !== undefined) {
    return err(collision);
  }

  const authored: MatchableShape[] = [];
  const generated: MatchableShape[] = [];
  for (const file of files) {
    if (file.provenance === 'authored') {
      authored.push(...matchableShapes(file, 'authored'));
    } else if (file.provenance === 'generated-confirmed') {
      generated.push(...matchableShapes(file, 'generated-confirmed'));
    }
  }

  const matches: SchemaShapeMatch[] = [];
  for (const authoredShape of authored) {
    for (const generatedShape of generated) {
      if (authoredShape.shape.fingerprint === generatedShape.shape.fingerprint) {
        matches.push(schemaShapeMatch(authoredShape, generatedShape));
      }
    }
  }
  return ok(matches.toSorted(compareSchemaShapeMatches));
}

function isCompleteSchemaShape(shape: SchemaShape): shape is CompleteSchemaShape {
  return shape.completeness === 'complete-static-key-set';
}

function matchableShapes(
  file: SchemaShapeFile,
  provenance: MatchableShape['provenance'],
): readonly MatchableShape[] {
  return file.schemaShapes
    .filter(isCompleteSchemaShape)
    .map((shape) => ({ path: file.path, provenance, shape }));
}

function schemaFingerprintCollision(
  shapes: readonly CompleteSchemaShape[],
): EstateReviewError | undefined {
  const propertyNamesByFingerprint = new Map<string, CompleteSchemaShape['propertyNames']>();
  for (const shape of shapes) {
    const propertyNames = propertyNamesByFingerprint.get(shape.fingerprint);
    if (propertyNames !== undefined && !sameStrings(propertyNames, shape.propertyNames)) {
      return new EstateReviewError(
        'VALIDATION_FAILED',
        `schema-shape fingerprint collision for '${shape.fingerprint}'`,
      );
    }
    propertyNamesByFingerprint.set(shape.fingerprint, shape.propertyNames);
  }
  return undefined;
}

function sameStrings(left: readonly string[], right: readonly string[]): boolean {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function schemaShapeMatch(authored: MatchableShape, generated: MatchableShape): SchemaShapeMatch {
  return {
    fingerprint: authored.shape.fingerprint,
    propertyNames: authored.shape.propertyNames,
    authored: schemaShapeEndpoint(authored),
    generated: schemaShapeEndpoint(generated),
    interpretation: 'candidate-key-set-match-not-authority-proof',
  };
}

function schemaShapeEndpoint(matchable: MatchableShape): SchemaShapeEndpoint {
  const { shape } = matchable;
  return {
    path: matchable.path,
    kind: shape.kind,
    startLine: shape.startLine,
    endLine: shape.endLine,
    name: shape.name,
    provenance: matchable.provenance,
  };
}

function compareSchemaShapeMatches(left: SchemaShapeMatch, right: SchemaShapeMatch): number {
  return (
    compareUtf16(left.fingerprint, right.fingerprint) ||
    compareUtf16(left.authored.path, right.authored.path) ||
    left.authored.startLine - right.authored.startLine ||
    compareUtf16(left.generated.path, right.generated.path) ||
    left.generated.startLine - right.generated.startLine
  );
}
