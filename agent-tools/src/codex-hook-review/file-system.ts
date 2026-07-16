/**
 * Production filesystem boundary for review-path inspection.
 *
 * @packageDocumentation
 */

import { lstat as inspectWithoutFollowingLinks } from 'node:fs';
import { promisify } from 'node:util';

import { err, ok, type Result } from '@oaknational/result';

import { type ReviewPathEntryKind, type ReviewPathInspection } from './path.js';

const lstat = promisify(inspectWithoutFollowingLinks);

/** Minimal stat surface needed to classify a path without following links. */
export interface ReviewLstatEntry {
  readonly isSymbolicLink: () => boolean;
  readonly isFile: () => boolean;
  readonly isDirectory: () => boolean;
}

/** Injectable lstat operation used by the production adapter and pure tests. */
export type ReviewLstat = (absolutePath: string) => Promise<ReviewLstatEntry>;

/** Build a review-path adapter around a concrete lstat operation. */
export function createReviewPathInspection(operation: ReviewLstat): ReviewPathInspection {
  return { lstat: (absolutePath) => inspectPathEntry(operation, absolutePath) };
}

/** Real lstat adapter used by the production hook composition. */
export const productionReviewPathInspection = createReviewPathInspection(lstat);

async function inspectPathEntry(
  operation: ReviewLstat,
  absolutePath: string,
): Promise<Result<ReviewPathEntryKind, Error>> {
  try {
    return ok(classifyEntry(await operation(absolutePath)));
  } catch (error: unknown) {
    if (isMissing(error)) {
      return ok('missing');
    }
    return err(error instanceof Error ? error : new Error('lstat failed', { cause: error }));
  }
}

function classifyEntry(entry: ReviewLstatEntry): ReviewPathEntryKind {
  if (entry.isSymbolicLink()) {
    return 'symbolic-link';
  }
  if (entry.isFile()) {
    return 'file';
  }
  if (entry.isDirectory()) {
    return 'directory';
  }
  return 'other';
}

function isMissing(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
