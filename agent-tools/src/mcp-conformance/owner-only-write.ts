/**
 * Owner-only file writing for retained conformance artefacts: a fresh file,
 * created exclusively with mode 0600 beside the destination, tightened on
 * its descriptor before any content lands, and renamed over the destination
 * so a planted link is replaced rather than followed.
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
 * world-readable and only tighten it afterwards.
 *
 * THE DESTINATION IS NEVER OPENED. Opening the destination with `'w'` would
 * follow an existing symbolic link and truncate its target before the
 * descriptor could be tightened, so a stale or planted report link could
 * overwrite and chmod a file outside the report directory (review finding
 * on the upstream lane, 2026-08). Instead a temporary file is created in the
 * destination's directory with `'wx'` (exclusive create, so a pre-existing
 * name of any kind fails loudly) at 0600, `fchmod` tightens it on the
 * descriptor, the content lands, the descriptor closes, and `rename` moves
 * the file over the destination: a link at the destination is replaced by a
 * regular file, never followed, and the old 0644 report is replaced whole
 * rather than truncated in place. A failure at any step unlinks the
 * temporary file best-effort and propagates the true cause; the success-path
 * close sits INSIDE the try (a close failure means the write may not have
 * flushed) and the finally is error-path best-effort only.
 *
 * THE TIGHTENING IS VERIFIED, NOT ASSUMED. `fchmod` reports success on
 * filesystems that do not carry POSIX permission bits at all, so a successful
 * call is not evidence that the file is owner-only. The descriptor's mode is
 * therefore read back before any content lands, and a mode other than 0600
 * raises `OwnerOnlyModeNotHeldError` with nothing written — turning a silent
 * false claim into a loud refusal on any mount whose semantics differ from the
 * host's own.
 *
 * AND THE READING ITSELF IS CHECKED. A mount can report permission bits it
 * does not enforce: CIFS/SMB without Unix extensions synthesises every mode
 * from `file_mode=`, so `file_mode=0600` answers 0600 to every reading while
 * `fchmod` changes nothing. Reading 0600 back there is exactly the false
 * claim above wearing the right answer. The descriptor is therefore moved to
 * a different mode and read FIRST; a mount that does not round-trip that
 * probe raises `OwnerOnlyModeNotEnforcedError`, and only a filesystem whose
 * mode interface is LIVE reaches the 0600 reading at all.
 *
 * WHAT THAT PROBE DOES NOT ESTABLISH, stated because the difference is the
 * whole subject of this file. A round-trip proves the mode interface responds
 * to writes; it does not prove those bits govern access. A CIFS mount using
 * client-cached `dynperm` with `noperm` round-trips mode changes locally while
 * the server's own credentials and ACLs stay authoritative, and this module
 * would write there (review finding, PR #132). Closing that needs an
 * EFFECTIVE-ACCESS check, and Node exposes none: `fs.access` answers for the
 * calling process, never for another principal, and a filesystem-type
 * allowlist reads differently on every platform and would refuse retention on
 * every network mount — a product decision about who may retain where, not a
 * defect fix, so it is the owner's and is recorded on the estate-coordination
 * thread rather than taken here. The guarantee this module makes is therefore
 * exact: the artefact is created owner-only, never widened, and refused
 * outright unless the filesystem's own mode interface is live and reports
 * owner-only. On a mount that lies about enforcement, that is strictly more
 * than the previous code established and strictly less than enforcement.
 *
 * PLATFORM SCOPE. The ordering discipline delivers owner-only protection on
 * POSIX. On Windows, `fchmod` cannot express owner-only — NTFS access
 * control is ACL-based and the POSIX mode surface reaches only the
 * read-only flag — and callers write under the repository or an arbitrary
 * absolute `--pack-out` path, not necessarily beneath a private profile
 * directory, so the artefact can inherit an ACL readable by other users on
 * a shared checkout. This module therefore REFUSES to retain on `win32`
 * with a typed error naming the reason; the caller's retention outcome
 * carries it, and attended conformance with retained authenticated output
 * runs on POSIX or under WSL (the estate's first-class tiers).
 *
 * @packageDocumentation
 */

import { randomBytes } from 'node:crypto';
import { basename, dirname, join } from 'node:path';

import { nodeOwnerOnlyWriteOps, type OwnerOnlyWriteOps } from './owner-only-write-ops.js';

/** The permission bits an owner-only artefact must hold: read and write for the owner alone. */
const OWNER_ONLY_MODE = 0o600;

/**
 * A mode set and read back only to prove the filesystem honours mode changes
 * at all. Owner-read alone: strictly narrower than the target, so the probe
 * never widens access even for the moment it is held, and DIFFERENT from
 * {@link OWNER_ONLY_MODE}, which is the whole point — a mount that reports a
 * constant synthetic 0600 cannot round-trip this value.
 */
const MODE_HONOURED_PROBE = 0o400;

/** The refusal an owner-only retention raises on a platform that cannot establish it. */
export class OwnerOnlyUnavailableError extends Error {
  public constructor(platform: NodeJS.Platform) {
    super(
      `owner-only retention is not establishable on ${platform}: NTFS access control is ` +
        'ACL-based and fchmod cannot set it, so a retained artefact could be readable by other ' +
        'users; retention refused — run attended conformance on POSIX or under WSL',
    );
    this.name = 'OwnerOnlyUnavailableError';
  }
}

/** The refusal raised when the descriptor does not actually hold owner-only permissions. */
export class OwnerOnlyModeNotHeldError extends Error {
  public constructor(observedMode: number) {
    super(
      `owner-only retention refused: the descriptor reads mode 0${(observedMode & 0o777).toString(8)} ` +
        'after fchmod(0600), so the filesystem did not honour the tightening and the artefact would ' +
        'not be owner-only; nothing was written',
    );
    this.name = 'OwnerOnlyModeNotHeldError';
  }
}

/**
 * The refusal raised when the mount reports permission bits it does not
 * actually enforce, so reading 0600 back would prove nothing.
 */
export class OwnerOnlyModeNotEnforcedError extends Error {
  public constructor(observedMode: number) {
    super(
      `owner-only retention refused: the descriptor still reads mode ` +
        `0${(observedMode & 0o777).toString(8)} after fchmod(0${MODE_HONOURED_PROBE.toString(8)}), so this ` +
        'mount reports synthetic permission bits rather than enforcing them and a later 0600 reading ' +
        'would be no evidence at all; nothing was written',
    );
    this.name = 'OwnerOnlyModeNotEnforcedError';
  }
}

/**
 * Refuse a platform that cannot establish owner-only permissions, BEFORE the
 * caller touches the filesystem.
 *
 * {@link writeOwnerOnly} makes the same check as its own first act, but by
 * then a caller that had to create the destination directory has already
 * mutated a caller-selected path to hand back a failed outcome. A refusal
 * must leave nothing behind, so the entry points in `node-io.ts` call this
 * before their `mkdir` and the module keeps its own guard as the contract.
 *
 * @throws OwnerOnlyUnavailableError on `win32`.
 */
export function assertOwnerOnlyEstablishable(platform: NodeJS.Platform): void {
  if (platform === 'win32') {
    throw new OwnerOnlyUnavailableError(platform);
  }
}

/** A temporary sibling name that no other writer will create first. */
function temporaryNameFor(filePath: string): string {
  const stamp = `${String(process.pid)}-${Date.now().toString(36)}-${randomBytes(4).toString('hex')}`;
  return join(dirname(filePath), `.${basename(filePath)}.${stamp}.tmp`);
}

/**
 * Tighten the descriptor to owner-only and VERIFY it, so the guarantee rests on
 * what the filesystem reports rather than on `fchmod` returning without error.
 *
 * TWO READINGS, because one proves less than it appears to. A mount that
 * carries no permission bits of its own can still REPORT them: a CIFS/SMB
 * mount without Unix extensions synthesises every file's mode from the
 * `file_mode=` mount option, so `file_mode=0600` answers 0600 to any reading
 * while `fchmod` changes nothing and the server-side ACL — or a shared mount
 * credential — still lets another principal read the file. Reading 0600 back
 * on such a mount is the false claim this verification exists to refuse, so
 * the descriptor is first moved to a DIFFERENT mode and read: a filesystem
 * that reports the probe value is one whose mode bits track `fchmod`, and
 * only there does the 0600 reading that follows mean anything. Both refusals
 * fire before any content lands.
 *
 * @throws OwnerOnlyModeNotEnforcedError when the probe does not round-trip.
 * @throws OwnerOnlyModeNotHeldError when the descriptor then reads any mode but 0600.
 */
function tightenToOwnerOnly(ops: OwnerOnlyWriteOps, handle: number): void {
  ops.fchmod(handle, MODE_HONOURED_PROBE);
  const probedMode = ops.fstat(handle);
  if ((probedMode & 0o777) !== MODE_HONOURED_PROBE) {
    throw new OwnerOnlyModeNotEnforcedError(probedMode);
  }
  ops.fchmod(handle, OWNER_ONLY_MODE);
  const observedMode = ops.fstat(handle);
  if ((observedMode & 0o777) !== OWNER_ONLY_MODE) {
    throw new OwnerOnlyModeNotHeldError(observedMode);
  }
}

/**
 * The ordered owner-only write; production callers omit `ops` and get the real
 * `node:fs` edge, and `platform` defaults to the running host.
 *
 * @throws OwnerOnlyUnavailableError on `win32`, before any file is touched.
 * @throws OwnerOnlyModeNotEnforcedError when the mount reports permission bits it
 * does not enforce, before any content lands.
 * @throws OwnerOnlyModeNotHeldError when the descriptor does not read 0600 after
 * the tightening, before any content lands.
 */
export function writeOwnerOnly(
  filePath: string,
  content: string,
  ops: OwnerOnlyWriteOps = nodeOwnerOnlyWriteOps,
  platform: NodeJS.Platform = process.platform,
): void {
  assertOwnerOnlyEstablishable(platform);
  const temporaryPath = temporaryNameFor(filePath);
  let handle: number | undefined;
  let created = false;
  try {
    handle = ops.open(temporaryPath, 'wx', OWNER_ONLY_MODE);
    created = true;
    tightenToOwnerOnly(ops, handle);
    ops.write(handle, content);
    ops.close(handle);
    handle = undefined;
    ops.rename(temporaryPath, filePath);
    created = false;
  } finally {
    if (handle !== undefined) {
      try {
        ops.close(handle);
      } catch {
        // Descriptor leak at worst — the true failure is already propagating.
      }
    }
    if (created) {
      try {
        ops.unlink(temporaryPath);
      } catch {
        // The temporary file is 0600 and empty or partial; the true failure propagates.
      }
    }
  }
}
