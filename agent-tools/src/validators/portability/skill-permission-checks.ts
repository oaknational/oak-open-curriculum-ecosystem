/**
 * Claude skill-permission checks for the portability validator.
 *
 * Claude Code requires every skill or command adapter to have a corresponding
 * `Skill(<name>)` entry in `permissions.allow` within `.claude/settings.json`.
 * Without that entry, Claude Code will refuse to execute the skill even when
 * it is present on disk.
 *
 * The census's jurisdiction is the PRACTICE CLASS only: the projections our
 * own generation writes, recognised by the class marker in their stub
 * ({@link selectPracticeSkillDirs}). Vendor-class skills installed by the
 * external skills machinery are that machinery's business — never censused,
 * whatever their name or on-disk kind (skill-class taxonomy: ADR-125).
 *
 * This module provides the pure functions that select the censused set and
 * detect missing permission entries given the adapter lists and the current
 * permissions allow-list.
 */

import { parseAdapterStubPointer } from '../../skills-adapter-generate/adapter-stub.js';
import type { FsRead } from '../../skills-adapter-generate/carriage-fs.js';
import { CLAUDE_SETTINGS_PATH, stripDirAndExtension } from './portability-constants.js';

/** Outcome of {@link selectPracticeSkillDirs}: the marker-carrying Practice
 * projections, plus any per-entry read failures the caller must surface as
 * census issues rather than swallow as "not a Practice skill". */
export interface PracticeSkillSelection {
  readonly selected: string[];
  readonly failures: string[];
}

/**
 * Select the Practice-class members from a projection root's directory
 * listing: exactly the entries whose `SKILL.md` carries the class marker
 * recording a derivation from `.agent/skills/`. Membership is proven by
 * content, never by name — a foreign directory sharing the generation
 * prefix stays out, and a projection generated under a previous prefix
 * stays in.
 *
 * @param dirNames - Immediate subdirectory names at the projection root.
 * @param readStub - Reads `<dirName>/SKILL.md` through the typed filesystem
 *   seam: `ok`/`undefined` when absent or not a regular file, `ok`/text when
 *   present, `failure` for a non-ENOENT error. A failure is NEVER read as
 *   absence — it is collected so the caller can surface it as a census issue
 *   (the false-green this closes: an unreadable entry silently becoming "not a
 *   Practice skill").
 * @returns The Practice projections, plus any per-entry read failures.
 */
export async function selectPracticeSkillDirs(
  dirNames: readonly string[],
  readStub: (dirName: string) => Promise<FsRead<string | undefined>>,
): Promise<PracticeSkillSelection> {
  const selected: string[] = [];
  const failures: string[] = [];
  for (const name of dirNames) {
    const stub = await readStub(name);
    if (stub.kind === 'failure') {
      failures.push(stub.message);
      continue;
    }
    if (stub.value !== undefined && parseAdapterStubPointer(stub.value) !== undefined) {
      selected.push(name);
    }
  }
  return { selected, failures };
}

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
   * Names of the Practice-recognised subdirectories under
   * `.claude/skills/` (the {@link selectPracticeSkillDirs} output — never
   * the raw directory listing). Each requires a `Skill(<name>)` entry in
   * the permissions allow-list; Vendor-class entries are never censused.
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
