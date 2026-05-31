/**
 * Claude Code hook-wiring issue collection for the portability validator.
 *
 * This module assembles the list of portability issues related to Claude
 * Code's Bash `PreToolUse` hook by combining:
 *
 * - The hook policy status from `.agent/hooks/policy.json`.
 * - The wiring state of `.claude/settings.json`.
 * - The surface-matrix documentation state.
 *
 * Detection predicates live in `claude-hook-detection`; path
 * constants in `portability-constants`.
 */

import {
  CLAUDE_HOOK_COMMAND,
  CLAUDE_SETTINGS_PATH,
  HOOK_POLICY_PATH,
  SURFACE_MATRIX_PATH,
} from './portability-constants.js';
import {
  getClaudeHookStatus,
  isClaudeHookWired,
  isClaudeHookWiredInText,
  surfaceMatrixDescribesClaudeHook,
} from './claude-hook-detection.js';

/**
 * Options for {@link getClaudeHookPortabilityIssues}.
 */
export interface ClaudeHookPortabilityIssuesOptions {
  /** Parsed content of `.agent/hooks/policy.json`. */
  hookPolicy: unknown;
  /** Parsed JSON object of `.claude/settings.json`, when available. */
  claudeSettings?: unknown;
  /** Raw text of `.claude/settings.json`, preferred over the parsed object. */
  claudeSettingsText?: string | null;
  /**
   * Whether `.claude/settings.json` is present on disk.
   * Defaults to `true` when not provided.
   */
  claudeSettingsExists?: boolean;
  /** Full text of the cross-platform surface matrix Markdown document. */
  surfaceMatrix: string;
  /**
   * Override path label for the hook policy file used in issue messages.
   * Defaults to {@link HOOK_POLICY_PATH}.
   */
  hookPolicyPath?: string;
  /**
   * Override path label for the Claude settings file used in issue messages.
   * Defaults to {@link CLAUDE_SETTINGS_PATH}.
   */
  claudeSettingsPath?: string;
  /**
   * Override path label for the surface matrix file used in issue messages.
   * Defaults to {@link SURFACE_MATRIX_PATH}.
   */
  surfaceMatrixPath?: string;
  /**
   * Override hook command string used in issue messages.
   * Defaults to {@link CLAUDE_HOOK_COMMAND}.
   */
  hookCommand?: string;
}

/**
 * Resolves whether the Claude hook is wired, preferring the raw text form of
 * the settings file over the parsed object form.
 *
 * @param claudeSettingsExists - Whether the settings file is present on disk.
 * @param claudeSettingsText   - Raw text content, or `null`/`undefined`.
 * @param claudeSettings       - Parsed JSON object, used as fallback.
 * @returns `true` when the hook is determinably wired.
 */
function resolveHookWired(
  claudeSettingsExists: boolean,
  claudeSettingsText: string | null | undefined,
  claudeSettings: unknown,
): boolean {
  if (!claudeSettingsExists) {
    return false;
  }
  return typeof claudeSettingsText === 'string'
    ? isClaudeHookWiredInText(claudeSettingsText)
    : isClaudeHookWired(claudeSettings);
}

/**
 * Collects portability issues when Claude Code is marked `supported` in the
 * hook policy.  Issues arise when the settings file is absent, the hook is
 * not wired, or the surface matrix does not document the native activation.
 */
function collectSupportedHookIssues(
  wired: boolean,
  claudeSettingsExists: boolean,
  hookPolicyPath: string,
  claudeSettingsPath: string,
  surfaceMatrixPath: string,
  hookCommand: string,
  surfaceMatrix: string,
): string[] {
  const issues: string[] = [];
  if (!claudeSettingsExists) {
    issues.push(
      `${hookPolicyPath}: Claude Code is marked supported but tracked project ${claudeSettingsPath} is missing`,
    );
  } else if (!wired) {
    issues.push(
      `${hookPolicyPath}: Claude Code is marked supported but ${claudeSettingsPath} does not wire Bash PreToolUse to ${hookCommand}`,
    );
  }
  if (!surfaceMatrixDescribesClaudeHook(surfaceMatrix)) {
    issues.push(
      `${surfaceMatrixPath}: Claude Code hook support is marked supported in ${hookPolicyPath} but the surface matrix does not describe the native activation`,
    );
  }
  return issues;
}

/**
 * Routes hook issue collection based on the policy status value.
 *
 * When `status` is `'supported'`, delegates to
 * {@link collectSupportedHookIssues}.  When the status is anything else but
 * the settings file already wires the hook, reports the inverse mismatch.
 */
function collectHookIssues(
  status: string | null,
  wired: boolean,
  claudeSettingsExists: boolean,
  hookPolicyPath: string,
  claudeSettingsPath: string,
  surfaceMatrixPath: string,
  hookCommand: string,
  surfaceMatrix: string,
): string[] {
  if (status === 'supported') {
    return collectSupportedHookIssues(
      wired,
      claudeSettingsExists,
      hookPolicyPath,
      claudeSettingsPath,
      surfaceMatrixPath,
      hookCommand,
      surfaceMatrix,
    );
  }
  if (claudeSettingsExists && wired) {
    return [
      `${claudeSettingsPath}: Claude Code wires ${hookCommand} but ${hookPolicyPath} does not mark claude_code as supported`,
    ];
  }
  return [];
}

/**
 * Returns all portability issues relating to Claude Code hook wiring.
 *
 * Checks that:
 * 1. When the policy marks Claude Code as `supported`, `.claude/settings.json`
 *    exists and contains a matching Bash `PreToolUse` hook.
 * 2. The surface matrix documents the native hook activation.
 * 3. The inverse: if the settings file wires the hook but the policy does not
 *    mark Claude Code as supported, that mismatch is reported.
 *
 * @param opts - Options including pre-loaded file content and path overrides.
 * @returns An array of human-readable issue strings; empty means no issues.
 */
export function getClaudeHookPortabilityIssues(opts: ClaudeHookPortabilityIssuesOptions): string[] {
  const hookPolicyPath = opts.hookPolicyPath ?? HOOK_POLICY_PATH;
  const claudeSettingsPath = opts.claudeSettingsPath ?? CLAUDE_SETTINGS_PATH;
  const surfaceMatrixPath = opts.surfaceMatrixPath ?? SURFACE_MATRIX_PATH;
  const hookCommand = opts.hookCommand ?? CLAUDE_HOOK_COMMAND;
  const claudeSettingsExists = opts.claudeSettingsExists ?? true;
  const status = getClaudeHookStatus(opts.hookPolicy);
  const wired = resolveHookWired(
    claudeSettingsExists,
    opts.claudeSettingsText ?? null,
    opts.claudeSettings,
  );
  return collectHookIssues(
    status,
    wired,
    claudeSettingsExists,
    hookPolicyPath,
    claudeSettingsPath,
    surfaceMatrixPath,
    hookCommand,
    opts.surfaceMatrix,
  );
}
