/**
 * Claude skill-permission checks for the portability validator.
 *
 * Claude Code requires every skill or command adapter to have a corresponding
 * `Skill(<name>)` entry in `permissions.allow` within `.claude/settings.json`.
 * Without that entry, Claude Code will refuse to execute the skill even when
 * it is present on disk.
 *
 * This module provides the pure function that detects missing permission
 * entries given the lists of existing adapter files and the current
 * permissions allow-list.
 */

import { CLAUDE_SETTINGS_PATH, stripDirAndExtension } from './portability-constants.js';

/**
 * Options for {@link getSkillPermissionIssues}.
 */
export interface SkillPermissionIssuesOptions {
  /**
   * Relative paths of all `.claude/commands/<name>.md` files present in the
   * repo.  Each file requires a `Skill(<name>)` entry in the permissions
   * allow-list.
   */
  claudeCommandFiles: string[];
  /**
   * Names of all subdirectories under `.claude/skills/`.  Each directory
   * requires a `Skill(<name>)` entry in the permissions allow-list.
   */
  claudeSkillDirs?: string[];
  /**
   * The raw string entries from `permissions.allow` in `.claude/settings.json`.
   * Only entries matching the `Skill(<name>)` pattern are examined.
   */
  claudeSettingsPermissions: string[];
  /**
   * Override path label for the Claude settings file used in issue messages.
   * Defaults to {@link CLAUDE_SETTINGS_PATH}.
   */
  claudeSettingsPath?: string;
}

/**
 * Returns all portability issues caused by missing `Skill()` entries in the
 * Claude Code permissions allow-list.
 *
 * A command adapter or skill directory is considered permitted when its name
 * matches the base of a `Skill(<name>)` entry in `permissions.allow`.  The
 * wildcard variant `Skill(<name>:*)` is accepted but is not required — only
 * the bare `Skill(<name>)` entry is checked.
 *
 * @param options - The command file list, skill directory list, permissions
 *   allow-list, and optional path label override.
 * @returns An array of human-readable issue strings; empty means all adapters
 *   and skills are permitted.
 */
export function getSkillPermissionIssues({
  claudeCommandFiles,
  claudeSkillDirs = [],
  claudeSettingsPermissions,
  claudeSettingsPath = CLAUDE_SETTINGS_PATH,
}: SkillPermissionIssuesOptions): string[] {
  const issues: string[] = [];

  const permittedSkills = new Set(
    claudeSettingsPermissions
      .filter((entry) => /^Skill\([^)]+\)$/u.test(entry))
      .map((entry) => entry.replace(/^Skill\(([^):]+)\)$/u, '$1'))
      .filter((name) => name.length > 0),
  );

  for (const file of claudeCommandFiles) {
    const commandName = stripDirAndExtension(file, '.md');
    if (!permittedSkills.has(commandName)) {
      issues.push(
        `${claudeSettingsPath}: Claude command adapter "${commandName}" has no Skill(${commandName}) entry in permissions.allow`,
      );
    }
  }

  for (const skillName of claudeSkillDirs) {
    if (!permittedSkills.has(skillName)) {
      issues.push(
        `${claudeSettingsPath}: Claude skill adapter "${skillName}" has no Skill(${skillName}) entry in permissions.allow`,
      );
    }
  }

  return issues;
}
