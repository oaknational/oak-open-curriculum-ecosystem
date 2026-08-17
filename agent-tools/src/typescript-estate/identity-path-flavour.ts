import type path from 'node:path';

import { fullyQualifiedWin32 } from '../core/fully-qualified-path.js';

/**
 * The `node:path` surface the identity chain's comparisons run through — the
 * host module by default, `path.win32`/`path.posix` under injection so each
 * platform's containment rules are provable from any host.
 */
export type IdentityPathApi = Pick<
  typeof path,
  'normalize' | 'sep' | 'isAbsolute' | 'relative' | 'join'
>;

/** Whether the injected flavour is the Windows path family. */
export function isWin32Flavour(pathApi: IdentityPathApi): boolean {
  // A single backslash cannot be written with String.raw (the backslash
  // would escape the closing backtick), so the escaped literal stays.
  return pathApi.sep === '\\';
}

/**
 * Whether `value` is fully qualified for the flavour: POSIX-absolute on the
 * posix flavour; on win32, drive-qualified — rooted drive-relative paths and
 * UNC shares are refused (see {@link fullyQualifiedWin32}).
 */
export function fullyQualifiedForFlavour(value: string, pathApi: IdentityPathApi): boolean {
  return isWin32Flavour(pathApi) ? fullyQualifiedWin32(value) : pathApi.isAbsolute(value);
}

/**
 * True when any path segment is `.` or `..` — inputs here must be
 * already-resolved. Splitting on BOTH separators is a deliberate POSIX
 * asymmetry: a legal POSIX filename containing a backslash (e.g. `a\..`)
 * is refused even though it holds no real dot segment. That is the safe
 * direction (over-refusal, never under-refusal), and these are internal,
 * already-resolved inputs — no legitimate caller composes such a name.
 */
export function hasDotSegments(value: string): boolean {
  return value.split(/[\\/]/u).some((segment) => segment === '.' || segment === '..');
}

/**
 * Comparison form of a path: normalised, with the leading drive letter
 * case-normalised on the win32 flavour only.
 *
 * Drive letters are case-insensitive on Windows unconditionally and their
 * case varies by source, so comparing them raw is a false escape. Path
 * COMPONENTS stay case-sensitive on every flavour: a Windows directory can
 * opt into case-sensitive lookup (`fsutil file setCaseSensitiveInfo`, and
 * anything created under WSL interop), so two paths differing only in a
 * component's case can identify different nodes — folding them would let
 * {@link isWithin} report an escape as contained. An earlier revision folded
 * the whole path on win32, reasoning that Windows filesystems are
 * case-insensitive; that is not reliably true, and over-acceptance on a
 * containment boundary is the unrecoverable direction of error.
 */
export function comparablePath(value: string, pathApi: IdentityPathApi): string {
  const normalised = pathApi.normalize(value);
  return isWin32Flavour(pathApi) && /^[a-z]:/u.test(normalised)
    ? `${normalised[0]?.toUpperCase() ?? ''}${normalised.slice(1)}`
    : normalised;
}

/**
 * Lexical containment in comparable form: Windows accepts forward-slash
 * absolute paths, and comparing them raw against a `pathApi.sep` boundary
 * falsely classifies a contained path as escaping (an over-refusal, but a
 * wrong verdict either way).
 */
export function isWithin(base: string, candidate: string, pathApi: IdentityPathApi): boolean {
  const normalisedBase = comparablePath(base, pathApi);
  const normalisedCandidate = comparablePath(candidate, pathApi);
  return (
    normalisedCandidate === normalisedBase ||
    normalisedCandidate.startsWith(`${normalisedBase}${pathApi.sep}`)
  );
}
