/**
 * Theme overlay-coverage validation for DTCG theme trees.
 *
 * @remarks
 * The design system's theme trees are sparse overlays over a declared base
 * (the light tree): non-base trees define only the tokens they override,
 * and the CSS cascade resolves the rest. The check that does real work
 * under this model is orphan detection — every overlay key MUST exist in
 * the base, or the override targets nothing (studio drift or a typo'd
 * path). Strict key-set equality is deliberately NOT enforced: overlay
 * sparseness is the system's contract, not a defect.
 *
 * @packageDocumentation
 */
import { type Result, err, ok } from '@oaknational/result';
import { byCodeUnit } from './code-unit-sort.js';
import type { DtcgTokenTree } from './dtcg-types.js';
import { collectTokenLeaves } from './token-walk.js';

/** Coverage evidence for a validated base-plus-overlays theme set. */
export interface OverlayCoverage {
  /** Number of token leaves in the base tree. */
  readonly baseKeyCount: number;
  /** Number of override leaves per overlay theme. */
  readonly overlayKeyCounts: Readonly<Record<string, number>>;
}

/** An overlay theme carrying override paths that do not exist in the base. */
export interface OrphanOverride {
  /** Overlay theme identifier (e.g. `"dark"`). */
  readonly theme: string;
  /** Sorted dot-paths present in the overlay but absent from the base. */
  readonly paths: readonly string[];
}

/** Error returned when overlay themes override paths the base never defines. */
export interface OrphanOverridesError {
  /** Discriminant for error routing. */
  readonly kind: 'orphan_overrides';
  /** Offending themes sorted by theme identifier. */
  readonly orphans: readonly OrphanOverride[];
}

/** Error returned when a theme tree contains a malformed node. */
export interface InvalidThemeNodeError {
  /** Discriminant for error routing. */
  readonly kind: 'invalid_theme_node';
  /** The offending theme identifier, or `"base"` for the base tree. */
  readonly theme: string;
  /** Dot-path of the malformed node. */
  readonly path: string;
}

/** Error returned when an overlay theme uses the reserved `"base"` identifier. */
export interface ReservedThemeIdentifierError {
  /** Discriminant for error routing. */
  readonly kind: 'reserved_theme_identifier';
  /** The reserved identifier that was used (`"base"`). */
  readonly theme: string;
}

/** Union of overlay-coverage failure shapes. */
export type OverlayCoverageError =
  InvalidThemeNodeError | OrphanOverridesError | ReservedThemeIdentifierError;

function leafPathsOf(
  tree: DtcgTokenTree,
  theme: string,
): Result<readonly string[], InvalidThemeNodeError> {
  const leaves = collectTokenLeaves(tree);

  if (!leaves.ok) {
    return err({ kind: 'invalid_theme_node', theme, path: leaves.error.path });
  }

  return ok(leaves.value.map((entry) => entry.path.join('.')));
}

interface OverlayAudit {
  readonly keyCount: number;
  readonly orphanPaths: readonly string[];
}

function auditOverlay(
  tree: DtcgTokenTree,
  theme: string,
  baseSet: ReadonlySet<string>,
): Result<OverlayAudit, InvalidThemeNodeError> {
  const overlayPaths = leafPathsOf(tree, theme);

  if (!overlayPaths.ok) {
    return overlayPaths;
  }

  const orphanPaths = overlayPaths.value.filter((path) => !baseSet.has(path)).toSorted(byCodeUnit);

  return ok({ keyCount: overlayPaths.value.length, orphanPaths });
}

/**
 * Validate that every overlay theme overrides only paths the base defines.
 *
 * @remarks
 * The base tree reports as theme `"base"` in `invalid_theme_node` errors,
 * so `"base"` is a reserved identifier and an overlay named `"base"` is
 * rejected rather than left to produce ambiguous error attribution.
 *
 * @param baseTree - The declared base theme tree (the complete namespace)
 * @param overlayTrees - Overlay theme identifier to sparse override tree
 * @returns Ok with coverage counts, or Err naming orphan overrides or the
 *   first malformed node
 */
export function validateThemeOverlayCoverage(
  baseTree: DtcgTokenTree,
  overlayTrees: Readonly<Record<string, DtcgTokenTree>>,
): Result<OverlayCoverage, OverlayCoverageError> {
  const basePaths = leafPathsOf(baseTree, 'base');

  if (!basePaths.ok) {
    return basePaths;
  }

  const baseSet = new Set(basePaths.value);
  // A Map keeps JSON-derived theme names like "__proto__" as real entries;
  // plain-object assignment would silently drop them onto the prototype.
  const overlayKeyCounts = new Map<string, number>();
  const orphans: OrphanOverride[] = [];

  for (const theme in overlayTrees) {
    if (!Object.hasOwn(overlayTrees, theme)) {
      continue;
    }

    if (theme === 'base') {
      return err({ kind: 'reserved_theme_identifier', theme });
    }

    const audit = auditOverlay(overlayTrees[theme], theme, baseSet);

    if (!audit.ok) {
      return audit;
    }

    overlayKeyCounts.set(theme, audit.value.keyCount);

    if (audit.value.orphanPaths.length > 0) {
      orphans.push({ theme, paths: audit.value.orphanPaths });
    }
  }

  if (orphans.length > 0) {
    return err({
      kind: 'orphan_overrides',
      orphans: orphans.toSorted((first, second) => byCodeUnit(first.theme, second.theme)),
    });
  }

  return ok({ baseKeyCount: baseSet.size, overlayKeyCounts: Object.fromEntries(overlayKeyCounts) });
}
