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
 * Whether `value` is a filesystem ROOT — the POSIX `/` (or a run of them), or
 * a Windows drive root (`C:\`, `c:/`), with or without its trailing separator.
 *
 * Callers that compose a child path must refuse a root before trimming.
 * Trimming first destroys the distinction: `/` collapses to the empty string,
 * but `C:\` collapses to `C:`, which is drive-RELATIVE — it resolves against
 * the process's current directory on that drive, so a guard that only checks
 * for emptiness silently admits the Windows root it promised to refuse.
 */
export function isFilesystemRoot(value: string): boolean {
  return /^(?:[\\/]+|[A-Za-z]:[\\/]*)$/u.test(value);
}

/**
 * `value` with any trailing separators of either flavour removed.
 *
 * Written as a scan rather than a `[\\/]+$` replace: that pattern backtracks
 * super-linearly on a long run of separators (SonarCloud flags it on both
 * former call sites), and walking back from the end is linear by
 * construction as well as plainer to read.
 */
export function trimTrailingSeparators(value: string): string {
  let end = value.length;
  while (end > 0 && isSeparator(value[end - 1])) {
    end -= 1;
  }

  return value.slice(0, end);
}

function isSeparator(character: string | undefined): boolean {
  return character === '/' || character === '\\';
}
