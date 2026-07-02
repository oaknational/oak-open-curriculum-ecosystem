/**
 * Pure layout for the Claude Code statusline.
 *
 * @remarks
 * Assembles the statusline from already-gathered values. Holds no I/O: the
 * adapter (`statusline-identity.ts`) gathers the git facts and session shape and
 * delegates here. Segment colouring lives in `statusline-segments.ts`; this file
 * owns only the line/row layout.
 *
 * Row order puts the short, fixed-width segments first — identity (with
 * indicators) on one row, then model and context % together on the next — and the
 * labelled git-location rows last. A loud error token, when present, leads the
 * output in any layout so it cannot be missed.
 *
 * The git-location rows come pre-composed from `statusline-segments.ts`: the
 * checkout name then its branch when the session's checkout is the only relevant
 * location, or the primary checkout's name, its `coord:`-prefixed branch, and a
 * worktree row (name and branch) when the session sits in a linked worktree.
 * Without a logo these render as plain lines after the summary; with a logo they
 * sit to the right of the logo-column rows (five for the default `braille-sharp`,
 * four otherwise), and a location row beyond the logo rows renders as a bare line
 * so it is never dropped.
 *
 * @packageDocumentation
 */

import { resolveLogoRows, type OakLogoStyle } from './oak-logo.js';
import { DIM, GREEN, RESET } from './statusline-ansi.js';
import {
  buildSegments,
  joinPresent,
  type Segments,
  type StatuslineParts,
} from './statusline-segments.js';

export type { StatuslineParts } from './statusline-segments.js';

const LOGO_COLOUR = GREEN;
/** Gap between the logo column and the segment text, in the multi-row layout. */
const LOGO_GAP = '  ';
/** Default rule glyph for the logo separator row, tiled to the logo width. */
const LOGO_SEPARATOR_GLYPH = '_';

/** Optional presentation controls for {@link renderStatusline}. */
export interface StatuslineRenderOptions {
  /**
   * Glyph family for the Oak mark. `none` is this option's default (the original
   * layout without the logo column — still one or more rows depending on the
   * error and coordination-branch lines); the deployed statusline defaults to
   * `braille-sharp` (set by the adapter from `OAK_STATUSLINE_LOGO`). Any
   * non-`none` style renders the multi-row logo-column layout.
   */
  readonly logo?: OakLogoStyle;
  /** Per-session counter selecting the `braille-sharp` cycle frame (other styles ignore it); defaults to 0. */
  readonly logoFrame?: number;
  /**
   * Rule glyph for the horizontal separator beneath the logo block. **On by
   * default** (omit for the default glyph); tiled and trimmed to the active
   * logo's display width. Pass an empty string to suppress the rule. Only the
   * logo layout carries it.
   */
  readonly logoSeparator?: string;
}

/**
 * Assemble the statusline from gathered segment values.
 *
 * @param parts - The resolved segment values.
 * @param options - Optional presentation controls (e.g. the Oak logo style).
 * @returns The ANSI-coloured statusline (multi-line without a logo; the
 *   logo-column rows with a trailing separator with one).
 *
 * @example
 * ```ts
 * renderStatusline({
 *   identity: 'Fragrant Creeping Sapling',
 *   dir: 'oak-wt-eef',
 *   branch: 'feat/eef-explore-evidence',
 *   dirty: true,
 *   worktree: 'oak-wt-eef',
 *   usedPercentage: 12,
 *   model: 'Opus 4.7',
 *   sessionShape: undefined,
 *   coordinationBranch: 'coordination/worktree-pilot',
 *   coordinationPlace: 'oak-open-curriculum-ecosystem',
 *   error: undefined,
 * });
 * // → identity row, "Opus 4.7 · ctx:12%" row, then the primary name, its
 * //   "coord:" branch, and the worktree's name-and-branch row.
 * ```
 */
export function renderStatusline(
  parts: StatuslineParts,
  options: StatuslineRenderOptions = {},
): string {
  const seg = buildSegments(parts);
  const logo = options.logo ?? 'none';
  return logo === 'none' ? renderNoLogo(seg) : renderWithLogo(seg, logo, options);
}

/**
 * No-logo layout: a loud error first, the identity-and-context summary, then the
 * pre-composed labelled location rows. Empty lines (all their segments absent) are
 * dropped so no blank row renders.
 */
function renderNoLogo(seg: Segments): string {
  const summaryLine = joinPresent([
    seg.identity,
    seg.indicators,
    seg.rateLimits,
    seg.model,
    seg.context,
  ]);
  return [seg.error, summaryLine, ...seg.locationRows]
    .filter((line): line is string => line !== undefined && line.length > 0)
    .join('\n');
}

/**
 * Logo layout: one rowText per segment-bearing row, zipped with the logo rows by
 * {@link composeWithLogo}. A loud error leads the block in any layout.
 */
function renderWithLogo(
  seg: Segments,
  logo: Exclude<OakLogoStyle, 'none'>,
  options: StatuslineRenderOptions,
): string {
  const rowTexts = [
    joinPresent([seg.identity, seg.indicators, seg.rateLimits]),
    joinPresent([seg.model, seg.context]),
    ...seg.locationRows,
  ];
  const logoRows = resolveLogoRows(logo, options.logoFrame ?? 0);
  const content = composeWithLogo(logoRows, rowTexts);
  const separatorRow = buildLogoSeparator(options.logoSeparator, logoRows);
  const block = separatorRow === undefined ? content : `${content}\n${separatorRow}`;
  return seg.error === undefined ? block : `${seg.error}\n${block}`;
}

/**
 * Compose the logo rows with the per-row segment text. Each logo row always
 * renders (the mark stays whole); the gap and text are appended only when that
 * row has segment text. A segment row beyond the logo block — e.g. the worktree
 * row on a four-row logo, where the five-row `braille-sharp` default carries it on
 * its last row — renders as a bare text line below the mark so it is never dropped.
 */
function composeWithLogo(logoRows: readonly string[], rowTexts: readonly string[]): string {
  const rowCount = Math.max(logoRows.length, rowTexts.length);
  const lines: string[] = [];
  for (let index = 0; index < rowCount; index += 1) {
    const logoRow = logoRows[index];
    const text = rowTexts[index] ?? '';
    if (logoRow === undefined) {
      if (text.length > 0) {
        lines.push(text);
      }
      continue;
    }
    const mark = `${LOGO_COLOUR}${logoRow}${RESET}`;
    lines.push(text.length > 0 ? `${mark}${LOGO_GAP}${text}` : mark);
  }
  return lines.join('\n');
}

/**
 * Build the separator rule beneath the logo, tiled and trimmed to the logo's own
 * display width (code points, not UTF-16 units — sextant glyphs are astral).
 *
 * @param separator - Rule glyph; defaults to {@link LOGO_SEPARATOR_GLYPH} when
 *   `undefined`. An empty string suppresses the rule.
 * @param logoRows - The active logo's rows; the first row's width sets the rule width.
 * @returns The coloured separator row, or `undefined` when suppressed or no rows.
 */
function buildLogoSeparator(
  separator: string | undefined,
  logoRows: readonly string[],
): string | undefined {
  const glyph = separator ?? LOGO_SEPARATOR_GLYPH;
  const firstRow = logoRows[0];
  if (glyph.length === 0 || firstRow === undefined) {
    return undefined;
  }
  const width = [...firstRow].length;
  const rule = [...glyph.repeat(width)].slice(0, width).join('');
  return `${DIM}${rule}${RESET}`;
}
