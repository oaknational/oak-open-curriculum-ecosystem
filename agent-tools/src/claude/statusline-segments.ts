/**
 * Statusline segment values and their ANSI-coloured formatting.
 *
 * @remarks
 * Pure: turns the gathered {@link StatuslineParts} into the coloured segment
 * strings the layout in `statusline-render.ts` assembles. Holds no I/O and no
 * layout decisions — only how each value is coloured and labelled. The colour
 * palette lives in `statusline-ansi.ts`; identity/indicator glyphs in
 * `statusline-indicators.ts`.
 *
 * @packageDocumentation
 */

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
  readonly model: string | undefined;
  readonly context: string | undefined;
  readonly branch: string | undefined;
  readonly place: string;
  readonly coordinationBranch: string | undefined;
  readonly coordinationPlace: string | undefined;
  readonly error: string | undefined;
}

const DIRTY_MARK = '*';
/** Marker leading the loud error token — chosen to be impossible to miss. */
const ERROR_MARK = '⚠';
/** Label distinguishing the coordination branch from the working branch. */
const COORDINATION_LABEL = 'coord:';
/** Context usage below this percentage renders in green; from it, yellow. */
const CONTEXT_ELEVATED_PERCENT = 50;
/** Context usage from this percentage upwards renders in red. */
const CONTEXT_HIGH_PERCENT = 70;

/** Format each {@link StatuslineParts} value into its coloured segment. */
export function buildSegments(parts: StatuslineParts): Segments {
  const place = parts.worktree === undefined ? parts.dir : `wt:${parts.worktree}`;
  return {
    identity: formatIdentity(parts.identity, parts.sessionShape?.ownRole),
    indicators: formatSessionIndicators(parts.sessionShape),
    model: parts.model === undefined ? undefined : `${DIM}${parts.model}${RESET}`,
    context: parts.usedPercentage === undefined ? undefined : formatContext(parts.usedPercentage),
    branch: formatBranch(parts.branch, parts.dirty),
    place: `${CYAN}${place}${RESET}`,
    coordinationBranch: formatCoordination(parts.coordinationBranch),
    coordinationPlace: formatCoordinationPlace(parts.coordinationPlace),
    error: formatError(parts.error),
  };
}

/**
 * Bold-blue working branch with a trailing dirty mark. The colour precedes BOLD:
 * BLUE carries a leading reset (`0;`) that would otherwise clear a preceding
 * bold; the trailing RESET ends both attributes before the dirty mark.
 */
function formatBranch(branch: string | undefined, dirty: boolean): string | undefined {
  if (branch === undefined) {
    return undefined;
  }
  const mark = dirty ? `${YELLOW}${DIRTY_MARK}${RESET}` : '';
  return `${BLUE}${BOLD}${branch}${RESET}${mark}`;
}

/**
 * Coordination branch as a labelled, non-bold blue so it reads as context
 * distinct from the bold working branch (which marks "where this session is").
 */
function formatCoordination(coordinationBranch: string | undefined): string | undefined {
  return coordinationBranch === undefined
    ? undefined
    : `${DIM}${COORDINATION_LABEL}${RESET}${BLUE}${coordinationBranch}${RESET}`;
}

/**
 * The primary checkout's name, in the same cyan as the working {@link Segments.place}
 * so the coordination line reads as a location-and-branch pair mirroring the
 * working line.
 */
function formatCoordinationPlace(coordinationPlace: string | undefined): string | undefined {
  return coordinationPlace === undefined ? undefined : `${CYAN}${coordinationPlace}${RESET}`;
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
