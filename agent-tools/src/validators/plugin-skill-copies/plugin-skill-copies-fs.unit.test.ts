/**
 * Unit tests for the filesystem reader of the skill-copy validator.
 *
 * @remarks
 * The walker decides what the gate sees. Each test describes one shape of
 * directory and what the reader must list or read from it, against an
 * in-memory filesystem facade that is a lookup over declared entries: no
 * path resolution, no link following, no real IO (ADR-078).
 */

import { describe, expect, it } from 'vitest';

import {
  createFileSystemSkillTreeReader,
  type SkillDirectoryEntry,
  type SkillFileSystem,
} from './plugin-skill-copies-fs.js';
import type { SkillEntry, SkillTree } from './plugin-skill-copies.js';

type Node =
  | { readonly kind: 'file'; readonly text: string }
  | { readonly kind: 'symlink' }
  | { readonly kind: 'other' };

/** Path → node. Directories are implied by having children. */
type Layout = Readonly<Record<string, Node>>;

const encoder = new TextEncoder();
const byName = (a: string, b: string): number => a.localeCompare(b, 'en');

/** The names directly under `directory`, in stable order. */
function childNames(layout: Layout, directory: string): readonly string[] {
  const names = Object.keys(layout)
    .filter((key) => key.startsWith(`${directory}/`))
    .map((key) => key.slice(directory.length + 1).split('/')[0] ?? '');
  return [...new Set(names)].sort(byName);
}

/** A filesystem facade that answers from the declared layout only. */
function memoryFileSystem(layout: Layout): SkillFileSystem {
  const entryFor = (directory: string, name: string): SkillDirectoryEntry => {
    const node = layout[`${directory}/${name}`];
    const isDirectory = node === undefined && childNames(layout, `${directory}/${name}`).length > 0;
    return {
      name,
      isDirectory: () => isDirectory,
      isFile: () => node?.kind === 'file',
      isSymbolicLink: () => node?.kind === 'symlink',
    };
  };
  return {
    readDirectory: (directory) => {
      const names = childNames(layout, directory);
      return names.length === 0 ? undefined : names.map((name) => entryFor(directory, name));
    },
    readFile: (file) => {
      const node = layout[file];
      // A non-file read is a walker bug; surface it as content the assertion will show.
      return encoder.encode(node?.kind === 'file' ? node.text : `<not a file: ${file}>`);
    },
  };
}

const text = (t: string): Node => ({ kind: 'file', text: t });
const decode = (entry: SkillEntry | undefined): string | undefined =>
  entry?.kind === 'file' ? new TextDecoder().decode(entry.bytes) : undefined;
const entriesOf = (tree: SkillTree | undefined): readonly [string, SkillEntry['kind']][] =>
  [...(tree ?? new Map<string, SkillEntry>()).entries()]
    .map(([relativePath, entry]): [string, SkillEntry['kind']] => [relativePath, entry.kind])
    .sort(([a], [b]) => byName(a, b));

describe('createFileSystemSkillTreeReader', () => {
  describe('listRoot', () => {
    it('lists as skills only the directories holding a SKILL.md file, in name order', () => {
      const fs = memoryFileSystem({
        '/r/zeta/SKILL.md': text('z'),
        '/r/alpha/SKILL.md': text('a'),
        '/r/notes/README.md': text('not a skill'),
        '/r/loose-file.md': text('not a directory'),
      });

      expect(createFileSystemSkillTreeReader([], fs).listRoot('/r')).toStrictEqual({
        skills: ['alpha', 'zeta'],
        symlinks: [],
      });
    });

    it('does not count a directory named SKILL.md as a manifest', () => {
      const fs = memoryFileSystem({ '/r/odd/SKILL.md/inner.md': text('x') });

      expect(createFileSystemSkillTreeReader([], fs).listRoot('/r')?.skills).toStrictEqual([]);
    });

    it('reports a symlinked entry under the root instead of following it', () => {
      const fs = memoryFileSystem({
        '/r/alpha/SKILL.md': text('a'),
        '/r/linked': { kind: 'symlink' },
      });

      expect(createFileSystemSkillTreeReader([], fs).listRoot('/r')).toStrictEqual({
        skills: ['alpha'],
        symlinks: ['linked'],
      });
    });

    it('answers undefined for a root that does not exist', () => {
      expect(
        createFileSystemSkillTreeReader([], memoryFileSystem({})).listRoot('/missing'),
      ).toBeUndefined();
    });
  });

  describe('read', () => {
    it('walks nested directories and keys files by skill-relative path', () => {
      const fs = memoryFileSystem({
        '/r/s/SKILL.md': text('top'),
        '/r/s/references/a.md': text('ref'),
        '/r/s/assets/deep/img.txt': text('deep'),
      });

      const tree = createFileSystemSkillTreeReader([], fs).read('/r/s');

      expect(entriesOf(tree)).toStrictEqual([
        ['assets/deep/img.txt', 'file'],
        ['references/a.md', 'file'],
        ['SKILL.md', 'file'],
      ]);
      expect(decode(tree?.get('assets/deep/img.txt'))).toBe('deep');
    });

    it('skips an ignored directory at the top level only', () => {
      const fs = memoryFileSystem({
        '/r/s/SKILL.md': text('top'),
        '/r/s/evals/case.md': text('eval'),
        '/r/s/references/evals/nested.md': text('nested, not ignored'),
        '/r/s/references/keep.md': text('keep'),
      });

      const tree = createFileSystemSkillTreeReader(['evals'], fs).read('/r/s');

      expect(entriesOf(tree)).toStrictEqual([
        ['references/evals/nested.md', 'file'],
        ['references/keep.md', 'file'],
        ['SKILL.md', 'file'],
      ]);
    });

    it('ignores entries that are neither files, directories, nor symlinks', () => {
      const fs = memoryFileSystem({
        '/r/s/SKILL.md': text('top'),
        '/r/s/pipe': { kind: 'other' },
      });

      expect(entriesOf(createFileSystemSkillTreeReader([], fs).read('/r/s'))).toStrictEqual([
        ['SKILL.md', 'file'],
      ]);
    });

    it('records a symlink inside the tree as a symlink entry and reads nothing through it', () => {
      const fs = memoryFileSystem({
        '/r/s/SKILL.md': text('top'),
        '/r/s/references/link.md': { kind: 'symlink' },
      });

      expect(entriesOf(createFileSystemSkillTreeReader([], fs).read('/r/s'))).toStrictEqual([
        ['references/link.md', 'symlink'],
        ['SKILL.md', 'file'],
      ]);
    });

    it('answers undefined for a skill directory that does not exist', () => {
      expect(
        createFileSystemSkillTreeReader([], memoryFileSystem({})).read('/r/none'),
      ).toBeUndefined();
    });
  });
});
