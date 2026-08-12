/**
 * Owner-only descriptor-ordered file writing for retained conformance
 * artefacts.
 *
 * @remarks
 * OWNER-ONLY, established BEFORE any content lands. Attended runs retain
 * AUTHENTICATED vendor output, and the report shapes constrain none of
 * `error`, `output`, `details` or the captured stderr — a bearer or refresh
 * token reaching any of them lands in these files, so the process default
 * (0644 under a 022 umask) would expose it to every other user on a shared
 * host.
 *
 * ORDER IS THE WHOLE POINT, and write-then-chmod gets it wrong: the `mode`
 * argument applies only when the file is CREATED, so re-writing a report
 * left 0644 by an older build would put the authenticated payload on disk
 * world-readable and only tighten it afterwards — and if the chmod then
 * failed, the content would stay exposed while retention reported failure.
 *
 * Opening with 'w' truncates to zero length first, so the file is EMPTY at
 * that point; `fchmod` then tightens it (on the descriptor, so no path can
 * be swapped underneath us); only then does content land. A chmod failure
 * throws before the write, leaving an empty file and a loud retention
 * failure rather than an exposed one. Every throw propagates to the
 * caller's catch — including a close failure (EBADF/EIO — the write may not
 * have flushed), which is why the success-path close sits INSIDE the try
 * and the finally is error-path best-effort only (the caller's outcome
 * already carries the true cause; a second throw here would replace it with
 * the less useful close error).
 *
 * @packageDocumentation
 */

import { closeSync, fchmodSync, openSync, writeFileSync } from 'node:fs';

/**
 * The descriptor-ordered write operations behind {@link writeOwnerOnly},
 * injectable so the owner-only ORDERING contract (create at 0600, tighten the
 * descriptor before any content, never re-open by path) is provable on hosts
 * whose filesystems have no POSIX mode bits to observe (NTFS reports every
 * writable file the same way, so an on-disk assertion cannot distinguish
 * protected from default there).
 */
export interface OwnerOnlyWriteOps {
  readonly open: (path: string, flags: 'w', mode: number) => number;
  readonly fchmod: (fd: number, mode: number) => void;
  readonly write: (fd: number, content: string) => void;
  readonly close: (fd: number) => void;
}

const nodeOwnerOnlyWriteOps: OwnerOnlyWriteOps = {
  open: (path, flags, mode) => openSync(path, flags, mode),
  fchmod: (fd, mode) => {
    fchmodSync(fd, mode);
  },
  write: (fd, content) => {
    writeFileSync(fd, content, { encoding: 'utf8' });
  },
  close: (fd) => {
    closeSync(fd);
  },
};

/** The ordered owner-only write; production callers omit `ops` and get the real `node:fs` edge. */
export function writeOwnerOnly(
  filePath: string,
  content: string,
  ops: OwnerOnlyWriteOps = nodeOwnerOnlyWriteOps,
): void {
  let handle: number | undefined;
  try {
    handle = ops.open(filePath, 'w', 0o600);
    ops.fchmod(handle, 0o600);
    ops.write(handle, content);
    ops.close(handle);
    handle = undefined;
  } finally {
    if (handle !== undefined) {
      try {
        ops.close(handle);
      } catch {
        // Descriptor leak at worst — the true failure is already propagating.
      }
    }
  }
}
