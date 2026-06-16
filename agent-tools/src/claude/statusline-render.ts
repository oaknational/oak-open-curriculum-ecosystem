/**
 * Pure renderer for the Claude Code statusline.
 *
 * @remarks
 * Assembles the Claude Code statusline from already-gathered values. Holds no
 * I/O: the imperative adapter (`statusline-identity.ts`) derives the agent
 * identity, gathers git state, and resolves the session-shape indicators, then
 * delegates formatting here so the layout is unit-testable. The colour palette
 * lives in `statusline-ansi.ts` and the coordination-indicator glyphs in
 * `statusline-indicators.ts`, so this file holds the layout concern alone.
 *
 * Segment order puts the short, fixed-width segments (identity, session-shape
 * indicators, model, context %) first and the long, variable-width git segments
 * last, so a narrow terminal truncates the least important information first.
 *
 * The session-shape indicators are glanceable coordination glyphs (a Director
 * demark on the identity, a team-shape icon, an ArcAngel wing) that sit with the
 * identity: the no-logo layout keeps them on the coordination line, the
 * logo layout trails them on the identity row. With a logo style the statusline
 * renders as a logo-column block (the Oak mark on the left, segments to its
 * right — five rows for the default `braille-sharp`, four for the other styles);
 * without one it renders over two lines — the coordination segments first, then
 * the git location.
 *
 * @packageDocumentation
 */

import { OAK_LOGO_ROWS, type OakLogoStyle } from './oak-logo.js';
import {
  BOLD,
  BLUE,
  CYAN,
  DIM,
  GREEN,
  RED,
  RESET,
  HORIZONTAL_SEPARATOR,
  YELLOW,
} from './statusline-ansi.js';
import { formatIdentity, formatSessionIndicators } from './statusline-indicators.js';
import { type SessionShape } from './statusline-session-shape.js';

// This should live with the logo asset and be imported.
const LOGO_COLOUR = GREEN;

/**
 * Segment values for a single statusline render. Each visible segment is
 * optional; absent segments are dropped and the rest joined with a separator.
 */
export interface StatuslineParts {
  /** Deterministic agent-identity display name (PDR-027). */
  readonly identity: string | undefined;
  /** Current workspace directory basename. */
  readonly dir: string;
  /** Current git branch (or short SHA), if inside a repository. */
  readonly branch: string | undefined;
  /** Whether the working tree has tracked or untracked changes. */
  readonly dirty: boolean;
  /** Linked-worktree name; absent in the main working tree. */
  readonly worktree: string | undefined;
  /** Claude Code context-window usage percentage. */
  readonly usedPercentage: number | undefined;
  /** Claude Code model display name. */
  readonly model: string | undefined;
  /**
   * Resolved session coordination shape (own role, team shape, ArcAngel
   * liveness); undefined when no shape was resolved for the tick, which renders
   * identically to a soloist with no live rapid channel — no indicators.
   */
  readonly sessionShape: SessionShape | undefined;
}

/** Optional presentation controls for {@link renderStatusline}. */
export interface StatuslineRenderOptions {
  /**
   * Glyph family for the Oak mark. `none` (the default) renders the original
   * single line; any other style renders the multi-row logo-column layout (five
   * rows for `braille-sharp`, four for the other styles).
   */
  readonly logo?: OakLogoStyle;
  /**
   * Rule glyph for the horizontal separator beneath the logo block, which
   * divides it from the prompt Claude Code renders below. **On by default**
   * (omit it for the default glyph). Whatever glyph is used is tiled and trimmed
   * to the **active logo's display width** so the rule spans exactly the logo
   * column, whichever style is active. Pass an empty string to suppress the rule
   * entirely. Only the logo layout carries it; the no-logo layout ignores it.
   * The glyph must be visible content — Claude Code drops a purely-empty
   * trailing line, so a bare space would render no gap.
   */
  readonly logoSeparator?: string;
}

const DIRTY_MARK = '*';
/** Gap between the logo column and the segment text, in the multi-row layout. */
const LOGO_GAP = '  ';
/** Default rule glyph for the logo separator row, tiled to the logo width. */
const LOGO_SEPARATOR_GLYPH = '_';

/** Context usage below this percentage renders in green; from it, yellow. */
const CONTEXT_ELEVATED_PERCENT = 50;
/** Context usage from this percentage upwards renders in red. */
const CONTEXT_HIGH_PERCENT = 70;

/**
 * Assemble the statusline from gathered segment values.
 *
 * @param parts - The resolved segment values.
 * @param options - Optional presentation controls (e.g. the Oak logo style).
 * @returns The ANSI-coloured statusline. Without a logo it renders over two
 *   lines (coordination: identity, indicators, model, context; then git: branch,
 *   place — absent segments dropped, an empty line omitted). With a logo it is
 *   the logo-column rows (five for the default `braille-sharp`, four for the
 *   other styles) — the Oak mark column with the segments to its right, the
 *   indicators trailing the identity on row 0 — followed by a separator rule row
 *   spanning the logo width (on by default; pass an empty `logoSeparator` to
 *   suppress it).
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
 * });
 * // -> "<magenta>Fragrant... · Opus 4.7 · ctx:12%\nfeat/...* · wt:oak-wt-eef"
 * ```
 */
export function renderStatusline(
  parts: StatuslineParts,
  options: StatuslineRenderOptions = {},
): string {
  const seg = buildSegments(parts);
  const logo = options.logo ?? 'none';
  if (logo === 'none') {
    // No logo: two lines — coordination segments first, then the git location;
    // an empty line (all its segments absent) is dropped so no blank row renders.
    const coordinationLine = joinPresent([seg.identity, seg.indicators, seg.model, seg.context]);
    const locationLine = joinPresent([seg.branch, seg.place]);
    return [coordinationLine, locationLine].filter((line) => line.length > 0).join('\n');
  }

  // One rowText entry per segment-bearing row; composeWithLogo drives off the
  // logo rows (five for the default braille-sharp, four otherwise), so any logo
  // row beyond these renders as a bare mark — the acorn's base sits below the
  // segments. Indicators trail the identity on row 0. A separator rule row (on
  // by default, spanning the logo width; see logoSeparator) divides the block
  // from the prompt Claude Code renders beneath it.
  const rowTexts = [
    joinPresent([seg.identity, seg.indicators]),
    seg.model ?? '',
    joinPresent([seg.context, seg.branch]),
    seg.place,
  ];
  const logoRows = OAK_LOGO_ROWS[logo];
  const statuslineContent = composeWithLogo(logoRows, rowTexts);
  const separatorRow = buildLogoSeparator(options.logoSeparator, logoRows);
  return separatorRow === undefined ? statuslineContent : `${statuslineContent}\n${separatorRow}`;
}

/** The ANSI-coloured statusline segments, each absent when its value is. */
interface Segments {
  readonly identity: string | undefined;
  readonly indicators: string | undefined;
  readonly model: string | undefined;
  readonly context: string | undefined;
  readonly branch: string | undefined;
  readonly place: string;
}

/** Format each {@link StatuslineParts} value into its coloured segment. */
function buildSegments(parts: StatuslineParts): Segments {
  const dirty = parts.dirty ? `${YELLOW}${DIRTY_MARK}${RESET}` : '';
  const place = parts.worktree === undefined ? parts.dir : `wt:${parts.worktree}`;
  return {
    identity: formatIdentity(parts.identity, parts.sessionShape?.ownRole),
    indicators: formatSessionIndicators(parts.sessionShape),
    model: parts.model === undefined ? undefined : `${DIM}${parts.model}${RESET}`,
    context: parts.usedPercentage === undefined ? undefined : formatContext(parts.usedPercentage),
    // Branch is bold blue. Apply the colour before BOLD: BLUE carries a leading
    // reset (`0;`) that would otherwise clear a preceding bold. The trailing
    // RESET ends both attributes before the dirty mark.
    branch:
      parts.branch === undefined ? undefined : `${BLUE}${BOLD}${parts.branch}${RESET}${dirty}`,
    place: `${CYAN}${place}${RESET}`,
  };
}

/** Join the present segments with the separator, dropping `undefined` ones. */
function joinPresent(segments: readonly (string | undefined)[]): string {
  return segments
    .filter((segment): segment is string => segment !== undefined)
    .join(HORIZONTAL_SEPARATOR);
}

/**
 * Compose the logo rows with the per-row segment text. Each logo row always
 * renders (the mark stays whole); the gap and text are appended only when that
 * row has segment text.
 */
function composeWithLogo(logoRows: readonly string[], rowTexts: readonly string[]): string {
  return logoRows
    .map((logoRow, index) => {
      const mark = `${LOGO_COLOUR}${logoRow}${RESET}`;
      const text = rowTexts[index] ?? '';
      return text.length > 0 ? `${mark}${LOGO_GAP}${text}` : mark;
    })
    .join('\n');
}

/**
 * Build the separator rule beneath the logo, tiled and trimmed to the logo's own
 * display width (code points, not UTF-16 units — sextant glyphs are astral).
 *
 * @param separator - Rule glyph; defaults to {@link LOGO_SEPARATOR_GLYPH} when
 *   `undefined`. An empty string suppresses the rule.
 * @param logoRows - The active logo's rows; row width sets the rule width.
 * @returns The coloured separator row, or `undefined` when suppressed.
 */
function buildLogoSeparator(
  separator: string | undefined,
  logoRows: readonly string[],
): string | undefined {
  const glyph = separator ?? LOGO_SEPARATOR_GLYPH;
  if (glyph.length === 0) {
    return undefined;
  }
  const width = [...logoRows[0]].length;
  const rule = [...glyph.repeat(width)].slice(0, width).join('');
  return `${DIM}${rule}${RESET}`;
}

/** Format context usage, colour-coded as a glance-warning once it climbs. */
function formatContext(usedPercentage: number): string {
  const pct = Math.round(usedPercentage);
  const text = `ctx:${pct}%`;
  if (pct >= CONTEXT_HIGH_PERCENT) {
    return `${RED}${text}${RESET}`;
  }
  if (pct >= CONTEXT_ELEVATED_PERCENT) {
    return `${YELLOW}${text}${RESET}`;
  }
  return `${GREEN}${text}${RESET}`;
}
