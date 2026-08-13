import { realpathSync } from 'node:fs';
import path from 'node:path';

/**
 * The `node:path` surface {@link assertPathWithinBase} compares with — the
 * host module by default, `path.win32`/`path.posix` under injection so each
 * platform's comparison rules are provable from any host.
 */
export type PathApi = Pick<typeof path, 'normalize' | 'sep'>;

/** Injectable seam for {@link assertPathWithinBase} (testing + composition). */
export interface AssertPathWithinBaseOptions {
  /**
   * Canonicalises a path to its real, symlink-resolved absolute form.
   * Defaults to `node:fs` `realpathSync`. Tests inject a pure map to stay off
   * real IO and to simulate symlink escapes.
   */
  readonly realpath?: (path: string) => string;
  /**
   * Path flavour for the containment comparison. Defaults to the host
   * `node:path`; tests inject `path.win32` or `path.posix` to prove each
   * platform's rules deterministically.
   */
  readonly pathApi?: PathApi;
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
 * Comparison rules (the flavour comes from `options.pathApi`):
 *
 * - Both sides are compared in `pathApi.normalize`d form: on Windows a
 *   canonicaliser (the documented seam, or a caller-supplied one) may express
 *   absolute paths with forward slashes, and a raw comparison against the
 *   host separator would misjudge containment on separator form alone. On
 *   POSIX normalisation is the identity for canonical paths (a backslash
 *   there is an ordinary filename character).
 * - On the win32 flavour the comparison is additionally case-folded: Windows
 *   filesystems are case-insensitive and drive-letter case varies by source,
 *   so a case-only difference is a false escape. The POSIX comparison stays
 *   case-sensitive — folding there would treat two genuinely distinct paths
 *   as one, a security regression.
 * - The comparison appends a trailing separator to the base so a sibling
 *   whose name merely shares the base as a prefix (`/repo-secret` against a
 *   `/repo` base) is rejected rather than treated as contained.
 * - The RETURN value always keeps the canonicaliser's own bytes; only the
 *   comparison is normalised and folded.
 *
 * @param candidatePath - The untrusted path to validate.
 * @param baseDir - The directory the candidate must resolve within.
 * @param options - Canonicalisation and path-flavour seams.
 * @returns The canonical, contained candidate path, safe to read.
 * @throws when the candidate resolves outside `baseDir`, or when either path
 *   cannot be canonicalised (for example, it does not exist).
 */
export function assertPathWithinBase(
  candidatePath: string,
  baseDir: string,
  options: AssertPathWithinBaseOptions = {},
): string {
  const realpath = options.realpath ?? ((value: string) => realpathSync(value));
  const pathApi = options.pathApi ?? path;

  const realBase = realpath(baseDir);
  const realCandidate = realpath(candidatePath);

  const comparableBase = comparable(realBase, pathApi);
  const comparableCandidate = comparable(realCandidate, pathApi);

  const baseWithSep = comparableBase.endsWith(pathApi.sep)
    ? comparableBase
    : `${comparableBase}${pathApi.sep}`;

  if (comparableCandidate !== comparableBase && !comparableCandidate.startsWith(baseWithSep)) {
    throw new Error(
      `Refusing path outside the permitted base: '${candidatePath}' resolves to '${realCandidate}', which is not within '${realBase}'.`,
    );
  }

  return realCandidate;
}

/** Comparison form of a path — see the {@link assertPathWithinBase} rules. */
function comparable(value: string, pathApi: PathApi): string {
  const normalised = pathApi.normalize(value);
  return pathApi.sep === '\\' ? normalised.toLowerCase() : normalised;
}
