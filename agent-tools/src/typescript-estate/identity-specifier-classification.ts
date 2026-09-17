import path from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';

export interface IdentityResolutionRoots {
  readonly checkout: string;
  readonly dist: string;
}

/** Classify a built ESM specifier and return its local closure target, if any. */
export function classifyIdentitySpecifier(
  roots: IdentityResolutionRoots,
  importer: string,
  specifier: string,
): Result<string | null, EstateReviewError> {
  if (specifier.startsWith('./') || specifier.startsWith('../')) {
    return resolveLocalSpecifier(roots, importer, specifier);
  }
  return isNodeBuiltinSpecifier(specifier) || isExternalPackageSpecifier(specifier)
    ? ok(null)
    : err(
        new EstateReviewError(
          'IDENTITY_INVALID',
          `unresolved module specifier '${specifier}' in '${toRepoPath(roots.checkout, importer)}'`,
        ),
      );
}

function resolveLocalSpecifier(
  roots: IdentityResolutionRoots,
  importer: string,
  specifier: string,
): Result<string, EstateReviewError> {
  if (hasForbiddenLocalByte(specifier)) {
    return err(new EstateReviewError('IDENTITY_INVALID', `invalid local specifier '${specifier}'`));
  }
  const importerWithinDist = toPosix(path.relative(roots.dist, importer));
  const targetWithinDist = path.posix.normalize(
    path.posix.join(path.posix.dirname(importerWithinDist), specifier),
  );
  if (escapesPosixRoot(targetWithinDist)) {
    return escapeFailure(specifier);
  }
  if (targetWithinDist.endsWith('.ts') || targetWithinDist.endsWith('.tsx')) {
    return err(
      new EstateReviewError(
        'IDENTITY_INVALID',
        `local specifier '${specifier}' attempts source .ts/.tsx execution`,
      ),
    );
  }
  const target = path.join(roots.dist, ...targetWithinDist.split('/'));
  return target.startsWith(`${roots.dist}${path.sep}`) ? ok(target) : escapeFailure(specifier);
}

function hasForbiddenLocalByte(specifier: string): boolean {
  return (
    specifier.includes('\0') ||
    specifier.includes('\\') ||
    specifier.includes('?') ||
    specifier.includes('#')
  );
}

function escapesPosixRoot(value: string): boolean {
  return value === '..' || value.startsWith('../') || path.posix.isAbsolute(value);
}

function escapeFailure(specifier: string): Result<never, EstateReviewError> {
  return err(
    new EstateReviewError(
      'IDENTITY_INVALID',
      `local specifier '${specifier}' escapes executingDistRoot`,
    ),
  );
}

function isNodeBuiltinSpecifier(specifier: string): boolean {
  if (!specifier.startsWith('node:')) {
    return false;
  }
  const body = specifier.slice('node:'.length);
  return (
    body.length > 0 && !/[\0\\%?#:]/u.test(body) && body.split('/').every(isNodeBuiltinSegment)
  );
}

function isNodeBuiltinSegment(segment: string): boolean {
  return segment !== '.' && segment !== '..' && /^\w[\w.-]*$/u.test(segment);
}

function isExternalPackageSpecifier(specifier: string): boolean {
  if (hasInvalidPackageEnvelope(specifier)) {
    return false;
  }
  const segments = specifier.split('/');
  if (segments.some(isInvalidSegment)) {
    return false;
  }
  return segments[0]?.startsWith('@') === true
    ? isScopedPackage(segments)
    : isUnscopedPackage(segments);
}

function hasInvalidPackageEnvelope(specifier: string): boolean {
  return specifier.length === 0 || /^[./#]/u.test(specifier) || /[\0\\:%?#]/u.test(specifier);
}

function isInvalidSegment(segment: string): boolean {
  return segment.length === 0 || segment === '.' || segment === '..';
}

function isScopedPackage(segments: readonly string[]): boolean {
  return (
    segments.length >= 2 &&
    /^@[A-Za-z0-9_~-][A-Za-z0-9._~-]*$/u.test(segments[0] ?? '') &&
    isPackageName(segments[1] ?? '') &&
    segments.slice(2).every(isPackageSubpath)
  );
}

function isUnscopedPackage(segments: readonly string[]): boolean {
  return isPackageName(segments[0] ?? '') && segments.slice(1).every(isPackageSubpath);
}

function isPackageName(segment: string): boolean {
  return /^[A-Za-z0-9_~-][A-Za-z0-9._~-]*$/u.test(segment);
}

function isPackageSubpath(segment: string): boolean {
  return /^[A-Za-z0-9_@+.,=~-]+$/u.test(segment);
}

function toRepoPath(checkout: string, absolutePath: string): string {
  return toPosix(path.relative(checkout, absolutePath));
}

function toPosix(value: string): string {
  return value.split(path.sep).join('/');
}
