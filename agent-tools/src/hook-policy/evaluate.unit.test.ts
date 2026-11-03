import { describe, expect, it } from 'vitest';

import { evaluateBashCommand, evaluateContentChanges } from './evaluate.js';
import type { ScopedContentBlockGroup } from './types.js';

const SCOPED_GROUP: ScopedContentBlockGroup = {
  concept: 'tombstone comment',
  patterns: ['removed for brevity'],
  include_paths: ['docs/'],
  citation: 'no-tombstones-for-removed-ideas',
};

describe('evaluateBashCommand', () => {
  it('returns allow when no pattern matches', () => {
    const decision = evaluateBashCommand('git status', ['git push --force']);

    expect(decision).toEqual({ kind: 'allow' });
  });

  it('returns the normalised matched entry for a reordered-argument match', () => {
    const decision = evaluateBashCommand('git push origin HEAD --force', ['git push --force']);

    expect(decision.kind).toBe('deny-bash-pattern');
    if (decision.kind === 'deny-bash-pattern') {
      expect(decision.entry.pattern).toBe('git push --force');
    }
  });

  it('carries the entry citation through to the decision', () => {
    const decision = evaluateBashCommand('git reset --hard HEAD~1', [
      { pattern: 'git reset --hard', citation: 'never-use-git-to-remove-work' },
    ]);

    expect(decision.kind).toBe('deny-bash-pattern');
    if (decision.kind === 'deny-bash-pattern') {
      expect(decision.entry.citation).toBe('never-use-git-to-remove-work');
    }
  });
});

describe('evaluateContentChanges', () => {
  it('returns allow for an empty change set', () => {
    const decision = evaluateContentChanges([], ['OWNER-ONLY-MARKER'], [SCOPED_GROUP]);

    expect(decision).toEqual({ kind: 'allow' });
  });

  it('returns allow when the pattern already exists in prior content', () => {
    const decision = evaluateContentChanges(
      [
        {
          newContent: 'unchanged OWNER-ONLY-MARKER line',
          priorContent: 'unchanged OWNER-ONLY-MARKER line',
          filePath: 'docs/example.md',
        },
      ],
      ['OWNER-ONLY-MARKER'],
      [SCOPED_GROUP],
    );

    expect(decision).toEqual({ kind: 'allow' });
  });

  it('denies an added flat pattern with the matched pattern string', () => {
    const decision = evaluateContentChanges(
      [
        {
          newContent: 'now with OWNER-ONLY-MARKER added',
          priorContent: '',
          filePath: 'docs/example.md',
        },
      ],
      ['OWNER-ONLY-MARKER'],
      [],
    );

    expect(decision).toEqual({ kind: 'deny-content-pattern', pattern: 'OWNER-ONLY-MARKER' });
  });

  it('denies an added in-scope scoped block with group and matched text', () => {
    const decision = evaluateContentChanges(
      [
        {
          newContent: 'section removed for brevity here',
          priorContent: '',
          filePath: 'docs/example.md',
        },
      ],
      [],
      [SCOPED_GROUP],
    );

    expect(decision.kind).toBe('deny-scoped-block');
    if (decision.kind === 'deny-scoped-block') {
      expect(decision.match.group).toEqual(SCOPED_GROUP);
      expect(decision.match.matchedText).toBe('removed for brevity');
    }
  });

  it('reads a root-anchored exclude against an absolute path through the repo root', () => {
    const anchored: ScopedContentBlockGroup = {
      ...SCOPED_GROUP,
      include_paths: [''],
      exclude_paths: ['./docs/exempt/'],
    };
    const change = (filePath: string) => [
      { newContent: 'section removed for brevity here', priorContent: '', filePath },
    ];
    const scope = { repoRoot: '/repo' };
    expect(evaluateContentChanges(change('/repo/docs/exempt/x.md'), [], [anchored], scope)).toEqual(
      {
        kind: 'allow',
      },
    );
    expect(
      evaluateContentChanges(change('/repo/nested/docs/exempt/x.md'), [], [anchored], scope).kind,
    ).toBe('deny-scoped-block');
    // A relative path the hook could not place against a working directory claims no exemption.
    expect(
      evaluateContentChanges(change('docs/exempt/x.md'), [], [anchored], {
        ...scope,
        relativeIsRepoRelative: false,
      }).kind,
    ).toBe('deny-scoped-block');
    // Without the root, an absolute path cannot claim a root-anchored exemption.
    expect(evaluateContentChanges(change('/repo/docs/exempt/x.md'), [], [anchored]).kind).toBe(
      'deny-scoped-block',
    );
  });

  it('drops a block that exempts other repositories only for a change in another repository', () => {
    const ownOnly: ScopedContentBlockGroup = { ...SCOPED_GROUP, excludes_other_repositories: true };
    const change = (inOtherRepository: boolean) => [
      {
        newContent: 'section removed for brevity here',
        priorContent: '',
        filePath: 'docs/example.md',
        inOtherRepository,
      },
    ];
    expect(evaluateContentChanges(change(true), [], [ownOnly])).toEqual({ kind: 'allow' });
    expect(evaluateContentChanges(change(false), [], [ownOnly]).kind).toBe('deny-scoped-block');
    // A block without the flag applies in every repository.
    expect(evaluateContentChanges(change(true), [], [SCOPED_GROUP]).kind).toBe('deny-scoped-block');
  });

  it('keeps the flat pattern layer for a change in another repository', () => {
    const decision = evaluateContentChanges(
      [
        {
          newContent: 'now with OWNER-ONLY-MARKER added',
          priorContent: '',
          filePath: 'docs/example.md',
          inOtherRepository: true,
        },
      ],
      ['OWNER-ONLY-MARKER'],
      [{ ...SCOPED_GROUP, excludes_other_repositories: true }],
    );

    expect(decision).toEqual({ kind: 'deny-content-pattern', pattern: 'OWNER-ONLY-MARKER' });
  });

  it('returns allow when the scoped group path scope excludes the change', () => {
    const decision = evaluateContentChanges(
      [
        {
          newContent: 'section removed for brevity here',
          priorContent: '',
          filePath: 'src/example.ts',
        },
      ],
      [],
      [SCOPED_GROUP],
    );

    expect(decision).toEqual({ kind: 'allow' });
  });

  it('nests per change: an earlier change scoped match outranks a later change flat match', () => {
    const decision = evaluateContentChanges(
      [
        {
          newContent: 'section removed for brevity here',
          priorContent: '',
          filePath: 'docs/first.md',
        },
        {
          newContent: 'now with OWNER-ONLY-MARKER added',
          priorContent: '',
          filePath: 'docs/second.md',
        },
      ],
      ['OWNER-ONLY-MARKER'],
      [SCOPED_GROUP],
    );

    expect(decision.kind).toBe('deny-scoped-block');
  });

  it('checks the flat pattern layer before the scoped layer within one change', () => {
    const decision = evaluateContentChanges(
      [
        {
          newContent: 'OWNER-ONLY-MARKER and removed for brevity together',
          priorContent: '',
          filePath: 'docs/example.md',
        },
      ],
      ['OWNER-ONLY-MARKER'],
      [SCOPED_GROUP],
    );

    expect(decision).toEqual({ kind: 'deny-content-pattern', pattern: 'OWNER-ONLY-MARKER' });
  });
});
