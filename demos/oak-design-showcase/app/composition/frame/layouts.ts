/**
 * The composition demo's closed vocabularies, shared by the exhibit route
 * (server first paint) and the parent page's controls (live switching).
 * Four layouts spanning the engine's extremes — from the canonical
 * document stack to a fully inverted visual order — and the two exhibit
 * grounds (owner spec 2026-08-18: light or dark only).
 */
import { typeSafeKeys } from '@oaknational/type-helpers';

export const COMPOSITION_LAYOUTS = {
  document: 'Document — the canonical stack',
  magazine: 'Magazine — asymmetric two-column',
  dashboard: 'Dashboard — rails and tiles',
  inverted: 'Inverted — the order reversed',
} as const;

/**
 * A textual account of each demonstrated arrangement, rendered inside the
 * exhibit (visually hidden) so assistive technology hears WHAT the layout
 * does — the unchanged DOM order carries no visual-arrangement information
 * on its own, and the parent keeps this text live when it switches maps.
 */
export const LAYOUT_DESCRIPTIONS = {
  document:
    'All eleven regions in one column, in source order: hero first, ' + 'call to action last.',
  magazine:
    'Two columns of unequal width: the content column carries the long ' +
    'read with detail and results beneath, while a narrow rail holds ' +
    'facets, context, resources and featured items; the hero and the ' +
    'call to action span the full width.',
  dashboard:
    'A tall navigation rail spans the full height on the left; beside it ' +
    'the regions sit as dense tiles across three columns, with the hero ' +
    'reduced to one band among them.',
  inverted:
    'The visual order is fully reversed from the source order: the call ' +
    'to action appears first and the hero appears last, in two equal ' +
    'columns — the markup order is unchanged.',
} as const satisfies Record<keyof typeof COMPOSITION_LAYOUTS, string>;

export type CompositionLayout = keyof typeof COMPOSITION_LAYOUTS;

/** The exhibit's accessible title — ONE derivation, consumed by the server
 *  render and by the parent's live update, so the two can never drift. */
export function layoutTitle(layout: CompositionLayout): string {
  return `Region canvas — ${COMPOSITION_LAYOUTS[layout]}`;
}

export const LAYOUT_OPTIONS: readonly CompositionLayout[] = typeSafeKeys(COMPOSITION_LAYOUTS);

export const EXHIBIT_THEMES = {
  light: 'Light',
  dark: 'Dark',
} as const;

export type ExhibitTheme = keyof typeof EXHIBIT_THEMES;

export const EXHIBIT_THEME_OPTIONS: readonly ExhibitTheme[] = typeSafeKeys(EXHIBIT_THEMES);

export function isCompositionLayout(value: string): value is CompositionLayout {
  const names: readonly string[] = LAYOUT_OPTIONS;
  return names.includes(value);
}

export function isExhibitTheme(value: string): value is ExhibitTheme {
  const names: readonly string[] = EXHIBIT_THEME_OPTIONS;
  return names.includes(value);
}

export function resolveLayout(value: string | string[] | undefined): CompositionLayout {
  return typeof value === 'string' && isCompositionLayout(value) ? value : 'document';
}

export function resolveExhibitTheme(value: string | string[] | undefined): ExhibitTheme {
  return typeof value === 'string' && isExhibitTheme(value) ? value : 'light';
}
