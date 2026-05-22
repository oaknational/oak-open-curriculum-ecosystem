#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  CLAUDE_SETTINGS_PATH,
  getClaudeHookPortabilityIssues,
  getReviewerAdapterParityIssues,
  getRulesIndexPortabilityIssues,
  getSkillPermissionIssues,
  HOOK_POLICY_PATH,
  RULES_INDEX_PATH,
  SURFACE_MATRIX_PATH,
} from './validate-portability-helpers.js';

const repoRoot = process.cwd();
const SKILLS_LOCK_PATH = 'skills-lock.json';

// --- Shared helpers (same pattern as validate-subagents.mjs) ---

async function readText(relPath) {
  return fs.readFile(path.join(repoRoot, relPath), 'utf8');
}

async function readJson(relPath) {
  return JSON.parse(await readText(relPath));
}

async function exists(relPath) {
  try {
    await fs.access(path.join(repoRoot, relPath));
    return true;
  } catch {
    return false;
  }
}

async function readOptionalText(relPath) {
  if (!(await exists(relPath))) {
    return { isPresent: false, value: null };
  }

  return { isPresent: true, value: await readText(relPath) };
}

function extractFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match?.[1] ?? null;
}

function getFrontmatterValue(frontmatter, key) {
  const escapedKey = key.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
  const regex = new RegExp(String.raw`^${escapedKey}:\s*(.+)$`, 'm');
  const match = frontmatter.match(regex);
  return match?.[1]?.trim().replaceAll(/^['"]|['"]$/g, '') ?? '';
}

async function listFiles(relDir, extension) {
  const absDir = path.join(repoRoot, relDir);
  try {
    const entries = await fs.readdir(absDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isFile() && e.name.endsWith(extension))
      .map((e) => `${relDir}/${e.name}`)
      .sort();
  } catch {
    return [];
  }
}

async function listSubdirs(relDir) {
  const absDir = path.join(repoRoot, relDir);
  try {
    const entries = await fs.readdir(absDir, { withFileTypes: true });
    return entries
      .filter((e) => e.isDirectory())
      .map((e) => e.name)
      .sort();
  } catch {
    return [];
  }
}

const issues = [];
function addIssue(message) {
  issues.push(message);
}

// --- Skill classification frontmatter (canonicals only) ---
//
// Skill adapter shape, thin-wrapper form, lock parity, and orphan detection are
// all owned by the skills-adapter generator (`pnpm skills:check`). This
// validator validates only:
//   - canonical skill frontmatter (classification: active|passive)
//   - rule wrapper / trigger / RULES_INDEX parity
//   - reviewer agent parity
//   - hook portability and Claude permission parity for oak-* skill adapters

const canonicalSkillDirs = await listSubdirs('.agent/skills');

for (const skillDir of canonicalSkillDirs) {
  const skillPath = `.agent/skills/${skillDir}/SKILL-CANONICAL.md`;
  if (!(await exists(skillPath))) continue;

  const content = await readText(skillPath);
  const frontmatter = extractFrontmatter(content);
  if (!frontmatter) {
    addIssue(`${skillPath}: missing YAML frontmatter block`);
    continue;
  }

  const classification = getFrontmatterValue(frontmatter, 'classification');
  if (!classification) {
    addIssue(`${skillPath}: missing required 'classification' frontmatter`);
  } else if (classification !== 'active' && classification !== 'passive') {
    addIssue(
      `${skillPath}: 'classification' must be 'active' or 'passive', got '${classification}'`,
    );
  }
}

// --- Rule trigger references a canonical rule or skill ---

const CANONICAL_RULE_OR_SKILL_PATTERN = /\.agent\/rules\/|\.agent\/skills\//;

const cursorRules = await listFiles('.cursor/rules', '.mdc');
for (const ruleFile of cursorRules) {
  const content = await readText(ruleFile);
  if (!CANONICAL_RULE_OR_SKILL_PATTERN.test(content)) {
    addIssue(
      `${ruleFile}: trigger does not reference a canonical rule (.agent/rules/) or skill (.agent/skills/)`,
    );
  }
}

const claudeRules = await listFiles('.claude/rules', '.md');
for (const ruleFile of claudeRules) {
  const content = await readText(ruleFile);
  if (!CANONICAL_RULE_OR_SKILL_PATTERN.test(content)) {
    addIssue(
      `${ruleFile}: trigger does not reference a canonical rule (.agent/rules/) or skill (.agent/skills/)`,
    );
  }
}

const agentsRules = await listFiles('.agents/rules', '.md');
for (const ruleFile of agentsRules) {
  const content = await readText(ruleFile);
  if (!CANONICAL_RULE_OR_SKILL_PATTERN.test(content)) {
    addIssue(
      `${ruleFile}: trigger does not reference a canonical rule (.agent/rules/) or skill (.agent/skills/)`,
    );
  }
}

// --- Cross-platform reviewer adapter parity ---

const cursorAgentFiles = await listFiles('.cursor/agents', '.md');
const claudeAgentFiles = await listFiles('.claude/agents', '.md');
const codexAgentFiles = await listFiles('.codex/agents', '.toml');
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
  addIssue(issue);
}

// --- Rule orphan detection — canonical rule with no platform adapters ---

const canonicalRules = await listFiles('.agent/rules', '.md');
for (const ruleFile of canonicalRules) {
  const ruleName = path.basename(ruleFile, '.md');
  const hasClaudeWrapper = await exists(`.claude/rules/${ruleName}.md`);
  const hasCursorTrigger = await exists(`.cursor/rules/${ruleName}.mdc`);
  const hasAgentsWrapper = await exists(`.agents/rules/${ruleName}.md`);

  if (!hasClaudeWrapper) {
    addIssue(`.agent/rules/${ruleName}.md: missing .claude/rules/${ruleName}.md wrapper`);
  }
  if (!hasCursorTrigger) {
    addIssue(`.agent/rules/${ruleName}.md: missing .cursor/rules/${ruleName}.mdc trigger`);
  }
  if (!hasAgentsWrapper) {
    addIssue(`.agent/rules/${ruleName}.md: missing .agents/rules/${ruleName}.md wrapper`);
  }
}

// --- Trigger content contract (≤10 content lines) ---

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/u, '');
}

const ruleAdapterFiles = [...cursorRules, ...claudeRules, ...agentsRules];

for (const ruleFile of ruleAdapterFiles) {
  const content = await readText(ruleFile);
  const contentLines = stripFrontmatter(content)
    .split(/\r?\n/u)
    .filter((line) => line.trim() !== '').length;

  if (contentLines > 10) {
    addIssue(
      `${ruleFile}: ${contentLines} content lines exceeds Trigger Content Contract maximum of 10`,
    );
  }
}

// --- Skills lock entry-shape consistency ---
//
// Adapter existence and symlink checks are owned by `pnpm skills:check`.
// Here we only validate that locked skills correspond to canonical skills
// and that the lock entry has the required shape.

if (await exists(SKILLS_LOCK_PATH)) {
  try {
    const skillsLock = await readJson(SKILLS_LOCK_PATH);
    const lockedSkills =
      skillsLock && typeof skillsLock === 'object' && skillsLock.skills
        ? Object.entries(skillsLock.skills)
        : [];
    const canonicalSkillSet = new Set(canonicalSkillDirs);

    for (const [skillName, entry] of lockedSkills) {
      if (!canonicalSkillSet.has(skillName)) {
        addIssue(
          `${SKILLS_LOCK_PATH}: locked skill "${skillName}" has no canonical .agent/skills/${skillName}/SKILL-CANONICAL.md`,
        );
      }

      if (!entry || typeof entry !== 'object') {
        addIssue(`${SKILLS_LOCK_PATH}: locked skill "${skillName}" entry must be an object`);
        continue;
      }
      if (typeof entry.source !== 'string' || entry.source.length === 0) {
        addIssue(`${SKILLS_LOCK_PATH}: locked skill "${skillName}" missing source`);
      }
      if (typeof entry.sourceType !== 'string' || entry.sourceType.length === 0) {
        addIssue(`${SKILLS_LOCK_PATH}: locked skill "${skillName}" missing sourceType`);
      }
      if (typeof entry.computedHash !== 'string' || entry.computedHash.length === 0) {
        addIssue(`${SKILLS_LOCK_PATH}: locked skill "${skillName}" missing computedHash`);
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown skills-lock failure.';
    addIssue(`${SKILLS_LOCK_PATH}: validation failed: ${message}`);
  }
}

// --- Codex fallback rules index parity ---

const rulesIndexState = await readOptionalText(RULES_INDEX_PATH);
for (const issue of getRulesIndexPortabilityIssues({
  canonicalRuleFiles: canonicalRules,
  rulesIndexContent: rulesIndexState.value ?? '',
  rulesIndexExists: rulesIndexState.isPresent,
})) {
  addIssue(issue);
}

// --- Hook portability parity ---

if (await exists(HOOK_POLICY_PATH)) {
  try {
    const hookPolicy = await readJson(HOOK_POLICY_PATH);
    const claudeSettingsState = await readOptionalText(CLAUDE_SETTINGS_PATH);
    const surfaceMatrix = await readText(SURFACE_MATRIX_PATH);

    for (const issue of getClaudeHookPortabilityIssues({
      hookPolicy,
      claudeSettingsText: claudeSettingsState.value,
      claudeSettingsExists: claudeSettingsState.isPresent,
      surfaceMatrix,
    })) {
      addIssue(issue);
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown hook portability failure.';
    addIssue(`Hook portability validation failed: ${message}`);
  }
}

// --- Claude skill permission parity (oak-* adapters → settings.json) ---

if (await exists(CLAUDE_SETTINGS_PATH)) {
  try {
    const claudeSettings = await readJson(CLAUDE_SETTINGS_PATH);
    const permissions = Array.isArray(claudeSettings?.permissions?.allow)
      ? claudeSettings.permissions.allow
      : [];

    const claudeSkillDirs = await listSubdirs('.claude/skills');

    for (const issue of getSkillPermissionIssues({
      claudeCommandFiles: [],
      claudeSkillDirs,
      claudeSettingsPermissions: permissions,
    })) {
      addIssue(issue);
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown skill permission check failure.';
    addIssue(`Skill permission validation failed: ${message}`);
  }
}

// --- Results ---

const stats = [
  `${canonicalSkillDirs.length} canonical skills`,
  `${canonicalRules.length} canonical rules`,
  `${canonicalAgentNames.length} reviewer adapters`,
  `${cursorRules.length} Cursor triggers`,
  `${claudeRules.length} Claude rules`,
  `${agentsRules.length} .agents rules`,
];

export function reportPortabilityValidation(validationIssues = issues) {
  if (validationIssues.length > 0) {
    console.error(
      `Portability validation failed (${validationIssues.length} issue${validationIssues.length === 1 ? '' : 's'}):`,
    );
    for (const issue of validationIssues) {
      console.error(`  - ${issue}`);
    }
    return 1;
  }

  console.log(`Portability validation passed: ${stats.join(', ')}.`);
  return 0;
}

const currentFilePath = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFilePath) {
  const exitCode = reportPortabilityValidation();
  if (exitCode !== 0) {
    process.exit(exitCode);
  }
}
