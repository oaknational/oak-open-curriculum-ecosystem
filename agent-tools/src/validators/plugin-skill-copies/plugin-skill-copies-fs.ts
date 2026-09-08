/**
 * The filesystem {@link SkillTreeReader} for the skill-copy validator.
 *
 * @remarks
 * Kept apart from the pure comparison so the comparison can be tested with
 * in-memory trees. The filesystem itself is injected as a small facade
 * (ADR-078) so this walker is unit-tested too: which directories it skips,
 * how deep it goes, what it counts as a file, and how it treats symlinks are
 * the decisions that determine what the gate sees, and a regression in any of
 * them would otherwise pass every test while the gate reported clean.
 *
 * @packageDocumentation
 */

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

import type { SkillTree, SkillTreeReader } from './plugin-skill-copies.js';

/** The subset of a directory entry the walker reads. */
export interface SkillDirectoryEntry {
  readonly name: string;
  isDirectory(): boolean;
  isFile(): boolean;
  isSymbolicLink(): boolean;
}

/** The subset of the filesystem the walker uses; `node:fs` satisfies it. */
export interface SkillFileSystem {
  readonly existsSync: (target: string) => boolean;
  readonly readdirSync: (directory: string) => readonly SkillDirectoryEntry[];
  readonly readFileSync: (file: string) => Uint8Array;
  /** Follows symlinks; used to classify an entry that is a link. */
  readonly statSync: (target: string) => { isDirectory(): boolean; isFile(): boolean };
}

/** The real filesystem. */
const nodeSkillFileSystem: SkillFileSystem = {
  existsSync,
  readdirSync: (directory) => readdirSync(directory, { withFileTypes: true }),
  readFileSync,
  statSync,
};

/** The file a directory must hold to count as a skill (Agent Skills specification). */
const SKILL_MANIFEST = 'SKILL.md';

type EntryKind = 'directory' | 'file' | 'other';

/** Classify an entry, following a symlink to what it points at so links are neither skipped nor mis-typed. */
function entryKind(fs: SkillFileSystem, entry: SkillDirectoryEntry, fullPath: string): EntryKind {
  if (entry.isSymbolicLink()) {
    const target = fs.statSync(fullPath);
    if (target.isDirectory()) {
      return 'directory';
    }
    return target.isFile() ? 'file' : 'other';
  }
  if (entry.isDirectory()) {
    return 'directory';
  }
  return entry.isFile() ? 'file' : 'other';
}

/**
 * Create a reader over `fs` that lists skill directories under a root and walks
 * one skill directory, skipping any directory whose name is in `ignoreDirs`
 * (at any depth).
 */
export function createFileSystemSkillTreeReader(
  ignoreDirs: readonly string[],
  fs: SkillFileSystem = nodeSkillFileSystem,
): SkillTreeReader {
  const listSkills = (root: string): readonly string[] | undefined => {
    if (!fs.existsSync(root)) {
      return undefined;
    }
    return fs
      .readdirSync(root)
      .filter((entry) => entryKind(fs, entry, path.join(root, entry.name)) === 'directory')
      .filter((entry) => fs.existsSync(path.join(root, entry.name, SKILL_MANIFEST)))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b));
  };

  const read = (skillDir: string): SkillTree | undefined => {
    if (!fs.existsSync(skillDir)) {
      return undefined;
    }
    const tree = new Map<string, Uint8Array>();
    const walk = (current: string, prefix: string): void => {
      for (const entry of fs.readdirSync(current)) {
        const fullPath = path.join(current, entry.name);
        const relative = prefix === '' ? entry.name : `${prefix}/${entry.name}`;
        const kind = entryKind(fs, entry, fullPath);
        if (kind === 'directory') {
          if (!ignoreDirs.includes(entry.name)) {
            walk(fullPath, relative);
          }
        } else if (kind === 'file') {
          tree.set(relative, fs.readFileSync(fullPath));
        }
      }
    };
    walk(skillDir, '');
    return tree;
  };

  return { listSkills, read };
}
