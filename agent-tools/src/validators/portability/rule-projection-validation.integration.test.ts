import { describe, expect, it } from 'vitest';

import { validateRuleProjections } from './rule-projection-validation.js';
import { fakeProjectionRepo } from './test-helpers/fake-projection-repo.js';

const CORE_RULE = '---\nclassification: core\ndescription: Alpha does a.\n---\n\n# Alpha\n';
const SCOPED_RULE = [
  '---',
  'classification: situational',
  'description: Beta does b.',
  'trigger: surface:test-authoring',
  'globs:',
  '  - "**/*.test.*"',
  '---',
  '',
  '# Beta',
  '',
].join('\n');

function bareRepo(): ReturnType<typeof fakeProjectionRepo> {
  return fakeProjectionRepo(
    new Map([
      ['.agent/rules/alpha.md', CORE_RULE],
      ['.agent/rules/beta.md', SCOPED_RULE],
    ]),
  );
}

describe('validateRuleProjections', () => {
  it('reports every projection missing on a bare repository, and writes them all in fix mode', async () => {
    const repo = bareRepo();
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toStrictEqual(
      [
        'RULES_INDEX.md',
        '.cursor/rules/alpha.mdc',
        '.claude/rules/alpha.md',
        '.agents/rules/alpha.md',
        '.cursor/rules/beta.mdc',
        '.claude/rules/beta.md',
        '.agents/rules/beta.md',
      ].map((file) => `${file}: missing rule projection (run \`pnpm portability:fix\`)`),
    );

    const fix = await validateRuleProjections(true, repo);
    expect(fix.issues).toEqual([]);
    expect(fix.written).toHaveLength(7);
    expect(repo.files.get('.claude/rules/beta.md')).toBe(
      '---\npaths:\n  - "**/*.test.*"\n---\n\nRead and follow `.agent/rules/beta.md`.\n',
    );
    expect(repo.files.get('RULES_INDEX.md')).toContain('| `.agent/rules/alpha.md` | core | — |');

    const again = await validateRuleProjections(false, repo);
    expect(again.issues).toEqual([]);
  });

  it('reports a hand-edited projection as drifted and restores it in fix mode', async () => {
    const repo = bareRepo();
    await validateRuleProjections(true, repo);
    repo.files.set('.cursor/rules/alpha.mdc', 'edited by hand\n');
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toEqual([
      ".cursor/rules/alpha.mdc: drifted from the rule's declaration; projections are never hand-edited (run `pnpm portability:fix`)",
    ]);
    const fix = await validateRuleProjections(true, repo);
    expect(fix.written).toEqual(['.cursor/rules/alpha.mdc']);
    expect(repo.files.get('.cursor/rules/alpha.mdc')).toContain('description: Alpha does a.');
  });

  it('reports a projection with no rule behind it as stale and removes it in fix mode', async () => {
    const repo = bareRepo();
    await validateRuleProjections(true, repo);
    repo.files.set('.claude/rules/gone.md', 'Read and follow `.agent/rules/gone.md`.\n');
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toEqual([
      '.claude/rules/gone.md: no canonical rule renders it (run `pnpm portability:fix` to remove it)',
    ]);
    const fix = await validateRuleProjections(true, repo);
    expect(fix.removed).toEqual(['.claude/rules/gone.md']);
    expect(repo.files.has('.claude/rules/gone.md')).toBe(false);
  });

  it('refuses to act when the canonical rules directory is absent, touching nothing', async () => {
    const repo = bareRepo();
    await validateRuleProjections(true, repo);
    repo.files.delete('.agent/rules/alpha.md');
    repo.files.delete('.agent/rules/beta.md');
    const before = new Map(repo.files);
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toStrictEqual([
      '.agent/rules: no such directory; refusing to regenerate the rule projections',
    ]);
    const fix = await validateRuleProjections(true, repo);
    expect(fix).toStrictEqual({
      issues: check.issues,
      canonicalRuleCount: 0,
      written: [],
      removed: [],
    });
    expect(repo.files).toStrictEqual(before);
  });

  it('refuses to act when the canonical rules directory is unreadable or holds no rules', async () => {
    const unreadable = fakeProjectionRepo(
      bareRepo().files,
      new Map([['.agent/rules', { kind: 'unreadable', cause: 'EACCES: permission denied' }]]),
    );
    expect((await validateRuleProjections(true, unreadable)).issues).toStrictEqual([
      '.agent/rules: unreadable (EACCES: permission denied); refusing to regenerate the rule projections',
    ]);

    const projected = bareRepo();
    await validateRuleProjections(true, projected);
    const empty = fakeProjectionRepo(
      projected.files,
      new Map([['.agent/rules', { kind: 'files', files: [], stray: [] }]]),
    );
    const fix = await validateRuleProjections(true, empty);
    expect(fix.issues).toStrictEqual([
      '.agent/rules: no canonical rules; refusing to regenerate the rule projections from an empty set',
    ]);
    expect(fix.removed).toStrictEqual([]);
    expect(empty.files.has('.claude/rules/alpha.md')).toBe(true);
  });

  it('refuses a regular file on the canonical surface that is not a rule, touching nothing', async () => {
    const repo = bareRepo();
    await validateRuleProjections(true, repo);
    repo.files.set('.agent/rules/README.txt', 'not a rule\n');
    const before = new Map(repo.files);
    const fix = await validateRuleProjections(true, repo);
    expect(fix.issues).toStrictEqual([
      '.agent/rules/README.txt: not a rule; the canonical rules directory admits .md rules only',
    ]);
    expect(repo.files).toStrictEqual(before);
  });

  it('reads a regular file without the extension on a projection surface as stale and removes it', async () => {
    const repo = bareRepo();
    await validateRuleProjections(true, repo);
    repo.files.set('.claude/rules/README.txt', 'hand-authored\n');
    repo.files.set('.cursor/rules/alpha.mdc.bak', 'a backup\n');
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toStrictEqual([
      '.claude/rules/README.txt: no canonical rule renders it (run `pnpm portability:fix` to remove it)',
      '.cursor/rules/alpha.mdc.bak: no canonical rule renders it (run `pnpm portability:fix` to remove it)',
    ]);
    const fix = await validateRuleProjections(true, repo);
    expect(fix.removed).toStrictEqual(['.claude/rules/README.txt', '.cursor/rules/alpha.mdc.bak']);
    expect(repo.files.has('.claude/rules/README.txt')).toBe(false);
  });

  it('refuses when a canonical rule is unreadable, naming it, and writes nothing', async () => {
    const repo = fakeProjectionRepo(
      bareRepo().files,
      new Map(),
      new Map([
        ['.agent/rules/beta.md', { kind: 'unreadable', cause: 'EACCES: permission denied' }],
      ]),
    );
    const fix = await validateRuleProjections(true, repo);
    expect(fix.issues).toStrictEqual([
      '.agent/rules/beta.md: unreadable (EACCES: permission denied); refusing to regenerate the rule projections',
    ]);
    expect(fix.written).toStrictEqual([]);
    expect(repo.files.has('RULES_INDEX.md')).toBe(false);
  });

  it('refuses when the index is a symlink or unreadable, rather than reading it as absent and writing over it', async () => {
    const linked = fakeProjectionRepo(
      bareRepo().files,
      new Map(),
      new Map([['RULES_INDEX.md', { kind: 'foreign' }]]),
    );
    const fix = await validateRuleProjections(true, linked);
    expect(fix.issues).toStrictEqual([
      'RULES_INDEX.md: not a regular file; the rule surfaces admit regular files only',
    ]);
    expect(fix.written).toStrictEqual([]);

    const unreadable = fakeProjectionRepo(
      bareRepo().files,
      new Map(),
      new Map([['RULES_INDEX.md', { kind: 'unreadable', cause: 'EIO: i/o error' }]]),
    );
    expect((await validateRuleProjections(true, unreadable)).issues).toStrictEqual([
      'RULES_INDEX.md: unreadable (EIO: i/o error); refusing to regenerate the rule projections',
    ]);
  });

  it('refuses when an existing projection cannot be read, rather than aborting or writing', async () => {
    const repo = bareRepo();
    await validateRuleProjections(true, repo);
    const unreadable = fakeProjectionRepo(
      repo.files,
      new Map(),
      new Map([
        ['.claude/rules/alpha.md', { kind: 'unreadable', cause: 'EACCES: permission denied' }],
      ]),
    );
    unreadable.files.set('.claude/rules/beta.md', 'edited by hand\n');
    const fix = await validateRuleProjections(true, unreadable);
    expect(fix.issues).toStrictEqual([
      '.claude/rules/alpha.md: unreadable (EACCES: permission denied); refusing to regenerate the rule projections',
    ]);
    expect(fix.written).toStrictEqual([]);
    expect(unreadable.files.get('.claude/rules/beta.md')).toBe('edited by hand\n');
  });

  it('refuses to act when a surface holds a symlink or special entry, so no write follows a link', async () => {
    const repo = fakeProjectionRepo(
      bareRepo().files,
      new Map([['.claude/rules', { kind: 'foreign', entry: '.claude/rules/alpha.md' }]]),
    );
    const fix = await validateRuleProjections(true, repo);
    expect(fix.issues).toStrictEqual([
      '.claude/rules/alpha.md: not a regular file; the rule surfaces admit regular files only',
    ]);
    expect(fix.written).toStrictEqual([]);
    expect(repo.files.has('RULES_INDEX.md')).toBe(false);
  });

  it('refuses to act when a surface holds a subdirectory, which the platform would read and the gate would not', async () => {
    const repo = fakeProjectionRepo(
      bareRepo().files,
      new Map([['.claude/rules', { kind: 'foreign', entry: '.claude/rules/local' }]]),
    );
    const fix = await validateRuleProjections(true, repo);
    expect(fix.issues).toStrictEqual([
      '.claude/rules/local: not a regular file; the rule surfaces admit regular files only',
    ]);
    expect(fix.written).toStrictEqual([]);
  });

  it('refuses a canonical rule whose name a code span, a table cell or a path cannot carry', async () => {
    const repo = bareRepo();
    repo.files.set('.agent/rules/al`pha.md', CORE_RULE);
    const fix = await validateRuleProjections(true, repo);
    expect(fix.issues).toStrictEqual([
      '.agent/rules/al`pha.md: "al`pha": not a rule basename (lowercase letters and digits in single-hyphen groups: one path segment, no dot segment, no .md suffix)',
    ]);
    expect(fix.written).toStrictEqual([]);
    expect(repo.files.has('RULES_INDEX.md')).toBe(false);
  });

  it('ends a fix run at a refused mutation, reporting it with what was written before it', async () => {
    const repo = fakeProjectionRepo(
      bareRepo().files,
      new Map(),
      new Map(),
      new Set(['.claude/rules/alpha.md']),
    );
    const fix = await validateRuleProjections(true, repo);
    expect(fix.issues).toStrictEqual([
      '.claude/rules/alpha.md: not a regular file at the moment of the write; refusing the projection write',
    ]);
    expect(fix.written).toStrictEqual(['RULES_INDEX.md', '.cursor/rules/alpha.mdc']);
    expect(repo.files.has('.agents/rules/alpha.md')).toBe(false);
  });

  it('refuses to render anything while one rule has no declaration, naming the rule', async () => {
    const repo = bareRepo();
    repo.files.set('.agent/rules/gamma.md', '# Gamma\n');
    const check = await validateRuleProjections(false, repo);
    expect(check.issues).toEqual([
      ".agent/rules/gamma.md: no frontmatter block (declare it in the rule's frontmatter)",
    ]);
    const fix = await validateRuleProjections(true, repo);
    expect(fix.written).toEqual([]);
    expect(repo.files.has('RULES_INDEX.md')).toBe(false);
  });
});
