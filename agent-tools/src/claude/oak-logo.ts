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
 * `braille-sharp` is a four-frame cycle ({@link BRAILLE_SHARP_FRAMES}): the
 * statusline advances one frame per render, per session, via
 * {@link resolveLogoRows} — frame 0 is the canonical mark and frames 1–3 are
 * subtle seeded variants. The frames are still fixed constants; only the
 * selection changes per render. Other styles are single marks.
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

import { frameIndex } from './statusline-logo-cycle.js';

/** Glyph style used to draw the Oak mark, or `none` to suppress it. */
export type OakLogoStyle =
  'braille-sharp' | 'braille-sharp-compact' | 'braille' | 'quad' | 'sextant' | 'none';

/**
 * The `braille-sharp` cycle: four five-row × seven-column acorn marks (frame ids
 * 0–3) the statusline steps through one per render (see `statusline-logo-cycle`).
 *
 * Frame 0 is the canonical owner-decided mark (2026-06-16). Frames 1–3 are
 * seeded sub-cell sampling-offset variants of the same SVG conversion — the same
 * acorn, gently varied by a few marginal dots — produced offline (seeds 1, 2, 4)
 * by `.agent/research/developer-experience/statusline-logos/generate-braille-sharp-variants.py`
 * and held here as verified constants; the statusline only selects a frame at
 * render time, it never regenerates one. Regenerate from the SVG only if the
 * brand mark changes.
 */
export const BRAILLE_SHARP_FRAMES = [
  ['⠀⠀⢀⣼⡃⠀⠀', '⢠⡞⠋⢿⡉⠳⣄', '⣿⡀⠀⠈⠳⢦⣿', '⠸⣧⠀⠀⠀⢰⡇', '⠀⠘⠷⣤⡴⠋⠀'],
  ['⠀⠀⢀⣰⣋⠀⠀', '⢠⡞⠋⢿⡉⠻⣆', '⢿⡄⠀⠈⠛⠶⠽', '⠘⣧⠀⠀⠀⢰⡇', '⠀⠈⠳⣤⡴⠋⠀'],
  ['⠀⠀⣀⣾⣃⠀⠀', '⣰⠟⠉⣿⡉⢳⣄', '⢯⠀⠀⠈⠳⠶⠿', '⠸⣇⠀⠀⠀⣸⠃', '⠀⠙⠷⣤⡾⠋⠀'],
  ['⠀⠀⠀⣰⡇⠀⠀', '⢠⡶⠛⢿⡙⠳⣄', '⣿⡀⠀⠈⠳⢤⣽', '⠘⣧⠀⠀⠀⢠⡇', '⠀⠘⢷⣄⣴⠟⠀'],
] as const satisfies readonly (readonly string[])[];

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
 *   Patterns (U+2800) have very wide font support. Cycles four frames; see
 *   {@link BRAILLE_SHARP_FRAMES}.
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
  'braille-sharp': BRAILLE_SHARP_FRAMES[0],
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

/**
 * Resolve the rows to render for a logo style and cycle frame.
 *
 * Only `braille-sharp` cycles: it has four frames ({@link BRAILLE_SHARP_FRAMES})
 * and `frame` selects one, wrapping modulo the frame count (and tolerating
 * negative or fractional counters). Every other style is a single fixed mark and
 * ignores `frame`. The caller passes the raw per-session render counter; the
 * modulo reduction happens here.
 *
 * @param style - The resolved logo style (never `none`; that path renders no logo).
 * @param frame - The per-session render counter; reduced modulo the frame count.
 * @returns The mark rows to render.
 */
export function resolveLogoRows(
  style: Exclude<OakLogoStyle, 'none'>,
  frame: number,
): readonly string[] {
  if (style !== 'braille-sharp') {
    return OAK_LOGO_ROWS[style];
  }
  return (
    BRAILLE_SHARP_FRAMES[frameIndex(BRAILLE_SHARP_FRAMES.length, frame)] ?? BRAILLE_SHARP_FRAMES[0]
  );
}
