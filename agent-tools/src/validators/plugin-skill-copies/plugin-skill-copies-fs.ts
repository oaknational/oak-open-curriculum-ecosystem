/**
 * The filesystem {@link SkillTreeReader} for the skill-copy validator.
 *
 * @remarks
 * Kept apart from the pure comparison so the comparison can be tested with
 * in-memory trees. The filesystem itself is injected as a small facade
 * (ADR-078) so this walker is unit-tested too: which directory it skips, how
 * deep it goes, what it counts as a file, and that a symlink is reported and
 * never followed are the decisions that determine what the gate sees, and a
 * regression in any of them would otherwise pass every test while the gate
 * reported clean.
 *
 * Only directory listings with entry types and file reads are used, so the
 * facade is a lookup over declared entries and needs no path resolution.
 *
 * @packageDocumentation
 */

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import type {
  SkillEntry,
  SkillRootListing,
  SkillTree,
  SkillTreeReader,
} from './plugin-skill-copies.js';

/** The subset of a directory entry the walker reads. */
export interface SkillDirectoryEntry {
  readonly name: string;
  isDirectory(): boolean;
  isFile(): boolean;
  isSymbolicLink(): boolean;
}

/** The subset of the filesystem the walker uses; `node:fs` satisfies it. */
export interface SkillFileSystem {
  /** The entries of a directory, or `undefined` when the path is not a readable directory. */
  readonly readDirectory: (directory: string) => readonly SkillDirectoryEntry[] | undefined;
  readonly readFile: (file: string) => Uint8Array;
}

/** The real filesystem. */
const nodeSkillFileSystem: SkillFileSystem = {
  readDirectory: (directory) => {
    try {
      return readdirSync(directory, { withFileTypes: true });
    } catch {
      // Not a readable directory here; the comparison reports the consequence
      // (missing skill, nothing shared) as a finding rather than a crash.
      return undefined;
    }
  },
  readFile: (file) => readFileSync(file),
};

/** The file a directory must hold to count as a skill (Agent Skills specification). */
const SKILL_MANIFEST = 'SKILL.md';

type EntryKind = 'directory' | 'file' | 'symlink' | 'other';

/** Classify an entry without following it: a symlink is a symlink whatever it points at. */
function entryKind(entry: SkillDirectoryEntry): EntryKind {
  if (entry.isSymbolicLink()) {
    return 'symlink';
  }
  if (entry.isDirectory()) {
    return 'directory';
  }
  return entry.isFile() ? 'file' : 'other';
}

/** Whether a directory holds a regular file named `SKILL.md`. */
function holdsSkillManifest(fs: SkillFileSystem, directory: string): boolean {
  const entries = fs.readDirectory(directory) ?? [];
  return entries.some((entry) => entry.name === SKILL_MANIFEST && entryKind(entry) === 'file');
}

/** List a root: its skill directories and any symlinked entries. */
function listRoot(fs: SkillFileSystem, root: string): SkillRootListing | undefined {
  const entries = fs.readDirectory(root);
  if (entries === undefined) {
    return undefined;
  }
  const skills = entries
    .filter((entry) => entryKind(entry) === 'directory')
    .filter((entry) => holdsSkillManifest(fs, path.join(root, entry.name)))
    .map((entry) => entry.name);
  const symlinks = entries
    .filter((entry) => entryKind(entry) === 'symlink')
    .map((entry) => entry.name);
  return { skills, symlinks };
}

interface WalkContext {
  readonly fs: SkillFileSystem;
  readonly ignoreDirs: readonly string[];
  readonly tree: Map<string, SkillEntry>;
}

/** Record one directory's entries into the tree, descending into subdirectories. */
function walkDirectory(context: WalkContext, current: string, prefix: string): void {
  for (const entry of context.fs.readDirectory(current) ?? []) {
    const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
    recordEntry(context, entry, path.join(current, entry.name), relative);
  }
}

/** Record one entry: descend into a directory (unless ignored at the top level), keep a file's bytes, note a symlink. */
function recordEntry(
  context: WalkContext,
  entry: SkillDirectoryEntry,
  fullPath: string,
  relative: string,
): void {
  const kind = entryKind(entry);
  if (kind === 'directory') {
    // The ignore list applies at the top level of a skill only.
    const atTopLevel = !relative.includes('/');
    if (!atTopLevel || !context.ignoreDirs.includes(entry.name)) {
      walkDirectory(context, fullPath, relative);
    }
  } else if (kind === 'file') {
    context.tree.set(relative, { kind: 'file', bytes: context.fs.readFile(fullPath) });
  } else if (kind === 'symlink') {
    context.tree.set(relative, { kind: 'symlink' });
  }
}

/** Read one skill directory into a tree, or `undefined` when it is not a readable directory. */
function readSkill(
  fs: SkillFileSystem,
  ignoreDirs: readonly string[],
  skillDir: string,
): SkillTree | undefined {
  if (fs.readDirectory(skillDir) === undefined) {
    return undefined;
  }
  const tree = new Map<string, SkillEntry>();
  walkDirectory({ fs, ignoreDirs, tree }, skillDir, '');
  return tree;
}

/**
 * Create a reader over `fs` that lists a root's skill directories and walks one
 * skill directory, skipping top-level directories named in `ignoreDirs`.
 */
export function createFileSystemSkillTreeReader(
  ignoreDirs: readonly string[],
  fs: SkillFileSystem = nodeSkillFileSystem,
): SkillTreeReader {
  return {
    listRoot: (root) => listRoot(fs, root),
    read: (skillDir) => readSkill(fs, ignoreDirs, skillDir),
  };
}
