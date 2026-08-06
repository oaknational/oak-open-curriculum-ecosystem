import { describe, expect, it } from 'vitest';

import type { WorkspaceItem, WorkspacePage } from './content-workspace-model.js';
import { renderItem } from './render-item.js';
import { renderDomainPages } from './render-domain-index.js';
import { orphanedPages, stalePages } from './render-workspace.js';

function workspaceItem(overrides: Partial<WorkspaceItem> = {}): WorkspaceItem {
  return {
    id: 'C001',
    title: 'GREETING',
    reviewDomain: 'pedagogy',
    impactTier: 'high-impact',
    surfaceType: 'tool-guidance',
    behaviouralIntent: 'Point the agent at the orientation tool.',
    authority: 'workspace',
    workspaceScope: 'in',
    status: 'live',
    registrationSelectors: ['docs://oak/guidance/find-lessons.md'],
    sourceFiles: ['packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts'],
    baselineFile: 'packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts',
    revision: 'relocated',
    excerpt: "export const GREETING = 'Call get-curriculum-model first.';",
    excerptProvenance: 'current-source',
    excerptTruncated: false,
    flags: ['user-input-interpolation'],
    ...overrides,
  };
}

describe('renderItem', () => {
  it('shows the words, the intent, the reachability, and the file to change', () => {
    const rendered = renderItem(workspaceItem());

    expect(rendered).toContain('### C001 — GREETING');
    expect(rendered).toContain("export const GREETING = 'Call get-curriculum-model first.';");
    expect(rendered).toContain('Point the agent at the orientation tool.');
    expect(rendered).toContain('Live — an agent can reach these words today');
    expect(rendered).toContain('src/mcp/orientation-guidance.ts');
    expect(rendered).toContain('user-input-interpolation');
  });

  it('sends a reviewer to the owning repository when the words are authored upstream', () => {
    const rendered = renderItem(workspaceItem({ authority: 'upstream-api' }));

    expect(rendered).toContain('oaknational/oak-api');
  });

  it('fences an excerpt that itself contains a code fence', () => {
    const rendered = renderItem(workspaceItem({ excerpt: '```json\n{"a": 1}\n```' }));

    expect(rendered).toContain('````text');
  });

  it('says when an excerpt is only part of the item', () => {
    const rendered = renderItem(workspaceItem({ excerptTruncated: true }));

    expect(rendered).toContain('Shown in part only');
  });

  it('marks a baseline-sourced excerpt as not being the current wording', () => {
    const rendered = renderItem(workspaceItem({ excerptProvenance: 'baseline-snippet' }));

    expect(rendered).toContain('What it said at the audit baseline');
  });
});

describe('renderDomainPages', () => {
  it('keeps a small domain on a single page', () => {
    const items = [workspaceItem()];

    const pages = renderDomainPages('pedagogy', items);

    expect(pages).toHaveLength(1);
    expect(pages[0]?.path).toBe('docs/governance/model-behaviour-content/domains/pedagogy.md');
  });

  it('divides a large domain by surface type and leaves the domain page as a route', () => {
    const items = [
      ...Array.from({ length: 80 }, (_, index) =>
        workspaceItem({ id: `C${String(index)}`, surfaceType: 'tool-title' }),
      ),
      ...Array.from({ length: 40 }, (_, index) =>
        workspaceItem({ id: `D${String(index)}`, surfaceType: 'tool-description' }),
      ),
    ];

    const pages = renderDomainPages('tool-usability', items);
    const paths = pages.map((page) => page.path);

    expect(paths).toContain('docs/governance/model-behaviour-content/domains/tool-usability.md');
    expect(paths).toContain(
      'docs/governance/model-behaviour-content/domains/tool-usability--tool-title.md',
    );
    expect(paths).toContain(
      'docs/governance/model-behaviour-content/domains/tool-usability--tool-description.md',
    );
    expect(pages[0]?.content).toContain('too many to read in one sitting');
  });

  it('places every item of a divided domain on exactly one page', () => {
    const items = Array.from({ length: 150 }, (_, index) =>
      workspaceItem({
        id: `C${String(index)}`,
        surfaceType: index % 2 === 0 ? 'tool-title' : 'tool-description',
      }),
    );

    const pages = renderDomainPages('tool-usability', items);
    const appearances = items.map(
      (item) => pages.filter((page) => page.content.includes(`### ${item.id} —`)).length,
    );

    expect(appearances.every((count) => count === 1)).toBe(true);
  });
});

describe('staleness detection', () => {
  const page: WorkspacePage = { path: 'docs/a.md', content: 'expected' };

  it('passes when the committed page matches a fresh render', () => {
    expect(stalePages([page], new Map([['docs/a.md', 'expected']]))).toEqual([]);
  });

  it('catches a hand-edited page', () => {
    expect(stalePages([page], new Map([['docs/a.md', 'edited by hand']]))).toEqual(['docs/a.md']);
  });

  it('catches a page that was never written', () => {
    expect(stalePages([page], new Map([['docs/a.md', null]]))).toEqual(['docs/a.md']);
  });

  it('catches a committed page the generator no longer produces', () => {
    expect(orphanedPages([page], ['docs/a.md', 'docs/gone.md'])).toEqual(['docs/gone.md']);
  });
});
