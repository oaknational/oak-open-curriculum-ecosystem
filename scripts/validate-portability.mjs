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
} from './validate-portability-helpers.mjs';

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

async function isSymlink(relPath) {
  try {
    const stat = await fs.lstat(path.join(repoRoot, relPath));
    return stat.isSymbolicLink();
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
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`^${escapedKey}:\\s*(.+)$`, 'm');
  const match = frontmatter.match(regex);
  return match?.[1]?.trim().replace(/^['"]|['"]$/g, '') ?? '';
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

function stripFrontmatter(content) {
  return content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/u, '');
}

function countNonEmptyContentLines(content) {
  return stripFrontmatter(content)
    .split(/\r?\n/u)
    .filter((line) => line.trim() !== '').length;
}

const issues = [];
function addIssue(message) {
  issues.push(message);
}

// --- Exclusion patterns ---

const SUPERSEDED_COMMANDS = new Set(['experience']);
// Files under .agent/commands/ that are shared workflow partials, not slash
// commands. They are referenced by other commands but never invoked directly,
// so they have no platform adapters by design. Each entry MUST self-declare
// its partial status in its opening paragraph.
const PARTIAL_COMMANDS = new Set(['ephemeral-to-permanent-homing']);

// Sub-agent template names (without .md extension)
const subagentTemplateNames = (await listFiles('.agent/sub-agents/templates', '.md')).map((f) =>
  path.basename(f, '.md'),
);

function isSubagentAdapter(name) {
  // Match exact template name or persona variants (e.g., "architecture-reviewer-barney" matches "architecture-reviewer")
  return subagentTemplateNames.some((t) => name === t || name.startsWith(`${t}-`));
}

// --- Check 1: Command adapters → canonical exists ---

const canonicalCommands = (await listFiles('.agent/commands', '.md')).map((f) =>
  path.basename(f, '.md'),
);
const canonicalCommandSet = new Set(canonicalCommands);

const commandPlatforms = [
  {
    label: 'Cursor',
    dir: '.cursor/commands',
    ext: '.md',
    prefix: 'jc-',
    stripPrefix: true,
  },
  {
    label: 'Claude',
    dir: '.claude/commands',
    ext: '.md',
    prefix: 'jc-',
    stripPrefix: true,
  },
  {
    label: 'Gemini',
    dir: '.gemini/commands',
    ext: '.toml',
    prefix: 'jc-',
    stripPrefix: true,
  },
];

const adapterCountsByPlatform = {};

for (const platform of commandPlatforms) {
  const files = await listFiles(platform.dir, platform.ext);
  const adapterFiles = files.filter((f) => path.basename(f).startsWith(platform.prefix));
  adapterCountsByPlatform[platform.label] = adapterFiles.length;

  for (const file of adapterFiles) {
    const basename = path.basename(file, platform.ext);
    const canonicalName = platform.stripPrefix ? basename.replace(/^jc-/, '') : basename;
    if (!canonicalCommandSet.has(canonicalName)) {
      addIssue(
        `${file}: adapter references canonical command "${canonicalName}" but .agent/commands/${canonicalName}.md does not exist`,
      );
    }
  }
}

// Codex command adapters (subdirectories)
const codexCommandDirs = (await listSubdirs('.agents/skills')).filter((d) => d.startsWith('jc-'));
adapterCountsByPlatform['Codex'] = codexCommandDirs.length;

for (const dir of codexCommandDirs) {
  const canonicalName = dir.replace(/^jc-/, '');
  const skillPath = `.agents/skills/${dir}/SKILL.md`;
  if (!(await exists(skillPath))) {
    addIssue(`${skillPath}: adapter SKILL.md missing`);
  } else if (!canonicalCommandSet.has(canonicalName)) {
    addIssue(
      `${skillPath}: adapter references canonical command "${canonicalName}" but .agent/commands/${canonicalName}.md does not exist`,
    );
  }
}

// --- Check 2: Cross-platform command count consistency ---

const platformCounts = Object.entries(adapterCountsByPlatform);
const firstCount = platformCounts[0]?.[1];
for (const [label, count] of platformCounts) {
  if (count !== firstCount) {
    addIssue(
      `Cross-platform inconsistency: ${label} has ${count} command adapters, expected ${firstCount} (matching ${platformCounts[0]?.[0]})`,
    );
  }
}

// --- Check 3: Skill adapters → canonical exists ---

const canonicalSkillDirs = await listSubdirs('.agent/skills');
const canonicalSkillSet = new Set(canonicalSkillDirs);

const skillAdapterPlatforms = [
  { label: 'Cursor', dir: '.cursor/skills' },
  { label: '.agents', dir: '.agents/skills' },
  { label: 'Claude', dir: '.claude/skills' },
];

for (const platform of skillAdapterPlatforms) {
  const dirs = await listSubdirs(platform.dir);
  for (const dir of dirs) {
    // Skip command adapters (jc-*) and sub-agent wrappers.
    if (dir.startsWith('jc-')) continue;
    if (isSubagentAdapter(dir)) continue;

    if (!canonicalSkillSet.has(dir)) {
      addIssue(
        `${platform.dir}/${dir}/SKILL.md: adapter references canonical skill "${dir}" but .agent/skills/${dir}/SKILL.md does not exist`,
      );
    }
  }
}

// --- Check 3b: Skill adapter thin-wrapper form ---

for (const platform of skillAdapterPlatforms) {
  const dirs = await listSubdirs(platform.dir);
  for (const dir of dirs) {
    if (dir.startsWith('jc-')) continue;
    if (isSubagentAdapter(dir)) continue;

    const skillPath = `${platform.dir}/${dir}/SKILL.md`;
    if (!(await exists(skillPath))) {
      addIssue(`${skillPath}: platform skill adapter missing SKILL.md`);
      continue;
    }

    const content = await readText(skillPath);
    const expectedPointer = `.agent/skills/${dir}/SKILL.md`;
    if (!content.includes(expectedPointer)) {
      addIssue(`${skillPath}: skill adapter must be a thin wrapper pointing to ${expectedPointer}`);
    }

    const contentLines = countNonEmptyContentLines(content);
    if (contentLines > 15) {
      addIssue(
        `${skillPath}: ${contentLines} content lines exceeds thin skill wrapper maximum of 15`,
      );
    }
  }
}

// --- Check 4: Skill classification frontmatter ---

for (const skillDir of canonicalSkillDirs) {
  const skillPath = `.agent/skills/${skillDir}/SKILL.md`;
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

// --- Check 5: Rule triggers reference a canonical rule or skill ---

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

// --- Check 6: Orphan detection — canonical with no adapters ---

for (const cmdName of canonicalCommands) {
  if (SUPERSEDED_COMMANDS.has(cmdName)) continue;
  if (PARTIAL_COMMANDS.has(cmdName)) continue;

  const hasAdapter =
    (await exists(`.cursor/commands/jc-${cmdName}.md`)) ||
    (await exists(`.claude/commands/jc-${cmdName}.md`)) ||
    (await exists(`.gemini/commands/jc-${cmdName}.toml`)) ||
    (await exists(`.agents/skills/jc-${cmdName}/SKILL.md`));

  if (!hasAdapter) {
    addIssue(`.agent/commands/${cmdName}.md: canonical command has no platform adapters`);
  }
}

for (const skillDir of canonicalSkillDirs) {
  for (const platform of skillAdapterPlatforms) {
    const adapterDir = `${platform.dir}/${skillDir}`;
    const adapterPath = `${platform.dir}/${skillDir}/SKILL.md`;
    if (await isSymlink(adapterDir)) {
      addIssue(
        `${adapterDir}: platform skill adapter must be a real thin-wrapper directory, not a symlink`,
      );
    }
    if (!(await exists(adapterPath))) {
      addIssue(
        `.agent/skills/${skillDir}/SKILL.md: missing ${platform.label} adapter ${adapterPath}`,
      );
    }
  }
}

// --- Check 7: Cross-platform reviewer adapter parity ---

const cursorAgentFiles = await listFiles('.cursor/agents', '.md');
const claudeAgentFiles = await listFiles('.claude/agents', '.md');
const codexAgentFiles = await listFiles('.codex/agents', '.toml');
const canonicalAgentNames = [
  ...new Set([
    ...cursorAgentFiles.map((file) => path.basename(file, '.md')),
    ...claudeAgentFiles.map((file) => path.basename(file, '.md')),
    ...codexAgentFiles.map((file) => path.basename(file, '.toml')),
  ]),
].sort();

for (const issue of getReviewerAdapterParityIssues({
  cursorAgentFiles,
  claudeAgentFiles,
  codexAgentFiles,
})) {
  addIssue(issue);
}

// --- Check 8: Rule orphan detection — canonical rule with no platform adapters ---

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

// --- Check 9: Trigger content contract (≤10 content lines) ---

const ruleAdapterFiles = [...cursorRules, ...claudeRules, ...agentsRules];

for (const ruleFile of ruleAdapterFiles) {
  const content = await readText(ruleFile);
  const contentLines = countNonEmptyContentLines(content);

  if (contentLines > 10) {
    addIssue(
      `${ruleFile}: ${contentLines} content lines exceeds Trigger Content Contract maximum of 10`,
    );
  }
}

// --- Check 9b: Skills lock consistency ---

if (await exists(SKILLS_LOCK_PATH)) {
  try {
    const skillsLock = await readJson(SKILLS_LOCK_PATH);
    const lockedSkills =
      skillsLock && typeof skillsLock === 'object' && skillsLock.skills
        ? Object.entries(skillsLock.skills)
        : [];

    for (const [skillName, entry] of lockedSkills) {
      if (!canonicalSkillSet.has(skillName)) {
        addIssue(
          `${SKILLS_LOCK_PATH}: locked skill "${skillName}" has no canonical .agent/skills/${skillName}/SKILL.md`,
        );
      }

      for (const platform of skillAdapterPlatforms) {
        const adapterDir = `${platform.dir}/${skillName}`;
        const adapterPath = `${platform.dir}/${skillName}/SKILL.md`;
        if (await isSymlink(adapterDir)) {
          addIssue(
            `${SKILLS_LOCK_PATH}: locked skill "${skillName}" adapter ${adapterDir} must not be a symlink`,
          );
        }
        if (!(await exists(adapterPath))) {
          addIssue(`${SKILLS_LOCK_PATH}: locked skill "${skillName}" missing ${adapterPath}`);
        }
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

// --- Check 10: Codex fallback rules index parity ---

const rulesIndexState = await readOptionalText(RULES_INDEX_PATH);
for (const issue of getRulesIndexPortabilityIssues({
  canonicalRuleFiles: canonicalRules,
  rulesIndexContent: rulesIndexState.value ?? '',
  rulesIndexExists: rulesIndexState.isPresent,
})) {
  addIssue(issue);
}

// --- Check 11: Hook portability parity ---

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

// --- Check 12: Skill permission parity (Claude commands → settings.json) ---

if (await exists(CLAUDE_SETTINGS_PATH)) {
  try {
    const claudeSettings = await readJson(CLAUDE_SETTINGS_PATH);
    const permissions = Array.isArray(claudeSettings?.permissions?.allow)
      ? claudeSettings.permissions.allow
      : [];

    const claudeCommandFiles = await listFiles('.claude/commands', '.md');

    const claudeSkillDirs = await listSubdirs('.claude/skills');

    for (const issue of getSkillPermissionIssues({
      claudeCommandFiles,
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
  `${canonicalCommands.length} canonical commands`,
  `${canonicalSkillDirs.length} canonical skills`,
  `${canonicalRules.length} canonical rules`,
  `${canonicalAgentNames.length} reviewer adapters`,
  `${cursorRules.length} Cursor triggers`,
  `${claudeRules.length} Claude rules`,
  `${agentsRules.length} .agents rules`,
  `${Object.values(adapterCountsByPlatform).reduce((a, b) => a + b, 0)} command adapters across ${platformCounts.length} platforms`,
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
