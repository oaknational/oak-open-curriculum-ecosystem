#!/usr/bin/env node

/**
 * Portability validator entry point.
 *
 * Orchestrates all cross-platform portability checks by reading the relevant
 * repo files and delegating to the pure helper modules.  Run via:
 *
 * ```sh
 * pnpm portability:check
 * pnpm portability:check --fix   # auto-write missing wrapper files
 * ```
 *
 * Exit code 0 means all checks pass; exit code 1 means at least one issue was
 * found (or `--fix` was not used to resolve missing wrappers).
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isJsonObject } from '../../core/json.js';
import { resolveRepoRoot } from '../../core/repo-root.js';
import {
  collectCanonicalSkillPaths,
  getClaudeHookPortabilityIssues,
  getReviewerAdapterParityIssues,
  getRulesIndexPortabilityIssues,
  CLAUDE_SETTINGS_PATH,
  HOOK_POLICY_PATH,
  RULES_INDEX_PATH,
  SURFACE_MATRIX_PATH,
} from './validate-portability-helpers.js';
import {
  exists,
  extractFrontmatter,
  getFrontmatterValue,
  listFiles,
  listSubdirs,
  readJson,
  readOptionalText,
  readText,
  stripFrontmatter,
  writeText,
} from './portability-fs.js';
import { practiceSkillPermissionIssues } from './skill-census.js';
import { reportPortabilityValidation } from './portability-report.js';

const repoRoot = resolveRepoRoot(import.meta.url);
const fixMode = process.argv.includes('--fix');
const writtenWrappers: string[] = [];
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

const CANONICAL_RULE_OR_SKILL_PATTERN = /\.agent\/rules\/|\.agent\/skills\//;
const cursorRules = await listFiles(repoRoot, '.cursor/rules', '.mdc');
const claudeRules = await listFiles(repoRoot, '.claude/rules', '.md');
const agentsRules = await listFiles(repoRoot, '.agents/rules', '.md');
for (const ruleFile of [...cursorRules, ...claudeRules, ...agentsRules]) {
  if (!CANONICAL_RULE_OR_SKILL_PATTERN.test(await readText(repoRoot, ruleFile))) {
    issues.push(
      `${ruleFile}: trigger does not reference a canonical rule (.agent/rules/) or skill (.agent/skills/)`,
    );
  }
}

const cursorAgentFiles = await listFiles(repoRoot, '.cursor/agents', '.md');
const claudeAgentFiles = await listFiles(repoRoot, '.claude/agents', '.md');
const codexAgentFiles = await listFiles(repoRoot, '.codex/agents', '.toml');
const canonicalAgentNames = [
  ...new Set([
    ...cursorAgentFiles.map((file) => path.basename(file, '.md')),
    ...claudeAgentFiles.map((file) => path.basename(file, '.md')),
    ...codexAgentFiles.map((file) => path.basename(file, '.toml')),
  ]),
].sort((a, b) => a.localeCompare(b));
for (const issue of getReviewerAdapterParityIssues({
  cursorAgentFiles,
  claudeAgentFiles,
  codexAgentFiles,
})) {
  issues.push(issue);
}

const canonicalRules = await listFiles(repoRoot, '.agent/rules', '.md');
const wrapperBody = (ruleName: string) => `Read and follow \`.agent/rules/${ruleName}.md\`.\n`;
for (const ruleFile of canonicalRules) {
  const ruleName = path.basename(ruleFile, '.md');
  const claudeWrapperPath = `.claude/rules/${ruleName}.md`;
  const agentsWrapperPath = `.agents/rules/${ruleName}.md`;
  if (!(await exists(repoRoot, claudeWrapperPath))) {
    if (fixMode) {
      await writeText(repoRoot, claudeWrapperPath, wrapperBody(ruleName), writtenWrappers);
    } else {
      issues.push(`.agent/rules/${ruleName}.md: missing .claude/rules/${ruleName}.md wrapper`);
    }
  }
  if (!(await exists(repoRoot, `.cursor/rules/${ruleName}.mdc`))) {
    issues.push(`.agent/rules/${ruleName}.md: missing .cursor/rules/${ruleName}.mdc trigger`);
  }
  if (!(await exists(repoRoot, agentsWrapperPath))) {
    if (fixMode) {
      await writeText(repoRoot, agentsWrapperPath, wrapperBody(ruleName), writtenWrappers);
    } else {
      issues.push(`.agent/rules/${ruleName}.md: missing .agents/rules/${ruleName}.md wrapper`);
    }
  }
}

for (const ruleFile of [...cursorRules, ...claudeRules, ...agentsRules]) {
  const contentLines = stripFrontmatter(await readText(repoRoot, ruleFile))
    .split(/\r?\n/u)
    .filter((l) => l.trim() !== '').length;
  if (contentLines > 10) {
    issues.push(
      `${ruleFile}: ${contentLines} content lines exceeds Trigger Content Contract maximum of 10`,
    );
  }
}

const rulesIndexState = await readOptionalText(repoRoot, RULES_INDEX_PATH);
for (const issue of getRulesIndexPortabilityIssues({
  canonicalRuleFiles: canonicalRules,
  rulesIndexContent: rulesIndexState.value ?? '',
  rulesIndexExists: rulesIndexState.isPresent,
})) {
  issues.push(issue);
}

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

const stats = `${validatedCanonicalPaths.length} canonical skills, ${canonicalRules.length} canonical rules, ${canonicalAgentNames.length} reviewer adapters, ${cursorRules.length} Cursor triggers, ${claudeRules.length} Claude rules, ${agentsRules.length} .agents rules`;

export { reportPortabilityValidation } from './portability-report.js';

const currentFilePath = fileURLToPath(import.meta.url);
if (process.argv[1] === currentFilePath) {
  const exitCode = reportPortabilityValidation(stats, writtenWrappers, issues);
  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}
