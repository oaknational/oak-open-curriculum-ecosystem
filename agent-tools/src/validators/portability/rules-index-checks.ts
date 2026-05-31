/**
 * Rules-index and skills-lock portability checks for the portability
 * validator.
 *
 * The Codex platform cannot load `.claude/rules/` triggers, so the repo
 * maintains a Markdown fallback (`RULES_INDEX.md`) that must list every
 * canonical rule file.  This module provides checks that verify:
 *
 * - The index file exists.
 * - Every canonical `.agent/rules/<name>.md` file is listed in the index.
 * - The index does not list any non-canonical paths.
 * - The index stays within the Codex project-document byte budget.
 *
 * It also provides {@link getSkillsLockEntries}, which parses the
 * `skills-lock.json` file so the orchestrating validator can cross-reference
 * locked skills against the canonical `.agent/skills/` directory.
 */

import type { JsonObject } from '../../collaboration-state/json.js';
import { isJsonObject } from '../../collaboration-state/json.js';
import { DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES, RULES_INDEX_PATH } from './portability-constants.js';

/**
 * Options for {@link getRulesIndexPortabilityIssues}.
 */
export interface RulesIndexPortabilityIssuesOptions {
  /**
   * Repo-relative paths of every canonical rule file found under
   * `.agent/rules/`.  These paths are in the form
   * `.agent/rules/<name>.md`.
   */
  canonicalRuleFiles: string[];
  /**
   * Full text content of the rules index Markdown file.
   * Pass an empty string when the file does not exist.
   */
  rulesIndexContent: string;
  /**
   * Whether the rules index file is present on disk.
   * Defaults to `true` when not provided.
   */
  rulesIndexExists?: boolean;
  /**
   * Override path label used in issue messages.
   * Defaults to {@link RULES_INDEX_PATH}.
   */
  rulesIndexPath?: string;
  /**
   * Maximum allowed byte size for the rules index.
   * Defaults to {@link DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES}.
   */
  maxBytes?: number;
}

/**
 * Extracts every `.agent/rules/<name>.md` path referenced inside backtick
 * spans in the given Markdown text.
 *
 * @param content - The full text of the rules index file.
 * @returns Array of matched canonical rule paths.
 */
function extractCanonicalRulePaths(content: string): string[] {
  return [...content.matchAll(/`(\.agent\/rules\/[^`]+\.md)`/gu)]
    .map((match) => match[1])
    .filter((value): value is string => typeof value === 'string' && value.length > 0);
}

/**
 * Computes the symmetric difference between the canonical rule set and the set
 * of paths referenced in the rules index.
 *
 * @param canonicalRuleFiles  - All canonical `.agent/rules/<name>.md` paths.
 * @param rulesIndexContent   - Full text of the rules index.
 * @param rulesIndexPath      - Path label used in issue messages.
 * @returns An array of issue strings describing missing or extra entries.
 */
function collectRuleSetDiffs(
  canonicalRuleFiles: string[],
  rulesIndexContent: string,
  rulesIndexPath: string,
): string[] {
  const issues: string[] = [];
  const canonicalRuleSet = new Set(canonicalRuleFiles);
  const indexedRuleSet = new Set(extractCanonicalRulePaths(rulesIndexContent));

  for (const ruleFile of [...canonicalRuleSet].sort((a, b) => a.localeCompare(b))) {
    if (!indexedRuleSet.has(ruleFile)) {
      issues.push(`${rulesIndexPath}: missing canonical rule entry ${ruleFile}`);
    }
  }

  for (const indexedRuleFile of [...indexedRuleSet].sort((a, b) => a.localeCompare(b))) {
    if (!canonicalRuleSet.has(indexedRuleFile)) {
      issues.push(`${rulesIndexPath}: references non-canonical rule ${indexedRuleFile}`);
    }
  }

  return issues;
}

/**
 * Returns all portability issues relating to the Codex fallback rules index.
 *
 * Checks that:
 * 1. The index file exists.
 * 2. Every canonical rule is listed in the index (no missing entries).
 * 3. The index does not reference any non-canonical paths (no phantom entries).
 * 4. The byte size of the index does not exceed the Codex project-doc budget.
 *
 * @param opts - Options including pre-loaded content, existence flag, and
 *   configurable limits.
 * @returns An array of human-readable issue strings; empty means no issues.
 */
export function getRulesIndexPortabilityIssues(opts: RulesIndexPortabilityIssuesOptions): string[] {
  const rulesIndexExists = opts.rulesIndexExists ?? true;
  const rulesIndexPath = opts.rulesIndexPath ?? RULES_INDEX_PATH;
  const maxBytes = opts.maxBytes ?? DEFAULT_CODEX_PROJECT_DOC_MAX_BYTES;

  if (!rulesIndexExists) {
    return [`${rulesIndexPath}: missing Codex fallback rules index`];
  }

  const issues = collectRuleSetDiffs(
    opts.canonicalRuleFiles,
    opts.rulesIndexContent,
    rulesIndexPath,
  );

  const byteSize = Buffer.byteLength(opts.rulesIndexContent, 'utf8');
  if (byteSize > maxBytes) {
    issues.push(
      `${rulesIndexPath}: ${byteSize} bytes exceeds Codex project-doc budget ${maxBytes}`,
    );
  }

  return issues;
}

/**
 * Parses the `skills` map from a `skills-lock.json` value and returns it as
 * an array of `[skillName, entryObject]` pairs.
 *
 * Returns an empty array when the input is not a JSON object, when the
 * `skills` property is absent, or when `skills` is not itself a JSON object.
 *
 * @param skillsLock - The parsed JSON value of `skills-lock.json`.
 * @returns An array of `[string, JsonObject]` pairs, one per locked skill.
 */
export function getSkillsLockEntries(skillsLock: unknown): [string, JsonObject][] {
  if (!isJsonObject(skillsLock) || !isJsonObject(skillsLock['skills'])) {
    return [];
  }

  const skills = skillsLock['skills'];
  const result: [string, JsonObject][] = [];

  for (const key in skills) {
    if (!Object.prototype.hasOwnProperty.call(skills, key)) {
      continue;
    }
    const entry = skills[key];
    result.push([key, isJsonObject(entry) ? entry : {}]);
  }

  return result;
}
