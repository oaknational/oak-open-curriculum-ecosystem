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
 * four-row logo layout trails them on the identity row. With a logo style the
 * statusline renders as a four-row block (the Oak mark as a left logo-column,
 * segments to its right); without one (the default) it renders over two lines —
 * the coordination segments first, then the git location.
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
   * single line; any other style renders the four-row logo-column layout.
   */
  readonly logo?: OakLogoStyle;
  /**
   * Visible rule appended as a trailing row beneath the four-row logo block,
   * separating it from the prompt Claude Code renders below. Defaults to
   * {@link DEFAULT_LOGO_SEPARATOR}. Only the logo layout carries it; the
   * no-logo layout ignores it. It must be visible content — Claude Code drops
   * a purely-empty trailing line, so a bare newline would render no gap.
   */
  readonly logoSeparator?: string;
}

const DIRTY_MARK = '*';
/** Gap between the logo column and the segment text, in the multi-row layout. */
const LOGO_GAP = '  ';
/** Default {@link StatuslineRenderOptions.logoSeparator} — owner-tunable presentation. */
const DEFAULT_LOGO_SEPARATOR = '______';

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
 *   four newline-separated rows — the Oak mark column with the segments to its
 *   right, the indicators trailing the identity on row 0 — followed by a
 *   trailing separator row that divides the block from the prompt beneath it.
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

  // One entry per logo row (all styles are four rows); composeWithLogo drives
  // off the logo rows, so a row without text here renders as a bare mark. The
  // indicators trail the identity on row 0 — the coordination glyphs stay with
  // the agent name. A trailing separator row divides the block from the prompt
  // that Claude Code renders beneath it.
  const rowTexts = [
    joinPresent([seg.identity, seg.indicators]),
    seg.model ?? '',
    joinPresent([seg.context, seg.branch]),
    seg.place,
  ];
  const separator = options.logoSeparator ?? DEFAULT_LOGO_SEPARATOR;
  const statuslineContent = composeWithLogo(OAK_LOGO_ROWS[logo], rowTexts);
  const separatorColour = `${DIM}`;
  const separatorContent = `${separatorColour}${separator}${RESET}`;
  return `${statuslineContent}\n${separatorContent}`;
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
