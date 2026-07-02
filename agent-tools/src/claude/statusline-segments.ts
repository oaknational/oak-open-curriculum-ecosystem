/**
 * Statusline segment values and their ANSI-coloured formatting.
 *
 * @remarks
 * Pure: turns the gathered {@link StatuslineParts} into the coloured segment
 * strings the layout in `statusline-render.ts` assembles, including the
 * pre-composed git-location rows (checkout name and branch; a `coord:`-prefixed
 * primary branch and a worktree row when in a linked worktree). It owns
 * colouring, labelling, and which facts share a location row; `statusline-render.ts`
 * owns the line/row geometry. Holds no I/O. The colour palette lives in
 * `statusline-ansi.ts`; identity/indicator glyphs in `statusline-indicators.ts`.
 *
 * @packageDocumentation
 */

import {
  BOLD,
  BLUE,
  CYAN,
  DIM,
  RED,
  RESET,
  HORIZONTAL_SEPARATOR,
  YELLOW,
} from './statusline-ansi.js';
import { formatIdentity, formatSessionIndicators } from './statusline-indicators.js';
import { type SessionShape } from './statusline-session-shape.js';
import { formatContext, rateLimitGauge } from './statusline-usage.js';

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
  /** Five-hour rate-limit consumed percentage (Claude.ai Pro/Max only); `undefined` when absent. */
  readonly fiveHourPercentage: number | undefined;
  /** Seconds until the five-hour window resets; `undefined` when absent (no countdown shown). */
  readonly fiveHourResetSeconds: number | undefined;
  /** Seven-day rate-limit consumed percentage (Claude.ai Pro/Max only); `undefined` when absent. */
  readonly sevenDayPercentage: number | undefined;
  /** Seconds until the seven-day window resets; `undefined` when absent (no countdown shown). */
  readonly sevenDayResetSeconds: number | undefined;
  /** Claude Code model display name. */
  readonly model: string | undefined;
  /**
   * Resolved session coordination shape (own role, team shape, ArcAngel
   * liveness); undefined when no shape was resolved for the tick, which renders
   * identically to a soloist with no live rapid channel — no indicators.
   */
  readonly sessionShape: SessionShape | undefined;
  /**
   * The team's shared coordination branch (the primary checkout's branch),
   * shown as a distinct fact from the working location on its own line when
   * linked worktrees exist; `undefined` in a solo checkout.
   */
  readonly coordinationBranch: string | undefined;
  /**
   * The primary checkout's display name (its directory basename), shown beside
   * the coordination branch so the line reads as "the primary checkout and its
   * branch". `undefined` when there is no coordination branch, **or** when the
   * name would merely repeat the working worktree name and was deduped away (see
   * the `branch` variant of `CoordinationBranch`) — so a present coordination
   * branch does not imply a present place.
   */
  readonly coordinationPlace: string | undefined;
  /**
   * A loud, specific failure to surface in place of a silent fallback — e.g. an
   * unexpected git error. Rendered as a glaring leading token, never swallowed.
   */
  readonly error: string | undefined;
}

/** The ANSI-coloured statusline segments, each absent when its value is. */
export interface Segments {
  readonly identity: string | undefined;
  readonly indicators: string | undefined;
  /** The Claude.ai rate-limit gauges (`s:…%(…) · w:…%(…)`); absent off Claude.ai or before the first response. */
  readonly rateLimits: string | undefined;
  readonly model: string | undefined;
  readonly context: string | undefined;
  /**
   * The git-location rows. When the session's checkout is the only relevant
   * location (no coordination branch resolved), the checkout name on one row and
   * its branch on the next — or just the name outside a repository. When the
   * session sits in a linked worktree (a coordination branch resolved), three
   * rows: the shared primary checkout's name, its branch prefixed `coord:`, then
   * this worktree's name and branch.
   */
  readonly locationRows: readonly string[];
  readonly error: string | undefined;
}

const DIRTY_MARK = '*';
/** Marker leading the loud error token — chosen to be impossible to miss. */
const ERROR_MARK = '⚠';
/** Label prefixing the primary checkout's branch when the session is in a worktree. */
const COORDINATION_LABEL = 'coord:';

/** Format each {@link StatuslineParts} value into its coloured segment. */
export function buildSegments(parts: StatuslineParts): Segments {
  return {
    identity: formatIdentity(parts.identity, parts.sessionShape?.ownRole),
    indicators: formatSessionIndicators(parts.sessionShape),
    rateLimits: formatRateLimits(parts),
    model: parts.model === undefined ? undefined : `${DIM}${parts.model}${RESET}`,
    context: parts.usedPercentage === undefined ? undefined : formatContext(parts.usedPercentage),
    locationRows: buildLocationRows(parts),
    error: formatError(parts.error),
  };
}

/**
 * Build the git-location rows from the resolved parts.
 *
 * With no resolved coordination branch the session sits in the only relevant
 * checkout: its name on one row, its branch on the next (or just the name outside
 * a repository). With a coordination branch resolved the session sits in a linked
 * worktree, so three rows: the shared primary checkout's name, then its branch
 * prefixed `coord:`, then this worktree's name and branch together. The branch the
 * session is ON (the lone primary branch, or the worktree branch) is bold blue
 * (where you are); the primary-as-context coord branch is non-bold (where you are
 * not). The coordination branch resolves to a value exactly when linked worktrees
 * exist AND it diverges from the working branch — which, because git forbids the
 * same branch in two worktrees, distinguishes "in a worktree" from "in the
 * primary" reliably (see statusline-git-location.ts).
 */
function buildLocationRows(parts: StatuslineParts): readonly string[] {
  if (parts.coordinationBranch === undefined) {
    return compactRows([placeName(parts.dir), formatBranch(parts.branch, parts.dirty)]);
  }
  return compactRows([
    parts.coordinationPlace === undefined ? undefined : placeName(parts.coordinationPlace),
    `${DIM}${COORDINATION_LABEL}${RESET} ${formatContextBranch(parts.coordinationBranch)}`,
    worktreeRow(parts),
  ]);
}

/** This worktree's name and branch on one row; the name alone if the branch is unresolved. */
function worktreeRow(parts: StatuslineParts): string {
  const name = placeName(parts.worktree ?? parts.dir);
  const branch = formatBranch(parts.branch, parts.dirty);
  return branch === undefined ? name : `${name} ${branch}`;
}

/** Drop absent or empty rows, preserving order. */
function compactRows(rows: readonly (string | undefined)[]): string[] {
  return rows.filter((row): row is string => row !== undefined && row.length > 0);
}

/**
 * Bold-blue working branch with a trailing dirty mark — the branch the session is
 * ON. The colour precedes BOLD: BLUE carries a leading reset (`0;`) that would
 * otherwise clear a preceding bold; the trailing RESET ends both attributes before
 * the dirty mark.
 */
function formatBranch(branch: string | undefined, dirty: boolean): string | undefined {
  if (branch === undefined) {
    return undefined;
  }
  const mark = dirty ? `${YELLOW}${DIRTY_MARK}${RESET}` : '';
  return `${BLUE}${BOLD}${branch}${RESET}${mark}`;
}

/**
 * A coordination/context branch in non-bold blue — the primary checkout's branch,
 * shown as context distinct from the bold working branch (which marks where the
 * session is).
 */
function formatContextBranch(branch: string): string {
  return `${BLUE}${branch}${RESET}`;
}

/** A checkout or worktree name in cyan, matching across the working and coordination rows. */
function placeName(name: string): string {
  return `${CYAN}${name}${RESET}`;
}

/** A failure is glaring (bold red, marked) and never blank: it must be seen and fixed. */
function formatError(error: string | undefined): string | undefined {
  return error === undefined ? undefined : `${RED}${BOLD}${ERROR_MARK} ${error}${RESET}`;
}

/** Join the present segments with the separator, dropping `undefined` ones. */
export function joinPresent(segments: readonly (string | undefined)[]): string {
  return segments
    .filter((segment): segment is string => segment !== undefined)
    .join(HORIZONTAL_SEPARATOR);
}

/**
 * The Claude.ai rate-limit gauges — the session (`s`, five-hour) and week (`w`,
 * seven-day) consumed percentages, each with a parenthesised countdown to its
 * reset, e.g. `s:33%(2h) · w:55%(3d)`. The percentage carries the consumption
 * colour ramp; the countdown is DIM (secondary context). Each window is
 * independently optional (absent for non-Claude.ai sessions and before the first
 * response), and the countdown is dropped when its reset instant is absent; when
 * both windows are absent the whole segment is dropped.
 */
function formatRateLimits(parts: StatuslineParts): string | undefined {
  const joined = joinPresent([
    rateLimitGauge('s', parts.fiveHourPercentage, parts.fiveHourResetSeconds),
    rateLimitGauge('w', parts.sevenDayPercentage, parts.sevenDayResetSeconds),
  ]);
  return joined.length === 0 ? undefined : joined;
}
