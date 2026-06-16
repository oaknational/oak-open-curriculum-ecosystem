/**
 * Oak acorn mark for the Claude Code statusline, as multi-row glyph art.
 *
 * @remarks
 * The rows are a faithful conversion of the Oak National Academy acorn SVG via
 * the rasterise → area-coverage → glyph-pack pipeline documented, with its
 * regeneration recipe, in
 * `.agent/research/developer-experience/statusline-logos/statusline-logos.md`. Each style is a
 * mark of uniform per-row display width — an open acorn cup with an upper-right
 * leaf, a sprout, and a rounded base — sized to sit as a left logo-column with
 * the statusline segments flowing to its right.
 *
 * The default `braille-sharp` is a five-row, seven-column mark (owner decision
 * 2026-06-16); the remaining styles are four-row marks. The renderer drives off
 * the selected style's own row count, so the taller default trails a bare mark
 * row beneath the four segments.
 *
 * The marks are fixed brand assets, held here as verified constants rather than
 * regenerated at build time. The `braille` / `quad` / `sextant` rows are the
 * unmodified conversion output; `braille-sharp` and `braille-sharp-compact`
 * each carry two deliberate hand-tuned dots on top of it (see below).
 * Regenerate the conversion styles from the SVG only if the brand mark itself
 * changes, using the recipe in the research doc.
 *
 * @packageDocumentation
 */

/** Glyph style used to draw the Oak mark, or `none` to suppress it. */
export type OakLogoStyle =
  | 'braille-sharp'
  | 'braille-sharp-compact'
  | 'braille'
  | 'quad'
  | 'sextant'
  | 'none';

/**
 * Oak acorn marks keyed by style. Every row within a style has a uniform display
 * width — the default `braille-sharp` is five rows × seven columns;
 * `braille-sharp-compact` and `braille` are four rows × six columns; `quad` and
 * `sextant` are four rows × seven columns — and each style assumes its glyphs
 * render at single-column (narrow) width so the adjacent segment column stays
 * aligned. A terminal that renders the Legacy Computing block double-width would
 * misalign the sextant column — use a braille style or `quad` there.
 *
 * - `braille-sharp` — the default (owner decision 2026-06-16): the five-row,
 *   seven-column braille conversion plus two source-grounded sharpening dots — a
 *   crisper sprout tip and a sharper lower-left nut-to-cup shoulder. Braille
 *   Patterns (U+2800) have very wide font support.
 * - `braille-sharp-compact` — the prior four-row default: the six-column braille
 *   conversion plus two hand-tuned dots (sharper lower-left shoulder, crisper
 *   sprout tip). Retained as the compact option.
 * - `braille` — the unmodified four-row braille conversion (rounder left
 *   shoulder), regenerable from the SVG.
 * - `quad` — Unicode block-element quadrants (U+2580). Universal font support,
 *   slightly chunkier.
 * - `sextant` — Unicode Symbols for Legacy Computing (U+1FB00). Sharpest, but
 *   needs a font with that block; it renders as tofu boxes otherwise.
 */
export const OAK_LOGO_ROWS: Readonly<Record<Exclude<OakLogoStyle, 'none'>, readonly string[]>> = {
  'braille-sharp': ['⠀⠀⢀⣼⡃⠀⠀', '⢠⡞⠋⢿⡉⠳⣄', '⣿⡀⠀⠈⠳⢦⣿', '⠸⣧⠀⠀⠀⢰⡇', '⠀⠘⠷⣤⡴⠋⠀'],
  'braille-sharp-compact': ['⠀⢀⣠⣞⣁⠀', '⣼⠋⠘⢧⡉⢷', '⢹⡅⠀⠀⢉⡍', '⠀⠻⣤⣤⠞⠁'],
  braille: ['⠀⢀⣠⣟⣀⠀', '⣼⠋⠘⢧⡉⢷', '⢹⡄⠀⠀⢉⡍', '⠀⠻⣤⣤⠞⠁'],
  quad: [' ▗▄▟▙▖ ', '▟▀ ▜▄▀▙', '▜▌  ▝▜▛', ' ▀▙▄▄▛ '],
  sextant: [' 🬞🬭🬻🬮🬏 ', '🬻🬆🬀🬬🬱🬒🬺', '🬨▌  🬁🬡🬕', ' 🬊🬩🬭🬵🬆 '],
};

/**
 * Resolve an {@link OakLogoStyle} from a raw configuration string, such as the
 * `OAK_STATUSLINE_LOGO` environment variable. Unrecognised or absent values
 * fall back to the default `braille-sharp`; `braille-sharp-compact`, `braille`,
 * `quad`, and `sextant` are opt-in alternatives, and `none` restores the
 * single-line statusline.
 *
 * @param raw - The raw configuration value, or `undefined` when unset.
 * @returns The resolved logo style.
 */
export function resolveLogoStyle(raw: string | undefined): OakLogoStyle {
  if (
    raw === 'braille-sharp' ||
    raw === 'braille-sharp-compact' ||
    raw === 'braille' ||
    raw === 'quad' ||
    raw === 'sextant' ||
    raw === 'none'
  ) {
    return raw;
  }
  return 'braille-sharp';
}
