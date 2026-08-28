/**
 * The identity-pack tier's filesystem reader — the I/O counterpart of the
 * pure `checkIdentityPackTier` policy in `boundary-inventory.ts`. Promoted
 * from `scripts/validate-boundaries.ts` (ADR-168 §5: a script complex
 * enough to need tests promotes its logic into `src/`), with the
 * filesystem injected (ADR-078) so the reader's boundary behaviour —
 * notably that symbolic links are refused by KIND and never dereferenced —
 * is provable with a fake.
 */
import { join } from 'node:path';

import type { IdentityPackTierEntry, IdentityPackTierReading } from './boundary-inventory.js';

/** One directory entry as the reader classifies it — the lstat-semantics
 *  facts of the entry ITSELF, never its target: a symlink reports
 *  `isSymbolicLink` and NEITHER `isDirectory` nor `isFile`, exactly as
 *  Node's `Dirent` reports an unfollowed link. */
export interface TierDirent {
  readonly name: string;
  readonly isDirectory: boolean;
  readonly isFile: boolean;
  readonly isSymbolicLink: boolean;
}

/** The kind standing at a path, by lstat semantics — the link itself,
 *  never its target. */
export type TierPathKind = 'directory' | 'file' | 'symlink' | 'absent';

/** The filesystem surface the reader consumes. `classifyPath` must carry
 *  lstat semantics (Node: `lstatSync`) — an exists/stat pair follows
 *  links, which is how a symlinked tier path validated its target;
 *  `readDir` must carry unfollowed-link Dirent semantics; `readTextFile`
 *  is only ever called for paths the inventory proved to be REGULAR
 *  files, so an adapter needs no lstat guard. */
export interface TierFileSystem {
  readonly classifyPath: (path: string) => TierPathKind;
  readonly readDir: (path: string) => readonly TierDirent[];
  readonly readTextFile: (path: string) => string;
}

/** Root files the tier admits beside its packs. Enumerated, never
 *  pattern-matched — anything else at the root is a stray the policy
 *  refuses, because it would sit outside every pack's anatomy and
 *  validation surface. */
const ADMITTED_TIER_ROOT_FILES: ReadonlySet<string> = new Set(['README.md']);

/**
 * A transient local artefact, matched by name AND kind. Enumerated, never
 * pattern-matched — a blanket dot-entry skip would hide committed content
 * (`.npmrc`, an `.eslintrc.json`, a hidden source directory) from the
 * refusals — and kind-bound, because a name-only exemption lets a SYMLINK
 * wearing a transient name ride out of the symlink refusals, and a
 * `.DS_Store` DIRECTORY hide committed contents: `node_modules` and
 * `.turbo` are transient only as directories, `.DS_Store` only as a
 * regular file; any other kind under these names faces validation.
 */
function isTransientEntry(entry: TierDirent): boolean {
  if (entry.name === '.DS_Store') {
    return entry.isFile;
  }
  return (entry.name === 'node_modules' || entry.name === '.turbo') && entry.isDirectory;
}

/**
 * Pack-relative paths of every file and every symbolic link under packDir
 * (transient artefacts above excluded) — the input the pure anatomy check
 * enforces the data-only invariant over. Symlinks are LISTED, not
 * followed: a link is neither a directory nor a regular file, and
 * silently omitting it would let a pack carry linked source or an asset
 * link escaping the pack while reading well-shaped.
 */
export function listPackFiles(
  fileSystem: TierFileSystem,
  packDir: string,
): { files: string[]; symlinks: string[] } {
  const files: string[] = [];
  const symlinks: string[] = [];
  const walk = (dir: string, prefix: string): void => {
    for (const entry of fileSystem.readDir(dir)) {
      if (isTransientEntry(entry)) {
        continue;
      }
      const relativePath = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
      if (entry.isSymbolicLink) {
        symlinks.push(relativePath);
      } else if (entry.isDirectory) {
        walk(join(dir, entry.name), relativePath);
      } else if (entry.isFile) {
        files.push(relativePath);
      }
    }
  };
  walk(packDir, '');

  return { files, symlinks };
}

/**
 * Read the identity-pack tier into the policy's input shape. The
 * boundary facts load-bearing here, top down:
 *
 * - The tier PATH is classified by lstat semantics before any read — a
 *   symlinked tier path would have its target validated, so the kind is
 *   refused outright.
 * - A tier child that is itself a symbolic link becomes a
 *   `selfIsSymlink` entry, refused by KIND without inspection — an
 *   unfollowed directory-symlink reports `isSymbolicLink` and NOT
 *   `isDirectory`, so a directories-only filter would silently drop the
 *   pack from validation entirely.
 * - Root files beyond the enumerated admissions are STRAYS the policy
 *   refuses — a silently ignored root file would sit outside every
 *   pack's anatomy and validation surface.
 * - Manifest presence derives from the NON-dereferencing inventory, not
 *   from an `exists`/read pair that follows links: a symlinked
 *   `package.json` sits in `symlinks` (refused by kind) with the manifest
 *   reported absent, and its target is never read.
 */
export function readIdentityPackTier(
  fileSystem: TierFileSystem,
  tierDir: string,
): IdentityPackTierReading {
  const tierKind = fileSystem.classifyPath(tierDir);
  if (tierKind === 'absent') {
    return { tierState: 'missing', strayRootEntries: [], entries: [] };
  }
  // Refused by KIND before any read: a symlinked (or file) tier path
  // would have its TARGET validated by the readDir below, which is the
  // dereference the boundary exists to refuse.
  if (tierKind !== 'directory') {
    return { tierState: 'wrong-kind', strayRootEntries: [], entries: [] };
  }

  // Only the enumerated transients are skipped — a blanket dot-name skip
  // would exempt a committed hidden directory (or symlink) from the
  // boundary entirely, the same hidden-content bypass listPackFiles
  // refuses at pack level.
  const children = fileSystem.readDir(tierDir).filter((entry) => !isTransientEntry(entry));

  const strayRootEntries = children
    .filter(
      (entry) =>
        (entry.isFile && !ADMITTED_TIER_ROOT_FILES.has(entry.name)) ||
        (!entry.isFile && !entry.isDirectory && !entry.isSymbolicLink),
    )
    .map((entry) => entry.name);

  const entries = children.flatMap((entry): IdentityPackTierEntry[] => {
    if (entry.isSymbolicLink) {
      return [
        {
          directoryName: entry.name,
          packageJson: undefined,
          files: [],
          symlinks: [],
          selfIsSymlink: true,
        },
      ];
    }
    if (!entry.isDirectory) {
      return [];
    }

    const packDir = join(tierDir, entry.name);
    const { files, symlinks } = listPackFiles(fileSystem, packDir);

    if (!files.includes('package.json')) {
      return [{ directoryName: entry.name, packageJson: undefined, files, symlinks }];
    }

    // The read sits OUTSIDE the parse try: an I/O failure (EACCES, a
    // deletion race) on a file the inventory just listed is an
    // environment fault that propagates loudly — branding the pack
    // "could not be parsed" would misreport the phase.
    const manifestText = fileSystem.readTextFile(join(packDir, 'package.json'));
    try {
      const packageJson: unknown = JSON.parse(manifestText);

      return [{ directoryName: entry.name, packageJson, files, symlinks }];
    } catch (error) {
      return [
        {
          directoryName: entry.name,
          packageJson: undefined,
          files,
          symlinks,
          parseFailure: error instanceof Error ? error.message : String(error),
        },
      ];
    }
  });

  return { tierState: 'present', strayRootEntries, entries };
}
