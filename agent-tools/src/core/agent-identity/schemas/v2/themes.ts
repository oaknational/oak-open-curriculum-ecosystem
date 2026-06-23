import { AERIAL_V2_THEME_GROUP } from './aerial.js';
import { BOTANICAL_V2_THEME_GROUP } from './botanical.js';
import { CELESTIAL_V2_THEME_GROUP } from './celestial.js';
import { EMBER_V2_THEME_GROUP } from './ember.js';
import { MARITIME_V2_THEME_GROUP } from './maritime.js';
import { NOCTURNAL_V2_THEME_GROUP } from './nocturnal.js';
import type { V2ThemeGroup } from './theme-group.js';

export type { V2ThemeGroup } from './theme-group.js';

/**
 * Manifest of themed v2 noun material, in routing order (matching the v1
 * group order so the theme-selection digest offset reads consistently).
 *
 * @remarks
 * The curation gate tests are data-driven over this list. The WS2.8 assembly
 * cycle pins the manifest into the v2 registry entry; after activation the
 * digest pin freezes this material — edits require a new schema version.
 */
export const V2_THEME_GROUPS: readonly V2ThemeGroup[] = [
  CELESTIAL_V2_THEME_GROUP,
  MARITIME_V2_THEME_GROUP,
  BOTANICAL_V2_THEME_GROUP,
  EMBER_V2_THEME_GROUP,
  AERIAL_V2_THEME_GROUP,
  NOCTURNAL_V2_THEME_GROUP,
];
