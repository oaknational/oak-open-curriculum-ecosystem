import { realpathSync } from 'node:fs';
import { sep } from 'node:path';

/** Injectable seam for {@link assertPathWithinBase} (testing + composition). */
export interface AssertPathWithinBaseOptions {
  /**
   * Canonicalises a path to its real, symlink-resolved absolute form.
   * Defaults to `node:fs` `realpathSync`. Tests inject a pure map to stay off
   * real IO and to simulate symlink escapes.
   */
  readonly realpath?: (path: string) => string;
}

/**
 * Assert that `candidatePath` resolves inside `baseDir`, returning the
 * canonical (symlink-resolved) candidate path for safe use.
 *
 * @remarks
 * Guards I/O sinks against path-injection. A caller-influenced path (e.g. a
 * value from `process.argv`) is canonicalised with `realpathSync` — which
 * resolves both `..` segments AND symlinks, unlike `path.resolve` — and then
 * checked for containment within the likewise-canonicalised base. A symlink
 * inside the base that points outside it is therefore rejected, which a
 * `path.resolve`-only check would wrongly accept.
 *
 * The comparison appends a trailing separator to the base so a sibling whose
 * name merely shares the base as a prefix (`/repo-secret` against a `/repo`
 * base) is rejected rather than treated as contained.
 *
 * @param candidatePath - The untrusted path to validate.
 * @param baseDir - The directory the candidate must resolve within.
 * @param options - Canonicalisation seam.
 * @returns The canonical, contained candidate path, safe to read.
 * @throws when the candidate resolves outside `baseDir`, or when either path
 *   cannot be canonicalised (for example, it does not exist).
 */
export function assertPathWithinBase(
  candidatePath: string,
  baseDir: string,
  options: AssertPathWithinBaseOptions = {},
): string {
  const realpath = options.realpath ?? ((path: string) => realpathSync(path));

  const realBase = realpath(baseDir);
  const realCandidate = realpath(candidatePath);

  const baseWithSep = realBase.endsWith(sep) ? realBase : `${realBase}${sep}`;

  if (realCandidate !== realBase && !realCandidate.startsWith(baseWithSep)) {
    throw new Error(
      `Refusing path outside the permitted base: '${candidatePath}' resolves to '${realCandidate}', which is not within '${realBase}'.`,
    );
  }

  return realCandidate;
}
