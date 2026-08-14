/**
 * Supporting-directory carriage for skill projections.
 *
 * A canonical skill may carry supporting directories per the agent-skills
 * spec's optional-directory set — `scripts/`, `references/`, `assets/` —
 * and the projection surfaces must serve them byte-stably beside each
 * generated `SKILL.md`, or the projected skill silently loses the substance
 * its entry file points at. `evals/` is deliberately NOT carried: evals are
 * development/QA artifacts, not runtime skill content (skill-standard-pilot
 * plan, carriage decision). Empty directories are omitted, never
 * scaffolded — carriage moves files, and a directory exists in a projection
 * only because a carried file lives in it.
 *
 * The generated skill directory is generator-owned in whole, so any file in
 * it beyond the generated `SKILL.md` and the expected carried set is an
 * orphan: a copy whose canonical source is gone. The checker reports
 * orphans; a generator run prunes them. Three hardening postures from
 * review round 3 (2026-08-11): a canonical-side symlink is a REFUSAL
 * (carrying through one would smuggle external content into every
 * projection); a projection-side symlink is an orphan pruned as the LINK,
 * never the target; and any seam read failure refuses the whole skill's
 * sync BEFORE destructive reconciliation — verdicts and pruning never run
 * over a tree that was only partially observed. Pruning runs before
 * copying, so a canonical file↔directory shape change never collides with
 * its stale projected counterpart.
 *
 * I/O is injected through the {@link CarriageReadFs}/{@link CarriageWriteFs}
 * seams (defined with their real-filesystem adapters in `carriage-fs.ts`),
 * so unit tests run on deterministic in-memory maps.
 */
import { join } from 'node:path';

import type { CarriageReadFs, CarriageWriteFs } from './carriage-fs.js';
import { compareCarriedFile } from './carriage-compare.js';
import {
  byPath,
  collectCarriedFiles,
  walkProjectionDir,
  type WalkOutcome,
} from './carriage-walk.js';

export {
  realCarriageReadFs,
  realCarriageWriteFs,
  type CarriageReadFs,
  type CarriageWriteFs,
  type FsRead,
} from './carriage-fs.js';
export { collectCarriedFiles, countCarriedFiles } from './carriage-walk.js';

/** Read-only carriage verdict for one skill on one projection surface. */
export interface CarriageCheck {
  /** Expected carried files absent from the projection (absolute paths). */
  readonly missing: readonly string[];
  /** Carried files whose projection bytes or executable mode differ. */
  readonly drifted: readonly string[];
  /** Projection entries whose canonical source is gone — including every
   * non-regular entry (a symlink is never a valid carried copy). */
  readonly orphaned: readonly string[];
  /** Refusals: canonical symlinks and seam read failures. Any entry here
   * means the other streams are not a complete verdict. */
  readonly refused: readonly string[];
  /** How many carried files the canonical declares for this skill. */
  readonly carriedCount: number;
}

/**
 * Compare one skill's carried set against one projection surface, bytewise
 * plus executable bit, and detect orphans. Read-only — the generator's
 * {@link syncCarriage} is the curing counterpart.
 */
export async function checkCarriage(
  canonicalDir: string,
  adapterDir: string,
  fs: CarriageReadFs,
): Promise<CarriageCheck> {
  const carried = await collectCarriedFiles(canonicalDir, fs);
  const projection = await walkProjectionDir(adapterDir, fs);
  const refused = [...carried.refused, ...projection.failures];
  const missing: string[] = [];
  const drifted: string[] = [];
  const otherSet = new Set(projection.others);

  for (const relativePath of carried.files) {
    if (otherSet.has(relativePath)) {
      continue; // already failing below as an orphaned non-regular entry
    }
    const verdict = await compareCarriedFile(canonicalDir, adapterDir, relativePath, fs);
    if (verdict.kind === 'refused') {
      refused.push(verdict.message);
    } else if (verdict.kind === 'missing') {
      missing.push(verdict.path);
    } else if (verdict.kind === 'drifted') {
      drifted.push(verdict.path);
    }
  }

  const carriedSet = new Set(carried.files);
  const orphaned = [
    ...projection.files.filter((relativePath) => !carriedSet.has(relativePath)),
    ...projection.others,
  ]
    .sort(byPath)
    .map((relativePath) => join(adapterDir, relativePath));

  return {
    missing,
    drifted,
    orphaned,
    refused: refused.toSorted(byPath),
    carriedCount: carried.files.length,
  };
}

/** Outcome of one skill/surface carriage sync (absolute paths). */
export interface SyncCarriageOutcome {
  readonly carried: readonly string[];
  readonly pruned: readonly string[];
  /** Refusals that stopped the sync BEFORE any destructive work. */
  readonly refused: readonly string[];
}

/**
 * Make one projection surface's carried set true for one skill. Any
 * refusal (canonical symlink, seam read failure) stops the whole sync
 * before a single write or prune — destructive reconciliation over a
 * partially observed tree is exactly how valid copies get deleted.
 * Otherwise, order is load-bearing: prune orphans and non-regular entries
 * FIRST, sweep the directories the pruning emptied, and only then copy —
 * so a canonical file↔directory shape change never collides with its
 * stale counterpart, and no copy can ever write through a projected
 * symlink.
 */
export async function syncCarriage(
  canonicalDir: string,
  adapterDir: string,
  fs: CarriageWriteFs,
): Promise<SyncCarriageOutcome> {
  const carried = await collectCarriedFiles(canonicalDir, fs);
  const projection = await walkProjectionDir(adapterDir, fs);
  const refused = [...carried.refused, ...projection.failures].sort(byPath);
  if (refused.length > 0) {
    return { carried: [], pruned: [], refused };
  }

  const pruned = await pruneProjectionEntries(adapterDir, projection, new Set(carried.files), fs);
  await removeEmptiedDirectories(adapterDir, fs);

  const copied: string[] = [];
  for (const relativePath of carried.files) {
    const targetPath = join(adapterDir, relativePath);
    await fs.copyFileWithParents(join(canonicalDir, relativePath), targetPath);
    copied.push(targetPath);
  }

  return { carried: copied, pruned, refused: [] };
}

/** Prune non-regular entries and orphaned files; returns the pruned paths. */
async function pruneProjectionEntries(
  adapterDir: string,
  projection: WalkOutcome,
  carriedSet: ReadonlySet<string>,
  fs: CarriageWriteFs,
): Promise<string[]> {
  const pruned: string[] = [];
  for (const relativePath of projection.others) {
    await fs.removeFile(join(adapterDir, relativePath));
    pruned.push(join(adapterDir, relativePath));
  }
  for (const relativePath of projection.files) {
    if (!carriedSet.has(relativePath)) {
      await fs.removeFile(join(adapterDir, relativePath));
      pruned.push(join(adapterDir, relativePath));
    }
  }
  return pruned;
}

/**
 * Bottom-up sweep removing directories the orphan pruning emptied. The
 * skill directory itself is never removed — it always holds `SKILL.md`.
 * A listing failure here is unreachable in practice (the projection walk
 * above just succeeded); an empty result simply ends the descent.
 */
async function removeEmptiedDirectories(adapterDir: string, fs: CarriageWriteFs): Promise<void> {
  for (const childName of await listSubdirectoriesOrNone(adapterDir, fs)) {
    await removeIfEmptyDeep(join(adapterDir, childName), fs);
  }
}

async function removeIfEmptyDeep(absoluteDir: string, fs: CarriageWriteFs): Promise<void> {
  for (const childName of await listSubdirectoriesOrNone(absoluteDir, fs)) {
    await removeIfEmptyDeep(join(absoluteDir, childName), fs);
  }
  await fs.removeDirectoryIfEmpty(absoluteDir);
}

async function listSubdirectoriesOrNone(
  path: string,
  fs: CarriageReadFs,
): Promise<readonly string[]> {
  const listed = await fs.listSubdirectoryNames(path);
  return listed.kind === 'ok' ? listed.value : [];
}
