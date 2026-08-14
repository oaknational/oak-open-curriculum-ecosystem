/**
 * Class-scoped reconciliation of the projection roots.
 *
 * Per-skill carriage only ever visits currently discovered canonicals, so a
 * deleted or renamed canonical would leave its complete old projection
 * directory live — stale `SKILL.md`, carried files and all — while both
 * checker and generator stayed green (review round 3, 2026-08-11). This
 * module closes that hole for the PRACTICE CLASS ONLY: an entry under
 * `.claude/skills/` or `.agents/skills/` is adjudicated iff its `SKILL.md`
 * carries the class marker recording its derivation from `.agent/skills/`
 * (see `adapter-stub.ts`) — only our own emission writes such a stub. A
 * recognised entry is stale when its recorded canonical is no longer
 * discovered, or when its name is not the canonical's current projection
 * name (a canonical rename or a prefix migration). The checker reports
 * stale entries; a generator run removes them.
 *
 * Everything else is out of jurisdiction: Vendor-class skills (installed
 * and managed by the external skills machinery, `pnpx skills`, as real
 * directories or symlinks) and any other foreign entry are never
 * adjudicated, reported, or removed. Names are NEVER the discriminator —
 * the generation prefix is a configurable naming parameter, not a class
 * boundary, and a foreign skill whose name happens to share it stays
 * untouched. Symlinked entries are never ours by construction (emission
 * writes only real directories) and are never read through — at the
 * directory level (dirent-kind listing) AND at the stub level (the
 * classification read is lstat-gated, so a symlinked `SKILL.md` inside a
 * foreign directory cannot borrow a genuine stub's content). Our
 * validation governs our own system only (testing-strategy.md: never test
 * external functionality that is not under our control; the skill-class
 * taxonomy lives in ADR-125).
 *
 * An absent surface root is fine (nothing to reconcile); any other listing
 * or classification read failure lands in `failures`, because reading a
 * failure as "empty" would certify or delete over a surface that was never
 * actually observed. Two deliberate bounds: a stray regular FILE at a
 * surface root is outside this sweep's contract, and a directory with no
 * readable-as-ours `SKILL.md` (including our own projection residue that
 * lost its stub) is left in place — never deleting what cannot be proven
 * ours is the fail-safe direction.
 */
import { join } from 'node:path';

import { parseAdapterStubPointer } from './adapter-stub.js';
import { realCarriageWriteFs, type CarriageReadFs, type FsRead } from './carriage-fs.js';
import { byPath } from './carriage-walk.js';
import { PROJECTION_SURFACE_ROOTS, surfaceRootGuardFailure } from './surface-roots.js';

/** The shared checker/generator completeness contract: reconciliation and
 * emission may act only when discovery saw the WHOLE canonical estate — a
 * skipped directory or an empty set means an unreadable canonical or
 * skills root read as absent, and acting on the partial set deletes or
 * overwrites legitimate projections. */
export function isDiscoveryComplete(discovery: {
  readonly skipped: readonly string[];
  readonly canonicals: readonly unknown[];
}): boolean {
  return discovery.skipped.length === 0 && discovery.canonicals.length > 0;
}

/** The sweep's finding streams — `failures` non-empty means `stale` is
 * not a complete verdict and nothing may act on it. */
export interface ProjectionRootSweep {
  readonly stale: readonly string[];
  readonly failures: readonly string[];
}

/**
 * One discovered canonical's identity at the projection roots: the class
 * marker its stub records (`canonicalRef`, relative to `.agent/skills/`)
 * and the directory name its projection must carry today.
 */
export interface ProjectionIdentity {
  readonly canonicalRef: string;
  readonly expectedName: string;
}

/**
 * Enumerate stale Practice projections: directories whose `SKILL.md`
 * carries the class marker but whose recorded canonical is no longer
 * discovered, or whose name is not that canonical's current projection
 * name. Entries without the marker are not ours and are never
 * enumerated.
 */
export async function findStaleProjectionEntries(input: {
  readonly repoRoot: string;
  readonly projections: readonly ProjectionIdentity[];
  readonly fs: CarriageReadFs;
}): Promise<ProjectionRootSweep> {
  const expectedByRef = new Map(
    input.projections.map((entry) => [entry.canonicalRef, entry.expectedName]),
  );
  const stale: string[] = [];
  const failures: string[] = [];
  const repoReal = await input.fs.resolveRealPath(input.repoRoot);
  for (const surface of PROJECTION_SURFACE_ROOTS) {
    const root = join(input.repoRoot, surface);
    const guardFailure = await surfaceRootGuardFailure({
      root,
      surface,
      repoReal,
      resolveRealPath: (path) => input.fs.resolveRealPath(path),
    });
    if (guardFailure !== undefined) {
      failures.push(guardFailure);
      continue;
    }
    await sweepSurfaceRoot({ root, expectedByRef, fs: input.fs, stale, failures });
  }
  return { stale: stale.toSorted(byPath), failures: failures.toSorted(byPath) };
}

interface SweepOutcome {
  readonly pruned: readonly string[];
  /** Non-empty means the whole run refuses before any removal. */
  readonly refusedRun: readonly string[];
}

/**
 * Remove stale projection-root entries. Runs ONLY when
 * `discoveryComplete` is true: a skipped directory or an empty canonical
 * set means the expected-projection set is not fully known (an unreadable
 * canonical or skills root reads as absent to discovery), and sweeping
 * against a partial set would delete legitimate projections — the exact
 * destructive-under-partial-observation shape this round cures. A sweep
 * read failure refuses the run before any removal.
 */
export async function sweepStaleProjections(input: {
  readonly repoRoot: string;
  readonly projections: readonly ProjectionIdentity[];
  readonly discoveryComplete: boolean;
}): Promise<SweepOutcome> {
  if (!input.discoveryComplete) {
    return { pruned: [], refusedRun: [] };
  }
  const sweep = await findStaleProjectionEntries({
    repoRoot: input.repoRoot,
    projections: input.projections,
    fs: realCarriageWriteFs,
  });
  if (sweep.failures.length > 0) {
    return { pruned: [], refusedRun: sweep.failures };
  }
  const pruned: string[] = [];
  for (const entryPath of sweep.stale) {
    await realCarriageWriteFs.removeEntryRecursive(entryPath);
    pruned.push(entryPath);
  }
  return { pruned, refusedRun: [] };
}

async function sweepSurfaceRoot(input: {
  readonly root: string;
  readonly expectedByRef: ReadonlyMap<string, string>;
  readonly fs: CarriageReadFs;
  readonly stale: string[];
  readonly failures: string[];
}): Promise<void> {
  // Only real directories are candidates: `listSubdirectoryNames` classifies
  // by dirent kind, so a symlinked entry never reaches the stub read below —
  // nothing is ever read (or later removed) through a link.
  const subdirectoryNames = await input.fs.listSubdirectoryNames(input.root);
  if (subdirectoryNames.kind === 'failure') {
    input.failures.push(subdirectoryNames.message);
    return;
  }
  for (const name of subdirectoryNames.value) {
    const verdict = await classifyEntry(join(input.root, name), input.fs);
    if (verdict.kind === 'failure') {
      // An unclassifiable entry means no verdict either way; certifying
      // or deleting over it would act on an unobserved surface.
      input.failures.push(verdict.message);
    } else if (verdict.value !== undefined && input.expectedByRef.get(verdict.value) !== name) {
      input.stale.push(join(input.root, name));
    }
  }
}

/** The entry's recorded canonicalRef when it is recognisably ours, or
 * `undefined` when out of jurisdiction. Kind first, then content: a
 * symlinked SKILL.md inside a foreign real directory is never read
 * through to classify the directory as ours (its target could be one of
 * our genuine stubs). */
async function classifyEntry(
  entryDir: string,
  fs: CarriageReadFs,
): Promise<FsRead<string | undefined>> {
  const stubPath = join(entryDir, 'SKILL.md');
  const stubKind = await fs.entryKind(stubPath);
  if (stubKind.kind === 'failure') {
    return stubKind;
  }
  if (stubKind.value !== 'file') {
    return { kind: 'ok', value: undefined };
  }
  const stubRead = await fs.readFileBytesOrUndefined(stubPath);
  if (stubRead.kind === 'failure') {
    return stubRead;
  }
  if (stubRead.value === undefined) {
    return { kind: 'ok', value: undefined };
  }
  return { kind: 'ok', value: parseAdapterStubPointer(new TextDecoder().decode(stubRead.value)) };
}
