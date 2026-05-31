/**
 * Claude Code hook detection predicates for the portability validator.
 *
 * These pure functions determine whether the Bash `PreToolUse`
 * blocked-pattern hook is present in `.claude/settings.json`, and whether the
 * cross-platform surface matrix document describes the native activation.
 *
 * No filesystem access occurs here — callers are responsible for loading the
 * file content and passing it in.
 */

import { isJsonObject } from '../../collaboration-state/json.js';
import { CLAUDE_HOOK_ARTEFACT } from './portability-constants.js';

/**
 * Reads the `platform_support.claude_code.status` field from a parsed hook
 * policy object.
 *
 * @param hookPolicy - The parsed JSON content of `.agent/hooks/policy.json`.
 * @returns The status string (e.g. `'supported'` or `'unsupported'`) or `null`
 *   when the path is absent or the value is not a string.
 */
export function getClaudeHookStatus(hookPolicy: unknown): string | null {
  return isJsonObject(hookPolicy) &&
    isJsonObject(hookPolicy['platform_support']) &&
    isJsonObject(hookPolicy['platform_support']['claude_code']) &&
    typeof hookPolicy['platform_support']['claude_code']['status'] === 'string'
    ? hookPolicy['platform_support']['claude_code']['status']
    : null;
}

/**
 * Checks whether the parsed `.claude/settings.json` object contains a Bash
 * `PreToolUse` hook whose command includes the given artefact substring.
 *
 * Uses structural traversal of the parsed JSON value so no regex or text
 * scanning is required.  Prefer {@link isClaudeHookWiredInText} when the raw
 * file text is available, as it is more resilient to non-standard JSON
 * formatting.
 *
 * @param claudeSettings - The parsed JSON value of `.claude/settings.json`.
 * @param hookArtefact   - Substring to match against each hook command.
 *   Defaults to {@link CLAUDE_HOOK_ARTEFACT}.
 * @returns `true` when at least one matching hook entry is found.
 */
export function isClaudeHookWired(
  claudeSettings: unknown,
  hookArtefact = CLAUDE_HOOK_ARTEFACT,
): boolean {
  const groups =
    isJsonObject(claudeSettings) &&
    isJsonObject(claudeSettings['hooks']) &&
    Array.isArray(claudeSettings['hooks']['PreToolUse'])
      ? claudeSettings['hooks']['PreToolUse']
      : [];
  return groups.some((group) => {
    if (!isJsonObject(group) || group['matcher'] !== 'Bash' || !Array.isArray(group['hooks'])) {
      return false;
    }
    return group['hooks'].some(
      (hook) =>
        isJsonObject(hook) &&
        hook['type'] === 'command' &&
        typeof hook['command'] === 'string' &&
        hook['command'].includes(hookArtefact),
    );
  });
}

/**
 * Checks whether the raw text of `.claude/settings.json` describes a Bash
 * `PreToolUse` hook containing the given artefact substring.
 *
 * This text-based check is order-independent and is therefore preferred when
 * the raw file content is available.  It avoids any dependency on JSON key
 * ordering.
 *
 * @param claudeSettingsText - The raw UTF-8 text of `.claude/settings.json`,
 *   or a non-string value which will return `false`.
 * @param hookArtefact       - Substring to search for in the text.
 *   Defaults to {@link CLAUDE_HOOK_ARTEFACT}.
 * @returns `true` when the text contains all four required patterns.
 */
export function isClaudeHookWiredInText(
  claudeSettingsText: unknown,
  hookArtefact = CLAUDE_HOOK_ARTEFACT,
): boolean {
  if (typeof claudeSettingsText !== 'string') {
    return false;
  }
  return (
    claudeSettingsText.includes('"PreToolUse"') &&
    /"matcher"\s*:\s*"Bash"/u.test(claudeSettingsText) &&
    /"type"\s*:\s*"command"/u.test(claudeSettingsText) &&
    claudeSettingsText.includes(hookArtefact)
  );
}

/**
 * Checks whether the cross-platform agent surface matrix document correctly
 * describes the native Claude Code hook activation.
 *
 * The check requires:
 * - A Hooks table row that mentions `unsupported`, `.claude/settings.json`,
 *   `tracked`, and `PreToolUse`.
 * - The canonical `.agent/hooks/policy.json` path.
 * - The artefact path {@link CLAUDE_HOOK_ARTEFACT}.
 * - The "Policy Spine" section header.
 * - The three policy-spine semantics keywords: `override`, `prune`, `block`.
 *
 * @param surfaceMatrix - The full text of the surface matrix Markdown document.
 * @returns `true` when all required patterns are present.
 */
export function surfaceMatrixDescribesClaudeHook(surfaceMatrix: string): boolean {
  const hookRowMatches =
    /\|\s*\*\*Hooks\*\*\s*\|[^\n]*unsupported[^\n]*\.claude\/settings\.json[^\n]*tracked[^\n]*PreToolUse/iu.test(
      surfaceMatrix,
    );
  const policySpineSemanticsMatch = /\boverride\b[\s\S]*\bprune\b[\s\S]*\bblock\b/u.test(
    surfaceMatrix,
  );
  return (
    hookRowMatches &&
    surfaceMatrix.includes('.agent/hooks/policy.json') &&
    surfaceMatrix.includes(CLAUDE_HOOK_ARTEFACT) &&
    surfaceMatrix.includes('Policy Spine') &&
    policySpineSemanticsMatch
  );
}
