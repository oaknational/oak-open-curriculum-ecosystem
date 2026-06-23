/**
 * Coordination-indicator formatting for the Claude Code statusline.
 *
 * @remarks
 * Owns the glanceable coordination vocabulary — the Director demark on the
 * identity, the team-shape icon, and the ArcAngel wing — separated from the
 * layout composition in `statusline-render.ts` so each file holds one concern
 * and the glyph set can grow without pressing the renderer's size budget.
 * Holds no I/O: it formats from an already-resolved {@link SessionShape}.
 *
 * @packageDocumentation
 */

import { DIM, MAGENTA, RESET } from './statusline-ansi.js';
import { type SessionShape } from './statusline-session-shape.js';

/**
 * Session-shape indicator glyphs — five verified in the owner's terminals
 * (2026-06-13): DIRECTOR_MARK, TEAM_DIRECTED_ICON, TEAM_PEER_ICON, TEAM_SOLO_ICON,
 * ARC_WING. The original peer glyph U+1F465 (busts) tofu'd and was replaced by
 * U+1F91D. TEAM_OBSERVING_ICON (U+1F440, eyes) was added 2026-06-14 for the
 * non-member "others are active here" shape and is PENDING owner terminal
 * verification. ASCII fallbacks if a font regresses: `[D]` `[T]` `[P]` `[S]`
 * `[A]` `[o]`.
 */
const DIRECTOR_MARK = '\u{1F9ED}';
const TEAM_DIRECTED_ICON = '\u{1F46A}';
const TEAM_PEER_ICON = '\u{1F91D}';
const TEAM_SOLO_ICON = '\u{1F9CD}';
const TEAM_OBSERVING_ICON = '\u{1F440}';
const ARC_WING = '\u{1FAB6}';

/**
 * Format the identity segment, suffixing the Director demark when this session's
 * fresh claim carries the director role. Undefined identity drops the segment
 * (and the demark with it — a directorship needs an identity to resolve).
 */
export function formatIdentity(
  identity: string | undefined,
  ownRole: string | undefined,
): string | undefined {
  if (identity === undefined) {
    return undefined;
  }
  const demark = ownRole === 'director' ? ` ${DIRECTOR_MARK}` : '';
  return `${MAGENTA}${identity}${RESET}${demark}`;
}

/**
 * Format the team-shape icon and ArcAngel wing as one segment, or undefined
 * when there is nothing to show — only an unknown shape (or no resolved shape)
 * with no live channel renders blank; a confident solo carries its own marker.
 */
export function formatSessionIndicators(shape: SessionShape | undefined): string | undefined {
  if (shape === undefined) {
    return undefined;
  }
  const team = teamIcon(shape.teamShape);
  const wing = shape.arcActive ? ARC_WING : undefined;
  const indicators = [team, wing].filter((glyph) => glyph !== undefined).join(' ');
  return indicators.length === 0 ? undefined : indicators;
}

/**
 * Map a resolved team shape to its glyph: `solo` shows its own marker;
 * `observing` (others active, this session not registered) shows a dimmed eyes
 * glyph — distinct from membership and deliberately quieter, so the glance
 * reads as "be collision-aware" rather than "you are on a team"; `unknown`
 * shows nothing (an unreadable surface reads as absence, never a false solo).
 */
function teamIcon(teamShape: SessionShape['teamShape']): string | undefined {
  if (teamShape === 'directed') {
    return TEAM_DIRECTED_ICON;
  }
  if (teamShape === 'peer') {
    return TEAM_PEER_ICON;
  }
  if (teamShape === 'solo') {
    return TEAM_SOLO_ICON;
  }
  if (teamShape === 'observing') {
    return `${DIM}${TEAM_OBSERVING_ICON}${RESET}`;
  }
  return undefined;
}
