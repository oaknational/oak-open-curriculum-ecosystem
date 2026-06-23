/**
 * Shared ANSI palette for the Claude Code statusline.
 *
 * @remarks
 * The single owner of the colour vocabulary so the layout renderer
 * (`statusline-render.ts`) and the coordination-indicator formatter
 * (`statusline-indicators.ts`) share one source of truth rather than each
 * carrying a private copy that could drift. Codes use the `\x1b` (ESC) hex
 * escape so the bytes are unambiguous and the source stays free of literal
 * control characters.
 *
 * @packageDocumentation
 */

export const BOLD = '\x1b[1m';
export const RESET = '\x1b[0m';
export const DIM = '\x1b[2m';
export const CYAN = '\x1b[0;36m';
export const BLUE = '\x1b[0;34m';
export const GREEN = '\x1b[0;32m';
export const RED = '\x1b[0;31m';
export const YELLOW = '\x1b[0;33m';
export const MAGENTA = '\x1b[0;35m';

/** The dim middot that joins present segments on one line. */
export const HORIZONTAL_SEPARATOR = `${DIM} · ${RESET}`;
