import { unwrap } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import type { GitRunner } from './operator-profile-git.js';
import { pushProfile } from './operator-profile-git-push.js';
import { failure, PROFILE_PATHSPECS, scripted } from './test-helpers/git-runner-fakes.js';

// A fake git in the middle of a merge, with git's own rules: a path stays
// unmerged until staged; the sides differ on it and on paths merged cleanly;
// a commit naming paths is partial, refused while `MERGE_HEAD` exists; `diff`
// and `grep` answer for their pathspec only; anything else fails.
interface MergeState {
  readonly unmerged?: readonly string[];
  readonly cleanlyMerged?: readonly string[];
  readonly marked?: readonly string[];
  readonly resolutionChanged: boolean;
}

function mergingGit(state: MergeState): GitRunner {
  const answer = (stdout = '', ok = true, stderr = '') => ({ ok, stdout, stderr });
  const pathsOf = (args: readonly string[]) =>
    args.includes('--') ? args.slice(args.indexOf('--') + 1) : [''];
  const within = (paths: Iterable<string>, args: readonly string[]) =>
    [...paths].filter((path) =>
      pathsOf(args).some((spec) => spec === '' || path === spec || path.startsWith(`${spec}/`)),
    );
  const unmerged = new Set(state.unmerged ?? ['repos/a--b.md']);
  const diff: GitRunner = (args) => {
    if (args.includes('MERGE_HEAD')) {
      return answer(within([...unmerged, ...(state.cleanlyMerged ?? [])], args).join('\n'));
    }
    if (args.includes('--diff-filter=U')) {
      return answer(within(unmerged, args).join('\n'));
    }
    return answer('', !state.resolutionChanged);
  };
  const grep: GitRunner = (args) => {
    const hits = (state.marked ?? []).filter((path) => pathsOf(args).includes(path));
    return hits.length === 0 ? answer('', false) : answer(hits.join('\n'));
  };
  const byCommand: Readonly<Record<string, GitRunner>> = {
    'rev-parse': (args) =>
      args.includes('MERGE_HEAD') ? answer('f'.repeat(40)) : answer('origin/main'),
    diff,
    'check-attr': (args) =>
      answer(
        pathsOf(args)
          .map((path) => `${path}\0conflict-marker-size\0unspecified\0`)
          .join(''),
      ),
    grep,
    commit: (args) =>
      args.includes('--')
        ? answer('', false, 'fatal: cannot do a partial commit during a merge.')
        : answer(),
    'rev-list': () => answer('0\t2'),
    'ls-files': () => answer(),
    add: (args) => {
      within(unmerged, args).forEach((path) => unmerged.delete(path));
      return answer();
    },
    push: () => answer(),
  };
  return (args) =>
    byCommand[args[0] ?? '']?.(args) ?? answer('', false, `unscripted: ${args.join(' ')}`);
}

describe('pushProfile — during a merge', () => {
  const PROFILE_DOCUMENTS = ['index.md', 'repos/a--b.md', 'repos/fence.md'];

  it.each([
    ['changes the documents', true],
    ['leaves the documents as they were', false],
  ])(
    'during a merge, commits the whole index and concludes the merge when the resolution %s',
    (_name, resolutionChanged) => {
      expect(
        unwrap(pushProfile(mergingGit({ resolutionChanged }), 'seat: union', PROFILE_DOCUMENTS)),
      ).toBe('committed and pushed');
    },
  );

  it.each([
    [['repos/a--b.md'], 'repos/a--b.md still holds'],
    [['index.md', 'repos/a--b.md'], 'index.md, repos/a--b.md still hold'],
  ])(
    'during a merge, refuses unmerged documents that still hold a conflict marker, naming each and the cure: %j',
    (marked, named) => {
      const run = mergingGit({ unmerged: marked, marked, resolutionChanged: true });
      expect(failure(pushProfile(run, 'seat: union', PROFILE_DOCUMENTS))).toBe(
        `${named} a conflict marker — resolve by union (both sides kept in time order, the later updated date wins), then pnpm profile:sync push --message "<seat>: <the fact>"`,
      );
    },
  );

  it('during a merge, a marker-like line in a document the merge leaves alone or merges cleanly never blocks the push', () => {
    const run = mergingGit({
      cleanlyMerged: ['repos/fence.md'],
      marked: ['repos/fence.md'],
      resolutionChanged: true,
    });
    expect(unwrap(pushProfile(run, 'seat: union', PROFILE_DOCUMENTS))).toBe('committed and pushed');
  });

  it('during a merge, refuses a path still unmerged outside the documents, naming it and the cure', () => {
    const run = mergingGit({ unmerged: ['.gitignore'], resolutionChanged: true });
    expect(failure(pushProfile(run, 'seat: union', PROFILE_DOCUMENTS))).toBe(
      '.gitignore is still unmerged outside the profile documents — in the profile root resolve each and ' +
        'git add -- <path>, then pnpm profile:sync push --message "<seat>: <the fact>"',
    );
  });

  it('reports a merge probe that fails to run as an error, never as no merge, and so never stages', () => {
    const { run } = scripted([
      {
        prefix: ['rev-parse', '-q', '--verify', 'MERGE_HEAD'],
        ok: false,
        stderr: 'fatal: bad index',
      },
      { prefix: ['ls-files'], stdout: '' },
    ]);
    expect(failure(pushProfile(run, 'seat: union', PROFILE_DOCUMENTS))).toBe(
      'git rev-parse MERGE_HEAD failed: fatal: bad index',
    );
  });

  it('with no documents, a merge on the git furniture is still concluded once it is resolved', () => {
    const run = mergingGit({ unmerged: [], resolutionChanged: true });
    expect(unwrap(pushProfile(run, 'seat: union', []))).toBe('committed and pushed');
  });

  it('with no documents, a path still unmerged is refused with the furniture cure, never searched as a document', () => {
    const run = mergingGit({
      unmerged: ['.gitattributes'],
      marked: ['.gitattributes'],
      resolutionChanged: true,
    });
    expect(failure(pushProfile(run, 'seat: union', []))).toBe(
      '.gitattributes is still unmerged outside the profile documents — in the profile root resolve each and ' +
        'git add -- <path>, then pnpm profile:sync push --message "<seat>: <the fact>"',
    );
  });

  it('during a merge, reports a marker search that fails to run as an error, never as no markers', () => {
    const { run } = scripted([
      { prefix: ['rev-parse', '-q', '--verify', 'MERGE_HEAD'] },
      { prefix: ['diff', '--name-only', '--diff-filter=U', '--'], stdout: 'repos/a--b.md' },
      { prefix: ['check-attr'], stdout: 'repos/a--b.md\0conflict-marker-size\0unspecified\0' },
      { prefix: ['grep'], ok: false },
      { prefix: ['ls-files'], stdout: '' },
    ]);
    expect(failure(pushProfile(run, 'seat: union', PROFILE_PATHSPECS))).toBe(
      'git grep failed: refused',
    );
  });

  it('during a merge, reports a marker-size read that fails to run as an error, never as the default size', () => {
    const { run } = scripted([
      { prefix: ['rev-parse', '-q', '--verify', 'MERGE_HEAD'] },
      { prefix: ['diff', '--name-only', '--diff-filter=U', '--'], stdout: 'repos/a--b.md' },
      { prefix: ['check-attr'], ok: false },
      { prefix: ['ls-files'], stdout: '' },
    ]);
    expect(failure(pushProfile(run, 'seat: union', PROFILE_PATHSPECS))).toBe(
      'git check-attr failed: refused',
    );
  });
});
