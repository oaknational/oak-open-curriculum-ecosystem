#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';

const repoRoot = process.cwd();

// --- Shared helpers (same pattern as validate-subagents.mjs) ---

async function readText(relPath) {
  return fs.readFile(path.join(repoRoot, relPath), 'utf8');
}

async function exists(relPath) {
  try {
    await fs.access(path.join(repoRoot, relPath));
    return true;
  } catch {
    return false;
  }
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

const issues = [];
function addIssue(message) {
  issues.push(message);
}

// --- Exclusion patterns ---

const CLERK_SKILL_PREFIX = 'clerk';
const SUPERSEDED_COMMANDS = new Set(['experience']);

// Sub-agent template names (without .md extension)
const subagentTemplateNames = (await listFiles('.agent/sub-agents/templates', '.md')).map((f) =>
  path.basename(f, '.md'),
);

function isClerkSkill(name) {
  return name.startsWith(CLERK_SKILL_PREFIX);
}

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
  { label: 'Codex', dir: '.agents/skills' },
];

for (const platform of skillAdapterPlatforms) {
  const dirs = await listSubdirs(platform.dir);
  for (const dir of dirs) {
    // Skip Clerk plugins, command adapters (jc-*), and sub-agent wrappers
    if (isClerkSkill(dir) || dir.startsWith('jc-')) continue;
    if (isSubagentAdapter(dir)) continue;

    if (!canonicalSkillSet.has(dir)) {
      addIssue(
        `${platform.dir}/${dir}/SKILL.md: adapter references canonical skill "${dir}" but .agent/skills/${dir}/SKILL.md does not exist`,
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

// --- Check 6: Orphan detection — canonical with no adapters ---

for (const cmdName of canonicalCommands) {
  if (SUPERSEDED_COMMANDS.has(cmdName)) continue;

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
  const hasAdapter =
    (await exists(`.cursor/skills/${skillDir}/SKILL.md`)) ||
    (await exists(`.agents/skills/${skillDir}/SKILL.md`));

  if (!hasAdapter) {
    addIssue(`.agent/skills/${skillDir}/SKILL.md: canonical skill has no platform adapters`);
  }
}

// --- Check 7: Rule orphan detection — canonical rule with no platform adapters ---

const canonicalRules = await listFiles('.agent/rules', '.md');
for (const ruleFile of canonicalRules) {
  const ruleName = path.basename(ruleFile, '.md');
  const hasClaudeWrapper = await exists(`.claude/rules/${ruleName}.md`);
  const hasCursorTrigger = await exists(`.cursor/rules/${ruleName}.mdc`);

  if (!hasClaudeWrapper && !hasCursorTrigger) {
    addIssue(
      `.agent/rules/${ruleName}.md: canonical rule has no platform adapters (missing both .claude/rules/ and .cursor/rules/)`,
    );
  } else if (!hasClaudeWrapper) {
    addIssue(`.agent/rules/${ruleName}.md: missing .claude/rules/${ruleName}.md wrapper`);
  } else if (!hasCursorTrigger) {
    addIssue(`.agent/rules/${ruleName}.md: missing .cursor/rules/${ruleName}.mdc trigger`);
  }
}

// --- Check 8: Trigger content contract (≤10 content lines) ---

for (const ruleFile of cursorRules) {
  const content = await readText(ruleFile);
  const lines = content.split('\n');
  let inFrontmatter = false;
  let frontmatterCount = 0;
  let contentLines = 0;

  for (const line of lines) {
    if (line.trim() === '---') {
      frontmatterCount++;
      inFrontmatter = frontmatterCount < 2;
      continue;
    }
    if (inFrontmatter) continue;
    if (frontmatterCount >= 2 && line.trim() !== '') {
      contentLines++;
    }
  }

  if (contentLines > 10) {
    addIssue(
      `${ruleFile}: ${contentLines} content lines exceeds Trigger Content Contract maximum of 10`,
    );
  }
}

// --- Results ---

if (issues.length > 0) {
  console.error(
    `Portability validation failed (${issues.length} issue${issues.length === 1 ? '' : 's'}):`,
  );
  for (const issue of issues) {
    console.error(`  - ${issue}`);
  }
  process.exit(1);
}

const stats = [
  `${canonicalCommands.length} canonical commands`,
  `${canonicalSkillDirs.length} canonical skills`,
  `${canonicalRules.length} canonical rules`,
  `${cursorRules.length} Cursor triggers`,
  `${claudeRules.length} Claude rules`,
  `${Object.values(adapterCountsByPlatform).reduce((a, b) => a + b, 0)} command adapters across ${platformCounts.length} platforms`,
];

console.log(`Portability validation passed: ${stats.join(', ')}.`);
