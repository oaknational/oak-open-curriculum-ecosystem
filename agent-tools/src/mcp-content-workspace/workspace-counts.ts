/**
 * Counts recomputed from the assembled items.
 *
 * @remarks
 * Every number the workspace prints is derived here from the items themselves,
 * never copied from a `meta` block. That is not ceremony: the phase-(a)
 * registry's recorded `review_domains` and `workspace_scope` tallies have both
 * drifted from its own rows, so a rendering that trusted them would publish
 * numbers that disagree with the list printed underneath them.
 *
 * @packageDocumentation
 */

import { REVIEW_DOMAIN_ORDER } from './content-workspace-config.js';
import type { ServedStatus, WorkspaceItem } from './content-workspace-model.js';

/** Per-domain tallies, in presentation order. */
export interface DomainCount {
  readonly domain: string;
  readonly total: number;
  readonly ownedHere: number;
  readonly ownedUpstream: number;
  readonly retired: number;
}

function tallyBy<T extends string>(
  items: readonly WorkspaceItem[],
  key: (item: WorkspaceItem) => T,
): ReadonlyMap<T, number> {
  const counts = new Map<T, number>();
  for (const item of items) {
    const value = key(item);
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

/** Domains present in the corpus, ordered with known domains first. */
export function orderedDomains(items: readonly WorkspaceItem[]): readonly string[] {
  const present = new Set(items.map((item) => item.reviewDomain));
  const known = REVIEW_DOMAIN_ORDER.filter((domain) => present.has(domain));
  const unknown = [...present]
    .filter((domain) => !REVIEW_DOMAIN_ORDER.includes(domain))
    .sort((left, right) => left.localeCompare(right));
  return [...known, ...unknown];
}

/** Items belonging to one review domain, in stable id order. */
export function itemsInDomain(
  items: readonly WorkspaceItem[],
  domain: string,
): readonly WorkspaceItem[] {
  return items.filter((item) => item.reviewDomain === domain);
}

/** Recomputed per-domain counts. */
export function domainCounts(items: readonly WorkspaceItem[]): readonly DomainCount[] {
  return orderedDomains(items).map((domain) => {
    const inDomain = itemsInDomain(items, domain);
    return {
      domain,
      total: inDomain.length,
      ownedHere: inDomain.filter((item) => item.authority === 'workspace').length,
      ownedUpstream: inDomain.filter((item) => item.authority !== 'workspace').length,
      retired: inDomain.filter((item) => item.status === 'retired').length,
    };
  });
}

/** Recomputed served-status tallies across the whole corpus. */
export function statusCounts(items: readonly WorkspaceItem[]): ReadonlyMap<ServedStatus, number> {
  return tallyBy(items, (item) => item.status);
}

/** How many items are rendered from current source rather than the baseline. */
export function excerptProvenanceCounts(
  items: readonly WorkspaceItem[],
): ReadonlyMap<string, number> {
  return tallyBy(items, (item) => item.excerptProvenance);
}

/** Items this pass could not render from current source, named not dropped. */
export function unrenderedItems(items: readonly WorkspaceItem[]): readonly WorkspaceItem[] {
  return items.filter(
    (item) => item.excerptProvenance !== 'current-source' && item.status !== 'retired',
  );
}
