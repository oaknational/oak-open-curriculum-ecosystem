/**
 * Jurisdiction guard on emission and drift-check targets.
 *
 * Recognition is content-based, but emission is NAME-addressed: the
 * generator derives the target directory from the prefix and canonical
 * id, so without a gate it would write into (or a checker would
 * adjudicate) whatever currently occupies that name — including a
 * Vendor-class entry or a symlink whose target may sit outside the
 * repository (probe-verified regression, review round 1: a symlink named
 * `<prefix><id>` was written through and its external target partially
 * pruned). This module closes that channel: a name-addressed operation
 * may proceed only when the target is provably OURS to occupy.
 *
 * States: `absent` (nothing at the name — free to create), `ours` (a
 * real directory whose regular-file `SKILL.md` parses as our stub —
 * ours to overwrite), `foreign` (anything else: a symlink or special
 * entry at the name, a directory without a recognisable stub, or a
 * symlinked `SKILL.md` — never written, never adjudicated; the caller
 * refuses the skill loudly). A classification read failure is a
 * failure, never a guess.
 */
import { join } from 'node:path';

import { parseAdapterStubPointer } from './adapter-stub.js';
import type { CarriageReadFs, FsRead } from './carriage-fs.js';

export type EmissionTargetState = 'absent' | 'ours' | 'foreign';

/**
 * Classify the directory a name-addressed emission or check is about to
 * act on. Never follows symlinks: the directory and its `SKILL.md` are
 * both kind-checked via `entryKind` (lstat) before any content read.
 */
export async function classifyEmissionTarget(
  targetDir: string,
  fs: CarriageReadFs,
): Promise<FsRead<EmissionTargetState>> {
  const directoryKind = await fs.entryKind(targetDir);
  if (directoryKind.kind === 'failure') {
    return directoryKind;
  }
  if (directoryKind.value === 'absent') {
    return { kind: 'ok', value: 'absent' };
  }
  if (directoryKind.value !== 'directory') {
    return { kind: 'ok', value: 'foreign' };
  }
  return classifyOccupantStub(join(targetDir, 'SKILL.md'), fs);
}

/** Classify a real directory's occupancy by its stub: ours iff the
 * regular-file `SKILL.md` parses as our stub — never read through a
 * symlinked stub. */
async function classifyOccupantStub(
  stubPath: string,
  fs: CarriageReadFs,
): Promise<FsRead<EmissionTargetState>> {
  const stubKind = await fs.entryKind(stubPath);
  if (stubKind.kind === 'failure') {
    return stubKind;
  }
  if (stubKind.value !== 'file') {
    return { kind: 'ok', value: 'foreign' };
  }
  const stubBytes = await fs.readFileBytesOrUndefined(stubPath);
  if (stubBytes.kind === 'failure') {
    return stubBytes;
  }
  const content = stubBytes.value === undefined ? '' : new TextDecoder().decode(stubBytes.value);
  return {
    kind: 'ok',
    value: parseAdapterStubPointer(content) === undefined ? 'foreign' : 'ours',
  };
}

/** The refusal message for a `foreign` target — shared by generator and
 * checker so the two surfaces report the state identically. */
export function foreignTargetRefusal(targetDir: string): string {
  return (
    `expected projection name is occupied by content not recognisably ours: ${targetDir} — ` +
    `refusing to write or adjudicate through it (a symlink, a foreign entry, or an ` +
    `unrecognisable stub at a Practice projection name); rename one side before regenerating`
  );
}
