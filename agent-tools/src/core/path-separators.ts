/**
 * Separator-shape helpers shared by the path-composing seams.
 *
 * Both flavours are handled everywhere here: a caller may hand over a path in
 * either separator form regardless of host (git speaks forward slashes on
 * every platform, Windows APIs speak backslashes, and configuration carries
 * whatever a human typed).
 *
 * @packageDocumentation
 */

/**
 * Whether `value` is a filesystem ROOT — the POSIX `/` (or a run of them), a
 * Windows drive root (`C:\`, `c:/`), or a UNC host/share root
 * (`\\server\share`, `\\server\share\`, and the bare `\\server`), each with
 * or without its trailing separator.
 *
 * Callers that compose a child path must refuse a root before trimming.
 * Trimming first destroys the distinction: `/` collapses to the empty string,
 * but `C:\` collapses to `C:`, which is drive-RELATIVE — it resolves against
 * the process's current directory on that drive, so a guard that only checks
 * for emptiness silently admits the Windows root it promised to refuse. The
 * UNC arm exists for the same promise: `path.win32.parse` treats a share as
 * a root, and without it a caller handing `\\server\share\` over would have
 * a child path composed directly in the share root.
 */
export function isFilesystemRoot(value: string): boolean {
  return (
    /^(?:[\\/]+|[A-Za-z]:[\\/]*)$/u.test(value) ||
    /^[\\/]{2}[^\\/]+(?:[\\/]+[^\\/]+)?[\\/]*$/u.test(value)
  );
}

/**
 * `value` with trailing separators removed — of either flavour by default,
 * or only those `isSeparator` accepts when a caller must trim one flavour's
 * separator alone (on POSIX a backslash is a filename character, so a
 * containment comparison there must not treat it as a separator).
 *
 * Written as a scan rather than a `[\\/]+$` replace: that pattern backtracks
 * super-linearly on a long run of separators (SonarCloud flags it on both
 * former call sites), and walking back from the end is linear by
 * construction as well as plainer to read.
 */
export function trimTrailingSeparators(
  value: string,
  isSeparator: (character: string) => boolean = isEitherSeparator,
): string {
  let end = value.length;
  while (end > 0 && isSeparator(value.charAt(end - 1))) {
    end -= 1;
  }

  return value.slice(0, end);
}

function isEitherSeparator(character: string): boolean {
  return character === '/' || character === '\\';
}
