/**
 * Splits an oversized review domain into per-surface-type pages, and renders
 * the small index that routes a reviewer to them.
 *
 * @packageDocumentation
 */

import {
  DOMAIN_SPLIT_THRESHOLD,
  domainPagePath,
  domainSlug,
  surfacePagePath,
} from './content-workspace-config.js';
import type { WorkspaceItem, WorkspacePage } from './content-workspace-model.js';
import {
  PAGE_BANNER,
  domainGloss,
  frontmatter,
  renderDomainPage,
  renderSurfacePage,
} from './render-domain-page.js';

/** One surface-type slice of a domain. */
interface SurfaceGroup {
  readonly surfaceType: string;
  readonly items: readonly WorkspaceItem[];
}

/** Group a domain's items by surface type, largest group first. */
function groupBySurfaceType(items: readonly WorkspaceItem[]): readonly SurfaceGroup[] {
  const bySurface = new Map<string, WorkspaceItem[]>();
  for (const item of items) {
    const group = bySurface.get(item.surfaceType);
    if (group === undefined) {
      bySurface.set(item.surfaceType, [item]);
    } else {
      group.push(item);
    }
  }
  return [...bySurface.entries()]
    .map(([surfaceType, groupItems]) => ({ surfaceType, items: groupItems }))
    .sort(
      (left, right) =>
        right.items.length - left.items.length || left.surfaceType.localeCompare(right.surfaceType),
    );
}

function groupTable(domain: string, groups: readonly SurfaceGroup[]): readonly string[] {
  return [
    '| Section | Items | Ours to change | Owned elsewhere |',
    '| --- | ---: | ---: | ---: |',
    ...groups.map((group) => {
      const href = `./${domainSlug(domain)}--${domainSlug(group.surfaceType)}.md`;
      const ours = group.items.filter((item) => item.authority === 'workspace').length;
      return `| [${group.surfaceType}](${href}) | ${String(group.items.length)} | ${String(ours)} | ${String(group.items.length - ours)} |`;
    }),
  ];
}

/** Render the routing index for a split domain. */
function renderDomainIndex(
  domain: string,
  items: readonly WorkspaceItem[],
  groups: readonly SurfaceGroup[],
): string {
  return [
    ...frontmatter('index', 'model-behaviour-content-review'),
    `# ${domain} — content review view`,
    '',
    PAGE_BANNER,
    '',
    domainGloss(domain),
    '',
    `This view holds **${String(items.length)} items** — too many to read in one sitting, so it ` +
      'is divided by the kind of surface each item is. Each section below is a self-contained ' +
      'review task.',
    '',
    '[Back to the workspace index](../README.md)',
    '',
    ...groupTable(domain, groups),
    '',
  ].join('\n');
}

/**
 * Every page for one review domain.
 *
 * @remarks
 * Small domains stay a single page; only a domain past
 * {@link DOMAIN_SPLIT_THRESHOLD} is divided, and then the domain page becomes a
 * routing index rather than disappearing — a reviewer's link to a domain never
 * breaks because the domain grew.
 */
export function renderDomainPages(
  domain: string,
  items: readonly WorkspaceItem[],
): readonly WorkspacePage[] {
  const indexPath = domainPagePath(domain);
  if (items.length <= DOMAIN_SPLIT_THRESHOLD) {
    return [{ path: indexPath, content: renderDomainPage(domain, items) }];
  }
  const groups = groupBySurfaceType(items);
  return [
    { path: indexPath, content: renderDomainIndex(domain, items, groups) },
    ...groups.map((group) => ({
      path: surfacePagePath(domain, group.surfaceType),
      content: renderSurfacePage(
        domain,
        group.surfaceType,
        group.items,
        `./${domainSlug(domain)}.md`,
      ),
    })),
  ];
}
