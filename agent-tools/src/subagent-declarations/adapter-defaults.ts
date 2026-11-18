/**
 * The estate's default adapter fields. A ROLE declares only its deviations from these and
 * the renderers fill the rest; a VARIANT renders exactly what it declares, and so does a
 * role's Claude adapter whose body is its template's System prompt block (`claude-fields.ts`).
 *
 * @packageDocumentation
 */

/** The Claude adapter's default fields. */
export const CLAUDE_DEFAULTS = {
  tools: 'Read, Grep, Glob, Bash',
  disallowedTools: 'Write, Edit',
  permissionMode: 'plan',
} as const;

/** The Codex adapter's default fields. */
export const CODEX_DEFAULTS = { effort: 'high' } as const;
