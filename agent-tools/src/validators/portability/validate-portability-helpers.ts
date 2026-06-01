/**
 * Public API barrel for the portability validator helper modules.
 *
 * This file re-exports every symbol that was previously defined here, so
 * all existing imports from `./validate-portability-helpers.js` continue to
 * resolve without change.  The implementations now live in focused sibling
 * modules split along responsibility boundaries:
 *
 * - `portability-constants` — Shared path constants, command strings,
 *   and the `stripDirAndExtension` utility.
 * - `claude-hook-detection` — Hook detection predicates: status reading,
 *   settings-wiring checks, surface-matrix description check.
 * - `claude-hook-wiring` — Hook-wiring issue collection that combines
 *   the detection predicates into human-readable portability issues.
 * - `reviewer-adapter-parity` — Cross-platform reviewer adapter parity checks.
 * - `skill-permission-checks` — Claude Code skill/command permission
 *   allow-list checks.
 * - `rules-index-checks` — Codex fallback rules index and
 *   `skills-lock.json` checks.
 */

export {
  HOOK_POLICY_PATH,
  CLAUDE_SETTINGS_PATH,
  SURFACE_MATRIX_PATH,
  CLAUDE_HOOK_COMMAND,
  RULES_INDEX_PATH,
} from './portability-constants.js';

export {
  isClaudeHookWired,
  isClaudeHookWiredInText,
  surfaceMatrixDescribesClaudeHook,
} from './claude-hook-detection.js';

export { getClaudeHookPortabilityIssues } from './claude-hook-wiring.js';

export { getReviewerAdapterParityIssues } from './reviewer-adapter-parity.js';

export { getSkillPermissionIssues } from './skill-permission-checks.js';

export { getRulesIndexPortabilityIssues, getSkillsLockEntries } from './rules-index-checks.js';
