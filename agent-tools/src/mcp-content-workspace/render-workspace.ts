/**
 * Assembles the whole workspace: index, one page per review domain, and the two
 * corpus-wide views.
 *
 * @remarks
 * Rendering is a pure function of the inputs — no clock, no environment, no
 * filesystem. That is what makes `--check` meaningful: a difference between the
 * committed pages and a fresh render is always a real drift in the content, and
 * never the passage of time.
 *
 * @packageDocumentation
 */

import {
  WORKSPACE_INDEX,
  WORKSPACE_SERVED_SURFACE,
  WORKSPACE_UNRENDERED,
} from './content-workspace-config.js';
import type { WorkspaceInputs, WorkspacePage } from './content-workspace-model.js';
import { buildWorkspaceItems } from './build-workspace-items.js';
import { renderDomainPages } from './render-domain-index.js';
import { renderIndexPage } from './render-index-page.js';
import { renderServedSurfacePage, renderUnrenderedPage } from './render-auxiliary-pages.js';
import { itemsInDomain, orderedDomains } from './workspace-counts.js';

/** A page body ending in exactly one newline, as the Markdown gate requires. */
function page(path: string, content: string): WorkspacePage {
  return { path, content: `${content.replace(/\n+$/, '')}\n` };
}

/** Every page of the workspace, in a stable order. */
export function renderWorkspace(inputs: WorkspaceInputs): readonly WorkspacePage[] {
  const items = buildWorkspaceItems(inputs);
  return [
    page(WORKSPACE_INDEX, renderIndexPage(items)),
    page(WORKSPACE_SERVED_SURFACE, renderServedSurfacePage(inputs)),
    page(WORKSPACE_UNRENDERED, renderUnrenderedPage(items)),
    ...orderedDomains(items)
      .flatMap((domain) => renderDomainPages(domain, itemsInDomain(items, domain)))
      .map((rendered) => page(rendered.path, rendered.content)),
  ];
}

/** Pages whose committed content differs from a fresh render. */
export function stalePages(
  expected: readonly WorkspacePage[],
  committed: ReadonlyMap<string, string | null>,
): readonly string[] {
  return expected
    .filter((page) => committed.get(page.path) !== page.content)
    .map((page) => page.path);
}

/** Committed pages a fresh render no longer produces — orphans to delete. */
export function orphanedPages(
  expected: readonly WorkspacePage[],
  committedPaths: readonly string[],
): readonly string[] {
  const expectedPaths = new Set(expected.map((page) => page.path));
  return committedPaths
    .filter((path) => !expectedPaths.has(path))
    .sort((left, right) => left.localeCompare(right));
}
