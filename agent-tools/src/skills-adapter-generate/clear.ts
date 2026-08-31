/**
 * Class-scoped clearing of generated adapter directories.
 *
 * Split from `generator.ts`: clearing is the one destructive path in
 * the pipeline. Its jurisdiction is the Practice class only — real
 * directories whose `SKILL.md` carries the class marker recording a
 * derivation from `.agent/skills/` (see `adapter-stub.ts`). Everything
 * else (Vendor-class entries installed by the external skills
 * machinery, or any foreign entry, whatever its name) is out of scope
 * and never removed: our tooling clears only what our generation
 * re-creates, and membership is proven by content, never by name.
 */
import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

import { parseAdapterStubPointer } from './adapter-stub.js';
import { realCarriageReadFs, type FsRead } from './carriage-fs.js';
import { readRegularFileTextNoFollow } from './read-regular-file.js';
import { allSurfaceRootFailures, PROJECTION_SURFACE_ROOTS } from './surface-roots.js';

/**
 * Result of listing an adapter surface. A missing surface is `ok` with
 * no names (nothing to clear); any other filesystem failure is an
 * `error` — treating an unreadable surface as empty would let a clear
 * report success while stale directories remain.
 */
type ListSubdirectoryNamesResult =
  | { readonly kind: 'ok'; readonly names: readonly string[] }
  | { readonly kind: 'error'; readonly message: string };

/**
 * Result of reading a candidate entry's `SKILL.md`. `undefined` means
 * the file is absent — the entry is not ours and is skipped; any
 * failure other than absence is an `error` that aborts the clear (an
 * unclassifiable entry must never be silently kept OR removed).
 */
type ReadStubResult =
  | { readonly kind: 'ok'; readonly value: string | undefined }
  | { readonly kind: 'error'; readonly message: string };

/**
 * Result of {@link clearGeneratedAdapters}. The `ok` arm reports the
 * directories removed; the `error` arm carries the PARTIAL `removed` when a
 * mid-phase removal fails, so the one destructive pass in the pipeline stays
 * observable rather than silent — even when it fails part-way.
 */
export type ClearResult =
  | { readonly kind: 'ok'; readonly removed: readonly string[] }
  | { readonly kind: 'error'; readonly message: string; readonly removed?: readonly string[] };

/**
 * Filesystem seam for {@link clearGeneratedAdapters}, mirroring the
 * checker's injected-fs pattern so the destructive path is testable
 * without touching disk.
 */
export interface ClearFs {
  listSubdirectoryNames(path: string): Promise<ListSubdirectoryNamesResult>;
  readStubOrUndefined(path: string): Promise<ReadStubResult>;
  removeDirectory(path: string): Promise<void>;
  /** The path with every symlink resolved (nearest-existing-ancestor
   * semantics for an absent tail) — the surface-root guard's instrument
   * for refusing a symlinked root or ancestor before any removal. */
  resolveRealPath(path: string): Promise<FsRead<string>>;
}

/**
 * Classify a filesystem failure for the clear pass: only genuine
 * absence (ENOENT) reads as "nothing there" — any other failure
 * (EACCES, I/O error) must abort the clear rather than report success
 * over an unobserved surface. Exported pure so the contract is testable
 * without real filesystem IO.
 */
export function isMissingSurface(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && error.code === 'ENOENT';
}

/**
 * The real-filesystem {@link ClearFs}. Its error contract (absence →
 * empty/skip; anything else → error) lives in the exported pure
 * {@link isMissingSurface}, which carries the tests.
 */
const realClearFs: ClearFs = {
  async listSubdirectoryNames(path) {
    let dirents;
    try {
      dirents = await readdir(path, { withFileTypes: true });
    } catch (error: unknown) {
      if (isMissingSurface(error)) {
        return { kind: 'ok', names: [] };
      }
      return { kind: 'error', message: `cannot list ${path}: ${String(error)}` };
    }
    return {
      kind: 'ok',
      names: dirents.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name),
    };
  },
  async readStubOrUndefined(path) {
    // One fd-anchored read: the symlink-leaf check (a symlinked SKILL.md is
    // never ours — emission writes regular files only) and the read share a
    // single descriptor, so there is no lstat→readFile window a concurrent
    // racer can swap the target through (CodeQL js/file-system-race). A
    // symlinked stub — or anything else in the reader's documented absence
    // class — reads as undefined; any other failure aborts the clear rather
    // than silently keeping the entry.
    const read = await readRegularFileTextNoFollow(path);
    return read.kind === 'ok'
      ? { kind: 'ok', value: read.value }
      : { kind: 'error', message: read.message };
  },
  async removeDirectory(path) {
    await rm(path, { recursive: true, force: true });
  },
  resolveRealPath: (path) => realCarriageReadFs.resolveRealPath(path),
};

/** The collection half of the two-phase clear: a surface's marker-carrying
 * candidate directories, or the failure that aborts the whole run. */
type CollectResult =
  | { readonly kind: 'ok'; readonly candidates: readonly string[] }
  | { readonly kind: 'error'; readonly message: string };

/**
 * Remove Practice-projection directories under `.claude/skills/` and
 * `.agents/skills/` before a fresh generation pass — exactly the entries
 * whose `SKILL.md` carries the class marker, whatever their name (so a clear
 * also collects projections generated under a previous prefix). Entries
 * without the marker are out of jurisdiction and never touched.
 *
 * Two orderings make the one destructive path safe:
 *  - the surface-root guard runs FIRST, whole-run, before any read or `rm`: a
 *    symlinked root or ancestor (the committed shape of the estate's Vendor
 *    entries) would otherwise send the recursive removal into a foreign tree
 *    (channel security round 2, 2026-08-12);
 *  - classification is COMPLETE before any removal: every candidate across
 *    BOTH roots is collected first, and any list or classification failure
 *    aborts the whole run before a single `rm`, so a second-root read failure
 *    can never leave the first root half-cleared (review 2026-08-12, defect 3).
 *
 * The stub read is fd-anchored (`readRegularFileTextNoFollow`), so per-entry
 * classification carries no check→use race. An unreadable surface or stub, or
 * a failed root resolution, aborts with an error rather than guessing.
 * Idempotent.
 */
export async function clearGeneratedAdapters(
  repoRoot: string,
  fs: ClearFs = realClearFs,
): Promise<ClearResult> {
  const rootFailures = await allSurfaceRootFailures(repoRoot, (path) => fs.resolveRealPath(path));
  if (rootFailures.length > 0) {
    return { kind: 'error', message: rootFailures.join('; ') };
  }
  // Collection phase: classify every candidate across BOTH roots before any
  // removal, so a failure on the second root cannot strand a half-cleared
  // first root.
  const candidates: string[] = [];
  for (const surface of PROJECTION_SURFACE_ROOTS) {
    const collected = await collectSurfaceCandidates(join(repoRoot, surface), fs);
    if (collected.kind === 'error') {
      return collected;
    }
    candidates.push(...collected.candidates);
  }
  // Removal phase: only now, with the whole corpus classified, do we delete.
  // Each removal is recorded as it lands, so a mid-phase failure (a second
  // surface turning unwritable) returns the PARTIAL teardown rather than
  // aborting with no state — the one destructive path stays observable even
  // when it fails part-way (review 2026-08-12).
  const removed: string[] = [];
  for (const dir of candidates) {
    try {
      await fs.removeDirectory(dir);
    } catch (error: unknown) {
      return {
        kind: 'error',
        message: `removal failed at ${dir} after removing ${String(removed.length)} of ${String(candidates.length)}: ${String(error)}`,
        removed,
      };
    }
    removed.push(dir);
  }
  return { kind: 'ok', removed };
}

/** Classify a guarded surface's marker-carrying directories WITHOUT removing
 * them. An unlistable surface or an unclassifiable stub aborts the run (an
 * unreadable entry is never silently kept or removed). */
async function collectSurfaceCandidates(root: string, fs: ClearFs): Promise<CollectResult> {
  const listed = await fs.listSubdirectoryNames(root);
  if (listed.kind === 'error') {
    return listed;
  }
  const candidates: string[] = [];
  for (const name of listed.names) {
    const stub = await fs.readStubOrUndefined(join(root, name, 'SKILL.md'));
    if (stub.kind === 'error') {
      return stub;
    }
    if (stub.value !== undefined && parseAdapterStubPointer(stub.value) !== undefined) {
      candidates.push(join(root, name));
    }
  }
  return { kind: 'ok', candidates };
}
