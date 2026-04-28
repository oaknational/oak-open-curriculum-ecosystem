/**
 * Lookup helpers for teacher sitemap paths.
 *
 * The sitemap scanner writes `teacherPaths` sorted with the default unicode
 * ordering used by `Array.prototype.sort()`, so validation must use direct
 * string comparison rather than locale-aware collation.
 */

/**
 * Binary search for a target in a sorted readonly array.
 *
 * @returns `true` when the target exists, otherwise `false`.
 */
export function binarySearchSortedPaths(sorted: readonly string[], target: string): boolean {
  let lo = 0;
  let hi = sorted.length - 1;

  while (lo <= hi) {
    const mid = (lo + hi) >>> 1;
    const entry = sorted[mid];

    if (entry === undefined) {
      return false;
    }

    if (entry === target) {
      return true;
    }

    if (entry < target) {
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  return false;
}

/** Return whether any teacher path begins with the given prefix. */
export function hasTeacherPathWithPrefix(paths: readonly string[], prefix: string): boolean {
  return paths.some((path) => path.startsWith(prefix));
}
