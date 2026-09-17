import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';
import { lengthFrame } from './length-framing.js';

const SCHEMA_SHAPE_DOMAIN = Buffer.from('typescript-estate-schema-shape-v1\0');

export function sortSchemaPropertyNames(propertyNames: ReadonlySet<string>): readonly string[] {
  return [...propertyNames].sort(compareUtf8);
}

export function schemaShapeFingerprint(
  propertyNames: readonly string[],
): Result<string, EstateReviewError> {
  const hash = createHash('sha256').update(SCHEMA_SHAPE_DOMAIN);
  for (const propertyName of propertyNames) {
    const frame = lengthFrame(Buffer.from(propertyName, 'utf8'));
    if (isErr(frame)) {
      return err(
        new EstateReviewError('VALIDATION_FAILED', 'cannot frame schema-shape property name', {
          cause: frame.error,
        }),
      );
    }
    hash.update(frame.value.length);
    hash.update(frame.value.bytes);
  }
  return ok(hash.digest('hex'));
}

function compareUtf8(left: string, right: string): number {
  return Buffer.compare(Buffer.from(left, 'utf8'), Buffer.from(right, 'utf8'));
}
