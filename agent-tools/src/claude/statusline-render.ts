/**
 * Pure renderer for the Claude Code statusline.
 *
 * @remarks
 * Assembles the Claude Code statusline from already-gathered values. Holds no
 * I/O: the imperative adapter (`statusline-identity.ts`) derives the agent
 * identity and gathers git state, then delegates formatting here so the layout
 * is unit-testable.
 *
 * @packageDocumentation
 */

/**
 * Segment values for a single statusline render. Each is optional; absent
 * segments are dropped and the rest joined with a separator.
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
}

const RESET = '\u001b[0m';
const BOLD_GREEN = '\u001b[1;32m';
const CYAN = '\u001b[0;36m';
const BOLD_BLUE = '\u001b[1;34m';
const RED = '\u001b[0;31m';
const YELLOW = '\u001b[0;33m';
const MAGENTA = '\u001b[0;35m';

const PROMPT_ARROW = '➜';
const DIRTY_MARK = '✗';

/**
 * Assemble the statusline string from gathered segment values.
 *
 * @param parts - The resolved segment values.
 * @returns The ANSI-coloured statusline; an empty string when every segment is
 *   absent.
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
 * });
 * // -> "<magenta>Fragrant... <green>➜ <cyan>oak-wt-eef <blue>git:(...) ..."
 * ```
 */
export function renderStatusline(parts: StatuslineParts): string {
  const segments: string[] = [];
  if (parts.identity) {
    segments.push(`${MAGENTA}${parts.identity}${RESET}`);
  }

  segments.push(`${BOLD_GREEN}${PROMPT_ARROW}${RESET} ${CYAN}${parts.dir}${RESET}`);

  if (parts.branch !== undefined) {
    const dirty = parts.dirty ? ` ${YELLOW}${DIRTY_MARK}${RESET}` : '';
    segments.push(`${BOLD_BLUE}git:(${RED}${parts.branch}${BOLD_BLUE})${RESET}${dirty}`);
  }
  if (parts.worktree !== undefined) {
    segments.push(`${BOLD_BLUE}wt:(${CYAN}${parts.worktree}${BOLD_BLUE})${RESET}`);
  }
  if (parts.usedPercentage !== undefined) {
    segments.push(`ctx:${Math.round(parts.usedPercentage)}%`);
  }
  if (parts.model !== undefined) {
    segments.push(`[${parts.model}]`);
  }

  return segments.join(' ');
}
