/**
 * Operator profile — reading one document. A document is opened read-only,
 * never through a symlink at the document itself (`O_NOFOLLOW`) and never
 * blocking on a fifo (`O_NONBLOCK`); the descriptor is then proven to be a
 * regular file, and on a host without `O_NOFOLLOW` proven to be the very
 * entry at the path (device and inode), before it is read whole and closed.
 * Each step has its own Result and nothing here throws. The same fused
 * open-verify-read shape as the adapter generator's `read-regular-file.ts`,
 * with this module's injectable handle and close-failure Results.
 *
 * A directory above the document is not guarded by the open: one swapped
 * for a link between the listing and the read is followed. That is the
 * stated boundary, as the rule-surface, rule-sweep and declared-adapter
 * readers state theirs: the Practice's own git never writes a link into the
 * profile tree (its runner checks out with `core.symlinks=false`), and any
 * other writer able to plant a link there can write a conforming document
 * directly. The error code helper lives here so that the filesystem module,
 * which imports this one, shares it.
 */

import { type BigIntStats } from 'node:fs';
import { type FileHandle, lstat, open } from 'node:fs/promises';

import { err, ok, type Result } from '@oaknational/result';

import { HOST_ENFORCES_NO_FOLLOW, NO_FOLLOW_READ_FLAGS } from '../../core/no-follow-read.js';

/** The code a filesystem failure carries, or `unknown` when it carries none. */
export function errorCode(cause: unknown): string {
  return cause instanceof Error && 'code' in cause ? String(cause.code) : 'unknown';
}

/** What the identity check needs of a stat: regular-file flag, device and inode. */
export type EntryIdentity = Pick<BigIntStats, 'isFile' | 'dev' | 'ino'>;

/** What a read needs of an open file; a `FileHandle` is one. */
export interface DocumentHandle {
  stat(options: { readonly bigint: true }): Promise<EntryIdentity>;
  readFile(encoding: 'utf8'): Promise<string>;
  close(): Promise<void>;
}

/**
 * The host's no-follow guard and the path-entry probe; tests inject both to
 * drive the arm a host without `O_NOFOLLOW` takes.
 */
export interface ReadProbes {
  readonly noFollowAtOpen: boolean;
  readonly entryStat: (absolute: string) => Promise<EntryIdentity>;
}

const REAL_PROBES: ReadProbes = {
  noFollowAtOpen: HOST_ENFORCES_NO_FOLLOW,
  entryStat: (absolute) => lstat(absolute, { bigint: true }),
};

/** Opens a path with flags; the filesystem one is the default, tests inject a fake. */
export type OpenDocument = (absolute: string, flags: number) => Promise<DocumentHandle>;

const openReal: OpenDocument = async (absolute, flags) => {
  const handle: FileHandle = await open(absolute, flags);
  return handle;
};

/**
 * Read a document without following a symlink at the document itself. The
 * layout has already refused every symlink entry; opening with `O_NOFOLLOW`
 * closes that window at the document, so a link planted there between the
 * listing and the read fails (ELOOP) instead of reading a file outside the
 * profile root. A fifo or other special file planted there opens at once and
 * is refused before any read. A directory above it is not guarded (see the
 * module note).
 *
 * @param absolute - the document's absolute path
 * @param openDocument - opens the path (the filesystem by default)
 * @param probes - the no-follow guard and path-entry probe (the host's by default)
 * @returns the document text, or the failure as a message (never a thrown error)
 */
export async function readDocument(
  absolute: string,
  openDocument: OpenDocument = openReal,
  probes: ReadProbes = REAL_PROBES,
): Promise<Result<string, string>> {
  let opened: DocumentHandle;
  try {
    opened = await openDocument(absolute, NO_FOLLOW_READ_FLAGS);
  } catch (cause) {
    return err(unreadable(cause));
  }
  let text: string;
  try {
    const identity = await verifyRegularFile(absolute, opened, probes);
    if (identity !== null) {
      return err(withCloseFailure(identity, await closeAfterFailure(opened)));
    }
    text = await opened.readFile('utf8');
  } catch (cause) {
    return err(withCloseFailure(unreadable(cause), await closeAfterFailure(opened)));
  }
  try {
    await opened.close();
  } catch (cause) {
    return err(
      `cannot close the document after reading it (${errorCode(cause)}) — the text read is discarded, never trusted`,
    );
  }
  return ok(text);
}

/**
 * The descriptor must be a regular file; on a host without `O_NOFOLLOW` the
 * path's own entry must also be a regular file that is this very file (same
 * device and inode), so a link at the document, or a swap of the document
 * between the listing and the open, is refused and never read through. Null
 * when it is ours.
 */
async function verifyRegularFile(
  absolute: string,
  opened: DocumentHandle,
  probes: ReadProbes,
): Promise<string | null> {
  const viaHandle = await opened.stat({ bigint: true });
  if (!viaHandle.isFile()) {
    return 'the path is not a regular file — a directory, a fifo or a special file is never a profile document';
  }
  if (probes.noFollowAtOpen) {
    return null;
  }
  const entry = await probes.entryStat(absolute);
  const same = entry.isFile() && entry.dev === viaHandle.dev && entry.ino === viaHandle.ino;
  return same
    ? null
    : 'the path entry is not the file that was opened — a symlink or a swapped entry is never read through';
}

/**
 * Closes a handle whose read already failed. The read's refusal is the
 * outcome; a failure here, thrown or rejected, is contained and returned as
 * its code so the refusal can carry both causes.
 */
async function closeAfterFailure(handle: DocumentHandle): Promise<string | null> {
  try {
    await handle.close();
    return null;
  } catch (cause) {
    return errorCode(cause);
  }
}

/** A refusal, with the close failure that followed it named when there was one. */
function withCloseFailure(refusal: string, closeFailure: string | null): string {
  return closeFailure === null
    ? refusal
    : `${refusal}; the close after it failed too (${closeFailure})`;
}

function unreadable(cause: unknown): string {
  return `cannot read the document (${errorCode(cause)}) — a symlink or an unreadable file is never a profile document`;
}
