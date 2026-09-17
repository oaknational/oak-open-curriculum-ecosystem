import { err, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';

const FORBIDDEN_LITERAL_CHARACTERS = ['\u0000', '\\', '*', '?', '[', ']', '{', '}', '!'];

export function validateWorkspacePatterns(
  patterns: readonly string[],
): Result<readonly string[], EstateReviewError> {
  const seen = new Set<string>();
  for (const pattern of patterns) {
    const valid = validateWorkspacePattern(pattern);
    if (!valid) {
      return err(
        new EstateReviewError(
          'SNAPSHOT_INVALID',
          `unsupported pnpm workspace package pattern '${printablePattern(pattern)}'`,
        ),
      );
    }
    if (seen.has(pattern)) {
      return err(
        new EstateReviewError(
          'SNAPSHOT_INVALID',
          `duplicate pnpm workspace package pattern '${printablePattern(pattern)}'`,
        ),
      );
    }
    seen.add(pattern);
  }
  return ok([...patterns]);
}

export function matchesWorkspaceRoot(root: string, pattern: string): boolean {
  const rootSegments = root.split('/');
  const patternSegments = pattern.split('/');
  return (
    rootSegments.length === patternSegments.length &&
    patternSegments.every((segment, index) => segment === '*' || segment === rootSegments[index])
  );
}

function validateWorkspacePattern(pattern: string): boolean {
  if (pattern.length === 0 || pattern.startsWith('/') || pattern.endsWith('/')) {
    return false;
  }
  return pattern.split('/').every(isSupportedSegment);
}

function isSupportedSegment(segment: string): boolean {
  return (
    segment === '*' ||
    (segment.length > 0 &&
      segment !== '.' &&
      segment !== '..' &&
      !FORBIDDEN_LITERAL_CHARACTERS.some((character) => segment.includes(character)))
  );
}

function printablePattern(pattern: string): string {
  return JSON.stringify(pattern);
}
