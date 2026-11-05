/**
 * The filesystem edge the owner-only retention path drives, and the real
 * `node:fs` implementation of it.
 *
 * @remarks
 * Its own module because it is a SEAM, not a policy: the ordering discipline,
 * the verification and the refusals live with {@link writeOwnerOnly} in
 * `owner-only-write.ts`, and this file is only the set of operations they are
 * allowed to reach for.
 *
 * @packageDocumentation
 */

import {
  closeSync,
  fchmodSync,
  fstatSync,
  mkdirSync,
  openSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';

/**
 * The filesystem edge the ordered write drives; a fake proves the order.
 *
 * EVERY filesystem call on the retention path belongs here, directory creation
 * included.
 *
 * The authority runs one way. Tests are NOT PERMITTED to touch the filesystem
 * (`testing-strategy.md` §Test Types; the `no-real-io-in-tests` rule); that
 * prohibition is the premise, and this seam is its consequence. A filesystem
 * call left outside the seam makes the code after it undescribable within the
 * rules, because the only way to reach that code would be an IO the test may
 * not perform. So a new call on this path is added HERE first, not reached for
 * directly.
 */
export interface OwnerOnlyWriteOps {
  /** Create the destination directory and any missing parents; existing is not an error. */
  readonly mkdir: (path: string) => void;
  /** Exclusive create of a NEW file at 0600; must fail if the path exists. */
  readonly open: (path: string, flags: 'wx', mode: number) => number;
  readonly fchmod: (fd: number, mode: number) => void;
  /** The descriptor's CURRENT mode, read back so the tightening is verified rather than assumed. */
  readonly fstat: (fd: number) => number;
  readonly write: (fd: number, content: string) => void;
  readonly close: (fd: number) => void;
  /** Atomic replace of the destination by the temporary file. */
  readonly rename: (from: string, to: string) => void;
  /** Best-effort removal of the temporary file on a failed write. */
  readonly unlink: (path: string) => void;
}

/** The real `node:fs` edge; production callers get this by omitting `ops`. */
export const nodeOwnerOnlyWriteOps: OwnerOnlyWriteOps = {
  mkdir: (path) => {
    mkdirSync(path, { recursive: true });
  },
  open: (path, flags, mode) => openSync(path, flags, mode),
  fchmod: (fd, mode) => {
    fchmodSync(fd, mode);
  },
  fstat: (fd) => fstatSync(fd).mode,
  write: (fd, content) => {
    writeFileSync(fd, content, { encoding: 'utf8' });
  },
  close: (fd) => {
    closeSync(fd);
  },
  rename: (from, to) => {
    renameSync(from, to);
  },
  unlink: (path) => {
    unlinkSync(path);
  },
};
