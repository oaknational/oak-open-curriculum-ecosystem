/**
 * Shared constants used across portability-validator modules.
 *
 * Centralising constants here ensures that every check module references the
 * same canonical paths and command strings, and that the test suite can import
 * them without pulling in any filesystem or JSON-parsing logic.
 */

/**
 * Repo-relative path to the platform-support hook policy file.
 * This file declares which agent platforms have hook support wired.
 */
export const HOOK_POLICY_PATH = '.agent/hooks/policy.json';

/**
 * Repo-relative path to the tracked Claude Code project settings file.
 * This file is the installation point for the Bash PreToolUse hook.
 */
export const CLAUDE_SETTINGS_PATH = '.claude/settings.json';

/**
 * Repo-relative path to the cross-platform agent surface matrix document.
 * The matrix must describe the native hook activation for Claude Code.
 */
export const SURFACE_MATRIX_PATH = '.agent/memory/executive/cross-platform-agent-surface-matrix.md';

/**
 * Full command string wired into `.claude/settings.json` for each `PreToolUse`
 * policy matcher (Bash, Edit, Write): the verdict shim invoking the single
 * policy dispatcher artefact.  The `${CLAUDE_PROJECT_DIR}` shell variable is
 * expanded at runtime by Claude Code; use {@link CLAUDE_HOOK_ARTEFACT} for
 * substring matching where the expansion is unavailable.
 */
export const CLAUDE_HOOK_COMMAND =
  'node "${CLAUDE_PROJECT_DIR}/.claude/hooks/run-pretooluse-guard.mjs" agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js';

/**
 * Stable, quote- and expansion-free substring that uniquely identifies the
 * PreToolUse policy dispatcher in `.claude/settings.json` and the surface
 * matrix.
 *
 * Used for wiring assertions because the full command embeds
 * `${CLAUDE_PROJECT_DIR}` and JSON-escaped quotes — a literal match would have
 * to reproduce the exact shell expansion that only Claude Code performs at
 * runtime.  Matching this substring is therefore sufficient and portable.
 */
export const CLAUDE_HOOK_ARTEFACT = 'agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js';

/**
 * Repo-relative path to the rules index, the projection of every rule declaration that
 * platforms which load no rule adapters (Codex) read instead. The renderer owns the path;
 * it is re-exported here so the validator modules share one definition.
 */
export { RULES_INDEX_PATH } from '../../rule-declarations/render-rule-projections.js';

/**
 * Maximum allowed byte size for the Codex project-doc rules index.
 * Codex imposes an overall project-document size budget; exceeding this limit
 * risks truncation and silent rule-load failures.
 *
 * Default: 32 KiB (32 × 1 024 bytes).
 */
export const DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES = 32 * 1024;

/**
 * Strips the directory prefix and the given file extension from a file path,
 * returning only the bare base name.
 *
 * @example
 * stripDirAndExtension('.claude/agents/code-expert.md', '.md') // → 'code-expert'
 *
 * @param filePath  - The full or relative file path to process.
 * @param extension - The extension to remove (including the leading dot).
 * @returns The base name with the extension removed, or the full path if the
 *   extension is not present.
 */
export function stripDirAndExtension(filePath: string, extension: string): string {
  const lastSlash = filePath.lastIndexOf('/');
  const basename = lastSlash >= 0 ? filePath.slice(lastSlash + 1) : filePath;
  return basename.endsWith(extension) ? basename.slice(0, -extension.length) : basename;
}
