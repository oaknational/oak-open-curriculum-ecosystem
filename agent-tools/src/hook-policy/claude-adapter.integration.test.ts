import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  bashRoute,
  claudeContentRoute,
  claudePolicyRoutes,
  copilotCompatStringRoute,
  placePath,
} from './claude-adapter.js';
import type { PolicyRouteContext } from './dispatcher.js';
import { REPO_ROOT } from './policy-loader.js';
import type { PolicySnapshot } from './policy-snapshot.js';
import { posixPath } from './test-helpers/posix-path.js';
import type { ScopedContentBlockGroup } from './types.js';

/** Names of the production routes whose match predicate accepts the payload. */
function matchedRouteNames(hookInput: unknown): readonly string[] {
  return claudePolicyRoutes.filter((route) => route.matches(hookInput)).map((route) => route.name);
}

/** Build a route context with safe defaults; the snapshot accessor throws unless overridden. */
function contextFor(
  hookInput: unknown,
  overrides: Partial<PolicyRouteContext> = {},
): PolicyRouteContext {
  return {
    hookInput,
    getSnapshot: () => Promise.reject(new Error('snapshot access not expected in this test')),
    bashPatterns: undefined,
    contentPatterns: undefined,
    scopedBlocks: undefined,
    readPriorContent: () => null,
    isInOtherRepository: () => false,
    ...overrides,
  };
}

/** A block over every path, and the same block exempting files in other repositories. */
const OWN_MARKER_EVERYWHERE: ScopedContentBlockGroup = {
  concept: 'own-repository-only',
  patterns: ['own-marker'],
  include_paths: [''],
  citation: 'repository-identity',
};
const OWN_REPOSITORY_ONLY: ScopedContentBlockGroup = {
  ...OWN_MARKER_EVERYWHERE,
  excludes_other_repositories: true,
};

/** A fully-populated synthetic snapshot for section-fallback tests. */
function snapshotWith(overrides: Partial<PolicySnapshot> = {}): PolicySnapshot {
  return {
    bashPatterns: ok([]),
    contentPatterns: ok([]),
    scopedBlocks: ok([]),
    ...overrides,
  };
}

describe('route match predicates', () => {
  it('bash route matches every recorded command container variant', () => {
    const variants: readonly unknown[] = [
      { tool_name: 'Bash', tool_input: { command: 'git status' } },
      { toolInput: { command: 'git status' } },
      { command: 'git status' },
      { parameters: { command: 'git status' } },
    ];

    for (const variant of variants) {
      expect(matchedRouteNames(variant)).toStrictEqual(['bash']);
    }
  });

  it('a tool_name-less Edit object matches only the claude-content route', () => {
    const payload = {
      tool_input: { new_string: 'updated text', old_string: 'original text' },
    };

    expect(matchedRouteNames(payload)).toStrictEqual(['claude-content']);
  });

  it('a Write shape with file_path matches only the claude-content route', () => {
    const payload = {
      tool_name: 'Write',
      tool_input: { file_path: 'notes.md', content: 'plain content' },
    };

    expect(matchedRouteNames(payload)).toStrictEqual(['claude-content']);
  });

  it('a string tool_input matches only the copilot-compat string route', () => {
    const payload = {
      tool_name: 'Edit',
      tool_input: '*** Begin Patch\n*** Add File: a.txt\n+hello\n*** End Patch\n',
    };

    expect(matchedRouteNames(payload)).toStrictEqual(['copilot-compat-string']);
  });

  it('a synthetic payload carrying both command and new_string matches two routes', () => {
    const payload = { command: 'git status', new_string: 'updated text' };

    expect(matchedRouteNames(payload)).toStrictEqual(['bash', 'claude-content']);
  });

  it('an empty object matches zero routes', () => {
    expect(matchedRouteNames({})).toStrictEqual([]);
  });

  it('content matching over-approximates: writable content in any container matches', () => {
    // tool_input is an object without writable content, so extraction throws
    // even though the root carries new_string. The predicate matches anyway so
    // the payload fails closed in extraction rather than falling to a route
    // that would answer it with no content check at all.
    const payload = { tool_input: { irrelevant: true }, new_string: 'updated text' };

    expect(claudeContentRoute.matches(payload)).toBe(true);
  });

  it('a payload hiding writable content under a command-bearing tool_input fails closed on ambiguity', () => {
    // The pre-unification Edit runner exited 2 on this shape. Without the
    // over-approximating content predicate it would match the bash route alone
    // and be allowed, with the root-level written content never policy-checked.
    const payload = { tool_input: { command: 'ls' }, new_string: 'unchecked content' };

    expect(matchedRouteNames(payload)).toStrictEqual(['bash', 'claude-content']);
  });
});

describe('bash route evaluation', () => {
  it('denies through injected bashPatterns without touching the snapshot', async () => {
    const context = contextFor(
      { tool_name: 'Bash', tool_input: { command: 'git commit --no-verify' } },
      { bashPatterns: ['git --no-verify'] },
    );

    await expect(bashRoute.evaluate(context)).resolves.toStrictEqual({
      kind: 'deny-bash-pattern',
      entry: { pattern: 'git --no-verify' },
    });
  });

  it('unwraps the snapshot bash section when no patterns are injected', async () => {
    const context = contextFor(
      { tool_input: { command: 'git push origin HEAD --force' } },
      {
        getSnapshot: () =>
          Promise.resolve(snapshotWith({ bashPatterns: ok(['git push --force']) })),
      },
    );

    await expect(bashRoute.evaluate(context)).resolves.toStrictEqual({
      kind: 'deny-bash-pattern',
      entry: { pattern: 'git push --force' },
    });
  });
});

describe('content route evaluation', () => {
  it('denies an added owner marker through injected content sections', async () => {
    const context = contextFor(
      { tool_input: { new_string: 'now with secret-marker', old_string: 'clean' } },
      { contentPatterns: ['secret-marker'], scopedBlocks: [] },
    );

    await expect(claudeContentRoute.evaluate(context)).resolves.toStrictEqual({
      kind: 'deny-content-pattern',
      pattern: 'secret-marker',
    });
  });

  it('anchors a root-anchored exclude at the policy repo root for an absolute Write path', async () => {
    const group: ScopedContentBlockGroup = {
      concept: 'anchored-exemption',
      patterns: ['anchored-marker'],
      include_paths: [''],
      exclude_paths: ['./docs/exempt/'],
      citation: 'path-scope root-anchored form',
    };
    const write = (filePath: string) =>
      contextFor(
        { tool_input: { file_path: filePath, content: 'adds anchored-marker' } },
        { contentPatterns: [], scopedBlocks: [group] },
      );

    await expect(
      claudeContentRoute.evaluate(write(`${REPO_ROOT}/docs/exempt/x.md`)),
    ).resolves.toStrictEqual({ kind: 'allow' });
    const nested = await claudeContentRoute.evaluate(write(`${REPO_ROOT}/nested/docs/exempt/x.md`));
    expect(nested.kind).toBe('deny-scoped-block');
    // A path that climbs back out of the exempt directory is read where it lands.
    const escaped = await claudeContentRoute.evaluate(
      write(`${REPO_ROOT}/docs/exempt/../../src/x.md`),
    );
    expect(escaped.kind).toBe('deny-scoped-block');
  });

  it('drops a block that exempts other repositories for the files the seam places in another', async () => {
    const write = (filePath: string, blocks: readonly ScopedContentBlockGroup[]) =>
      contextFor(
        { tool_input: { file_path: filePath, content: 'adds own-marker' } },
        {
          contentPatterns: [],
          scopedBlocks: blocks,
          isInOtherRepository: (path) => posixPath(path).startsWith('/elsewhere/'),
        },
      );

    await expect(
      claudeContentRoute.evaluate(write('/elsewhere/src/a.ts', [OWN_REPOSITORY_ONLY])),
    ).resolves.toStrictEqual({ kind: 'allow' });
    const own = await claudeContentRoute.evaluate(
      write(`${REPO_ROOT}/src/a.ts`, [OWN_REPOSITORY_ONLY]),
    );
    expect(own.kind).toBe('deny-scoped-block');
    const everywhere = await claudeContentRoute.evaluate(
      write('/elsewhere/src/a.ts', [OWN_MARKER_EVERYWHERE]),
    );
    expect(everywhere.kind).toBe('deny-scoped-block');
  });

  it('asks the seam nothing for a payload path it could not place', async () => {
    const patch = '*** Begin Patch\n*** Add File: src/a.ts\n+adds own-marker\n*** End Patch\n';
    const context = contextFor(
      { tool_name: 'Edit', tool_input: patch },
      { contentPatterns: [], scopedBlocks: [OWN_REPOSITORY_ONLY], isInOtherRepository: () => true },
    );

    expect((await copilotCompatStringRoute.evaluate(context)).kind).toBe('deny-scoped-block');
  });

  it('resolves Write prior content through the injected reader', async () => {
    const context = contextFor(
      { tool_input: { file_path: '/repo/notes.md', content: 'keeps existing-marker intact' } },
      {
        contentPatterns: ['existing-marker'],
        scopedBlocks: [],
        readPriorContent: () => 'prior text with existing-marker present',
      },
    );

    await expect(claudeContentRoute.evaluate(context)).resolves.toStrictEqual({ kind: 'allow' });
  });

  it('falls back to the snapshot scoped_blocks section when only contentPatterns is injected', async () => {
    const context = contextFor(
      {
        tool_input: {
          new_string: 'we will carve out an allowance',
          old_string: 'we will decide',
          file_path: '/repo/.agent/plans/example.plan.md',
        },
      },
      {
        contentPatterns: [],
        getSnapshot: () =>
          Promise.resolve(
            snapshotWith({
              scopedBlocks: ok([
                {
                  concept: 'expediency-hedging',
                  patterns: ['carve out'],
                  include_paths: ['**/*.plan.md'],
                  citation: 'PDR-044',
                },
              ]),
            }),
          ),
      },
    );

    await expect(claudeContentRoute.evaluate(context)).resolves.toMatchObject({
      kind: 'deny-scoped-block',
      match: { matchedText: 'carve out' },
    });
  });
});

describe('copilot-compat string route evaluation', () => {
  it('evaluates every file section of an apply_patch program', async () => {
    const patch =
      '*** Begin Patch\n*** Add File: files/example.txt\n+contains FORBIDDEN-TEST-MARKER here\n*** End Patch\n';
    const context = contextFor(
      { tool_name: 'Edit', tool_input: patch },
      { contentPatterns: ['FORBIDDEN-TEST-MARKER'], scopedBlocks: [] },
    );

    await expect(copilotCompatStringRoute.evaluate(context)).resolves.toStrictEqual({
      kind: 'deny-content-pattern',
      pattern: 'FORBIDDEN-TEST-MARKER',
    });
  });

  it('resolves an apply_patch path against the payload cwd before an anchored exemption is read; without a cwd none applies', async () => {
    const group: ScopedContentBlockGroup = {
      concept: 'anchored-exemption',
      patterns: ['anchored-marker'],
      include_paths: [''],
      exclude_paths: ['./docs/exempt/'],
      citation: 'path-scope root-anchored form',
    };
    const patch =
      '*** Begin Patch\n*** Add File: docs/exempt/x.md\n+adds anchored-marker\n*** End Patch\n';
    const evaluate = (cwd?: string) =>
      copilotCompatStringRoute.evaluate(
        contextFor(
          { tool_name: 'Edit', tool_input: patch, ...(cwd === undefined ? {} : { cwd }) },
          { contentPatterns: [], scopedBlocks: [group] },
        ),
      );

    await expect(evaluate(REPO_ROOT)).resolves.toStrictEqual({ kind: 'allow' });
    expect((await evaluate(`${REPO_ROOT}/nested`)).kind).toBe('deny-scoped-block');
    expect((await evaluate()).kind).toBe('deny-scoped-block');
    // A relative cwd has no place of its own and places nothing.
    expect((await evaluate('.')).kind).toBe('deny-scoped-block');
  });

  it("scans a moved file's whole content as entering its destination", async () => {
    const move = (hunk: string) =>
      `*** Begin Patch\n*** Update File: notes/source.md\n*** Move to: docs/moved.md\n${hunk}*** End Patch\n`;
    const evaluate = (patch: string, cwd?: string) =>
      copilotCompatStringRoute.evaluate(
        contextFor(
          { tool_name: 'Edit', tool_input: patch, ...(cwd === undefined ? {} : { cwd }) },
          {
            contentPatterns: [],
            scopedBlocks: [OWN_MARKER_EVERYWHERE],
            readPriorContent: (path) =>
              posixPath(path) === '/repo/notes/source.md' ? 'own-marker one\nown-marker two' : null,
          },
        ),
      );

    expect((await evaluate(move(''), '/repo')).kind).toBe('deny-scoped-block');
    // Deleting one of two occurrences leaves the other entering the destination.
    const oneRemoved = await evaluate(move('@@\n-own-marker one\n'), '/repo');
    expect(oneRemoved.kind).toBe('deny-scoped-block');
    // The whole source is new at the destination, so even a hunk that removes every
    // occurrence is refused: the guard never reconstructs a patch to find the marker gone.
    const allRemoved = await evaluate(move('@@\n-own-marker one\n-own-marker two\n'), '/repo');
    expect(allRemoved.kind).toBe('deny-scoped-block');
    // A source that cannot be read, or has no place to be read from, fails closed.
    await expect(evaluate(move(''), '/elsewhere')).rejects.toThrow('move source');
    await expect(evaluate(move(''))).rejects.toThrow('move source');
  });

  it('places a relative path against an absolute cwd only; a relative cwd leaves it unplaced', () => {
    // On Windows `resolve` places a path on a drive, so a placed path is compared with `/` separators.
    expect(placePath('docs/exempt/x.md', '/repo/nested')?.replaceAll('\\', '/')).toMatch(
      /^(?:[A-Za-z]:)?\/repo\/nested\/docs\/exempt\/x\.md$/u,
    );
    expect(placePath('docs/exempt/x.md', '.')).toBe('docs/exempt/x.md');
    expect(placePath('docs/exempt/x.md', undefined)).toBe('docs/exempt/x.md');
    expect(placePath('/elsewhere/x.md', '/repo')?.replaceAll('\\', '/')).toMatch(
      /^(?:[A-Za-z]:)?\/elsewhere\/x\.md$/u,
    );
    expect(placePath('/repo/docs/exempt/../../src/x.md', '/repo')?.replaceAll('\\', '/')).toMatch(
      /^(?:[A-Za-z]:)?\/repo\/src\/x\.md$/u,
    );
    expect(placePath(undefined, '/repo')).toBeUndefined();
  });

  it('rejects a malformed apply_patch program so the dispatcher fails closed', async () => {
    const context = contextFor(
      { tool_name: 'Edit', tool_input: 'not a patch' },
      { contentPatterns: [], scopedBlocks: [] },
    );

    await expect(copilotCompatStringRoute.evaluate(context)).rejects.toThrow(
      'apply_patch payload was invalid',
    );
  });
});
