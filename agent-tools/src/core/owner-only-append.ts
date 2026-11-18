/**
 * One owner-only append: text appended to a file held private to the invoking
 * user.
 *
 * @remarks
 * The shared descriptor-level appender for machine-local logs that carry
 * owner-only content (session ids, project paths, raw payloads). It formats
 * nothing: the caller owns the text, and decides what a failure means.
 *
 * {@link appendOwnerOnly} runs these steps, in order, each a possible
 * failure:
 *
 * 1. `uid` — read the invoking user's uid, and refuse before touching
 *    anything when there is none. Node gives a process no uid on Windows and
 *    Android. Without one the owner check below cannot run, and on Windows
 *    the modes set below cannot make a file owner-only either: access is
 *    governed by ACLs, and `fchmod` reaches only the read-only flag. Writing
 *    anyway would put owner-only content in a file readable by whoever the
 *    ACL admits, so the append refuses, as `mcp-conformance/owner-only-write.ts`
 *    does on Windows;
 * 2. `mkdir` — create the directory recursively at 0o700 if it is absent. The
 *    mode applies only to a directory it creates: an existing directory, or a
 *    symlink to one, is left as it was;
 * 3. `open` — open the file through {@link appendOpenFlags}, creating it at
 *    0o600;
 * 4. `fstat` — refuse the descriptor unless it is a regular file, owned by the
 *    invoking user, with exactly one link. A second link is another name for
 *    the same bytes, in a place and under a mode the caller did not choose;
 * 5. `lstat` — refuse unless the path's own entry, not following a symlink,
 *    is a regular file with the descriptor's device and inode. It refuses a
 *    name swapped since the open, and, where the open has no no-follow flag,
 *    a symlink at the name, which that open follows, as
 *    `skills-adapter-generate/read-regular-file.ts` does. No-follow stays as
 *    defence in depth where it exists;
 * 6. `fchmod` — set the file to 0o600, retightening a file an earlier writer
 *    left readable by others;
 * 7. `write` — write every byte, then `close` the descriptor, which is closed
 *    on every path after a successful open.
 *
 * The outcome is a Result (ADR-088). A failure names the step and a code:
 *
 * - the errno code of a failed call, or `UNKNOWN` when the failure carried no
 *   error-code identifier;
 * - or one of the refusals `NO_POSIX_OWNERSHIP` (at `uid`),
 *   `NOT_REGULAR_FILE`, `NOT_OWNER` and `HARD_LINKED` (all at `fstat`),
 *   `NOT_SAME_FILE` (at `lstat`) and `NO_PROGRESS` (at `write`).
 *
 * It never carries a path or an error message, which can name one, so a
 * caller can show it anywhere.
 *
 * @packageDocumentation
 */

import { dirname } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import type {
  DescriptorFacts,
  FsFailure,
  OwnerOnlyAppendFs,
  OwnerOnlyOpenFlags,
  PathEntryFacts,
} from './owner-only-append-fs.js';

/**
 * The step of an owner-only append that failed, named for the port member it
 * used: the read of the invoking user's uid, or a file-system call.
 */
type OwnerOnlyStep = 'uid' | 'mkdir' | 'open' | 'fstat' | 'lstat' | 'fchmod' | 'write' | 'close';

/**
 * Why an owner-only append failed: the step, and an error code or refusal
 * code (see the module remarks). Never a path or an error message.
 */
export interface OwnerOnlyFailure {
  readonly step: OwnerOnlyStep;
  readonly code: string;
}

/**
 * The invoking user's uid, or the refusal on a platform without POSIX
 * ownership, where Node gives the process none.
 *
 * @remarks
 * The one statement of the rule "no uid, no owner-only write" (see the module
 * remarks, step 1). {@link appendOwnerOnly} applies it first; a caller that
 * must refuse before any other work, such as measuring a host path, asks it
 * too, so the two can never disagree.
 *
 * @param fs - The file-system surface; only its uid is read.
 * @returns The uid, or the `uid` step with `NO_POSIX_OWNERSHIP`.
 */
export function invokingUid(fs: Pick<OwnerOnlyAppendFs, 'uid'>): Result<number, OwnerOnlyFailure> {
  const uid = fs.uid;
  return uid === undefined ? err({ step: 'uid', code: 'NO_POSIX_OWNERSHIP' }) : ok(uid);
}

const DIRECTORY_MODE = 0o700;
const FILE_MODE = 0o600;

/**
 * The destination-boundary contract, as flags from the port: write-only
 * append, create-if-absent, no-follow so a pre-placed symlink at the
 * destination refuses to open (ELOOP), and nonblocking so a reader-less FIFO
 * at the destination fails fast (ENXIO) instead of hanging the caller. A flag
 * the platform lacks is left out (Windows has neither of the last two).
 */
function appendOpenFlags(flags: OwnerOnlyOpenFlags): number {
  return (
    flags.writeOnly | flags.append | flags.create | (flags.noFollow ?? 0) | (flags.nonBlock ?? 0)
  );
}

/**
 * Append text to a file held at 0o600, creating its directory at 0o700 if it
 * is absent.
 *
 * @remarks
 * On a platform without POSIX ownership it refuses before touching anything.
 * An existing directory keeps its mode. When the append and the close both
 * fail, the append's failure is returned: it is the cause, and the close
 * failure follows from it. See the module remarks for the steps and the
 * failure codes.
 *
 * @param filePath - The file to append to; its parent directory is created,
 * with any missing parents, if absent.
 * @param text - The text to append, written as UTF-8 exactly as given.
 * @param fs - The file-system surface; pass `nodeOwnerOnlyAppendFs`
 * (`owner-only-append-fs.ts`) outside tests.
 * @returns Success, or the failed step and its code.
 */
export function appendOwnerOnly(
  filePath: string,
  text: string,
  fs: OwnerOnlyAppendFs,
): Result<void, OwnerOnlyFailure> {
  const uid = invokingUid(fs);
  if (!uid.ok) {
    return uid;
  }
  const bytes = Buffer.from(text, 'utf8');
  const created = at('mkdir', fs.mkdir(dirname(filePath), DIRECTORY_MODE));
  if (!created.ok) {
    return created;
  }
  const opened = at('open', fs.open(filePath, appendOpenFlags(fs.openFlags), FILE_MODE));
  if (!opened.ok) {
    return opened;
  }
  const appended = appendThroughDescriptor(filePath, opened.value, bytes, uid.value, fs);
  const closed = at('close', fs.close(opened.value));
  return appended.ok ? closed : appended;
}

/**
 * Refuse the open descriptor unless {@link refusalOfDescriptor} finds nothing
 * and the name still holds it, set it to {@link FILE_MODE}, then write every
 * byte. The caller closes it.
 */
function appendThroughDescriptor(
  filePath: string,
  fd: number,
  bytes: Buffer,
  uid: number,
  fs: OwnerOnlyAppendFs,
): Result<void, OwnerOnlyFailure> {
  const inspected = at('fstat', fs.fstat(fd));
  if (!inspected.ok) {
    return inspected;
  }
  const refusal = refusalOfDescriptor(inspected.value, uid);
  if (refusal !== undefined) {
    return err({ step: 'fstat', code: refusal });
  }
  const named = at('lstat', fs.lstat(filePath));
  if (!named.ok) {
    return named;
  }
  if (!isSameRegularFile(named.value, inspected.value)) {
    return err({ step: 'lstat', code: 'NOT_SAME_FILE' });
  }
  const tightened = at('fchmod', fs.fchmod(fd, FILE_MODE));
  if (!tightened.ok) {
    return tightened;
  }
  return writeAllBytes(fd, bytes, fs);
}

/**
 * Why an open descriptor may not be appended to, if it may not: it must be a
 * regular file with exactly one link, owned by the invoking user.
 */
function refusalOfDescriptor(
  facts: DescriptorFacts,
  uid: number,
): 'NOT_REGULAR_FILE' | 'NOT_OWNER' | 'HARD_LINKED' | undefined {
  if (!facts.isFile) {
    return 'NOT_REGULAR_FILE';
  }
  if (facts.uid !== uid) {
    return 'NOT_OWNER';
  }
  return facts.nlink === 1 ? undefined : 'HARD_LINKED';
}

/**
 * Whether the path's own entry is a regular file (so not a symlink) and is the
 * very file the descriptor holds: the same device and inode.
 */
function isSameRegularFile(named: PathEntryFacts, opened: DescriptorFacts): boolean {
  return named.isFile && named.dev === opened.dev && named.ino === opened.ino;
}

/**
 * Write the whole buffer through possibly-short writes, resuming from the
 * reported offset; a write that consumes nothing fails rather than spinning.
 */
function writeAllBytes(
  fd: number,
  bytes: Buffer,
  fs: OwnerOnlyAppendFs,
): Result<void, OwnerOnlyFailure> {
  let written = 0;
  while (written < bytes.length) {
    const wrote = at('write', fs.write(fd, bytes, written, bytes.length - written));
    if (!wrote.ok) {
      return wrote;
    }
    if (wrote.value <= 0) {
      return err({ step: 'write', code: 'NO_PROGRESS' });
    }
    written += wrote.value;
  }
  return ok(undefined);
}

function at<T>(step: OwnerOnlyStep, result: Result<T, FsFailure>): Result<T, OwnerOnlyFailure> {
  return result.ok ? result : err({ step, code: result.error.code });
}
