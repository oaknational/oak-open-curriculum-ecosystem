import { describe, expect, it } from 'vitest';

import { extractPathCitations, findMissingPathCitations } from './validate-cited-paths-helpers.js';

describe('extractPathCitations', () => {
  it('reads every line of a fenced block and only code spans outside it', () => {
    const content = [
      'Prose naming .agent/rules/ without code formatting is not a citation.',
      'Read `.agent/directives/AGENT.md` first.',
      '```bash',
      'cat docs/architecture/README.md   # the overview',
      '```',
      'and docs/README.md in prose is ignored too.',
    ].join('\n');

    expect(extractPathCitations(content).map((c) => [c.line, c.target])).toStrictEqual([
      [2, '.agent/directives/AGENT.md'],
      [4, 'docs/architecture/README.md'],
    ]);
  });

  it.each([
    ['an anchor', '`.agent/directives/AGENT.md#grounding`', '.agent/directives/AGENT.md'],
    ['a line suffix', '`.agent/rules/x.md:12`', '.agent/rules/x.md'],
    ['a line and column suffix', '`.agent/rules/x.md:12:4`', '.agent/rules/x.md'],
    ['a trailing slash', '`.agent/skills/`', '.agent/skills'],
    ['trailing sentence punctuation', '`docs/README.md`.', 'docs/README.md'],
    ['punctuation inside the span', '`(see docs/README.md).`', 'docs/README.md'],
    ['a path inside a command', '`cat .agent/README.md | head`', '.agent/README.md'],
  ])('strips %s from the target', (_label, content, target) => {
    expect(extractPathCitations(content).map((c) => c.target)).toStrictEqual([target]);
  });

  it.each([
    ['a glob', '`.agent/rules/*.md`'],
    ['a placeholder segment', '`.agent/memory/operational/threads/<slug>.next-session.md`'],
    ['a date placeholder', '`.agent/experience/YYYY-MM-DD-name.md`'],
    ['an ellipsis', '`.agent/skills/.../SKILL-CANONICAL.md`'],
    ['a template expression', '`.agent/state/${name}.json`'],
    ['a parent-directory segment', '`.agent/../secrets`'],
    ['a path with another prefix', '`agent-tools/src/index.ts`'],
    ['a patterns segment after another directory', '`active/patterns/x.md`'],
    ['a parent-relative patterns path', '`../patterns/x.md`'],
    ['a bare prefix word', '`docs`'],
  ])('omits %s rather than guessing', (_label, content) => {
    expect(extractPathCitations(content)).toStrictEqual([]);
  });

  it('resolves a citation written relative to the patterns directory, as doctrine cites a pattern, against that directory, keeping the token as written', () => {
    const content =
      'The dual of `patterns/referent-narrowing.md`; see `patterns/README.md#polarity`.';

    expect(extractPathCitations(content)).toStrictEqual([
      {
        line: 1,
        match: 'patterns/referent-narrowing.md',
        target: '.agent/memory/active/patterns/referent-narrowing.md',
      },
      {
        line: 1,
        match: 'patterns/README.md#polarity',
        target: '.agent/memory/active/patterns/README.md',
      },
    ]);
  });

  it('reads a rooted patterns path once, never again as a relative citation, and omits the bare directory word', () => {
    const content = '`.agent/memory/active/patterns/x.md` and `patterns/` and `patterns`';

    expect(extractPathCitations(content).map((c) => c.target)).toStrictEqual([
      '.agent/memory/active/patterns/x.md',
    ]);
  });

  it('reports the token as written and the line of each citation', () => {
    const content = '```text\n\n  .agent/rules/x.md#why, .agent/skills/y/\n```';

    expect(extractPathCitations(content)).toStrictEqual([
      { line: 3, match: '.agent/rules/x.md#why', target: '.agent/rules/x.md' },
      { line: 3, match: '.agent/skills/y/', target: '.agent/skills/y' },
    ]);
  });
});

describe('findMissingPathCitations', () => {
  const existing = new Set(['.agent/directives/AGENT.md', 'docs/README.md']);
  const exists = (target: string): boolean => existing.has(target);

  it('returns no findings when every citation resolves', () => {
    const files = [
      {
        path: '.agent/rules/a.md',
        content: 'Read `.agent/directives/AGENT.md` and `docs/README.md`.',
      },
    ];

    expect(findMissingPathCitations(files, exists)).toStrictEqual([]);
  });

  it('never resolves a citation that an import provenance names as a source repo-relative path, wrapped or not', () => {
    const files = [
      {
        path: '.agent/skills/x/SKILL-CANONICAL.md',
        content: [
          'Imported from a sibling Practice (source repo-relative',
          'path `.agent/skills/x/SKILL-CANONICAL.md`; see `.agent/rules/also-gone.md`).',
          'See `.agent/memory/active/patterns/gone.md`.',
        ].join('\n'),
      },
    ];
    expect(findMissingPathCitations(files, () => false)).toEqual([
      {
        path: '.agent/skills/x/SKILL-CANONICAL.md',
        line: 2,
        match: '.agent/rules/also-gone.md',
        target: '.agent/rules/also-gone.md',
      },
      {
        path: '.agent/skills/x/SKILL-CANONICAL.md',
        line: 3,
        match: '.agent/memory/active/patterns/gone.md',
        target: '.agent/memory/active/patterns/gone.md',
      },
    ]);
  });

  it('reports each citation of an absent target with its source line', () => {
    const files = [
      {
        path: '.agent/rules/a.md',
        content: 'See `.agent/memory/active/patterns/gone.md`.\n\nAnd `.agent/skills/free-play/`.',
      },
    ];

    expect(findMissingPathCitations(files, exists)).toStrictEqual([
      {
        path: '.agent/rules/a.md',
        line: 1,
        match: '.agent/memory/active/patterns/gone.md',
        target: '.agent/memory/active/patterns/gone.md',
      },
      {
        path: '.agent/rules/a.md',
        line: 3,
        match: '.agent/skills/free-play/',
        target: '.agent/skills/free-play',
      },
    ]);
  });
});
