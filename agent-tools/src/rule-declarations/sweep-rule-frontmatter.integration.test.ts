import { describe, expect, it } from 'vitest';

import type { SweepFs } from './sweep-fs.js';
import { sweepRuleFrontmatter } from './sweep-rule-frontmatter.js';

const REPO = '/repo';

const INDEX = [
  '| Rule | Classification | Trigger / Loading Signal |',
  '| ---- | -------------- | ------------------------ |',
  '| `.agent/rules/alpha.md` | core | — |',
  '| `.agent/rules/beta.md` | situational | surface:test-authoring |',
  '',
].join('\n');

function trigger(lines: readonly string[]): string {
  return ['---', ...lines, '---', '', 'Read and follow `.agent/rules/x.md`.', ''].join('\n');
}

/**
 * An in-memory tree keyed by absolute POSIX path; `other` names the entries that are not
 * regular files (a link, a directory); writes are recorded, never applied.
 */
function fakeFs(
  files: ReadonlyMap<string, string>,
  other: ReadonlySet<string> = new Set(),
  unreadable: ReadonlySet<string> = new Set(),
): SweepFs & { writes: Map<string, string> } {
  const writes = new Map<string, string>();
  return {
    writes,
    entryKind: async (absolutePath) => {
      if (other.has(absolutePath)) {
        return 'other';
      }
      return files.has(absolutePath) || unreadable.has(absolutePath) ? 'file' : 'absent';
    },
    readFile: async (absolutePath) => {
      if (unreadable.has(absolutePath)) {
        throw Object.assign(new Error('EACCES: permission denied'), { code: 'EACCES' });
      }
      const content = files.get(absolutePath);
      if (content === undefined) {
        throw Object.assign(new Error(`ENOENT: ${absolutePath}`), { code: 'ENOENT' });
      }
      return content;
    },
    writeFile: async (absolutePath, text) => {
      writes.set(absolutePath, text);
    },
  };
}

const agreeingTree = new Map<string, string>([
  [`${REPO}/RULES_INDEX.md`, INDEX],
  [`${REPO}/.agent/rules/alpha.md`, '# Alpha\n\nBody.\n'],
  [`${REPO}/.agent/rules/beta.md`, '# Beta\n\nBody.\n'],
  [`${REPO}/.cursor/rules/alpha.mdc`, trigger(['description: Alpha does a.', 'alwaysApply: true'])],
  [
    `${REPO}/.cursor/rules/beta.mdc`,
    trigger(['description: Beta does b.', 'alwaysApply: false', 'globs: "**/*.test.*"']),
  ],
  [`${REPO}/.claude/rules/alpha.md`, 'Read and follow `.agent/rules/alpha.md`.\n'],
  [
    `${REPO}/.claude/rules/beta.md`,
    "---\npaths:\n  - '**/*.test.*'\n---\n\nRead and follow `.agent/rules/beta.md`.\n",
  ],
]);

describe('sweepRuleFrontmatter', () => {
  it('derives one declaration per rule and writes the block above the unchanged rule text', async () => {
    const fs = fakeFs(agreeingTree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fs,
    );
    expect(outcome.refused).toEqual([]);
    expect(outcome.reconciliations).toEqual([]);
    expect(outcome.written).toEqual(['.agent/rules/alpha.md', '.agent/rules/beta.md']);
    expect(fs.writes.get(`${REPO}/.agent/rules/alpha.md`)).toBe(
      '---\nclassification: core\ndescription: Alpha does a.\n---\n\n# Alpha\n\nBody.\n',
    );
    expect(fs.writes.get(`${REPO}/.agent/rules/beta.md`)).toBe(
      [
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
        'Body.',
        '',
      ].join('\n'),
    );
  });

  it('writes nothing on a dry run and still reports the declarations', async () => {
    const fs = fakeFs(agreeingTree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: false },
      fs,
    );
    expect(outcome.written).toEqual([]);
    expect(outcome.declarations.map((declaration) => declaration.name)).toEqual(['alpha', 'beta']);
    expect(fs.writes.size).toBe(0);
  });

  it('leaves a rule that already carries a block alone and reports it, so a later pass is safe', async () => {
    const tree = new Map(agreeingTree);
    tree.set(
      `${REPO}/.agent/rules/alpha.md`,
      '---\nclassification: core\ndescription: a\n---\n\n# Alpha\n',
    );
    const fs = fakeFs(tree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fs,
    );
    expect(outcome.alreadyDeclared).toEqual(['.agent/rules/alpha.md']);
    expect(outcome.written).toEqual(['.agent/rules/beta.md']);
    expect(outcome.declarations.map((declaration) => declaration.name)).toEqual(['beta']);
  });

  it('refuses the whole sweep, writing nothing, when an index row names no tracked rule', async () => {
    const fs = fakeFs(agreeingTree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha'], write: true },
      fs,
    );
    expect(outcome.refused).toEqual(['RULES_INDEX.md: the row for beta names no tracked rule']);
    expect(outcome.written).toEqual([]);
    expect(fs.writes.size).toBe(0);
  });

  it('reports an already-declared rule without reading its projections: a generated adapter or a missing trigger refuses nothing', async () => {
    const tree = new Map(agreeingTree);
    tree.set(
      `${REPO}/.agent/rules/alpha.md`,
      '---\nclassification: situational\ndescription: a\ntrigger: surface:x\nglobs:\n  - "**/*.ts"\n---\n\n# Alpha\n',
    );
    // A declared rule's projections are never read (#74 round four): the Claude adapter is
    // unreadable and the trigger is gone altogether, and neither refuses anything.
    tree.delete(`${REPO}/.cursor/rules/alpha.mdc`);
    const fs = fakeFs(tree, new Set(), new Set([`${REPO}/.claude/rules/alpha.md`]));
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fs,
    );
    expect(outcome.refused).toEqual([]);
    expect(outcome.alreadyDeclared).toEqual(['.agent/rules/alpha.md']);
    expect(outcome.written).toEqual(['.agent/rules/beta.md']);
  });

  it('refuses an already-declared rule that has no index row, never counting it as swept', async () => {
    const tree = new Map(agreeingTree);
    tree.set(
      `${REPO}/RULES_INDEX.md`,
      [
        '| Rule | Classification | Trigger / Loading Signal |',
        '| ---- | -------------- | ------------------------ |',
        '| `.agent/rules/beta.md` | situational | surface:test-authoring |',
        '',
      ].join('\n'),
    );
    tree.set(
      `${REPO}/.agent/rules/alpha.md`,
      '---\nclassification: core\ndescription: a\n---\n\n# Alpha\n',
    );
    const fs = fakeFs(tree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fs,
    );
    expect(outcome.refused).toEqual(['.agent/rules/alpha.md: no row in RULES_INDEX.md']);
    expect(outcome.alreadyDeclared).toEqual([]);
    expect(fs.writes.size).toBe(0);
  });

  it('refuses the whole sweep, writing nothing, when one rule has no index row', async () => {
    const tree = new Map(agreeingTree);
    tree.set(`${REPO}/.agent/rules/gamma.md`, '# Gamma\n');
    const fs = fakeFs(tree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta', 'gamma'], write: true },
      fs,
    );
    expect(outcome.refused).toEqual(['.agent/rules/gamma.md: no row in RULES_INDEX.md']);
    expect(outcome.written).toEqual([]);
    expect(fs.writes.size).toBe(0);
  });

  it('refuses a rule whose Cursor trigger is missing, as a refusal rather than a crash', async () => {
    const tree = new Map(agreeingTree);
    tree.delete(`${REPO}/.cursor/rules/alpha.mdc`);
    const fs = fakeFs(tree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fs,
    );
    expect(outcome.refused).toEqual(['.cursor/rules/alpha.mdc: missing']);
    expect(fs.writes.size).toBe(0);
  });

  it('refuses a derived declaration that would not read back, writing nothing', async () => {
    const tree = new Map(agreeingTree);
    tree.set(
      `${REPO}/RULES_INDEX.md`,
      INDEX.replace('| surface:test-authoring |', '| surface:test-authoring — see `x` |'),
    );
    const fs = fakeFs(tree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fs,
    );
    expect(outcome.refused).toHaveLength(1);
    expect(outcome.refused[0]).toMatch(
      /^\.agent\/rules\/beta\.md: .*\(the derived declaration would not read back\)$/u,
    );
    expect(fs.writes.size).toBe(0);
  });

  it('refuses the sweep when the index is missing, as a refusal rather than a crash', async () => {
    const tree = new Map(agreeingTree);
    tree.delete(`${REPO}/RULES_INDEX.md`);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha'], write: true },
      fakeFs(tree),
    );
    expect(outcome.refused).toEqual(['RULES_INDEX.md: missing']);
  });

  it('refuses a rule file that is missing or unreadable, naming the path and the cause', async () => {
    const tree = new Map(agreeingTree);
    tree.delete(`${REPO}/.agent/rules/alpha.md`);
    const missing = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fakeFs(tree),
    );
    expect(missing.refused).toEqual(['.agent/rules/alpha.md: missing']);

    const denied = fakeFs(agreeingTree, new Set(), new Set([`${REPO}/.cursor/rules/alpha.mdc`]));
    const unreadable = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      denied,
    );
    expect(unreadable.refused).toEqual([
      '.cursor/rules/alpha.mdc: unreadable (EACCES: permission denied)',
    ]);
    expect(denied.writes.size).toBe(0);
  });

  it('refuses a rule that is a symlink or other special entry and writes nothing, so a link is never written through', async () => {
    const fs = fakeFs(agreeingTree, new Set([`${REPO}/.agent/rules/alpha.md`]));
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fs,
    );
    expect(outcome.refused).toEqual([
      '.agent/rules/alpha.md: not a regular file (a symlink or special entry); the sweep reads and writes regular files only',
    ]);
    expect(outcome.written).toEqual([]);
    expect(fs.writes.size).toBe(0);
  });

  it('refuses a rule whose leading frontmatter block is not a declaration, never skipping it', async () => {
    const tree = new Map(agreeingTree);
    tree.set(`${REPO}/.agent/rules/alpha.md`, '---\ntitle: Alpha\n---\n\n# Alpha\n');
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fakeFs(tree),
    );
    expect(outcome.refused).toEqual([
      '.agent/rules/alpha.md: unknown frontmatter key "title" (a block that is not a declaration)',
    ]);
    expect(outcome.alreadyDeclared).toEqual([]);
  });

  it('refuses the sweep when the index cannot be read', async () => {
    const tree = new Map(agreeingTree);
    tree.set(`${REPO}/RULES_INDEX.md`, '| `.agent/rules/alpha.md` | optional | — |\n');
    const fs = fakeFs(tree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha'], write: true },
      fs,
    );
    expect(outcome.refused).toEqual([
      '.agent/rules/alpha.md: classification must be core or situational, got "optional"',
    ]);
    expect(fs.writes.size).toBe(0);
  });

  it('refuses a rule whose Cursor trigger cannot be read, naming the file and the reason', async () => {
    const tree = new Map(agreeingTree);
    tree.set(`${REPO}/.cursor/rules/alpha.mdc`, trigger(['alwaysApply: true']));
    const fs = fakeFs(tree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: true },
      fs,
    );
    expect(outcome.refused).toEqual(['.cursor/rules/alpha.mdc: no description']);
    expect(fs.writes.size).toBe(0);
  });

  it('carries the reconciliations of every rule into the outcome', async () => {
    const tree = new Map(agreeingTree);
    tree.set(
      `${REPO}/.cursor/rules/beta.mdc`,
      trigger(['description: Beta does b.', 'alwaysApply: true']),
    );
    const fs = fakeFs(tree);
    const outcome = await sweepRuleFrontmatter(
      { repoRoot: REPO, ruleNames: ['alpha', 'beta'], write: false },
      fs,
    );
    expect(outcome.reconciliations.map((entry) => [entry.rule, entry.kind])).toEqual([
      ['beta', 'always-apply-true-on-situational'],
    ]);
  });

  it.each(['../../outside', 'a/b', String.raw`a\b`, '/abs', '', '.', '..', 'alpha.md'])(
    'refuses the rule name %j at the boundary before reading anything, so no name escapes .agent/rules',
    async (name) => {
      // An empty tree: had anything been read, the index would refuse as missing too.
      const fs = fakeFs(new Map());
      const outcome = await sweepRuleFrontmatter(
        { repoRoot: REPO, ruleNames: ['alpha', name], write: true },
        fs,
      );
      expect(outcome.refused).toEqual([
        `${JSON.stringify(name)}: not a rule basename (lowercase letters and digits in single-hyphen groups: one path segment, no dot segment, no .md suffix)`,
      ]);
      expect(outcome.written).toEqual([]);
      expect(fs.writes.size).toBe(0);
    },
  );
});
