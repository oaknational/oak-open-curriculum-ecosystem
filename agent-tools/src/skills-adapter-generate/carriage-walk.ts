/**
 * Directory walks for skill carriage: enumerate a canonical skill's carried
 * files and a projection directory's actual contents, accumulating typed
 * read failures instead of throwing (ADR-088; the seam unions carry the
 * error channel). A failing branch stops descending — a walk that cannot
 * see a directory must say so rather than report the subset it could see.
 */
import { join } from 'node:path';

import type { CarriageReadFs } from './carriage-fs.js';

/**
 * The carried supporting-directory names (spec §optional-directories).
 * `evals/` is excluded by decision, not omission — see `carriage.ts`.
 */
const CARRIED_DIRECTORY_NAMES = ['assets', 'references', 'scripts'] as const;

const ADAPTER_ENTRY_FILENAME = 'SKILL.md';

/** Deterministic, locale-pinned path ordering for emission and reporting. */
export const byPath = (a: string, b: string): number => a.localeCompare(b, 'en');

/** One directory tree's observed contents, all paths base-relative. */
export interface WalkOutcome {
  /** Regular files, sorted. */
  readonly files: readonly string[];
  /** Non-regular entries (symlinks etc.), sorted. */
  readonly others: readonly string[];
  /** Seam read failures, as messages naming the failed path. */
  readonly failures: readonly string[];
}

interface WalkAccumulator {
  readonly files: string[];
  readonly others: string[];
  readonly failures: string[];
}

/**
 * Enumerate the canonical skill's carried files as projection-relative
 * paths (e.g. `references/family/architecture.md`). Only trees under
 * {@link CARRIED_DIRECTORY_NAMES} qualify; nesting is unbounded below a
 * carried root. Non-regular entries land in `others` for the caller to
 * refuse; read failures land in `failures`.
 */
async function walkCarriedTrees(canonicalDir: string, fs: CarriageReadFs): Promise<WalkOutcome> {
  const accumulator: WalkAccumulator = { files: [], others: [], failures: [] };
  // The carried ROOTS themselves must be real directories before anything
  // descends: `readdir` follows a symlinked `scripts`/`references`/`assets`,
  // so an unchecked join-and-walk would smuggle an external tree into every
  // projection with the checker green over it (security round, 2026-08-11).
  const canonicalEntries = await fs.listOtherEntryNames(canonicalDir);
  if (canonicalEntries.kind === 'failure') {
    accumulator.failures.push(canonicalEntries.message);
    return finishWalk(accumulator);
  }
  const nonRegularRoots = new Set(canonicalEntries.value);
  for (const directoryName of CARRIED_DIRECTORY_NAMES) {
    if (nonRegularRoots.has(directoryName)) {
      accumulator.others.push(directoryName);
      continue;
    }
    await walkUnder(join(canonicalDir, directoryName), directoryName, fs, accumulator);
  }
  return finishWalk(accumulator);
}

/**
 * Enumerate everything in the generated skill directory except its
 * top-level `SKILL.md`. This is the orphan-detection ground truth: the
 * projection holds exactly the entry file plus the carried set, and
 * anything else — including any symlink, whatever it points at — is a
 * copy without a source.
 */
export async function walkProjectionDir(
  adapterDir: string,
  fs: CarriageReadFs,
): Promise<WalkOutcome> {
  const accumulator: WalkAccumulator = { files: [], others: [], failures: [] };
  const fileNames = await fs.listFileNames(adapterDir);
  if (fileNames.kind === 'failure') {
    accumulator.failures.push(fileNames.message);
  } else {
    for (const fileName of fileNames.value) {
      if (fileName !== ADAPTER_ENTRY_FILENAME) {
        accumulator.files.push(fileName);
      }
    }
  }
  const otherNames = await fs.listOtherEntryNames(adapterDir);
  if (otherNames.kind === 'failure') {
    accumulator.failures.push(otherNames.message);
  } else {
    accumulator.others.push(...otherNames.value);
  }
  const subdirectoryNames = await fs.listSubdirectoryNames(adapterDir);
  if (subdirectoryNames.kind === 'failure') {
    accumulator.failures.push(subdirectoryNames.message);
  } else {
    for (const directoryName of subdirectoryNames.value) {
      await walkUnder(join(adapterDir, directoryName), directoryName, fs, accumulator);
    }
  }
  return finishWalk(accumulator);
}

async function walkUnder(
  absoluteDir: string,
  relativeDir: string,
  fs: CarriageReadFs,
  accumulator: WalkAccumulator,
): Promise<void> {
  const otherNames = await fs.listOtherEntryNames(absoluteDir);
  if (otherNames.kind === 'failure') {
    accumulator.failures.push(otherNames.message);
    return;
  }
  for (const entryName of otherNames.value) {
    accumulator.others.push(`${relativeDir}/${entryName}`);
  }
  const fileNames = await fs.listFileNames(absoluteDir);
  if (fileNames.kind === 'failure') {
    accumulator.failures.push(fileNames.message);
    return;
  }
  for (const fileName of fileNames.value) {
    accumulator.files.push(`${relativeDir}/${fileName}`);
  }
  const subdirectoryNames = await fs.listSubdirectoryNames(absoluteDir);
  if (subdirectoryNames.kind === 'failure') {
    accumulator.failures.push(subdirectoryNames.message);
    return;
  }
  for (const childName of subdirectoryNames.value) {
    await walkUnder(join(absoluteDir, childName), `${relativeDir}/${childName}`, fs, accumulator);
  }
}

/** The canonical carried set, or the refusals that make it unusable. */
export interface CarriedSet {
  /** Projection-relative carried file paths, sorted. */
  readonly files: readonly string[];
  /** Refusal messages: canonical symlinks and seam read failures. */
  readonly refused: readonly string[];
}

/**
 * Enumerate the canonical skill's carried files. A non-regular entry
 * anywhere under a carried root is a refusal, not a carried file —
 * following the link would smuggle content from outside the canonical
 * into every projection, and copying the link itself cannot be
 * byte-stable. Cure at the canonical, never here.
 */
export async function collectCarriedFiles(
  canonicalDir: string,
  fs: CarriageReadFs,
): Promise<CarriedSet> {
  const walk = await walkCarriedTrees(canonicalDir, fs);
  return {
    files: walk.files,
    refused: [
      ...walk.others.map(
        (relativePath) =>
          `canonical carried tree contains a symlink or other non-regular entry: ` +
          `${join(canonicalDir, relativePath)} — carriage refuses to follow links; ` +
          `replace it with a regular file or directory`,
      ),
      ...walk.failures,
    ].sort(byPath),
  };
}

/** How many carried files the canonical declares (refusals count zero). */
export async function countCarriedFiles(canonicalDir: string, fs: CarriageReadFs): Promise<number> {
  return (await collectCarriedFiles(canonicalDir, fs)).files.length;
}

function finishWalk(accumulator: WalkAccumulator): WalkOutcome {
  return {
    files: [...accumulator.files].sort(byPath),
    others: [...accumulator.others].sort(byPath),
    failures: [...accumulator.failures].sort(byPath),
  };
}
