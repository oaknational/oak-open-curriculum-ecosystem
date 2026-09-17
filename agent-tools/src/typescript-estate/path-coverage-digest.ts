import { Buffer } from 'node:buffer';
import { createHash } from 'node:crypto';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';
import { lengthFrame } from './length-framing.js';
import type { RepoPath, Sha256 } from './scalar-model.js';
import { compareUtf16 } from './utf16-order.js';

const PATHS_DOMAIN = Buffer.from('typescript-estate-paths-v1\0', 'utf8');

/**
 * Digest the already validated TypeScript denominator without normalising it.
 *
 * Refusing duplicates and ordering defects prevents this proof helper from
 * silently giving a malformed denominator a stable but misleading identity.
 */
export function digestOrderedPaths(paths: readonly RepoPath[]): Result<Sha256, EstateReviewError> {
  const orderingFailure = findOrderingFailure(paths);
  if (orderingFailure !== undefined) {
    return err(
      new EstateReviewError(
        'VALIDATION_FAILED',
        `denominator paths must be in strict ascending UTF-16 order; ${orderingFailure}`,
      ),
    );
  }

  const hash = createHash('sha256').update(PATHS_DOMAIN);
  for (const repoPath of paths) {
    const framed = lengthFrame(Buffer.from(repoPath, 'utf8'));
    if (isErr(framed)) {
      return err(
        new EstateReviewError('VALIDATION_FAILED', 'cannot length-frame denominator path', {
          cause: framed.error,
        }),
      );
    }
    hash.update(framed.value.length);
    hash.update(framed.value.bytes);
  }
  return ok(hash.digest('hex'));
}

function findOrderingFailure(paths: readonly RepoPath[]): string | undefined {
  for (let index = 1; index < paths.length; index += 1) {
    const previous = paths[index - 1];
    const current = paths[index];
    if (previous !== undefined && current !== undefined && compareUtf16(previous, current) >= 0) {
      return `path ${String(index)} is not greater than its predecessor`;
    }
  }
  return undefined;
}
