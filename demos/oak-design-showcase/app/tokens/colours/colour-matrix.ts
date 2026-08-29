import { IDENTITY_DEFAULT } from '@oaknational/oak-design-react';
import type { OakThemeName } from '@oaknational/oak-design-react';

import { THEME_LABELS } from '../../../components/theme-vocabulary';
import type { IdentitySlug } from '../../../components/useIdentity';
import { craftAreaOf } from '../craft-areas';
import type { CatalogueToken } from '../token-catalogue';

/**
 * The colour matrix's vocabulary: which themes it shows, how a cell is
 * addressed, and how a resolved colour is written down.
 *
 * WHY A MATRIX OF FRAMES AT ALL. One document cannot wear three identities
 * and five themes at once. An identity is a stylesheet loaded over the kit,
 * and `light-dark()` resolves against the colour-scheme of the element the
 * declaration applies to — which for these tokens is the ROOT (kit
 * KNOWN-ISSUES #14). So a side-by-side comparison has to be side-by-side
 * DOCUMENTS: each cell is a frame that genuinely wears one identity and one
 * theme, and every swatch in it is painted by that document's own cascade.
 * Faking it — reading values into JavaScript and printing them — would make
 * the page a screenshot of a claim rather than the claim itself.
 *
 * Framework-free on purpose: the matrix page and the strip route are both
 * server components, so the labels come from the shared framework-free
 * theme vocabulary (components/theme-vocabulary.ts — extracted from the
 * switchboard's 'use client' module at this page's second-consumer
 * moment).
 */

/** The themes the matrix shows. `system` is deliberately absent: it is not
 *  a face of its own but an instruction to follow the OS, so a column of it
 *  would duplicate whichever of light or dark the machine happens to be in.
 *  The page says so in words. */
export type MatrixTheme = Exclude<OakThemeName, 'system'> | typeof IDENTITY_DEFAULT;

interface MatrixThemeDescription {
  readonly id: MatrixTheme;
  readonly label: string;
}

const MATRIX_THEME_IDS: readonly MatrixTheme[] = [
  IDENTITY_DEFAULT,
  'light',
  'dark',
  'high-contrast',
  'colour-safe',
];

export const MATRIX_THEMES: readonly MatrixThemeDescription[] = MATRIX_THEME_IDS.map((id) => ({
  id,
  label: THEME_LABELS[id],
}));

/** Narrow an untrusted query value to a theme the matrix shows, falling
 *  back to the identity's own face. */
export function resolveMatrixTheme(raw: string | string[] | undefined): MatrixTheme {
  const candidate = Array.isArray(raw) ? raw[0] : raw;
  return MATRIX_THEMES.find((theme) => theme.id === candidate)?.id ?? IDENTITY_DEFAULT;
}

/** The exhibit route for one cell. */
export function stripHref(identity: IdentitySlug, theme: MatrixTheme): string {
  return `/tokens/colours/strip?brand=${identity}&theme=${theme}`;
}

/** A frame's accessible name. Every frame needs one a person can tell from
 *  the other fourteen, so it names both axes. */
export function frameTitle(identityLabel: string, themeLabel: string): string {
  return `${identityLabel} — ${themeLabel}`;
}

/** The id of a theme band's heading, which its section is labelled by. */
export function bandId(theme: MatrixTheme): string {
  return `colours-${theme}`;
}

/**
 * The catalogue's colour area — the same tokens the reference page files
 * under Colour, so the two pages cannot disagree about what counts as a
 * colour — but ordered for COMPARISON rather than for lookup.
 *
 * Roles lead; the palette follows. An identity re-points roles, so those
 * are the rows where three columns differ; the eighty-seven `--oak-*`
 * primitives beneath them are the same swatch in every cell, and leading
 * with those made the first screenful of a comparison instrument three
 * identical columns of grey. The reference page keeps catalogue order
 * because its job is to find one token; this page's job is to see a
 * difference, and the two orders serve the two jobs.
 */
export function colourTokens(tokens: readonly CatalogueToken[]): readonly CatalogueToken[] {
  const colours = tokens.filter((token) => craftAreaOf(token.family) === 'colour');
  return [
    ...colours.filter((token) => token.tier !== 1),
    ...colours.filter((token) => token.tier === 1),
  ];
}

const RGB_VALUE = /^rgba?\(([^)]+)\)$/i;

function hexPair(value: number): string {
  return Math.max(0, Math.min(255, Math.round(value)))
    .toString(16)
    .padStart(2, '0');
}

/**
 * A browser's computed colour written the way a designer reads one.
 *
 * Chromium reports used colours as `rgb()`/`rgba()`, and a matrix exists to
 * be compared across fifteen cells — hex is the form that compares at a
 * glance. Anything this cannot parse (a wide-gamut `color()`, a keyword)
 * comes back unchanged rather than mangled: showing the browser's own words
 * is always better than showing a wrong conversion.
 */
export function asHexColour(value: string): string {
  const match = RGB_VALUE.exec(value.trim());
  if (match === null) {
    return value;
  }
  // Browsers emit both the legacy comma form and the space-and-slash one
  // (`rgb(17 34 51 / 0.5)`), so every separator is treated alike.
  const parts = match[1]
    .split(/[\s,/]+/)
    .filter((part) => part !== '')
    .map((part) => Number.parseFloat(part));
  const [red, green, blue, alpha] = parts;
  if (parts.length < 3 || parts.slice(0, 3).some((part) => Number.isNaN(part))) {
    return value;
  }
  const opaque = `#${hexPair(red)}${hexPair(green)}${hexPair(blue)}`;
  return alpha === undefined || Number.isNaN(alpha) || alpha >= 1
    ? opaque
    : `${opaque}${hexPair(alpha * 255)}`;
}
