import { describe, expect, it } from 'vitest';

import type { WorkspaceInputs, WorkspaceItem, WorkspacePage } from './content-workspace-model.js';
import { renderItem } from './render-item.js';
import { renderDomainPages } from './render-domain-index.js';
import { orphanedPages, stalePages } from './render-workspace.js';
import { renderServedSurfacePage } from './render-auxiliary-pages.js';
import { domainCounts } from './workspace-counts.js';

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
    registrationSelectors: [{ selector: 'docs://oak/guidance/find-lessons.md', state: 'live' }],
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

  it('escapes angle brackets so a placeholder title survives Markdown rendering', () => {
    const page = renderItem(workspaceItem({ title: 'The <name> placeholder in <h1>' }));

    expect(page).toContain(String.raw`\<name\>`);
    expect(page).not.toContain('<h1>');
  });

  it('lists a dormant registration as switched off, never as reaching an agent', () => {
    const page = renderItem(
      workspaceItem({
        status: 'dormant',
        registrationSelectors: [{ selector: 'docs://oak/legacy.md', state: 'dormant' }],
      }),
    );

    expect(page).toContain('**Retained but not registered at:** `docs://oak/legacy.md`');
    expect(page).not.toContain('Reaches an agent through');
  });

  it('labels each surface of a mixed item by its own state', () => {
    const page = renderItem(
      workspaceItem({
        status: 'mixed',
        registrationSelectors: [
          { selector: 'search', state: 'live' },
          { selector: 'legacy-search', state: 'dormant' },
        ],
      }),
    );

    expect(page).toContain('**Reaches an agent through:** `search`');
    expect(page).toContain('**Retained but not registered at:** `legacy-search`');
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

describe('retired-item accounting', () => {
  it('counts a retired item once, as retired, never as ours to change', () => {
    const [count] = domainCounts([
      workspaceItem({ id: 'C001', authority: 'workspace', status: 'live' }),
      workspaceItem({ id: 'C002', authority: 'workspace', status: 'retired' }),
      workspaceItem({ id: 'C003', authority: 'upstream-api', status: 'unbound' }),
    ]);

    expect(count).toMatchObject({ total: 3, ownedHere: 1, ownedUpstream: 1, retired: 1 });
  });

  it('keeps a retired item out of the split-domain ownership columns', () => {
    const items = Array.from({ length: 120 }, (_, index) =>
      workspaceItem({
        id: `C${String(index).padStart(3, '0')}`,
        surfaceType: index < 80 ? 'tool-guidance' : 'error-message',
        status: index === 0 ? 'retired' : 'live',
      }),
    );

    const index = renderDomainPages('pedagogy', items).find((page) =>
      page.path.endsWith('pedagogy.md'),
    );

    expect(index?.content).toContain(
      '| Section | Items | Ours to change | Owned elsewhere | Retired |',
    );
    expect(index?.content).toContain('| 80 | 79 | 0 | 1 |');
  });
});

describe('page banner', () => {
  it('states the sign-off on the owner-signed view instead of denying it', () => {
    const [signed] = renderDomainPages('owner-signed-copy', [
      workspaceItem({ id: 'A011', reviewDomain: 'owner-signed-copy' }),
    ]);
    const [other] = renderDomainPages('pedagogy', [workspaceItem()]);

    expect(signed?.content).toContain('carry an explicit owner sign-off');
    expect(signed?.content).not.toContain('not what anyone has signed off');
    expect(other?.content).toContain('Nothing here has been approved yet');
  });
});

describe('domain summary sentence', () => {
  it('counts an item reaching both live and dormant surfaces separately from the untraced', () => {
    const [page] = renderDomainPages('pedagogy', [
      workspaceItem({ id: 'C001', status: 'mixed' }),
      workspaceItem({ id: 'C002', status: 'unbound' }),
      workspaceItem({ id: 'C003', status: 'unbound' }),
    ]);

    expect(page?.content).toContain('1 to both a reachable and a switched-off surface');
    expect(page?.content).toContain('2 live in code that ships, but this pass has not traced');
  });
});

describe('renderServedSurfacePage', () => {
  const inputs: WorkspaceInputs = {
    registry: { meta: { upstream_pointers: {} }, items: [] },
    current: {
      provenance: { baselineCommit: 'abc123' },
      items: [],
      registrationRoots: [
        {
          id: 'oak-curriculum-http',
          observation: {
            initialize: { instructions: 'present' },
            tools: { live: ['search'], dormant: ['legacy-search'] },
            resources: { live: [], dormant: ['docs://old'] },
            prompts: { capability: 'absent', list: 'method-not-found' },
          },
        },
        {
          id: 'second-root',
          observation: {
            initialize: { instructions: 'absent' },
            tools: { live: [], dormant: [] },
            resources: { live: [], dormant: [] },
            prompts: { capability: 'present', list: 'available' },
          },
        },
      ],
    },
    sourceText: new Map(),
    anchorsById: new Map(),
    additionTextById: new Map(),
  };

  it('renders every root with its instructions, tools, resources and prompts', () => {
    const page = renderServedSurfacePage(inputs);

    expect(page).toContain('## Registration root `oak-curriculum-http`');
    expect(page).toContain('## Registration root `second-root`');
    expect(page).toContain('### Instructions sent on connection — present');
    expect(page).toContain('### Instructions sent on connection — absent');
    expect(page).toContain('legacy-search');
    expect(page).toContain(
      '### Prompts — capability absent; listing not offered (method not found)',
    );
    expect(page).toContain('### Prompts — capability present; listing available');
  });

  it('says when no root was observed rather than rendering nothing', () => {
    const page = renderServedSurfacePage({
      ...inputs,
      current: { ...inputs.current, registrationRoots: [] },
    });

    expect(page).toContain('No registration root was observed');
  });
});
