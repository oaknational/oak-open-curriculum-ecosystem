/**
 * Unit tests for the filesystem reader of the skill-copy validator.
 *
 * @remarks
 * The walker decides what the gate sees. Each test describes one shape of
 * directory and what the reader must list or read from it, against an
 * in-memory filesystem facade — no real IO (ADR-078).
 */

import { describe, expect, it } from 'vitest';

import {
  createFileSystemSkillTreeReader,
  type SkillDirectoryEntry,
  type SkillFileSystem,
} from './plugin-skill-copies-fs.js';
import type { SkillTree } from './plugin-skill-copies.js';

type Node =
  | { readonly kind: 'file'; readonly text: string }
  | { readonly kind: 'dir' }
  | { readonly kind: 'link'; readonly to: string }
  | { readonly kind: 'socket' };

/** Absolute-ish path → node. Directories are implied by their children but may also be declared. */
type Layout = Readonly<Record<string, Node>>;

const encoder = new TextEncoder();

/** Resolve links at every prefix of `target`, so a path through a linked directory reaches its real location. */
function resolveLink(layout: Layout, target: string): string {
  let current = '';
  for (const part of target.split('/').slice(1)) {
    current = `${current}/${part}`;
    for (let hops = 0; hops < 8; hops += 1) {
      const node = layout[current];
      if (node?.kind !== 'link') {
        break;
      }
      current = node.to;
    }
  }
  return current;
}

function isDirectoryPath(layout: Layout, target: string): boolean {
  if (layout[target]?.kind === 'dir') {
    return true;
  }
  return Object.keys(layout).some((key) => key.startsWith(`${target}/`));
}

function memoryFileSystem(layout: Layout): SkillFileSystem {
  const kindAt = (target: string): 'dir' | 'file' | 'other' | 'missing' => {
    const real = resolveLink(layout, target);
    const node = layout[real];
    if (node?.kind === 'file') {
      return 'file';
    }
    if (isDirectoryPath(layout, real)) {
      return 'dir';
    }
    return node === undefined ? 'missing' : 'other';
  };
  const entry = (name: string, fullPath: string): SkillDirectoryEntry => {
    const node = layout[fullPath];
    const isLink = node?.kind === 'link';
    const kind = isLink ? 'other' : kindAt(fullPath);
    return {
      name,
      isDirectory: () => !isLink && kind === 'dir',
      isFile: () => !isLink && kind === 'file',
      isSymbolicLink: () => isLink,
    };
  };
  return {
    existsSync: (target) => kindAt(target) !== 'missing',
    readdirSync: (directory) => {
      const real = resolveLink(layout, directory);
      const names = new Set<string>();
      for (const key of Object.keys(layout)) {
        if (key.startsWith(`${real}/`)) {
          names.add(key.slice(real.length + 1).split('/')[0] ?? '');
        }
      }
      return [...names]
        .sort((a, b) => a.localeCompare(b))
        .map((name) => entry(name, `${real}/${name}`));
    },
    readFileSync: (file) => {
      const node = layout[resolveLink(layout, file)];
      // A non-file read is a walker bug; surface it as content the assertion will show.
      return encoder.encode(node?.kind === 'file' ? node.text : `<not a file: ${file}>`);
    },
    statSync: (target) => {
      const kind = kindAt(target);
      return { isDirectory: () => kind === 'dir', isFile: () => kind === 'file' };
    },
  };
}

const text = (t: string): Node => ({ kind: 'file', text: t });
const byText = (a: string, b: string): number => a.localeCompare(b);
/** The keys of a tree in stable order; a missing tree reads as no keys, which the assertion then names. */
const keysOf = (tree: SkillTree | undefined): readonly string[] =>
  [...(tree ?? new Map<string, Uint8Array>()).keys()].sort(byText);
const textOf = (tree: SkillTree | undefined, relativePath: string): string | undefined => {
  const bytes = tree?.get(relativePath);
  return bytes === undefined ? undefined : new TextDecoder().decode(bytes);
};

describe('createFileSystemSkillTreeReader', () => {
  describe('listSkills', () => {
    it('lists only the directories that hold a SKILL.md, in name order', () => {
      const fs = memoryFileSystem({
        '/r/zeta/SKILL.md': text('z'),
        '/r/alpha/SKILL.md': text('a'),
        '/r/notes/README.md': text('not a skill'),
        '/r/loose-file.md': text('not a directory'),
      });

      expect(createFileSystemSkillTreeReader([], fs).listSkills('/r')).toStrictEqual([
        'alpha',
        'zeta',
      ]);
    });

    it('answers undefined for a root that does not exist', () => {
      const fs = memoryFileSystem({});

      expect(createFileSystemSkillTreeReader([], fs).listSkills('/missing')).toBeUndefined();
    });

    it('lists a skill reached through a symlinked directory', () => {
      const fs = memoryFileSystem({
        '/elsewhere/real/SKILL.md': text('s'),
        '/r/linked': { kind: 'link', to: '/elsewhere/real' },
      });

      expect(createFileSystemSkillTreeReader([], fs).listSkills('/r')).toStrictEqual(['linked']);
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

      expect(keysOf(tree)).toStrictEqual(['assets/deep/img.txt', 'references/a.md', 'SKILL.md']);
      expect(textOf(tree, 'assets/deep/img.txt')).toBe('deep');
    });

    it('skips an ignored directory at any depth, and nothing else', () => {
      const fs = memoryFileSystem({
        '/r/s/SKILL.md': text('top'),
        '/r/s/evals/case.md': text('eval'),
        '/r/s/references/evals/nested.md': text('nested eval'),
        '/r/s/references/keep.md': text('keep'),
      });

      const tree = createFileSystemSkillTreeReader(['evals'], fs).read('/r/s');

      expect(keysOf(tree)).toStrictEqual(['references/keep.md', 'SKILL.md']);
    });

    it('ignores entries that are neither files nor directories', () => {
      const fs = memoryFileSystem({
        '/r/s/SKILL.md': text('top'),
        '/r/s/pipe': { kind: 'socket' },
      });

      expect(keysOf(createFileSystemSkillTreeReader([], fs).read('/r/s'))).toStrictEqual([
        'SKILL.md',
      ]);
    });

    it('follows a symlinked file so a linked copy is compared, not skipped', () => {
      const fs = memoryFileSystem({
        '/r/s/SKILL.md': text('top'),
        '/shared/real.md': text('linked content'),
        '/r/s/references/link.md': { kind: 'link', to: '/shared/real.md' },
      });

      const tree = createFileSystemSkillTreeReader([], fs).read('/r/s');

      expect(textOf(tree, 'references/link.md')).toBe('linked content');
    });

    it('answers undefined for a skill directory that does not exist', () => {
      expect(
        createFileSystemSkillTreeReader([], memoryFileSystem({})).read('/r/none'),
      ).toBeUndefined();
    });
  });
});
