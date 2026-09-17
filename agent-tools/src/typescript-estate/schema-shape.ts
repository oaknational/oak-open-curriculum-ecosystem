import { err, isErr, ok, type Result } from '@oaknational/result';
import { forEachChild, type Node, type SourceFile } from 'typescript';

import type { SchemaShape } from './analysis-model.js';
import { EstateReviewError } from './errors.js';
import { schemaShapeFingerprint, sortSchemaPropertyNames } from './schema-shape-fingerprint.js';
import {
  observationForNode,
  UNSUPPORTED_REASONS,
  type ShapeObservation,
} from './schema-shape-observation.js';
import { compareUtf16 } from './utf16-order.js';

/** Extract every revision-2.2 schema-shape observation from one recovered AST. */
export function extractSchemaShapes(
  sourceFile: SourceFile,
): Result<readonly SchemaShape[], EstateReviewError> {
  const observations: ShapeObservation[] = [];
  const visit = (node: Node): void => {
    const observation = observationForNode(node, sourceFile);
    if (observation !== undefined) {
      observations.push(observation);
    }
    forEachChild(node, visit);
  };
  visit(sourceFile);

  const shapes: SchemaShape[] = [];
  for (const observation of observations) {
    const shape = schemaShapeFromObservation(observation, sourceFile);
    if (isErr(shape)) {
      return shape;
    }
    if (shape.value !== undefined) {
      shapes.push(shape.value);
    }
  }
  return ok(shapes.toSorted(compareSchemaShapes));
}

function schemaShapeFromObservation(
  observation: ShapeObservation,
  sourceFile: SourceFile,
): Result<SchemaShape | undefined, EstateReviewError> {
  const propertyNames = sortSchemaPropertyNames(observation.propertyNames);
  const unsupportedReasons = UNSUPPORTED_REASONS.filter((reason) =>
    observation.unsupportedReasons.has(reason),
  );
  const position = sourcePosition(observation.node, sourceFile);
  if (unsupportedReasons.length > 0) {
    const [firstReason, ...otherReasons] = unsupportedReasons;
    if (firstReason === undefined) {
      return err(new EstateReviewError('VALIDATION_FAILED', 'unsupported reason set is empty'));
    }
    return ok({
      ...position,
      kind: observation.kind,
      name: observation.name,
      propertyNames,
      fingerprint: null,
      completeness: 'unsupported-computed-spread-or-complex',
      unsupportedReasons: [firstReason, ...otherReasons],
    });
  }
  const [first, second, third, ...rest] = propertyNames;
  if (first === undefined || second === undefined || third === undefined) {
    return ok(undefined);
  }
  const fingerprint = schemaShapeFingerprint([first, second, third, ...rest]);
  if (isErr(fingerprint)) {
    return fingerprint;
  }
  return ok({
    ...position,
    kind: observation.kind,
    name: observation.name,
    propertyNames: [first, second, third, ...rest],
    fingerprint: fingerprint.value,
    completeness: 'complete-static-key-set',
    unsupportedReasons: [],
  });
}

function sourcePosition(
  node: Node,
  sourceFile: SourceFile,
): {
  readonly startLine: number;
  readonly endLine: number;
} {
  const start = node.getStart(sourceFile, false);
  const end = Math.max(start, node.getEnd() - 1);
  return {
    startLine: sourceFile.getLineAndCharacterOfPosition(start).line + 1,
    endLine: sourceFile.getLineAndCharacterOfPosition(end).line + 1,
  };
}

function compareSchemaShapes(left: SchemaShape, right: SchemaShape): number {
  return (
    left.startLine - right.startLine ||
    left.endLine - right.endLine ||
    compareUtf16(left.kind, right.kind) ||
    compareNullableUtf16(left.name, right.name)
  );
}

function compareNullableUtf16(left: string | null, right: string | null): number {
  if (left === null) {
    return right === null ? 0 : -1;
  }
  return right === null ? 1 : compareUtf16(left, right);
}
