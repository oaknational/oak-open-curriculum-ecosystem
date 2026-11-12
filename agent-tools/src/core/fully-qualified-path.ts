/**
 * Fully-qualified win32 path check: a drive letter, a colon, and a
 * separator (`C:\x` or `C:/x`).
 *
 * @remarks
 * `path.win32.isAbsolute` is NOT this invariant: it accepts rooted
 * drive-relative paths (`\x` / `/x` — resolved against the process's
 * CURRENT drive, caller-influenced space) and UNC paths (`\\host\share`
 * — a network location, not a fixed local install). Where a path stands
 * in for a fixed, trusted location (the S4036 hardening: a trusted
 * binary or root must never resolve from writable or caller-influenced
 * space), both must be refused: a drive-relative path lands wherever
 * the process happens to sit, and a network share is not
 * admin-protected local disk. `C:x` (no separator after the colon) is
 * likewise refused — it resolves against the per-drive current
 * directory, caller-influenced space again.
 *
 * @param candidate - The path to test.
 * @returns `true` only for `<drive>:<separator>...` forms.
 */
export const fullyQualifiedWin32 = (candidate: string): boolean =>
  /^[A-Za-z]:[\\/]/u.test(candidate);
