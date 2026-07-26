/**
 * Pinned expectations for the design-system dtcg contrast gate.
 *
 * @remarks
 * THE single home for every number and name the gate pins against the
 * imported export. Re-baseline this module at every studio sync; a
 * mismatch is the gate telling you the export's shape drifted, not a
 * number to bump silently.
 *
 * @packageDocumentation
 */
import type { WcagLevel } from '@oaknational/design-tokens-core';

/** The design system's theme names, light first (the declared base). */
export const DESIGN_SYSTEM_THEMES = ['light', 'dark', 'high-contrast', 'colour-safe'] as const;

/** A design-system theme name. */
export type DesignSystemTheme = (typeof DESIGN_SYSTEM_THEMES)[number];

/**
 * Ratified gate level per theme (owner, 2026-07-20): high-contrast gates
 * at SC 1.4.6 AAA thresholds; the rest gate at the AA floor.
 */
export const THEME_GATE_LEVELS = {
  light: 'AA',
  dark: 'AA',
  'high-contrast': 'AAA',
  'colour-safe': 'AA',
} as const satisfies Record<DesignSystemTheme, WcagLevel>;

/** Allowed root groups of the dtcg palette tree. */
export const PALETTE_ROOTS = ['oak'] as const;

/** Allowed root groups per semantic tree (sparse overlays subset the base). */
export const SEMANTIC_ROOTS = {
  light: [
    'bg',
    'border',
    'color',
    'control',
    'ease',
    'filter',
    'focus',
    'motion',
    'scrim',
    'shadow',
    'state',
    'surface',
    'text',
    'type',
  ],
  dark: ['bg', 'border', 'color', 'filter', 'scrim', 'shadow', 'surface', 'text'],
  'high-contrast': ['bg', 'border', 'color', 'focus', 'scrim', 'shadow', 'surface', 'text'],
  'colour-safe': ['bg', 'border', 'text'],
} as const satisfies Record<DesignSystemTheme, readonly string[]>;

/** Expected number of pairs the contrast manifest declares. */
export const EXPECTED_MANIFEST_PAIR_COUNT = 41;

/**
 * Expected size of the post-filter hex comparand for every composed theme.
 *
 * @remarks
 * 175 colour candidates resolve per composed theme (identical across
 * themes — overlays only override, never add); 8 drop at the hex filter:
 * the 4 palette rgb-alpha literals, the `scrim` copy resolved from one of
 * them, and the 3 untyped `color-mix()` state tokens. This count is the
 * drift net for the export's heuristic `$type` and for silent resolution
 * drops — if it moves, a token changed class, not just value.
 *
 * Re-baselined 166 → 167 on 2026-07-26 (MCP-128). The single added colour is
 * `shadow.ground-inverted`, completing the inverted-surface family alongside
 * `bg-inverted` / `text-inverted` / `border-inverted`: a surface painted at
 * the opposite polarity to the canvas needs its own ground, and without one a
 * consumer either leaves the focus ring at ~1.1:1 or reaches for a palette
 * primitive. The same change adds `focus.ring-inverted`, `type.code-2` and
 * `type.code-3`, which carry no `$type` and so are not comparands — the count
 * moves by exactly one, as it should.
 */
export const EXPECTED_COMPARAND_SIZE = 167;
