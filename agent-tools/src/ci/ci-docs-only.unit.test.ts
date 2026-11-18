import { describe, expect, it } from 'vitest';

import { isDocsOnlyChange, parseChangedPaths } from './ci-docs-only.js';

describe('isDocsOnlyChange', () => {
  it('is true when every changed path is Markdown under .agent or the root docs folder', () => {
    expect(
      isDocsOnlyChange([
        '.agent/memory/active/napkin.md',
        'docs/governance/development-practice.md',
        '.agent/plans/delivery/reunify-oce-forks.plan.md',
      ]),
    ).toBe(true);
  });

  it('is false for an empty change: absence of evidence is not a docs-only change', () => {
    expect(isDocsOnlyChange([])).toBe(false);
  });

  it('is false when any one path is not Markdown', () => {
    expect(isDocsOnlyChange(['docs/a.md', 'docs/diagram.svg'])).toBe(false);
    expect(isDocsOnlyChange(['.agent/state/registry.json'])).toBe(false);
  });

  it('is false for Markdown outside .agent and the root docs folder', () => {
    expect(isDocsOnlyChange(['README.md'])).toBe(false);
    expect(isDocsOnlyChange(['linkedin/post.md'])).toBe(false);
    expect(isDocsOnlyChange(['.claude/rules/read-agent-md.md'])).toBe(false);
    expect(isDocsOnlyChange(['docs/a.md', 'apps/oak-search-cli/README.md'])).toBe(false);
  });

  it('is false for a docs folder that is not the root one', () => {
    expect(isDocsOnlyChange(['packages/sdks/oak-curriculum-sdk/docs/api/index.md'])).toBe(false);
    expect(isDocsOnlyChange(['apps/site/.agent/notes.md'])).toBe(false);
  });

  it('is false for a root file that only looks like one of the folders', () => {
    expect(isDocsOnlyChange(['docs.md'])).toBe(false);
    expect(isDocsOnlyChange(['.agent.md'])).toBe(false);
    expect(isDocsOnlyChange(['docs-archive/a.md'])).toBe(false);
  });

  it('is false for a path with an empty, current or parent segment', () => {
    expect(isDocsOnlyChange(['docs/../apps/site/page.md'])).toBe(false);
    expect(isDocsOnlyChange(['docs//a.md'])).toBe(false);
    expect(isDocsOnlyChange(['docs/./a.md'])).toBe(false);
  });

  it('matches the suffix exactly, so a longer extension is not Markdown', () => {
    expect(isDocsOnlyChange(['docs/a.mdx'])).toBe(false);
    expect(isDocsOnlyChange(['docs/a.md.ts'])).toBe(false);
    expect(isDocsOnlyChange(['docs/A.MD'])).toBe(false);
  });
});

describe('parseChangedPaths', () => {
  it('splits a NUL-separated list and drops the empty tail', () => {
    expect(parseChangedPaths('docs/a.md\0.agent/b.md\0')).toEqual(['docs/a.md', '.agent/b.md']);
  });

  it('keeps a path that contains a line break as one path', () => {
    expect(parseChangedPaths('docs/a\nb.md\0')).toEqual(['docs/a\nb.md']);
  });

  it('reads empty input as no paths', () => {
    expect(parseChangedPaths('')).toEqual([]);
  });
});
