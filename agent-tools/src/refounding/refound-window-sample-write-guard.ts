import { lstatSync, mkdirSync, realpathSync, type Stats } from 'node:fs';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { nearestExistingAncestor } from '../core/flag-path-resolve.js';

/**
 * The write-time TOCTOU guard for `refound-window-sample`. The `--out`
 * directory is canonicalised BEFORE the potentially long universe scan, so an
 * ancestor replaced with a symlink between that canonicalisation and the
 * manifest write could redirect the temp-write/rename outside the repository.
 *
 * The out dir need not exist yet (the write phase creates it, per
 * `core/flag-path-resolve.ts`), so the baseline is captured from the NEAREST
 * EXISTING ANCESTOR of the out dir — the deepest path that can be canonicalised
 * before the scan. The write boundary re-canonicalises that same ancestor and
 * refuses on any drift from the baseline (an ancestor was swapped) or any
 * escape of the repository root; the absent trailing segments are then created
 * under the validated anchor. Every refusal returns `Err` before a single byte
 * is written.
 *
 * @packageDocumentation
 */

/** The out dir write target, carrying its pre-scan anchor baselines. */
export interface ManifestWriteTarget {
  /** Canonical repository root (`realpathSync`) — the containment base. */
  readonly repoRootReal: string;
  /** The lexically resolved out dir the manifest is written under. */
  readonly outDirAbs: string;
  /** Nearest ancestor of the out dir that existed before the scan. */
  readonly anchorAbs: string;
  /** Canonical path of {@link anchorAbs} captured before the scan (baseline). */
  readonly expectedAnchorReal: string;
  /** Out-dir segments below {@link anchorAbs} the write phase must create. */
  readonly absentSegments: string;
}

/**
 * Refuse a PRE-EXISTING symlink anywhere on the existing chain from the
 * repository root down to (and including) the nearest existing ancestor. A
 * symlink that resolves INSIDE the repo would leave `realpathSync` recording
 * its target as the baseline, the drift and containment rechecks seeing no
 * change, and the write landing THROUGH the link — the exact bypass of the
 * symlinked-write-dir refusal. The repo root is the trusted base and is not
 * itself checked (its own symlinks, e.g. macOS `/var`, are the repo's real
 * location).
 */
function refuseSymlinkInAncestorChain(
  repoRoot: string,
  anchorAbs: string,
): Result<undefined, Error> {
  const relative = path.relative(repoRoot, anchorAbs);
  const segments = relative === '' || relative.startsWith('..') ? [] : relative.split(path.sep);
  let current = repoRoot;
  for (const segment of segments) {
    current = path.join(current, segment);
    if (lstatSync(current, { throwIfNoEntry: false })?.isSymbolicLink() === true) {
      return err(
        new Error(
          `out dir ancestor '${current}' is a pre-existing symlink — a write would follow it ` +
            'outside a verified real-directory chain; refusing',
        ),
      );
    }
  }
  return ok(undefined);
}

/**
 * Canonicalise the out dir's nearest existing ancestor and the repository root
 * before the scan, capturing the baselines {@link recheckOutDirContainment}
 * compares against at write time. Refuses a pre-existing symlink anywhere on
 * the existing ancestor chain ({@link refuseSymlinkInAncestorChain}); an
 * unresolvable ancestor refuses here rather than downstream.
 */
export function canonicaliseOutDir(
  repoRoot: string,
  outDirAbs: string,
): Result<ManifestWriteTarget, Error> {
  const anchorAbs = nearestExistingAncestor(outDirAbs);
  try {
    const chain = refuseSymlinkInAncestorChain(repoRoot, anchorAbs);
    if (isErr(chain)) {
      return chain;
    }
    return ok({
      repoRootReal: realpathSync(repoRoot),
      outDirAbs,
      anchorAbs,
      expectedAnchorReal: realpathSync(anchorAbs),
      absentSegments: path.relative(anchorAbs, outDirAbs),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot canonicalise out dir '${outDirAbs}': ${message}`));
  }
}

/**
 * Re-canonicalise the out dir's anchor immediately before the write and halt if
 * its canonical path drifted from the pre-scan baseline (an ancestor was
 * swapped for a symlink) or now sits outside the repository root. Runs before
 * any bytes are written, so a swap during the scan escapes nothing.
 */
export function recheckOutDirContainment(target: ManifestWriteTarget): Result<undefined, Error> {
  if (path.join(target.anchorAbs, target.absentSegments) !== target.outDirAbs) {
    return err(
      new Error(
        `incoherent write target: anchor '${target.anchorAbs}' plus '${target.absentSegments}' ` +
          `is not the out dir '${target.outDirAbs}'; refusing`,
      ),
    );
  }
  let anchorReal: string;
  try {
    anchorReal = realpathSync(target.anchorAbs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(
      new Error(`cannot re-canonicalise out dir anchor '${target.anchorAbs}': ${message}`),
    );
  }
  if (anchorReal !== target.expectedAnchorReal) {
    return err(
      new Error(
        `out dir anchor '${target.anchorAbs}' re-canonicalised to '${anchorReal}', differing from ` +
          `the pre-scan '${target.expectedAnchorReal}' — an ancestor was swapped; refusing`,
      ),
    );
  }
  const { repoRootReal } = target;
  if (anchorReal !== repoRootReal && !anchorReal.startsWith(`${repoRootReal}${path.sep}`)) {
    return err(
      new Error(
        `out dir '${target.outDirAbs}' resolves outside the repository root '${repoRootReal}'; ` +
          'refusing',
      ),
    );
  }
  return ok(undefined);
}

/**
 * Create every path segment from the validated {@link ManifestWriteTarget.anchorAbs}
 * down to `writeDirAbs`, ONE AT A TIME, proving each is a real directory
 * immediately after creation (check-time == use-time). A recursive `mkdir`
 * would silently FOLLOW a symlink planted at any absent segment during the
 * scan and land the write outside the repository; creating with
 * failure-on-exist semantics (`mkdirSync` without `recursive`) and `lstat`-ing
 * each created or pre-existing segment refuses a planted link at any depth
 * before a single byte is written. `anchorAbs` is already drift- and
 * containment-checked by {@link recheckOutDirContainment}.
 */
export function createWriteDirSegments(
  target: ManifestWriteTarget,
  writeDirAbs: string,
): Result<undefined, Error> {
  const relative = path.relative(target.anchorAbs, writeDirAbs);
  const segments = relative === '' ? [] : relative.split(path.sep);
  let current = target.anchorAbs;
  for (const segment of segments) {
    current = path.join(current, segment);
    const step = createRealDirSegment(current);
    if (isErr(step)) {
      return step;
    }
  }
  return ok(undefined);
}

/** True when a caught value is a Node `EEXIST` error. */
function isEexist(cause: unknown): boolean {
  return cause instanceof Error && 'code' in cause && cause.code === 'EEXIST';
}

/** Convert a throwing filesystem probe/write into a typed write-boundary Err. */
function writeFailed(cause: unknown): Result<undefined, Error> {
  const message = cause instanceof Error ? cause.message : String(cause);
  return err(new Error(`window-sample artefact write failed: ${message}`));
}

/**
 * Create a single directory segment with failure-on-exist semantics and prove
 * it is a real directory. `EEXIST` is not accepted on trust: `lstat` must show
 * a real directory (never a symlink — `mkdir` on a symlink-to-dir would succeed
 * silently via `EEXIST`), else the segment is refused. The `lstat` probe is
 * itself wrapped: an EACCES/ENOTDIR or a mkdir/lstat race returns `Err`, never
 * a thrown rejection across the Result boundary.
 */
function createRealDirSegment(dirAbs: string): Result<undefined, Error> {
  try {
    mkdirSync(dirAbs);
  } catch (error: unknown) {
    if (!isEexist(error)) {
      return writeFailed(error);
    }
  }
  let stat: Stats | undefined;
  try {
    stat = lstatSync(dirAbs, { throwIfNoEntry: false });
  } catch (error: unknown) {
    return writeFailed(error);
  }
  if (!stat?.isDirectory()) {
    return err(
      new Error(
        `write path segment '${dirAbs}' is not a real directory — a planted symlink or ` +
          'non-directory would redirect the write; refusing',
      ),
    );
  }
  return ok(undefined);
}
