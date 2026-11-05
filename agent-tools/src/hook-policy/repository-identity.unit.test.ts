/**
 * Unit tests for telling which git repository a file belongs to, over a
 * literal in-memory filesystem (tests never use or create IO). The answer is
 * "another repository" only when the file's repository is found and differs
 * from the guard's own; anything unknown reads as not another repository, so
 * a block that exempts other repositories keeps applying (fail closed).
 */
import { describe, expect, it } from 'vitest';

import {
  isInOtherRepository,
  otherRepositoryTest,
  repositoryIdentity,
} from './repository-identity.js';
import type { RepositoryProbe } from './repository-probe.js';
import { posixPath } from './test-helpers/posix-path.js';

/**
 * A probe over literal entries: `.git` kinds by directory, file texts, files
 * that exist but cannot be read, real paths (a path maps to itself unless
 * listed; `null` means it does not exist), `dangling`, the paths holding a
 * link that points nowhere, `shared`, the files with more than one hard link,
 * identities (a directory is its own identity unless listed), and `missing`,
 * the paths that are no searchable directory. Each path is read the POSIX way,
 * so the literals hold on Windows.
 */
function probeOver(layout: {
  readonly gitEntries: Readonly<Record<string, 'directory' | 'file' | 'unknown'>>;
  readonly texts?: Readonly<Record<string, string>>;
  readonly unreadable?: readonly string[];
  readonly realPaths?: Readonly<Record<string, string | null>>;
  readonly dangling?: readonly string[];
  readonly shared?: readonly string[];
  readonly identities?: Readonly<Record<string, string>>;
  readonly missing?: readonly string[];
}): RepositoryProbe {
  return {
    gitEntry: (directory) => layout.gitEntries[posixPath(directory)] ?? 'absent',
    readText: (filePath) => {
      if (layout.unreadable?.includes(posixPath(filePath)) === true) {
        return { kind: 'unreadable' };
      }
      const text = layout.texts?.[posixPath(filePath)];
      return text === undefined ? { kind: 'absent' } : { kind: 'text', text };
    },
    realPath: (filePath) => {
      const real = layout.realPaths?.[posixPath(filePath)];
      return real === undefined ? filePath : real;
    },
    entryExists: (filePath) => layout.dangling?.includes(posixPath(filePath)) === true,
    sharedFile: (filePath) => layout.shared?.includes(posixPath(filePath)) === true,
    identity: (directory) => layout.identities?.[posixPath(directory)] ?? posixPath(directory),
    searchableDirectory: (directory) => layout.missing?.includes(posixPath(directory)) !== true,
  };
}

/** A branch reference, the HEAD every real git directory holds. */
const HEAD = 'ref: refs/heads/main\n';

/**
 * This repository at /r, a worktree of it at /w, another repository at /o with
 * a worktree at /ow. Each worktree's git directory holds its own HEAD, as git's do.
 */
const ESTATE_TEXTS = {
  '/r/.git/HEAD': HEAD,
  '/w/.git': 'gitdir: /r/.git/worktrees/w\n',
  '/r/.git/worktrees/w/HEAD': HEAD,
  '/r/.git/worktrees/w/commondir': '../..\n',
  '/o/.git/HEAD': HEAD,
  '/ow/.git': 'gitdir: /o/.git/worktrees/ow\n',
  '/o/.git/worktrees/ow/HEAD': HEAD,
  '/o/.git/worktrees/ow/commondir': '../..\n',
};
const ESTATE_ENTRIES = {
  '/r': 'directory',
  '/w': 'file',
  '/o': 'directory',
  '/ow': 'file',
} as const;
const estate = probeOver({ gitEntries: ESTATE_ENTRIES, texts: ESTATE_TEXTS });

describe('repositoryIdentity', () => {
  it("names a primary checkout by its own git directory's identity", () => {
    expect(repositoryIdentity('/r/docs/a.md', estate)).toBe('/r/.git');
  });

  it('names a worktree by its common git directory, through its gitdir and commondir files', () => {
    expect(repositoryIdentity('/w/agent-tools/src/x.ts', estate)).toBe('/r/.git');
  });

  it('reads a relative gitdir line from the directory holding the .git file', () => {
    const relative = probeOver({
      gitEntries: { '/x/sub': 'file' },
      texts: { '/x/sub/.git': 'gitdir: ../.git/modules/sub\n', '/x/.git/modules/sub/HEAD': HEAD },
    });
    expect(repositoryIdentity('/x/sub/a.md', relative)).toBe('/x/.git/modules/sub');
  });

  it('names nothing for a file in no repository', () => {
    expect(repositoryIdentity('/tmp/scratch/notes.md', estate)).toBeUndefined();
  });

  it('names nothing when a .git file carries no gitdir line, or cannot be read', () => {
    const noPointer = probeOver({ gitEntries: { '/b': 'file' }, texts: { '/b/.git': 'plain' } });
    expect(repositoryIdentity('/b/x.md', noPointer)).toBeUndefined();
    const unreadable = probeOver({ gitEntries: { '/b': 'file' }, unreadable: ['/b/.git'] });
    expect(repositoryIdentity('/b/x.md', unreadable)).toBeUndefined();
  });

  it("names nothing for a .git file that is more than git's one gitdir line", () => {
    for (const text of [
      'junk\ngitdir: /o/.git\n',
      'gitdir: /o/.git\njunk\n',
      'gitdir:\t/o/.git\n',
    ]) {
      const malformed = probeOver({
        gitEntries: { ...ESTATE_ENTRIES, '/b': 'file' },
        texts: { ...ESTATE_TEXTS, '/b/.git': text },
      });
      expect(repositoryIdentity('/b/x.md', malformed)).toBeUndefined();
    }
  });

  it("names nothing when a worktree's commondir exists but cannot be read", () => {
    const locked = probeOver({
      gitEntries: ESTATE_ENTRIES,
      texts: ESTATE_TEXTS,
      unreadable: ['/r/.git/worktrees/w/commondir'],
    });
    expect(repositoryIdentity('/w/docs/a.md', locked)).toBeUndefined();
  });

  it('names nothing for a git directory without a HEAD, which git itself would not accept', () => {
    const planted = probeOver({ gitEntries: { '/r/docs/x': 'directory' }, texts: ESTATE_TEXTS });
    expect(repositoryIdentity('/r/docs/x/a.md', planted)).toBeUndefined();
  });

  it('names nothing for a git directory that lacks objects/ or refs/, as git itself requires both', () => {
    // A planted .git holding only HEAD, beneath a tracked path of this repository.
    for (const lacking of ['/r/docs/x/.git/objects', '/r/docs/x/.git/refs']) {
      const planted = probeOver({
        gitEntries: { ...ESTATE_ENTRIES, '/r/docs/x': 'directory' },
        texts: { ...ESTATE_TEXTS, '/r/docs/x/.git/HEAD': HEAD },
        missing: [lacking],
      });
      expect(repositoryIdentity('/r/docs/x/a.md', planted)).toBeUndefined();
      expect(isInOtherRepository('/r/docs/x/a.md', '/r/.git', planted)).toBe(false);
    }
  });

  it('names nothing for a git directory whose HEAD is neither a branch reference nor an object id', () => {
    for (const head of [
      '',
      'garbage\n',
      'ref: heads/main\n',
      'abc123\n',
      // Git reads 255 bytes of HEAD, so `refs/` past that window is never seen.
      `ref:${' '.repeat(247)}refs/heads/main\n`,
      // Git skips only ASCII whitespace after `ref:`.
      'ref:\u00a0refs/heads/main\n',
    ]) {
      const planted = probeOver({
        gitEntries: { ...ESTATE_ENTRIES, '/r/docs/x': 'directory' },
        texts: { ...ESTATE_TEXTS, '/r/docs/x/.git/HEAD': head },
      });
      expect(repositoryIdentity('/r/docs/x/a.md', planted)).toBeUndefined();
    }
  });

  it("names a git directory whose HEAD reference follows git's own whitespace", () => {
    for (const head of ['ref:refs/heads/main\n', 'ref:\t refs/heads/main\n']) {
      const spaced = probeOver({
        gitEntries: ESTATE_ENTRIES,
        texts: { ...ESTATE_TEXTS, '/o/.git/HEAD': head },
      });
      expect(repositoryIdentity('/o/src/a.ts', spaced)).toBe('/o/.git');
    }
  });

  it('names a git directory whose HEAD is a detached object id, as git does', () => {
    const detached = probeOver({
      gitEntries: ESTATE_ENTRIES,
      texts: { ...ESTATE_TEXTS, '/o/.git/HEAD': `${'a1'.repeat(20)}\n` },
    });
    expect(repositoryIdentity('/o/src/a.ts', detached)).toBe('/o/.git');
  });

  it('names nothing for a worktree gitdir without its own HEAD, whatever its commondir names', () => {
    const borrowed = probeOver({
      gitEntries: { ...ESTATE_ENTRIES, '/r/docs/x': 'file' },
      texts: {
        ...ESTATE_TEXTS,
        '/r/docs/x/.git': 'gitdir: /r/docs/fake\n',
        '/r/docs/fake/commondir': '/o/.git\n',
      },
    });
    expect(repositoryIdentity('/r/docs/x/a.md', borrowed)).toBeUndefined();
    expect(isInOtherRepository('/r/docs/x/a.md', '/r/.git', borrowed)).toBe(false);
  });

  it('names nothing for a .git entry that is neither a directory nor a file', () => {
    expect(
      repositoryIdentity('/q/a.md', probeOver({ gitEntries: { '/q': 'unknown' } })),
    ).toBeUndefined();
  });
});

describe('repositoryIdentity, placing a path where it really is', () => {
  it('follows a symbolic link to where the file really is', () => {
    const linked = probeOver({
      gitEntries: ESTATE_ENTRIES,
      texts: ESTATE_TEXTS,
      realPaths: { '/o/link.md': '/r/docs/a.md' },
    });
    expect(repositoryIdentity('/o/link.md', linked)).toBe('/r/.git');
  });

  it("places a new file by its nearest existing directory's real path", () => {
    const linked = probeOver({
      gitEntries: ESTATE_ENTRIES,
      texts: ESTATE_TEXTS,
      realPaths: { '/o/linked/new.md': null, '/o/linked': '/r/docs' },
    });
    expect(repositoryIdentity('/o/linked/new.md', linked)).toBe('/r/.git');
  });

  it('places nothing at a link that points nowhere, wherever the link sits', () => {
    // A dangling link in another repository, aimed at a file this one has not made yet:
    // the write lands where the link points, so the link's own directory names nothing.
    const dangling = probeOver({
      gitEntries: ESTATE_ENTRIES,
      texts: ESTATE_TEXTS,
      realPaths: { '/o/link.md': null },
      dangling: ['/o/link.md'],
    });
    expect(repositoryIdentity('/o/link.md', dangling)).toBeUndefined();
    expect(isInOtherRepository('/o/link.md', '/r/.git', dangling)).toBe(false);
  });

  it('places nothing at a file with another hard link, which may be in any repository', () => {
    // A hard link in another repository to a file of this one: its real path is its own.
    const shared = probeOver({
      gitEntries: ESTATE_ENTRIES,
      texts: ESTATE_TEXTS,
      shared: ['/o/hard.md'],
    });
    expect(repositoryIdentity('/o/hard.md', shared)).toBeUndefined();
    expect(isInOtherRepository('/o/hard.md', '/r/.git', shared)).toBe(false);
  });

  it('places nothing beneath a directory link that points nowhere', () => {
    const dangling = probeOver({
      gitEntries: ESTATE_ENTRIES,
      texts: ESTATE_TEXTS,
      realPaths: { '/o/linked/new.md': null, '/o/linked': null },
      dangling: ['/o/linked'],
    });
    expect(repositoryIdentity('/o/linked/new.md', dangling)).toBeUndefined();
  });

  it('names nothing when no directory on the path exists', () => {
    const nowhere: RepositoryProbe = { ...estate, realPath: () => null };
    expect(repositoryIdentity('/r/docs/a.md', nowhere)).toBeUndefined();
  });

  it('gives up, naming nothing, on a path deeper than the climb allows', () => {
    const deep = `/r/${'d/'.repeat(300)}a.md`;
    const unplaced = probeOver({
      gitEntries: ESTATE_ENTRIES,
      texts: ESTATE_TEXTS,
      realPaths: { [deep]: null },
    });
    expect(repositoryIdentity(deep, unplaced)).toBeUndefined();
  });
});

describe('isInOtherRepository', () => {
  it('reads a file in this repository or one of its worktrees as not another repository', () => {
    expect(isInOtherRepository('/r/docs/a.md', '/r/.git', estate)).toBe(false);
    expect(isInOtherRepository('/w/docs/a.md', '/r/.git', estate)).toBe(false);
  });

  it('reads a file in another repository or its worktree as another repository', () => {
    expect(isInOtherRepository('/o/src/a.ts', '/r/.git', estate)).toBe(true);
    expect(isInOtherRepository('/ow/src/a.ts', '/r/.git', estate)).toBe(true);
  });

  it('reads two spellings of one git directory as one repository', () => {
    const spelt = probeOver({
      gitEntries: { '/Spelt/r': 'directory' },
      texts: { '/Spelt/r/.git/HEAD': HEAD },
      identities: { '/Spelt/r/.git': 'device-1:inode-7' },
    });
    expect(isInOtherRepository('/Spelt/r/a.md', 'device-1:inode-7', spelt)).toBe(false);
  });

  it('reads a file in no repository as not another repository', () => {
    expect(isInOtherRepository('/tmp/scratch/notes.md', '/r/.git', estate)).toBe(false);
  });

  it("reads everything as not another repository when this repository's own is unknown", () => {
    expect(isInOtherRepository('/o/src/a.ts', undefined, estate)).toBe(false);
  });

  it('reads a relative path as not another repository, since it has no known place', () => {
    expect(isInOtherRepository('src/a.ts', '/r/.git', estate)).toBe(false);
  });
});

describe('otherRepositoryTest', () => {
  it('reads files against the repository its root is in', () => {
    const inOther = otherRepositoryTest('/r', estate);
    expect(inOther('/r/docs/a.md')).toBe(false);
    expect(inOther('/w/docs/a.md')).toBe(false);
    expect(inOther('/o/src/a.ts')).toBe(true);
    expect(inOther('/ow/src/a.ts')).toBe(true);
    expect(inOther('/tmp/scratch/notes.md')).toBe(false);
  });

  it("reads a worktree root as its primary's repository", () => {
    expect(otherRepositoryTest('/w', estate)('/r/docs/a.md')).toBe(false);
  });

  it('reads a root spelt through a link as the repository it leads to', () => {
    const linkedRoot = probeOver({
      gitEntries: ESTATE_ENTRIES,
      texts: ESTATE_TEXTS,
      realPaths: { '/link/r': '/r' },
    });
    expect(otherRepositoryTest('/link/r', linkedRoot)('/r/docs/a.md')).toBe(false);
  });

  it('reads nothing as another repository when its root is in none', () => {
    expect(otherRepositoryTest('/tmp/session', estate)('/o/src/a.ts')).toBe(false);
  });
});
