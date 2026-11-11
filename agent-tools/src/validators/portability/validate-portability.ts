#!/usr/bin/env node

/**
 * Portability validator entry point.
 *
 * Orchestrates all cross-platform portability checks by reading the relevant
 * repo files and delegating to the pure helper modules.  Run via:
 *
 * ```sh
 * pnpm portability:check
 * pnpm portability:fix   # regenerate the rule projections, the sub-agent adapters
 *                        # and the Codex registry's blocks: write missing and
 *                        # drifted ones, remove stale ones
 * ```
 *
 * Exit code 0 means all checks pass; exit code 1 means at least one issue was
 * found (or `--fix` was not used to regenerate the projections).
 */

import { fileURLToPath } from 'node:url';

import { isJsonObject } from '../../core/json.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import {
  collectCanonicalSkillPaths,
  getClaudeHookPortabilityIssues,
  rulesIndexBudgetIssues,
  CLAUDE_SETTINGS_PATH,
  HOOK_POLICY_PATH,
  RULES_INDEX_PATH,
  SURFACE_MATRIX_PATH,
} from './validate-portability-helpers.js';
import {
  exists,
  extractFrontmatter,
  getFrontmatterValue,
  listSubdirs,
  readJson,
  readOptionalText,
  readText,
} from './portability-fs.js';
import { practiceSkillPermissionIssues } from './skill-census.js';
import { reportPortabilityValidation } from './portability-report.js';
import { validateRuleProjections } from './rule-projection-validation.js';
import { realRuleProjectionFs } from './rule-projection-fs.js';
import { readEntry } from './rule-surface-fs.js';
import { validateSubagentProjections } from './subagent-projection-validation.js';

// projectDir is explicitly disabled: this validator reads and, under `--fix`,
// writes the tree it runs inside. The CLAUDE_PROJECT_DIR leg would rebind a
// worktree invocation to the primary checkout and regenerate the wrong estate.
const repoRoot = resolveRepoRoot(import.meta.url, { projectDir: undefined });
const fixMode = process.argv.includes('--fix');
const writtenPaths: string[] = [];
const issues: string[] = [];

const { canonicalPaths: discoveredCanonicalPaths } = await collectCanonicalSkillPaths({
  listSubdirs: (relPath) => listSubdirs(repoRoot, relPath),
  exists: (relPath) => exists(repoRoot, relPath),
});
const validatedCanonicalPaths: string[] = [];

async function validateCanonicalFrontmatter(skillPath: string): Promise<void> {
  const content = await readText(repoRoot, skillPath);
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    issues.push(`${skillPath}: missing YAML frontmatter block`);
    return;
  }
  validatedCanonicalPaths.push(skillPath);
  const classification = getFrontmatterValue(frontmatter, 'classification');
  if (!classification) {
    issues.push(`${skillPath}: missing required 'classification' frontmatter`);
  } else if (classification !== 'active' && classification !== 'passive') {
    issues.push(
      `${skillPath}: 'classification' must be 'active' or 'passive', got '${classification}'`,
    );
  }
}

// The ratified skills-estate shape is three tiers, closed: flat
// (`<id>/`), concern member (`<concern>/<id>/`), and domain member
// (`<concern>/<domain>/<id>/`, owner-ruled 2026-08-10). The shared walker
// owns the traversal so this validator and the lock cross-reference see
// the same corpus; entries with no canonical at any tier are the adapter
// checker's loud-skip territory, not this validator's.
for (const skillPath of discoveredCanonicalPaths) {
  await validateCanonicalFrontmatter(skillPath);
}

// The rule projections — RULES_INDEX.md and the Cursor, Claude and `.agents` rule
// adapters — are rendered from each rule's frontmatter declaration and compared byte
// for byte; `--fix` regenerates them. Nothing on those surfaces is hand-kept.
const projectionFs = realRuleProjectionFs(repoRoot);
const ruleProjections = await validateRuleProjections(fixMode, projectionFs);
issues.push(...ruleProjections.issues);
writtenPaths.push(...ruleProjections.written);

// The sub-agent adapters — the Cursor, Claude, Codex and Gemini files under each
// platform's agents directory, and the `[agents."<name>"]` blocks of the Codex registry after its
// hand-kept head — are rendered from each template's frontmatter declaration and
// compared byte for byte; `--fix` regenerates them. The adapter files and the registry tail
// are generated whole; the registry head above the first block is the host's own settings,
// kept verbatim (closure item 6, 2b-ii).
const subagentProjections = await validateSubagentProjections(fixMode, projectionFs);
issues.push(...subagentProjections.issues);
writtenPaths.push(...subagentProjections.written);
const removedProjections = [...ruleProjections.removed, ...subagentProjections.removed];

// The index's presence and rows are the projection leg's; the Codex byte budget is the
// one check the rendered bytes cannot answer for themselves, read through the same
// no-follow reader the leg uses, so a link the leg refused is never read here.
issues.push(...rulesIndexBudgetIssues(await readEntry(repoRoot, RULES_INDEX_PATH)));

if (await exists(repoRoot, HOOK_POLICY_PATH)) {
  try {
    const claudeSettingsState = await readOptionalText(repoRoot, CLAUDE_SETTINGS_PATH);
    for (const issue of getClaudeHookPortabilityIssues({
      hookPolicy: await readJson(repoRoot, HOOK_POLICY_PATH),
      claudeSettingsText: claudeSettingsState.value,
      claudeSettingsExists: claudeSettingsState.isPresent,
      surfaceMatrix: await readText(repoRoot, SURFACE_MATRIX_PATH),
    })) {
      issues.push(issue);
    }
  } catch (error) {
    issues.push(
      `Hook portability validation failed: ${error instanceof Error ? error.message : 'Unknown hook portability failure.'}`,
    );
  }
}

if (await exists(repoRoot, CLAUDE_SETTINGS_PATH)) {
  try {
    const claudeSettings = await readJson(repoRoot, CLAUDE_SETTINGS_PATH);
    const allowList =
      isJsonObject(claudeSettings) &&
      isJsonObject(claudeSettings['permissions']) &&
      Array.isArray(claudeSettings['permissions']['allow'])
        ? claudeSettings['permissions']['allow']
        : [];
    const permissions = allowList.filter((e): e is string => typeof e === 'string');
    issues.push(...(await practiceSkillPermissionIssues(repoRoot, permissions)));
  } catch (error) {
    issues.push(
      `Skill permission validation failed: ${error instanceof Error ? error.message : 'Unknown skill permission check failure.'}`,
    );
  }
}

const ruleStats =
  ruleProjections.issues.length === 0
    ? `${ruleProjections.canonicalRuleCount} canonical rules with their index and three adapter projections recomputed`
    : `${ruleProjections.canonicalRuleCount} canonical rules (projection leg refused)`;
const subagentStats =
  subagentProjections.issues.length === 0
    ? `${subagentProjections.templateCount} sub-agent templates with their four adapter surfaces and the Codex registry's blocks recomputed`
    : `${subagentProjections.templateCount} sub-agent templates (adapter leg refused)`;
const removedStats =
  removedProjections.length > 0
    ? `, ${removedProjections.length} stale files removed from the generated surfaces`
    : '';
const stats = `${validatedCanonicalPaths.length} canonical skills, ${ruleStats}, ${subagentStats}${removedStats}`;

export { reportPortabilityValidation } from './portability-report.js';

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  const exitCode = reportPortabilityValidation(stats, writtenPaths, issues);
  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}
