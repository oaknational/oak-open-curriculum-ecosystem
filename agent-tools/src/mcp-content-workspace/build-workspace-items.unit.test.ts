import { describe, expect, it } from 'vitest';

import { buildTokenAnchor } from '../mcp-content-current-source/item-anchor-evidence.js';
import { buildWorkspaceItems } from './build-workspace-items.js';
import type { BaselineRegistryItem, WorkspaceInputs } from './content-workspace-model.js';
import type { CurrentSourceTruthItem } from '../mcp-content-current-source/current-source-model.js';

const SOURCE_FILE = 'packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts';
const CURRENT_WORDING = "export const GREETING = 'Call get-curriculum-model first.';";
const SOURCE_TEXT = `// a comment\n${CURRENT_WORDING}\nexport const OTHER = 1;\n`;

function baselineItem(overrides: Partial<BaselineRegistryItem> = {}): BaselineRegistryItem {
  return {
    id: 'C001',
    file: SOURCE_FILE,
    lines: '2',
    identifier: 'GREETING',
    surface_type: 'tool-guidance',
    impact_tier: 'high-impact',
    review_domain: 'pedagogy',
    extraction_kind: 'leaf-authored',
    source_locus: 'this-repo',
    behavioural_intent: 'Point the agent at the orientation tool.',
    snippet: "export const GREETING = 'Call the orientation tool first.';",
    flags: [],
    workspace_scope: 'in',
    ...overrides,
  };
}

function currentItem(overrides: Partial<CurrentSourceTruthItem> = {}): CurrentSourceTruthItem {
  return {
    id: 'C001',
    authority: 'workspace',
    workspaceScope: 'in',
    source: {
      state: 'available',
      files: [SOURCE_FILE],
      evidence: { revision: 'modified', anchorTargetCount: 1, anchorCount: 1 },
    },
    lineage: { disposition: 'retained', baselineFile: SOURCE_FILE },
    registrations: [],
    ...overrides,
  };
}

function inputs(overrides: Partial<WorkspaceInputs> = {}): WorkspaceInputs {
  return {
    registry: { meta: { upstream_pointers: {} }, items: [baselineItem()] },
    current: {
      provenance: { baselineCommit: 'abc123' },
      items: [currentItem()],
      registrationRoots: [],
    },
    sourceText: new Map([[SOURCE_FILE, SOURCE_TEXT]]),
    anchorsById: new Map([
      [
        'C001',
        {
          revision: 'modified' as const,
          targets: [
            { file: SOURCE_FILE, anchors: [buildTokenAnchor(CURRENT_WORDING, SOURCE_TEXT)] },
          ],
        },
      ],
    ]),
    additionTextById: new Map(),
    ...overrides,
  };
}

describe('buildWorkspaceItems', () => {
  it('shows the wording the code carries now, not the audit-baseline snippet', () => {
    const [item] = buildWorkspaceItems(inputs());

    expect(item?.excerpt).toBe(CURRENT_WORDING);
    expect(item?.excerptProvenance).toBe('current-source');
  });

  it('falls back to the baseline snippet, and says so, when no anchor resolves', () => {
    const [item] = buildWorkspaceItems(
      inputs({ sourceText: new Map([[SOURCE_FILE, 'export const UNRELATED = 2;\n']]) }),
    );

    expect(item?.excerpt).toContain('Call the orientation tool first.');
    expect(item?.excerptProvenance).toBe('baseline-snippet');
  });

  it('quotes a post-baseline addition from its reviewed content', () => {
    const addition = currentItem({
      id: 'A001',
      reviewContext: {
        title: 'Served-surface allowlist',
        reviewDomain: 'engineering-structural',
        impactTier: 'high-impact',
        behaviouralIntent: 'Classify every surface as live or dormant.',
      },
    });
    const built = buildWorkspaceItems(
      inputs({
        registry: { meta: { upstream_pointers: {} }, items: [] },
        current: {
          provenance: { baselineCommit: 'abc123' },
          items: [addition],
          registrationRoots: [],
        },
        anchorsById: new Map(),
        additionTextById: new Map([['A001', "search: 'live'"]]),
      }),
    );

    expect(built[0]?.excerpt).toBe("search: 'live'");
    expect(built[0]?.excerptProvenance).toBe('current-source');
    expect(built[0]?.title).toBe('Served-surface allowlist');
    expect(built[0]?.reviewDomain).toBe('engineering-structural');
  });

  it('carries the baseline file so a reviewer can trace a relocated item', () => {
    const relocated = currentItem({
      lineage: { disposition: 'relocated', baselineFile: 'old/place.ts' },
    });
    const built = buildWorkspaceItems(
      inputs({
        current: {
          provenance: { baselineCommit: 'abc123' },
          items: [relocated],
          registrationRoots: [],
        },
      }),
    );

    expect(built[0]?.baselineFile).toBe('old/place.ts');
  });

  it('renders a retired item from its last known wording rather than dropping it', () => {
    const retired = currentItem({
      source: { state: 'retired', files: [] },
      lineage: { disposition: 'retired', baselineFile: SOURCE_FILE },
    });
    const built = buildWorkspaceItems(
      inputs({
        current: {
          provenance: { baselineCommit: 'abc123' },
          items: [retired],
          registrationRoots: [],
        },
        anchorsById: new Map(),
      }),
    );

    expect(built).toHaveLength(1);
    expect(built[0]?.status).toBe('retired');
    expect(built[0]?.revision).toBe('retired');
    expect(built[0]?.excerpt).toContain('Call the orientation tool first.');
  });
});
