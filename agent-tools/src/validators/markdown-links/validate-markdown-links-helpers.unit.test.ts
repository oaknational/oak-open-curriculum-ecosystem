import { describe, expect, it } from 'vitest';

import {
  extractMarkdownLinks,
  findBrokenLinks,
  isExcludedPath,
  resolveLinkTarget,
  suggestFix,
  type ScanFile,
} from './validate-markdown-links-helpers.js';

describe('isExcludedPath', () => {
  it('excludes any path containing /archive/', () => {
    expect(isExcludedPath('docs/archive/old.md')).toBe(true);
    expect(isExcludedPath('.agent/plans/archive/x/y.plan.md')).toBe(true);
  });

  it('excludes files ending .original.md', () => {
    expect(isExcludedPath('docs/report.original.md')).toBe(true);
  });

  it('excludes node_modules and .git', () => {
    expect(isExcludedPath('node_modules/pkg/README.md')).toBe(true);
    expect(isExcludedPath('.git/x.md')).toBe(true);
  });

  it('does not exclude ordinary doc surfaces', () => {
    expect(isExcludedPath('docs/governance/x.md')).toBe(false);
    expect(isExcludedPath('.agent/rules/y.md')).toBe(false);
    expect(isExcludedPath('README.md')).toBe(false);
  });

  it('does not treat a filename merely containing "archive" as archived', () => {
    expect(isExcludedPath('docs/archived-decisions-overview.md')).toBe(false);
  });
});

describe('resolveLinkTarget', () => {
  const source = 'docs/governance/index.md';

  it('resolves a relative target against the source directory', () => {
    expect(resolveLinkTarget(source, './sibling.md')).toBe('docs/governance/sibling.md');
    expect(resolveLinkTarget(source, '../architecture/adr.md')).toBe('docs/architecture/adr.md');
  });

  it('resolves a leading-slash target as repo-root-relative', () => {
    expect(resolveLinkTarget(source, '/README.md')).toBe('README.md');
    expect(resolveLinkTarget(source, '/docs/x/y.md')).toBe('docs/x/y.md');
  });

  it('strips a #fragment before resolving', () => {
    expect(resolveLinkTarget(source, './sibling.md#section')).toBe('docs/governance/sibling.md');
  });

  it('strips a trailing link title before resolving', () => {
    expect(resolveLinkTarget(source, './sibling.md "Title text"')).toBe(
      'docs/governance/sibling.md',
    );
  });

  it('URL-decodes percent-encoded path segments', () => {
    expect(resolveLinkTarget(source, './my%20file.md')).toBe('docs/governance/my file.md');
  });

  it('returns null for a pure fragment, an empty target, or a non-md target', () => {
    expect(resolveLinkTarget(source, '#section')).toBeNull();
    expect(resolveLinkTarget(source, '')).toBeNull();
    expect(resolveLinkTarget(source, './image.png')).toBeNull();
    expect(resolveLinkTarget(source, '../code/file.ts')).toBeNull();
  });

  it('resolves an .md target carrying only a fragment', () => {
    expect(resolveLinkTarget(source, '#frag-only')).toBeNull();
    expect(resolveLinkTarget(source, 'sibling.md#frag')).toBe('docs/governance/sibling.md');
  });
});

describe('extractMarkdownLinks', () => {
  const source = 'docs/x.md';

  it('extracts inline link targets', () => {
    const links = extractMarkdownLinks(source, 'see [a](./one.md) and [b](../two.md)');
    expect(links.map((l) => l.rawTarget)).toEqual(['./one.md', '../two.md']);
  });

  it('extracts reference-definition targets', () => {
    const links = extractMarkdownLinks(source, '[label]: ./def.md\n');
    expect(links.map((l) => l.rawTarget)).toEqual(['./def.md']);
  });

  it('ignores http(s) and mailto targets', () => {
    const links = extractMarkdownLinks(
      source,
      '[a](https://example.com) [b](http://x.org) [c](mailto:x@y.z)',
    );
    expect(links).toHaveLength(0);
  });

  it('ignores pure #fragment anchors', () => {
    expect(extractMarkdownLinks(source, '[a](#section)')).toHaveLength(0);
  });

  it('does NOT extract backticked paths (a backtick is a concept-name, not a link)', () => {
    expect(extractMarkdownLinks(source, 'the `./not-a-link.md` file is conceptual')).toHaveLength(
      0,
    );
    // A real link on the same line as a backticked path is still extracted.
    const mixed = extractMarkdownLinks(source, 'see `concept.md` then [real](./real.md)');
    expect(mixed.map((l) => l.rawTarget)).toEqual(['./real.md']);
  });

  it('does NOT extract links inside fenced code blocks (illustrative, not dependencies)', () => {
    const fenced = '```markdown\nsee [a](./not-a-link.md)\n```';
    expect(extractMarkdownLinks(source, fenced)).toHaveLength(0);
    // Fence with an info string, then a real link after the block closes.
    const afterFence = '```ts\nconst x = "[a](./inside.md)";\n```\nthen [real](./after.md)';
    expect(extractMarkdownLinks(source, afterFence).map((l) => l.rawTarget)).toEqual([
      './after.md',
    ]);
    // Tilde fences are equivalent.
    expect(extractMarkdownLinks(source, '~~~\n[a](./tilde.md)\n~~~')).toHaveLength(0);
  });

  it('extracts only reference DEFINITIONS, not reference-style usages (documented boundary)', () => {
    // `[text][label]` usage carries no path; the `[label]: target` definition does.
    const links = extractMarkdownLinks(source, '[see this][label]\n[label]: ./def.md');
    expect(links.map((l) => l.rawTarget)).toEqual(['./def.md']);
  });

  it('does not resolve angle-bracket link targets (documented limitation — not checked)', () => {
    // CommonMark `[a](<./path.md>)` is valid but rare. The bracketed target does not end in
    // `.md`, so resolveLinkTarget returns null and the link is silently not checked. Documented
    // so that supporting `<...>` later is a deliberate decision, not a surprise.
    expect(resolveLinkTarget(source, '<./angled.md>')).toBeNull();
  });

  it('records 1-based line numbers', () => {
    const links = extractMarkdownLinks(source, 'line one\nsee [a](./one.md)');
    expect(links[0].line).toBe(2);
  });

  it('extracts multiple links from one line', () => {
    expect(extractMarkdownLinks(source, '[a](./a.md) and [b](./b.md)')).toHaveLength(2);
  });
});

describe('suggestFix', () => {
  const source = 'docs/governance/index.md';

  it('suggests a repo-relative fix when exactly one non-archive basename match exists', () => {
    const repoFiles = ['docs/architecture/moved.md'];
    expect(suggestFix(source, 'docs/governance/moved.md', repoFiles)).toBe(
      '../architecture/moved.md',
    );
  });

  it('emits no fix when zero basename matches exist (deleted/renamed)', () => {
    expect(suggestFix(source, 'docs/governance/gone.md', [])).toBeNull();
  });

  it('emits no fix when more than one basename match exists (ambiguous)', () => {
    const repoFiles = ['docs/a/dup.md', 'docs/b/dup.md'];
    expect(suggestFix(source, 'docs/governance/dup.md', repoFiles)).toBeNull();
  });

  it('ignores archive matches when counting basename candidates', () => {
    const repoFiles = ['docs/live/only.md', 'docs/archive/only.md'];
    expect(suggestFix(source, 'docs/governance/only.md', repoFiles)).toBe('../live/only.md');
  });

  it('produces a same-directory fix without a leading ./', () => {
    const repoFiles = ['docs/governance/here.md'];
    // The fix is the correct repo-relative path from the source dir.
    expect(suggestFix(source, 'docs/governance/wrong-depth/here.md', repoFiles)).toBe('here.md');
  });
});

describe('findBrokenLinks', () => {
  it('flags a link whose resolved target does not exist among repo files', () => {
    const files: ScanFile[] = [{ path: 'docs/x.md', content: 'see [a](./missing.md)' }];
    const repoFiles = ['docs/x.md'];
    const report = findBrokenLinks(files, repoFiles);
    expect(report.broken).toHaveLength(1);
    expect(report.broken[0].resolvedTarget).toBe('docs/missing.md');
    expect(report.totals.brokenLinks).toBe(1);
  });

  it('does not flag a link whose resolved target exists', () => {
    const files: ScanFile[] = [{ path: 'docs/x.md', content: 'see [a](./present.md)' }];
    const repoFiles = ['docs/x.md', 'docs/present.md'];
    const report = findBrokenLinks(files, repoFiles);
    expect(report.broken).toHaveLength(0);
    expect(report.totals.linksChecked).toBe(1);
  });

  it('attaches a suggestedFix for a broken link with a unique basename elsewhere', () => {
    const files: ScanFile[] = [{ path: 'docs/governance/x.md', content: 'see [a](./moved.md)' }];
    const repoFiles = ['docs/governance/x.md', 'docs/architecture/moved.md'];
    const report = findBrokenLinks(files, repoFiles);
    expect(report.broken[0].suggestedFix).toBe('../architecture/moved.md');
    expect(report.totals.autoFixable).toBe(1);
    expect(report.totals.manual).toBe(0);
  });

  it('marks a broken link manual when no suggestion exists', () => {
    const files: ScanFile[] = [{ path: 'docs/x.md', content: 'see [a](./gone.md)' }];
    const report = findBrokenLinks(files, ['docs/x.md']);
    expect(report.broken[0].suggestedFix).toBeNull();
    expect(report.totals.manual).toBe(1);
    expect(report.totals.autoFixable).toBe(0);
  });

  it('counts files scanned and only checks .md links', () => {
    const files: ScanFile[] = [
      { path: 'docs/x.md', content: 'text [img](./pic.png) [doc](./y.md)' },
    ];
    const report = findBrokenLinks(files, ['docs/x.md', 'docs/y.md']);
    expect(report.totals.filesScanned).toBe(1);
    expect(report.totals.linksChecked).toBe(1);
  });

  it('treats a leading-slash link as repo-root-relative when checking existence', () => {
    const files: ScanFile[] = [{ path: 'docs/deep/x.md', content: 'see [root](/README.md)' }];
    const report = findBrokenLinks(files, ['docs/deep/x.md', 'README.md']);
    expect(report.broken).toHaveLength(0);
  });

  it('groups broken links by source file in the report', () => {
    const files: ScanFile[] = [
      { path: 'docs/a.md', content: '[x](./gone1.md) [y](./gone2.md)' },
      { path: 'docs/b.md', content: '[z](./gone3.md)' },
    ];
    const report = findBrokenLinks(files, ['docs/a.md', 'docs/b.md']);
    const bySource = new Map(report.byFile.map((g) => [g.sourcePath, g.links.length]));
    expect(bySource.get('docs/a.md')).toBe(2);
    expect(bySource.get('docs/b.md')).toBe(1);
  });
});
