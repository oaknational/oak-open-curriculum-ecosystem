/*
 * Pure path-resolution decisions for the STUDIO OVERLAY specifically — a
 * leaf module (no IO, no module-init side effects) so the overlay's
 * behaviour tests import exactly what they describe. The decode and
 * per-root traversal guards are the shared static-path-guard
 * (@oaknational/fidelity-review); this module owns only the
 * overlay-shaped decisions on top of them: the ordered-roots walk and
 * the declared-exports-surface admit predicate. The server half (root
 * resolution, HTTP, existence) lives in export-server.ts.
 */
import path from 'node:path';

import { decodeUrlPath, resolveWithinRoot } from '@oaknational/fidelity-review/static-path-guard';

/** One overlay root: a directory, optionally bounded by an admit predicate
 *  over the decoded URL path (the declared-surface guard). */
export interface OverlayRoot {
  readonly dir: string;
  readonly admits?: (urlPath: string) => boolean;
}

/**
 * Build an admit predicate from a package exports map's keys — the
 * declared-surface guard for a fallback root: exact keys ('./styles.css')
 * admit exactly that path; wildcard keys ('./fonts/*') admit the prefix;
 * the bare '.' key names the root itself (a directory, never servable) and
 * is ignored. Pure.
 */
export function exportsSurfaceAdmits(exportKeys: readonly string[]): (urlPath: string) => boolean {
  const exact = new Set<string>();
  const prefixes: string[] = [];
  for (const key of exportKeys) {
    if (key === '.' || !key.startsWith('./')) {
      continue;
    }
    const urlPath = key.slice(1);
    if (urlPath.endsWith('/*')) {
      prefixes.push(urlPath.slice(0, -1));
    } else {
      exact.add(urlPath);
    }
  }
  return (urlPath) => exact.has(urlPath) || prefixes.some((prefix) => urlPath.startsWith(prefix));
}

/**
 * Resolve a request across the ordered overlay roots: the first root whose
 * admit predicate (when present) and traversal guard admit the path AND
 * whose tree contains the file wins. A URL that escapes a root resolves
 * nowhere in that root — escape is never retried as another root's in-tree
 * path. Existence is injected so the decision stays pure.
 */
export function resolveAcrossRoots(
  roots: readonly OverlayRoot[],
  rawUrl: string,
  exists: (candidate: string) => boolean,
): string | undefined {
  const urlPath = decodeUrlPath(rawUrl);
  if (urlPath === undefined) {
    return undefined;
  }
  // Decoded backslashes are refused outright: this module judges paths
  // with POSIX rules while per-root resolution uses host rules, and on
  // Windows `/fonts/..%5Cpackage.json` would wear the declared /fonts/
  // prefix here yet resolve through the backslash as a separator —
  // serving an undeclared file. No export URL legitimately contains one.
  if (urlPath.includes('\\')) {
    return undefined;
  }
  // The admit predicate judges the CANONICAL path, matching what per-root
  // resolution actually serves (path.resolve applies the same dot-segment
  // collapse): `/fonts/../package.json` canonicalises to `/package.json`
  // BEFORE the surface check, so an admitted-looking prefix on a relative
  // hop can never smuggle an undeclared file through the fallback root.
  const canonical = path.posix.normalize(urlPath);
  for (const root of roots) {
    if (root.admits !== undefined && !root.admits(canonical)) {
      continue;
    }
    const resolved = resolveWithinRoot(root.dir, rawUrl);
    if (resolved !== undefined && exists(resolved)) {
      return resolved;
    }
  }
  return undefined;
}
